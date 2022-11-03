<template>
    <div>
        <h1 class="page-title">
            {{org.info.name}}
            <div class="btn-group organisation-settings" style="float:right;" v-if="org.trainers.length > 0">
                <a class="dropdown-toggle nav-link org-settings" data-toggle="dropdown" aria-haspopup="true"
                   aria-expanded="false">
                    <i class="fa fa-cog"></i>
                </a>
                <div class="dropdown-menu dropdown-menu-right">
                    <a class="dropdown-item" data-href="calendar" @click="setId">{{$t('Calendar')}}</a>
                    <a v-if="org.authRole == 'owner'" class="dropdown-item" data-href="assignPrograms" @click="setId">{{$t('Assign Programs')}}</a>
                    <a class="dropdown-item" data-href="programs" @click="setId">{{$t('Show Programs')}}</a>
                </div>
            </div>
        </h1>
        <div class="card">
            <div class="card-block">
                <div v-if="org.trainers.length === 0 && typeof org.trainers === 'string'" class="text-center">
                    <h1 class="fa fa-spinner fa-spin"></h1>
                </div>
                <div v-else>
                    <div v-if="userStore.info.userId == org.owner.id || userStore.info.id == org.owner.id || org.authRole == 'admin' && org.status > 0"
                         class="form-group">
                        <button data-toggle="modal" data-target="#addTrainers" class="btn primary-bg m5"><i
                                class="fa fa-plus"></i> {{$t('Add Trainers')}}
                        </button>
                        <button v-if="userStore.info.userId == org.owner.id || userStore.info.id == org.owner.id"
                                class="btn btn-danger m5" @click="closeOrganisation(org.id)">
                            <i class="fa fa-times"></i> {{$t('Close Organisation')}}
                        </button>
                    </div>
                    <div v-if="org.status == 1 || userStore.info.id == org.owner.id || userStore.info.userId == org.owner.id || org.authRole == 'client'">
                        <div class="table-responsive">
                            <table class="table table-hover table-sm">
                                <thead>
                                <tr>
                                    <th>{{$t('Trainer')}}</th>
                                    <th>{{$t('Role')}}</th>
                                    <th v-if="org.authRole === 'owner'" class="w50">{{$t('Settings')}}</th>
                                    <th class="w50 text-right">{{$t('Info')}}</th>
                                    <th v-if="org.owner.id == userStore.info.id || org.authRole == 'admin'"
                                        class="w50 text-right">
                                        {{$t('Remove')}}
                                    </th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td>{{org.owner.firstname}} {{org.owner.lastname}}</td>
                                    <td><p class="role">{{org.owner.organisationRole}}</p></td>
                                    <td v-if="org.authRole === 'owner'"></td>
                                    <td class="icons">
                                        <a v-if="org.owner.roleId == 3" href="javascript:void(0)"
                                           @click="updateModal(org.owner.id,'owner')" data-toggle="modal"
                                           data-target="#trainerInfoModal">
                                            <i class="fa fa-user"></i>
                                        </a>
                                    </td>
                                </tr>
                                <tr v-for="trainer in org.trainers">
                                    <td>{{trainer.firstname}} {{trainer.lastname}}</td>
                                    <td>
                                        <p class="role" v-if="org.authRole == 'member' || org.authRole == 'client'">
                                            {{trainer.organisationRole}}</p>
                                        <div v-else-if="org.authRole == 'admin'">
                                            <select @change="roleChange(org.id,trainer,trainer.organisationRoleId)"
                                                    class="form-control"
                                                    v-model="trainer.organisationRoleId">
                                                <option v-if="role.id > 1" v-for="role in organisationRoles"
                                                        :value="role.id">
                                                    {{role.description}}
                                                </option>
                                            </select>
                                        </div>
                                        <div v-else>
                                            <select @change="roleChange(org.id,trainer,trainer.organisationRoleId)"
                                                    class="form-control"
                                                    v-model="trainer.organisationRoleId">
                                                <option v-for="role in organisationRoles" :value="role.id">
                                                    {{role.description}}
                                                </option>
                                            </select>
                                        </div>
                                    </td>
                                    <td v-if="org.authRole == 'owner'" class="icons">
                                        <a @click="trainerSettingsOpen(trainer)" href="javascript:void(0)">
                                            <i class="fa fa-cog"></i>
                                        </a>
                                    </td>
                                    <td class="icons">
                                        <a href="javascript:void(0)" @click="updateModal(trainer.id,'other')"
                                           data-toggle="modal"
                                           data-target="#trainerInfoModal">
                                            <i class="fa fa-user"></i>
                                        </a>
                                    </td>
                                    <td v-if="org.owner.id == userStore.info.id || org.authRole == 'admin'"
                                        class="icons">
                                        <a @click="removeTrainer(trainer.id)" class="reject-org"
                                           href="javascript:void(0)">
                                            <i class="fa fa-remove"></i>
                                        </a>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div v-if="showTableSpinner" class="table-spinner col-12 text-center">
                    <i class="fa fa-spinner fa-spin"></i>
                </div>
                <div class="error 501" v-else-if="org.owner.id != userStore.info.id && org.status < 1">
                    <div v-if="org.status == null" class="form-group invitation-buttons">
                        <h4>{{$t('You have an invitation from this organisation')}} !</h4>
                        <button class="btn btn-lg btn-outline-primary" @click="setInvitation(org.id,true)"><i
                                class="fa fa-check"></i> {{$t('Accept')}}
                        </button>
                        <button class="btn btn-lg btn-outline-danger" @click="setInvitation(org.id,false)"><i
                                class="fa fa-ban"></i> {{$t('Reject')}}
                        </button>
                    </div>
                    <h1 class="error-header">501</h1>
                    <p class="error-para">{{$t('You dont have permissions')}}</p>
                </div>
            </div>
        </div>
        <!-- Modal -->
        <div id="trainerInfoModal" class="modal fade" role="dialog">
            <div class="modal-dialog">

                <!-- Modal content-->
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal">&times;</button>
                        <h4 class="modal-title">{{ currentUser.firstname }} {{ currentUser.lastname }}</h4>
                    </div>
                    <div class="modal-body">
                        <div v-if="rewards !== 0">
                            <div class="row">
                                <div class="col-4">
                                    <img :src="storage + currentUser.avatar" alt=""
                                         class="img-responsive img-thumbnail">
                                </div>
                                <div class="col-8" id="curentUserInfo">
                                    <div class="row">
                                        <div class="col-12">
                                            <div class="row">
                                                <div class="col-6"><b>{{$t('Firstname')}}</b></div>
                                                <div class="col-6">{{ currentUser.firstname }}</div>
                                            </div>
                                        </div>
                                        <div class="col-12">
                                            <div class="row">
                                                <div class="col-6"><b>{{$t('Lastname')}}</b></div>
                                                <div class="col-6">{{ currentUser.lastname }}</div>
                                            </div>
                                        </div>
                                        <div class="col-12">
                                            <div class="row">
                                                <div class="col-6"><b>{{$t('Location')}}</b></div>
                                                <div class="col-6">{{ currentUser.address }}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row" id="currentUserDesc">
                                <div class="col-12">
                                    <p>
                                        <b>
                                            {{$t('Description')}}
                                        </b>
                                    </p>
                                    <p>
                                        <i>
                                            {{ currentUser.description }}
                                        </i>
                                    </p>
                                </div>
                            </div>
                            <div class="row" id="currentUserRewards">
                                <div class="col-12">
                                    <p>
                                        <b>
                                            {{$t('Rewards')}}
                                        </b>
                                    </p>
                                    <p v-if="rewards.length < 1">
                                        {{$t('No rewards')}}
                                    </p>
                                    <div>
                                        <p v-for="reward in rewards">
                                            <i class="fa fa-trophy"></i> {{ reward.description }}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal">{{$t('Close')}}</button>
                    </div>
                </div>

            </div>
        </div>

        <!-- Modal -->
        <div id="addTrainers" class="modal fade" role="dialog">
            <div class="modal-dialog">

                <!-- Modal content-->
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal">&times;</button>
                        <h4 class="modal-title">{{$t('Add Trainers')}}</h4>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-12">
                                <label>{{$t('Invite other trainers to your organisation')}}</label>
                                <div class="input-group">
                                    <input v-model="trainer" type="email"
                                           :class="{'form-control': true, 'is-invalid': errors.has('email')}"
                                           :placeholder="$t('Email address')" @keypress.enter.prevent="addTrainer"
                                           name="email">
                                    <span class="input-group-btn">
                                    <button class="btn btn-secondary" type="button"
                                            @click="addTrainer">{{$t('Add trainer')}}</button>
                                </span>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-12">
                                <div class="table-responsive">
                                    <table class="table table-hover table-striped" v-if="trainers.length > 0">
                                        <thead>
                                        <th>{{$t('E-Mail')}}</th>
                                        <th class="text-right">{{$t('Actions')}}</th>
                                        </thead>
                                        <tbody>
                                        <tr v-for="(trainer, key) in trainers">
                                            <td>{{ trainer }}</td>
                                            <td class="text-right">
                                                <button type="button" class="btn btn-danger btn-sm"
                                                        @click="trainers.splice(key, 1)">{{$t('Remove')}}
                                                </button>
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button @click="addTrainers()" type="button" class="btn primary-bg" data-dismiss="modal">
                            {{$t('Save')}}
                        </button>
                    </div>
                </div>

            </div>
        </div>


        <!-- Member organisation Settings -->
        <div id="memberSettingsModal" class="modal fade" role="dialog">
            <div class="modal-dialog">

                <!-- Modal content-->
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal">&times;</button>
                        <h4 class="modal-title">{{$t('Trainer Settings')}}</h4>
                    </div>
                    <form @submit.prevent="updateTrainerSettings">
                        <div class="modal-body">
                            <div class="row">
                                <div class="col-12">
                                    <h5>{{$t('Working hours')}}</h5>
                                    <div class="form-group">
                                        <label>{{$t('Available from')}}</label>
                                        <input v-validate="'required|numeric'" type="number" name="availFrom"
                                               :data-vv-as="$t('Available from')" class="form-control"
                                               v-model="trainerSettings.trainer.availableFrom"
                                               :placeholder="$t('Available from')">
                                        <span v-show="errors.has('availFrom')" class="text-danger">{{ errors.first('availFrom') }}</span>
                                    </div>
                                    <div class="form-group">
                                        <label>{{$t('Available to')}}</label>
                                        <input v-validate="'required|numeric'" type="number" name="availTo"
                                               :data-vv-as="$t('Available to')" class="form-control"
                                               v-model="trainerSettings.trainer.availableTo"
                                               :placeholder="$t('Available to')">
                                        <span v-show="errors.has('availTo')" class="text-danger">{{ errors.first('availTo') }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="submit" class="btn primary-bg">
                                <i class="fa fa-spinner fa-spin" v-if="trainerSettings.spinner"></i>
                                <span v-else>{{$t('Save')}}</span>
                            </button>
                        </div>
                    </form>
                </div>

            </div>
        </div>
    </div>
</template>

<script>
    import axios from "axios";
    import {mapState} from "vuex";
    import config from "../../../config";

    export default {
        name: "organisation",
        data() {
            return {
                storage: config.hostname + '/storage/',
                org: {
                    id: null,
                    createdBy: null,
                    info: {},
                    status: "ardit",
                    trainers: '',
                    authRole: null,
                    owner: {
                        id: 1,
                        status: ""
                    }
                },
                showTableSpinner: false,
                trainer: "",
                currentUser: "",
                rewards: "",
                authUser: "",
                users: [],
                trainers: [], // trainer to add the a existing organisations
                newRole: 0,
                trainerSettings: {
                    trainer: {},
                    spinner: false
                }
            };
        },
        beforeCreate() {
            // if(localStorage.getItem('orgToVisit') == null){
            //     this.$router.push('/organisations');
            //     return;
            // }
        },
        created() {
            this.getAutoLoadData();
            this.loadData();
            let vm = this;
            axios.get(config.api_hostname + "/getTrainersList").then(response => {
                vm.users = response.data.users;
            });
        },
        computed: {
            ...mapState({
                userStore: store => store.user,
                organisationRoles: state => state.organisationRoles
            })
        },
        methods: {
            updateTrainerSettings() {
                this.$validator.validateAll().then(result => {
                    if (result) {
                        let vm = this;
                        this.trainerSettings.spinner = true;
                        axios.post(`${config.api_hostname}/updateTrainerWorkingHours`,
                            {
                                //vm.trainerSettings.trainer
                                id: vm.trainerSettings.trainer.id,
                                availableFrom: vm.trainerSettings.trainer.availableFrom,
                                availableTo: vm.trainerSettings.trainer.availableTo,
                            }).then(response => {
                            vm.loadData();
                            vm.trainerSettings.spinner = false;
                            vm.trainerSettings.trainer = '';
                            $('#memberSettingsModal').modal('hide');
                        });
                    }
                });
            },
            trainerSettingsOpen(trainer) {
                this.trainerSettings.trainer = trainer;
                this.trainerSettings.trainer.availableFrom = this.trainerSettings.trainer.availableFrom.split(' ')[0];
                this.trainerSettings.trainer.availableTo = this.trainerSettings.trainer.availableTo.split(' ')[0];
                $('#memberSettingsModal').modal('show');
            },
            setId(e) {
                let el = e.target;
                localStorage.setItem("calendarOrgId", this.org.id);
                localStorage.setItem("calendarOrgName", this.org.info.name);
                localStorage.setItem("orgRole", this.org.authRole);

                this.$router.push(this.org.id + `/${el.dataset['href']}`);
            },
            loadData() {
                let path = document.location.href;
                this.org.id = Number(path.substring(path.lastIndexOf("/") + 1));
                // this.org.status = localStorage.getItem('orgStatus');
                // this.org.createdBy = localStorage.getItem('orgCB');
                // localStorage.removeItem('orgToVisit');
                // localStorage.removeItem('orgStatus');
                // localStorage.removeItem('orgCB');
                let vm = this;
                axios
                    .post(config.api_hostname + "/getOrganisationById", {
                        id: this.org.id
                    })
                    .then(response => {
                        vm.org.info = response.data.organisation[0];
                        vm.org.trainers = response.data.trainers;
                        vm.org.owner = response.data.owner[0];
                        vm.org.authRole = response.data.authRole;
                        this.$store.dispatch(
                            "setOrganisationRoles",
                            response.data.organisationRoles
                        );
                    });
            },
            updateModal: function (id, owner) {
                this.rewards = 0;
                let vm = this;
                axios
                    .post(config.api_hostname + "/trainerRewards", {id: id})
                    .then(response => {
                        vm.rewards = response.data.rewards;
                    });
                // if(this.org.owner.id != 2){
                if (owner != "owner") {
                    for (let x in this.org.trainers) {
                        if (this.org.trainers[x].id == id) {
                            this.currentUser = this.org.trainers[x];
                        }
                    }
                } else {
                    vm.currentUser = vm.org.owner;
                }
                // }
            },
            removeTrainer(id) {
                this.$swal({
                    title: this.$t('Are you sure') + " ?",
                    confirmButtonText: this.$t('Yes'),
                    cancelButtonText: this.$t('Cancel'),
                    showCancelButton: true,
                    showCloseButton: true,
                    target: $("#rtl-container")[0]
                }).then(
                    result => {
                        axios
                            .post(config.api_hostname + "/removeTrainerFromOrganisations", {
                                trainerId: id,
                                orgId: this.org.id
                            })
                            .then(response => {
                                let vm = this;
                                axios
                                    .post(config.api_hostname + "/getOrganisationById", {
                                        id: this.org.id
                                    })
                                    .then(response => {
                                        vm.org.info = response.data.organisation[0];
                                        vm.org.trainers = response.data.trainers;
                                        this.$notify({
                                            group: "foo",
                                            title: this.$t('Message'),
                                            text: this.$t('Trainer removed') + "!"
                                        });
                                    });
                            });
                    },
                    dismiss => {
                    }
                );
            },
            addTrainer() {
                if (this.errors.has("email")) {
                    return false;
                }
                this.trainers.push(this.trainer);
                // Reset the input
                this.trainer = "";
            },
            closeOrganisation(id) {
                this.$swal({
                    title: this.$t('Confirm'),
                    text: this.$t('Are you sure you want to close organisaion') + ' ?',
                    confirmButtonText: this.$t('Yes'),
                    cancelButtonText: this.$t('Cancel'),
                    showCancelButton: true,
                    showCloseButton: true,
                    target: $("#rtl-container")[0]
                }).then(
                    result => {
                        axios
                            .post(config.api_hostname + "/closeOrganisation", {
                                orgId: id
                            })
                            .then(response => {
                                this.$notify({
                                    group: "foo",
                                    title: this.$t('Message'),
                                    text: this.$t('Organisation closed') + "!"
                                });
                                this.$router.push("/organisations/myOrgs");
                            });
                    },
                    dismiss => {
                    }
                );
            },
            setInvitation(id, status) {
                axios
                    .post(config.api_hostname + "/setInvitation", {
                        trainerId: this.userStore.info.id,
                        organisationId: id,
                        status: status
                    })
                    .then(response => {
                        if(response.data.statusCode === 200){
                            this.$router.push({name:'myOrgs'});
                        }
                        this.org.status = response.data.status;
                    });
            },
            getAutoLoadData() {
                let vm = this;
                axios
                    .get(config.api_hostname + "/organisationComponentData")
                    .then(res => {
                        if (res.data.org[0] != undefined) {
                            this.org.mainOrg = res.data.org[0].mainOrganisation;
                        }
                        res.data.orgStatus.map(item => {
                            if (item.organisationId == vm.org.id) {
                                vm.org.status = item.acceptedByTrainer;
                            }
                        });
                    });
            },
            roleChange(org, user, role) {
                if (this.org.authRole == "owner" && role == 1) {
                    this.$swal({
                        title: 'Confirm',
                        text:
                        this.$t('Are you sure you want to make') + " " +
                        user.firstname +
                        " " +
                        user.lastname +
                        " " + this.$t('owner of this organisation') + "?",
                        confirmButtonText: this.$t('Yes'),
                        cancelButtonText: this.$t('Cancel'),
                        showCancelButton: true,
                        showCloseButton: true,
                        target: $("#rtl-container")[0]
                    }).then(
                        result => {
                            axios
                                .post(config.api_hostname + "/setOrganisationMemberRole", {
                                    orgId: org,
                                    userId: user.id,
                                    roleId: role
                                })
                                .then(response => {
                                    this.$router.push("myOrgs");
                                });
                        },
                        dismiss => {
                        }
                    );
                } else {
                    axios
                        .post(config.api_hostname + "/setOrganisationMemberRole", {
                            orgId: org,
                            userId: user.id,
                            roleId: role
                        })
                        .then(response => {
                            this.loadData();
                        });
                }
            },
            addTrainers() {
                let vm = this;
                this.showTableSpinner = true;
                axios
                    .post(config.api_hostname + "/addTrainers", {
                        orgId: vm.org.id,
                        owner: vm.org.owner.id,
                        trainers: vm.trainers,
                        name: vm.org.info.name,
                        hostname: document.location.href
                    })
                    .then(response => {
                        vm.loadData();
                        vm.showTableSpinner = false;
                        vm.trainers = [];
                        this.$notify({
                            group: "foo",
                            title: this.$t('Message'),
                            text: this.$t('Trainer added') + "!"
                        });
                    });
            }
        }
    };
</script>

<style lang="scss">
    @import "../../../styles/_variables.scss";

    .w50 {
        width: 50px;
    }

    .card-block {
        padding: 20px;
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
        .role {
            padding-left: 17px;
            margin-bottom: 5px;
        }
        select.form-control {
            background: none;
            border-color: transparent;
            max-width: 120px;
            &:hover,
            &:active {
                border-color: rgba(0, 0, 0, 0.15);
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

    .invitation-buttons {
        margin-bottom: 30px;
    }

    .table-spinner {
        i {
            font-size: 30px;
        }
    }

    .icons {
        .fa-remove {
            color: #dc3545;
        }
    }

    .organisation-settings {
        .org-settings {
            cursor: pointer;
            display: inherit;
            i {
                font-size: 25px;
            }
            &::after {
                display: none;
            }
        }
        .dropdown-menu {
            a {
                cursor: pointer;
                padding: 5px 20px;
            }
        }
    }
</style>