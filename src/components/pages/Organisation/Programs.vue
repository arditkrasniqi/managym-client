<template>
    <div>
        <h1 class="page-title">{{org.name}} - <i>{{$t('Assign Program')}}</i></h1>

        <form @submit.prevent="defineProgram">
            <div class="card">
                <div class="card-block">
                    <div v-show="!trainerSelectShow" class="row">
                        <div class="col-12">
                            <div class="form-group">
                                <label>{{$t('Title')}}</label>
                                <input v-validate="'required'" v-model="program.title" name="title"
                                       :data-vv-as="$t('Title')" type="text" class="form-control">
                                <span v-show="errors.has('title')"
                                      class="text-danger">{{ errors.first('title') }}</span>
                            </div>
                            <div class="form-group">
                                <label>{{$t('Description')}}</label>
                                <textarea v-validate="'required'" v-model="program.description" type="text"
                                          name="description" :data-vv-as="$t('Description')"
                                          class="form-control"></textarea>
                                <span v-show="errors.has('description')" class="text-danger">{{ errors.first('description') }}</span>
                            </div>
                            <div class="form-group">
                                <label>{{$t('Duration')}}</label>
                                <input readonly v-validate="'required'" v-model="program.duration" type="text"
                                       name="duration" :data-vv-as="$t('Duration')" placeholder="hh:mm"
                                       class="timepicker form-control"></input>
                                <span v-show="errors.has('duration')"
                                      class="text-danger">{{ errors.first('duration') }}</span>
                            </div>
                            <div class="form-group">
                                <label>{{$t('Price')}}</label>
                                <div class="input-group">
                                    <span class="input-group-addon" id="basic-addon1">CHF</span>
                                    <input type="text" v-model="program.price" v-validate="'required|decimal'"
                                           class="form-control" name="price" :data-vv-as="$t('Price')">
                                </div>
                                <p v-show="errors.has('price')" class="text-danger">{{ errors.first('price') }}</p>
                            </div>
                        </div>
                    </div>
                    <div class="row" v-show="trainerSelectShow">
                        <div class="col-12" v-show="trainers.length > 0">
                            <p>{{$t('Select Trainers to assign this program to')}}:</p>
                            <div>
                                <span @click="assignTrainer(trainer,index)" class="trainer-item"
                                      v-for="(trainer,index) in trainers">
                                    {{trainer.firstname}} {{trainer.lastname}} <i class="fa fa-arrow-right"></i>
                                </span>
                            </div>
                        </div>
                        <hr v-if="trainers.length > 0 && assigned.length > 0">
                        <div class="col-12 assigned-list" v-show="assigned.length > 0">
                            <p>{{$t('Choosen trainers')}}</p>
                            <div>
                                <span @click="removeAssignTrainer(trainer,index)" class="trainer-item"
                                      v-for="(trainer,index) in assigned">
                                    {{trainer.firstname}} {{trainer.lastname}} <i class="fa fa-remove"></i>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card-footer">
                    <button v-if="trainerSelectShow && assigned.length > 0" type="submit"
                            class="pull-right btn primary-bg">
                        <i v-if="defineProgramSpinner" class="fa fa-spinner fa-spin"></i>
                        <span v-else>{{$t('Define Program')}}</span>
                    </button>
                    <button @click="next" class="pull-right btn primary-bg" v-else-if="!trainerSelectShow">
                        {{$t('Next')}} <i class="fa fa-arrow-right"></i>
                    </button>
                </div>
            </div>
        </form>
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
            let vm = this;
            $(".timepicker").each(function () {
                $(this).timepicker({
                    maxHours: 100,
                    showMeridian: false
                });
            });
            $('.timepicker').on('change', function () {
                if ($(this).val().endsWith(':')) {
                    $(this).val($(this).val() + '00')
                }
                vm.program.duration = $(this).val()
            });
        },


        data() {
            return {
                assigned: [],
                defineProgramSpinner: false,
                program: {
                    title: '',
                    description: '',
                    price: null,
                    trainers: [],
                    duration: null
                },
                trainers: [],
                org: {
                    id: 0,
                    name: null,
                    role:'',
                },
                trainerSelectShow: false,
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
            this.org.name = oname;
            this.org.role = role;
            this.getOrganisationTrainers();
        },
        methods: {
            removeAssignTrainer(t, i) {
                this.trainers.push(t);
                this.assigned.splice(i, 1);
            },
            assignTrainer(t, i) {
                this.assigned.push(t);
                this.trainers.splice(i, 1);
            },
            next(e) {
                this.trainerSelectShow = true;
                e.preventDefault();
            },
            getOrganisationTrainers() {
                axios.get(`${config.api_hostname}/getOrganisationTrainers/${this.org.id}`)
                    .then(response => {
                        this.trainers = response.data.trainers;
                    });
            },
            defineProgram() {
                this.$validator.validateAll().then(result => {
                    if (result) {
                        let vm = this;
                        this.defineProgramSpinner = true;
                        axios.post(config.api_hostname + '/newProgramMultipleTrainers',
                            {
                                trainers: vm.assigned,
                                title: vm.program.title,
                                description: vm.program.description,
                                duration: vm.program.duration,
                                price: vm.program.price,
                                organisationId: vm.org.id
                            }).then(response => {
                            vm.defineProgramSpinner = false;
                            this.$notify({
                                group: "foo",
                                title: this.$t('Message'),
                                text: this.$t('Program created') + "!"
                            });
                            this.trainerSelectShow = false;
                            this.assigned.map((item, index) => {
                                this.trainers.push(item);
                                this.assigned.splice(index, 1);
                            });
                            // vm.program.title = '';
                            // vm.program.description = '';
                            // vm.program.price = null;
                            // vm.program.trainers = [];
                            // vm.program.duration = null;

                            this.$router.push(`/organisations/${vm.org.id}`);
                        });
                    } else {
                        this.trainerSelectShow = false;
                    }
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

<style lang="scss" scoped>
    hr{
        display: block;
        width: 100%;
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

    textarea.form-control {
        min-height: 100px;
        max-height: 150px;
    }

    .card-block {
        padding: 15px;
    }

    .assigned-list {
        /*border-top: 1px solid #ccc;*/
        /*margin-top: 30px;*/
        /*padding-top: 30px;*/
    }
</style>