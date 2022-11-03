<template>
    <div>
        <h1 class="page-title">{{$t('Account Balance')}}</h1>
        <div class="card">
            <account-balance></account-balance>
        </div>
    </div>
</template>

<script>
    import AccountBalance from '../profile/AccountBalance.vue'

    export default {
        components:{
            'account-balance': AccountBalance
        },
        name: "account-balance-main"
    }
</script>

<style scoped>

</style>