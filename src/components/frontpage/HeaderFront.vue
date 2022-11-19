<template>
    <div class="header">
        <div class="shade"></div>
        <div class="container">
            <nav class="navbar navbar-expand-lg">
                <a class="logo navbar-brand" href="javascript:void(0)"></a>
                <button class="navbar-toggler" type="button" data-toggle="collapse"
                    data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"
                    aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon fa fa-bars"></span>
                </button>

                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul class="navbar-nav search ml-auto mr-auto">
                        <li class="nav-item">
                            <!--<input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search">-->
                            <!--<button class="btn-search btn"><i class="fa fa-search"></i></button>-->
                        </li>
                    </ul>
                    <form class="form-inline my-2 my-lg-0 btn-left">
                        <i class="fa fa-user-circle-o"></i>
                        <a href="javascript:void(0)" data-toggle="modal" data-target="#loginModal"
                            id="loginModalBtn">{{ $t('Login') }}</a>
                        <a href="javascript:void(0)" data-toggle="modal" data-target="#registerModal"
                            id="registerModalBtn">{{ $t('Register') }}</a>
                        <div class="btn-group localisation">
                            <a class="dropdown-toggle no-triangle nav-link" data-toggle="dropdown" aria-haspopup="true"
                                aria-expanded="false">
                                <i class="fa fa-globe"></i>
                            </a>
                            <div class="dropdown-menu dropdown-menu-left">
                                <a href="javascript:void(0)" @click="setLocale('en')">English</a>
                                <a href="javascript:void(0)" @click="setLocale('de')">Deutch</a>
                            </div>
                        </div>
                    </form>
                </div>
            </nav>
            <h1 class="header-title ml-auto mr-auto">{{ $t('Find a trainer near you') }}</h1>
            <div class="search-form ml-auto mr-auto">
                <div class="row">
                    <div class="col-12 col-sm-8">
                        <input @keypress="citySearchOnChange" list="locationsList" type="search"
                            v-model="trainerSearch.city" class="form-control" :placeholder="$t('City to search in')">
                        <datalist id="locationsList">
                            <option :key="location.name" v-for="location in locationsList">{{ location.name }}</option>
                        </datalist>
                    </div>
                    <div class="col-12 col-sm-4">
                        <button @click="searchTrainer" class="btn btn-block" :disabled="!this.locationsList">
                            <i v-if="trainerSearch.buttonSpin && trainerList.length == 0"
                                class="fa fa-spinner fa-spin"></i>
                            <span v-if="trainerList.length > 0 || !trainerSearch.buttonSpin">{{ $t('Search') }}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Login Modal -->
        <div id="loginModal" class="modal fade" role="dialog">
            <div class="modal-dialog">

                <!-- Modal content-->
                <div class="modal-content">
                    <div class="modal-body">
                        <div class="row">
                            <div v-if="showLogin" class="col-8 ml-auto mr-auto text-center">
                                <div class="login-logo">
                                    <i class="fa fa-user-circle-o"></i>
                                    <h2 class="login-title">{{ $t('Login') }}</h2>
                                </div>
                                <div class="login-form">
                                    <form @submit.prevent="login">
                                        <div class="form-group">
                                            <input data-vv-validate-on="blur" v-validate="'required|email'"
                                                v-model="auth.username" name="loginUsername" data-vv-as="Email"
                                                type="text" :placeholder="$t('Email')" class="form-control">
                                            <span v-show="errors.has('loginUsername')"
                                                class="text-danger">{{ errors.first('loginUsername') }}</span>
                                        </div>
                                        <div class="form-group">
                                            <input data-vv-validate-on="blur" v-validate="'required|min:6'"
                                                v-model="auth.password" name="loginPassword" data-vv-as="Password"
                                                type="password" :placeholder="$t('Password')" class="form-control">
                                            <span v-show="errors.has('loginPassword')"
                                                class="text-danger">{{ errors.first('loginPassword') }}</span>
                                        </div>
                                        <div class="form-group">
                                            <div class="row login-buttons">
                                                <div class="col-12 col-sm-6">
                                                    <p><a href="javascript:void(0)"
                                                            @click="toggleLogin">{{ $t('Forgot password') }}?</a></p>
                                                    <h4><a class="gray" href="javascript:void(0)"
                                                            @click="showRegisterForm">{{ $t('Register') }}</a></h4>
                                                </div>
                                                <div class="col-12 col-sm-6">
                                                    <button type="submit" class="btn btn-block login-btn">
                                                        <span v-if="loginSpinner" class="fa fa-spinner fa-spin"></span>
                                                        <span v-else>{{ $t('Login') }}</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <div v-if="auth.logError" class="form-group text-danger">
                                            <span>{{ $t('Wrong email or password') }}</span>
                                            <br>
                                            <span>{{ $t('Please try again') }}</span>
                                        </div>
                                    </form>
                                </div>
                            </div>
                            <div v-else class="col-8 ml-auto mr-auto text-center">
                                <div class="login-logo pass-rec">
                                    <i class="fa fa-user-circle-o"></i>
                                    <h2 class="login-title">{{ $t('Password recovery') }}</h2>
                                </div>
                                <div class="form-group">
                                    <label>{{ $t('Please enter you email') }}</label>
                                    <input type="text" :placeholder="$t('Email')" v-model="recoveryEmail"
                                        class="form-control">
                                </div>
                                <div class="form-group">
                                    <button class="btn primary-bg" @click="recoverPassword">
                                        <i class="fa fa-spinner fa-spin" v-if="recoverySpinner"></i>
                                        <span v-else>
                                            {{ $t('Recover your password') }}
                                        </span>
                                    </button>
                                    <button class="btn btn-secondary" @click="toggleLogin">{{ $t('Cancel') }}</button>
                                </div>
                                <div class="form-group text-danger" v-if="e.error">{{ e.error }}</div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>

        <register-comp></register-comp>
        <!-- Modal -->
        <div id="resetPassModal" class="modal fade" role="dialog">
            <div class="modal-dialog">

                <!-- Modal content-->
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal">&times;</button>
                        <h4 class="modal-title">{{ $t('Password reset') }}</h4>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-12">
                                <div class="form-group">
                                    <label>{{ $t('New password') }}</label>
                                    <input type="password" v-model="reset.newPass" class="form-control">
                                </div>
                                <div class="form-group">
                                    <label>{{ $t('Confirm new password') }}</label>
                                    <input type="password" v-model="reset.confirmNewPass" class="form-control">
                                </div>
                                <div class="form-group text-danger" v-if="reset.error">{{ reset.error }}</div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button @click="resetPassword" class="btn primary-bg">
                            <i class="fa fa-spinner fa-spin" v-if="reset.showSpinner"></i>
                            <span v-else>{{ $t('Reset password') }}</span>
                        </button>
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
import register from './Register.vue'
import AutoComplete from '../../helpers/maps/AutoComplete'
import Geocode from '../../helpers/maps/Geocode'
import debounce from 'debounce'

export default {
    name: "header-4trainer",
    components: {
        'register-comp': register
    },
    data() {
        return {
            reset: {
                confirmNewPass: '',
                newPass: '',
                token: null,
                showSpinner: false,
                error: false,
                errors: {
                    length: this.$t('Password length should be at least 6 characters'),
                    mismatch: this.$t('Provided passwords do not match'),
                    unvalidToken: this.$t('Invalid token'),
                }
            },
            e: {
                error: false,
                errors: {
                    unvalidEmail: this.$t('The provided Email does not exists')
                }
            },
            recoverySpinner: false,
            loginSpinner: false,
            showLogin: true,
            recoveryEmail: null,
            trainerSearch: {
                city: "",
                buttonSpin: false
            },
            auth: {
                username: null,
                password: null,
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
            },
            locationsList: null
        };
    },
    computed: {
        ...mapState({
            trainerId: state => state.trainerVisit,
            trainerList: state => state.frontPage.trainerSearch.trainerList
        })
    },
    mounted() {
        if (URL.get("affiliateLink")) {
            let exp = new Date();
            exp.setDate(exp.getDate() + 2);
            let affiliate = {
                link: URL.get("affiliateLink"),
                expiration: exp
            };
            localStorage.setItem("affiliate", JSON.stringify(affiliate));
        }
        if (URL.get('passwordToken')) {
            $('#resetPassModal').modal('show');
        }
    },
    methods: {
        toggleLogin() {
            this.showLogin = !this.showLogin;
        },
        citySearchOnChange: debounce(async function (e) {
            const client = new AutoComplete(this.trainerSearch.city)
            await client.init();
            this.locationsList = client.getLocations()
        }, 1000),
        searchTrainer: async function () {
            if (this.trainerSearch.city !== "") {
                if (!this.locationsList || !this.locationsList.find(item => item.name == this.trainerSearch.city)) {
                    alert(this.$t('Please a location from dropdown'))
                    return;
                }

                this.trainerSearch.buttonSpin = true;

                const client = new Geocode(this.trainerSearch.city)
                await client.init();
                const coords = client.getCoords();

                axios.post(process.env.api_hostname + '/search-guest', { latitude: coords.lat, longitude: coords.lon })
                    .then(response => {
                        this.$store.dispatch("setTrainers", response.data.data);
                    });
            }
        },
        login() {
            let vm = this;
            this.$validator.validateAll().then(result => {
                if (result) {
                    this.loginSpinner = true;
                    const apiData = {
                        ...process.env.api_data,
                        username: vm.auth.username,
                        password: vm.auth.password
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
                            vm.loginSpinner = false;
                        });
                }
            });
            this.loginSpinner = false;
            setTimeout(function () {
                $('#registerModal').find('.text-danger');
            }, 5000);
        },
        showRegisterForm() {
            $('#loginModal').modal('hide');
            setTimeout(function () {
                $('#registerModal').modal('show');
            }, 500);
        },
        recoverPassword() {
            let vm = this;
            this.recoverySpinner = true;
            axios.post(process.env.api_hostname + '/recoverPassword',
                {
                    email: vm.recoveryEmail,
                    domain: process.env.domain
                }).then(response => {
                    if (response.data.error == 'unvalidEmail') {
                        vm.e.error = vm.e.errors.unvalidEmail;
                    }
                    this.$notify({
                        group: "foo",
                        title: this.$t("Message"),
                        text: this.$t("Check your email for a recovery link!")
                    });
                    vm.recoveryEmail = null;
                    $('#loginModal').modal('hide');
                    vm.showLogin = true;
                    vm.recoverySpinner = false;
                });
        },
        resetPassword() {
            let vm = this;
            this.reset.token = URL.get('passwordToken');
            this.reset.showSpinner = true;
            if (this.reset.newPass.length < 6 || this.reset.confirmNewPass.length < 6) {
                this.reset.error = this.reset.errors.length;
                this.reset.showSpinner = false;
                return;
            }
            if (this.reset.newPass != this.reset.confirmNewPass) {
                this.reset.error = this.reset.errors.mismatch;
                this.reset.showSpinner = false;
                return;
            }

            axios.post(process.env.api_hostname + '/resetPassword',
                {
                    password: vm.reset.confirmNewPass,
                    token: vm.reset.token
                }).then(response => {
                    if (response.data.error == 'unvalidToken') {
                        vm.reset.error = vm.reset.errors.unvalidToken;
                        setTimeout(() => {
                            $('#resetPassModal').modal('hide');
                            this.$router.push('/dashboard');
                        }, 1500);
                    }
                    if (response.data.statusCode == 200) {
                        this.$notify({
                            group: "foo",
                            title: this.$t("Message"),
                            text: this.$t("Password successfully changed")
                        });
                        $('#resetPassModal').modal('hide');
                        this.$router.push('/dashboard');
                        setTimeout(() => {
                            $('#loginModal').modal('show');
                        }, 500);
                    }
                    vm.reset.showSpinner = false;
                    vm.reset.newPass = '';
                    vm.reset.token = '';
                    vm.reset.confirmNewPass = '';
                });
        },
        setLocale: function (lang) {
            localStorage.setItem('locale', lang);
            this.$i18n.locale = lang;
        }
    }
};
</script>

<style lang="scss">
@media screen and (max-width: 500px) {
    .header {
        margin-bottom: 170px;
        height: 300px !important;

        .search-form {
            .row {
                div {
                    select {
                        color: black;
                    }
                }
            }
        }
    }
}

@media screen and (max-width: 575px) {
    .search-form {
        .row {
            div {
                margin: 10px auto;
            }
        }
    }

    #navbarSupportedContent {
        max-width: 100%;

        * {
            max-width: 100%;
        }
    }
}

@media screen and (max-width: 992px) {
    #navbarSupportedContent {
        padding: 10px;
        background: rgba(0, 0, 0, 0.83);
        position: absolute;
        top: 62px;
        right: 0;
    }
}

.input-field {
    background: none;
    outline: none;
    border: none;
    border-radius: 0;
    border-bottom: 2px solid #3da0d8;
}

.button {
    cursor: pointer;
    border-radius: 0;
    background: #3da0d8;
    color: white;
}

.header {
    padding-top: 30px;
    position: relative;
    height: 500px;
    background-image: url("../../assets/img/header.png");
    background-size: cover;
    background-position: center;

    .container {
        * {
            color: white;
        }

        position: inherit;
        z-index: 1;

        .logo {
            /*margin-right: 84px;*/
            width: 70px;
            height: 70px;
            background-image: url("../../assets/img/logo.png");
            background-size: 100% 100%;
        }

        .search {
            width: 500px;
            position: relative;

            li {
                width: 100%;

                input {
                    width: 100%;
                    border: 1px solid #3da0d8;
                    color: #3da0d8;
                    border-radius: 0;
                }

                .btn-search {
                    position: absolute;
                    top: 0;
                    right: 0;
                    background: none;
                    cursor: pointer;

                    i {
                        color: #3da0d8;
                    }
                }
            }
        }
    }

    .search-form {
        max-width: 500px;
        margin-top: 100px;

        input {
            @extend .input-field;
            /*font-size:12px;*/
            color: white;
        }

        button {
            @extend .button;
        }
    }

    .header-title {
        font-size: 24px;
        max-width: 500px;
        margin-top: 25px;
    }

    .btn-left {
        max-width: 500px;

        i {
            font-size: 30px;
        }

        a {
            padding: 5px 10px;

            &:nth-child(2) {
                border-right: 1px solid white;
            }

            &:hover {
                color: #3da0d8;
                text-decoration: none;
            }
        }
    }

    .shade {
        position: absolute;
        z-index: 0;
        width: 100%;
        height: 50%;
        top: 0;
        left: 0;
        background: rgba(0, 0, 0, 0.4);
    }

    .modal {
        .modal-content {
            .register-btn {
                @extend .button;
            }

            border-radius: 0;

            .login-logo {
                margin-top: 40px;

                i {
                    font-size: 100px;
                    color: #3da0d8;
                }

                .login-title {
                    margin-top: 5px;
                    color: #b1b1b1;
                }
            }

            .register-logo {
                margin-top: 40px;

                i {
                    font-size: 60px;
                    color: #3da0d8;
                }

                p {
                    color: #3da0d8;
                }

                .login-title {
                    margin-top: 5px;
                    color: #3da0d8;
                }
            }

            .login-form {
                margin-top: 40px;
                margin-bottom: 100px;

                .form-control {
                    @extend .input-field;
                    color: #3da0d8;
                }

                .login-buttons {
                    * {
                        &:hover {
                            text-decoration: none;
                        }
                    }

                    .login-btn {
                        @extend .button;
                    }

                    div {
                        &:first-child {
                            p {
                                margin-bottom: 3px;
                                font-size: 14px;
                            }

                            h4 {
                                color: #b1b1b1;
                                text-align: left;
                                margin-left: 10px;
                            }
                        }
                    }
                }
            }
        }
    }
}

.localisation {
    a {
        cursor: pointer;
    }

    .dropdown-menu {
        right: 0 !important;
        left: auto;

        a {
            display: block;
            color: black;
        }
    }
}

.pass-rec {
    margin-bottom: 40px;
}

.gray {
    color: #b2b2b1;
}
</style>
