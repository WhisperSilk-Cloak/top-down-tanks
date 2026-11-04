import assert from 'node:assert/strict';
import {createGame,initial,act,expireTurn,clear,BUDGET} from '../lib/game.ts';
const tank=(x,y,hp=3)=>({x,y,hp,angle:0});
let g={...initial(),walls:[],buildDoneRound:1,tanks:[tank(100,250),tank(700,400)]};
let r=act(g,0,{type:'fire',x:200,y:255,ammo:'bank'});assert(r.shot.path.length>3);assert(r.shot.path.length<=7);assert.equal(r.used,0);
r=act(g,0,{type:'fire',x:200,y:250,ammo:'spread'});assert.equal(r.shots.length,3);assert.equal(r.used,0);assert.throws(()=>act(r,0,{type:'fire',x:200,y:250}));
g.walls=[{x:200,y:200,w:30,h:100,secret:true}];r=act(g,0,{type:'fire',x:200,y:250});assert.equal(r.walls.length,0);assert.equal(g.walls.length,1);assert.equal(r.shot.path.length,2);
for(let i=0;i<100;i++){const s=createGame();assert(s.walls.length>=10);assert(new Set(s.walls.map(w=>Math.min(w.w,w.h))).size>=2);for(const t of s.tanks)assert(clear(t.x,t.y,s.walls));}
g=createGame('coop');g=act(g,0,{type:'bonus',bonus:g.offers[0][0]});g=act(g,1,{type:'bonus',bonus:g.offers[1][0]});assert.equal(g.enemies.length,2);assert.equal(g.wave,1);for(const t of [...g.tanks,...g.enemies])assert(clear(t.x,t.y,g.walls));
g={...g,tanks:[tank(100,100,200),tank(100,400,200)],enemies:[tank(600,100,200)],walls:[],round:7,turn:1,buildDoneRound:7};r=act(g,1,{type:'end'});assert.equal(r.turn,0);assert.equal(r.round,8);assert(r.shots.length>0);
g={...g,turn:0,tanks:[tank(100,100),tank(100,400)],enemies:[tank(200,100,1)]};r=act(g,0,{type:'fire',x:200,y:100});assert.equal(r.wave,1);assert(r.nextLevelAt);r=expireTurn(r,r.nextLevelAt);assert.equal(r.wave,2);assert(r.enemies.length>=2);assert.equal(r.winner,null);
g={...g,turn:1,turnEndsAt:Date.now()-1};r=expireTurn(g);assert.equal(r.turn,1);assert.equal(r.turnEndsAt,undefined);
assert.throws(()=>act({...g,turn:0,turnEndsAt:undefined},0,{type:'move',x:220,y:100}),/blocked/);
console.log('Expansion checks passed: ammo, costs, breach persistence, 100 varied layouts, co-op spawns, enemy phase, wave advance, timeout and collisions.');
