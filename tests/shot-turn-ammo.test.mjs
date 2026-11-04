import assert from 'node:assert/strict';
import {initial,act,expireTurn,playerView,revealed,travelledPath} from '../lib/game.ts';
const base={...initial(),walls:[],tanks:[{x:90,y:100,hp:3,angle:0},{x:710,y:400,hp:3,angle:0}]};
for(const ammo of ['normal','bank','spread']){
 const g=act(base,0,{type:'fire',x:190,y:100,ammo});assert(g.deferredNext);assert.equal(g.turn,0);
 for(const type of ['move','fire','end'])assert.throws(()=>act({...g,resolutionUntil:0},0,{type,x:100,y:100}),/finish/);
 assert.equal(expireTurn(g,g.resolutionUntil-1),g);assert.equal(expireTurn(g,g.resolutionUntil).turn,1);
 assert.equal(g.ammoStock[0].bank,ammo==='bank'?1:2);assert.equal(g.ammoStock[0].spread,ammo==='spread'?0:1);
 assert.deepEqual(g.ammoStock[1],{bank:2,spread:1});
}
assert.throws(()=>act({...base,ammoStock:[{bank:0,spread:0},{bank:2,spread:1}]},0,{type:'fire',x:190,y:100,ammo:'bank'}),/No rounds/);
assert.throws(()=>act({...base,ammoStock:[{bank:0,spread:0},{bank:2,spread:1}]},0,{type:'fire',x:190,y:100,ammo:'spread'}),/No rounds/);
assert.doesNotThrow(()=>act({...base,ammoStock:[{bank:0,spread:0},{bank:2,spread:1}]},0,{type:'fire',x:190,y:100,ammo:'normal'}));
let g=act(base,0,{type:'fire',x:190,y:100});const r=g.reveals[0],start=r.startAt;
assert.deepEqual(travelledPath(r,start-1),[]);assert(!revealed(g,0,600,100,start));assert(!revealed(g,0,600,100,start+400));assert(revealed(g,0,600,100,start+1100));
assert.deepEqual(playerView(g,0,start).shots[0].path,g.shots[0].path,'own projectile route must not be shortened by polling');
assert(!g.explored[0].includes(5*40+30),'distant terrain not remembered at fire time');
const after=expireTurn(g,g.resolutionUntil);assert(after.explored[0].includes(5*40+30),'completed trail persists');
const bent={path:[{x:0,y:0},{x:100,y:0},{x:100,y:100}],startAt:1000,duration:2000};assert.deepEqual(travelledPath(bent,2500),[{x:0,y:0},{x:100,y:0},{x:100,y:50}]);
assert(!revealed({...g,round:4},0,600,100,start+10000));
console.log('Passed: all ammo ends turn, action lock, delayed handoff, stock limits, unlimited normal, per-player stock, progressive ricochet reveal, stable shell path, terrain memory, expiry.');
