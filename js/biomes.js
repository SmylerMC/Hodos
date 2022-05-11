class Biome {
  #id;
  #biomePool;

  constructor() {
    this.#biomePool = "deafult";
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

  get id() {
    return this.#id;
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
  constructor() {
    this.biomePool = "Cold";
  }
  stay() {
    if (this.#random() < 0.7) {
      return "Tundra";
    } else {
      return "Taiga";
    }
  }
}
class TaigaBiome extends Biome {
  constructor() {
    this.biomePool = "Cold";
  }
  stay() {
    if (this.#random() < 0.3) {
      return "Tundra";
    } else {
      return "Taiga";
    }
  }
}

//Tempere
class ForestBiome extends Biome {
  constructor() {
    this.biomePool = "Temperate";
  }
  stay() {
    if (this.#random() < 0.7) {
      return "Forest";
    } else {
      return "Plain";
    }
  }
}
class PlainBiome extends Biome {
  constructor() {
    this.biomePool = "Temperate";
  }
  stay() {
    if (this.#random() < 0.3) {
      return "Forest";
    } else {
      return "Plain";
    }
  }
}

//Humide
class SwampBiome extends Biome {
  constructor() {
    this.biomePool = "Humid";
  }
  stay() {
    if (this.#random() < 0.6) {
      return "Swamp";
    } else {
      return "Jungle";
    }
  }
}
class JungleBiome extends Biome {
  constructor() {
    this.biomePool = "Humid";
  }
  stay() {
    if (this.#random() < 0.2) {
      return "Swamp";
    } else {
      return "Jungle";
    }
  }
}

//Desert
class DesertBiome extends Biome {
  constructor() {
    this.biomePool = "Dry";
  }
  stay() {
    if (this.#random() < 0.8) {
      return "Desert";
    } else {
      return "Savana";
    }
  }
}
class SavanaBiome extends Biome {
  constructor() {
    this.biomePool = "Dry";
  }
  stay() {
    if (this.#random() < 0.2) {
      return "Desert";
    } else {
      return "Savana";
    }
  }
}

//Mountain
class MountainBiome extends Biome {
  stay() {
    return 1;
  }
}

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

const BIOMESPOOL = {
  Temperate: ["Forest", "Plain"],
  Dry: ["Desert", "Savana"],
  Humid: ["Swamp", "Jungle"],
  Cold: ["Taiga", "Tundra"],
};
