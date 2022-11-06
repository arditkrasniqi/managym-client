import Maps from "./Maps";

class AutoComplete extends Maps {
  constructor(location) {
    super(`autocomplete?text=${location}`);
  }

  getLocations() {
    const locations = this.data.features.map(feature => {
      return {
        name: feature.properties.formatted,
        lat: feature.properties.lat,
        lon: feature.properties.lon
      };
    });

    return locations;
  }
}

export default AutoComplete;
