const from = (x, fromX) => (x < fromX ? fromX : x);
const to = (x, toX) => (x > toX ? toX : x);

function clamp(x, fromX, toX) {
  let tempVariable = from(x, fromX);
  tempVariable = to(tempVariable, toX);
  return tempVariable;
}

export function animateEx(dx, startTime, currentTime, speed, looped = false) {
  const diff = currentTime - startTime;
  let time = (speed && diff / speed) || 0;

  if (looped) {
    time %= 1;
  } else if (time > 1) {
    time = 1;
  }

  return { offset: dx * time, progress: time };
}

export default clamp;
