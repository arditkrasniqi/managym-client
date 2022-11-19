<template>
    <div>

        <div>
            <h1 class="page-title">Organisations</h1>


            <div v-if="org.myOrganisations.length > 0">

                <!-- If the current user has created organisations list the organisations -->
                <table class="table table-hover table-sm">
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th class="w50 text-right">Visit</th>
                        <th class="w50 text-right">Close</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="organisation in org.myOrganisations">
                        <td>
                            {{organisation.name}}
                        </td>
                        <td class="icons">
                            <a href="javascript:void(0)" @click="goToOrg(organisation)">
                                <i class="fa fa-arrow-right"></i>
                            </a>
                        </td>
                        <td class="icons">
                            <a @click="closeOrganisation(organisation.id)" class="reject-org" href="javascript:void(0)">
                                <i class="fa fa-remove"></i>
                            </a>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <div v-else-if="org.myOrganisations.length == 0 && typeof org.myOrganisations == 'object'">
                <form @submit.prevent="createOrganisation">
                    <div class="row">
                        <div class="col-12 col-sm-6">
                            <div class="form-group">
                                <textarea id="organisationDesc" class="form-control" v-model="org.organisationDesc" placeholder="Organisation description"></textarea>
                            </div>
                        </div>
                        <div class="col-12 col-sm-6">
                            <div class="form-group">
                                <input type="text" placeholder="Organisation name" v-model="org.organisationName" class="form-control">
                            </div>
                            <div class="form-group">
                                <input @blur="searchBlur()" @keydown="searchUsers()" v-model="keyword" type="text" class="form-control" placeholder="Invite trainers">
                                <div v-if="filterUsers.length > 0" id="filterUsers">
                                    <ul>
                                        <li v-for="user in filterUsers" @click="selectUserInvite(user)">{{ user.firstname }} {{ user.lastname }}</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <hr>
                        <div class="col-12">
                            <div class="form-group">
                                <button class="btn primary-bg" type="submit">Create Organisation</button>
                            </div>
                        </div>
                    </div>
                </form>
                <div v-if="usersToInvite.length > 0 && userStore.role == 'customer'" class="card card-inverse usersList">
                    <div class="card-block">
                        <h4>Trainers List</h4>
                        <div class="form-group">
                            <span class="userInvite" v-for="user in usersToInvite">{{ user.firstname }} {{ user.lastname }}<span @click="removeInivitedUser(user.id)" class="removeUser">X</span></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="userStore.role == 'trainer'">
            <!-- Othervise display the "Create new organisation" form -->
            <h1 class="page-title">Manage Organisations</h1>
            <div class="table-responsive" v-if="org.organisations !== null">
                <table v-if="org.organisations.length > 0" class="table table-sm table-hover">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <!--<th>Description</th>-->
                            <th class="w50 text-right">Main Organisation</th>
                            <th class="w50 text-right">Invitation</th>
                            <th class="w50 text-right">Visit</th>
                            <th class="w50 text-right">Leave</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="organisation in org.organisations">
                            <td>
                                {{organisation.name}}
                            </td>
                            <!--<td>-->
                                <!--{{organisation.description}}-->
                            <!--</td>-->
                            <td class="icons text-right">
                                <a v-if="organisation.status == 1" href="javascript:void(0);" @click="makeMainOrganisation(organisation)"><i class="fa" :class="{'fa-toggle-off':org.mainOrg != organisation.id, 'fa-toggle-on':org.mainOrg == organisation.id}"></i></a>
                            </td>
                            <td class="icons">
                                <div v-if="organisation.status == null">
                                    <a href="javascript:void(0);" @click="setInvitation(organisation,true)"><i class="fa fa-check-square-o"></i></a>
                                    <a href="javascript:void(0);" @click="setInvitation(organisation,false)" class="reject-org"><i class="fa fa-times"></i></a>
                                </div>
                                <div v-else-if="organisation.status == 0">
                                    <p>Rejected</p>
                                </div>
                                <div v-else>
                                    <p>Accepted</p>
                                </div>
                            </td>
                            <td class="icons">
                                <a href="javascript:void(0)" @click="goToOrg(organisation)">
                                    <i class="fa fa-arrow-right"></i>
                                </a>
                            </td>
                            <td class="icons">
                                <a href="javascript:void(0)" @click="leaveOrganisation(organisation.id)">
                                    <i class="fa fa-sign-out"></i>
                                </a>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div class="error" v-if="org.organisations.length == 0">
                    <h1 class="error-header">404</h1>
                    <p class="error-para">No organisations found !</p>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import axios from 'axios'
    import {mapState} from 'vuex'

    export default {
        data(){
            return {
                authUser:'',
                keyword:null,
                users:[],
                filterUsers:[],
                usersToInvite:[],
                org:{
                    organisationName:null,
                    organisationDesc:null,
                    organisations:null,
                    mainOrg:0,
                    orgInvitations:[],
                    myOrganisations:'',
                },
            }
        },
        beforeCreate(){
            axios.get(process.env.api_hostname + '/organisationComponentData')
                .then(res => {
                    // this.$store.dispatch('setUserRole',res.data.role[0].description);
                    if(userStore.role == 'trainer'){
                        if(res.data.org[0] != undefined){
                            this.org.mainOrg = res.data.org[0].mainOrganisation;
                        }
                        this.org.orgInvitations = res.data.orgStatus;
                    }else if(res.data.myOrgs){
                        this.org.myOrganisations = res.data.myOrgs;
                    }
                })
        },
        created(){
            this.org.myOrganisations = '';
            this.getTrainerOrganisations();
            var vm = this;
            axios.get(process.env.api_hostname + '/getTrainersList')
                .then(response => {
                    vm.users = response.data.users;
                })
        },
        computed:{
            ...mapState({
                userStore: state => state.user,
            })
        },
        methods:{
            getAutoLoadData(){
                axios.get(process.env.api_hostname + '/organisationComponentData')
                    .then(res => {
                        this.$store.dispatch('setUserRole',res.data.role[0].description);
                        if(res.data.role[0].description == 'trainer'){
                            if(res.data.org[0] != undefined){
                                this.org.mainOrg = res.data.org[0].mainOrganisation;
                            }
                            this.org.orgInvitations = res.data.orgStatus;
                        }
                    })
            },
            selectUserInvite(user){
                let exists = false;
                // this.usersToInvite.push(user)
                if(user.id == this.userStore.info.id){
                    return;
                }
                if(this.usersToInvite.length == 0){
                    this.usersToInvite.push(user)
                }else{
                    this.usersToInvite.map(u => {
                        if(user.id == u.id){
                            exists = true
                        }
                    });
                    if(!exists){
                        this.usersToInvite.push(user)
                    }
                }
            },
            searchUsers(){
                if(this.keyword !== null){
                    this.filterUsers = this.users.filter(user => {
                        return user.firstname.toLowerCase().includes(this.keyword.toLowerCase())
                    });
                }
            },
            searchBlur(){
                let vm = this;
                setTimeout(function(){
                    vm.filterUsers = [];
                    vm.keyword = null;
                },100);
            },
            removeInivitedUser(id){
                let vm = this;
                this.usersToInvite.splice(id,2);
                this.usersToInvite.map((user,index) => {
                    if(id == user.id){
                        vm.usersToInvite.splice(index,1);
                    }
                });
            },
            createOrganisation(){
                axios.post(process.env.api_hostname + '/newOrganisation',
                    {
                        createdBy:this.userStore.info.id,
                        name:this.org.organisationName,
                        description:this.org.organisationDesc,
                        status:null,
                        trainers:this.usersToInvite
                    })
                    .then(response => {
                        if(response.data.statusCode == 200){
                            this.$notify({
                                group: 'foo',
                                title: 'Message',
                                text: 'Organisation created successfully!'
                            });
                            this.usersToInvite = [];
                            this.org.organisationName = null;
                            this.org.organisationDesc = null;
                            this.org.myOrganisations = response.data.myOrgs;
                        }
                    });
            },
            getTrainerOrganisations(){
                axios.get(process.env.api_hostname + '/trainerOrganisations')
                    .then(response => {
                        this.org.organisations = response.data.organisations;
                        this.mergeStatus();
                    });
            },
            makeMainOrganisation(org){
                axios.post(process.env.api_hostname + '/setMainOrganisation',
                    {
                        trainerId:this.userStore.info.id,
                        organisationId:org.id
                    })
                    .then(response => {
                        this.org.mainOrg = response.data.organisation;
                    })
            },
            setInvitation(org,status){
                axios.post(process.env.api_hostname + '/setInvitation',{
                    trainerId:this.userStore.info.id,
                    organisationId:org.id,
                    status:status
                }).then(response => {
                    let status = response.data.status == true ? 'accepted' : 'rejected';
                    this.$notify({
                        group: 'foo',
                        title: 'Message',
                        text: 'Invitation ' + status + '!'
                    });
                    this.getAutoLoadData();
                    this.getTrainerOrganisations();
                });
            },
            mergeStatus(){
                this.org.orgInvitations.map((org,index) => {
                    if(this.org.organisations[index] != null || this.org.organisations[index] != undefined){
                        this.org.organisations[index].status = org.acceptedByTrainer;
                    }
                });
            },
            goToOrg(org){
                localStorage.setItem('orgToVisit',org.id);
                if(org.status == null){
                    localStorage.setItem('orgStatus',-1);
                }else{
                    localStorage.setItem('orgStatus',org.status);
                }
                localStorage.setItem('orgCB',org.createdBy);
                this.$router.push('/organisations/'+org.id);
            },
            closeOrganisation(id){
                this.$swal({
                    title: 'Are you sure ?',
                    confirmButtonText:  'Yes',
                    cancelButtonText:  'Cancel',
                    showCancelButton: true,
                    showCloseButton: true,
                    target: $('#rtl-container')[0]
                }).then(result => {
                    axios.post(process.env.api_hostname + '/closeOrganisation',{
                        orgId:id
                    }).then(response => {
                        this.org.myOrganisations = response.data.myOrgs;
                        this.$notify({
                            group: 'foo',
                            title: 'Message',
                            text: 'Organisation closed!'
                        });
                    });
                }, dismiss => {});
            },
            newOrganisationForm(){
                this.org.myOrganisations = []
            },
            leaveOrganisation(id){
                this.$swal({
                    title: 'Are you sure ?',
                    confirmButtonText:  'Yes',
                    cancelButtonText:  'Cancel',
                    showCancelButton: true,
                    showCloseButton: true,
                    target: $('#rtl-container')[0]
                }).then(result => {
                    axios.post(process.env.api_hostname + '/leaveOrganisation',{
                        orgId:id
                    }).then(response => {
                        this.$notify({
                            group: 'foo',
                            title: 'Message',
                            text: 'Organisation left!'
                        });
                        this.org.organisations.map((item,index) => {
                            if(item.id == id){
                                this.org.organisations.splice(index,1)
                            }
                        });
                    });
                }, dismiss => {});
            }
        }
    }
</script>
<style lang="scss">
    @import "../../styles/_variables.scss";
    #filterUsers{
        position:relative;
        ul{
            width:100%;
            z-index:999999;
            position:absolute;
            max-height:200px;
            overflow-y:auto;
            border:1px solid #ccc;
            background:white;
            border-top:none;
            list-style-type:none;
            margin:0;
            padding:0;
            li{
                padding:10px;
                cursor:pointer;
                &:hover{
                    background:rgba(0,0,0,.05);
                }
            }
        }
    }
    .usersList{
        padding:10px !important;
        background-color: #fff;
        border-color: #ded7d7;
        h4{
            color:#ccc;
        }
        .userInvite{
            color:#505050;
            margin:3px;
            display:inline-block;
            padding:2px 35px 2px 10px;
            border:1px solid #ccc;
            border-radius:3px;
            position:relative;
            .removeUser{
                font-weight:bold;
                position:absolute;
                top:0;
                right:0;
                border-left:1px solid #ccc;
                background:white;
                padding:2px 7px;
                &:hover{
                    background:#ccc;
                    cursor:pointer;
                }
            }
        }
    }
    #organisationDesc{
        min-height:100px;
        max-height:200px;
    }
    .table {
        .icons{
             text-align:right;
             a{
                 font-size:20px;
                 color:$primary-color;
                 &:first-child{
                     margin-right:10px;
                 }
             }
             .reject-org{
                 color:#ff8383;
             }
             p{
                 font-size:14px;
                 color:#ccc;
             }
         }
    }
</style>
