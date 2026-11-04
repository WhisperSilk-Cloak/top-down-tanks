import assert from 'node:assert/strict';
import {initial,act,playerView,presentedGame} from '../lib/game.ts';
const base={...initial(),turn:1,walls:[],tanks:[{x:100,y:250,hp:3,angle:0},{x:330,y:160,hp:3,angle:0}]};
const g=act(base,1,{type:'move',x:330,y:340});const m=g.movement;
const observer=playerView(g,0,m.start),owner=playerView(g,1,m.start);
assert(observer.tanks[1].hidden);assert(!observer.movement);assert(observer.viewTrack);
for(const f of observer.viewTrack.frames)if(f.tank.hidden)assert.equal(f.tank.x,-1000);
for(const fraction of [0,.25,.5,.75,1]){
 const now=m.start+m.duration*fraction,a=presentedGame(observer,now),b=presentedGame(owner,now);
 if(fraction===0||fraction===1)assert(a.tanks[1].hidden);
 else{assert(!a.tanks[1].hidden);assert(Math.hypot(a.tanks[1].x-b.tanks[1].x,a.tanks[1].y-b.tanks[1].y)<.1);}
}
assert(playerView(g,0,m.start+m.duration).tanks[1].hidden);
// Moving observer must use the current viewpoint, not its destination.
const moving=act({...base,turn:0,tanks:[{x:100,y:250,hp:3,angle:0},{x:400,y:250,hp:3,angle:0}]},0,{type:'move',x:250,y:250});
assert(playerView(moving,0,moving.movement.start).tanks[1].hidden);
assert(!presentedGame(playerView(moving,0,moving.movement.start),moving.resolutionUntil).tanks[1].hidden);
console.log('Visibility motion passed: hidden-to-visible-to-hidden crossing, matching animated positions, no hidden route coordinates, moving observer uses live sight.');
