/**
 * A generic Biome class actual biomes inherit from.
 */
class Biome {
  #id = BIOME_COUNTER.next();
  #biomePool;
  #random;
  #lowColor;
  #highColor;

  constructor(random, lowColor, highColor) {
    this.#random = random;
    this.#biomePool = "default";
    this.#lowColor = lowColor ? lowColor : new GlColor(0, 0, 0);
    this.#highColor = highColor ? highColor : new GlColor(1, 1, 1);
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
    return this.#lowColor;
  }

  /**
   * The color of the map at a given point is calculated by interpolating between lowColor at altitude 0 and highColor at altitude 1.
   * @returns {GlColor}
   */
  get highColor() {
    return this.#highColor;
  }

  stay() {
    return 1;
  }

}

class OceanBiome extends Biome {
  constructor() {
    super(null, new GlColor(0.28,0.47,0.53), new GlColor(0.28,0.47,0.53));
  }
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
    super(random, new GlColor(0.94,0.97,0.97), new GlColor(0.8,0.82,0.82));
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
    super(random, new GlColor(0.83,0.93,0.98), new GlColor(0.49,0.73,0.75));
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
    super(random, new GlColor(0.21,0.65,0.35), new GlColor(0.15,0.47,0.25));
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
    super(random, new GlColor(0.74,0.91,0.55), new GlColor(0.57,0.67,0.46));
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
    super(random, new GlColor(0.45,0.5,0.3), new GlColor(0.33,0.35,0.25));
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
    super(random, new GlColor(0.22,0.37,0.07), new GlColor(0.16,0.27,0.05));
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
    super(random, new GlColor(0.94,0.82,0.58), new GlColor(0.74,0.65,0.49));
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
    super(random, new GlColor(0.97,0.89,0.29), new GlColor(0.67,0.63,0.36));
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
    super(random, new GlColor(0.27,0.25,0.21), new GlColor(0.72,0.71,0.67));
    this.biomePool = "Mountain";
  }
  stay() {
    return 1;
  }
}

//Corrupted
class CorruptedBiome extends Biome {
  biomePool;
  constructor(random) {
    super(random, new GlColor(0.43,0.12,0.12), new GlColor(0.19,0.1,0.1));
    this.biomePool = "Special";
  }
  stay() {
    return 1;
  }
}

//Fairy
class FairyBiome extends Biome {
  biomePool;
  constructor(random) {
    super(random, new GlColor(0.9,0.79,0.87), new GlColor(0.64,0.48,0.59));
    this.biomePool = "Special";
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