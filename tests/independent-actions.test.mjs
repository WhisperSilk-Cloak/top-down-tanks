import assert from 'node:assert/strict';
import {initial,act,expireTurn,BUDGET} from '../lib/game.ts';
const base={...initial(),walls:[],round:7};
let g=act(base,0,{type:'move',x:270,y:250});assert.equal(g.used,BUDGET);assert.equal(g.turn,0);g=act({...g,resolutionUntil:0},0,{type:'fire',x:270,y:350});assert.equal(g.used,BUDGET);assert(g.deferredNext);assert.equal(expireTurn(g,g.resolutionUntil).turn,1);
g=act(base,0,{type:'fire',x:90,y:350});assert.equal(g.used,0);assert(g.fired);assert(g.deferredNext);
assert.throws(()=>act({...g,resolutionUntil:0},0,{type:'move',x:270,y:250}),/finish/);
assert.equal(expireTurn(g,g.resolutionUntil).turn,1);
g=act(base,0,{type:'move',x:210,y:250});g=act({...g,resolutionUntil:0},0,{type:'fire',x:210,y:350});assert.equal(g.used,120);assert(g.deferredNext);assert.equal(expireTurn(g,g.resolutionUntil).turn,1);
console.log('Movement then fire checks passed: full move, partial move, no move, no post-shot movement, automatic handoff.');
