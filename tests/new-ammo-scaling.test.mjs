import assert from 'node:assert/strict';
import {createGame,act,aimGuide,expireTurn,arenaSize,clear,ENEMY_TYPES,presentedGame} from '../lib/game.ts';
const tank=(x,y)=>({x,y,hp:1000,maxHp:1000,angle:0});
const shooter=tank(100,100),other=tank(600,100);
assert.equal(aimGuide(shooter,200,100,other,[]).ex,220);
assert.equal(aimGuide(shooter,200,100,other,[],'longshot').ex,583);
assert.equal(aimGuide(shooter,200,100,other,[{x:400,y:50,w:20,h:100}],'longshot').ex,400);
for(const mode of ['pvp','coop']){
 let g=createGame(mode);delete g.offers;g.walls=[];g.tanks=[tank(100,100),tank(100,400)];g.enemies=mode==='coop'?[tank(300,100),tank(380,100),tank(450,100)]:undefined;
 const long=act(g,0,{type:'fire',x:200,y:100,ammo:'longshot'});assert.equal(long.ammoStock[0].longshot,0);assert.equal(long.ammoStock[1].longshot,1);
 const w=act(g,0,{type:'fire',x:200,y:100,ammo:'wmd'});assert.equal(w.ammoStock[0].wmd,0);const detonation=w.shots[0].startAt+w.shots[0].duration;assert(w.animation.impacts.every(h=>h.at===detonation));assert(w.shots.slice(1).every(s=>s.startAt===detonation&&s.duration===0));assert(w.bursts.every(b=>b.at===detonation));assert.equal(w.shots.filter(s=>s.style==='fragment').length,3);assert(w.bursts.some(b=>b.radius===100));
 if(mode==='coop'){assert(w.shots.some(s=>s.style==='zap'));for(const hit of w.animation.impacts){assert(hit.damage<=60);assert.equal(presentedGame(w,hit.at-1).enemies[0].hp>=w.enemies[0].hp,true);}assert.equal(w.stats.total[0].shells,1);}
}
// No tank intercept: three bounces, four path legs. Fixed WMD contact damage after a bounce.
let g=createGame('coop');delete g.offers;g.walls=[];g.tanks=[tank(100,100),tank(100,400)];g.enemies=[tank(600,400)];
let w=act(g,0,{type:'fire',x:180,y:160,ammo:'wmd'});assert.equal(w.shots[0].path.length,5);
const direct=act({...g,enemies:[tank(300,100)]},0,{type:'fire',x:200,y:100,ammo:'wmd'});
assert.equal(direct.animation.impacts[0].damage,30);assert(w.animation.impacts.every(h=>h.damage<=60));
for(const count of [2,3,4])for(const wave of [1,2,3,4,8])for(let trial=0;trial<5;trial++){
 let s=createGame('coop',count);if(wave>1){s.wave=wave-1;s.nextLevelAt=1;s=expireTurn(s,Date.now());}
 const n=s.enemies.length,size=arenaSize(s.walls);assert.deepEqual(size,{width:1000+(n-2)*160,height:625+(n-2)*100});assert([...s.tanks,...s.enemies].every(t=>clear(t.x,t.y,s.walls)));
 s.enemies[0].hp=0;assert.deepEqual(arenaSize(s.walls),size);
}
assert.equal(ENEMY_TYPES.circle.move,120);assert(ENEMY_TYPES.circle.move>ENEMY_TYPES.triangle.move);
console.log('Longshot range/cover, both-mode inventory, WMD effects/timing/bounces, fixed damage, stable co-op arena sizing and safe spawns passed.');
