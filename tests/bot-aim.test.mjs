import assert from 'node:assert/strict';
import {createGame,planEnemyAim,traceEnemyShot,act,presentedGame} from '../lib/game.ts';
const tank=(x,y)=>({x,y,hp:200,maxHp:200,angle:0});
const enemy={...tank(650,250),enemyType:'triangle',angle:0};
let g={...createGame('coop'),offers:undefined,walls:[{x:390,y:200,w:20,h:100}],tanks:[tank(150,250),{...tank(60,450),hp:0}],enemies:[enemy]};
const plan=planEnemyAim(g,enemy);assert(plan);assert.equal(plan.bounces,1);assert.equal(traceEnemyShot(g,enemy,plan.angle,1).hit,g.tanks[0]);
const original=Math.random;
try{
 Math.random=()=>.5;
 g=act(g,0,{type:'end'});const a=g.enemyAim;assert(a);assert.equal(g.shots[0].path.length,3);assert.equal(g.shots[0].startAt,a.start+a.duration);
 assert.equal(presentedGame(g,a.start).enemies[0].angle,a.from);
 const delta=Math.atan2(Math.sin(a.to-a.from),Math.cos(a.to-a.from));assert(Math.abs(presentedGame(g,a.start+a.duration/2).enemies[0].angle-(a.from+delta/2))<1e-6);
 const path=g.shots[0].path;assert(Math.abs(Math.sin(a.to-Math.atan2(path[1].y-path[0].y,path[1].x-path[0].x)))<1e-6);
 const seed={...createGame('coop'),offers:undefined,walls:[],tanks:[tank(100,250),{...tank(60,450),hp:0}],enemies:[{...tank(700,250),enemyType:'circle'}]};
 Math.random=()=>.999;const miss=act(seed,0,{type:'end'});assert.equal(miss.tanks[0].hp,200);assert.equal(miss.shots.length,1);
 Math.random=()=>.5;const hit=act(seed,0,{type:'end'});assert.equal(hit.tanks[0].hp,170);
 const heavy=act({...seed,enemies:[{...seed.enemies[0],enemyType:'square'}]},0,{type:'end'});assert(heavy.enemyAim.duration>hit.enemyAim.duration);
}finally{Math.random=original;}
console.log('Bot aiming: blocked direct shot uses bank, turret reaches actual firing angle, server-timed rotation, shots can miss, heavies turn slower.');
