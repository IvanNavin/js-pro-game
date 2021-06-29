import './index.scss';
import SenseiWalk from './assets/sprites/famale/Female-3-Walk.png';
import Pattern from './assets/pattern.jpg';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const spriteW = 48;
const spriteH = 48;
const shots = 3;
let cycle = 0;
let bottomPressedUp = false;
let bottomPressedRight = false;
let bottomPressedDown = false;
let bottomPressedLeft = false;
let side = 0;
let pY = 300;
let pX = 300;

function onKeyDown(e) {
  if (e.key === 'Up' || e.key === 'ArrowUp') {
    bottomPressedUp = true;
    side = 144;
  } else if (e.key === 'Right' || e.key === 'ArrowRight') {
    bottomPressedRight = true;
    side = 96;
  } else if (e.key === 'Down' || e.key === 'ArrowDown') {
    bottomPressedDown = true;
    side = 0;
  } else if (e.key === 'Lef' || e.key === 'ArrowLeft') {
    bottomPressedLeft = true;
    side = 48;
  }
}

function onKeyUp(e) {
  if (e.key === 'Up' || e.key === 'ArrowUp') {
    bottomPressedUp = false;
  } else if (e.key === 'Right' || e.key === 'ArrowRight') {
    bottomPressedRight = false;
  } else if (e.key === 'Down' || e.key === 'ArrowDown') {
    bottomPressedDown = false;
  } else if (e.key === 'Lef' || e.key === 'ArrowLeft') {
    bottomPressedLeft = false;
  }
}

function move() {
  if (bottomPressedUp && pY > 0) pY -= 10;
  if (bottomPressedRight && pX < 600 - spriteW) pX += 10;
  if (bottomPressedDown && pY < 600 - spriteW) pY += 10;
  if (bottomPressedLeft && pX > 0) pX -= 10;
  if (bottomPressedUp || bottomPressedRight || bottomPressedDown || bottomPressedLeft) {
    cycle = (cycle + 1) % shots;
  }
}

document.addEventListener('keydown', onKeyDown);
document.addEventListener('keyup', onKeyUp);

const hero = document.createElement('img');
hero.src = SenseiWalk;

const pattern = document.createElement('img');
pattern.src = Pattern;

window.addEventListener('load', () => {
  const background = ctx.createPattern(pattern, 'repeat');

  document.querySelector('h3').innerText = '';

  setInterval(() => {
    move();
    ctx.clearRect(0, 0, 600, 600);
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, 600, 600);
    ctx.strokeRect(0, 0, 600, 600);
    ctx.drawImage(hero, cycle * spriteW, side, spriteW, spriteH, pX, pY, spriteW, spriteH);
  }, 60);
});
