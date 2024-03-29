window.addEventListener("resize", resize);

/**
 * The main map object
 */
const worldMap = new WorldMap(document.getElementById("map"), getSeedFromURL());

const BIOMES = {
  ocean: new OceanBiome(worldMap.generator.random),
  continent: new ContinentBiome(worldMap.generator.random, null, null),
  island: new IslandBiome(worldMap.generator.random, null, null),
  Tundra: new TundraBiome(worldMap.generator.random),
  Taiga: new TaigaBiome(worldMap.generator.random),
  Forest: new ForestBiome(worldMap.generator.random),
  Plain: new PlainBiome(worldMap.generator.random),
  Swamp: new SwampBiome(worldMap.generator.random),
  Jungle: new JungleBiome(worldMap.generator.random),
  Desert: new DesertBiome(worldMap.generator.random),
  Savana: new SavanaBiome(worldMap.generator.random),
  Mountain: new MountainBiome(worldMap.generator.random),
  Corrupted: new CorruptedBiome(worldMap.generator.random),
  Fairy: new FairyBiome(worldMap.generator.random),
};

worldMap
  .load()
  .then(() => {
    resize();
    console.log("Map loaded");
    worldMap.startRender();
    worldMap.controller.zoom(1);
  })
  .then(() => {
    let seed = worldMap.generator.seed;
    for (let element of document.getElementsByClassName("seed-placeholder")) {
      element.value = seed;
    }
  });

  $("#default-toggle").prop("checked", true);