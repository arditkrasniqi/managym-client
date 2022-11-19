<template>
    <div>
        <div v-if="plan.showPlans">
            <div class="card">
                <h4 class="card-header">{{$t('Trainer Plans')}}</h4>
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-hover">
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
                                    <td>{{$t('Monthy Cost')}}</td>
                                    <td class="text-center" v-for="p in trainerPlans">
                                        <span v-if="p.monthlyPay == null">CHF 0</span>
                                        <span v-else>CHF {{ p.monthlyPay }}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td>{{$t('Yearly Cost')}}</td>
                                    <td class="text-center" v-for="p in trainerPlans">
                                        <span v-if="p.yearlyPay == null">CHF 0</span>
                                        <span v-else>CHF {{ p.yearlyPay }}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td class="text-center">
                                        <span v-if="userStore.info.planId == 1">{{$t('Choose Plan')}}</span>
                                        <button class="btn btn-sm primary-bg" @click="goToCard(1)" v-else>
                                            <span v-if="plan.chooseSpinner" class="fa fa-spinner fa-spin"></span>
                                            <span v-else>{{$t('Choose Plan')}}</span>
                                        </button>
                                    </td>
                                    <td class="text-center">
                                        <span v-if="userStore.info.planId == 2">{{$t('Choose Plan')}}</span>
                                        <button class="btn btn-sm primary-bg" @click="goToCard(2)"
                                            v-else>{{$t('Choose Plan')}}</button>
                                    </td>
                                    <td class="text-center">
                                        <span v-if="userStore.info.planId == 3">{{$t('Choose Plan')}}</span>
                                        <button class="btn btn-sm primary-bg" @click="goToCard(3)"
                                            v-else>{{$t('Choose Plan')}}</button>
                                    </td>
                                    <td class="text-center">
                                        <span v-if="userStore.info.planId == 4">{{$t('Choose Plan')}}</span>
                                        <button class="btn btn-sm primary-bg" @click="goToCard(4)"
                                            v-else>{{$t('Choose Plan')}}</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
        <div class="row" v-else-if="card.showCard">
            <div class="col-12 col-xl-6">
                <div class="card">
                    <h3 class="card-header">{{$t('Plan Payment')}}</h3>
                    <div class="card-body">
                        <div class="form-group">
                            <label>{{$t('Credit Card Number')}}</label>
                            <input v-validate="'required|credit_card'" type="number" name="credit_card"
                                :data-vv-as="$t('Credit Card Number')" v-model="card.number" class="form-control">
                            <span v-show="errors.has('credit_card')"
                                class="text-danger">{{ errors.first('credit_card') }}</span>
                        </div>
                        <div class="form-group">
                            <label>{{$t('CVC')}}</label>
                            <input name="cvc" data-vv-as="CVC" v-validate="'required'" type="number" v-model="card.cvc"
                                class="form-control">
                            <span v-show="errors.has('cvc')" class="text-danger">{{ errors.first('cvc') }}</span>
                        </div>
                        <div class="form-group">
                            <label>{{$t('Expiration Month')}}</label>
                            <input v-validate="'required|min_value:1|max_value:12'" type="number" name="exp_month"
                                v-model="card.expMonth" class="form-control">
                            <span v-show="errors.has('exp_month')"
                                class="text-danger">{{ errors.first('exp_month') }}</span>
                        </div>
                        <div class="form-group">
                            <label>{{$t('Expiration Year')}}</label>
                            <input v-validate="'required|min_value:2018'" name="exp_year" :data-vv-as="$t('Year')"
                                type="number" v-model="card.expYear" class="form-control">
                            <span v-show="errors.has('exp_year')"
                                class="text-danger">{{ errors.first('exp_year') }}</span>
                        </div>
                        <div class="row">
                            <div class="col-6">
                                <h5>{{$t('Pay monthly')}}</h5>
                                <div class="row">
                                    <h1 class="pay-price col-12">CHF {{ plan.monthCost }}</h1>
                                </div>
                                <button class="pay-btn btn-block btn btn-secondary" @click="getToken('month')"><i
                                        class="fa fa-shopping-cart"></i></button>
                            </div>
                            <div class="col-6">
                                <h5>{{$t('Pay yearly')}}</h5>
                                <div class="row">
                                    <h1 class="pay-price col-12">CHF {{ plan.yearCost }}</h1>
                                </div>
                                <button class="pay-btn btn-block btn primary-bg" @click="getToken('year')"><i
                                        class="fa fa-shopping-cart"></i></button>
                                <p class="discount-note">{{$t('and gain discounts')}}</p>
                            </div>
                            <div class="col-12 text-center">
                                <i v-if="plan.payButtonSpin" class="fa fa-spinner fa-spin"></i>
                            </div>
                        </div>
                        <div v-if="card.error != null" class="form-group text-danger">
                            {{card.error}}
                        </div>
                    </div>
                    <div @click="plansBack" class="card-footer">
                        <button class="btn btn-default"><i class="fa fa-arrow-left"></i> {{$t('Plans')}}</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import {mapState} from 'vuex'

    export default {
        name: "trainer-plans",
        data(){
            return {
                plan: {
                    chooseSpinner:false,
                    showPlans: true,
                    monthCost: null,
                    yearCost: null,
                    planId: 0,
                    payButtonSpin: false,
                    planText:null
                },
                card: {
                    number: null,
                    cvc: null,
                    expMonth: null,
                    expYear: null,
                    showCard: false,
                    error: null
                },
            }
        },
        created() {
            this.getPlans();
        },
        methods:{
            getPlans(){
                axios.get(process.env.api_hostname + "/getTrainerPlans").then(response => {
                    this.$store.dispatch("setTrainerPlans", response.data.data);
                    this.plan.showPlans = true;
                });
            },
            plansBack() {
                this.card.showCard = false;
                this.plan.showPlans = true;
            },
            goToCard(id) {
                this.plan.planId = id;
                if(id == 1){
                    this.plan.chooseSpinner = true;
                    this.createCharge();
                    return;
                }
                this.plan.showPlans = false;
                this.card.showCard = true;
                this.trainerPlans.map(plan => {
                    if (plan.id == id) {
                        this.plan.yearCost = plan.yearlyPay;
                        this.plan.monthCost = plan.monthlyPay;
                        this.plan.planText = plan.plan
                    }
                });
            },
            getToken(period) {
                this.$validator.validateAll().then(result => {
                    if(result){
                        let vm = this;
                        this.plan.payButtonSpin = true;
                        Stripe.setPublishableKey(process.env.stripe.publicKey);
                        Stripe.card.createToken(
                            {
                                number: this.card.number,
                                cvc: this.card.cvc,
                                exp_month: this.card.expMonth,
                                exp_year: this.card.expYear
                            },
                            function (status, response) {
                                // if we have errors log the error from response.error.message
                                if (response.error) {
                                    vm.card.error = response.error.message;
                                    vm.plan.payButtonSpin = false;
                                    return;
                                } else {
                                    // else response.id is the token
                                    vm.card.error = null;
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
                let data = arguments.length > 0 ?
                    {
                        token: token,
                        period: period,
                        planId: vm.plan.planId,
                        planText: vm.plan.planText,
                        isFrom: "calendar",
                        trainerId: vm.userStore.info.userId
                    }
                    : {
                        type:'demo',
                        planId: vm.plan.planId,
                        planText: vm.plan.planText,
                        isFrom: "calendar",
                        trainerId: vm.userStore.info.userId
                    };
                axios
                    .post(process.env.api_hostname + "/payTrainerPlanPayment", data)
                    .then(response => {
                        if (response.data.statusCode == 200) {
                            vm.plan.payButtonSpin = false;
                            this.card.showCard = false;
                            axios.get(process.env.api_hostname + "/user").then(response => {
                                vm.getPlans();
                                this.$store.dispatch("setAuth", true);
                                this.$store.dispatch(
                                    "setAuthTrainerPlan",
                                    response.data.trainerPlan
                                );
                                this.$store.dispatch(
                                    "setUserRole",
                                    response.data.role[0].description
                                );
                                if (response.data.role[0].description == "trainer" && Array.isArray(response.data.user)) {
                                    this.$store.dispatch("setAuthUser", response.data.user[0]);
                                } else {
                                    this.$store.dispatch("setAuthUser", response.data.user);
                                }
                            });
                        }
                        this.plan.chooseSpinner = false;
                    });
            }
        },
        computed: {
            ...mapState({
                userStore: state => state.user,
                trainerPlan: state => state.authTrainerPlan,
                trainerPlans: state => state.trainerPlans
            })
        }
    }
</script>

<style scoped>

</style>