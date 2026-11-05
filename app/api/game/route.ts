import {getDb} from '@/db';
import {rooms} from '@/db/schema';
import {eq,and,lt} from 'drizzle-orm';
import {memberTokens} from '@/lib/room-members';
import {previewAim,TANK_COLORS,type TankColor,act,createGame,selectPlayerColor,forfeit,expireTurn,turnDuration,playerView,type Ammo,type Bonus,type Game} from '@/lib/game';
export async function POST(req:Request){try{
 const b=await req.json() as {op:string;angle?:number;round?:number;mode?:'pvp'|'coop';color?:string;code?:string;token?:string;version?:number;action:{type:string;x?:number;y?:number;ammo?:Ammo;bonus?:Bonus}},db=getDb();
 if(b.op==='create'){
  const code=crypto.randomUUID().slice(0,6).toUpperCase(),token=crypto.randomUUID(),g=createGame(b.mode==='coop'?'coop':'pvp',1);selectPlayerColor(g,0,b.color??'teal');g.lobby=true;g.colorReady=[true];delete g.turnEndsAt;delete g.offers;delete g.choices;
  await db.insert(rooms).values({code,p0:token,lastActive:Date.now(),state:JSON.stringify(g)});return Response.json({code,token,player:0});
 }
 const code=String(b.code||'').toUpperCase();let row=(await db.select().from(rooms).where(eq(rooms.code,code)))[0];if(!row)return Response.json({error:'Room not found. Check the six-character code.'},{status:404});
 let tokens=memberTokens(row),g:Game=JSON.parse(row.state);
 if(b.op==='join'){
  if(!g.lobby)throw Error('This match has already started. Join a new room.');if(g.winner!==null||g.departed)throw Error('This room has closed.');if(tokens.length>=4)throw Error('This room is full (four players).');
  const token=crypto.randomUUID(),p=tokens.length,fresh=createGame(g.mode??'pvp',p+1);fresh.playerColors=g.playerColors?.slice();const available=(Object.keys(TANK_COLORS) as TankColor[]).find(c=>!fresh.playerColors?.includes(c));selectPlayerColor(fresh,p,available);fresh.colorReady=[...(g.colorReady??tokens.map(()=>true)),false];fresh.lobby=true;delete fresh.turnEndsAt;delete fresh.offers;delete fresh.choices;
  const updated=await db.update(rooms).set({p1:JSON.stringify([...tokens.slice(1),token]),state:JSON.stringify(fresh),version:row.version+1}).where(and(eq(rooms.code,code),eq(rooms.version,row.version))).returning();if(!updated.length)throw Error('Someone just joined. Please try joining again.');return Response.json({code,token,player:p});
 }
 const p=tokens.indexOf(b.token??'');if(p<0)return Response.json({error:'Invalid player session.'},{status:403});
 if(b.op==='state'&&row.lastActive<Date.now()-30000&&!g.departed&&!g.leftPlayers?.includes(p))await db.update(rooms).set({lastActive:Date.now()}).where(and(eq(rooms.code,code),lt(rooms.lastActive,Date.now()-30000)));
 async function write(state:Game){const updated=await db.update(rooms).set({state:JSON.stringify(state),version:row.version+1}).where(and(eq(rooms.code,code),eq(rooms.version,row.version))).returning();if(!updated.length)throw Error('Match updated. Try again.');row=updated[0];g=state;}
 if(b.op==='color'){
  if(!g.lobby||g.departed)throw Error('Colors can only be selected in an open lobby.');selectPlayerColor(g,p,b.color);g.colorReady??=tokens.map(()=>true);g.colorReady[p]=true;await write(g);
 }else if(b.op==='start'){
  if(p!==0)throw Error('Only the host can start.');if(!g.lobby||g.departed)throw Error('This lobby is not available.');if(tokens.length<(g.mode==='coop'?1:2))throw Error('PvP needs at least two players.');if(g.colorReady?.some(v=>!v))throw Error('Wait for everyone to confirm a color.');
  const fresh=createGame(g.mode??'pvp',tokens.length);fresh.playerColors=g.playerColors?.slice();fresh.lobby=false;if(fresh.mode!=='coop')fresh.turnEndsAt=Date.now()+turnDuration(fresh);await write(fresh);
 }else if(b.op==='leave'){
  if(g.lobby){g.departed=true;g.winner=-1;g.log='A player left the lobby. Please create a new room.';await write(g);}else await write(forfeit(g,p));return Response.json({left:true});
 }else{
  if(!g.lobby&&tokens.length>=(g.mode==='coop'?1:2)){const after=expireTurn(g);if(after!==g)await write(after);}
  if(b.op==='aim'){await write(previewAim(g,p,b.angle??NaN,b.round??-1));}
  if(b.op==='act'){if(g.leftPlayers?.includes(p))throw Error('You have left this match.');if(g.lobby||tokens.length<(g.mode==='coop'?1:2))throw Error('Wait for the host to start.');if(b.version!==row.version)throw Error('Match updated. Try your action again.');await write(act(g,p,b.action));}
 }
 return Response.json({state:playerView(g,p),version:row.version,ready:!g.lobby&&tokens.length>=(g.mode==='coop'?1:2),player:p,serverNow:Date.now()});
}catch(e){return Response.json({error:e instanceof Error?e.message:'Unable to connect.'},{status:400});}}
