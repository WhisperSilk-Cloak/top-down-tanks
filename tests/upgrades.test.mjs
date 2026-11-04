import assert from 'node:assert/strict';
import {createGame,act,expireTurn,damageTank,clear,playerView,presentedGame} from '../lib/game.ts';
const tank=(x,y,hp=200,shield=0)=>({x,y,hp,maxHp:200,shield,angle:0});
function ready(){const g=createGame('coop');delete g.offers;g.walls=[];g.tanks=[tank(100,100),tank(100,400)];g.enemies=[tank(250,100),tank(350,100),tank(450,100)];return g;}
let t=tank(0,0,200,25);damageTank(t,40);assert.equal(t.hp,185);assert.equal(t.shield,0);
let g=createGame('coop');assert(g.offers.every(v=>v.length===3&&new Set(v).size===3));assert.throws(()=>act(g,0,{type:'move',x:100,y:170}),/bonus/);g=act(g,1,{type:'bonus',bonus:g.offers[1][0]});assert(g.offers);assert.throws(()=>act(g,1,{type:'bonus',bonus:g.offers[1][0]}),/already/);g=act(g,0,{type:'bonus',bonus:g.offers[0][0]});assert(!g.offers);assert.equal(g.turn,0);
g=ready();g.offers=[['shield','heal','mobility'],['bank','chain','bomb']];g.choices=[null,null];g.tanks[0].shield=40;g=act(g,0,{type:'bonus',bonus:'shield'});assert.equal(g.tanks[0].shield,50);assert.equal(g.tanks[1].shield,0);const stock=g.ammoStock[0].chain;g=act(g,1,{type:'bonus',bonus:'chain'});assert.equal(g.ammoStock[0].chain,stock);assert.equal(g.ammoStock[1].chain,2);
g=act(ready(),0,{type:'fire',x:200,y:100,ammo:'piercing'});assert.deepEqual(g.enemies.map(t=>t.hp),[80,80,80]);assert.equal(g.ammoStock[0].piercing,0);assert.equal(g.ammoStock[1].piercing,1);assert.equal(g.stats.total[0].hits,1);
g=act(ready(),0,{type:'fire',x:200,y:100,ammo:'chain'});assert.deepEqual(g.animation.impacts.map(h=>h.index),[0,1,2,1]);assert.equal(g.animation.impacts.length,4);assert.equal(g.stats.total[0].hits,1);
let two=ready();two.enemies=two.enemies.slice(0,2);g=act(two,0,{type:'fire',x:200,y:100,ammo:'chain'});assert.deepEqual(g.animation.impacts.map(h=>h.index),[0,1,0,1]);
let blocked=ready();blocked.walls=[{x:290,y:20,w:20,h:180}];g=act(blocked,0,{type:'fire',x:200,y:100,ammo:'chain'});assert.equal(g.animation.impacts.length,1);
g=act(ready(),0,{type:'fire',x:200,y:100,ammo:'bomb'});assert(g.enemies[0].hp<200);assert.equal(g.enemies[2].hp,200);assert.equal(g.bursts[0].radius,100);
g=act(ready(),0,{type:'fire',x:200,y:100,ammo:'cluster'});assert.equal(g.shots.length,4);assert.equal(g.shots.filter(s=>s.style==='fragment').length,3);assert(g.shots.slice(1).every(s=>s.startAt>=g.shots[0].startAt+g.shots[0].duration));assert.deepEqual(playerView(g,0).shots,playerView(g,1).shots);
const first=g.animation.impacts[0];assert.equal(presentedGame(g,first.at-1).enemies[0].hp,200);
for(let i=0;i<8;i++){const pvp=createGame('pvp');assert.equal(pvp.pickups.length,1);assert(clear(pvp.pickups[0].x,pvp.pickups[0].y,pvp.walls));assert.equal(act(pvp,0,{type:'fire',x:pvp.tanks[0].x+100,y:pvp.tanks[0].y,ammo:'chain'}).ammoStock[0].chain,0);}
let pvp={...createGame('pvp'),walls:[],tanks:[tank(100,100),tank(700,400)],pickups:[{id:1,x:150,y:100,kind:'shield'}]};g=act(pvp,0,{type:'move',x:200,y:100});assert.equal(g.pickups.length,0);assert.equal(g.tanks[0].shield,25);assert.equal(g.tanks[1].shield,0);
console.log('Upgrades passed: cards, private inventory, shields, reachable pickups, piercing, chain preferences/revisits/walls, bomb, cluster and shared trajectories.');
