// Extra member tokens stay in the private room record, never in game state.
export function memberTokens(row:{p0:string;p1:string|null}){if(!row.p1)return [row.p0];try{const rest=JSON.parse(row.p1);if(Array.isArray(rest)&&rest.every(v=>typeof v==='string'))return [row.p0,...rest];}catch{}return [row.p0,row.p1];}

import type {Game} from './game';
export function lobbySummary(row:{code:string;p0:string;p1:string|null;state:string;lastActive:number},now=Date.now()){
 const g:Game=JSON.parse(row.state);
 if(row.lastActive<now-120000||g.departed||g.winner!==null)return null;
 const count=memberTokens(row).length-(g.leftPlayers?.length??0);
 return {code:row.code,mode:g.mode==='coop'?'Co-op':'PvP',count,max:4,status:!g.lobby?'In progress':count>=4?'Full':'Waiting',joinable:!!g.lobby&&count<4};
}
