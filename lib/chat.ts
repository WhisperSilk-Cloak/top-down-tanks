export type ChatMessage={id:string;player:number|string;name:string;color:string;text:string;at:number};
export function appendChat(messages:ChatMessage[],message:ChatMessage){
 if(messages.some(m=>m.id===message.id&&m.player===message.player))return messages;
 if(typeof message.text!=='string'||!message.text.trim()||message.text.length>300)throw Error('Enter a message of 1–300 characters.');
 if(typeof message.id!=='string'||!/^[a-zA-Z0-9-]{1,64}$/.test(message.id))throw Error('Invalid message ID.');
 const previous=messages.findLast(m=>m.player===message.player);
 if(previous&&message.at-previous.at<1000)throw Error('Wait a second before sending another message.');
 return [...messages,{...message,text:message.text.trim()}].slice(-100);
}
