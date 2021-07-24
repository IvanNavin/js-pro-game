const from = (x, fromX) => (x < fromX ? fromX : x);
const to = (x, toX) => (x > toX ? toX : x);

function clamp(x, fromX, toX) {
  let tempVariable = from(x, fromX);
  tempVariable = to(tempVariable, toX);
  return tempVariable;
}

export default clamp;
