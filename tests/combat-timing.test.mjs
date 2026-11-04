import assert from 'node:assert/strict';
import {initial,act,presentedGame,expireTurn,enemyRoute,route,traceShot,clear} from '../lib/game.ts';
const tank=(x,y,hp=3)=>({x,y,hp,angle:0});
const base={...initial(),walls:[],round:7,buildDoneRound:7,tanks:[tank(100,100),tank(600,100,1)]};
let g=act(base,0,{type:'fire',x:200,y:100});const hit=g.animation.impacts[0];
assert.equal(presentedGame(g,hit.at-1).tanks[1].hp,1);assert.equal(presentedGame(g,hit.at).tanks[1].hp,0);assert(hit.destroyed);assert.equal(presentedGame(g,hit.at).winner,null);assert.equal(presentedGame(g,g.resolutionUntil).winner,0);
assert.equal(hit.at,g.shot.startAt+g.shot.duration);assert.throws(()=>act(g,0,{type:'end'}),/finish/);assert.equal(expireTurn(g,hit.at-1),g);
// The final kill must remain in the old level until impact, explosion and banner finish.
const coop={...base,mode:'coop',wave:1,tanks:[tank(100,100),tank(100,400)],enemies:[tank(600,100,1)]};
g=act(coop,0,{type:'fire',x:200,y:100});assert.equal(g.wave,1);assert.equal(g.enemies.length,1);assert(g.nextLevelAt>=g.resolutionUntil+3000);assert.equal(expireTurn(g,g.nextLevelAt-1),g);let next=expireTurn(g,g.nextLevelAt);assert.equal(next.wave,2);assert.deepEqual(next.tanks.map(t=>[t.x,t.y]),[[65,725/3],[65,725*2/3]]);assert(next.walls.length>0);assert.equal(next.turn,0);assert.equal(next.used,0);assert.equal(next.round,1);assert(!next.animation);assert(!next.shots.length);
for(const t of [...next.tanks,...next.enemies])assert(clear(t.x,t.y,next.walls));for(const e of next.enemies)for(const t of next.tanks)assert(Math.hypot(e.x-t.x,e.y-t.y)>34);
// A tall wall requires multi-turn routing; every edge is collision checked.
let ai={...coop,turn:1,walls:[{x:350,y:80,w:40,h:340}],enemies:[tank(600,250)],tanks:[tank(180,250),tank(100,400)]};
let path=enemyRoute(ai,ai.enemies[0]);assert(path.length>3);let previous=ai.enemies[0];for(const point of path){for(const t of ai.tanks)assert(route(previous,point.x,point.y,t,ai.walls));previous={...previous,...point};}assert(ai.tanks.some(t=>traceShot(previous,t.x,t.y,t,ai.walls).hit));
let fired=false;
for(let i=0;i<16;i++){ai={...ai,turn:1,round:7,turnEndsAt:undefined,resolutionUntil:undefined,animation:undefined};ai=act(ai,1,{type:'end'});for(const shot of ai.shots){const target=ai.tanks.find(t=>Math.hypot(t.x-shot.ex,t.y-shot.ey)<=17.01);assert(target);assert(traceShot({...tank(shot.x,shot.y)},target.x,target.y,target,ai.walls).hit);fired=true;}if(fired)break;}assert(fired,'AI should eventually navigate to a firing lane');
// A shot spending the last budget cannot be overwritten by enemy fire.
g=act({...coop,turn:1,used:180,tanks:[tank(100,400),tank(100,100)],enemies:[tank(600,100,3)]},1,{type:'fire',x:200,y:100});assert(g.deferredNext);assert.equal(g.turn,1);const playerShot=g.shot;assert.equal(expireTurn(g,g.resolutionUntil-1).shot,playerShot);next=expireTurn(g,g.resolutionUntil);assert.equal(next.turn,0);assert(!next.deferredNext);
console.log('Combat checks passed: impact timing, destruction, shared timestamps, input locks, delayed level reset, safe spawns, multi-turn wall navigation, clear-shot gating and separate enemy phase.');
// Every enemy receives the same future start after route planning; both views agree.
const planned=act({...coop,wave:3,turn:1,walls:[{x:350,y:80,w:40,h:340}],enemies:[tank(600,250,2),tank(700,400,2)]},1,{type:'end'});
assert(planned.enemyMoves.length);
const start=planned.enemyMoves[0].start;
for(const move of planned.enemyMoves){
 assert.equal(move.start,start);
 assert.equal(planned.animation.start,start+600);
 for(const at of [start-1,start,start+300,start+600,planned.resolutionUntil]){
  const a=presentedGame(structuredClone(planned),at),b=presentedGame(structuredClone(planned),at);
  assert.deepEqual(a.enemies,b.enemies);
  const expected=at<=start?move.path[0]:at>=start+600?move.path.at(-1):null;
  if(expected){assert.equal(a.enemies[move.index].x,expected.x);assert.equal(a.enemies[move.index].y,expected.y);}
 }
}
