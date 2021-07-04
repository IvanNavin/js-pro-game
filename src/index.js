import './index.scss';
import SenseiWalk from './assets/sprites/female/Female-3-Walk.png';
import RickSanchez from './assets/sprites/male/Rick_Sanchez.png';
import Pattern from './assets/pattern.jpg';
import RicksPattern from './assets/sprites/ricks-pattern.jpg';

class Game {
  constructor() {
    this.btns = document.querySelectorAll('[data-btn]');
    this.canvas = document.getElementById('game');
    this.canvasWidth = this.canvas.width;
    this.canvasHeight = this.canvas.height;
    this.ctx = this.canvas.getContext('2d');
    this.isRick = true;
    this.rick = document.createElement('img');
    this.rick.src = RickSanchez;
    this.female03 = document.createElement('img');
    this.female03.src = SenseiWalk;
    this.side = 0;
    this.bottomPressedUp = false;
    this.bottomPressedRight = false;
    this.bottomPressedDown = false;
    this.bottomPressedLeft = false;
    this.spriteSamuraiH = 48;
    this.spriteSamuraiW = 48;
    this.spriteRickH = 165;
    this.spriteRickW = 128;
    this.pY = this.canvasHeight / 2 - this.spriteW() / 2;
    this.pX = this.canvasWidth / 2 - this.spriteH() / 2;
    this.shots = this.isRick ? 4 : 3;
    this.cycle = 0;
    // (600 / 2) - (128 / 2)
    this.initListeners();
  }

  spriteW() {
    return this.isRick ? this.spriteRickW : this.spriteSamuraiW;
  }

  spriteH() {
    return this.isRick ? this.spriteRickH : this.spriteSamuraiH;
  }

  onKeyDown(e) {
    if (e.key === 'Up' || e.key === 'ArrowUp') {
      this.bottomPressedUp = true;
      this.side = this.isRick ? 495 : 144;
    } else if (e.key === 'Right' || e.key === 'ArrowRight') {
      this.bottomPressedRight = true;
      this.side = this.isRick ? 330 : 96;
    } else if (e.key === 'Down' || e.key === 'ArrowDown') {
      this.bottomPressedDown = true;
      this.side = 0;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
      this.bottomPressedLeft = true;
      this.side = this.isRick ? 165 : 48;
    }
  }

  onKeyUp(e) {
    if (e.key === 'Up' || e.key === 'ArrowUp') {
      this.bottomPressedUp = false;
    } else if (e.key === 'Right' || e.key === 'ArrowRight') {
      this.bottomPressedRight = false;
    } else if (e.key === 'Down' || e.key === 'ArrowDown') {
      this.bottomPressedDown = false;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
      this.bottomPressedLeft = false;
    }
  }

  move() {
    if (this.bottomPressedUp && this.pY > 0) this.pY -= 10;
    if (this.bottomPressedRight && this.pX < 600 - this.spriteW()) this.pX += 10;
    if (this.bottomPressedDown && this.pY < 590 - this.spriteH()) this.pY += 10;
    if (this.bottomPressedLeft && this.pX > 0) this.pX -= 10;
    if (this.bottomPressedUp
      || this.bottomPressedRight
      || this.bottomPressedDown
      || this.bottomPressedLeft) {
      this.cycle = (this.cycle + 1) % this.shots;
    }
  }

  choiceHero(e) {
    const { target } = e;
    this.isRick = target.classList.contains('rick');
    this.side = 0;
    this.shots = this.isRick ? 4 : 3;
    this.draw();
  }

  initListeners() {
    document.addEventListener('keydown', this.onKeyDown.bind(this));
    document.addEventListener('keyup', this.onKeyUp.bind(this));
    this.btns.forEach((btn) => btn.addEventListener('click', this.choiceHero.bind(this)));
  }

  customDrawImg(img) {
    return this.ctx.drawImage(
      img,
      this.cycle * this.spriteW(),
      this.side,
      this.spriteW(),
      this.spriteH(),
      this.pX,
      this.pY,
      this.spriteW(),
      this.spriteH(),
    );
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
    this.ctx.strokeRect(0, 0, this.canvasWidth, this.canvasHeight);
    this.customDrawImg(this.isRick ? this.rick : this.female03);
  }

  init() {
    const pattern = document.createElement('img');
    pattern.src = this.isRick ? RicksPattern : Pattern;

    window.addEventListener('load', () => {
      const background = this.ctx.createPattern(pattern, 'repeat');

      document.querySelector('h3').innerText = '';

      setInterval(() => {
        this.move();
        this.ctx.fillStyle = background;
        this.draw();
      }, 60);
    });
  }
}

const game = new Game();

game.init();
