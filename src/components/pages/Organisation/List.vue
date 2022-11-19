<template>
    <div v-if="userStore.role != 'admin'">
        <h1 class="page-title">{{ $t('My Organisations') }}</h1>
        <!-- If the current user has created organisations list the organisations -->
        <div class="row">
            <div class="col-sm-12" :class="{ 'col-md-6': userStore.role == 'customer' }">
                <div class="card">
                    <div class="card-header">{{ $t('My Organisations') }}</div>
                    <div class="card-block">
                        <div class="form-group">
                            <a href="javascript:void(0)" @click="addMyOrg" class="btn primary-bg"
                                v-if="!upgradeShow">{{ $t('Add my Organisation') }}</a>
                            <a href="javascript:void(0)" @click="goToPlans" class="btn primary-bg"
                                v-else>{{ $t('View Trainer Plans and Upgrade') }}</a>
                            <!--<router-link :to="{name: 'organisations.create'}" class="btn primary-bg">Add my Organisation</router-link>-->
                        </div>
                        <div class="table-responsive">
                            <table v-if="organisations != null && organisations.length > 0"
                                class="table table-hover table-sm">
                                <thead>
                                    <tr>
                                        <th>{{ $t('Name') }}</th>
                                        <th v-if="userStore.role != 'customer'" class="text-right">
                                            {{ $t('Main Organisaion') }}</th>
                                        <th class="w50 text-right">{{ $t('Visit') }}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="organisation in organisations">
                                        <td>
                                            {{ organisation.name }}
                                        </td>
                                        <td v-if="userStore.role != 'customer'" class="icons">
                                            <a v-if="organisation.status == 1" href="javascript:void(0);"
                                                @click="makeMainOrganisation(organisation)"><i class="fa"
                                                    :class="{ 'fa-toggle-off': mainOrg != organisation.id, 'fa-toggle-on': mainOrg == organisation.id }"></i></a>
                                        </td>
                                        <td class="icons">
                                            <a href="javascript:void(0)" @click="goToOrg(organisation)">
                                                <i class="fa fa-arrow-right"></i>
                                            </a>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div class="error" v-if="organisations != null && organisations.length < 1">
                            <!--<h1 class="error-header">404</h1>-->
                            <p class="error-para">{{ $t('No organisations found') }} !</p>
                        </div>
                        <div v-else-if="organisations == null" class="text-center">
                            <i class="fa fa-spinner fa-spin"></i>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="userStore.role == 'customer'" class="col-sm-12 col-md-6">
                <div class="card">
                    <div class="card-header">
                        {{ $t('Other Organisations') }}
                    </div>
                    <div class="card-block">
                        <div class="table-responsive">
                            <table v-if="otherOrganisations != null && otherOrganisations.length > 0"
                                class="table table-hover table-sm">
                                <thead>
                                    <tr>
                                        <th>{{ $t('Name') }}</th>
                                        <th v-if="userStore.role != 'customer'" class="text-right">
                                            {{ $t('Main Organisaion') }}</th>
                                        <th class="w50 text-right">{{ $t('Visit') }}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="organisation in otherOrganisations">
                                        <td>
                                            {{ organisation.name }}
                                        </td>
                                        <td v-if="userStore.role != 'customer'" class="icons">
                                            <a v-if="organisation.status == 1" href="javascript:void(0);"
                                                @click="makeMainOrganisation(organisation)"><i class="fa"
                                                    :class="{ 'fa-toggle-off': mainOrg != organisation.id, 'fa-toggle-on': mainOrg == organisation.id }"></i></a>
                                        </td>
                                        <td class="icons">
                                            <a href="javascript:void(0)" @click="goToOrg(organisation)">
                                                <i class="fa fa-arrow-right"></i>
                                            </a>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div class="error" v-if="otherOrganisations != null && otherOrganisations.length < 1">
                            <!--<h1 class="error-header">404</h1>-->
                            <p class="error-para">{{ $t('No organisations found') }} !</p>
                        </div>
                        <div v-else-if="otherOrganisations == null" class="text-center">
                            <i class="fa fa-spinner fa-spin"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import axios from 'axios'
import { mapState } from 'vuex'

export default {
    data() {
        return {
            upgradeShow: false,
            organisations: null,
            orgInvitations: [],
            mainOrg: 0,
            otherOrganisations: null
        }
    },
    methods: {
        goToOrg(org) {
            this.$router.push('/organisations/' + org.id);
        },
        closeOrganisation(id) {
            this.$swal({
                title: this.$t('Are you sure') + ' ?',
                confirmButtonText: this.$t('Yes'),
                cancelButtonText: this.$t('Cancel'),
                showCancelButton: true,
                showCloseButton: true,
                target: $('#rtl-container')[0]
            }).then(result => {
                axios.post(process.env.api_hostname + '/closeOrganisation', {
                    orgId: id
                }).then(response => {
                    this.myOrganisations.map((org, index) => {
                        if (org.id == id) {
                            this.myOrganisations.splice(index, 1);
                        }
                    });
                    this.$notify({
                        group: 'foo',
                        title: this.$t('Message'),
                        text: this.$t('Organisation closed') + '!'
                    });
                });
            }, dismiss => { });
        },
        mergeStatus() {
            this.orgInvitations.map((org, index) => {
                if (this.organisations[index] != null || this.organisations[index] != undefined) {
                    this.organisations[index].status = org.acceptedByTrainer;
                }
            });
        },
        makeMainOrganisation(org) {
            axios.post(process.env.api_hostname + '/setMainOrganisation',
                {
                    trainerId: this.userStore.info.userId,
                    organisationId: org.id
                })
                .then(response => {
                    this.mainOrg = response.data.organisation;
                })
        },
        getOrganisations() {
            axios.get(process.env.api_hostname + '/userOrganisations').then(response => {
                this.organisations = response.data.organisations;
                // setTimeout(() => {
                //     this.mergeStatus();
                // },1000);
                // this.myOrganisations = response.data.myOrganisations;
            });
        },
        getOtherOrganisations() {
            let vm = this;
            let userId = this.userStore.info.id;
            axios.get(process.env.api_hostname + `/customerOtherOrganisations/${userId}`)
                .then(response => {
                    vm.otherOrganisations = response.data.otherOrganisations;
                });
        },
        goToPlans() {
            localStorage.setItem('showPlans', true);
            this.$router.push('/profile');
        },
        addMyOrg() {
            if (
                (this.userStore.role == "trainer" &&
                    this.trainerPlan &&
                    this.trainerPlan.organisationCreateAccess) ||
                this.userStore.role == "customer"
            ) {
                this.$router.push({ name: "organisations.create" });
            } else {
                this.$swal({
                    title: this.$t('Forbidden'),
                    text: this.$t('An Organisation can be created only by Expert and Enterprise Trainers') + '!',
                    confirmButtonText: this.$t('OK'),
                    cancelButtonText: this.$t('Cancel'),
                    showCancelButton: false,
                    showCloseButton: true,
                    target: $("#rtl-container")[0]
                }).then(result => {
                    this.upgradeShow = true;
                }, dismiss => {
                    this.upgradeShow = true;
                });
            }
        }
    },
    created() {
        this.getOrganisations();
        if (this.userStore.role === null) {
            setTimeout(() => {
                if (this.userStore.role == 'customer')
                    this.getOtherOrganisations();
            }, 2000);
        } else {
            if (this.userStore.role == 'customer')
                this.getOtherOrganisations();
        }
    },
    beforeCreate() {
        axios.get(process.env.api_hostname + '/organisationComponentData')
            .then(res => {
                // this.$store.dispatch('setUserRole',res.data.role[0].description);
                if (this.userStore.role == 'trainer') {
                    if (res.data.org[0] != undefined) {
                        this.mainOrg = res.data.org[0].mainOrganisation;
                    }
                    this.orgInvitations = res.data.orgStatus;
                    // }else if(res.data.myOrgs){
                    //     this.org.myOrganisations = res.data.myOrgs;
                }
            })
    },
    computed: {
        ...mapState({
            userStore: state => state.user,
            trainerPlans: store => store.trainerPlans,
            trainerPlan: store => store.authTrainerPlan
        })
    }
}
</script>
<style lang="scss">
@import "../../../styles/_variables.scss";

.w50 {
    width: 50px;
}

.table {
    .icons {
        text-align: right;

        a {
            font-size: 20px;
            color: $primary-color;

            &:first-child {
                margin-right: 10px;
            }
        }

        .reject-org {
            color: #ff8383;
        }

        p {
            font-size: 14px;
            color: #ccc;
        }
    }
}

/* modal styles */
#curentUserInfo .row .col-6 {
    padding-top: 5px;
    padding-bottom: 5px;
}

#currentUserDesc {
    /*border-top:1px solid #ccc;*/
    /*margin-top:20px;*/
    padding-top: 20px;

    b p {
        margin-bottom: 5px;
    }
}

#currentUserRewards {
    background: #eaeaea;

    b p {
        margin-bottom: 5px;
    }

    div div p {
        margin: 5px;
        color: #2b2b2b;
        font-size: 15px;

        .fa {
            font-size: 15px;
            margin-right: 5px;
        }
    }
}

.card-block {
    padding: 20px;
}
</style>