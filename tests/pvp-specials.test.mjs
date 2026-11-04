import assert from 'node:assert/strict';
import {createGame,act,playerView,presentedGame} from '../lib/game.ts';
const tank=(x,y,hp=200,shield=0)=>({x,y,hp,maxHp:200,shield,angle:0});
const base={...createGame('pvp'),walls:[],pickups:[],tanks:[tank(100,100),tank(300,100)]};
for(const ammo of ['piercing','chain','bomb','cluster']){const g=act(base,0,{type:'fire',x:200,y:100,ammo});assert.equal(g.ammoStock[0][ammo],0);assert.equal(g.ammoStock[1][ammo],1);assert(g.tanks[1].hp<200);assert(g.deferredNext);}
let g=act(base,0,{type:'fire',x:200,y:100,ammo:'piercing'});assert.equal(g.shots[0].path.length,4);assert.equal(g.tanks[1].hp,80);assert.equal(g.tanks[0].hp,120);
const first=g.animation.impacts[0];assert.equal(presentedGame(g,first.at-1).tanks[1].hp,200);assert.equal(presentedGame(g,first.at).tanks[1].hp,160);
// Fire away from the opponent; Chain banks off the right border and hits on its return.
g=act({...base,tanks:[tank(300,100),tank(100,100)]},0,{type:'fire',x:400,y:100,ammo:'chain'});assert.equal(g.shots[0].path.length,3);assert.equal(g.tanks[1].hp,170);assert.equal(g.animation.impacts.length,1);
for(const [kind,hp,shield,label] of [['heal',190,0,'+10 HP'],['shield',200,40,'+10 Shield'],['piercing',200,0,'+1 Piercing ammo']]){g=act({...base,tanks:[tank(100,100,hp,shield),tank(700,400)],pickups:[{id:1,x:150,y:100,kind}]},0,{type:'move',x:200,y:100});assert.equal(g.pickupNotices.at(-1).text,label);assert.equal(playerView(g,1).pickupNotices.length,0);assert.equal(playerView(g,0).pickupNotices.length,1);}
console.log('PvP specials passed: both inventories, two Piercing bounces, banked Chain, impact timing, actual capped pickup amounts and private notices.');
