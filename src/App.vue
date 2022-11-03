<template>
    <div id="app">
        <navbar></navbar>
        <sidebar></sidebar>
        <notifications group="foo"/>
    </div>
</template>
<script>
    import axios from "axios";
    import Navbar from "./components/static/Navbar.vue";
    import Sidebar from "./components/static/Sidebar.vue";
    import config from "./config.js";
    import URL from './assets/js/URL-Parser/js/URLParser'
    import {mapState} from 'vuex'

    export default {
        components: {
            navbar: Navbar,
            sidebar: Sidebar
        },
        beforeCreate() {
            if (localStorage.getItem("expiration") !== null) {
                let exp = new Date(localStorage.getItem("expiration"));
                let today = new Date();
                if (exp < today) {
                    this.$store.commit("logout");
                    this.$router.push("/");
                }
            }
        },
        computed: {
            ...mapState({
                userStore: state => state.user
            })
        },
        created() {
            let vm = this;
            let port =
                document.location.port == "" ? "" : ":" + document.location.port + "/";
            let hostname = "http://" + document.location.hostname + port;
            if (localStorage.getItem("token") !== null) {
                axios.defaults.headers.common["Authorization"] = localStorage.getItem(
                    "token"
                );
                axios.get(config.api_hostname + "/user").then(response => {
                    this.$store.dispatch("setAuth", true);
                    this.$store.dispatch("setAuthTrainerPlan", response.data.trainerPlan);
                    this.$store.dispatch("setUserRole", response.data.role[0].description);
                    if (response.data.role[0].description == "trainer") {
                        this.$store.dispatch("setAuthUser", response.data.user[0]);
                    } else {
                        this.$store.dispatch("setAuthUser", response.data.user);
                    }
                    if (response.data.hasOwnProperty("affiliateLink")) {
                        this.$store.dispatch(
                            "setAffiliateLink",
                            hostname +
                            "?affiliateLink=" +
                            response.data.affiliateLink[0].affiliateLink
                        );
                    }
                });
            }
            this.confirmEmail();
            this.affiliate();
        },
        data() {
            return {
                user: null,
                role: null,
            };
        },
        mounted() {
            $(".timepicker").each(function () {
                $(this).timepicker({
                    maxHours: 24,
                    showMeridian: false,
                });
            });
        },
        methods: {
            confirmEmail() {
                let vm = this;
                if (URL.get('confirmEmail')) {
                    let token = URL.get('confirmEmail');
                    axios.post(config.api_hostname + '/confirmEmail',
                        {
                            token: token
                        }).then(response => {
                        this.$store.commit('setActiveUserEmail', true);
                        if (response.data.statusCode == 200) {
                            this.$swal({
                                title: this.$t('Email Confirmation'),
                                text: this.$t('Your email has been confirmed successfully'),
                                confirmButtonText: this.$t('OK'),
                                cancelButtonText: this.$t('Cancel'),
                                showCancelButton: false,
                                showCloseButton: true,
                                target: $("#rtl-container")[0]
                            }).then(
                                dismiss => {
                                }
                            );
                        } else if (response.data.error) {
                            this.$swal({
                                title: this.$t('Invalid Token'),
                                text: this.$t('Errors occured during the email confirmation'),
                                confirmButtonText: this.$t('OK'),
                                cancelButtonText: this.$t('Cancel'),
                                showCancelButton: false,
                                showCloseButton: true,
                                target: $("#rtl-container")[0]
                            }).then(
                                dismiss => {
                                }
                            );
                        }
                        if (vm.userStore.auth == null) {
                            this.$router.push('/dashboard')
                        }
                    });

                }
            },
            affiliate() {
                /*
                          check if an affiliates exists
                          and verify its expiration
                          if its expired destroy the affiliate

                      */
                if (localStorage.getItem("affiliate") != null) {
                    let today = new Date();
                    let affiliate = JSON.parse(localStorage.getItem("affiliate"));
                    let expiration = new Date(affiliate.expiration);
                    if (today > expiration) {
                        localStorage.removeItem("affiliate");
                    }
                }
            }
        },
        name: "app"
    };
</script>

<style lang="scss">
    @import "./styles/_variables.scss";
    // @import "~fullcalendar/dist/fullcalendar.css";

    .form-control:disabled, .form-control[readonly] {
        background-color: white !important;
    }
    .modal-header {
        .close {
            padding: 0 !important;
            margin: 0 !important;
        }
    }
    .w50 {
        width: 50px;
    }

    .no-triangle.dropdown-toggle::after {
        border-top: none !important;
    }

    .dropdown {
        display: none;
        list-style-type: bullet;
        li {
            color: white !important;
            a {
                background: none !important;
                font-size: 13px !important;
                color: white !important;
                padding: 7px 0;
                &:active,
                &:hover {
                    background: #1e93e0 !important;
                }
            }
        }
    }

    .router-link-active .dropdown {
        display: block;
    }

    .nav-link.active,
    .active {
        background: $primary-color !important;
        color: white !important;
        & i {
            color: white !important;
        }
    }

    .primary-bg {
        background: $primary-color;
        color: white !important;
    }

    .primary-color {
        color: $primary-color;
    }

    body {
        background-color: #fafbfc !important;
        form {
            .text-danger {
                font-size: 14px;
            }
        }
    }

    * {
        font-family: "Open Sans", sans-serif;
    }

    @media screen and (max-width: 770px) {
        main, main.first-main {
            margin-left: 0 !important;
        }
        .sidebar {
            display: none !important;
        }
        .navbar-brand a {
            display: inline !important;
        }
    }

    .error {
        color: #ccc;
        text-align: center;
        .error-header {
            font-size: 200px;
            color: #cccc;
            font-weight: bold;
        }
        .error-para {
            color: #5f5f5f;
        }
    }

    // datetimepicker settings
    .datetime-picker {
        input {
            display: block !important;
            width: 100% !important;
            padding: 1.115rem 0.75rem !important;
            font-size: 1rem !important;
            line-height: 1.25 !important;
            color: #495057 !important;
            background-color: #fff !important;
            background-image: none !important;
            background-clip: padding-box !important;
            border: 1px solid rgba(0, 0, 0, 0.15) !important;
            border-radius: 0.25rem !important;
            transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s !important;
        }
    }

    .calender-div {
        background: #efefef;
        z-index: 9;
        > div {
            background: white !important;
        }
        .time-picker {
            background: #efefef !important;
        }
        .port {
            height: 25px !important;
        }
        .days {
            width: 30px !important;
        }
    }

    //
    .bootstrap-timepicker-meridian,
    .bootstrap-timepicker-minute,
    .bootstrap-timepicker-hour {
        border: none;
        outline: none;
    }

    .glyphicon-chevron-up {
        &:before {
            content: "^";
            /*color:transparent !important;*/
        }
    }

    .glyphicon-chevron-down {
        &:before {
            content: "^";
            display: inline-block;
            -webkit-transform: rotate(180deg);
            -moz-transform: rotate(180deg);
            -o-transform: rotate(180deg);
            -ms-transform: rotate(180deg);
            transform: rotate(180deg);
        }
    }

    .vdp-datepicker__calendar {
        header {
            margin-top: 0;
        }
    }

    .table-responsive {
        width: 100% !important;
        overflow-x: auto !important;
    }

    .pointer {
        cursor: pointer;
    }

    .m5 {
        margin-top: 5px;
        margin-bottom: 5px;
    }

    .m10 {
        margin-top: 10px;
        margin-bottom: 10px;
    }

    button, a.btn {
        cursor: pointer !important;
    }
</style>