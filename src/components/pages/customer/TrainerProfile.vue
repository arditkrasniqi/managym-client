<template>
    <div v-if="trainer.details !== ''" class="row">
        <!--<h1 class="page-title">Trainer Name #1</h1>-->
        <div class="col-12 col-lg-4 col-xl-3">
            <div class="card trainer-info">
                <img class="mob-profile-picture card-img-top" :src="storage + trainer.details.avatar" alt="Profile Picture">
                <div class="card-header desk">
                    <!--<center>-->
                    <img class="card-header-profile-picture" :src="storage + trainer.details.avatar" alt="Profile Picture">
                    <div>
                        <h4 class="card-title">{{ trainer.details.firstname }} {{ trainer.details.lastname}}</h4>
                        <p><i class="fa fa-map-marker"></i> {{ trainer.details.address }}</p>
                        <br/>
                        <p>{{$t('Available')}}: {{ trainer.details.availableFrom }} - {{ trainer.details.availableTo }}</p>
                        <p v-if="programs.count > 0">
                        CHF {{programs.minProgramPrice}}<span v-if="programs.maxProgramPrice != null"> - CHF {{programs.maxProgramPrice}}</span>
                        </p>
                    </div>
                    <!--<p>${{ trainer.details.perHour }}.00 / hour</p>-->
                    <!--</center>-->
                </div>
                <div class="card-block">
                    <div class="nav flex-column nav-pills" id="v-pills-tab" role="tablist"
                         aria-orientation="vertical">
                        <a @click="setActiveModule('about')" class="nav-link active" id="about-tab"
                           data-toggle="pill" href="#v-pills-home" role="tab" aria-controls="v-pills-home"
                           aria-selected="true">{{$t('About')}}</a>
                        <a @click="setActiveModule('makeAppointment')" class="nav-link" id="appointments-tab"
                           data-toggle="pill" href="#v-pills-home" role="tab" aria-controls="v-pills-home"
                           aria-selected="true">{{$t('Make an appointment')}}</a>
                        <a @click="setActiveModule('trainerPrograms')" class="nav-link" id="programs-tab"
                           data-toggle="pill" href="#v-pills-home" role="tab" aria-controls="v-pills-home"
                           aria-selected="true">{{$t('Programs Trainer Offers')}}</a>
                        <a @click="setActiveModule('todayAppointments')" class="nav-link" id="today-appointments-tab"
                           data-toggle="pill" href="#v-pills-home" role="tab" aria-controls="v-pills-home"
                           aria-selected="true">{{$t("Today's Calendar")}}</a>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-12 col-lg-8 col-xl-9">
            <div class="card" v-if="activeModule === 'about'">
                <div class="card-header">{{$t('About')}}</div>
                <div class="card-block">
                    <div class="mob">
                        <h4 class="card-title">{{ trainer.details.firstname }} {{ trainer.details.lastname}}</h4>
                        <p><i class="fa fa-map-marker"></i> {{ trainer.details.address }}</p>
                        <br/>
                        <p>{{$t('Available')}}: {{ trainer.details.availableFrom }} - {{ trainer.details.availableTo }}</p>
                        <p v-if="programs.count > 0">
                            CHF {{programs.minProgramPrice}}<span v-if="programs.maxProgramPrice != null"> - CHF {{programs.maxProgramPrice}}</span>
                        </p>
                        <hr>
                    </div>
                    <p><b>{{$t('About')}} {{ trainer.details.firstname }}</b></p>
                    <p class="card-text">{{ trainer.details.description }}</p>
                    <div v-if="trainer.rewards.length > 0 && trainer.rewards !== ''" id="trainerRewards">
                        <hr>
                        <p>
                            <b>{{$t('Rewards')}}</b>
                        </p>
                        <p class="trainer-reward" v-for="reward in trainer.rewards" v-bind:key="reward.id"><i
                                class="fa fa-trophy"></i> {{ reward.description }}</p>
                    </div>
                    <div v-if="trainer.certificates.length > 0 && trainer.certificates !== ''" id="trainerCertificates">
                        <hr>
                        <p>
                            <b>{{$t('Certificates')}}</b>
                        </p>
                        <p class="trainer-certificate" v-for="certificate in trainer.certificates"
                           v-bind:key="certificate.id">
                            <i class="fa fa-certificate"></i>
                            <span>{{ certificate.title }}</span>
                        </p>
                    </div>
                </div>
            </div>
            <div class="card profile-left" id="appointment" v-if="trainer.details.calendarAccess && activeModule === 'makeAppointment'">
                <div class="card-header">
                    <span>{{$t('Make an appointment')}}</span>
                </div>
                <div class="card-block">
                    <form v-if="trainer.details.calendarAccess" @submit.prevent="sendAppointmentRequest">
                        <div class="form-group">
                            <label>{{$t('Start date ?')}}</label>
                            <div class="row">
                                <div class="col-6">
                                    <datepicker :disabled="disabled" v-validate="'required|date_format:YYYY-MM-DD'" name="startDate" :data-vv-as="$t('Start Date')" placeholder="Appointment start Date" v-model="appointmentDate"></datepicker>
                                    <span v-show="errors.has('startDate')" class="text-danger">{{ errors.first('startDate') }}</span>
                                </div>
                                <div class="col-6">
                                    <input v-validate="'required'" type="text" :placeholder="$t('Start Time')" name="startTime" data-vv-as="Start Time" id="startTimepicker" class="form-control timepicker">
                                    <span v-show="errors.has('startTime')" class="text-danger">{{ errors.first('startTime') }}</span>
                                </div>
                            </div>
                            <span v-show="errors.has('AppointmentEndDate')" class="text-danger">{{ errors.first('AppointmentEndDate') }}</span>
                        </div>
                        <div v-if="1>2" class="form-group">
                            <label>{{$t('Appointment is gonna last until ?')}}</label>
                            <div class="row">
                                <div class="col-6">
                                    <datepicker :disabled="disabled" v-validate="'required|date_format:YYYY-MM-DD'" :placeholder="$t('Appointment end Date')" name="endDate" data-vv-as="End Date" v-model="appointmentEndDate"></datepicker>
                                    <span v-show="errors.has('endDate')" class="text-danger">{{ errors.first('endDate') }}</span></div>
                                <div class="col-6">
                                    <input v-validate="'required'" type="text" :placeholder="$t('End Time')" name="endTime" data-vv-as="End Time" id="endTimepicker" class="form-control timepicker">
                                    <span v-show="errors.has('endTime')" class="text-danger">{{ errors.first('endTime') }}</span>
                                </div>
                            </div>
                            <span v-show="errors.has('AppointmentEndDate')" class="text-danger">{{ errors.first('AppointmentEndDate') }}</span>
                        </div>
                        <div class="form-group" v-if="showEndDate">
                            <label>{{$t('End Date')}}</label>
                            <input type="text" disabled v-model="appointmentEndDateDisplay" class="form-control">
                        </div>
                        <div class="form-group">
                            <label>{{$t('Program')}}</label>
                            <select id="trainerProgramsList" v-validate="'required|numeric'" :data-vv-as="$t('Program')" name="program"
                                    v-model="trainerProgram" class="form-control">
                                <option value="" selected>{{$t('Choose Program')}}</option>
                                <option v-for="trainerProgram in programs.trainerProgramsList"
                                        :value="trainerProgram.id">
                                    {{trainerProgram.title}}
                                </option>
                            </select>
                            <span v-show="errors.has('program')" class="text-danger">{{ errors.first('program') }}</span>
                        </div>
                        <div class="form-group">
                            <label>{{$t('Why do you want to go to')}} {{ trainer.details.firstname }}?</label>
                            <textarea v-validate="'required'" name="description" class="form-control"
                                      v-model="appointmentReason" placeholder="Reason"></textarea>
                            <span v-show="errors.has('description')" class="text-danger">{{ errors.first('description') }}</span>
                        </div>
                        <div class="form-group">
                            <label>{{$t('Further information for')}} {{ trainer.details.firstname }}</label>
                            <textarea v-model="appointmentFurtherInfo" class="form-control"
                                      :placeholder="$t('Additional')"></textarea>
                        </div>
                        <div class="form-group">
                            <div class="row">
                                <div class="col-sm-4 col-lg-3 text-right">
                                    <a v-if="trainer.details.userId === userStore.info.id" disabled class="disabled btn btn-block primary-bg">
                                        <i class="fa"
                                           :class="{'fa-paper-plane-o':!buttonSpin, 'fa-spin fa-spinner':buttonSpin}"></i>
                                        {{$t('Send')}}
                                    </a>
                                    <button v-else type="submit" class="btn btn-block primary-bg">
                                        <i class="fa"
                                           :class="{'fa-paper-plane-o':!buttonSpin, 'fa-spin fa-spinner':buttonSpin}"></i>
                                        {{$t('Send')}}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                    <p v-else>
                        {{ trainer.details.firstname }} {{ trainer.details.lastname }} {{$t('is not available for appointment')}}
                    </p>
                </div>
            </div>
            <div class="card" v-if="activeModule === 'trainerPrograms'">
                <div class="card-header">
                    <span>{{$t('Programs Trainer Offers')}}</span>
                </div>
                <div class="card-block">
                    <div class="table-responsive">
                        <table class="table table-hover">
                            <thead>
                            <tr>
                                <th>{{$t('Title')}}</th>
                                <th>{{$t('Description')}}</th>
                                <th>{{$t('Duration')}}</th>
                                <th>{{$t('Price')}}</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="program in trainer.programs" :key="program.id">
                                <td>{{program.title}}</td>
                                <td>{{program.description}}</td>
                                <td>{{program.duration}}</td>
                                <td>CHF {{program.price}}</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <trainer-profile-calendar :trainerId="trainer.details.userId" v-if="activeModule === 'todayAppointments'"></trainer-profile-calendar>
        </div>
    </div>
</template>
<script>
    import axios from "axios";
    import config from "../../../config.js";
    import {mapState} from "vuex";
    import Datepicker from "vuejs-datepicker";
    import TrainerProfileCalendar from './TrainerProfileCalendar.vue'

    export default {
        components: {
            datepicker: Datepicker,
            'trainer-profile-calendar': TrainerProfileCalendar
        },
        data() {
            return {
                activeModule:'about',
                disabled:{
                    to: ''
                },
                storage: config.hostname + "/storage/",
                appointmentDate: null,
                appointmentEndDate: null,
                appointmentReason: null,
                appointmentFurtherInfo: null,
                showEndDate:false,
                appointmentEndDateDisplay:'',
                buttonSpin: false,
                trainerId: "",
                agreeLegalTerms: false,
                trainer: {
                    details: "",
                    rewards: "",
                    certificates: "",
                    programs: ""
                },
                programs: {
                    showTrainerProgramsList: 0,
                    trainerProgramsList: '',
                    minProgramPrice:null,
                    maxProgramPrice:null,
                    count:0
                },
                trainerProgram:'',
                currentProgram:{}
            };
        },
        mounted(){
            let vm = this;
            setTimeout(function(){
                $(".timepicker").each(function() {
                    $(this).timepicker({
                        maxHours:24,
                        showMeridian:false
                    });
                });
                $("#startTimepickerEdit").on("focus", function() {
                    $(this).timepicker({
                        maxHours:24,
                        showMeridian:false
                    });
                });

                //start time picker on change
                $('#startTimepicker').on('change',function(){
                    if (startTimepicker.value != "") {
                        let startHours = parseInt(startTimepicker.value.split(":")[0]);
                        let startMinutes = startTimepicker.value.split(":")[1];

                        let start = new Date(vm.appointmentDate);
                        start.setHours(startHours);
                        start.setMinutes(startMinutes);
                        vm.appointmentDate = start;
                    }
                });

                // program on change
                if(document.getElementById('trainerProgramsList') != null){
                    document.getElementById('trainerProgramsList')
                        .addEventListener('change',function(){
                            if (this.value.trim() != '') {
                                vm.setCurrentProgram(this.value);
                                vm.showEndDate = true;
                            }
                        })
                }
            },1500);
        },
        created() {
            this.getTrainerId();
            this.getTrainer();
            this.disabledDatePicker();
        },
        computed: {
            ...mapState({
                userStore: state => state.user
            })
        },
        methods: {
            setActiveModule(module){
                this.activeModule = module;
            },
            disabledDatePicker(){
                let date = new Date();
                date.setDate(date.getDate() - 1);
                this.disabled.to = date;
            },
            setCurrentProgram(programId){
                this.programs.trainerProgramsList.map(p => {
                    if(p.id == programId){
                        this.currentProgram = p;
                        return;
                    }
                });
                let time = this.currentProgram.duration.split(':');
                let date = new Date(this.appointmentDate);
                date.setHours(date.getHours() + parseInt(time[0]));
                date.setMinutes(date.getMinutes() + parseInt(time[1]));
                this.appointmentEndDate = date;
                let hh = date.getHours() < 10 ? '0'+date.getHours() : date.getHours();
                let mm = date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes();
                this.appointmentEndDateDisplay = date.toDateString()
                    + ' ' + hh + ':' + mm
            },
            loadPrograms() {
                this.programs.showTrainerProgramsList = -1;
                let vm = this;
                axios.get(config.api_hostname + '/getProgramsByTrainerId/' + vm.trainer.details.userId).then(response => {
                    vm.programs.trainerProgramsList = response.data.data;
                    vm.programs.showTrainerProgramsList = 1;
                });
            },
            sendAppointmentRequest() {
                let vm = this;
                this.$validator.validateAll().then(result => {
                    if (result) {

                        if (startTimepicker.value != "") {
                            let startHours = parseInt(startTimepicker.value.split(":")[0]) + 1;
                            let startMinutes = startTimepicker.value.split(":")[1];

                            let start = new Date(vm.appointmentDate);
                            start.setHours(startHours);
                            start.setMinutes(startMinutes);
                            vm.appointmentDate = start;
                        }

                        this.buttonSpin = true;
                        axios
                            .post(config.api_hostname + "/appointmentRequest", {
                                userCustomerId: this.userStore.info.id,
                                userTrainerId: vm.trainerId,
                                description: vm.appointmentReason,
                                furtherInfo: vm.appointmentFurtherInfo,
                                appointmentDate: vm.appointmentDate,
                                appointmentEndDate: vm.appointmentEndDate,
                                createdBy: this.userStore.info.id,
                                confirmedByTrainer: false,
                                paymentStatus: false,
                                medicalHealthId: 1,
                                for: "customer",
                                agreeLegalTerms: vm.agreeLegalTerms,
                                programId:vm.currentProgram.id
                            })
                            .then(response => {
                                if (response.data.agreeLegalTerms == false) {
                                    this.$swal({
                                        title: this.$t('Trainer Legal Terms !'),
                                        text: response.data.legalTerms,
                                        confirmButtonText: this.$t('I Agree'),
                                        cancelButtonText: this.$t('Cancel'),
                                        showCancelButton: true,
                                        showCloseButton: true,
                                        target: $("#rtl-container")[0]
                                    }).then(
                                        result => {
                                            this.agreeLegalTerms = result;
                                            this.sendAppointmentRequest();
                                        },
                                        dismiss => {
                                            vm.buttonSpin = false;
                                        }
                                    );
                                } else {
                                    this.$notify({
                                        group: "foo",
                                        title: this.$t('Message'),
                                        text: this.$t('Appointment Request sent!')
                                    });
                                    vm.appointmentDate = null;
                                    vm.appointmentEndDate = null;
                                    vm.appointmentEndDateDisplay = null;
                                    startTimepicker.value = '';
                                    vm.appointmentReason = null;
                                    vm.appointmentFurtherInfo = null;
                                    vm.buttonSpin = false;
                                    vm.showEndDate = false;
                                    $(".text-danger").css("visibility", "hidden");
                                }
                            });
                    }
                });
            },
            getTrainer() {
                let vm = this;
                axios
                    .post(config.api_hostname + "/getTrainerById", {id: this.trainerId})
                    .then(response => {
                        vm.trainer.details = response.data.trainer[0];
                        vm.trainer.rewards = response.data.rewards;
                        vm.trainer.certificates = response.data.certificates;
                        vm.trainer.programs = response.data.programs;
                        vm.programs.minProgramPrice = response.data.prices.min;
                        vm.programs.maxProgramPrice = response.data.prices.max;
                        vm.programs.count = response.data.prices.count;

                        vm.loadPrograms();
                    });
            },
            getTrainerId() {
                let path = document.location.href;
                this.trainerId = path.substr(path.lastIndexOf("/") + 1);
            }
        }
    };
</script>
<style lang="scss">
    @media screen and (max-width:450px){
        .mob,.mob-profile-picture{
            display:block !important;
        }
        .desk{
            display:none !important;
        }
    }
    .mob-profile-picture{
        display:none;
    }
    .mob{
        display:none;
        text-align:center;
    }
    .desk{
        display:block;
    }
    .trainer-info {
        .card-header {
            text-align: center;
            .card-title {
                margin-top: 15px;
            }
        }
    }

    .card {
        .card-header {
            img {
                background: white;
                width: 40%;
                border-radius: 100%;
                border: 1px solid #ccc;
            }
            p {
                font-size: 14px;
                margin: 2px;
            }
        }
        margin-bottom: 20px;
        .card-block {
            padding: 15px;
            #trainerRewards,
            #trainerCertificates {
                .trainer-reward,
                .trainer-certificate {
                    margin: 5px;
                    color: #2b2b2b;
                    font-size: 15px;
                    .fa {
                        font-size: 15px;
                        margin-right: 5px;
                    }
                    a {
                        color: #367ac3;
                    }
                }
            }
        }
    }

    .profile-left {
        width: 100%;
    }

    .vdp-datepicker {
        input {
            display: block;
            width: 100%;
            padding: 0.5rem 0.75rem;
            font-size: 1rem;
            line-height: 1.25;
            color: #495057;
            background-color: #fff;
            background-image: none;
            background-clip: padding-box;
            border: 1px solid rgba(0, 0, 0, 0.15);
            border-radius: 0.25rem;
            transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s;
        }
    }

    #appointment {
        textarea {
            height: 100px;
            min-height: 100px;
            max-height: 200px;
        }
        .text-danger {
            font-size: 14px;
        }
    }

    .card-header-profile-picture {
        width: 115px;
        height: 115px;
    }
</style>