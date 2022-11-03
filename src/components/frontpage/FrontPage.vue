<template>
    <div class="container-fluid">
        <header-top></header-top>
        <content-page></content-page>
    </div>
</template>

<script>
import HeaderFront from './HeaderFront.vue'
import ContentFront from './ContentFront.vue'
    import axios from 'axios'
    import config from '../../config'

    export default {
        name: "front-page",
        components:{
            'header-top': HeaderFront,
            'content-page': ContentFront
        },
        data(){
            return {
                username:null,
                password:null,
                data:null
            }
        },
        methods:{
            login(){
                let vm = this;
                this.$validator.validateAll()
                    .then(result => {
                        if(result){
                            config.api_data.username = this.username;
                            config.api_data.password = this.password;
                            axios.post(config.hostname + '/oauth/token',config.api_data)
                                .then(response => {
                                    vm.data = response;
                                    this.$auth.setToken(response.data.token_type + ' ' +response.data.access_token,response.data.expires_in + Date.now());
                                    this.$router.push('/dashboard')
                                });
                        }
                    })
            },
        }
    }
</script>

<style lang="scss">
    main{
        margin-left:0;
        padding:0;
    }
    .container-fluid{
        padding:0 7px;
    }
</style>