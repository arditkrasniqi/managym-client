<template>
    <div>
        <header-top></header-top>
        <content-page></content-page>
    </div>
</template>

<script>
import HeaderFront from './HeaderFront.vue'
import ContentFront from './ContentFront.vue'
import axios from 'axios'

export default {
    name: "front-page",
    components: {
        'header-top': HeaderFront,
        'content-page': ContentFront
    },
    data() {
        return {
            username: null,
            password: null,
            data: null
        }
    },
    methods: {
        login() {
            let vm = this;
            this.$validator.validateAll()
                .then(result => {
                    if (result) {
                        const apiData = {
                            username: this.username,
                            password: this.password
                        }
                        axios.post(process.env.hostname + '/oauth/token', apiData)
                            .then(response => {
                                vm.data = response;
                                this.$auth.setToken(response.data.token_type + ' ' + response.data.access_token, response.data.expires_in + Date.now());
                                this.$router.push('/dashboard')
                            });
                    }
                })
        },
    }
}
</script>

<style lang="scss">
main.guest-main {
    margin-left: 0;
    padding: 0;
}

.container-fluid {
    padding: 0 7px;
}
</style>