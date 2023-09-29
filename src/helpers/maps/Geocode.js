import Maps from "./Maps";

class Geocode extends Maps {
  constructor(location) {
    super(`search?text=${location}`);
  }

  getCoords() {
    return {
      lat: this.data.features[0].properties.lat,
      lon: this.data.features[0].properties.lon
    };
  }
}

export default Geocode;
