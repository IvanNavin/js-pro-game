import ClientEngine from './ClientEngine';
import ClientWorld from './ClientWorld';

import sprites from '../configs/sprites';
import levelCfg from '../configs/world.json';
import gameObjects from '../configs/gameObjects.json';
import ClientApi from './ClientApi';

class ClientGame {
  constructor(cfg) {
    Object.assign(this, {
      cfg,
      gameObjects: cfg.gameObjects || gameObjects,
      player: null,
      players: {},
      api: new ClientApi({
        game: this,
        ...cfg.apiCfg,
      }),
      spawnPoint: [],
    });

    this.api.connect();
    this.engine = this.createEngine();
    this.map = this.createWorld();
    this.initEngine();
  }

  setPlayer(player) {
    this.player = player;
  }

  createEngine() {
    return new ClientEngine(document.getElementById(this.cfg.tagID), this);
  }

  createWorld() {
    return new ClientWorld(this, this.engine, this.cfg.world || levelCfg);
  }

  getWorld() {
    return this.map;
  }

  initEngine() {
    this.engine.loadSprites(this.cfg.sprites || sprites).then(() => {
      this.map.init();
      this.engine.on('render', (_, time) => {
        this.player && this.engine.camera.focusGameObject(this.player);
        this.map.render(time);
      });
      this.engine.start();
      this.initKeys();
      this.engine.focus();
      this.api.join(this.cfg.playerName);
    });
  }

  movePlayerToDir(dir) {
    this.api.move(dir);
    // const dirs = {
    //   up: [0, -1],
    //   right: [1, 0],
    //   down: [0, 1],
    //   left: [-1, 0],
    // };
    //
    // const { player } = this;
    //
    // if (player && player.motionProgress === 1) {
    //   const canMovie = player.moveByCellCoord(
    //     dirs[dir][0],
    //     dirs[dir][1],
    //     (cell) => cell.findObjectsByType('grass').length,
    //   );
    //
    //   if (canMovie) {
    //     player.setState(dir);
    //     player.once('motion-stopped', () => player.setState('main'));
    //   }
    // }
  }

  setPlayers(playerList) {
    playerList.forEach((player) => this.createPlayer(player));
  }

  createCurrentPlayer(playerCfg) {
    const playerObj = this.createPlayer(playerCfg);

    this.setPlayer(playerObj);
  }

  createPlayer({ id, col, row, layer, skin, name }) {
    if (!this.players[id]) {
      const cell = this.map.cellAt(col, row);
      const playerObj = cell.createGameObject(
        {
          class: 'player',
          type: skin,
          playerId: id,
          playerName: name,
        },
        layer,
      );

      cell.addGameObject(playerObj);

      this.players[id] = playerObj;
    }

    return this.players[id];
  }

  initKeys() {
    this.engine.input.onKey({
      ArrowUp: (keydown) => keydown && this.movePlayerToDir('up'),
      ArrowRight: (keydown) => keydown && this.movePlayerToDir('right'),
      ArrowDown: (keydown) => keydown && this.movePlayerToDir('down'),
      ArrowLeft: (keydown) => keydown && this.movePlayerToDir('left'),
    });
  }

  getPlayerById(id) {
    return this.players[id];
  }

  addSpawnPoint(spawnPoint) {
    this.spawnPoint.push(spawnPoint);
  }

  removePlayerById(id) {
    const player = this.getPlayerById(id);

    if (player) {
      player.detouch();
      delete this.players[id];
    }
  }

  static init(cfg) {
    if (!ClientGame.game) {
      ClientGame.game = new ClientGame(cfg);
    }
  }
}

export default ClientGame;
