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
    return new ClientEngine(document.getElementById(this.cfg.worldId), this);
  }

  createWorld() {
    return new ClientWorld(this, this.engine, levelCfg);
  }

  getWorld() {
    return this.world;
  }

  initEngine() {
    this.engine.loadSprites(sprites).then(() => {
      this.world.init();
      this.engine.on('render', (_, time) => {
        this.engine.camera.focusGameObject(this.player);
        this.world.render(time);
      });
      this.engine.start();
      this.initKeys();
    });
  }

  movePlayerToDir(dir) {
    const dirs = {
      up: [0, -1],
      right: [1, 0],
      down: [0, 1],
      left: [-1, 0],
    };

    const { player } = this;

    if (player && player.motionProgress === 1) {
      const canMovie = player.moveByCellCoord(
        dirs[dir][0],
        dirs[dir][1],
        (cell) => cell.findObjectsByType('grass').length,
      );

      if (canMovie) {
        player.setState(dir);
        player.once('motion-stopped', () => player.setState('main'));
      }
    }
  }

  initKeys() {
    this.engine.input.onKey({
      ArrowUp: (keydown) => keydown && this.movePlayerToDir('up'),
      ArrowRight: (keydown) => keydown && this.movePlayerToDir('right'),
      ArrowDown: (keydown) => keydown && this.movePlayerToDir('down'),
      ArrowLeft: (keydown) => keydown && this.movePlayerToDir('left'),
    });
  }

  static init(cfg) {
    if (!ClientGame.game) {
      ClientGame.game = new ClientGame(cfg);
    }
  }
}

export default ClientGame;
