import assert from 'node:assert/strict';
import {createGame,act,expireTurn} from '../lib/game.ts';
const tank=(x,y,hp=200)=>({x,y,hp,maxHp:200,angle:0});
let now=Date.now();const original=Date.now;Date.now=()=>now;
try{
for(const victim of ['enemy','human','self']){
 let g={...createGame('coop'),offers:undefined,walls:[],tanks:[tank(100,100),tank(100,400)],enemies:[tank(700,400),tank(200,100,30)]};
 if(victim==='human'){g.enemies[1]=tank(700,300);g.tanks[1]=tank(200,100,30);}
 if(victim==='self'){g.enemies[1]=tank(700,300);g.tanks[0].hp=40;}
 g=act(g,0,{type:'fire',x:200,y:100});
 assert.equal(!!g.enemyTurnLost,victim==='enemy');
 now=g.resolutionUntil+1;g=expireTurn(g,now);
 if(victim==='enemy'){
 assert.equal(g.activeEnemy,undefined);assert.equal(g.turn,1);assert(!g.enemyTurnLost);
 g=act(g,1,{type:'end'});assert.equal(g.activeEnemy,0); // no repeat skip for the old corpse
 }else{assert.notEqual(g.activeEnemy,undefined);assert.equal(g.shots.length,1);}
 now=(g.resolutionUntil??now)+1;
}
}finally{Date.now=original;}
