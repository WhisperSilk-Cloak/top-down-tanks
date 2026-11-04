import assert from 'node:assert/strict';
import {initial,act,expireTurn} from '../lib/game.ts';
const tank=(x,y,hp=3)=>({x,y,hp,angle:0});
for(const survivor of [0,1]){
 const dead=1-survivor;
 const base={...initial(),mode:'coop',wave:1,walls:[],turn:survivor,tanks:[tank(100,100),tank(100,400)],enemies:[tank(700,250)]};base.tanks[dead].hp=0;
 const after=act(base,survivor,{type:'end'});assert.equal(after.turn,survivor);assert.equal(after.used,0);assert(after.animation,'enemy phase occurs once per surviving player turn');
 for(const type of ['move','fire','end'])assert.throws(()=>act({...base,turn:dead},dead,{type,x:150,y:100}),/eliminated/);
 const resumed=expireTurn({...base,turn:dead});assert.equal(resumed.turn,survivor);
 const targetY=base.tanks[survivor].y;
 const kill=act({...base,enemies:[tank(200,targetY,1)]},survivor,{type:'fire',x:200,y:targetY});assert(kill.nextLevelAt);
 const next=expireTurn(kill,kill.nextLevelAt);assert.equal(next.wave,2);assert.equal(next.tanks[dead].hp,1);assert(next.tanks.every(t=>t.hp>0));
}
const lost=expireTurn({...initial(),mode:'coop',tanks:[tank(100,100,0),tank(100,400,0)]});assert.equal(lost.winner,2);
console.log('Co-op spectator checks passed: either survivor, eliminated action rejection, skipped turns, enemy phases, wave revival, team defeat.');
