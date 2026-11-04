import {getDb} from '@/db';
import {rooms,visitors,channels} from '@/db/schema';
import {and,eq,gt,desc} from 'drizzle-orm';
import {appendChat,type ChatMessage} from '@/lib/chat';
import {lobbySummary} from '@/lib/room-members';
export async function POST(req:Request){try{
 const b=await req.json() as {op:string;token?:string;text:string;id:string},db=getDb();
 if(b.op==='lobbies'){
  const rows=await db.select().from(rooms).where(gt(rooms.lastActive,Date.now()-120000)).orderBy(desc(rooms.lastActive)).limit(100);
  return Response.json({lobbies:rows.map(r=>lobbySummary(r)).filter(Boolean)});
 }
 if(b.op==='register'){
  if(b.token){const old=(await db.select().from(visitors).where(eq(visitors.token,b.token)))[0];if(old)return Response.json({token:old.token,name:old.name,player:old.name});}
  const token=crypto.randomUUID(),name=`Guest ${crypto.randomUUID().slice(0,8).toUpperCase()}`;
  await db.insert(visitors).values({token,name});return Response.json({token,name,player:name});
 }
 if(b.op!=='read'&&b.op!=='send')throw Error('Invalid chat operation.');
 const visitor=(await db.select().from(visitors).where(eq(visitors.token,b.token??'')))[0];
 if(!visitor)return Response.json({error:'Refresh to reconnect to global chat.'},{status:403});
 await db.insert(channels).values({id:'global'}).onConflictDoNothing();
 for(let attempt=0;attempt<3;attempt++){
  const row=(await db.select().from(channels).where(eq(channels.id,'global')))[0],messages:ChatMessage[]=JSON.parse(row.messages);
  if(b.op==='read')return Response.json({messages});
  const next=appendChat(messages,{id:b.id,text:b.text,player:visitor.name,name:visitor.name,color:'#b7f8dc',at:Date.now()});
  if(next===messages)return Response.json({messages});
  const changed=await db.update(channels).set({messages:JSON.stringify(next)}).where(and(eq(channels.id,'global'),eq(channels.messages,row.messages))).returning({id:channels.id});
  if(changed.length)return Response.json({messages:next});
 }
 throw Error('Chat is busy. Try sending again.');
}catch(e){return Response.json({error:e instanceof Error?e.message:'Unable to connect.'},{status:400});}}
