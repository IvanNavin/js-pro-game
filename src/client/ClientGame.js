import ClientEngine from './ClientEngine';
import ClientWorld from './ClientWorld';

import sprites from '../configs/sprites';
import levelCfg from '../configs/world.json';
import gameObjects from '../configs/gameObjects.json';

class ClientGame {
  constructor(cfg) {
    Object.assign(this, {
      cfg,
      gameObjects,
      player: null,
    });

    this.engine = this.createEngine();
    this.world = this.createWorld();
    this.initEngine();
  }

  setPlayer(player) {
    this.player = player;
  }

  createEngine() {
    return new ClientEngine(document.getElementById(this.cfg.worldId));
  }

  createWorld() {
    return new ClientWorld(this, this.engine, levelCfg);
  }

  initEngine() {
    this.engine.loadSprites(sprites).then(() => {
      this.world.init();
      this.engine.on('render', (_, time) => {
        this.world.render(time);
      });
      this.engine.start();
      this.initKeys();
    });
  }

  moveByCell(dcol, drow) {
    this.player.moveByCellCoord(dcol, drow, (cell) => cell.findObjectsByType('grass').length);
  }

  initKeys() {
    this.engine.input.onKey({
      ArrowUp: (keydown) => keydown && this.moveByCell(0, -1),
      ArrowRight: (keydown) => keydown && this.moveByCell(1, 0),
      ArrowDown: (keydown) => keydown && this.moveByCell(0, 1),
      ArrowLeft: (keydown) => keydown && this.moveByCell(-1, 0),
    });
  }

  static init(cfg) {
    if (!ClientGame.game) {
      ClientGame.game = new ClientGame(cfg);
    }
  }
}

export default ClientGame;
