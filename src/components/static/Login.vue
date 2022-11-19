<template>
    <div>
        <h1 class="page-title">Login</h1>
        <div class="col-12">
            <form @submit.prevent="login">
                <div class="form-group">
                    <input v-validate="'required|email'" type="text" v-model="username" name="username" class="form-control" placeholder="Email">
                    <span v-show="errors.has('username')" class="text-danger">{{ errors.first('username') }}</span>
                </div>
                <div class="form-group">
                    <input v-validate="'required'" type="password" v-model="password" name="password" class="form-control" placeholder="Password">
                    <span v-show="errors.has('password')" class="text-danger">{{ errors.first('password') }}</span>
                </div>
                <div class="form-group">
                    <button class="btn primary-bg">Login</button>
                </div>
            </form>
            <p>You dont have an account ?</p>
            <router-link to="register">Register now</router-link> for free
        </div>
    </div>
</template>
<script>
    import axios from 'axios'


    export default{
        data(){
            return {
                username:null,
                password:null,
                data:null
            }
        },
        created(){
//            this.login();
        },
        methods:{
            login(){
                let vm = this;
                this.$validator.validateAll()
                    .then(result => {
                        if(result){
                            process.env.api_data.username = this.username;
                            process.env.api_data.password= this.password;
                            axios.post(process.env.hostname + '/oauth/token',process.env.api_data)
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
<style>

</style>
