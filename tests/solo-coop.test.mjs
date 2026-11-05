import assert from 'node:assert/strict';
import {createGame,act,expireTurn,forfeit} from '../lib/game.ts';
const originalNow=Date.now;let now=originalNow();Date.now=()=>now;
try {
 let g=createGame('coop',1);
 assert.equal(g.tanks.length,1);assert.equal(g.offers.length,1);assert.equal(g.winner,null);
 g=act(g,0,{type:'bonus',bonus:g.offers[0][0]});assert(!g.offers);
 // A solo turn hands off to one enemy, then returns to the same player.
 g.walls=[];g.tanks[0]={...g.tanks[0],x:100,y:100};g.enemies=[{x:800,y:500,hp:100,angle:0}];
 g=act(g,0,{type:'end'});assert.equal(g.activeEnemy,0);assert.equal(g.turn,0);assert.equal(g.winner,null);
 now=(g.resolutionUntil??now)+1;g=expireTurn(g,now);
 g.enemies.forEach(e=>e.hp=0);g=act(g,0,{type:'end'});assert(g.nextLevelAt);
 now=g.nextLevelAt+1;g=expireTurn(g,now);assert.equal(g.wave,2);assert.equal(g.tanks.length,1);assert.equal(g.offers.length,1);
 g=act(g,0,{type:'bonus',bonus:g.offers[0][0]});assert(!g.offers);
 const lost=forfeit(g,0);assert.notEqual(lost.winner,null);
 const fresh=act({...g,winner:2},0,{type:'rematchYes'});assert.equal(fresh.winner,null);assert.equal(fresh.wave,1);assert.equal(fresh.tanks.length,1);assert.equal(fresh.offers.length,1);
 console.log('Solo co-op: bonuses, enemy turn, wave transition, defeat and rematch passed.');
} finally {Date.now=originalNow;}
