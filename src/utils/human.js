
function inches (input, shortform) {
  input = Number(input);

  const ft = Math.floor(input / 12);
  const inches = input % 12;

  if (ft) return shortform ? `${ft}'${inches}"` : `${ft} ft ${inches} in`;
  return shortform ? `${inches}"` : `${inches} in`;
}

function feet (input, shortform) {
  input = Number(input);

  const ft = Math.floor(input);
  const inches = (input % 1 * 12).toFixed(2);

  if (ft) return shortform ? `${ft}'${inches}"` : `${ft} ft ${inches} in`;
  return shortform ? `${inches}"` : `${inches} in`;
}

export default {
  feet,
  inches,
};

export {
  feet,
  inches,
}
