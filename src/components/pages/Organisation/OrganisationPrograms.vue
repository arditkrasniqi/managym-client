<template>
    <div>
        <h1 class="page-title">{{org.name}} - <i>{{$t('Programs')}}</i></h1>
        <div class="card">
            <div class="card-block">
                <div class="table-responsive">
                    <table class="table-hover table">
                        <thead>
                        <tr>
                            <th>{{$t('Title')}}</th>
                            <th>{{$t('Description')}}</th>
                            <th>{{$t('Duration')}}</th>
                            <th>{{$t('Price')}}</th>
                            <th class="w50" v-if="org.role == 'owner'">
                                <span>{{$t('Edit')}}</span>
                            </th>
                            <th class="w50" v-if="org.role == 'owner'">
                                <i class="fa fa-spinner fa-spin pull-right" v-if="removeSpinner"></i>
                                <span v-else>{{$t('Remove')}}</span>
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="program in org.programs" :key="program.id">
                            <td>{{ program.title }}</td>
                            <td>{{ program.description }}</td>
                            <td>{{ program.duration }}</td>
                            <td>CHF {{ program.price }}</td>
                            <td class="icons text-center" v-if="org.role == 'owner'">
                                <a href="javascript:void(0)" @click="editProgramModal(program)">
                                    <i class="fa fa-edit"></i>
                                </a>
                            </td>
                            <td class="icons text-center" v-if="org.role == 'owner'">
                                <a href="javascript:void(0)" @click="removeProgram(program)">
                                    <i class="text-danger fa fa-trash"></i>
                                </a>
                            </td>
                        </tr>
                        <tr v-if="typeof org.programs == 'string' && org.programs == ''">
                            <td class="text-center" colspan="6">
                                <i class="fa fa-spinner fa-spin"></i>
                                <p>{{$t('Loading programs')}}...</p>
                            </td>
                        </tr>
                        <tr v-if="typeof org.programs == 'object' && org.programs.length == 0">
                            <td colspan="6">
                                <p>{{$t('No programs defined yet')}}.</p>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- Modal -->
        <div id="editProgramModal" class="modal fade" role="dialog">
            <div class="modal-dialog">

                <!-- Modal content-->
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal">&times;</button>
                        <h4 class="modal-title">{{$t('Edit Program')}}</h4>
                    </div>
                    <form @submit.prevent="editProgram">
                        <div class="modal-body" v-if="showTrainersEdit">
                            <div class="form-group">
                                <p>{{$t('Trainers')}}</p>
                                <span v-if="typeof programTrainers === 'object' && programTrainers.length === 0">
                                    No Trainers
                                </span>
                            </div>
                            <div class="form-group">
                                <span :title="$t('Remove Trainer')" @click="removeTrainer(trainer)" class="trainer-item"
                                      v-for="trainer in programTrainers">
                                    {{trainer.firstname}} {{trainer.lastname}} <i class="fa fa-remove"></i>
                                </span>
                            </div>
                            <div class="form-group">
                                <a @click="showAddTrainer" v-if="!showAddTrainerForm" href="javascript:void(0)" class="btn btn-secondary">
                                    <i class="fa fa-plus"></i> {{$t('Add Trainers')}}
                                </a>
                               <div class="row add-trainer-form" v-else>
                                   <div class="col-12 col-sm-7">
                                       <select v-model="newTrainer" class="form-control">
                                           <option value="">{{$t('Choose trainer')}}</option>
                                           <option v-for="orgTrainer in organisationTrainers" :value="orgTrainer.id">{{orgTrainer.firstname}} {{orgTrainer.lastname}}</option>
                                       </select>
                                   </div>
                                   <div class="col-12 col-sm-5">
                                       <a @click="addTrainer" class="btn primary-bg">{{$t('Add trainer')}}</a>
                                   </div>
                               </div>
                            </div>
                        </div>
                        <div class="modal-body" v-else>
                            <div class="form-group">
                                <label>{{$t('Title')}}</label>
                                <input v-validate="'required'" v-model="programToEdit.title" name="title"
                                       :data-vv-as="$t('Title')" type="text" class="form-control">
                                <span v-show="errors.has('title')"
                                      class="text-danger">{{ errors.first('title') }}</span>
                            </div>
                            <div class="form-group">
                                <label>{{$t('Description')}}</label>
                                <textarea v-validate="'required'" v-model="programToEdit.description" type="text"
                                          name="description" :data-vv-as="$t('Description')"
                                          class="form-control"></textarea>
                                <span v-show="errors.has('description')" class="text-danger">{{ errors.first('description') }}</span>
                            </div>
                            <div class="form-group">
                                <label>{{$t('Duration')}}</label>
                                <input readonly v-validate="'required'" v-model="programToEdit.duration" type="text"
                                       name="duration" :data-vv-as="$t('Duration')" placeholder="hh:mm"
                                       id="programDuration" class="timepicker form-control"></input>
                                <span v-show="errors.has('duration')"
                                      class="text-danger">{{ errors.first('duration') }}</span>
                            </div>
                            <div class="form-group">
                                <label>{{$t('Price')}}</label>
                                <div class="input-group">
                                    <span class="input-group-addon" id="basic-addon1">CHF</span>
                                    <input type="text" v-model="programToEdit.price" v-validate="'required|decimal'"
                                           class="form-control" name="price" :data-vv-as="$t('Price')">
                                </div>
                                <p v-show="errors.has('price')" class="text-danger">{{ errors.first('price') }}</p>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button class="btn primary-bg" type="submit" v-if="showTrainersEdit">
                                <span v-if="editSpinner" class="fa fa-spinner fa-spin"></span>
                                <span v-else>{{$t('Edit')}}</span>
                            </button>
                            <a @click="trainersEdit" class="btn primary-bg" v-else>
                                <i class="fa fa-arrow-right"></i>
                            </a>
                        </div>
                    </form>
                </div>

            </div>
        </div>
    </div>
</template>

<script>
    import config from '../../../config'
    import axios from 'axios'
    import {mapState} from 'vuex'

    let oid = 0;
    let oname = '';
    let role = '';

    export default {
        name: "programs",
        mounted() {

        },
        data() {
            return {
                removeSpinner: false,
                org: {
                    id: 0,
                    name: null,
                    programs: '',
                    role:''
                },
                editSpinner: false,
                programToEdit: '',
                programTrainers: '',
                organisationTrainers: '',
                showTrainersEdit: true,
                showAddTrainerForm: false,
                newTrainer:''
            }
        },
        beforeCreate() {
            if (localStorage.getItem('calendarOrgId') !== null) {
                oid = parseInt(localStorage.getItem('calendarOrgId'));
                oname = localStorage.getItem('calendarOrgName');
                role = localStorage.getItem('orgRole');
                localStorage.removeItem('calendarOrgId');
                localStorage.removeItem('calendarOrgName');
                localStorage.removeItem('orgRole');
            } else {
                this.$router.push('/organisations/myOrgs');
            }
        },
        created() {
            this.org.id = oid;
            this.org.role = role;
            this.org.name = oname;
            this.getPrograms();
        },
        methods: {
            addTrainer(){
                if(this.newTrainer !== ''){
                    this.organisationTrainers.map((orgTrainer, index) => {
                        if(orgTrainer.id === this.newTrainer){
                            this.programTrainers.push(orgTrainer);
                            this.organisationTrainers.splice(index,1);
                            this.newTrainer = '';
                        }
                    });
                }
            },
            showAddTrainer(){
                this.showAddTrainerForm = true;
            },
            removeTrainer(trainer) {
                this.programTrainers.map((item, index) => {
                    if (trainer.id === item.id) {
                        this.organisationTrainers.push(item);
                        this.programTrainers.splice(index, 1);
                    }
                });
            },
            trainersEdit() {
                this.$validator.validateAll().then(result => {
                    if (result) {

                        this.showTrainersEdit = true;
                    }
                });
            },
            editProgramModal(p) {
                this.programToEdit = p;
                $('#editProgramModal').modal('show');
            },
            editProgram() {
                this.editSpinner = true;
                let vm = this;
                let program = this.programToEdit;
                axios.put(config.api_hostname + '/editProgram',
                    {
                        programId: program.id,
                        title: program.title,
                        description: program.description,
                        duration: program.duration,
                        price: program.price,
                        trainers: vm.programTrainers
                    }).then(response => {
                    vm.editSpinner = false;
                    $('#editProgramModal').modal('hide');
                    // this.$notify
                });
            },
            getPrograms() {
                let vm = this;
                axios.get(`${config.api_hostname}/getOrganisationPrograms/${vm.org.id}`)
                    .then(response => {
                        vm.org.programs = response.data.programs;
                        vm.programTrainers = response.data.programTrainers;
                        vm.organisationTrainers = response.data.organisationTrainers.original.trainers;
                        vm.organisationTrainers = this.checkTrainers(vm.organisationTrainers,vm.programTrainers);
                    });
            },
            checkTrainers(group1, group2){
                let trainers = [];
                let check = true;
                group1.map((g1item, index) => {
                    group2.map(g2item => {
                        if(g1item.id === g2item.id){
                            check = false;
                        }
                    });
                    if(check){
                        trainers.push(g1item);
                    }
                });
                return trainers;
            },
            removeProgram(p) {
                let vm = this;
                this.$swal({
                    title: this.$t('Confirm'),
                    text: this.$t('Are you sure you want to remove this program') + ' ?',
                    confirmButtonText: this.$t('Yes'),
                    cancelButtonText: this.$t('Cancel'),
                    showCancelButton: true,
                    showCloseButton: true,
                    target: $("#rtl-container")[0]
                }).then(
                    result => {
                        this.removeSpinner = true;
                        axios.delete(config.api_hostname + '/removeProgram',
                            {
                                data: {
                                    programId: p.id,
                                    organisation: vm.org.id
                                }
                            }).then(response => {
                            vm.removeSpinner = false;
                            vm.org.programs = response.data.data;
                            this.$notify({
                                group: "foo",
                                title: this.$t('Message'),
                                text: this.$t('Program removed') + "!"
                            });
                        });
                    },
                    dismiss => {
                    }
                );
            },
        },
        computed: {
            ...mapState({
                userStore: state => state.user
            })
        }
    }
</script>

<style lang="scss" scoped>
    hr {
        display: block;
        width: 100%;
    }

    .card {
        .card-block {
            padding: 15px;
            > button {
                margin-bottom: 20px;
            }
            .icons {
                font-size: 22px;
            }
        }
    }

    .trainer-item {
        display: inline-block;
        padding: 3px 7px;
        border: 1px solid #ccc;
        border-radius: 3px;
        margin: 3px;
        &:hover {
            background: rgba(0, 0, 0, .10);
            cursor: pointer;
        }
    }
    .add-trainer-form{
        div{
            margin-top:3px;
            margin-bottom:3px;
        }
    }
</style>