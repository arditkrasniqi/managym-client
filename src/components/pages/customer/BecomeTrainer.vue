<template>
    <div>
        <h1 class="page-title">
            {{$t('Become a Trainer')}}
        </h1>
        <div class="row">
            <div class="col-12 col-sm-3 text-center">
                <img :src="storage + userStore.info.avatar" class="img-responsive img-thumbnail">
                <h4>{{userStore.info.firstname}}</h4>
                <h4> {{userStore.info.lastname}}</h4>
            </div>
            <div class="col-12 col-sm-9">
                <form @submit.prevent="becomeTrainer">
                    <div class="form-group">
                        <label>{{$t('Location')}}</label>
                        <input v-validate="'required'" @blur="setLocationString" type="text" name="Location"
                               id="google-input" v-model="location" :placeholder="$t('Choose Location')" class="form-control">
                        <span v-show="errors.has('Location')" class="text-danger">{{ errors.first('Location') }}</span>
                    </div>
                    <div class="form-group">
                        <label>{{$t('Description')}}</label>
                        <textarea @focus="setLocationString" v-validate="'required'" name="Description"
                                  class="form-control" v-model="description" cols="30" rows="7"
                                  :placeholder="$t('Describe yourself as a trainer')"></textarea>
                        <span v-show="errors.has('Description')"
                              class="text-danger">{{ errors.first('Description') }}</span>
                    </div>
                    <div class="form-group">
                        <label>{{$t('Legal Terms')}}</label>
                        <textarea @focus="setLocationString" v-validate="'required'" class="form-control"
                                  name="LegalTerms" :data-vv-as="$t('Legal Terms')" cols="30" rows="7" v-model="legalTerms"
                                  :placeholder="$t('Write your legal terms')"></textarea>
                        <span v-show="errors.has('LegalTerms')"
                              class="text-danger">{{ errors.first('LegalTerms') }}</span>
                    </div>
                    <!--<div class="form-group">-->
                        <!--<label>Price</label>-->
                        <!--<input @focus="setLocationString" v-validate="'required|numeric'" type="number" name="PerHour"-->
                               <!--class="form-control" v-model="perHour" placeholder="Price per Hour">-->
                        <!--<span v-show="errors.has('PerHour')" class="text-danger">{{ errors.first('PerHour') }}</span>-->
                    <!--</div>-->
                    <div class="form-group">
                        <label>{{$t('Your availability')}}</label>
                        <div class="row">
                            <div class="col-6">
                                <input @focus="setLocationString" v-validate="'required|numeric'" name="From"
                                       type="number" class="form-control" v-model="from" :placeholder="$t('From')">
                                <span v-show="errors.has('From')" class="text-danger">{{ errors.first('From') }}</span>
                            </div>
                            <div class="col-6">
                                <input @focus="setLocationString" v-validate="'required|numeric'" type="number"
                                       name="To" class="form-control" v-model="to" :placeholder="$t('To')">
                                <span v-show="errors.has('To')" class="text-danger">{{ errors.first('To') }}</span>
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <button type="submit" class="btn primary-bg"><i v-if="buttonSpin"
                                                                        class="fa fa-spinner fa-spin"></i> {{$t('Save')}}
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Modal -->
        <div id="trainerPlansModal" class="modal fade" role="dialog">
            <div class="modal-dialog modal-lg">

                <!-- Modal content-->
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal">&times;</button>
                        <h4 class="modal-title">
                            <span v-if="plan.showPlan">{{$t('Choose plan')}}</span>
                            <span v-else>{{$t('Payment')}}</span>
                        </h4>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div v-if="plan.showPlan" class="table-responsive">
                                <table class="table table-sm">
                                    <thead>
                                    <tr>
                                        <th></th>
                                        <th class="text-center">{{$t('Demo Trainer')}}</th>
                                        <th class="text-center">{{$t('Home Trainer')}}</th>
                                        <th class="text-center">{{$t('Expert')}}</th>
                                        <th class="text-center">{{$t('Enterprise')}}</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr>
                                        <td>
                                            {{$t('Listed in search results')}}
                                        </td>
                                        <td class="text-center">
                                            <i class="fa fa-check"></i>
                                        </td>
                                        <td class="text-center">
                                            <i class="fa fa-check"></i>
                                        </td>
                                        <td class="text-center">
                                            <i class="fa fa-check"></i>
                                        </td>
                                        <td class="text-center">
                                            <i class="fa fa-check"></i>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            {{$t('Access to calendar')}}
                                        </td>
                                        <td class="text-center">
                                            -
                                        </td>
                                        <td class="text-center">
                                            <i class="fa fa-check"></i>
                                        </td>
                                        <td class="text-center">
                                            <i class="fa fa-check"></i>
                                        </td>
                                        <td class="text-center">
                                            <i class="fa fa-check"></i>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            {{$t('Access to accounting')}}
                                        </td>
                                        <td class="text-center">
                                            -
                                        </td>
                                        <td class="text-center">
                                            <i class="fa fa-check"></i>
                                        </td>
                                        <td class="text-center">
                                            <i class="fa fa-check"></i>
                                        </td>
                                        <td class="text-center">
                                            <i class="fa fa-check"></i>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            {{$t('Ability to manage trainers')}}
                                        </td>
                                        <td class="text-center">
                                            -
                                        </td>
                                        <td class="text-center">
                                            -
                                        </td>
                                        <td class="text-center">
                                            <i class="fa fa-check"></i>
                                        </td>
                                        <td class="text-center">
                                            <i class="fa fa-check"></i>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            {{$t('Ability to manage multiple locations')}}
                                        </td>
                                        <td class="text-center">
                                            -
                                        </td>
                                        <td class="text-center">
                                            -
                                        </td>
                                        <td class="text-center">
                                            -
                                        </td>
                                        <td class="text-center">
                                            <i class="fa fa-check"></i>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            {{$t('Analytics Tools')}}
                                        </td>
                                        <td class="text-center">
                                            -
                                        </td>
                                        <td class="text-center">
                                            -
                                        </td>
                                        <td class="text-center">
                                            -
                                        </td>
                                        <td class="text-center">
                                            <i class="fa fa-check"></i>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            {{$t('Provision for 4trainer')}}
                                        </td>
                                        <td class="text-center">
                                            10%
                                        </td>
                                        <td class="text-center">
                                            4%
                                        </td>
                                        <td class="text-center">
                                            4%
                                        </td>
                                        <td class="text-center">
                                            4%
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>{{$t('Monthly Cost')}}</td>
                                        <td class="text-center" v-for="plan in trainerPlans">
                                            <span v-if="plan.monthlyPay == null">CHF 0</span>
                                            <span v-else>CHF {{ plan.monthlyPay }}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>{{$t('Yearly Cost')}}</td>
                                        <td class="text-center" v-for="plan in trainerPlans">
                                            <span v-if="plan.yearlyPay == null">CHF 0</span>
                                            <span v-else>CHF {{ plan.yearlyPay }}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td class="text-center">
                                            <button class="btn btn-sm primary-bg" @click="goToCard(1)">{{$t('Choose Plan')}}
                                            </button>
                                        </td>
                                        <td class="text-center">
                                            <button class="btn btn-sm primary-bg" @click="goToCard(2)">{{$t('Choose Plan')}}
                                            </button>
                                        </td>
                                        <td class="text-center">
                                            <button class="btn btn-sm primary-bg" @click="goToCard(3)">{{$t('Choose Plan')}}
                                            </button>
                                        </td>
                                        <td class="text-center">
                                            <button class="btn btn-sm primary-bg" @click="goToCard(4)">{{$t('Choose Plan')}}
                                            </button>
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div v-else class="col-12">
                                <div class="row">
                                    <div class="col-7">
                                        <div class="form-group">
                                            <input v-validate="'required|credit_card'" type="text" name="credit_card" :data-vv-as="$t('Credit Card Number')" v-model="plan.number" class="form-control"
                                                   :placeholder="$t('Credit Card Number')">
                                            <span v-show="errors.has('credit_card')" class="text-danger">{{ errors.first('credit_card') }}</span>
                                        </div>
                                        <div class="form-group">
                                            <input name="cvc" data-vv-as="CVC" v-validate="'required'" type="text" v-model="plan.cvc" class="form-control"
                                                   :placeholder="$t('Security Code')">
                                            <span v-show="errors.has('cvc')" class="text-danger">{{ errors.first('cvc') }}</span>
                                        </div>
                                        <div class="form-group">
                                            <input v-validate="'required|min_value:2018'" name="exp_year" :data-vv-as="$t('Year')" type="number" v-model="plan.exp_year" class="form-control"
                                                   :placeholder="$t('Year (YYYY)')" min="1" max="12">
                                            <span v-show="errors.has('exp_year')" class="text-danger">{{ errors.first('exp_year') }}</span>
                                        </div>
                                        <div class="form-group">
                                            <input v-validate="'required|min_value:1|max_value:12'" type="number" name="exp_month" :data-vv-as="$t('Month')" v-model="plan.exp_month" class="form-control"
                                                   :placeholder="$t('Month (MM)')" min="2018">
                                            <span v-show="errors.has('exp_month')" class="text-danger">{{ errors.first('exp_month') }}</span>
                                        </div>
                                        <div v-if="plan.error != null" class="text-danger form-group">
                                            <h5>{{plan.error}}</h5>
                                        </div>
                                    </div>
                                    <div class="col-5">
                                        <div class="row">
                                            <div class="col-6">
                                                <h5>{{$t('Pay monthly')}}</h5>
                                                <div class="row">
                                                    <h1 class="pay-price col-12">CHF {{ plan.monthCost }}</h1>
                                                </div>
                                                <button class="pay-btn btn-block btn btn-secondary"
                                                        @click="getToken('month')"><i class="fa fa-shopping-cart"></i>
                                                </button>
                                            </div>
                                            <div class="col-6">
                                                <h5>{{$t('Pay yearly')}}</h5>
                                                <div class="row">
                                                    <h1 class="pay-price col-12">CHF {{ plan.yearCost }}</h1>
                                                </div>
                                                <button class="pay-btn btn-block btn primary-bg"
                                                        @click="getToken('year')"><i class="fa fa-shopping-cart"></i>
                                                </button>
                                                <p class="discount-note">{{$t('and gain discounts')}}</p>
                                            </div>
                                            <div class="col-12 text-center">
                                                <i v-if="plan.payButtonSpin" class="fa fa-spinner fa-spin"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-if="!plan.showPlan" class="modal-footer">
                        <button class="btn btn-default" @click="goBack"><i class="fa fa-arrow-left"></i></button>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<script>
    import {mapState} from "vuex";
    import config from "../../../config";
    import axios from "axios";23

    export default {
        name: "profile",
        data() {
            return {
                storage: config.hostname + "/storage/",
                buttonSpin: false,
                location: "",
                latitude: "",
                longitude: "",
                description: "",
                legalTerms: "",
                perHour: "",
                from: "",
                to: "",
                plan: {
                    period: null,
                    yearCost: null,
                    monthCost: null,
                    showPlan: true,
                    number: null,
                    cvc: null,
                    exp_month: null,
                    exp_year: null,
                    token: null,
                    error: null,
                    planId: 0,
                    payButtonSpin: false,
                    planText: null
                }
            };
        },
        mounted() {
            config.googleSearch();
        },
        created() {
        },
        beforeCreate() {
            axios.get(config.api_hostname + "/getTrainerPlans").then(response => {
                this.$store.dispatch("setTrainerPlans", response.data.data);
            });
        },
        methods: {
            goBack() {
                this.plan.showPlan = true;
            },
            setLocationString() {
                this.location = document.getElementById("google-input").value;
            },
            getToken(period) {
                this.$validator.validateAll().then(result => {
                    if(result){
                        let vm = this;
                        this.plan.payButtonSpin = true;
                        Stripe.setPublishableKey(config.stripe.publicKey);
                        Stripe.card.createToken(
                            {
                                number: this.plan.number,
                                cvc: this.plan.cvc,
                                exp_month: this.plan.exp_month,
                                exp_year: this.plan.exp_year
                            },
                            function (status, response) {
                                // if we have errors log the error from response.error.message
                                if (response.error) {
                                    vm.plan.error = response.error.message;
                                    vm.plan.payButtonSpin = false;
                                    return;
                                } else {
                                    // else response.id is the token
                                    vm.plan.error = null;
                                    vm.plan.token = response.id;
                                    vm.createCharge(vm.plan.token, period);
                                }
                                // append the token to the ajax request to server
                            }
                        );
                    }
                })
            },
            createCharge(token, period) {
                let vm = this;
                axios
                    .post(config.api_hostname + "/payTrainerPlanPayment", {
                        token: token,
                        period: period,
                        planId: vm.plan.planId,
                        planText: vm.plan.planText,
                        trainerId: vm.userStore.info.id
                    })
                    .then(response => {
                        if (response.data.statusCode == 200) {
                            vm.plan.payButtonSpin = false;
                            $("#trainerPlansModal").modal("hide");
                            this.plan.showPlan = true;
                            vm.trainerRequest();
                        }
                    });
            },
            goToCard(id) {
                this.plan.showPlan = false;
                this.plan.planId = id;
                if (id == 1) {
                    $("#trainerPlansModal").modal("hide");
                    this.plan.showPlan = true;
                    this.trainerRequest();
                } else {
                    this.trainerPlans.map(plan => {
                        if (plan.id == id) {
                            this.plan.yearCost = plan.yearlyPay;
                            this.plan.monthCost = plan.monthlyPay;
                            this.plan.planText = plan.plan
                        }
                    });
                }
            },
            becomeTrainer() {
                this.$validator.validateAll().then(result => {
                    if (result) {
                        this.location = document.getElementById("google-input").value;
                        $("#trainerPlansModal").modal("show");
                    }
                });
            },
            trainerRequest() {
                let vm = this;
                $.get(
                    "https://maps.googleapis.com/maps/api/geocode/json?address=" +
                    this.city +
                    "&key=" +
                    config.google_api_key,
                    function (response) {
                        let pos = response.results[0].geometry.location;
                        vm.latitude = pos.lat;
                        vm.longitude = pos.lng;
                        vm.req(pos.lat, pos.lng);
                    }
                );
            },
            req(lat, lng) {
                let vm = this;
                vm.buttonSpin = true;
                axios
                    .post(config.api_hostname + "/becomeTrainer", {
                        userId: vm.userStore.info.id,
                        location: vm.location,
                        lat: lat,
                        lng: lng,
                        description: vm.description,
                        legalTerms: vm.legalTerms,
                        // perHour: vm.perHour,
                        availFrom: vm.from,
                        availTo: vm.to,
                        planId: vm.plan.planId
                    })
                    .then(response => {
                        vm.buttonSpin = false;
                        axios.get(config.api_hostname + "/user").then(response => {
                            this.$store.dispatch("setAuth", true);
                            this.$store.dispatch("setAuthUser", response.data.user);
                            this.$store.dispatch(
                                "setAuthTrainerPlan",
                                response.data.trainerPlan
                            );
                            this.$store.dispatch(
                                "setUserRole",
                                response.data.role[0].description
                            );
                            this.$router.push("/dashboard");
                        });
                    });
            }
        },
        computed: {
            ...mapState({
                userStore: store => store.user,
                trainerPlans: store => store.trainerPlans
            })
        }
    };
</script>

<style lang="scss">
    .discount-note {
        font-size: 14px;
        color: #a0a0a0;
    }

    .pay-price {
        text-align: center;
        display: block;
        color: #808080;
    }
</style>