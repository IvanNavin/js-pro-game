import clamp, { animateEx } from './util';
import PositionedObject from './PositionedObject';

class MovableObject extends PositionedObject {
  constructor(cfg) {
    super(cfg);

    Object.assign(
      this,
      {
        toX: 0,
        toY: 0,
        deltaX: 0,
        deltaY: 0,

        speed: 0,

        motionStartTime: 0,
        motionProgress: 1,

        clampToMap: true, // by default the object should not fly off the map
      },
      cfg,
    );
  }

  animateMotion(time) {
    if (this.speed) {
      const me = this;

      const dx = animateEx(me.deltaX, me.motionStartTime, time, me.speed);
      const dy = animateEx(me.deltaY, me.motionStartTime, time, me.speed);

      const newX = me.toX + dx.offset - me.deltaX;
      const newY = me.toY + dy.offset - me.deltaY;

      me.motionProgress = dx.progress;

      if (newX === me.toX && newY === me.toY) {
        me.speed = 0;
        me.motionStartTime = 0;
        me.motionProgress = 1;
        me.trigger('motion-stopped');
      }

      me.x = newX;
      me.y = newY;
    }
  }

  render(time) {
    if (this.speed) this.animateMotion(time);
  }

  // eslint-disable-next-line no-unused-vars
  moveTo(x, y, smooth = true, speed = 200) {
    let [newX, newY] = [x, y];
    const { width, height } = this;

    if (this.clampToMap && this.engine) {
      const world = this.engine.game.getWorld();
      if (world) {
        // Make sure that the camera does not go beyond the boundaries of the world
        // upper left corner
        newX = clamp(x, 0, world.width - width);
        newY = clamp(y, 0, world.height - height);
      }
    }

    if (smooth) {
      this.startMotion(newX, newY, speed);
    } else {
      this.x = newX;
      this.y = newY;
    }
  }

  startMotion(newX, newY, speed) {
    if (this.world) {
      Object.assign(this, {
        motionStartTime: this.world.engine.lastRenderTime,
        speed,
        toX: newX,
        toY: newY,
        deltaX: newX - this.x,
        deltaY: newY - this.y,
      });
    }
  }
}

export default MovableObject;
