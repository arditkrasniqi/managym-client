<template>
    <div class="container-fluid">
        <div class="row">
            <nav v-if="userStore.auth" class="col-sm-3 col-md-2 d-none d-sm-block bg-white sidebar">
                <div class="col-12">
                    <div class="row menu-profile">
                        <div class="col-3">
                            <img :src="storage + userStore.info.avatar" alt="">
                        </div>
                        <div class="col-8">
                            <p>{{ userStore.info.firstname }} {{ userStore.info.lastname }}</p>
                            <span class="fa fa-cog rounded-left" @click="goToProfile"></span>
                            <span class="fa fa-sign-out rounded-right" @click="logout"></span>
                        </div>
                    </div>
                </div>
                <ul class="nav nav-pills flex-column" id="menu">
                    <li @click="toggleSidebar" class="nav-item">
                        <router-link to="/dashboard">
                            <i class="fa fa-tachometer"></i> {{$t('Dashboard')}}
                        </router-link>
                        <!--<a @click="setActive()" class="nav-link" data-url="search-trainer" href="#/search-trainer"><i class="fa fa-search"></i> Search Trainer</a>-->
                    </li>
                    <div v-if="userStore.role == 'admin'">
                        <li @click="toggleSidebar" class="nav-item">
                            <router-link :to="{name:'trainer.certificates.admin'}">
                                <i class="fa fa-certificate"></i> {{$t('Certificates')}}
                            </router-link>
                            <router-link :to="{name:'payout.requests'}">
                                <i class="fa fa-credit-card"></i> {{$t('Payout Requests')}}
                            </router-link>
                            <!--<a @click="setActive()" class="nav-link" data-url="search-trainer" href="#/search-trainer"><i class="fa fa-search"></i> Search Trainer</a>-->
                        </li>
                    </div>
                    <div v-else>
                        <li @click="toggleSidebar" class="nav-item">
                            <router-link to="/organisations/myOrgs">
                                <i class="fa fa-users"></i> {{$t('My Organisations')}}
                                <!--<ul class="dropdown">-->
                                    <!--<li>-->
                                        <!--<router-link to="/organisations/myOrgs">My Organisations</router-link>-->
                                    <!--</li>-->
                                <!--</ul>-->
                            </router-link>
                            <!--<a @click="setActive()" class="nav-link" data-url="organisations" href="#/organisations"><i class="fa fa-users"></i> Organisations <span class="sr-only">(current)</span></a>-->
                        </li>
                        <li @click="toggleSidebar" class="nav-item">
                            <router-link to="/search-trainer">
                                <i class="fa fa-search"></i> {{$t('Search Trainer')}}
                            </router-link>
                            <!--<a @click="setActive()" class="nav-link" data-url="search-trainer" href="#/search-trainer"><i class="fa fa-search"></i> Search Trainer</a>-->
                        </li>
                        <li @click="toggleSidebar" class="nav-item">
                            <router-link to="/calendar">
                                <i class="fa fa-calendar"></i> {{$t('Calendar')}}
                            </router-link>
                        </li>
                        <!--If role == trainer-->
                        <li @click="toggleSidebar" v-if="userStore.role == 'trainer'" class="nav-item">
                            <router-link to="/my-programs">
                                <i class="fa fa-calendar-plus-o"></i> {{$t('Programs')}}
                            </router-link>
                            <router-link to="/account-balance">
                                <i class="fa fa-balance-scale"></i> {{$t('Account Balance')}}
                            </router-link>
                            <router-link to="/invoices" v-if="userStore.info.planId != 1">
                                <i class="fa fa-shopping-cart"></i> {{$t('Invoices')}}
                            </router-link>
                        </li>
                        <!--End If-->
                    </div>
                </ul>
            </nav>
            <main role="main" class="first-main" v-if="userStore.info !== null && userStore.info.emailConfirmed === 0 && userStore.showConfirmEmail">
                <div class="row" v-if="emailConfSpinner">
                    <div class="col-12 text-center">
                        <i class="conf-spinner fa fa-spinner fa-spin"></i>
                    </div>
                </div>
                <div v-else>
                    <p>Hi, {{userStore.info.firstname}}</p>
                    <p>{{$t('We have sent you a confirmation link to')}} "{{userStore.info.email}}" {{$t('to confirm email')}}.</p>
                    <p>{{$t('Did not get any email from us')}} ? <a class="btn primary-bg" id="resend-conf-email" @click="resendConfirmation" href="javascript:void(0)">{{$t('Resend Confirmation')}}</a></p>
                </div>
            </main>
            <main role="main" :class="{'guest-main': !userStore.auth}">
                <router-view></router-view>
            </main>
        </div>
    </div>
</template>
<script>
    import Content from "./Content.vue";
    import {mapState} from "vuex";
    import config from "../../config";
    import axios from 'axios'

    export default {
        components: {
            "content-area": Content
        },
        data() {
            return {
                storage: config.hostname + "/storage/",
                emailConfSpinner:false,
            };
        },
        created() {
        },
        mounted(){
        },
        methods: {
            resendConfirmation(){
                let vm = this;
                this.emailConfSpinner = true;
                let user = {
                  domain: config.domain,
                  email: this.userStore.info.email,
                  id: this.userStore.info.id
                };
                axios.post(`${config.api_hostname}/resendEmailConfirmation`,user)
                    .then(response => {
                        this.$swal({
                            title: this.$t('Email Confirmation'),
                            text: this.$t('Check your inbox for confirmation link'),
                            confirmButtonText: this.$t('OK'),
                            cancelButtonText: this.$t('Cancel'),
                            showCancelButton: false,
                            showCloseButton: true,
                            target: $("#rtl-container")[0]
                        }).then(
                            dismiss => {
                            }
                        );
                        vm.emailConfSpinner = false;
                        this.$store.commit('setConfEmail',false);
                    });
            },
            toggleSidebar:function(){
                if($(window).width() <= 770){
                    if($('.sidebar').css('display') == 'none')
                        $('.sidebar').attr('style','display:block !important');
                    else
                        $('.sidebar').attr('style','display:none !important');
                }
            },
            goToProfile() {
                this.$router.push("/profile");
                this.toggleSidebar();
            },
            logout() {
                this.$store.commit("logout");
                this.$router.push("/");
                window.location.href = '/';
            }
        },
        computed: {
            ...mapState({
                userStore: state => state.user
            })
        }
    };
</script>
<style lang="scss">
    main.first-main{
        margin-left:240px !important;
        background:#fffbe5;
        border-bottom:1px solid #efebd5;
        p{
            margin:2px;
            font-size:15px;
        }
    }
    @import "../../styles/variables.scss";
    .sidebar {
        min-width: 230px;
        width: 230px;
        position: fixed;
        top: 51px;
        bottom: 0;
        left: 0;
        z-index: 1000;
        padding: 20px 0;
        overflow-x: hidden;
        overflow-y: auto;
        border-right: 1px solid #eee;
        .nav-link {
            border-radius: 0;
        }
        * {
            color: #858c9e !important;
        }
    }
    .conf-spinner{
        font-size:25px;
    }

    .page-title {
        font-size: 30px;
        color: #464646;
        padding-bottom: 9px;
        margin-bottom: 20px;
        border-bottom: 1px solid #eee;
    }

    .menu-profile {
        margin: 20px 0;
        > div:first-child {
            padding: 0;
            height: 50px;
            /*background-image:url('../../assets/img/default-avatar.png');*/
            background-size: 100% 100%;
            border-radius: 100%;
            img {
                width: 100%;
                height: 100%;
                border-radius: 100%;
            }
        }
        > div:last-child {
            p {
                margin-bottom: 2px;
            }
            span {
                padding: 5px 10px;
                font-size: 13px;
                border: 1px solid #858c9e;
                color: #858c9e;
                cursor: pointer;
                /*border-radius:2px;*/
                transition: background 0.3s;
                &:hover {
                    background: #858c9e;
                    color: white !important;
                }
                &:last-child {
                    margin-left: -5px;
                }
            }
        }
    }

    #menu {
        li a {
            font-size: 16px;
            i {
                font-size: 15px;
                margin-right: 7px;
            }
        }
    }

    main {
        margin-left: 240px;
        width: 100% !important;
        padding: 20px;
    }

    .nav-item {
        a {
            display: block;
            padding: 0.5rem 1rem;
            &:hover {
                text-decoration: none;
            }
        }
    }

    .router-link-active {
        background: $primary-color !important;
        color: white !important;
        & i {
            color: white !important;
        }
    }
    @media screen and (max-width:767px){
        .sidebar{
            top:41px !important;
        }
    }
    @media screen and (max-width:500px){
        .error-header{
            font-size:100px !important;
        }
    }
    .profile-img{
        width:100% !important;
    }
    @media screen and (max-width: 770px) {
        main {
            margin-left: 0 !important;
        }
        main.first-main {
            margin-top: -6px !important;
            margin-left: 0 !important;
        }
    }
</style>