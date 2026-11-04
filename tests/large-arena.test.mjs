import assert from 'node:assert/strict';
import {createGame,arenaSize,arenaBorder,clear,act,playerView,traceShot,canSee} from '../lib/game.ts';
for(const mode of ['pvp','coop'])for(const count of [2,3,4]){
 for(let trial=0;trial<8;trial++){
 const g=createGame(mode,count),large=mode==='pvp'&&count>2;
 assert.deepEqual(arenaSize(g.walls),mode==='coop'?{width:1000,height:625}:large?{width:1200,height:750}:{width:800,height:500});
 assert(g.tanks.every(t=>clear(t.x,t.y,g.walls)));
 if(large){for(let i=0;i<count;i++)for(let j=i+1;j<count;j++){assert(Math.hypot(g.tanks[i].x-g.tanks[j].x,g.tanks[i].y-g.tanks[j].y)>=590);assert(!canSee(g.tanks[i],g.tanks[j].x,g.tanks[j].y,g.walls));}assert(g.pickups.length);assert(g.pickups.every(v=>clear(v.x,v.y,g.walls)));}
 }
}
let g=createGame('pvp',4);g.walls=arenaBorder(g.walls);g.tanks[0]={x:900,y:500,hp:200,maxHp:200,angle:0};
g=act(g,0,{type:'move',x:1000,y:600});assert.equal(g.tanks[0].x,1000);assert.equal(g.tanks[0].y,600);
assert(!clear(1200,600,g.walls));assert(!clear(900,750,g.walls));
const r=traceShot({x:900,y:600,hp:200,angle:0},1000,600,{x:50,y:50,hp:200,angle:0},g.walls);assert.equal(r.ex,1192);
const view=playerView({...g,movement:undefined,resolutionUntil:undefined},0);assert(view.explored[0].some(n=>n>=1000));
console.log('Large arenas: 2-player/co-op unchanged, 590+ spawn spacing, safe pickups, movement past old boundary, real outer-wall collision, extended fog.');
