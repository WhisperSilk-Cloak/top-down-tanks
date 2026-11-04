import {getDb} from '@/db';
import {rooms} from '@/db/schema';
import {and,eq} from 'drizzle-orm';
import {memberTokens} from '@/lib/room-members';
import {playerColor,type Game} from '@/lib/game';
import {appendChat,type ChatMessage} from '@/lib/chat';
export async function POST(req:Request){try{
 const b=await req.json() as {code?:string;token?:string;op?:string;id:string;text:string},code=String(b.code??'').toUpperCase(),db=getDb();
 if(b.op!=='read'&&b.op!=='send')throw Error('Invalid chat operation.');
 for(let attempt=0;attempt<3;attempt++){
 const row=(await db.select().from(rooms).where(eq(rooms.code,code)))[0];
 if(!row)return Response.json({error:'Room not found.'},{status:404});
 const p=memberTokens(row).indexOf(b.token??'');
 if(p<0)return Response.json({error:'Invalid player session.'},{status:403});
 const game:Game=JSON.parse(row.state);
 if(game.leftPlayers?.includes(p)||game.departed)return Response.json({error:'This room has closed or you have left.'},{status:403});
 const messages:ChatMessage[]=JSON.parse(row.chat);
 if(b.op==='read')return Response.json({messages});
 const color=playerColor(game,p),next=appendChat(messages,{id:b.id,text:b.text,player:p,name:color.name,color:color.body,at:Date.now()});
 if(next===messages)return Response.json({messages});
 // Chat has its own compare-and-swap, independent of combat and aiming versions.
 const changed=await db.update(rooms).set({chat:JSON.stringify(next)}).where(and(eq(rooms.code,code),eq(rooms.chat,row.chat))).returning({code:rooms.code});
 if(changed.length)return Response.json({messages:next});
 }
 throw Error('Chat is busy. Please try sending again.');
}catch(e){return Response.json({error:e instanceof Error?e.message:'Chat unavailable.'},{status:400});}}
