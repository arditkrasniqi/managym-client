<template>
    <form @submit.prevent="requestPayout">
        <input type="hidden" id="remainDays" v-model="remainingDays">
        <div class="card-block">
            <div v-if="accountBalance != null">
                <div class="row">
                    <div class="col-12 col-sm-6">
                        <p>{{ $t('Your actual account balance is') }}:</p>
                        <h1>{{ currency }} {{ accountBalance }}</h1>
                        <a v-if="!showPayoutForm" @click="showPayout"
                            class="btn primary-bg">{{ $t('Request a payout') }}</a>
                        <div class="payout-error" v-if="showError">
                            <div class="alert alert-info">
                                {{ error }}
                            </div>
                        </div>
                    </div>
                    <div v-if="showPayoutForm" class="col-12 col-sm-6">
                        <div v-if="payoutInfo == null || payoutInfo.payoutMode != 1">
                            <div class="form-group">
                                <label>{{ $t('Bank') }}</label>
                                <input v-validate="'required'" v-model="bank" name="bank" :data-vv-as="$t('Bank')"
                                    type="text" class="form-control">
                                <span v-show="errors.has('bank')" class="text-danger">{{ errors.first('bank') }}</span>
                            </div>
                            <div class="form-group">
                                <label>
                                    {{ $t('Request payout every month automatically') }}?<br />
                                    <input type="checkbox" id="payoutMode" v-model="automatePayoutRequest">
                                </label>
                            </div>
                        </div>
                        <p v-else>{{ $t('You have requested automatic payouts') }}</p>
                    </div>
                </div>
            </div>
            <div v-else class="text-center">
                <i class="fa fa-spinner fa-spin"></i>
            </div>
        </div>
        <div v-if="showPayoutForm" class="card-footer text-right">
            <div v-if="payoutInfo == null || payoutInfo.payoutMode != 1">
                <button type="submit" class="btn primary-bg">
                    <span v-if="buttonSpinner"><i class="fa fa-spinner fa-spin"></i></span>
                    <span v-else>{{ $t('Request Payout') }}</span>
                </button>
            </div>
        </div>
    </form>
</template>

<script>
import axios from 'axios'
import { mapState } from 'vuex'

export default {
    name: "account-balance",
    data() {
        let vm = this;
        return {
            accountBalance: null,
            showPayoutForm: false,
            bank: null,
            remainingDays: 0,
            showError: false,
            error: '',
            buttonSpinner: false,
            automatePayoutRequest: false,
            payoutInfo: null,
            canRequestNextPayout: false,
            e: { // errors
                zeroPayout: this.$t('No payouts can be made, you have zero balance') + '.',
                wait15Days: this.$t('In order to request another payout, you must wait ')
            }
        }
    },
    created() {
        this.getAccountBalance();
        this.getBank();
    },
    computed: {
        ...mapState({
            userStore: state => state.user,
            currency: state => state.currency
        })
    },
    methods: {
        getBank() {
            let vm = this;
            axios.get(process.env.api_hostname + '/getBank/' + vm.userStore.info.id)
                .then(response => {
                    if (response.data.trainer != null) {
                        vm.bank = response.data.trainer.bank
                    }
                    vm.payoutInfo = response.data.trainer;
                });
        },
        requestPayout() {
            let vm = this;
            // let text = "Verify this is your card number ?<br/><h4>"+vm.ccNumber+"</h4>";
            this.$validator.validateAll().then(result => {
                if (result) {
                    this.buttonSpinner = true;
                    axios.post(process.env.api_hostname + '/trainerPayout',
                        {
                            trainerId: vm.userStore.info.id,
                            price: vm.accountBalance,
                            bank: vm.bank,
                            payoutMode: vm.automatePayoutRequest,
                            isFrom: 'account_balance'
                        }).then(response => {
                            this.$notify({
                                group: "foo",
                                title: this.$t('Message'),
                                text: this.$t('Payout request sent successfully') + "!"
                            });
                            vm.buttonSpinner = false;
                            this.$router.push('/dashboard');
                            return;
                        });
                }
            })
        },
        getAccountBalance() {
            let vm = this;
            axios.get(process.env.api_hostname + '/getAccountBalance/' + vm.userStore.info.id)
                .then(response => {
                    vm.accountBalance = response.data.total;
                    vm.canRequestNextPayout = response.data.canRequestNextPayout;
                    vm.remainingDays = response.data.remainingDays;
                    vm.e.wait15Days += this.remainingDays + ' days';
                });
        },
        showPayout() {
            if (this.accountBalance > 0 && this.canRequestNextPayout) {
                this.showPayoutForm = true;
            } else {
                this.showError = true;
                if (!this.canRequestNextPayout) {
                    this.error = this.e.wait15Days;
                } else {
                    this.error = this.e.zeroPayout;
                }
            }
        }
    }
}
</script>

<style lang="scss">
.payout-error {
    margin-top: 20px;
}

.card-block {
    padding: 15px;
}
</style>