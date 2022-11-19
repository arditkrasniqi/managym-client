<template>
    <div>
        <h1 class="page-title">{{ $t('Search for a Trainer') }}</h1>
        <form @submit.prevent="searchTrainer">
            <div class="row">
                <div v-if="1 > 2" class="col-12 col-sm-5">
                    <div class="form-group">
                        <input type="text" id="trainerSearch" class="form-control" v-model="trainer"
                            :placeholder="$t('Search for a Trainer')">
                    </div>
                </div>
                <div class="col-12 col-sm-5">
                    <div class="form-group">
                        <input list="locationsList" v-validate="'required'" name="city" @keypress="citySearchOnChange"
                            :data-vv-as="$t('Location')" type="text" v-model="city" class="form-control"
                            autocomplete="off">
                        <datalist id="locationsList">
                            <option :key="location.name" v-for="location in locationsList">{{ location.name }}</option>
                        </datalist>
                        <span id="searchHint">{{ $t('Search for a City, Location or Place') }}</span>
                        <p v-show="errors.has('city')" class="text-danger">{{ errors.first('city') }}</p>
                        <div id="map"></div>
                    </div>
                </div>
                <div class="col-12 col-sm-2 col-xl-1">
                    <div class="form-group">
                        <button :disabled="!this.locationsList" type="submit" id="searchTrainerBtn"
                            class="btn btn-block primary-bg">
                            <i class="fa" :class="{ 'fa-search': !buttonSpin, 'fa-spin fa-spinner': buttonSpin }"></i>
                        </button>
                    </div>
                </div>
            </div>
        </form>
        <div class="card" v-if="trainersList !== ''">
            <div class="card-block">
                <div>
                    <div class="table-responsive">
                        <table class="table table-hover">
                            <thead>
                                <tr>
                                    <th>{{ $t('Name') }}</th>
                                    <th>{{ $t('Address') }}</th>
                                    <th>{{ $t('Type') }}</th>
                                    <th>{{ $t('Info') }}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="t in paginate.list" :key="t.id">
                                    <td>{{ t.name }}</td>
                                    <td>{{ t.location }}</td>
                                    <td>
                                        <span v-if="t.type === 'trainer'">{{ $t('Trainer') }}</span>
                                        <span v-else>{{ $t('Organisation') }}</span>
                                    </td>
                                    <td>
                                        <a v-if="t.type === 'trainer'" href="javascript:void(0)"
                                            @click="updateModal(t.id)" data-toggle="modal" :data-row="t.id"
                                            data-target="#trainerInfoModal">
                                            <i class="fa fa-user"></i>
                                        </a>
                                        <a href="javascript:void(0)" v-else>
                                            <router-link :to="`/organisations/${t.id}`">
                                                <i class="fa fa-arrow-right"></i>
                                            </router-link>
                                        </a>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div class="cf card-footer">
                <button :disabled="paginate.page == 1" class="btn primary-bg" @click="prevPage()"><i
                        class="fa fa-arrow-left"></i> {{ $t('Prev') }}
                </button>
                <span class="paginate-pages">{{ paginate.page }} / {{ paginate.pages }}</span>
                <button :disabled="paginate.page == paginate.pages" class="btn primary-bg pull-right"
                    @click="nextPage()">{{ $t('Next') }} <i class="fa fa-arrow-right"></i></button>
            </div>
        </div>
        <!-- Modal -->
        <div id="trainerInfoModal" class="modal fade" role="dialog">
            <div class="modal-dialog">

                <!-- Modal content-->
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal">&times;</button>
                        <h4 class="modal-title">{{ currentUser.firstname }} {{ currentUser.lastname }}</h4>
                    </div>
                    <div class="modal-body">
                        <div v-if="rewards !== 0">
                            <div class="row">
                                <div class="col-4">
                                    <img :src="storage + currentUser.avatar" alt=""
                                        class="img-responsive img-thumbnail">
                                </div>
                                <div class="col-8" id="curentUserInfo">
                                    <div class="row">
                                        <div class="col-12">
                                            <div class="row">
                                                <div class="col-6"><b>{{ $t('Firstname') }}</b></div>
                                                <div class="col-6">{{ currentUser.firstname }}</div>
                                            </div>
                                        </div>
                                        <div class="col-12">
                                            <div class="row">
                                                <div class="col-6"><b>{{ $t('Lastname') }}</b></div>
                                                <div class="col-6">{{ currentUser.lastname }}</div>
                                            </div>
                                        </div>
                                        <div class="col-12">
                                            <div class="row">
                                                <div class="col-6"><b>{{ $t('Location') }}</b></div>
                                                <div class="col-6">{{ currentUser.location }}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row" id="currentUserDesc">
                                <div class="col-12">
                                    <b>
                                        <p>{{ $t('Description') }}</p>
                                    </b>
                                    <p>
                                        <i>
                                            {{ currentUser.description }}
                                        </i>
                                    </p>
                                </div>
                            </div>
                            <div class="row" id="currentUserRewards">
                                <div class="col-12">
                                    <p><b>{{ $t('Rewards') }}</b></p>
                                    <p v-if="rewards.length < 1">
                                        {{ $t('No rewards') }}
                                    </p>
                                    <div>
                                        <p v-for="reward in rewards" :key="reward.id">
                                            <i class="fa fa-trophy"></i> {{ reward.description }}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <a @click="redirTrainerProfile" class="btn primary-bg"
                            data-dismiss="modal">{{ $t('View full Profile') }}</a>
                        <button type="button" class="btn btn-default" data-dismiss="modal">{{ $t('Close') }}</button>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>
<script>
import axios from "axios";
import { mapState } from 'vuex'
import AutoComplete from "../../../helpers/maps/AutoComplete";
import debounce from "debounce";
import Geocode from "../../../helpers/maps/Geocode";

export default {
    data() {
        return {
            storage: process.env.hostname + "/storage/",
            trainer: "",
            city: "",
            trainersList: "",
            paginate: {
                list: [],
                index: 0,
                lastIndex: 10, // lastIndex should be the same as perPage
                perPage: 10,
                pages: 0,
                page: 1
            },
            currentUser: "",
            rewards: 0,
            buttonSpin: false,
            user: null,
            locationsList: null
        };
    },
    created() {
        if (this.search.trainerList && this.search.trainerList.length > 0) {
            this.city = this.search.location;
            this.trainersList = this.search.trainerList;
            this.paginate.list = this.trainersList.slice(this.paginate.index, this.paginate.lastIndex);
            this.paginate.pages = Math.round(this.trainersList.length / this.paginate.perPage);
            if (this.paginate.pages < 1) {
                this.paginate.pages = 1;
            }
        }
    },
    mounted() {
    },
    computed: {
        ...mapState({
            userStore: state => state.user,
            search: state => state.loggedInTrainerSearch
        })
    },
    methods: {
        nextPage() {
            if (this.paginate.page + 1 <= this.trainersList.length / this.paginate.perPage) {
                this.paginate.page++;
            }
            this.paginate.index += this.paginate.perPage;
            this.paginate.lastIndex += this.paginate.perPage;
            if (this.paginate.lastIndex > this.trainersList.length) {
                this.paginate.lastIndex = this.trainersList.length;
                this.paginate.index = this.trainersList.length - this.paginate.perPage;
            }
            this.paginate.list = this.trainersList.slice(this.paginate.index, this.paginate.lastIndex);
        },
        prevPage() {
            if (this.paginate.page - 1 > 0) {
                this.paginate.page--;
            }
            this.paginate.index -= this.paginate.perPage;
            this.paginate.lastIndex -= this.paginate.perPage;
            if (this.paginate.index < 0) {
                this.paginate.index = 0;
                this.paginate.lastIndex = this.paginate.perPage;
            }
            this.paginate.list = this.trainersList.slice(this.paginate.index, this.paginate.lastIndex);
        },
        redirTrainerProfile() {
            // window.location.href='/trainer/'+this.currentUser.id;
            this.$router.push("trainer/" + this.currentUser.id);
        },
        searchTrainer: function () {
            this.trainersList = '';
            this.paginate.index = 0;
            if (this.city !== "") {

            }
            this.$validator.validateAll().then(async result => {
                if (result) {
                    if (this.city == "") {
                        return;
                    }

                    if (!this.locationsList || !this.locationsList.find(item => item.name == this.city)) {
                        alert(this.$t('Please a location from dropdown'))
                        return;
                    }

                    this.buttonSpin = true;
                    const client = new Geocode(this.city)
                    await client.init();
                    const coords = client.getCoords();

                    const trainersResponse = await axios
                        .post(`${process.env.api_hostname}/search-trainers`, {
                            latitude: coords.lat,
                            longitude: coords.lon
                        })
                    // get organisations
                    const orgsResponse = await axios
                        .post(`${process.env.api_hostname}/search-organisations`, {
                            latitude: coords.lat,
                            longitude: coords.lon
                        })

                    this.searchResponse(trainersResponse, 'trainers');
                    this.searchResponse(orgsResponse, 'organisations');
                }
            });
        },
        searchResponse(response, searchType) {
            let vm = this;
            if (typeof vm.trainersList === 'string') {
                if (response.data.hasOwnProperty('organisations')) {
                    vm.trainersList = response.data.organisations;
                } else {
                    vm.trainersList = response.data.data;
                }
            } else {
                if (response.data.hasOwnProperty('organisations')) {
                    response.data.organisations.map(org => {
                        vm.trainersList.push(org);
                    });
                } else {
                    response.data.data.map(trainer => {
                        vm.trainersList.push(trainer);
                    });
                }
            }
            vm.$store.dispatch('setTrainersSearchList', response.data.data);
            vm.$store.dispatch('setSearchLocation', vm.city)
            vm.paginate.list = vm.trainersList.slice(vm.paginate.index, vm.paginate.lastIndex);
            vm.paginate.pages = Math.round(vm.trainersList.length / vm.paginate.perPage);
            if (vm.paginate.pages < 1) {
                vm.paginate.pages = 1;
            }
            vm.buttonSpin = false;
        },
        updateModal: function (id) {
            this.rewards = 0;
            let vm = this;
            axios
                .post(process.env.api_hostname + "/trainerRewards", { id: id })
                .then(response => {
                    vm.rewards = response.data.rewards;
                });
            for (let x in this.trainersList) {
                if (this.trainersList[x].id == id) {
                    this.currentUser = this.trainersList[x];
                }
            }
        },
        citySearchOnChange: debounce(async function (e) {
            const client = new AutoComplete(this.city)
            await client.init();
            this.locationsList = client.getLocations()
        }, 1000),
        // searchTrainer: async function () {
        //     if (this.trainerSearch.city !== "") {
        //         if(!this.locationsList || !this.locationsList.find(item => item.name == this.trainerSearch.city)){
        //             alert('Please a location from dropdown')
        //             return;
        //         }

        //         this.trainerSearch.buttonSpin = true;

        //         const client = new Geocode(this.trainerSearch.city)
        //         await client.init();
        //         const coords = client.getCoords();

        //         axios.post(process.env.api_hostname + '/search-guest',{latitude: coords.lat, longitude: coords.lon})
        //             .then(response => {
        //                 this.$store.dispatch("setTrainers", response.data.data);
        //             });
        //     }
        // }
    }
};
</script>
<style lang="scss">
#trainerSearch {
    background-image: url("../../../assets/img/Search.png");
    background-repeat: no-repeat;
    background-position: 98% 50%;
    background-size: 26px 67%;
}

table {
    margin-top: 10px;
}

#searchHint {
    font-style: italic;
    color: gray;
    font-size: 13px;
}

.fa {
    font-size: 20px;
}

#curentUserInfo .row .col-6 {
    padding-top: 5px;
    padding-bottom: 5px;
}

#currentUserDesc {
    /*border-top:1px solid #ccc;*/
    /*margin-top:20px;*/
    padding-top: 20px;

    b p {
        margin-bottom: 5px;
    }
}

#currentUserRewards {
    background: #eaeaea;

    b p {
        margin-bottom: 5px;
    }

    div div p {
        margin: 5px;
        color: #2b2b2b;
        font-size: 15px;

        .fa {
            font-size: 15px;
            margin-right: 5px;
        }
    }
}

.card-block {
    padding: 20px;
}

.cf {
    position: relative;

    .paginate-pages {
        position: absolute;
        top: 19px;
        left: 0;
        right: 0;
        margin: 0 auto;
        width: 100px;
        text-align: center;
    }
}
</style>