class Biome {
  #id;

  isMaritime() {
    return !this.isContinent();
  }

  isContinent() {
    return true;
  }

  get id() {
    return this.#id;
  }
}

class OceanBiome extends Biome {
  isContinent() {
    return false;
  }
}

class ContinentBiome extends Biome {}

class IslandBiome extends Biome {}

//Froid
class TundraBiome extends Biome {}
class TaigaBiome extends Biome {}

//Tempere
class ForestBiome extends Biome {}
class PlainBiome extends Biome {}

//Humide
class SwampBiome extends Biome {}
class JungleBiome extends Biome {}

//Desert
class DesertBiome extends Biome {}
class SavanaBiome extends Biome {}

//Mountain
class MountainBiome extends Biome {}

const BIOMES = {
  ocean: new OceanBiome(),
  continent: new ContinentBiome(),
  island: new IslandBiome(),
  Tundra: new TundraBiome(),
  Taiga: new TaigaBiome(),
  Forest: new ForestBiome(),
  Plain: new PlainBiome(),
  Swamp: new SwampBiome(),
  Jungle: new JungleBiome(),
  Desert: new DesertBiome(),
  Savana: new SavanaBiome(),
  Mountain: new MountainBiome(),
};
