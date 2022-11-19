import axios from 'axios'
import { initial } from 'lodash';

class MapsClient {
    static instance = null

    static getInstance(){
        if(!this.instance){
            this.instance = new MapsClient()
        }

        return this.instance
    }

    async init(location){
        this.api = `https://dev.virtualearth.net/REST/v1/Locations?key=${process.env.bing_api_key}&q=${location}`
        this.location = null;
        this.error = false;

        return new Promise((resolve, reject) => {
            axios.get(this.api + location)
            .then(data => {
                this.location = data.data
                resolve()
            })
            .catch(err => {
                this.error = err
                reject(err);
            })
        })
    }
    
    getLocationCoords(){
        const coords = this.location.resourceSets[0].resources[0].point.coordinates
        
        return Array.isArray(coords) ? coords : null
    }

    getLocations(){
        return this.location.resourceSets[0].resources
    }
    
}

export default MapsClient