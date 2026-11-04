export const TANK_COLORS={teal:{name:'Teal',body:'#94dfc2',turret:'#4f947c',light:'#b7f8dc'},amber:{name:'Amber',body:'#eeb27e',turret:'#ae784a',light:'#ffd4a4'},violet:{name:'Violet',body:'#c0a0ed',turret:'#8058ad',light:'#e4cfff'},blue:{name:'Blue',body:'#82b9ee',turret:'#487dad',light:'#b8dfff'}};
export type TankColor=keyof typeof TANK_COLORS;
export function playerColor(g:Game,p:number){return TANK_COLORS[g.playerColors?.[p]??(['teal','amber','violet','blue'] as TankColor[])[p]];}
export function selectPlayerColor(g:Game,p:number,color:unknown){
 if(typeof color!=='string'||!Object.hasOwn(TANK_COLORS,color))throw Error('Choose a valid tank color.');
 const colors=g.playerColors??(['teal','amber','violet','blue'] as TankColor[]).slice(0,g.tanks.length);
 if(colors.some((c,i)=>i!==p&&c===color))throw Error('That color is taken. Choose another tank color.');
 colors[p]=color as TankColor;
 g.playerColors=colors;
}
export const WALLS:Wall[] = [{x:210,y:80,w:40,h:160},{x:550,y:260,w:40,h:160},{x:350,y:190,w:100,h:35},{x:350,y:310,w:100,h:35},{x:120,y:340,w:80,h:30},{x:600,y:130,w:80,h:30},{x:385,y:240,w:30,h:40}];
export type Wall={x:number;y:number;w:number;h:number;secret?:boolean;arenaBoundary?:boolean};
export const BORDER:Wall[]=[{x:0,y:0,w:800,h:8},{x:0,y:492,w:800,h:8},{x:0,y:8,w:8,h:484},{x:792,y:8,w:8,h:484}];
export function arenaSize(walls:Wall[]=WALLS){const bottom=walls.find(w=>w.arenaBoundary&&w.y>0&&w.w>w.h);return bottom?{width:bottom.w,height:bottom.y+bottom.h}:{width:800,height:500};}
export function arenaBorder(walls:Wall[]=WALLS){return walls.some(w=>w.arenaBoundary)?walls.filter(w=>w.arenaBoundary):BORDER;}
function boundary(width:number,height:number):Wall[]{return [{x:0,y:0,w:width,h:8},{x:0,y:height-8,w:width,h:8},{x:0,y:8,w:8,h:height-16},{x:width-8,y:8,w:8,h:height-16}].map(w=>({...w,arenaBoundary:true}));}
export const BUDGET=180, R=17;
export const TURN_MS=60000;
export function turnDuration(g:Game){return TURN_MS;}
export const PLAYER_HP=200, WAVE_REPAIR=40;
export const ENEMY_TYPES={circle:{name:'Scout',hp:60,shield:0,move:120,damage:30},triangle:{name:'Striker',hp:80,shield:25,move:60,damage:40},square:{name:'Heavy',hp:120,shield:50,move:35,damage:50}};
export type EnemyType=keyof typeof ENEMY_TYPES;
export function enemyLineup(wave:number):EnemyType[]{
 if(wave<=1)return ['circle','circle'];
 if(wave===2)return ['circle','circle','triangle'];
 if(wave===3)return ['circle','triangle','circle','triangle'];
 if(wave===4)return ['circle','triangle','circle','triangle','square'];
 if(wave===5)return ['circle','triangle','triangle','square','square'];
 return ['triangle','square','triangle','square','square'];
}
export const bounceDamage=(bounces:number)=>[30,40,55,70,85,100][Math.max(0,Math.min(5,Math.floor(bounces)))];
export type Tank={enemyType?:EnemyType;shield?:number;moveBonus?:number;maxHp?:number;x:number;y:number;hp:number;angle:number;hidden?:boolean};
export type Ammo='normal'|'bank'|'spread'|'piercing'|'chain'|'bomb'|'cluster'|'longshot'|'wmd';
export type Stock={bank:number;spread:number;piercing?:number;chain?:number;bomb?:number;cluster?:number;longshot?:number;wmd?:number};
export type Bonus='heal'|'shield'|'mobility'|Exclude<Ammo,'normal'>;
export type Pickup={id:number;x:number;y:number;kind:'heal'|'shield'|Exclude<Ammo,'normal'>};
export const movementBudget=(t:Tank)=>BUDGET+(t.moveBonus??0);
export const BONUS_LABELS:Record<Bonus,string>={heal:'Repair +50 HP · instant, max 200',shield:'Shield +25 · persists until absorbed, max 50',mobility:'Movement +40 each turn · this level',bank:'Bank +1 round · kept until used',spread:'Spread +1 round · kept until used',piercing:'Piercing +1 round · kept until used',chain:'Chain +1 round · kept until used',bomb:'Bomb +1 round · kept until used',cluster:'Cluster +1 round · kept until used',longshot:'Longshot +1 round · full-distance aiming guide',wmd:'WMD +1 round · blast, fragments, chain · 3 bounces'};
export type Impact={shield?:number;damage?:number;at:number;x:number;y:number;kind:'tank'|'enemy'|'wall';index:number;hp?:number;destroyed?:boolean};
export type CombatStats={shells:number;hits:number;kills:number;misses:number;friendlyHits:number;selfHits:number};
export const emptyStats=():CombatStats=>({shells:0,hits:0,kills:0,misses:0,friendlyHits:0,selfHits:0});
export type Game={coopHumanTurns?:number;enemyAim?:{index:number;from:number;to:number;start:number;duration:number};enemyTurnLost?:boolean;colorReady?:boolean[];lobby?:boolean;leftPlayers?:number[];viewTracks?:{player:number;frames:{at:number;tank:Tank}[]}[];playerColors?:TankColor[];pickupNotices?:{player:number;text:string;at:number}[];upgrades?:boolean;pickups?:Pickup[];lastDropRound?:number;offers?:Bonus[][];choices?:(Bonus|null)[];bursts?:{x:number;y:number;at:number;radius:number}[];healthVersion?:2;stats?:{total:CombatStats[];wave:CombatStats[]};enemyCursor?:number;activeEnemy?:number;rematchVotes?:Record<number,boolean>;departed?:boolean;matchNumber?:number;viewTrack?:{player:number;frames:{at:number;tank:Tank}[]};ammoStock?:Stock[];enemyMoves?:{index:number;path:{x:number;y:number}[];start:number;duration:number}[];explored?:number[][];reveals?:{player:number;expires:number;startAt?:number;duration?:number;path:{x:number;y:number}[]}[];flashes?:{x:number;y:number;until:number;player:number}[];movement?:{player:number;from:Tank;start:number;duration:number};resolutionUntil?:number;deferredNext?:boolean;nextLevelAt?:number;animation?:{start:number;before:{tanks:Tank[];enemies?:Tank[];walls:Wall[]};impacts:Impact[]};mode?:'pvp'|'coop';wave?:number;enemies?:Tank[];shots?:NonNullable<Game['shot']>[];buildDoneRound?:number;turnEndsAt?:number;walls?:Wall[];fired?:boolean;tanks:Tank[];turn:number;used:number;round:number;winner:number|null;log:string;shot?:{style?:string;player?:number;x:number;y:number;ex:number;ey:number;id:number;clipped?:boolean;startAt?:number;duration?:number;path?:{x:number;y:number}[]}};
export function initial(randomize=false):Game{return {...(randomize?{walls:randomWalls()}:{}),fired:false,tanks:[{x:90,y:250,hp:3,angle:0},{x:710,y:250,hp:3,angle:Math.PI}],turn:0,used:0,round:1,winner:null,log:'Commanders ready. Room creator moves first.'};}
export function clear(x:number,y:number,walls:Wall[]=WALLS){const size=arenaSize(walls);return x>=R+8&&x<=size.width-8-R&&y>=R+8&&y<=size.height-8-R&&!walls.some(w=>x>w.x-R&&x<w.x+w.w+R&&y>w.y-R&&y<w.y+w.h+R);}
export function route(t:Tank,x:number,y:number,other:Tank,walls:Wall[]=WALLS){const d=Math.hypot(x-t.x,y-t.y);for(let s=0;s<=Math.ceil(d);s++){const f=s/Math.max(1,Math.ceil(d)),px=t.x+(x-t.x)*f,py=t.y+(y-t.y)*f;if(!clear(px,py,walls)||Math.hypot(px-other.x,py-other.y)<R*2)return false;}return true;}
// One collision primitive serves guides, bank shots and authoritative damage.
function ray(origin:{x:number;y:number},dx:number,dy:number,targets:Tank[],walls:Wall[]){
 let distance=Infinity,nx=0,ny=0,hitTank=-1;
 for(const w of [...(walls.some(w=>w.arenaBoundary)?[]:BORDER),...walls]){
  let near=-Infinity,far=Infinity,wx=0,wy=0;
  for(const [o,d,lo,hi,axis] of [[origin.x,dx,w.x,w.x+w.w,0],[origin.y,dy,w.y,w.y+w.h,1]]){
   if(Math.abs(d)<1e-10){if(o<lo||o>hi){far=-Infinity;break;}continue;}
   const a=(lo-o)/d,b=(hi-o)/d,entry=Math.min(a,b),exit=Math.max(a,b);
   if(entry>near+1e-7){near=entry;wx=axis===0?-Math.sign(d):0;wy=axis===1?-Math.sign(d):0;}
   else if(Math.abs(entry-near)<1e-7){if(axis===0)wx=-Math.sign(d);else wy=-Math.sign(d);}
   far=Math.min(far,exit);
  }
  if(far>=Math.max(0,near)&&near>=-1e-7){const d=Math.max(0,near);if(d<distance-1e-7){distance=d;nx=wx;ny=wy;}else if(Math.abs(d-distance)<1e-7){nx=wx||nx;ny=wy||ny;}}
 }
 targets.forEach((tank,index)=>{const ox=origin.x-tank.x,oy=origin.y-tank.y,b=ox*dx+oy*dy,c=ox*ox+oy*oy-R*R,disc=b*b-c;if(disc<0)return;const d=-b-Math.sqrt(disc);if(d>=0&&d<distance-1e-7){distance=d;hitTank=index;}});
 if(!Number.isFinite(distance))distance=0;
 return {ex:origin.x+dx*distance,ey:origin.y+dy*distance,distance,nx,ny,hitTank};
}
export function traceShot(t:Tank,x:number,y:number,other:Tank,walls:Wall[]=WALLS){
 const a=Math.atan2(y-t.y,x-t.x),r=ray(t,Math.cos(a),Math.sin(a),[other],walls);return {...r,hit:r.hitTank===0};
}
export function bankShot(t:Tank,x:number,y:number,other:Tank,walls:Wall[]=WALLS){
 const a=Math.atan2(y-t.y,x-t.x);let dx=Math.cos(a),dy=Math.sin(a),origin={x:t.x,y:t.y};const path=[origin];let hitTank=-1;
 for(let leg=0;leg<2;leg++){
  const r=ray(origin,dx,dy,leg===0?[other]:[other,t],walls);path.push({x:r.ex,y:r.ey});
  if(r.hitTank!==-1){hitTank=r.hitTank;break;}
  if(leg===1||r.distance===0)break;
  if(r.nx)dx=-dx;if(r.ny)dy=-dy;
  origin={x:r.ex+dx*.001,y:r.ey+dy*.001};
 }
 const end=path[path.length-1];return {ex:end.x,ey:end.y,path,hitTank};
}
export const AIM_GUIDE_LENGTH=120; // Three of the arena's 40-unit grid squares.
export function validAimPoint(t:Tank,x:number,y:number){
 const distance=Math.hypot(x-t.x,y-t.y);
 return Number.isFinite(distance)&&distance>=1&&distance<=AIM_GUIDE_LENGTH+1e-8;
}
export function aimGuide(t:Tank,x:number,y:number,other:Tank,walls:Wall[]=WALLS,ammo:Ammo='normal'){
 const impact=traceShot(t,x,y,other,walls),distance=Math.min(ammo==='longshot'?Infinity:AIM_GUIDE_LENGTH,impact.distance),angle=Math.atan2(y-t.y,x-t.x);
 return {ex:t.x+Math.cos(angle)*distance,ey:t.y+Math.sin(angle)*distance};
}
function living(g:Game){return g.tanks.map((t,i)=>t.hp>0?i:-1).filter(i=>i>=0);}
function nextLiving(g:Game,p:number){for(let n=1;n<=g.tanks.length;n++){const i=(p+n)%g.tanks.length;if(g.tanks[i].hp>0)return i;}return p;}
function checkWinner(g:Game){const alive=living(g);if(g.mode==='coop'){if(!alive.length)g.winner=2;}else if(alive.length<=1){g.winner=alive[0]??-1;g.log=alive.length?`${playerColor(g,alive[0]).name} wins!`:'Draw — all tanks destroyed.';}}
export function forfeit(state:Game,p:number):Game{
 const g=structuredClone(state);g.departed=true;g.leftPlayers=[...new Set([...(g.leftPlayers??[]),p])];g.tanks[p].hp=0;
 if(g.animation){g.animation.before.tanks[p].hp=0;g.animation.impacts=g.animation.impacts.filter(h=>h.kind!=='tank'||h.index!==p);}
 if(g.winner!==null)return g;checkWinner(g);
 if(g.offers&&g.choices){g.choices[p]='heal';if(g.choices.every(Boolean))delete g.offers;}
 if(g.winner===null&&g.turn===p&&!g.deferredNext){g.turn=nextLiving(g,p);g.used=0;g.fired=false;if(g.mode!=='coop')g.turnEndsAt=Math.max(Date.now(),g.resolutionUntil??0)+TURN_MS;}
 g.log=`${playerColor(g,p).name} left the match.`;return g;
}
function next(g:Game,completedHumanTurn=true){
 if(g.mode==='coop'){
  delete g.turnEndsAt;
  if(g.tanks.every(t=>t.hp<=0)){g.winner=2;g.log='Team defeated.';return;}
  if(completedHumanTurn)g.coopHumanTurns=(g.coopHumanTurns??0)+1;
  enemyPhase(g);if(g.winner!==null||g.nextLevelAt)return;
  if(completedHumanTurn)maybeCoopDrop(g);
  g.turn=nextLiving(g,g.turn);g.round++;
  g.used=0;g.fired=false;return;
 }
 g.turn=nextLiving(g,g.turn);g.used=0;g.fired=false;g.round++;maybeDrop(g);g.turnEndsAt=Math.max(Date.now(),g.resolutionUntil??0)+turnDuration(g);
}
function actInternal(state:Game,p:number,a:{type:string;x?:number;y?:number;ammo?:Ammo;bonus?:Bonus}):Game{const g=structuredClone(state);if(g.lobby)throw Error('Wait for the host to start.');if(g.nextLevelAt||g.deferredNext||(g.resolutionUntil??0)>Date.now())throw Error('Wait for the action to finish.');if(g.winner===null&&g.turnEndsAt!==undefined&&Date.now()>=g.turnEndsAt)throw Error('Time is up. Waiting for the next turn.');if(a.type==='rematchYes'||a.type==='rematchNo'){
 if(g.winner===null)throw Error('Finish the match before voting.');if(g.departed)throw Error('A player left. Create a new room.');
 if(Object.values(g.rematchVotes??{}).includes(false))throw Error('Rematch declined. Create a new room to play.');
 g.rematchVotes??={};g.rematchVotes[p]=a.type==='rematchYes';
 if(g.tanks.every((_,i)=>g.rematchVotes?.[i])){const fresh=createGame(g.mode??'pvp',g.tanks.length);fresh.playerColors=g.playerColors?.slice();fresh.matchNumber=(g.matchNumber??1)+1;if(fresh.mode!=='coop'){fresh.turn=(fresh.matchNumber-1)%g.tanks.length;fresh.turnEndsAt=Date.now()+TURN_MS;}fresh.log='Rematch! New arena and fresh supplies.';return fresh;}
 g.log=a.type==='rematchNo'?'Rematch declined.':'Rematch vote received. Waiting for the other player.';return g;
 }if(g.winner!==null)throw Error('This duel is over. Create a new room to play again.');if(g.offers){if(a.type!=='bonus')throw Error('All players must choose a bonus.');if(g.choices?.[p])throw Error('Bonus already selected.');if(!a.bonus||!g.offers[p].includes(a.bonus))throw Error('Choose one of your offered cards.');applyBonus(g,p,a.bonus);g.choices??=g.tanks.map(()=>null);g.choices[p]=a.bonus;if(g.choices.every(Boolean)){delete g.offers;g.log='Bonuses selected. First commander moves.';}return g;}if(g.turn!==p)throw Error('Wait for your turn.');const t=g.tanks[p];
if(t.hp<=0)throw Error('Tank eliminated. Spectate until your teammate clears the wave.');
if(a.type==='skipBuild'){if(!buildAvailable(g))throw Error('Building is not available this turn.');g.buildDoneRound=g.round;g.log='Build skipped. Move or aim.';return g;}
if(a.type==='build'){if(!buildAvailable(g))throw Error('Building is not available this turn.');const block={x:a.x!,y:a.y!,w:40,h:40};const issue=buildError(g,block);if(issue)throw Error(issue);g.walls=[...(g.walls??WALLS),block];g.buildDoneRound=g.round;g.log='Cover added. Move or aim.';return g;}
if(buildAvailable(g)&&a.type!=='end')throw Error('Place a block or skip building first.');
if(a.type==='end'){g.log='Turn ended. Opponent is up.';next(g);return g;}
if(!Number.isFinite(a.x)||!Number.isFinite(a.y))throw Error('Choose a point in the arena.');const x=a.x!,y=a.y!;
if(a.type==='move'){delete g.activeEnemy;const d=Math.hypot(x-t.x,y-t.y);if(d<1||d>movementBudget(t)-g.used+0.00001)throw Error('Destination exceeds your remaining movement.');if(!route(t,x,y,{x:-1000,y:-1000,hp:0,angle:0},g.walls??WALLS)||g.tanks.some((v,i)=>i!==p&&v.hp>0&&!route(t,x,y,v,g.walls??WALLS))||(g.enemies??[]).some(e=>e.hp>0&&!route(t,x,y,e,g.walls??WALLS)))throw Error('Path blocked. Move around the cover in shorter steps.');delete g.animation;g.movement={player:p,from:{...t},start:Date.now()+120,duration:Math.max(250,d/150*1000)};g.resolutionUntil=g.movement.start+g.movement.duration;if(g.turnEndsAt)g.turnEndsAt+=g.resolutionUntil-Date.now();t.angle=Math.atan2(y-t.y,x-t.x);collectPickups(g,p,t,{x,y});t.x=x;t.y=y;g.used+=d;g.log=g.fired?'Position secured. Keep moving or end your turn.':'Position secured. Move again or fire.';if(g.fired&&g.used>=movementBudget(t)-0.01)g.deferredNext=true;return g;}
if(a.type==='fire'){delete g.activeEnemy;if(a.ammo&&!['normal','bank','spread','piercing','chain','bomb','cluster','longshot','wmd'].includes(a.ammo))throw Error('Unknown ammunition.');if(g.fired)throw Error('You have already fired this turn.');g.ammoStock??=g.tanks.map(()=>({bank:2,spread:1}));const selected=a.ammo??'normal';if(selected!=='normal'&&(g.ammoStock[p][selected]??0)<=0)throw Error('No rounds remaining for this ammunition.');if(!validAimPoint(t,x,y))throw Error('Aim within the circle.');if(selected!=='normal')g.ammoStock[p][selected]=(g.ammoStock[p][selected]??0)-1;t.angle=Math.atan2(y-t.y,x-t.x);delete g.movement;delete g.enemyAim;beginAnimation(g);const hitTank=resolveFire(g,p,a.ammo??'normal');finishAnimation(g);if(g.mode==='coop'&&g.enemies?.some((e,i)=>e.hp<=0&&(g.animation?.before.enemies?.[i]?.hp??0)>0))g.enemyTurnLost=true;g.fired=true;g.log='Shot fired. Turn complete.';if(g.mode==='coop'){if(g.tanks.every(t=>t.hp<=0))g.winner=2;else if(g.enemies?.every(t=>t.hp<=0)){g.nextLevelAt=(g.resolutionUntil??Date.now())+3000;g.log=`Wave ${g.wave} complete`; }}else checkWinner(g);if(g.winner===null&&!g.nextLevelAt)g.deferredNext=true;return g;}throw Error('Unknown action.');}

// Generate once on room creation. Paired cover gives both spawns equal space.
export function randomWalls():Wall[]{
 const walls:Wall[]=[];
 for(let attempt=0;attempt<500&&walls.length<12;attempt++){
  const vertical=Math.random()<.5,thickness=[16,28,44][Math.floor(walls.length/2)%3],w=vertical?thickness:50+Math.floor(Math.random()*4)*20,h=vertical?50+Math.floor(Math.random()*4)*20:thickness;
  const a={x:140+Math.floor(Math.random()*11)*20,y:60+Math.floor(Math.random()*15)*20,w,h};
  const b={x:800-a.x-w,y:500-a.y-h,w,h};
  const overlap=(u:Wall,v:Wall)=>u.x<v.x+v.w+40&&u.x+u.w+40>v.x&&u.y<v.y+v.h+40&&u.y+u.h+40>v.y;
  if(a.y+h>440||b.y<60||overlap(a,b)||walls.some(v=>overlap(a,v)||overlap(b,v)))continue;
  walls.push(a,b);
 }
 const layout=walls.length>=10?walls:randomWallsFallback();
 return layout.flatMap((w,i)=>{if(i!==2&&i!==3)return [w];const vertical=w.h>w.w,length=vertical?w.h:w.w,cut=Math.min(32,length/3),offset=(length-cut)/2;return vertical?[{...w,h:offset},{...w,y:w.y+offset,h:cut,secret:true},{...w,y:w.y+offset+cut,h:offset}]:[{...w,w:offset},{...w,x:w.x+offset,w:cut,secret:true},{...w,x:w.x+offset+cut,w:offset}];});
}
function randomWallsFallback():Wall[]{return [{x:270,y:65,w:16,h:55},{x:514,y:380,w:16,h:55},{x:180,y:220,w:44,h:55},{x:576,y:225,w:44,h:55},{x:200,y:70,w:30,h:100},{x:570,y:330,w:30,h:100},{x:320,y:270,w:100,h:30},{x:380,y:200,w:100,h:30},{x:140,y:350,w:80,h:30},{x:580,y:120,w:80,h:30}];}

export function expireTurn(state:Game,now=Date.now()):Game{
 if(state.lobby)return state;if((state.resolutionUntil??0)>now)return state;
 if(state.nextLevelAt){if(now<state.nextLevelAt)return state;const g=structuredClone(state);advanceWave(g);delete g.turnEndsAt;return g;}
 if(state.winner!==null)return state;if(state.offers)return state.turnEndsAt!==undefined?{...state,turnEndsAt:undefined}:state;
 if(state.deferredNext){const g=structuredClone(state);delete g.deferredNext;remember(g,now);next(g);return g;}
 if(state.mode==='coop'){if(state.tanks[state.turn].hp<=0){const g=structuredClone(state);next(g,false);return g;}if(state.turnEndsAt!==undefined){const g=structuredClone(state);delete g.turnEndsAt;return g;}return state;}
 if(state.turnEndsAt===undefined)return {...state,turnEndsAt:now+turnDuration(state)};
 if(now<state.turnEndsAt)return state;
 const count=Math.floor((now-state.turnEndsAt)/TURN_MS)+1;
 const alive=living(state);const start=alive.indexOf(state.turn);const g={...state,turn:alive[(Math.max(0,start)+count)%alive.length]??state.turn,round:state.round+count,used:0,fired:false,turnEndsAt:state.turnEndsAt+count*TURN_MS,log:'Time expired. Next commander is up.'};maybeDrop(g);return g;
}

export function buildAvailable(_g:Game){return false;}
export function snapBlock(x:number,y:number,walls:Wall[]):Wall{
 let best={x:Math.round((x-20)/20)*20,y:Math.round((y-20)/20)*20,w:40,h:40},distance=Infinity;
 for(const w of [...(walls.some(w=>w.arenaBoundary)?[]:BORDER),...walls]){const sx=Math.max(w.x-20,Math.min(w.x+w.w-20,Math.round((x-20-w.x)/20)*20+w.x)),sy=Math.max(w.y-20,Math.min(w.y+w.h-20,Math.round((y-20-w.y)/20)*20+w.y));
 for(const c of [{x:w.x-40,y:sy},{x:w.x+w.w,y:sy},{x:sx,y:w.y-40},{x:sx,y:w.y+w.h}]){const d=Math.hypot(c.x+20-x,c.y+20-y);if(d<distance){distance=d;best={...c,w:40,h:40}}}}
 return best;
}
function reachable(walls:Wall[],tank:Tank){
 const seen=new Set<string>(),q:{x:number;y:number}[]=[];
 for(let x=Math.floor(tank.x/10)*10;x<=Math.ceil(tank.x/10)*10;x+=10)for(let y=Math.floor(tank.y/10)*10;y<=Math.ceil(tank.y/10)*10;y+=10){if(clear(x,y,walls)){const k=`${x},${y}`;if(!seen.has(k)){seen.add(k);q.push({x,y})}}}
 for(let i=0;i<q.length;i++){const {x,y}=q[i];for(const [dx,dy] of [[10,0],[-10,0],[0,10],[0,-10]]){const nx=x+dx,ny=y+dy,k=`${nx},${ny}`;if(!seen.has(k)&&clear(nx,ny,walls)&&clear(x+dx/2,y+dy/2,walls)){seen.add(k);q.push({x:nx,y:ny})}}}return seen;
}
export function buildError(g:Game,b:Wall):string{
 const walls=[...arenaBorder(g.walls),...(g.walls??WALLS)];const size=arenaSize(g.walls);
 if(!Number.isFinite(b.x)||!Number.isFinite(b.y)||b.w!==40||b.h!==40||b.x<0||b.y<0||b.x+40>size.width||b.y+40>size.height)return 'Place the block inside the arena.';
 if(walls.some(w=>b.x<w.x+w.w&&b.x+40>w.x&&b.y<w.y+w.h&&b.y+40>w.y))return 'Blocks cannot overlap walls.';
 const touch=walls.some(w=>((Math.abs(b.x+40-w.x)<1e-6||Math.abs(b.x-w.x-w.w)<1e-6)&&Math.min(b.y+40,w.y+w.h)-Math.max(b.y,w.y)>0)||((Math.abs(b.y+40-w.y)<1e-6||Math.abs(b.y-w.y-w.h)<1e-6)&&Math.min(b.x+40,w.x+w.w)-Math.max(b.x,w.x)>0));
 if(!touch)return 'Attach the block to a wall side.';
 const proposed=[...walls,b];if([...g.tanks,...(g.enemies??[]).filter(e=>e.hp>0)].some(t=>!clear(t.x,t.y,proposed)))return 'Leave space around both tanks.';
 for(const tank of g.tanks){const before=reachable(walls,tank),after=reachable(proposed,tank);if(after.size<4)return 'Do not trap a tank.';for(const k of before){const [x,y]=k.split(',').map(Number);if(clear(x,y,proposed)&&!after.has(k))return 'Keep routes through the arena open.';}}
 return '';
}

// Authoritative ammunition resolves all pellets against the same persistent room.
function resolveFire(g:Game,p:number,ammo:Ammo){
 if(['piercing','chain','bomb','cluster','wmd'].includes(ammo))return specialFire(g,p,ammo);
 const t=g.tanks[p],walls=g.walls??WALLS,targets=g.mode==='coop'?[...(g.enemies??[]),...g.tanks.filter((_,i)=>i!==p)]:g.tanks.filter((_,i)=>i!==p);
 g.shots=[];let legacyHit=-1;
 if(g.mode==='coop')g.stats??={total:g.tanks.map(()=>emptyStats()),wave:g.tanks.map(()=>emptyStats())};
 for(const offset of ammo==='spread'?[-.12,0,.12]:[0]){
  let outcome:'hits'|'misses'|'friendlyHits'|'selfHits'='misses',killed=false;
  let dx=Math.cos(t.angle+offset),dy=Math.sin(t.angle+offset),origin={x:t.x,y:t.y};const path=[origin];
  for(let leg=0;leg<=(ammo==='bank'?5:(ammo==='normal'||ammo==='longshot')?2:1);leg++){
   const live=targets.filter(v=>v.hp>0);if(leg)live.push(t);
   const r=ray(origin,dx,dy,live,walls);path.push({x:r.ex,y:r.ey});
   if(r.hitTank>=0){const hit=live[r.hitTank];const alive=hit.hp>0,damage=g.healthVersion===2?bounceDamage(leg):1;damageTank(hit,damage);outcome=hit===t?'selfHits':g.tanks.includes(hit)?'friendlyHits':'hits';killed=outcome==='hits'&&alive&&hit.hp===0;recordHit(g,hit,path,damage);legacyHit=hit===t?1:0;break;}
   const secret=walls.findIndex(w=>w.secret&&r.ex>=w.x-.01&&r.ex<=w.x+w.w+.01&&r.ey>=w.y-.01&&r.ey<=w.y+w.h+.01);
   if(secret>=0){const w=walls[secret];g.animation?.impacts.push({at:g.animation.start+flightTime(path),x:w.x,y:w.y,kind:'wall',index:g.animation.before.walls.findIndex(v=>v.x===w.x&&v.y===w.y)});walls.splice(secret,1);g.walls=walls;break;}
   if(r.distance===0)break;if(r.nx)dx=-dx;if(r.ny)dy=-dy;origin={x:r.ex+dx*.001,y:r.ey+dy*.001};
  }
  if(g.mode==='coop'&&g.stats){for(const stats of [g.stats.total[p],g.stats.wave[p]]){stats.shells++;stats[outcome]++;if(killed)stats.kills++;}}
  const end=path[path.length-1];g.shots.push({player:p,x:t.x,y:t.y,ex:end.x,ey:end.y,path,id:Date.now()+g.shots.length,startAt:g.animation?.start,duration:flightTime(path)});
 }
 g.shot=g.shots[0];return legacyHit;
}
export function createGame(mode:'pvp'|'coop'='pvp',count=2):Game{
 if(!Number.isInteger(count)||count<1||count>4)throw Error('Rooms support up to four players.');
 const g=initial(true);g.healthVersion=2;g.upgrades=true;g.ammoStock=g.tanks.map(()=>({bank:2,spread:1}));g.mode=mode;g.matchNumber=1;if(mode==='pvp'){const left=60+Math.floor(Math.random()*381),choices=Array.from({length:381},(_,i)=>i+60).filter(y=>Math.abs(y-left)>=100),right=choices[Math.floor(Math.random()*choices.length)];g.tanks=[{x:65,y:left,hp:3,angle:0},{x:735,y:right,hp:3,angle:Math.PI}];}if(mode==='coop'){g.stats={total:g.tanks.map(()=>emptyStats()),wave:g.tanks.map(()=>emptyStats())};g.wave=1;g.tanks=[{x:65,y:170,hp:3,angle:0},{x:65,y:330,hp:3,angle:0}];spawnEnemies(g);g.log='Co-op: clear the enemy wave together.';}if(count!==2){g.tanks=Array.from({length:count},(_,i)=>({x:mode==='coop'?65:i%2===0?65:735,y:mode==='coop'?80+i*110:i<2?80:420,hp:3,angle:mode==='coop'||i%2===0?0:Math.PI}));g.ammoStock=g.tanks.map(()=>({bank:2,spread:1}));if(mode==='coop'){g.stats={total:g.tanks.map(()=>emptyStats()),wave:g.tanks.map(()=>emptyStats())};spawnEnemies(g);}}if(mode==='pvp'&&count>2){g.walls=[...(g.walls??WALLS).map(w=>({...w,x:w.x*1.5,y:w.y*1.5,w:w.w*1.5,h:w.h*1.5})),...boundary(1200,750)];const positions=count===3?[[600,40],[65,670],[1135,670]]:[[65,80],[1135,670],[1135,80],[65,670]];g.tanks=g.tanks.map((t,i)=>({...t,x:positions[i][0],y:positions[i][1],angle:Math.atan2(375-positions[i][1],600-positions[i][0])}));}g.tanks=g.tanks.map(t=>({...t,hp:PLAYER_HP,maxHp:PLAYER_HP,shield:0}));g.ammoStock=g.ammoStock.map(v=>({...v,piercing:1,chain:1,bomb:1,cluster:1,longshot:1,wmd:1}));if(mode==='coop'){g.pickups=[];g.coopHumanTurns=0;offerBonuses(g);}else{g.pickups=[];spawnPickup(g,Math.random()<.5?'heal':'shield',true);}return g;
}
function spawnEnemies(g:Game){
 g.enemies=[];const lineup=enemyLineup(g.wave??1);
 // Size from the starting roster, never shrink an arena during combat.
 const width=1000+(lineup.length-2)*160,height=625+(lineup.length-2)*100;
 const old=arenaSize(g.walls);
 g.walls=[...(g.walls??WALLS).filter(w=>!w.arenaBoundary).map(w=>({...w,x:w.x*width/old.width,y:w.y*height/old.height,w:w.w*width/old.width,h:w.h*height/old.height})),...boundary(width,height)];
 g.tanks=g.tanks.map((t,i)=>({...t,x:65,y:height*(i+1)/(g.tanks.length+1)}));
 const enemyX=width-60;
 for(const baseY of [80,420,250,160,340]){
  const y=baseY*height/500;
  if(g.enemies.length>=lineup.length)break;
  if(clear(enemyX,y,g.walls)&&g.tanks.every(t=>Math.hypot(t.x-enemyX,t.y-y)>40)){
   const enemyType=lineup[g.enemies.length],spec=ENEMY_TYPES[enemyType];
   const hp=g.healthVersion===2?spec.hp:Math.min(4,1+Math.floor(((g.wave??1)-1)/2));
   g.enemies.push({x:enemyX,y,hp,maxHp:hp,shield:g.healthVersion===2?spec.shield:0,enemyType,angle:Math.PI});
  }
 }
}
function advanceWave(g:Game){
 g.pickups=[];g.coopHumanTurns=0;g.pickupNotices=[];
 if(g.stats)g.stats.wave=g.tanks.map(()=>emptyStats());
 g.wave=(g.wave??1)+1;g.walls=randomWalls();g.enemyCursor=0;delete g.enemyTurnLost;delete g.enemyAim;delete g.activeEnemy;
 g.tanks=g.tanks.map((t,i)=>({shield:t.shield??0,moveBonus:0,x:65,y:g.tanks.length===2?(i===0?170:330):80+i*110,hp:g.leftPlayers?.includes(i)?0:Math.min(g.healthVersion===2?PLAYER_HP:3,t.hp+(g.healthVersion===2?WAVE_REPAIR:1)),maxHp:g.healthVersion===2?PLAYER_HP:3,angle:0}));
 spawnEnemies(g);if(g.upgrades)offerBonuses(g);g.turn=living(g)[0]??0;g.round=1;g.used=0;g.fired=false;
 delete g.buildDoneRound;delete g.nextLevelAt;delete g.animation;delete g.resolutionUntil;delete g.deferredNext;delete g.shot;g.shots=[];
 g.log=`Level ${g.wave}. New arena. Team repaired +${g.healthVersion===2?WAVE_REPAIR:1} HP.`;
}
export function flightTime(path:{x:number;y:number}[]){return Math.max(180,path.slice(1).reduce((n,p,i)=>n+Math.hypot(p.x-path[i].x,p.y-path[i].y),0)/520*1000);}
function beginAnimation(g:Game,delay=350){g.bursts=[];g.animation={start:Date.now()+delay,before:structuredClone({tanks:g.tanks,enemies:g.enemies,walls:g.walls??WALLS}),impacts:[]};}
function recordHit(g:Game,t:Tank,path:{x:number;y:number}[],damage=1){const index=g.tanks.indexOf(t);g.animation?.impacts.push({at:g.animation.start+flightTime(path),x:t.x,y:t.y,kind:index>=0?'tank':'enemy',index:index>=0?index:g.enemies!.indexOf(t),hp:t.hp,shield:t.shield??0,damage,destroyed:t.hp===0});}
function finishAnimation(g:Game){
 const states=new Map<string,Tank>();for(const hit of [...g.animation!.impacts].sort((a,b)=>a.at-b.at)){if(hit.kind==='wall')continue;const key=`${hit.kind}:${hit.index}`,before=(hit.kind==='tank'?g.animation!.before.tanks:g.animation!.before.enemies??[])[hit.index];const t=states.get(key)??{...before};damageTank(t,hit.damage??1);states.set(key,t);hit.destroyed=t.hp===0;hit.hp=t.hp;hit.shield=t.shield??0;}
 for(const [key,t] of states){const [kind,index]=key.split(':');const target=(kind==='tank'?g.tanks:g.enemies!)[Number(index)];target.hp=t.hp;target.shield=t.shield;}
 const start=g.animation!.start;g.resolutionUntil=Math.max(start,...(g.shots??[]).map(s=>(s.startAt??start)+(s.duration??180)),...g.animation!.impacts.map(h=>h.at),...(g.bursts??[]).map(b=>b.at+450))+1000;if(g.turnEndsAt)g.turnEndsAt+=g.resolutionUntil-Date.now();
}
// Rendering uses the shared server timeline: an impact is never shown before its shell arrives.
function presentedInternal(g:Game,now:number):Game{
 const m=g.movement;if(m&&now<m.start+m.duration){const f=Math.max(0,Math.min(1,(now-m.start)/m.duration)),e=f*f*(3-2*f),tanks=structuredClone(g.tanks);tanks[m.player]={...tanks[m.player],x:m.from.x+(tanks[m.player].x-m.from.x)*e,y:m.from.y+(tanks[m.player].y-m.from.y)*e,angle:m.from.angle+Math.atan2(Math.sin(tanks[m.player].angle-m.from.angle),Math.cos(tanks[m.player].angle-m.from.angle))*Math.min(1,f*4)};return {...g,tanks};}
 const a=g.animation;if(!a||now>=(g.resolutionUntil??0))return g;
 const tanks=structuredClone(a.before.tanks),enemies=structuredClone(a.before.enemies??[]),removed=new Set<number>();
 for(const hit of [...a.impacts].sort((x,y)=>x.at-y.at)){if(hit.at>now)continue;if(hit.kind==='wall'){removed.add(hit.index);continue;}const t=(hit.kind==='tank'?tanks:enemies)[hit.index];if(t)damageTank(t,hit.damage??1);}
 for(const m of g.enemyMoves??[]){const t=enemies[m.index];if(!t)continue;if(now>=m.start+m.duration){Object.assign(t,m.path[m.path.length-1]);continue;}const f=Math.max(0,Math.min(1,(now-m.start)/m.duration)),lengths=m.path.slice(1).map((b,i)=>Math.hypot(b.x-m.path[i].x,b.y-m.path[i].y));let d=lengths.reduce((a,b)=>a+b,0)*(f*f*(3-2*f)),i=0;while(i<lengths.length-1&&d>lengths[i]){d-=lengths[i++];}const from=m.path[i],to=m.path[i+1]??from,k=lengths[i]?d/lengths[i]:0;t.x=from.x+(to.x-from.x)*k;t.y=from.y+(to.y-from.y)*k;}
 const aim=g.enemyAim;if(aim&&enemies[aim.index]){const f=Math.max(0,Math.min(1,(now-aim.start)/aim.duration));enemies[aim.index].angle=aim.from+Math.atan2(Math.sin(aim.to-aim.from),Math.cos(aim.to-aim.from))*f;}
 return {...g,tanks,enemies,walls:a.before.walls.filter((_,i)=>!removed.has(i)),winner:null,log:g.mode==='coop'&&g.activeEnemy!==undefined?`Enemy ${g.activeEnemy+1} is taking its turn…`:'Shot in flight…'};
}
// Breadth-first search over tank-clear grid edges finds routes around cover,
// including routes whose first step must move away from the target.
export function enemyRoute(g:Game,enemy:Tank):{x:number;y:number}[]{
 const walls=g.walls??WALLS,targets=g.tanks.filter(t=>t.hp>0),obstacles=[...targets,...(g.enemies??[]).filter(e=>e!==enemy&&e.hp>0)];
 const safe=(a:Tank,x:number,y:number)=>obstacles.every(t=>route(a,x,y,t,walls));
 const firing=(v:{x:number;y:number})=>targets.some(t=>{const dx=t.x-v.x,dy=t.y-v.y,d=Math.hypot(dx,dy);const hit=ray(v,dx/d,dy/d,obstacles,walls);return hit.hitTank>=0&&targets.includes(obstacles[hit.hitTank]);});
 if(firing(enemy))return [];
 const nodes:{x:number;y:number;parent:number}[]=[{x:enemy.x,y:enemy.y,parent:-1}],seen=new Set<string>();let found=-1;
 for(let i=0;i<nodes.length&&i<Math.ceil(arenaSize(walls).width*arenaSize(walls).height/400);i++){
  const n=nodes[i];if(i&&firing(n)){found=i;break;}
  const neighbors=i===0?[-20,0,20].flatMap(dx=>[-20,0,20].map(dy=>({x:Math.round(enemy.x/20)*20+dx,y:Math.round(enemy.y/20)*20+dy}))):[[20,0],[-20,0],[0,20],[0,-20]].map(([dx,dy])=>({x:n.x+dx,y:n.y+dy}));
  for(const v of neighbors){const key=`${v.x},${v.y}`;if(seen.has(key)||!clear(v.x,v.y,walls)||!safe({...enemy,...n},v.x,v.y))continue;seen.add(key);nodes.push({...v,parent:i});}
 }
 if(found<0)return [];
 const path:{x:number;y:number}[]=[];while(found>0){const n=nodes[found];path.unshift({x:n.x,y:n.y});found=n.parent;}return path;
}
// Candidate angles and their errors are chosen once on the server.
export function traceEnemyShot(g:Game,enemy:Tank,angle:number,bounces:number){
 const targets=[...g.tanks,...(g.enemies??[])].filter(t=>t.hp>0&&t!==enemy),walls=g.walls??WALLS;
 let dx=Math.cos(angle),dy=Math.sin(angle),origin={x:enemy.x,y:enemy.y};const path=[origin];let hit:Tank|undefined;
 for(let leg=0;leg<=bounces;leg++){
  const pool=leg?[...targets,enemy]:targets,r=ray(origin,dx,dy,pool,walls);path.push({x:r.ex,y:r.ey});
  if(r.hitTank>=0){hit=pool[r.hitTank];break;}if(leg===bounces||r.distance===0)break;
  if(r.nx)dx=-dx;if(r.ny)dy=-dy;origin={x:r.ex+dx*.001,y:r.ey+dy*.001};
 }
 return {path,hit};
}
export function planEnemyAim(g:Game,enemy:Tank){
 const step=(enemy.enemyType==='triangle'?.75:enemy.enemyType==='square'?1.5:2)*Math.PI/180;
 const candidates=g.tanks.filter(t=>t.hp>0).map(t=>{const angle=Math.atan2(t.y-enemy.y,t.x-enemy.x);return enemy.enemyType?Math.round(angle/step)*step:angle;});
 for(const angle of candidates){const r=traceEnemyShot(g,enemy,angle,0);if(r.hit&&g.tanks.includes(r.hit))return {angle,bounces:0};}
 if(!enemy.enemyType)return null;
 const increment=(enemy.enemyType==='triangle'?2:5)*Math.PI/180;
 let best:{angle:number;bounces:number;distance:number}|null=null;
 for(let angle=-Math.PI;angle<Math.PI;angle+=increment){const r=traceEnemyShot(g,enemy,angle,1);if(r.path.length!==3||!r.hit||!g.tanks.includes(r.hit))continue;const distance=flightTime(r.path);if(!best||distance<best.distance)best={angle,bounces:1,distance};}
 return best;
}
function enemyPhase(g:Game){
 if(!g.enemies?.some(e=>e.hp>0)){g.nextLevelAt=Date.now()+3000;return;}
 // Only a new enemy death forfeits the next enemy action, once.
 const count=g.enemies.length;let index=(g.enemyCursor??0)%count;
 while(g.enemies[index].hp<=0)index=(index+1)%count;
 g.enemyCursor=(index+1)%count;
 if(g.enemyTurnLost){
  delete g.enemyTurnLost;delete g.enemyAim;delete g.activeEnemy;delete g.movement;delete g.animation;delete g.shot;
  g.shots=[];g.enemyMoves=[];delete g.resolutionUntil;
  g.log='An enemy was destroyed. The next enemy turn is forfeited.';
  return;
 }
 g.activeEnemy=index;
 const acting=[g.enemies[index]];
 // Move along a real collision-checked route before aiming. Never fire into cover.
 delete g.enemyAim;delete g.movement;g.enemyMoves=[];for(const enemy of acting){
  const path=[{x:enemy.x,y:enemy.y}];let remaining=ENEMY_TYPES[enemy.enemyType??'circle'].move;for(const waypoint of (planEnemyAim(g,enemy)?[]:enemyRoute(g,enemy))){const distance=Math.hypot(waypoint.x-enemy.x,waypoint.y-enemy.y);if(distance>remaining){const f=remaining/distance;enemy.x+=(waypoint.x-enemy.x)*f;enemy.y+=(waypoint.y-enemy.y)*f;path.push({x:enemy.x,y:enemy.y});break;}Object.assign(enemy,waypoint);path.push({...waypoint});remaining-=distance;if(remaining<=0)break;}
  if(path.length>1)g.enemyMoves.push({index:g.enemies.indexOf(enemy),path,start:Date.now(),duration:600});
 }
 const movementStart=Date.now()+500;for(const move of g.enemyMoves)move.start=movementStart;
 beginAnimation(g,movementStart-Date.now()+600);g.shots=[];
 for(const enemy of acting){
  const plan=planEnemyAim(g,enemy);if(!plan)continue;
  const error=enemy.enemyType?(enemy.enemyType==='circle'?6:enemy.enemyType==='triangle'?2.5:4):0;
  const from=enemy.angle,to=plan.angle+(Math.random()*2-1)*error*Math.PI/180;
  const delta=Math.abs(Math.atan2(Math.sin(to-from),Math.cos(to-from)));
  const duration=enemy.enemyType?Math.max(450,delta/(enemy.enemyType==='square'?1.4:2.8)*1000):0;
  g.enemyAim={index,from,to,start:movementStart+600,duration:Math.max(1,duration)};
  g.animation!.start=movementStart+600+duration;enemy.angle=to;
  const result=traceEnemyShot(g,enemy,to,plan.bounces),path=result.path;
  if(result.hit){const damage=g.healthVersion===2?ENEMY_TYPES[enemy.enemyType??'circle'].damage:1;damageTank(result.hit,damage);recordHit(g,result.hit,path,damage);if(g.enemies.includes(result.hit)&&result.hit.hp<=0)g.enemyTurnLost=true;}
  const end=path[path.length-1];g.shots.push({x:enemy.x,y:enemy.y,ex:end.x,ey:end.y,path,id:Date.now()+g.shots.length,startAt:g.animation!.start,duration:flightTime(path)});
 }
 finishAnimation(g);if(g.tanks.every(t=>t.hp<=0)){g.winner=2;g.log=`Team defeated on wave ${g.wave}.`;}else g.log=`Wave ${g.wave}: enemy ${index+1} repositioned${g.shots.length?' and fired':' to find a clear shot'}.`;
}

export const SIGHT_RADIUS=240;
export function canSee(t:Tank,x:number,y:number,walls:Wall[]){
 const d=Math.hypot(x-t.x,y-t.y);if(d>SIGHT_RADIUS)return false;if(d<.01)return true;
 return ray(t,(x-t.x)/d,(y-t.y)/d,[],walls).distance>=d-.01;
}
export function sightPolygon(t:Tank,walls:Wall[]){return Array.from({length:240},(_,i)=>{const a=i*Math.PI/120,dx=Math.cos(a),dy=Math.sin(a),d=Math.min(SIGHT_RADIUS,ray(t,dx,dy,[],walls).distance);return `${t.x+dx*d},${t.y+dy*d}`;}).join(' ');}
// Redact unseen opponents before the room state leaves the server.
export function playerView(state:Game,p:number,now=Date.now()):Game{
 if(state.lobby&&state.mode!=='coop'){const view=structuredClone(state);view.tanks=view.tanks.map(t=>({...t,x:-1000,y:-1000,angle:0,hidden:true}));delete view.animation;delete view.movement;delete view.viewTrack;delete view.viewTracks;delete view.shot;view.shots=[];view.reveals=[];view.flashes=[];view.pickups=[];return view;}
 if(state.lobby||state.mode==='coop'||state.tanks[p].hp<=0||(state.winner!==null&&now>=(state.resolutionUntil??0)))return state;
 const g=structuredClone(state),t=g.tanks[p],walls=g.walls??WALLS;remember(g,now,p);
 g.reveals=(g.reveals??[]).filter(r=>r.player===p&&r.expires>=g.round);g.explored=[g.explored?.[p]??[]];g.flashes=(g.flashes??[]).filter(f=>f.player!==p&&f.until>now);
 const sees=(x:number,y:number)=>revealed(state,p,x,y,now);g.pickupNotices=(g.pickupNotices??[]).filter(n=>n.player===p);g.bursts=(g.bursts??[]).filter(b=>sees(b.x,b.y));g.pickups=(g.pickups??[]).filter(v=>v.kind==='heal'||v.kind==='shield'||sees(v.x,v.y));
 const hidden:Tank={x:-1000,y:-1000,hp:3,angle:0,hidden:true};
 const current=presentedInternal(state,now);
 const conceal=(tanks:Tank[],_cover:Wall[])=>{tanks.forEach((enemy,i)=>{if(i!==p&&!sees(enemy.x,enemy.y))tanks[i]={...hidden};});};
 conceal(g.tanks,walls);
 if(state.movement&&now<state.movement.start+state.movement.duration){
  const m=state.movement,end=m.start+m.duration;g.viewTracks=[];
  for(let i=0;i<g.tanks.length;i++){if(i===p)continue;const frames:{at:number;tank:Tank}[]=[];
   for(let at=Math.min(now,m.start);;at=Math.min(end,at+16)){const enemy=presentedInternal(state,at).tanks[i];frames.push({at,tank:revealed(state,p,enemy.x,enemy.y,at)?{...enemy}:{...hidden}});if(at>=end)break;}
   g.viewTracks.push({player:i,frames});g.tanks[i]=sees(current.tanks[i].x,current.tanks[i].y)?{...current.tanks[i]}:{...hidden};
  }
  g.viewTrack=g.viewTracks[0];if(m.player!==p)delete g.movement;
 }
 if(g.animation){const before=g.animation.before;g.animation.impacts=g.animation.impacts.filter(h=>sees(h.x,h.y));conceal(before.tanks,before.walls);}
 g.shots=(g.shots??(g.shot?[g.shot]:[])).flatMap(shot=>{
  if(shot.player===p)return [shot];const path=shot.path??[{x:shot.x,y:shot.y},{x:shot.ex,y:shot.ey}];if(!sees(path[0].x,path[0].y))return [];
  const visible=[path[0]];let clipped=false;
  for(let i=1;i<path.length;i++){const a=path[i-1],b=path[i],steps=Math.max(1,Math.ceil(Math.hypot(b.x-a.x,b.y-a.y)/2));let last=a;
   for(let j=1;j<=steps;j++){const point={x:a.x+(b.x-a.x)*j/steps,y:a.y+(b.y-a.y)*j/steps};if(!sees(point.x,point.y)){clipped=true;break;}last=point;}
   visible.push(last);if(clipped)break;
  }
  const end=visible[visible.length-1];return [{...shot,path:visible,ex:end.x,ey:end.y,clipped,duration:flightTime(visible)}];
 });delete g.shot;
 if(g.turn!==p&&g.winner===null)g.log='Opponent is taking their turn.';
 return g;
}

// Terrain memory is per commander. A shot scouts only its actual ricochet route.
export function revealed(g:Game,p:number,x:number,y:number,now=Date.now()){
 const live=presentedInternal(g,now);if(canSee(live.tanks[p],x,y,live.walls??WALLS))return true;
 return (g.reveals??[]).some(r=>r.player===p&&r.expires>=g.round&&travelledPath(r,now).slice(1).some((b,i)=>{const a=travelledPath(r,now)[i],dx=b.x-a.x,dy=b.y-a.y,f=Math.max(0,Math.min(1,((x-a.x)*dx+(y-a.y)*dy)/(dx*dx+dy*dy||1))),v={...g.tanks[p],x:a.x+f*dx,y:a.y+f*dy};return Math.hypot(x-v.x,y-v.y)<=18&&canSee(v,x,y,g.walls??WALLS);}));
}
function remember(g:Game,now=Date.now(),onlyPlayer?:number){if(g.mode==='coop')return;g.explored??=g.tanks.map(()=>[]);for(let p=0;p<g.tanks.length;p++){if(onlyPlayer!==undefined&&p!==onlyPlayer)continue;const seen=new Set(g.explored[p]);const size=arenaSize(g.walls),cols=Math.ceil(size.width/20),rows=Math.ceil(size.height/20);for(let n=0;n<cols*rows;n++){const x=n%cols*20+10,y=Math.floor(n/cols)*20+10;if(revealed(g,p,x,y,now))seen.add(n);}g.explored[p]=[...seen];}}
export function act(state:Game,p:number,a:{type:string;x?:number;y?:number;ammo?:Ammo;bonus?:Bonus}):Game{
 const before=structuredClone(state);remember(before);const g=actInternal(before,p,a);
 g.reveals=(g.reveals??[]).filter(r=>r.expires>=g.round);
 if(a.type==='fire'&&g.mode!=='coop'){for(const shot of g.shots??[])g.reveals.push({player:p,expires:before.round+g.tanks.length,startAt:shot.startAt,duration:shot.duration,path:shot.path??[{x:shot.x,y:shot.y},{x:shot.ex,y:shot.ey}]});g.flashes=[{player:p,x:before.tanks[p].x,y:before.tanks[p].y,until:(g.animation?.start??Date.now())+1400}];}
 if(a.type==='move'){const from=before.tanks[p],to={...g.tanks[p]},steps=Math.ceil(Math.hypot(to.x-from.x,to.y-from.y)/20);for(let i=1;i<steps;i++){g.tanks[p]={...to,x:from.x+(to.x-from.x)*i/steps,y:from.y+(to.y-from.y)*i/steps};remember(g);}g.tanks[p]=to;}
 remember(g);return g;
}

// Both the fog and projectile use the same distance along the same timed route.
export function travelledPath(r:{path:{x:number;y:number}[];startAt?:number;duration?:number},now:number){
 if(r.startAt===undefined)return r.path;if(now<=r.startAt)return [];
 const lengths=r.path.slice(1).map((b,i)=>Math.hypot(b.x-r.path[i].x,b.y-r.path[i].y)),total=lengths.reduce((a,b)=>a+b,0);
 let remaining=total*Math.min(1,(now-r.startAt)/(r.duration??flightTime(r.path)));const result=[r.path[0]];
 for(let i=0;i<lengths.length;i++){const a=r.path[i],b=r.path[i+1];if(remaining>=lengths[i]){result.push(b);remaining-=lengths[i];}else{const f=remaining/(lengths[i]||1);result.push({x:a.x+(b.x-a.x)*f,y:a.y+(b.y-a.y)*f});break;}}
 return result;
}

// Remote motion carries only visible samples, never the hidden destination.
export function presentedGame(g:Game,now:number):Game{
 const view=presentedInternal(g,now),tracks=g.viewTracks??(g.viewTrack?[g.viewTrack]:[]);const tanks=[...view.tanks];
 for(const track of tracks){const frames=track.frames;let i=0;while(i<frames.length-1&&frames[i+1].at<=now)i++;
 const a=frames[i],b=frames[Math.min(i+1,frames.length-1)];let tank={...a.tank};
 if(!a.tank.hidden&&!b.tank.hidden&&b.at>a.at){const f=Math.max(0,Math.min(1,(now-a.at)/(b.at-a.at)));tank={...tank,x:a.tank.x+(b.tank.x-a.tank.x)*f,y:a.tank.y+(b.tank.y-a.tank.y)*f,angle:a.tank.angle+Math.atan2(Math.sin(b.tank.angle-a.tank.angle),Math.cos(b.tank.angle-a.tank.angle))*f};}
 tanks[track.player]=tank;}return {...view,tanks};
}

export function damageTank(t:Tank,damage:number){const absorbed=Math.min(t.shield??0,damage);t.shield=Math.max(0,(t.shield??0)-absorbed);t.hp=Math.max(0,t.hp-(damage-absorbed));}
function applyBonus(g:Game,p:number,bonus:Bonus){const t=g.tanks[p];if(bonus==='heal')t.hp=Math.min(t.maxHp??200,t.hp+50);else if(bonus==='shield')t.shield=Math.min(50,(t.shield??0)+25);else if(bonus==='mobility')t.moveBonus=40;else{g.ammoStock??=g.tanks.map(()=>({bank:2,spread:1}));g.ammoStock[p][bonus]=(g.ammoStock[p][bonus]??0)+1;}}
function offerBonuses(g:Game){g.choices=g.tanks.map((_,i)=>g.leftPlayers?.includes(i)?'heal':null);g.offers=g.tanks.map(t=>{const pool=(Object.keys(BONUS_LABELS) as Bonus[]).filter(b=>(b!=='heal'||t.hp<(t.maxHp??200))&&(b!=='shield'||(t.shield??0)<50));for(let i=pool.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]];}return pool.slice(0,3);});}
export function spawnPickup(g:Game,kind:Pickup['kind'],central=false){
 const walls=g.walls??WALLS,size=arenaSize(walls),sets=g.tanks.filter(t=>t.hp>0).map(t=>reachable(walls,t));
 const candidates:{x:number;y:number}[]=[];for(let x=30;x<=size.width-30;x+=10)for(let y=30;y<=size.height-30;y+=10){if(clear(x,y,walls)&&sets.every(s=>s.has(`${x},${y}`))&&g.tanks.every(t=>Math.hypot(t.x-x,t.y-y)>45)&&(g.enemies??[]).every(t=>t.hp<=0||Math.hypot(t.x-x,t.y-y)>45)&&!(g.pickups??[]).some(v=>Math.hypot(v.x-x,v.y-y)<45))candidates.push({x,y});}
 if(!candidates.length)return;
 if(central)candidates.sort((a,b)=>(Math.abs(a.x-size.width/2)*1000+Math.abs(a.y-size.height/2))-(Math.abs(b.x-size.width/2)*1000+Math.abs(b.y-size.height/2)));
 const point=candidates[central?0:Math.floor(Math.random()*candidates.length)];g.pickups??=[];g.pickups.push({...point,kind,id:Date.now()+g.pickups.length});
}
function maybeCoopDrop(g:Game){
 if(!g.upgrades||g.mode!=='coop'||(g.coopHumanTurns??0)%2!==0||(g.pickups??[]).length>=3)return;
 const category=Math.floor(Math.random()*3),ammo=['bank','spread','piercing','chain','bomb','cluster','longshot','wmd'] as const;
 spawnPickup(g,category===0?'heal':category===1?'shield':ammo[Math.floor(Math.random()*ammo.length)]);
}
function maybeDrop(g:Game){if(!g.upgrades||g.mode==='coop'||g.round-(g.lastDropRound??1)<4)return;g.lastDropRound=g.round;if((g.pickups??[]).filter(v=>v.kind!=='heal'&&v.kind!=='shield').length<2){const pool=['bank','spread','piercing','chain','bomb','cluster','longshot','wmd'] as const;spawnPickup(g,pool[Math.floor(Math.random()*pool.length)]);}}
function collectPickups(g:Game,p:number,from:Tank,to:{x:number;y:number}){const dx=to.x-from.x,dy=to.y-from.y;g.pickups=(g.pickups??[]).filter(v=>{const f=Math.max(0,Math.min(1,((v.x-from.x)*dx+(v.y-from.y)*dy)/(dx*dx+dy*dy||1)));if(Math.hypot(v.x-from.x-f*dx,v.y-from.y-f*dy)>R+8)return true;const t=g.tanks[p],before=v.kind==='heal'?t.hp:v.kind==='shield'?(t.shield??0):(g.ammoStock?.[p][v.kind]??0);applyBonus(g,p,v.kind);const after=v.kind==='heal'?t.hp:v.kind==='shield'?(t.shield??0):(g.ammoStock?.[p][v.kind]??0);g.pickupNotices??=[];g.pickupNotices=g.pickupNotices.filter(n=>n.at>Date.now()-6000);g.pickupNotices.push({player:p,text:v.kind==='heal'?`+${after-before} HP`:v.kind==='shield'?`+${after-before} Shield`:`+1 ${v.kind[0].toUpperCase()+v.kind.slice(1)} ammo`,at:Date.now()});return false;});}

// Plan all secondary trajectories on the server; clients replay the same timestamps.
function specialFire(g:Game,p:number,ammo:Ammo){
 const shooter=g.tanks[p],walls=g.walls??WALLS,start=g.animation!.start;
 g.shots=[];g.stats??={total:g.tanks.map(()=>emptyStats()),wave:g.tanks.map(()=>emptyStats())};
 let enemyHit=false,friendlyHit=false,selfHit=false,kills=0;
 const live=()=>[...(g.enemies??[]),...g.tanks].filter(t=>t.hp>0);
 const visible=(a:{x:number;y:number},b:{x:number;y:number})=>{const d=Math.hypot(b.x-a.x,b.y-a.y);return d<.01||ray(a,(b.x-a.x)/d,(b.y-a.y)/d,[],walls).distance>=d-.01;};
 const applyHit=(t:Tank,damage:number,at:number)=>{if(t.hp<=0)return;const was=t.hp;damageTank(t,damage);const index=g.tanks.indexOf(t);g.animation!.impacts.push({at,x:t.x,y:t.y,kind:index>=0?'tank':'enemy',index:index>=0?index:g.enemies!.indexOf(t),damage,hp:t.hp,shield:t.shield??0,destroyed:t.hp===0});if(index<0||(g.mode!=='coop'&&t!==shooter)){enemyHit=true;if(was>0&&t.hp===0)kills++;}else if(t===shooter)selfHit=true;else friendlyHit=true;};
 const pending:{t:Tank;damage:number;at:number}[]=[];
 const hit=(t:Tank,damage:number,at:number)=>{if(ammo==='wmd')pending.push({t,damage,at});else applyHit(t,damage,at);};
 const shot=(path:{x:number;y:number}[],at:number,style:string,duration=flightTime(path))=>{const a=path[0],b=path.at(-1)!;g.shots!.push({player:p,x:a.x,y:a.y,ex:b.x,ey:b.y,path,startAt:at,duration,style,id:start+g.shots!.length});return at+duration;};
 const dx=Math.cos(shooter.angle),dy=Math.sin(shooter.angle);
 if(ammo==='piercing'){
  let vx=dx,vy=dy,origin={x:shooter.x,y:shooter.y};const path=[origin];
  for(let leg=0;leg<3;leg++){
   const end=ray(origin,vx,vy,[],walls),targets=live().filter(t=>leg>0||t!==shooter).map(t=>({t,r:ray(origin,vx,vy,[t],walls)})).filter(v=>v.r.hitTank===0).sort((a,b)=>a.r.distance-b.r.distance);
   for(const {t,r} of targets)hit(t,40,start+flightTime([...path,{x:r.ex,y:r.ey}]));
   path.push({x:end.ex,y:end.ey});if(leg===2||end.distance===0)break;if(end.nx)vx=-vx;if(end.ny)vy=-vy;origin={x:end.ex+vx*.001,y:end.ey+vy*.001};
  }
  const end=path.at(-1)!,at=shot(path,start,'piercing');g.bursts!.push({...end,at,radius:25});
 }else if(ammo==='chain'){
  const enemies=(g.mode==='coop'?g.enemies??[]:g.tanks.filter((_,i)=>i!==p)).filter(t=>t.hp>0);let vx=dx,vy=dy,origin={x:shooter.x,y:shooter.y},struck:Tank|undefined;const path=[origin];
  for(let leg=0;leg<2;leg++){const r=ray(origin,vx,vy,enemies,walls);path.push({x:r.ex,y:r.ey});if(r.hitTank>=0){struck=enemies[r.hitTank];break;}if(leg===1||r.distance===0)break;if(r.nx)vx=-vx;if(r.ny)vy=-vy;origin={x:r.ex+vx*.001,y:r.ey+vy*.001};}
  const at=shot(path,start,'chain');
  if(struck){let current=struck,time=at;const seen=new Set<Tank>();for(let count=0;count<4;count++){hit(current,30,time);seen.add(current);if(count===3)break;const candidates=enemies.filter(t=>t.hp>0&&t!==current&&Math.hypot(t.x-current.x,t.y-current.y)<=BUDGET&&visible(current,t));candidates.sort((a,b)=>Number(seen.has(a))-Number(seen.has(b))||Math.hypot(a.x-current.x,a.y-current.y)-Math.hypot(b.x-current.x,b.y-current.y));if(!candidates.length)break;const target=candidates[0];time=shot([{x:current.x,y:current.y},{x:target.x,y:target.y}],time,'zap',220);current=target;}}
 }else if(ammo==='bomb'){
  const targets=live().filter(t=>t!==shooter),r=ray(shooter,dx,dy,targets,walls),center={x:r.ex-dx*.05,y:r.ey-dy*.05},at=shot([{x:shooter.x,y:shooter.y},{x:r.ex,y:r.ey}],start,'bomb');g.bursts!.push({...center,at,radius:100});
  for(const t of live()){const distance=Math.hypot(t.x-center.x,t.y-center.y);if(distance<100&&visible(center,t))hit(t,Math.max(1,Math.round(60*(1-distance/100))),at);}
 }else{
  let vx=dx,vy=dy,origin={x:shooter.x,y:shooter.y};const path=[origin];let struck:Tank|undefined;
  for(let leg=0;leg<(ammo==='wmd'?4:3);leg++){const targets=live().filter(t=>leg>0||t!==shooter),r=ray(origin,vx,vy,targets,walls);path.push({x:r.ex,y:r.ey});if(r.hitTank>=0){struck=targets[r.hitTank];break;}if(leg===(ammo==='wmd'?3:2)||r.distance===0)break;if(r.nx)vx=-vx;if(r.ny)vy=-vy;origin={x:r.ex+vx*.001,y:r.ey+vy*.001};}
  const end=path.at(-1)!,at=shot(path,start,ammo);if(struck)hit(struck,30,at);const center={x:end.x-vx*.05,y:end.y-vy*.05};g.bursts!.push({...center,at,radius:30});
  if(ammo==='wmd'){
   g.bursts!.push({...center,at,radius:100});
   for(const t of live()){const distance=Math.hypot(t.x-center.x,t.y-center.y);if(distance<100&&visible(center,t))hit(t,Math.max(1,Math.round(60*(1-distance/100))),at);}
   const enemies=()=>live().filter(t=>g.mode==='coop'?!g.tanks.includes(t):t!==shooter);
   let current=struck&&(g.mode==='coop'?!g.tanks.includes(struck):struck!==shooter)?struck:enemies().filter(t=>Math.hypot(t.x-center.x,t.y-center.y)<=BUDGET&&visible(center,t)).sort((a,b)=>Math.hypot(a.x-center.x,a.y-center.y)-Math.hypot(b.x-center.x,b.y-center.y))[0];
   let time=at,from=center;const seen=new Set<Tank>();
   for(let count=0;current&&count<4;count++){
    time=shot([from,{x:current.x,y:current.y}],at,'zap',0);hit(current,30,at);seen.add(current);from={x:current.x,y:current.y};
    current=enemies().filter(t=>t!==current&&Math.hypot(t.x-from.x,t.y-from.y)<=BUDGET&&visible(from,t)).sort((a,b)=>Number(seen.has(a))-Number(seen.has(b))||Math.hypot(a.x-from.x,a.y-from.y)-Math.hypot(b.x-from.x,b.y-from.y))[0];
   }
  }
  const rotation=Math.random()*Math.PI*2;
  for(let i=0;i<3;i++){const angle=rotation+i*Math.PI*2/3,fx=Math.cos(angle),fy=Math.sin(angle);const targets=live(),r=ray(center,fx,fy,targets,walls),arrival=shot([center,{x:r.ex,y:r.ey}],at,'fragment',ammo==='wmd'?0:flightTime([center,{x:r.ex,y:r.ey}]));if(r.hitTank>=0)hit(targets[r.hitTank],20,arrival);}
 }
 for(const event of pending.sort((a,b)=>a.at-b.at))applyHit(event.t,event.damage,event.at);
 for(const stats of [g.stats.total[p],g.stats.wave[p]]){stats.shells++;if(enemyHit)stats.hits++;else if(selfHit)stats.selfHits++;else if(friendlyHit)stats.friendlyHits++;else stats.misses++;stats.kills+=kills;}
 g.shot=g.shots[0];return selfHit?1:enemyHit?0:-1;
}

// Preview updates cannot spend movement, advance a turn, or alter combat results.
export function previewAim(state:Game,p:number,angle:number,round:number):Game{
 if(state.mode!=='coop'||state.lobby||state.winner!==null||state.turn!==p||state.round!==round||!state.tanks[p]||state.tanks[p].hp<=0||state.offers||state.deferredNext||state.nextLevelAt||(state.resolutionUntil??0)>Date.now()||state.fired||buildAvailable(state)||!Number.isFinite(angle))throw Error('Aim preview unavailable.');
 const g=structuredClone(state);g.tanks[p].angle=Math.atan2(Math.sin(angle),Math.cos(angle));return g;
}
