<template>
    <div class="card">
        <h4 class="card-header">
            {{ $t('Account Settings') }}
        </h4>
        <form @submit.prevent="updateInfo">
            <div class="card-block">
                <div class="col-12">
                    <div class="row">
                        <div class="col-12 col-sm-6 form-group">
                            <label>{{ $t('Firstname') }}</label>
                            <input v-validate="'required'" v-model="user.firstname" name="firstname"
                                :data-vv-as="$t('Firstname')" type="text" class="form-control">
                            <span v-show="errors.has('firstname')"
                                class="text-danger">{{ errors.first('firstname') }}</span>
                        </div>
                        <div class="col-12 col-sm-6 form-group">
                            <label>{{ $t('Lastname') }}</label>
                            <input v-validate="'required'" v-model="user.lastname" name="lastname"
                                :data-vv-as="$t('Lastname')" type="text" class="form-control">
                            <span v-show="errors.has('lastname')"
                                class="text-danger">{{ errors.first('lastname') }}</span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>{{ $t('Email') }}</label>
                        <input v-validate="'required|email'" v-model="user.email" type="text" name="email"
                            :data-vv-as="$t('Email')" class="form-control">
                        <span v-show="errors.has('email')" class="text-danger">{{ errors.first('email') }}</span>
                    </div>
                    <div v-if="userStore.role == 'trainer'">
                        <div class="form-group">
                            <label>{{ $t('Location') }}</label>
                            <input list="locationsList" v-validate="'required'" v-model="user.location" type="text"
                                name="location" :data-vv-as="$t('Location')" @keypress="citySearchOnChange"
                                class="form-control">
                            <div v-if="locationSpinner">
                                <i class="fa fa-spinner fa-spin"></i>
                            </div>
                            <datalist id="locationsList">
                                <option :key="location.name" v-for="location in locationsList">{{ location.name }}
                                </option>
                            </datalist>
                            <span v-show="errors.has('location')"
                                class="text-danger">{{ errors.first('location') }}</span>
                        </div>
                        <div class="form-group">
                            <label>{{ $t('Description') }}</label>
                            <textarea v-validate="'required'" v-model="user.description" name="description"
                                :data-vv-as="$t('Description')" type="text" class="form-control"></textarea>
                            <span v-show="errors.has('description')"
                                class="text-danger">{{ errors.first('description') }}</span>
                        </div>
                        <div class="row">
                            <div class="col-12 col-sm-6 form-group">
                                <label>{{ $t('Available') }}</label>
                                <input v-validate="'required|numeric'" v-model="user.availableFrom" name="availableFrom"
                                    :data-vv-as="$t('Available from')" type="number" class="form-control"
                                    placeholder="From">
                                <span v-show="errors.has('availableFrom')"
                                    class="text-danger">{{ errors.first('availableFrom') }}</span>
                            </div>
                            <div class="col-12 col-sm-6 form-group">
                                <label>&nbsp;</label>
                                <input v-validate="'required|numeric'" v-model="user.availableTo" name="availableTo"
                                    :data-vv-as="$t('Available to')" type="number" class="form-control"
                                    placeholder="To">
                                <span v-show="errors.has('availableTo')"
                                    class="text-danger">{{ errors.first('availableTo') }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="submit" class="btn primary-bg">
                    <i v-if="updateUserSpinner" class="fa fa-spinner fa-spin"></i>
                    <span v-else>{{ $t('Update Info') }}</span>
                </button>
            </div>
        </form>
    </div>
</template>
<script>
import { mapState } from "vuex";
import axios from "axios";
import debounce from "debounce";
import AutoComplete from "../../../helpers/maps/AutoComplete";
import Geocode from "../../../helpers/maps/Geocode";

export default {
    data() {
        return {
            user: null,
            updateUserSpinner: false,
            locationsList: null,
            locationSpinner: false,
            locationChanged: false
        };
    },
    created() {
        this.user = this.userStore.info;
        this.user.availableFrom =
            parseInt(this.user.availableFrom) < 10
                ? "0" + parseInt(this.user.availableFrom)
                : parseInt(this.user.availableFrom);
        this.user.availableTo = parseInt(this.user.availableTo);
    },
    mounted() {
    },
    methods: {
        citySearchOnChange: debounce(async function (e) {
            this.locationSpinner = true
            this.locationChanged = true
            const client = new AutoComplete(this.user.location)
            await client.init();
            this.locationsList = client.getLocations()
            this.locationSpinner = false
        }, 500),
        updateInfo() {
            let vm = this;

            this.$validator.validateAll().then(async result => {
                if (result) {
                    if (this.locationChanged) {
                        if (!this.locationsList || !this.locationsList.length) {
                            this.$swal(this.$t('We cant find that location, please try again'))
                            return;
                        }
                        if (!this.locationsList.find(item => item.name == this.user.location)) {
                            this.$swal(this.$t('Please choose a location from the dropdown'))
                            return;
                        }
                    }

                    this.updateUserSpinner = true;
                    let data = {};

                    const client = new Geocode(this.user.location)
                    await client.init();
                    const coords = client.getCoords();

                    if (this.userStore.role == "trainer") {
                        data = {
                            userId: this.user.userId,
                            firstname: this.user.firstname,
                            lastname: this.user.lastname,
                            email: this.user.email,
                            location: this.user.location,
                            latitude: coords.lat,
                            longitude: coords.lon,
                            description: this.user.description,
                            availableFrom: this.user.availableFrom,
                            availableTo: this.user.availableTo,
                            // perHour: this.user.perHour,
                            type: "trainer",
                            domain: process.env.domain
                        };
                    } else {
                        data = {
                            userId: this.user.id,
                            firstname: this.user.firstname,
                            lastname: this.user.lastname,
                            email: this.user.email,
                            type: "user",
                            domain: process.env.domain
                        };
                    }

                    axios
                        .put(process.env.api_hostname + "/updateUserInfo", data)
                        .then(response => {
                            this.locationChanged = false
                            if (response.data.status == 'conf_email') {
                                this.$swal({
                                    title: "Confirm Email",
                                    text: 'We have sent you a confirmation link on your email\nPlease check your inbox',
                                    confirmButtonText: "OK",
                                    cancelButtonText: "Cancel",
                                    showCancelButton: false,
                                    showCloseButton: true,
                                    target: $("#rtl-container")[0]
                                }).then(
                                    result => {

                                    },
                                    dismiss => { }
                                );
                            }
                            vm.updateUserSpinner = false;
                            this.$notify({
                                group: "foo",
                                title: "Message",
                                text: "Information updated!"
                            });
                        });
                }
            })
        }
    },
    computed: {
        ...mapState({
            userStore: store => store.user
        })
    }
};
</script>
<style lang="scss">
#pictureFile {
    display: none;
}

.profile-img {
    max-width: 320px;
    max-height: 320px;
    cursor: pointer;
}

textarea.form-control {
    min-height: 100px;
    max-height: 150px;
}
</style>
