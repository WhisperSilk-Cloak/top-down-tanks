import assert from 'node:assert/strict';
import {createGame,selectPlayerColor,playerColor,act,playerView} from '../lib/game.ts';
for(const mode of ['pvp','coop']){
let g=createGame(mode);selectPlayerColor(g,0,'violet');selectPlayerColor(g,1,'blue');
assert.equal(playerColor(g,0).name,'Violet');assert.equal(playerColor(g,1).name,'Blue');
assert.throws(()=>selectPlayerColor(g,1,'violet'),/taken/);
assert.throws(()=>selectPlayerColor(g,0,'__proto__'),/valid/);
assert.deepEqual(playerView(g,1).playerColors,['violet','blue']);
assert.equal(g.tanks[0].hp,g.tanks[1].hp);
g.winner=0;delete g.offers;delete g.turnEndsAt;
g=act(g,0,{type:'rematchYes'});g=act(g,1,{type:'rematchYes'});
assert.deepEqual(g.playerColors,['violet','blue']);
}
let g=createGame('pvp',1);selectPlayerColor(g,0,'amber');assert.equal(g.playerColors[0],'amber');
