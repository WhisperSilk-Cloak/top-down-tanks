import assert from 'node:assert/strict';
import {createGame,act,expireTurn,presentedGame,bounceDamage,ENEMY_TYPES} from '../lib/game.ts';
const tank=(x,y,hp=200)=>({x,y,hp,maxHp:200,angle:0});
const base={...createGame('coop'),offers:undefined,walls:[],tanks:[tank(100,100),tank(100,400)],enemies:[tank(300,100)]};
for(const mode of ['coop','pvp'])assert(createGame(mode).tanks.every(t=>t.hp===200&&t.maxHp===200));
assert.deepEqual([0,1,2,3,4,5].map(bounceDamage),[30,40,55,70,85,100]);
let g=act(base,0,{type:'fire',x:200,y:100,ammo:'bank'});assert.equal(g.enemies[0].hp,170);assert.equal(g.animation.impacts[0].damage,30);
let hit=g.animation.impacts[0];assert.equal(presentedGame(g,hit.at-1).enemies[0].hp,200);assert.equal(presentedGame(g,hit.at).enemies[0].hp,170);
// A reflected shot back toward its shooter has made exactly one bounce.
g=act({...base,enemies:[tank(500,400)]},0,{type:'fire',x:200,y:100});assert.equal(g.tanks[0].hp,160);assert.equal(g.animation.impacts[0].damage,40);
// Three direct spread shells hit a nearby wide target; health and impact presentation agree.
g=act({...base,enemies:[tank(170,100)]},0,{type:'fire',x:200,y:100,ammo:'spread'});assert.equal(g.enemies[0].hp,110);assert.equal(g.stats.total[0].hits,3);assert.equal(presentedGame(g,g.resolutionUntil-1).enemies[0].hp,110);
// Wave transitions heal/revive without scaling player maximum; enemy health follows fixed classes.
g=act({...base,tanks:[tank(100,100,190),tank(100,400,0)],enemies:[tank(170,100,10)]},0,{type:'fire',x:200,y:100});assert(g.nextLevelAt);let next=expireTurn(g,g.nextLevelAt);assert.deepEqual(next.tanks.map(t=>t.hp),[200,40]);assert(next.tanks.every(t=>t.maxHp===200));assert(next.enemies.every(t=>t.hp===ENEMY_TYPES[t.enemyType].hp&&t.maxHp===ENEMY_TYPES[t.enemyType].hp));
// AI direct fire follows the same damage rule.
g=act({...base,turn:1,enemies:[tank(300,100,60)]},1,{type:'end'});assert.equal(g.tanks[0].hp,170);assert.equal(g.animation.impacts[0].damage,30);
console.log('Health checks passed: equal fixed HP, actual bounce damage, arrival timing, spread, healing/revival, AI damage, fixed enemy classes.');
