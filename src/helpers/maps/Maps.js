class Maps {
  constructor(location) {
    this.api = "https://api.geoapify.com/v1/geocode/";
    this.key = process.env.geoapify_key;
    this.error = null;
    this.data = null;
    this.location = location;
  }

  async init() {
    return new Promise((resolve, reject) => {
      fetch(`${this.api}${this.location}&apiKey=${this.key}`)
        .then(response => response.json())
        .then(data => {
          this.data = data;
          resolve();
        })
        .catch(err => {
          this.error = err;
          reject(err);
        });
    });
  }
}

export default Maps;
