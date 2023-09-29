<template>
    <div>
        <h1 class="page-title">{{ $t('Account Balance') }}</h1>
        <div class="card">
            <account-balance v-if="userStore.info"></account-balance>
        </div>
    </div>
</template>

<script>
import AccountBalance from '../profile/AccountBalance.vue'
import { mapState } from "vuex";

export default {
    components: {
        'account-balance': AccountBalance
    },
    name: "account-balance-main",
    computed: {
        ...mapState({
            userStore: store => store.user
        })
    }
}
</script>

<style scoped>

</style>