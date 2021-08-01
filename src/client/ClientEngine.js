import EventSourceMixin from '../common/EventSourceMixin';
import ClientCamera from './ClientCamera';
import ClientInput from './ClientInput';

class ClientEngine {
  constructor(canvas, game) {
    Object.assign(this, {
      canvas,
      ctx: canvas.getContext('2d'),
      imageLoaders: [],
      sprites: {},
      images: {},
      camera: new ClientCamera({ canvas, engine: this }),
      input: new ClientInput(canvas),
      game,
      startTime: 0,
      lastRenderTime: 0,
    });

    this.loop = this.loop.bind(this);
  }

  start() {
    this.loop();
  }

  loop(timestamp) {
    if (!this.startTime) {
      this.startTime = timestamp;
    }

    this.lastRenderTime = timestamp;

    const { ctx, canvas } = this;
    ctx.fillStyle = 'black';
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    this.trigger('render', timestamp);
    this.initNextFrame();
  }

  initNextFrame() {
    window.requestAnimationFrame(this.loop);
  }

  loadSprites(spriteGroup) {
    this.imageLoaders = [];

    Object.keys(spriteGroup).forEach((groupName) => {
      const group = spriteGroup[groupName];
      this.sprites[groupName] = group;

      Object.keys(group).forEach((spriteName) => {
        const { img } = group[spriteName];
        if (!this.images[img]) {
          this.imageLoaders.push(this.loadImage(img));
        }
      });
    });

    return Promise.all(this.imageLoaders);
  }

  loadImage(url) {
    return new Promise((resolve) => {
      const i = new Image();
      this.images[url] = i;
      i.onload = () => resolve(i);
      i.src = url;
    });
  }

  renderSpriteFrame({ sprite, frame, x, y, w, h }) {
    const spriteCfg = this.sprites[sprite[0]][sprite[1]];
    const [fx, fy, fw, fh] = spriteCfg.frames[frame];
    const img = this.images[spriteCfg.img];
    const { camera } = this;

    this.ctx.drawImage(img, fx, fy, fw, fh, x - camera.x, y - camera.y, w, h);
  }
}

Object.assign(ClientEngine.prototype, EventSourceMixin);

export default ClientEngine;
