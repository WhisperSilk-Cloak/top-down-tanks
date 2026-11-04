import assert from 'node:assert/strict';
import {createGame,act,expireTurn,forfeit,playerView,clear,selectPlayerColor} from '../lib/game.ts';
import {memberTokens} from '../lib/room-members.ts';
const tank=(x,y,hp=200)=>({x,y,hp,maxHp:200,angle:0,shield:0});
assert.deepEqual(memberTokens({p0:'a',p1:'legacy'}),['a','legacy']);assert.deepEqual(memberTokens({p0:'a',p1:'["b","c","d"]'}),['a','b','c','d']);
for(const count of [2,3,4])for(const mode of ['pvp','coop']){
 let g=createGame(mode,count);assert.equal(g.tanks.length,count);assert.equal(g.ammoStock.length,count);assert(g.tanks.every(t=>clear(t.x,t.y,g.walls)));
 if(mode==='coop'){assert.equal(g.offers.length,count);assert.equal(g.stats.total.length,count);for(let p=0;p<count;p++)g=act(g,p,{type:'bonus',bonus:g.offers[p][0]});assert(!g.offers);}
 g.winner=mode==='coop'?2:0;for(let p=0;p<count;p++){g=act(g,p,{type:'rematchYes'});if(p<count-1)assert.notEqual(g.winner,null);}assert.equal(g.winner,null);assert.equal(g.tanks.length,count);
}
let g={...createGame('pvp',4),walls:[],tanks:[tank(100,100),tank(700,400),tank(200,100,30),tank(700,300)]};
g=act(g,0,{type:'fire',x:200,y:100});assert.equal(g.tanks[2].hp,0);assert.equal(g.winner,null);g=expireTurn(g,g.resolutionUntil+1);delete g.resolutionUntil;assert.equal(g.turn,1);g=act(g,1,{type:'end'});assert.equal(g.turn,3);g=act(g,3,{type:'end'});assert.equal(g.turn,0);
g=forfeit(g,1);assert.equal(g.winner,null);g=forfeit(g,3);assert.equal(g.winner,0);
g={...createGame('pvp',4),walls:[],tanks:[tank(100,100),tank(200,100),tank(200,200),tank(700,400)]};assert.equal(playerView(g,0).tanks[1].hidden,undefined);assert.equal(playerView(g,0).tanks[2].hidden,undefined);assert.equal(playerView(g,0).tanks[3].hidden,true);
// Chain can visit more than one PvP rival.
g=act(g,0,{type:'fire',x:200,y:100,ammo:'chain'});assert(g.tanks[1].hp<200);assert(g.tanks[2].hp<200);assert.equal(g.tanks[3].hp,200);
g={...createGame('coop',4),offers:undefined,enemyTurnLost:true,walls:[],enemies:[tank(740,80,0),tank(740,400)],tanks:[tank(65,80),tank(65,190),tank(65,300),tank(65,410)]};g=act(g,0,{type:'end'});assert.equal(g.turn,1);assert.equal(g.activeEnemy,undefined);g=forfeit(g,1);assert.equal(g.turn,2);g.nextLevelAt=Date.now()-1;g=expireTurn(g);assert.equal(g.tanks[1].hp,0);assert(g.choices[1]);
console.log('2–4 players: supplies, cards, rematch votes, collision-free spawns, targeting, surviving turns, forfeits, fog and chain hits passed.');
