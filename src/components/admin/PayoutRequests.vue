<template>
    <div>
        <h1 class="page-title">
            {{ $t('Payout Requests') }}
        </h1>
        <div class="card">
            <div class="card-body">
                <div class="table-responsive">
                    <table v-if="" class="table table-hover">
                        <thead>
                            <tr>
                                <th>{{ $t('Trainer') }}</th>
                                <th>{{ $t('Bank') }}</th>
                                <th>{{ $t('Total Price') }}</th>
                                <th class="w130">{{ $t('Mark as Done') }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-if="automaticPayoutRequests.length > 0" v-for="payout in automaticPayoutRequests"
                                :key="payout.id">
                                <td>{{ payout.firstname }} {{ payout.lastname }}</td>
                                <td>{{ payout.bank }}</td>
                                <td>{{ currency }} {{ payout.price }}</td>
                                <td class="text-center">
                                    <a @click="markAsDone(payout)" class="icons" href="javascript:void(0)">
                                        <i class="fa fa-square-o"></i>
                                    </a>
                                </td>
                            </tr>
                            <tr v-for="payout in payoutRequests" :key="payout.id">
                                <td>{{ payout.firstname }} {{ payout.lastname }}</td>
                                <td>{{ payout.bank }}</td>
                                <td>{{ currency }} {{ payout.price }}</td>
                                <td class="text-center">
                                    <a @click="markAsDone(payout)" class="icons" href="javascript:void(0)">
                                        <i class="fa fa-square-o"></i>
                                    </a>
                                </td>
                            </tr>
                            <tr v-if="typeof payoutRequests == 'object' &&
                            typeof automaticPayoutRequests == 'object' &&
                            automaticPayoutRequests.length == 0 && payoutRequests.length == 0">
                                <td colspan="4">
                                    <p>{{ $t('No payout requests found') }}</p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import axios from 'axios'

export default {
    name: "payout-requests",
    data() {
        return {
            payoutRequests: '',
            automaticPayoutRequests: '',
            e: {
                error: false,
                errors: this.$t('Today is not the payout')
            }
        }
    },
    created() {
        this.getPayoutRequests();
    },
    methods: {
        getPayoutRequests() {
            let vm = this;
            axios.get(process.env.api_hostname + '/getPayoutRequests')
                .then(response => {
                    vm.payoutRequests = response.data.payouts;
                    vm.automaticPayoutRequests = response.data.automaticPayouts;
                });
        },
        markAsDone(p) {
            let vm = this;
            let payout = p;
            this.$swal({
                title: this.$t('Confirm'),
                text: this.$t('Are you sure you want to make this payout as done ?'),
                confirmButtonText: this.$t('Yes'),
                cancelButtonText: this.$t('Cancel'),
                showCancelButton: true,
                showCloseButton: true,
                target: $("#rtl-container")[0]
            }).then(
                result => {
                    axios.delete(process.env.api_hostname + '/markPayoutDone',
                        {
                            data: payout
                        }).then(response => {
                            vm.payoutRequests = response.data.payouts;
                            vm.automaticPayoutRequests = response.data.automaticPayouts;
                        });
                },
                dismiss => {
                }
            );
        }
    },
    computed: {
        ...mapState({
            currency: state => state.currency
        })
    },
}
</script>

<style lang="scss">
.w130 {
    width: 130px;
}
</style>