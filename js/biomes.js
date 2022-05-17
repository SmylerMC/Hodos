/**
 * A generic Biome class actual biomes inherit from.
 */
class Biome {
  #id = BIOME_COUNTER.next();
  #biomePool;
  #random;

  constructor(random) {
    this.#random = random;
    this.#biomePool = "default";
  }

  isMaritime() {
    return !this.isContinent();
  }

  isContinent() {
    return true;
  }

  get biomePool() {
    return this.#biomePool;
  }

  /**
   * A unique id the renderer uses to refer to a specific biome.
   * Biome IDs are assigned automatically when they are instantiated.
   *
   * @returns {Number} this biome's ID
   */
  get id() {
    return this.#id;
  }

  get random() {
    return this.#random;
  }

  /**
   * The color of the map at a given point is calculated by interpolating between lowColor at altitude 0 and highColor at altitude 1.
   * @returns {GlColor}
   */
  get lowColor() {
    return new GlColor(0, 255, 0);
  }

  /**
   * The color of the map at a given point is calculated by interpolating between lowColor at altitude 0 and highColor at altitude 1.
   * @returns {GlColor}
   */
  get highColor() {
    return new GlColor(255, 255, 255);
  }

  stay() {
    return 1;
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
class TundraBiome extends Biome {
  biomePool;
  longitudeAverage;
  longitudeSigma;

  constructor(random) {
    super(random);
    this.biomePool = "Cold";
    this.longitudeAverage = 80;
    this.longitudeSigma = 4;
  }
  stay() {
    if (this.random() < 0.7) {
      return "Tundra";
    } else {
      return "Taiga";
    }
  }
}
class TaigaBiome extends Biome {
  biomePool;
  longitudeAverage;
  longitudeSigma;

  constructor(random) {
    super(random);
    this.biomePool = "Cold";
    this.longitudeAverage = 80;
    this.longitudeSigma = 4;
  }
  stay() {
    if (this.random() < 0.3) {
      return "Tundra";
    } else {
      return "Taiga";
    }
  }
}

//Tempere
class ForestBiome extends Biome {
  biomePool;
  longitudeAverage;
  longitudeSigma;

  constructor(random) {
    super(random);
    this.biomePool = "Temperate";
    this.longitudeAverage = 55;
    this.longitudeSigma = 12;
  }
  stay() {
    if (this.random() < 0.7) {
      return "Forest";
    } else {
      return "Plain";
    }
  }
}

class PlainBiome extends Biome {
  biomePool;
  longitudeAverage;
  longitudeSigma;

  constructor(random) {
    super(random);
    this.biomePool = "Temperate";
    this.longitudeAverage = 55;
    this.longitudeSigma = 12;
  }
  stay() {
    if (this.random() < 0.3) {
      return "Forest";
    } else {
      return "Plain";
    }
  }
}

//Humide
class SwampBiome extends Biome {
  biomePool;
  longitudeAverage;
  longitudeSigma;

  constructor(random) {
    super(random);
    this.biomePool = "Humid";
    this.longitudeAverage = 31;
    this.longitudeSigma = 4.5;
  }
  stay() {
    if (this.random() < 0.6) {
      return "Swamp";
    } else {
      return "Jungle";
    }
  }
}
class JungleBiome extends Biome {
  biomePool;
  longitudeAverage;
  longitudeSigma;

  constructor(random) {
    super(random);
    this.biomePool = "Humid";
    this.longitudeAverage = 31;
    this.longitudeSigma = 4.5;
  }
  stay() {
    if (this.random() < 0.2) {
      return "Swamp";
    } else {
      return "Jungle";
    }
  }
}

//Desert
class DesertBiome extends Biome {
  biomePool;
  longitudeAverage;
  longitudeSigma;

  constructor(random) {
    super(random);
    this.biomePool = "Dry";
    this.longitudeAverage = 17.5;
    this.longitudeSigma = 3.5;
  }
  stay() {
    if (this.random() < 0.8) {
      return "Desert";
    } else {
      return "Savana";
    }
  }
}
class SavanaBiome extends Biome {
  biomePool;
  longitudeAverage;
  longitudeSigma;

  constructor(random) {
    super(random);
    this.biomePool = "Dry";
    this.longitudeAverage = 17.5;
    this.longitudeSigma = 3.5;
  }
  stay() {
    if (this.random() < 0.2) {
      return "Desert";
    } else {
      return "Savana";
    }
  }
}

//Mountain
class MountainBiome extends Biome {
  biomePool;
  constructor(random) {
    super(random);
    this.biomePool = "Mountain";
  }
  stay() {
    return 1;
  }
}

const BIOMESPOOL = {
  Temperate: ["Forest", "Plain"],
  Dry: ["Desert", "Savana"],
  Humid: ["Swamp", "Jungle"],
  Cold: ["Taiga", "Tundra"],
};

const BIOME_COUNTER = new Counter(0);