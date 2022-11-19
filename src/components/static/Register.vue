<template>
    <div class="col-12">
        <h1 class="page-title">Register</h1>
        <form @submit.prevent="register()">
            <div class="form-group">
                <input type="text" placeholder="Firstname" v-model="firstname" class="form-control">
            </div>
            <div class="form-group">
                <input type="text" placeholder="Lastname" v-model="lastname" class="form-control">
            </div>
            <div class="form-group">
                <input type="email" placeholder="Email" v-model="email" class="form-control">
            </div>
            <div class="form-group">
                <input type="password" placeholder="Password" v-model="password" class="form-control">
            </div>
            <div class="form-group">
                <button type="submit" class="btn primary-bg">Register</button>
            </div>
        </form>
    </div>
</template>
<script>
import axios from 'axios'
export default {
    data() {
        return {
            defaultAvatar: 'https://pickaface.net/assets/images/slides/slide2.png',
            firstname: '',
            lastname: '',
            email: '',
            password: '',
        }
    },
    methods: {
        register() {
            let vm = this;
            axios.post(process.env.api_hostname + '/register',
                {
                    firstname: vm.firstname,
                    lastname: vm.lastname,
                    email: vm.email,
                    password: vm.password,
                    avatar: vm.defaultAvatar,
                    domain: process.env.domain
                }).then(response => {
                    this.$router.push('login');
                });
        }
    }
}
</script>
<style>

</style>



