const getRandomInRange = (min, max) => {
  return Math.random() * (max - min) + min;
};

const resize = () => {
  worldMap.resize(window.innerWidth, window.innerHeight);
};
