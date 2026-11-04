const originalRandom=Math.random;Math.random=()=>.5;
import assert from 'node:assert/strict';
import {createGame,expireTurn,act,ENEMY_TYPES,enemyLineup,presentedGame} from '../lib/game.ts';
const tank=(x,y)=>({x,y,hp:200,maxHp:200,shield:0,angle:0});
for(const wave of [1,2,3,4,5,6,20,100]){
let g=createGame('coop');if(wave>1){g.wave=wave-1;g.nextLevelAt=Date.now()-1;g=expireTurn(g);}
assert.deepEqual(g.enemies.map(e=>e.enemyType),enemyLineup(wave));
for(const e of g.enemies){const spec=ENEMY_TYPES[e.enemyType];assert.equal(e.hp,spec.hp);assert.equal(e.maxHp,spec.hp);assert.equal(e.shield,spec.shield);}
}
for(const enemyType of Object.keys(ENEMY_TYPES)){
const spec=ENEMY_TYPES[enemyType];let g={...createGame('coop'),offers:undefined,walls:[],tanks:[tank(100,100),tank(100,400)],enemies:[{x:300,y:100,hp:spec.hp,maxHp:spec.hp,shield:spec.shield,enemyType,angle:Math.PI}]};
const attack=act(g,0,{type:'end'});assert.equal(attack.tanks[0].hp,200-spec.damage);assert.equal(attack.animation.impacts[0].damage,spec.damage);
g=act(g,0,{type:'fire',x:200,y:100});assert.equal(g.enemies[0].shield,Math.max(0,spec.shield-30));assert.equal(g.enemies[0].hp,spec.hp-Math.max(0,30-spec.shield));
const hit=g.animation.impacts[0];assert.equal(presentedGame(g,hit.at-1).enemies[0].shield,spec.shield);assert.equal(presentedGame(g,hit.at).enemies[0].shield,g.enemies[0].shield);
}
console.log('Enemy classes: fixed stats through wave 100, planned mixes, class damage, shields and impact presentation.');

Math.random=originalRandom;
