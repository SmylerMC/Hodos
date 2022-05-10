class Biome {

    #id

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

class ContinentBiome extends Biome {

}

const BIOMES = {
    "ocean": new OceanBiome(),
    "continent": new ContinentBiome()
}