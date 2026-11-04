import assert from 'node:assert/strict';
import {initial,act,buildAvailable} from '../lib/game.ts';
const g=initial();assert(!buildAvailable(g));assert.throws(()=>act(g,0,{type:'build',x:0,y:0}),/not available/);assert.throws(()=>act(g,0,{type:'skipBuild'}),/not available/);assert.equal(act(g,0,{type:'move',x:90,y:230}).used,20);console.log('No building phase: movement available immediately, retired build actions rejected.');
