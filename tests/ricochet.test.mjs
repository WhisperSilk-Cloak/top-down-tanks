import assert from 'node:assert/strict';import {initial,bankShot,traceShot,act,buildError,snapBlock,clear} from '../lib/game.ts';
const tank=(x,y)=>({x,y,hp:3,angle:0});const near=(a,b)=>assert(Math.abs(a-b)<.01,`${a} != ${b}`);
let t=tank(100,100),o=tank(300,100);let shot=bankShot(t,200,8,o,[]);assert.equal(shot.path.length,3);assert.equal(shot.hitTank,0);near(shot.path[1].x,200);near(shot.path[1].y,8);
shot=bankShot(t,200,100,o,[]);assert.equal(shot.path.length,2);assert.equal(shot.hitTank,0);near(shot.ex,283);
shot=bankShot(t,100,0,o,[]);assert.equal(shot.hitTank,1);near(shot.ey,83);
shot=bankShot(t,110,0,tank(700,400),[]);assert.equal(shot.path.length,3);assert.equal(shot.hitTank,-1);near(shot.ey,492);
shot=bankShot(t,200,200,tank(700,100),[{x:200,y:150,w:40,h:100}]);near(shot.path[1].x,200);near(shot.path[1].y,200);near(shot.ex,8);near(shot.ey,392);
shot=bankShot(t,0,0,o,[]);assert.equal(shot.hitTank,1);near(shot.path[1].x,8);near(shot.path[1].y,8);
const g={...initial(),walls:[],buildDoneRound:1};for(const b of [{x:8,y:200,w:40,h:40},{x:752,y:200,w:40,h:40},{x:300,y:8,w:40,h:40},{x:300,y:452,w:40,h:40}])assert.equal(buildError(g,b),'');assert.equal(snapBlock(25,220,[]).x,8);assert(!clear(20,200,[]));
let state={...g,tanks:[t,o]};let result=act(state,0,{type:'fire',x:100,y:20});assert.equal(result.tanks[0].hp,2);assert.equal(result.used,0);assert.equal(result.shot.path.length,3);
result=act({...state,tanks:[{...t,hp:1},o]},0,{type:'fire',x:100,y:20});assert.equal(result.winner,1);
for(let i=0;i<200;i++){const r=initial(true),a=Math.random()*Math.PI*2,s=bankShot(r.tanks[0],90+100*Math.cos(a),250+100*Math.sin(a),r.tanks[1],r.walls);assert(s.path.length<=3);for(const p of s.path){assert(Number.isFinite(p.x)&&Number.isFinite(p.y));assert(p.x>=7.99&&p.x<=792.01&&p.y>=7.99&&p.y<=492.01);}}
console.log('Ricochet checks passed: border/wall/corner reflections, one-bounce cap, direct/banked/self hits, damage and cost, border building, 200 random trajectories.');
