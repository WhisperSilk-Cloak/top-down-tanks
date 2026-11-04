import assert from 'node:assert/strict';
import {createGame,act,expireTurn} from '../lib/game.ts';
let now=Date.now();const realNow=Date.now,random=Math.random;Date.now=()=>now;
try{
 let g=createGame('coop',4);assert.deepEqual(g.pickups,[]);assert.equal(g.coopHumanTurns,0);delete g.offers;
 const end=()=>{g.enemyTurnLost=true;g=act(g,g.turn,{type:'end'});};
 Math.random=()=>0;
 end();assert.equal(g.pickups.length,0);end();assert.equal(g.pickups.length,1);assert.equal(g.pickups[0].kind,'heal');
 const unchanged=expireTurn(g,now+1000);assert.equal(unchanged.coopHumanTurns,2);assert.equal(unchanged.pickups.length,1);
 Math.random=()=>.4;end();end();assert.equal(g.pickups[1].kind,'shield');
 Math.random=()=>.9;end();end();assert.equal(g.pickups[2].kind,'wmd');
 for(let i=0;i<4;i++)end();assert.equal(g.pickups.length,3);
 g.pickups.pop();end();assert.equal(g.pickups.length,2);end();assert.equal(g.pickups.length,3);assert.equal(g.coopHumanTurns,12);
 for(const v of g.pickups)assert(g.enemies.every(e=>e.hp<=0||Math.hypot(e.x-v.x,e.y-v.y)>45));
 // A skipped eliminated player is not a completed human turn.
 g.tanks[g.turn].hp=0;g.enemyTurnLost=true;g=expireTurn(g,now);assert.equal(g.coopHumanTurns,12);
 g.nextLevelAt=now;g=expireTurn(g,now);assert.equal(g.wave,2);assert.deepEqual(g.pickups,[]);assert.equal(g.coopHumanTurns,0);

 let h=createGame('coop');delete h.offers;h.walls=[];h.enemies=[{x:700,y:400,hp:200,angle:0}];h.tanks=[{x:100,y:100,hp:100,maxHp:200,angle:0},{x:100,y:400,hp:200,angle:0}];h.coopHumanTurns=1;h.pickups=[{id:1,x:130,y:100,kind:'heal'}];
 h=act(h,0,{type:'move',x:150,y:100});assert.equal(h.pickups.length,0);assert.equal(h.tanks[0].hp,150);assert.equal(h.coopHumanTurns,1);
 now=h.resolutionUntil+1;h=expireTurn(h,now);assert.equal(h.coopHumanTurns,1);
 h=act(h,0,{type:'fire',x:250,y:100});assert.equal(h.coopHumanTurns,1);
 now=h.resolutionUntil+1;h=expireTurn(h,now);assert.equal(h.coopHumanTurns,2);assert.equal(h.pickups.length,1);
 now=(h.resolutionUntil??now)+1;h=expireTurn(h,now);assert.equal(h.coopHumanTurns,2);assert.equal(h.pickups.length,1);
 assert.equal(createGame('pvp').pickups.length,1);
}finally{Date.now=realNow;Math.random=random;}
console.log('Co-op pickups: empty waves, even human turns, category selection, cap, skipped ticks, dead slots, safe positions and wave reset.');
