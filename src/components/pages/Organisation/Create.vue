<template>
    <div>
        <h1 class="page-title">
            {{ $t('Add your organisation') }}
        </h1>
        <form @submit.prevent="create">
            <div class="card">
                <div class="card-block org-card">
                    <div class="form-group">
                        <label>{{ $t('Please let us know how your organisation is called') }}</label>
                        <input :class="{ 'form-control': true, 'is-invalid': errors.has('OrgName') }" type="text"
                            v-validate="'required'" v-model="organisation.name" name="OrgName"
                            :data-vv-as="$t('Organisation Name')" placeholder="GetFit Ltd.">
                        <span v-show="errors.has('OrgName')" class="text-danger">{{ errors.first('OrgName') }}</span>
                    </div>

                    <div class="form-group">
                        <label>{{ $t('Location') }}</label>
                        <input @keypress="citySearchOnChange" list="locationsList" name="location"
                            :data-vv-as="$t('Location')" v-model="organisation.location" type="text"
                            :placeholder="$t('Location')" class="form-control" autocomplete="off">
                        <datalist id="locationsList">
                            <option :key="location.name" v-for="location in locationsList">{{ location.name }}</option>
                        </datalist>
                        <span v-show="errors.has('location')" class="text-danger">{{ errors.first('location') }}</span>
                    </div>

                    <div class="form-group">
                        <label>{{ $t('Write a public description of your organisation') }}</label>
                        <textarea :class="{ 'form-control': true, 'is-invalid': errors.has('OrgDescription') }"
                            class="form-control" rows="5" v-validate="'required'" v-model="organisation.description"
                            :data-vv-as="$t('Organisation Description')" name="OrgDescription" type="text"
                            :placeholder="$t('What do you offer? Why should customer go to your organisation?')"></textarea>
                        <span v-show="errors.has('OrgDescription')"
                            class="text-danger">{{ errors.first('OrgDescription') }}</span>
                    </div>

                    <div class="form-group">
                        <label>{{ $t('Invite other trainers to your organisation') }}</label>
                        <div class="input-group">
                            <input v-model="trainer" type="email"
                                :class="{ 'form-control': true, 'is-invalid': errors.has('email') }"
                                :placeholder="$t('Email address')" @keypress.enter.prevent="addTrainer" name="email">
                            <span class="input-group-btn">
                                <button class="btn btn-secondary" type="button"
                                    @click="addTrainer">{{ $t('Add trainer') }}</button>
                            </span>
                        </div>
                        <span class="invalid-feedback email-wrong"
                            v-if="errors.has('email')">{{ errors.first('email') }}</span>
                    </div>

                    <div class="row">
                        <div class="col-md-6">
                            <div class="table-responsive">
                                <table class="table table-hover table-striped" v-if="organisation.trainers.length > 0">
                                    <thead>
                                        <th>{{ $t('E-Mail') }}</th>
                                        <th class="text-right">{{ $t('Actions') }}</th>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(trainer, key) in organisation.trainers">
                                            <td>{{ trainer }}</td>
                                            <td class="text-right">
                                                <button type="button" class="btn btn-danger btn-sm"
                                                    @click="organisation.trainers.splice(key, 1)">{{ $t('Remove') }}</button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card-footer">
                    <button type="submit" class="btn primary-bg"><i
                            :class="{ 'fa': true, 'fa-plus': !buttonSpin, 'fa-spinner fa-spin': buttonSpin }"></i>
                        {{ $t('Create organistaion') }}</button>
                </div>
            </div>
        </form>
    </div>
</template>

<script>
import axios from 'axios'
import { mapState } from 'vuex'
import AutoComplete from '../../../helpers/maps/AutoComplete';
import debounce from 'debounce';
import Geocode from '../../../helpers/maps/Geocode';

export default {
    data() {
        return {
            trainer: '',
            buttonSpin: false,
            organisation: {
                name: '',
                description: '',
                trainers: [],
                location: '',
                latitude: 0,
                longitude: 0
            },
            locationsList: null
        }
    },
    computed: {
        ...mapState({
            user: store => store.user
        })
    },
    mounted() {
    },
    methods: {
        citySearchOnChange: debounce(async function (e) {
            const client = new AutoComplete(this.organisation.location)
            await client.init();
            this.locationsList = client.getLocations()
        }, 1000),
        addTrainer() {
            if (this.errors.has('email')) {
                return false;
            }
            this.organisation.trainers.push(this.trainer);
            // Reset the input
            this.trainer = '';
        },
        create() {
            // this.organisation.trainers.push('');
            // let vm = this;
            // setTimeout(function () {
            //     vm.organisation.trainers.pop();
            // }, 100);
            // @todo Create an organisation on the API
            this.$validator.validateAll().then(async (result) => {
                if (result) {
                    this.buttonSpin = true;
                    let currentLocation = this.locationsList.find(item => item.name === this.organisation.location)
                    if (!currentLocation) {
                        alert(this.$t('Please a location from dropdown'))
                        // const client = new Geocode(this.organisation.location)
                        // await client.init();
                        // currentLocation = client.getCoords()
                    }

                    this.organisation.latitude = currentLocation.lat;
                    this.organisation.longitude = currentLocation.lon;
                    this.req(currentLocation.lat, currentLocation.lon, process.env.domain + '/organisations/');
                }
            });
        },
        req(lat, lng, hostname) {
            let userId = this.user.role == 'trainer' ? this.user.info.userId : this.user.info.id;
            axios.post(process.env.api_hostname + '/newOrganisation',
                {
                    hostname: hostname,
                    createdBy: userId,
                    name: this.organisation.name,
                    description: this.organisation.description,
                    status: null,
                    trainers: this.organisation.trainers,
                    location: this.organisation.location,
                    latitude: lat,
                    longitude: lng,
                    role: this.user.role
                })
                .then(response => {
                    if (response.data.statusCode == 200) {
                        this.$notify({
                            group: 'foo',
                            title: this.$t('Message'),
                            text: this.$t('Organisation created successfully!')
                        });
                        this.trainer = '';
                        this.organisation.trainers = [];
                        this.organisation.name = '';
                        this.organisation.description = '';
                        this.organisation.location = '';
                        this.organisation.latitude = 0;
                        this.organisation.longitude = 0;
                        this.buttonSpin = false;
                        $('.org-card').find('.text-danger').text('');
                        $('.org-card').find('input,textarea').css('border', '1px solid rgba(0,0,0,.15)');
                        // this.organisation.trainers = response.data.myOrgs;
                    }
                });
        }
    }
}
</script>

<style lang="scss" scoped>
textarea {
    resize: vertical;
}

.card-block {
    padding: 20px;
}
</style>