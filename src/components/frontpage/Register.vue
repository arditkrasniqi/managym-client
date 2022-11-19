<template>
    <div>
        <!-- Register Modal -->
        <div id="registerModal" class="modal fade" role="dialog">
            <div class="modal-dialog">

                <!-- Modal content-->
                <div class="modal-content">
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-8 ml-auto mr-auto text-center">
                                <div class="register-logo">
                                    <i class="fa fa-user-circle-o"></i>
                                    <h2 class="login-title">{{ $t('Register') }}</h2>
                                    <p>{{ $t('Fill the form below to get instant access') }}</p>
                                </div>
                                <div class="login-form">
                                    <form @submit.prevent="register">
                                        <div class="form-group">
                                            <input v-validate="'required'" v-model="auth.firstname"
                                                data-vv-as="Firstname" name="firstname" type="text"
                                                :placeholder="$t('Firstname')" class="form-control">
                                            <span v-show="errors.has('firstname')"
                                                class="text-danger">{{ errors.first('firstname') }}</span>
                                        </div>
                                        <div class="form-group">
                                            <input v-validate="'required'" v-model="auth.lastname" data-vv-as="Lastname"
                                                name="lastname" type="text" :placeholder="$t('Lastname')"
                                                class="form-control">
                                            <span v-show="errors.has('lastname')"
                                                class="text-danger">{{ errors.first('lastname') }}</span>
                                        </div>
                                        <div class="form-group">
                                            <input v-validate="'required|email'" v-model="auth.reg.username"
                                                data-vv-as="Email" name="username" type="text"
                                                :placeholder="$t('Email')" class="form-control">
                                            <span v-show="errors.has('username')"
                                                class="text-danger">{{ errors.first('username') }}</span>
                                        </div>
                                        <div class="form-group">
                                            <input v-validate="'required'" v-model="auth.reg.password"
                                                data-vv-as="Password" name="password" type="password"
                                                placeholder="Password" class="form-control">
                                            <span v-show="errors.has('password')"
                                                class="text-danger">{{ errors.first('password') }}</span>
                                        </div>
                                        <div class="form-group">
                                            <button type="submit" class="btn btn-block register-btn">
                                                <span v-if="registerSpinner"><i
                                                        class="fa fa-spinner fa-spin"></i></span>
                                                <span v-else>{{ $t('Register') }}</span>
                                            </button>
                                        </div>
                                        <div v-if="auth.regError" class="form-group text-danger">
                                            <span>{{ $t('Email already in use') }}</span>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios";
import { mapState } from "vuex";
import URL from "../../assets/js/URL-Parser/js/URLParser";

export default {
    name: "register",
    data() {
        return {
            registerSpinner: false,
            auth: {
                data: null,
                firstname: null,
                lastname: null,
                defaultAvatar: "profile_pictures/fmjIdqHgFPFeXTCwemoPrje73fHhBv2Twyx5XVD9.png",
                regError: false,
                logError: false,
                reg: {
                    username: null,
                    password: null
                }
            },
            optional: {
                org: false,
            }
        }
    },
    mounted() {
        if (URL.get('org')) {
            $('#registerModal').modal('show');
            this.optional.org = true;
        }
    },
    methods: {
        register() {
            let vm = this;
            let affiliate =
                localStorage.getItem("affiliate") == null
                    ? null
                    : JSON.parse(localStorage.getItem("affiliate")).link;
            this.$validator.validateAll().then(result => {
                if (result) {
                    vm.registerSpinner = true;
                    axios
                        .post(process.env.api_hostname + "/register", {
                            firstname: vm.auth.firstname,
                            lastname: vm.auth.lastname,
                            email: vm.auth.reg.username,
                            password: vm.auth.reg.password,
                            avatar: vm.auth.defaultAvatar,
                            affiliateLink: affiliate,
                            org: vm.optional.org,
                            domain: process.env.domain
                        })
                        .then(response => {
                            $("#registerModal").modal("hide");
                            vm.registerSpinner = false;
                            vm.login();
                        })
                        .catch(error => {
                            vm.auth.regError = true;
                            vm.registerSpinner = false;
                        });
                }
            });
        },
        login() {
            let vm = this;
            const apiData = {
                ...process.env.api_data,
                username: vm.auth.reg.username,
                password: vm.auth.reg.password,
            }

            axios
                .post(process.env.hostname + "/oauth/token", apiData)
                .then(response => {
                    $("#loginModal").modal("hide");
                    $("#registerModal").modal("hide");
                    vm.data = response;
                    this.$auth.setToken(
                        response.data.token_type + " " + response.data.access_token,
                        response.data.expires_in + Date.now()
                    );
                    if (vm.optional.org) {
                        localStorage.setItem('redirBcTrainer', true);
                    }
                    this.$router.push("/dashboard");
                })
                .catch(error => {
                    vm.auth.logError = true;
                    // vm.auth.username = "";
                    // vm.auth.password = "";
                    vm.loginSpinner = false;
                });
        }
    },
    computed: {
        ...mapState({
            userStore: state => state.user
        })
    }
}
</script>

<style scoped>

</style>
