import assert from 'node:assert/strict';
import {createGame,playerView,selectPlayerColor,TANK_COLORS} from '../lib/game.ts';
for(const count of [1,2,3,4]){
 const g=createGame('pvp',count);g.lobby=true;
 for(let p=0;p<count;p++){const v=playerView(g,p);assert(v.tanks.every(t=>t.hidden&&t.x===-1000&&t.y===-1000));assert(!v.animation&&!v.movement);assert.equal(v.pickups.length,0);}
 assert(g.tanks.every(t=>t.x>0));
}
let g=createGame('pvp',1);selectPlayerColor(g,0,'amber');
for(let p=1;p<4;p++){
 const next=createGame('pvp',p+1);next.playerColors=g.playerColors.slice();const available=Object.keys(TANK_COLORS).find(c=>!next.playerColors.includes(c));selectPlayerColor(next,p,available);g=next;
}
assert.equal(new Set(g.playerColors).size,4);assert.throws(()=>selectPlayerColor(g,3,'amber'),/taken/);
console.log('Lobby positions redacted for every player; all four slots receive a free color without rejecting joins.');
