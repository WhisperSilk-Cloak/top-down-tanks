import assert from 'node:assert/strict';
import {initial,act,expireTurn} from '../lib/game.ts';
const tank=(x,y,hp=100)=>({x,y,hp,angle:0});
const realNow=Date.now;let now=realNow();Date.now=()=>now;
try{
for(const dead of [-1,0,1]){
let g={...initial(),mode:'coop',wave:3,walls:[],turn:dead===0?1:0,tanks:[tank(80,100),tank(80,400)],enemies:[tank(700,80),tank(700,240,0),tank(700,420),tank(600,300)]};
if(dead>=0)g.tanks[dead].hp=0;
for(const expected of [0,2,3,0,2,3]){
const p=g.turn,before=structuredClone(g.enemies);
g=act(g,p,{type:'end'});
assert.equal(g.activeEnemy,expected);assert(g.shots.length<=1);assert(g.enemyMoves.every(m=>m.index===expected));
for(let i=0;i<before.length;i++)if(i!==expected)assert.deepEqual(g.enemies[i],before[i]);
assert.equal(g.turn,dead<0?1-p:p);
assert.throws(()=>act(g,g.turn,{type:'end'}),/finish/);
now=g.resolutionUntil+1;g=expireTurn(g,now);
}
}
let g={...initial(),mode:'coop',wave:1,walls:[],turn:0,tanks:[tank(80,100),tank(80,400)],enemies:[tank(700,100)]};
g=act(g,0,{type:'fire',x:180,y:100});assert.equal(g.activeEnemy,undefined);assert(g.deferredNext);
assert.equal(expireTurn(g,g.resolutionUntil-1),g);now=g.resolutionUntil+1;g=expireTurn(g,now);assert.equal(g.activeEnemy,0);assert.equal(g.turn,1);
console.log('Alternation passed: Teal first, one enemy per turn, living enemy rotation independent of human deaths, either survivor, locked enemy animation, delayed shot handoff.');
}finally{Date.now=realNow;}
