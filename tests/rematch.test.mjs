import assert from 'node:assert/strict';
import {createGame,act,clear,forfeit} from '../lib/game.ts';
const heights=new Set();
for(let n=0;n<100;n++){const g=createGame();const [a,b]=g.tanks;assert.equal(a.x,65);assert.equal(b.x,735);assert(Math.abs(a.y-b.y)>=100);for(const t of g.tanks)assert(clear(t.x,t.y,g.walls));heights.add(a.y);}
assert(heights.size>20);
const ended={...createGame(),winner:0,turnEndsAt:1,used:120,fired:true,ammoStock:[{bank:0,spread:0},{bank:0,spread:0}]};
const yes=act(ended,1,{type:'rematchYes'});assert.equal(yes.winner,0);assert(yes.rematchVotes[1]);
const fresh=act(yes,0,{type:'rematchYes'});assert.equal(fresh.winner,null);assert.equal(fresh.matchNumber,2);assert.equal(fresh.used,0);assert(!fresh.fired);assert.deepEqual(fresh.ammoStock,Array.from({length:2},()=>({bank:2,spread:1,piercing:1,chain:1,bomb:1,cluster:1,longshot:1,wmd:1})));assert(fresh.turnEndsAt>Date.now());assert.notDeepEqual(fresh.walls,ended.walls);assert(!fresh.rematchVotes);assert(fresh.tanks.every(t=>t.hp===200));
const no=act(yes,0,{type:'rematchNo'});assert.equal(no.winner,0);assert.throws(()=>act(no,1,{type:'rematchYes'}),/declined/);
assert.throws(()=>act(forfeit(ended,0),1,{type:'rematchYes'}),/left/);assert.throws(()=>act(createGame(),0,{type:'rematchYes'}),/Finish/);
const coop=act(act({...createGame('coop'),winner:2},0,{type:'rematchYes'}),1,{type:'rematchYes'});assert.equal(coop.mode,'coop');assert.equal(coop.wave,1);assert.equal(coop.turnEndsAt,undefined);
console.log('Rematch checks passed: unanimous vote, decline, departed player, expired timer, fresh arena, health/ammo reset, co-op restart, 100 collision-free varied spawns.');
