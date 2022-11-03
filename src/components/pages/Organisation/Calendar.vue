<template>
    <div>
        <h1 class="page-title">{{ orgName }} - <i>{{$t('Calendar')}}</i></h1>
        <div class="row" v-if="orgRole === 'client'">
            <div class="col-10 col-sm-6 col-md-4">
                <select id="calendarFilter" class="form-control" v-model="filterCalendarByProgram.current">
                    <option value="">{{$t('Filter by programs')}}</option>
                    <option v-for="program in filterCalendarByProgram.list" :value="program.id">{{program.title}}</option>
                </select>
            </div>
            <div class="col-2"><i v-if="filterCalendarByProgram.spinner" class="filter-spinner fa fa-spinner fa-spin"></i></div>
        </div>
        <div class="row" v-else>
            <div class="col-10 col-sm-6 col-md-4">
                <select id="calendarFilterByTrainer" class="form-control" v-model="filterCalendarByTrainer.current">
                    <option value="">{{$t('Filter by trainers')}}</option>
                    <option v-for="trainer in filterCalendarByTrainer.list" :value="trainer.id">{{trainer.firstname}} {{trainer.lastname}}</option>
                </select>
            </div>
            <div class="col-2"><i v-if="filterCalendarByTrainer.spinner" class="filter-spinner fa fa-spinner fa-spin"></i></div>
        </div>
        <button v-if="!settings.allInOneCalendar && typeof trainerEvents !== 'string' && 1 > 2" class="btn primary-bg"
                @click="toggleCalendars">{{$t('All in one Calendar')}}
        </button>
        <button v-if="settings.allInOneCalendar && typeof trainerEvents !== 'string'"
                class="btn primary-bg trainer-calendars-btn" @click="toggleCalendars">{{$t('Show Trainer Calendars')}}
        </button>
        <div v-if="settings.allInOneCalendar">
            <div class="card">
                <div class="calendar-item card-block">
                    <full-calendar @dayClick="dayClick" @eventClick="eventClick" v-if="fcEvents != null"
                                   :events="fcEvents"
                                   locale="en"></full-calendar>
                </div>
            </div>
        </div>
        <div v-else class="row">
            <div class="col-12 text-center" v-if="typeof trainerEvents === 'string'">
                <h1 class="fa fa-spinner fa-spin"></h1>
            </div>
            <div v-else v-for="trainerEvent in trainerEvents" class="calendar-item col-md-12 col-lg-6">
                <div class="card">
                    <div class="card-block">
                        <h4>{{trainerEvent[0].firstname}} {{trainerEvent[0].lastname}}</h4>
                        <span class="fc-tid">{{trainerEvent[0].trainerId}}</span>
                        <full-calendar @day-click="dayClick" @event-selected="eventClick" :events="trainerEvent"
                                       :config="{'locale':locale,
                            'defaultView':'agendaDay',
                            'minTime':trainerEvent[0].trainerAvailableFrom.split(' ')[0] + ':00',
                            'maxTime':(parseInt(trainerEvent[0].trainerAvailableTo.split(' ')[0])+1) + ':00',
                        }">
                        </full-calendar>
                    </div>
                </div>
            </div>
        </div>

        <!-- Edit Appointment -->
        <div id="appointment" class="modal fade" role="dialog">
            <div class="modal-dialog">

                <!-- Modal content-->
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal">&times;</button>
                        <h4 class="modal-title">{{$t('Appointment Details')}}</h4>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-12" v-if="!showAppointmentPayment">
                                <div class="form-group"
                                     v-if="appointment.status == 0 && userStore.info.id == appointment.trainerId">
                                    <p>
                                        <label>{{$t('This appointment is not confirmed')}}</label>
                                    </p>
                                    <button @click="confirmAppointment" class="btn primary-bg">
                                        <i class="fa fa-spinner fa-spin" v-if="spinners.showConfirmSpinner"></i>
                                        <i class="fa fa-check" v-else></i>
                                    </button>
                                    <button @click="rejectAppointment" class="btn btn-danger">
                                        <i class="fa fa-spinner fa-spin" v-if="spinners.showRejectSpinner"></i>
                                        <i class="fa fa-remove" v-else></i>
                                    </button>
                                </div>
                                <div class="form-group">
                                    <table class="table table-sm table-striped">
                                        <tr>
                                            <th>{{$t('Description')}}</th>
                                            <td>{{appointment.description}}</td>
                                        </tr>
                                        <tr v-if="appointment.additional != null">
                                            <th>{{$t('Additional info')}}</th>
                                            <td>{{appointment.additional}}</td>
                                        </tr>
                                        <tr>
                                            <th>{{$t('Trainer')}}</th>
                                            <td>{{appointment.trainer}}</td>
                                        </tr>
                                        <tr>
                                            <th>{{$t('Start date')}}</th>
                                            <td>{{appointment.startDate}}</td>
                                        </tr>
                                        <tr>
                                            <th>{{$t('End date')}}</th>
                                            <td>{{appointment.endDate}}</td>
                                        </tr>
                                    </table>
                                </div>
                            </div>
                            <div v-else class="col-12">
                                <form @submit.prevent="getToken" id="payForm">
                                    <div class="form-group">
                                        <label>{{ $t('Card number') }}</label>
                                        <input v-validate="'required|credit_card'" name="credit_card" :data-vv-as="$t('Credit Card Number')" class="form-control" type="number" v-model="payment.number">
                                        <span v-show="errors.has('credit_card')" class="text-danger">{{ errors.first('credit_card') }}</span>
                                    </div>
                                    <div class="form-group">
                                        <label>{{ $t('CVC') }}</label>
                                        <input name="cvc" v-validate="'required'" data-vv-as="CVC" class="form-control" type="number" v-model="payment.cvc">
                                        <span v-show="errors.has('cvc')" class="text-danger">{{ errors.first('cvc') }}</span>
                                    </div>
                                    <div class="form-group">
                                        <label>{{ $t('Expiration') }}</label>
                                        <div class="row">
                                            <div class="col-6">
                                                <input name="exp_month" v-validate="'required|min_value:1|max_value:12'" :data-vv-as="$t('Month')" class="form-control" type="number" :placeholder="$t('Month (MM)')"
                                                       min="1" max="12" v-model="payment.expMonth">
                                                <span v-show="errors.has('exp_month')" class="text-danger">{{ errors.first('exp_month') }}</span>
                                            </div>
                                            <div class="col-6">
                                                <input name="exp_year" v-validate="'required|min_value:2018'" :data-vv-as="$t('Year')" class="form-control" type="number" :placeholder="$t('Year (YYYY)')"
                                                       min="2018" v-model="payment.expYear">
                                                <span v-show="errors.has('exp_year')" class="text-danger">{{ errors.first('exp_year') }}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="form-group">
                                        <div class="row">
                                            <div class="col-6">
                                                <span class="total-price">{{ $t('Total') }}:
                                                    <span v-if="appointment.trainerPrice != null">CHF {{ appointment.trainerPrice }}</span>
                                                    <span v-else>CHF {{ appointment.programPrice }}</span>
                                                </span>
                                            </div>
                                            <div class="col-6">
                                                <button class="btn primary-bg btn-block">
                                                    <i v-if="payment.buttonSpin" class="fa fa-spinner fa-spin"></i>
                                                    <span v-else>{{ $t('Pay') }}</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="form-group text-danger" v-if="payment.error">{{ payment.error }}</div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal">{{$t('Close')}}</button>
                    </div>
                </div>
            </div>
        </div>
        <!-- New Appointment-->
        <div id="newCustomerAppointment" class="modal fade" role="dialog">
            <div class="modal-dialog">

                <!-- Modal content-->
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal">&times;</button>
                        <h4 class="modal-title">{{ $t('New appointment') }}</h4>
                    </div>
                    <form @submit.prevent="newAppointmentFunc">
                        <div class="modal-body">
                            <div class="row">
                                <div class="col-12">
                                    <div class="form-group">
                                        <label>{{ $t('Start date') }}</label>
                                        <div class="row">
                                            <div class="col-12">
                                                <input type="text" disabled :value="newAppointment.startAppointmentDate"
                                                       class="form-control disabled">
                                            </div>
                                        </div>
                                        <span v-show="errors.has('AppointmentEndDate')" class="text-danger">{{ errors.first('AppointmentEndDate') }}</span>
                                    </div>
                                    <div class="form-group" v-if="1 > 2">
                                        <label>{{ $t('Appointment is gonna last until ?') }}</label>
                                        <div class="row">
                                            <div class="col-6">
                                                <datepicker :placeholder="$t('Appointment end Date')"
                                                            v-model="newAppointment.endAppointmentDate"></datepicker>
                                            </div>
                                            <div class="col-6">
                                                <input type="text" :placeholder="$t('End Time')" id="endTimepicker"
                                                       class="form-control timepicker">
                                            </div>
                                        </div>
                                        <span v-show="errors.has('AppointmentEndDate')" class="text-danger">{{ errors.first('AppointmentEndDate') }}</span>
                                    </div>
                                    <div v-show="newAppointment.showEndDate" class="form-group">
                                        <label>{{$t('End Date')}}</label>
                                        <input type="text" disabled v-model="newAppointment.endAppointmentDate"
                                               class="form-control">
                                    </div>
                                    <div class="form-group">
                                        <label>{{$t('Program')}}</label>
                                        <select id="trainerProgramsList" v-validate="'required|numeric'"
                                                :data-vv-as="$t('Program')" name="program"
                                                v-model="newAppointment.trainerProgram" class="form-control">
                                            <option value="" selected>{{$t('Choose Program')}}</option>
                                            <option v-for="trainerProgram in newAppointment.programs.trainerProgramsList"
                                                    :value="trainerProgram.id">
                                                {{trainerProgram.title}}
                                            </option>
                                        </select>
                                        <span v-show="errors.has('program')" class="text-danger">{{ errors.first('program') }}</span>
                                    </div>
                                    <div class="form-group">
                                        <label>{{ $t('Reason') }}</label>
                                        <textarea v-validate="'required'" name="Reason"
                                                  :data-vv-as="$t('Appointment Description')" class="form-control"
                                                  v-model="newAppointment.appointmentDescription"></textarea>
                                        <span v-show="errors.has('Reason')" class="text-danger">{{ errors.first('Reason') }}</span>
                                    </div>
                                    <div class="form-group">
                                        <label>{{ $t('Further information (optional)') }}</label>
                                        <textarea id="appointmentAdditional" class="form-control"
                                                  v-model="newAppointment.appointmentAdditional"></textarea>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="submit" class="btn primary-bg"><i class="fa"
                                                                            :class="{'fa-calendar-plus-o':!newAppointment.buttonSpin, 'fa-spin fa-spinner':newAppointment.buttonSpin}"></i>
                                {{ $t('Create') }}
                            </button>
                            <button type="button" class="btn btn-default" data-dismiss="modal">{{ $t('Cancel') }}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import config from '../../../config'
    import Datepicker from 'vuejs-datepicker'
    import axios from 'axios'
    import {mapState} from 'vuex'

    let oid = 0;
    let oname = '';
    let events = [];

    export default {
        name: "calendar",
        components: {
            // 'full-calendar': require('vue-fullcalendar'),
            'datepicker': Datepicker
        },
        mounted() {
            let vm = this;
            setTimeout(function(){
                $('.fc-agendaWeek-button').each(function(){
                    $(this).text(vm.$t('week'));
                });
                $('.fc-today-button').each(function(){
                    $(this).text(vm.$t('today'));
                });
                $('.fc-agendaDay-button').each(function(){
                    $(this).text(vm.$t('day'));
                });
            },2000);
            if (document.getElementById('trainerProgramsList') != null) {
                document.getElementById('trainerProgramsList')
                    .addEventListener('change', function () {
                        if (this.value.trim() != '') {
                            vm.setCurrentProgram(this.value);
                        }
                    })
            }

            setTimeout(function(){

            },2500);
        },
        data() {
            return {
                locale:localStorage.getItem('locale'),
                showAppointmentPayment: false,
                orgId: 0,
                orgName: '',
                orgRole: null,
                fcEvents: [],
                trainerEvents: '',
                appointment: {
                    description: null,
                    additional: null,
                    startDate: null,
                    endDate: null,
                    trainer: null
                },
                timeRanges: [],
                settings: {
                    allInOneCalendar: false,
                },
                organisationTrainerAppointments: '',
                spinners: {
                    showConfirmSpinner: false,
                    showRejectSpinner: false,
                },
                newAppointment: {
                    trainerProgram:'',
                    trainerId: 0,
                    appointmentAdditional: '',
                    appointmentDescription: '',
                    programs: {
                        trainerProgramsList: ''
                    },
                    endAppointmentDate: '',
                    showEndDate: '',
                    startAppointmentDate: '',
                    buttonSpin: false,
                    currentProgram: {},
                    agreeLegalTerms: false
                },
                payment: {
                    number: null,
                    cvc: null,
                    expMonth: null,
                    expYear: null,
                    error: null,
                    token: null,
                    buttonSpin: false
                },
                filterCalendarByProgram:{
                    list:[],
                    current:"",
                    spinner:false
                },
                filterCalendarByTrainer:{
                    list:[],
                    current:"",
                    spinner:false
                }
                
            }
        },
        beforeCreate() {
            if (localStorage.getItem('calendarOrgId') !== null) {
                oid = parseInt(localStorage.getItem('calendarOrgId'));
                oname = localStorage.getItem('calendarOrgName');
                localStorage.removeItem('calendarOrgId');
                localStorage.removeItem('calendarOrgName');
            } else {
                this.$router.push('/organisations/myOrgs');
            }
        },
        created() {
            this.orgId = oid;
            this.orgName = oname;
            this.getOrganisationAppointments();
            this.getOrganisationTrainerAppointments();
            this.getOrganisationTrainersPrograms();
            this.getOrganisationTrainers();
        },
        computed: {
            ...mapState({
                userStore: state => state.user
            })
        },
        methods: {
            getOrganisationTrainers(){
                let vm = this;
                axios.get(`${config.api_hostname}/getOrganisationTrainers/${this.orgId}`)
                    .then(response => {
                        vm.filterCalendarByTrainer.list = response.data.trainers;
                        let calendarFilterByTrainer = document.getElementById('calendarFilterByTrainer');
                        if(calendarFilterByTrainer != null){
                            calendarFilterByTrainer.addEventListener('change',function(){
                                vm.filterCalendarByTrainer.spinner = true;
                                vm.getOrganisationTrainerAppointments(false,this.value);
                            });
                        }
                    });
            },
            getOrganisationTrainersPrograms(){
                let vm = this;
                axios.get(`${config.api_hostname}/getOrganisationTrainersPrograms/${this.orgId}`)
                    .then(response => {
                        vm.filterCalendarByProgram.list = response.data.programs;
                        setTimeout(function(){
                            let calendarFilter = document.getElementById('calendarFilter');
                            if(calendarFilter != null){
                                calendarFilter.addEventListener('change',function(){
                                    vm.filterCalendarByProgram.spinner = true;
                                    vm.getOrganisationTrainerAppointments(this.value);
                                });
                            }
                        },2000);
                    });
            },
            setCurrentProgram(programId) {
                this.newAppointment.programs.trainerProgramsList.map(p => {
                    if (p.id == programId) {
                        this.newAppointment.currentProgram = p;
                        this.appointmentDurationSettings();
                        this.newAppointment.showEndDate = true;
                        return;
                    }
                });
            },
            appointmentDurationSettings() {
                let date = new Date(this.newAppointment.startAppointmentDate);
                let duration = this.newAppointment.currentProgram.duration.split(':');
                let programHours = duration[0] < 10 ? '0' + duration[0] : duration[0];
                let programMinutes = duration[1];
                date.setHours(date.getHours() + parseInt(programHours));
                date.setMinutes(date.getMinutes() + parseInt(programMinutes));
                date = this.dateFix(date);
                this.newAppointment.endAppointmentDate = date;
            },
            confirmAppointment() {
                let vm = this;
                this.spinners.showConfirmSpinner = true;
                axios
                    .post(config.api_hostname + "/confirmAppointment", {
                        appointmentId: vm.appointment.id,
                        domain: config.domain + "calendar",
                        trainerId: vm.appointment.trainerId
                    })
                    .then(response => {
                        this.getOrganisationAppointments();
                        this.getOrganisationTrainerAppointments();
                        vm.appointment.status = 1;
                        vm.spinners.showConfirmSpinner = false;
                    });
            },
            rejectAppointment() {
                let vm = this;
                this.spinners.showRejectSpinner = true;
                axios
                    .post(config.api_hostname + "/rejectAppointment", {
                        appointmentId: vm.appointment.id,
                    })
                    .then(response => {
                        vm.spinners.showRejectSpinner = false;
                        $("#appointment").modal("hide");
                        this.getOrganisationAppointments();
                        this.getOrganisationTrainerAppointments();
                    });
            },
            getTrainerPrograms(id) {
                let vm = this;
                axios.get(config.api_hostname + '/getProgramsByTrainerId/' + id).then(response => {
                    vm.newAppointment.programs.trainerProgramsList = response.data.data;
                });
            },
            dayClick(date, jsEvent, view) {
                let d = new Date();
                d.setDate(d.getDate());
                if(date > d){
                    let trainerId = $(jsEvent.target).closest('.card-block').find('.fc-tid').text();
                    this.newAppointment.trainerId = trainerId;
                    this.getTrainerPrograms(trainerId);
                    let hours = date.hours() < 10 ?
                        '0' + date.hours() : date.hours();
                    let minutes = date.minutes() < 10 ?
                        '0' + date.minutes() : date.minutes();
                    let today = new Date();
                    today.setHours(hours);
                    today.setMinutes(minutes);
                    today = this.dateFix(today);
                    this.newAppointment.startAppointmentDate = today;
                    $('#newCustomerAppointment').modal('show');
                }else{
                    this.$swal(this.$t("Warning") + "!", this.$t("You cannot create appointment in past days"));
                }
            },
            toggleCalendars() {
                this.settings.allInOneCalendar = !this.settings.allInOneCalendar;
            },
            getOrganisationTrainerAppointments(program = false,trainer = false) {
                let vm = this;
                axios.post(config.api_hostname + '/organisationTrainerAppointments',{
                    orgId:this.orgId,
                    programId:program,
                    trainerId:trainer
                })
                    .then(response => {
                        vm.trainerEvents = response.data.events;
                        vm.orgRole = response.data.role;
                        if(vm.orgRole === 'client')
                            vm.filterCalendarByProgram.spinner = false;
                        else
                            vm.filterCalendarByTrainer.spinner = false;

                        for (let t in vm.trainerEvents) {
                            let event = vm.trainerEvents[t];
                            event.map(item => {
                                item.editable = false;
                                item.titleNew = item.title;
                                item.title = item.customerFirstname + ' ' + item.customerLastname;
                                if (item.status == 0) {
                                    item.className = 'gray';
                                } else if (item.paymentStatus == 0) {
                                    item.className = 'red';
                                }
                                if (item.customerId != vm.userStore.info.id && vm.userStore.role == 'customer' && vm.orgRole == 'client') {
                                    item.title = 'Not Available';
                                }
                            });
                        }
                        setTimeout(() => {
                            // this.addButtons();
                        }, 1000);
                    });
            },
            getOrganisationAppointments() {
                let vm = this;
                // get the appointments
                axios.post(config.api_hostname + '/organisationAppointments', {orgId: this.orgId})
                    .then(response => {
                        this.fcEvents = response.data.data;
                        vm.fcEvents.map(event => {
                            if (event.paymentStatus != 1 && event.status == 1) {
                                event.cssClass = "red";
                            }
                        });
                    });
            },
            dateFix(date, utc = false) {
                let start = new Date(date);
                let startHours;
                if (utc == true) {
                    startHours = (start.getHours() - 1) < 10 ? '0' + start.getHours() - 1 : start.getHours() - 1;
                } else {
                    startHours = start.getHours() < 10 ? '0' + start.getHours() : start.getHours();
                }
                let startMinutes = start.getMinutes() < 10 ? '0' + start.getMinutes() : start.getMinutes();
                let startTime = startHours + ":" + startMinutes;
                return start.toDateString() + ' ' + startTime;
            },
            addButtons() {
                $('.fc-event-container').find('.gray').each(function () {
                    if ($(this).find('.event-buttons').length == 0) {
                        $(this).find('.fc-content').append('<div class="event-buttons"><i class="fa fa-check green acceptAppointment"></i><i class="fa fa-remove rejectAppointment"></i></div>');
                    }
                });
            },
            eventClick(event, jsEvent, pos) {
                if (this.orgRole !== 'client' || event.customerId === this.userStore.info.id || this.orgRole === 'owner') {
                    this.appointment.id = event.appointmentId;
                    this.appointment.description = event.titleNew;
                    this.appointment.additional = event.furtherInfo;
                    this.appointment.startDate = this.dateFix(event.start, true);
                    this.appointment.endDate = this.dateFix(event.end, true);
                    this.appointment.trainer = event.firstname + ' ' + event.lastname;
                    this.appointment.trainerId = event.trainerId;
                    this.appointment.paymentStatus = event.paymentStatus;
                    this.appointment.status = event.status;
                    this.appointment.createdBy = event.createdBy;
                    this.appointment.programPrice = event.programPrice;
                    this.appointment.client = event.customerFirstname + ' ' + event.customerLastname;
                    $('#appointment').modal('show');
                }
                if (event.customerId === this.userStore.info.id && event.status === 1 && event.paymentStatus === 0) {
                    this.showAppointmentPayment = true;
                }
            },
            newAppointmentFunc() {
                this.$validator.validateAll().then(result => {
                    if (result) {
                        this.newAppointment.buttonSpin = true;
                        this.createAppointment();
                    }
                });
            },
            createAppointment() {
                let vm = this;
                axios
                    .post(config.api_hostname + "/appointmentRequest", {
                        from: "orgCalendar",
                        for: "customer",
                        userCustomerId: this.userStore.info.id,
                        userTrainerId: vm.newAppointment.trainerId,
                        programId: vm.newAppointment.currentProgram.id,
                        description: vm.newAppointment.appointmentDescription,
                        furtherInfo: vm.newAppointment.appointmentAdditional,
                        appointmentDate: vm.newAppointment.startAppointmentDate,
                        appointmentEndDate: vm.newAppointment.endAppointmentDate,
                        confirmedByTrainer: false,
                        paymentStatus: false,
                        medicalHealthId: 1,
                        agreeLegalTerms: vm.newAppointment.agreeLegalTerms,
                        createdBy: "customer"
                    })
                    .then(response => {
                        if (response.data.agreeLegalTerms == false) {
                            this.$swal({
                                title: this.$t("Trainer Legal Terms !"),
                                text: response.data.legalTerms,
                                confirmButtonText: this.$t("I agree"),
                                cancelButtonText: this.$t("Cancel"),
                                showCancelButton: true,
                                showCloseButton: true,
                                target: $("#rtl-container")[0]
                            }).then(
                                result => {
                                    this.newAppointment.agreeLegalTerms = result;
                                    this.createAppointment();
                                },
                                dismiss => {
                                    $("#newCustomerAppointment").modal("hide");
                                    this.newAppointment.buttonSpin = false;
                                }
                            );
                        } else {
                            this.getOrganisationTrainerAppointments(vm.filterCalendarByProgram.current);
                            // this.fcEvents = response.data.data;
                            // vm.fcEvents.map(event => {
                            //     if (event.paymentStatus != 1 && event.status == 1) {
                            //         event.cssClass = "red";
                            //     }
                            // });
                            $("#newCustomerAppointment").modal("hide");
                            vm.newAppointment.buttonSpin = false;
                            this.$notify({
                                group: "foo",
                                title: this.$t('Message'),
                                text: this.$t("Appointment created")
                            });
                            // $('.text-danger').css('visibility','hidden');
                        }
                    });
            },
            getToken() {
                let form = $('#payForm');
                let input = form.find('input').first();
                if(input.val() === ''){
                    this.$validator.validateAll();
                    return;
                }
                let check = true;
                form.find('span.text-danger').each(function(){
                    if($(this).text() !== ""){
                        check = false;
                        return;
                    }
                });
                if(check === false){
                    return;
                }
                let vm = this;
                this.payment.buttonSpin = true;
                // this.plan.payButtonSpin = true;
                Stripe.setPublishableKey(config.stripe.publicKey);
                Stripe.card.createToken(
                    {
                        number: this.payment.number,
                        cvc: this.payment.cvc,
                        exp_month: this.payment.expMonth,
                        exp_year: this.payment.expYear
                    },
                    function (status, response) {
                        // if we have errors log the error from response.error.message
                        if (response.error) {
                            vm.payment.error = response.error.message;
                            vm.payment.buttonSpin = false;
                            return;
                        } else {
                            // else response.id is the token
                            vm.payment.error = null;
                            vm.payment.token = response.id;
                            vm.payAppointment();
                        }
                        // append the token to the ajax request to server
                    }
                );
            },
            payAppointment() {
                let vm = this;
                let totalPrice =
                    vm.appointment.trainerPrice != null
                        ? vm.appointment.trainerPrice
                        : vm.appointment.programPrice;
                axios
                    .post(config.api_hostname + "/payAppointment", {
                        appointmentId: vm.appointment.id,
                        trainerId: vm.appointment.trainerId,
                        trainerPerHour: vm.appointment.trainerPerHour,
                        customerId: vm.userStore.info.id,
                        start: vm.appointment.startDate,
                        end: vm.appointment.endDate,
                        totalPrice: totalPrice,
                        token: vm.payment.token
                    })
                    .then(response => {
                        vm.buttonSpin = false;
                        vm.payment.buttonSpin = false;
                        $("#editCustomerAppointment").modal("hide");
                        this.$notify({
                            group: "foo",
                            title: this.$t('Message'),
                            text: this.$t("The appointment was payed")
                        });
                        vm.getOrganisationTrainerAppointments();
                        $('#appointment').modal('hide');
                    });
            }
        }
    }
</script>

<style lang="scss">
    .blue {
        background: #c7e6fd !important;
    }

    .red {
        background: #ff557c !important;
        &:before {
            content: "***";
            color: transparent;
            width: 20px !important;
            height: 20px !important;
            background-image: url("../../../assets/img/payment.png");
            background-size: 100% 100%;
        }
    }

    .gray {
        background: #929292 !important;
        &:before {
            content: "***";
            color: transparent;
            width: 20px !important;
            height: 20px !important;
            background-image: url("../../../assets/img/unlock.png");
            background-size: 100% 100%;
        }
    }

    .fc-scroller, .fc-day-grid-container, .fc-time-grid-container {
        min-height: 400px !important;
    }

    .fc-resizer, .fc-end-resizer {
        display: none !important;
    }

    .trainer-calendars-btn {
        margin-bottom: 10px;
    }

    .calendar-item {
        padding: 10px 15px 50px 15px;
    }

    .fc-time {
        /*display:none;*/

    }

    .fc-content {
        position: relative;
        .event-buttons {
            position: absolute;
            max-width: 100%;
            right: 0;
            top: 0;
            background: rgba(255, 255,
                    255, .50);
            display: inline-block;
            float: right;
            i {
                margin: 0 4px;
                font-size: 16px;
            }
        }
    }

    .fc-agenda-view .fc-day-grid, .fc-tid, .fc-month-button{
        display: none;
    }
    .fc-agendaWeek-button{
        border-top-left-radius: 4px;
        border-bottom-left-radius: 4px;
    }
    .filter-spinner{
        font-size: 25px;
        margin-top: 6px;
    }
    .card-block{
        padding:15px;
    }
</style>