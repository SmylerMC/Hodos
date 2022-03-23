const resize = () => {
  worldMap.resize(window.innerWidth, window.innerHeight);
};

const getRandomInRange = (min, max) => {
  return Math.random() * (max - min) + min;
};

