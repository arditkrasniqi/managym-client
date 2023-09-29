<template>
    <div>
        <div class="card">
            <div class="card-block">
                <full-calendar @dayClick="dayClick" @eventClick="eventClick" v-if="fcEvents != null" :events="fcEvents"
                    :locale="lang" :weekNames="weeks" :monthNames="months">
                </full-calendar>
                <!--<full-calendar :firstDay="0" @moreClick="moreClick" @event-created="dayClick" @event-selected="eventClick" v-if="fcEvents != null" :events="fcEvents">-->
                <!--</full-calendar>-->
                <!--<full-calendar :events="fcEvents">-->
                <!--</full-calendar>-->
            </div>
        </div>

        <!-- Edit Appointment -->
        <div id="editCustomerAppointment" class="modal fade" role="dialog">
            <div class="modal-dialog">

                <!-- Modal content-->
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal">&times;</button>
                        <h4 class="modal-title">
                            <span
                                v-if="currentAppointment.status == 1 && currentAppointment.paymentStatus == 0">{{ $t('Payment is pending') }}</span>
                            <span v-else>{{ $t('Edit Appointment') }}</span>
                        </h4>
                    </div>
                    <form
                        v-if="currentAppointment.status == 0 && currentAppointment.paymentStatus == 0 || currentAppointment.status == 1 && currentAppointment.paymentStatus == 1"
                        @submit.prevent="editAppointment">
                        <div class="modal-body">
                            <div v-if="!showEditAppointment" class="row">
                                <div class="col-12">
                                    <div class="form-group">
                                        <div v-if="currentAppointment.status != 1" class="form-group">
                                            {{ $t('This appointment is not confirmed by Trainer') }}
                                        </div>
                                        <div class="table-responsive">
                                            <table class="table table-sm table-striped">
                                                <tr>
                                                    <th>{{ $t('Description') }}</th>
                                                    <td>{{ appointmentDescription }}</td>
                                                </tr>
                                                <tr v-if="appointmentAdditional != null">
                                                    <th>{{ $t('Additional info') }}</th>
                                                    <td>{{ appointmentAdditional }}</td>
                                                </tr>
                                                <tr>
                                                    <th>{{ $t('Start date') }}</th>
                                                    <td>{{ startAppointmentDate }}</td>
                                                </tr>
                                                <tr>
                                                    <th>{{ $t('End date') }}</th>
                                                    <td>{{ endAppointmentDate }}</td>
                                                </tr>
                                                <tr>
                                                    <th>{{ $t('Trainer') }}</th>
                                                    <td>{{ currentAppointment.trainer }}</td>
                                                </tr>
                                                <tr>
                                                    <th>{{ $t('Payment status') }}</th>
                                                    <td>
                                                        <span
                                                            v-if="currentAppointment.paymentStatus == 1">{{ $t('Paid') }}</span>
                                                        <span v-else class="text-danger">{{ $t('Pending') }}</span>
                                                    </td>
                                                </tr>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div v-if="showEditAppointment" class="row">
                                <div class="col-12">
                                    <div class="form-group">
                                        <label>{{ $t('Start date') }}?</label>
                                        <div class="row">
                                            <div class="col-6">
                                                <input type="text" disabled :value="startAppointmentDate"
                                                    class="form-control disabled">
                                            </div>
                                            <div class="col-6">
                                                <input type="text" :placeholder="$t('Start time')"
                                                    id="startTimepickerEdit" class="form-control timepicker">
                                            </div>
                                        </div>
                                        <span v-show="errors.has('AppointmentEndDate')"
                                            class="text-danger">{{ errors.first('AppointmentEndDate') }}</span>
                                    </div>
                                    <div class="form-group">
                                        <label>{{ $t('Appointment is gonna last until') }}?</label>
                                        <!--<input type="text" name="beforeLimit" :value="startAppointmentDate">-->
                                        <!--<input type="text" name="afterLimit" :value="appointmentMaxEndDate">-->
                                        <!--<input type="text" v-validate="'required||date_between:{12-12-2016,12-12-2018}|date_format:DD-MM-YYYY'" name="AppointmentEndDate"  v-model="endAppointmentDate">-->
                                        <div class="row">
                                            <div class="col-6">
                                                <datepicker :placeholder="$t('End date')" v-model="endAppointmentDate">
                                                </datepicker>
                                            </div>
                                            <div class="col-6">
                                                <input type="text" :placeholder="$t('End time')" id="endTimepickerEdit"
                                                    class="form-control timepicker">
                                            </div>
                                        </div>
                                        <span v-show="errors.has('AppointmentEndDate')"
                                            class="text-danger">{{ errors.first('AppointmentEndDate') }}</span>
                                    </div>
                                    <div class="form-group">
                                        <label>{{ $t('Description') }}</label>
                                        <textarea v-validate="'required'" name="Reason"
                                            data-vv-as="Appointment Description" class="form-control"
                                            v-model="appointmentDescription"></textarea>
                                        <span v-show="errors.has('Reason')"
                                            class="text-danger">{{ errors.first('Reason') }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button v-if="showEditAppointment" type="submit" class="btn primary-bg"><i class="fa"
                                    :class="{ 'fa-calendar-plus-o': !buttonSpin, 'fa-spin fa-spinner': buttonSpin }"></i>
                                {{ $t('Save') }}
                            </button>
                            <!-- <a v-if="!showEditAppointment && currentAppointment.status != 1 && currentAppointment.paymentStatus != 1"
                               @click="showEdit" class="btn primary-bg"><i class="fa fa-edit"></i> {{ $t('Edit') }}</a> -->
                            <button type="button" @click="hideEdit" class="btn btn-default" data-dismiss="modal">{{
                                    $t('Cancel')
                            }}
                            </button>
                        </div>
                    </form>
                    <div class="col-12" v-else>
                        <form @submit.prevent="getToken" id="payForm">
                            <div class="form-group">
                                <label>{{ $t('Card number') }}</label>
                                <input v-validate="'required|credit_card'" name="credit_card"
                                    :data-vv-as="$t('Credit Card Number')" class="form-control" type="number"
                                    v-model="payment.number">
                                <span v-show="errors.has('credit_card')"
                                    class="text-danger">{{ errors.first('credit_card') }}</span>
                            </div>
                            <div class="form-group">
                                <label>{{ $t('CVC') }}</label>
                                <input name="cvc" v-validate="'required'" data-vv-as="CVC" class="form-control"
                                    type="number" v-model="payment.cvc">
                                <span v-show="errors.has('cvc')" class="text-danger">{{ errors.first('cvc') }}</span>
                            </div>
                            <div class="form-group">
                                <label>{{ $t('Expiration') }}</label>
                                <div class="row">
                                    <div class="col-6">
                                        <input name="exp_month" v-validate="'required|min_value:1|max_value:12'"
                                            :data-vv-as="$t('Month')" class="form-control" type="number"
                                            :placeholder="$t('Month (MM)')" min="1" max="12" v-model="payment.expMonth">
                                        <span v-show="errors.has('exp_month')"
                                            class="text-danger">{{ errors.first('exp_month') }}</span>
                                    </div>
                                    <div class="col-6">
                                        <input name="exp_year" v-validate="'required|min_value:2018'"
                                            :data-vv-as="$t('Year')" class="form-control" type="number"
                                            :placeholder="$t('Year (YYYY)')" min="2018" v-model="payment.expYear">
                                        <span v-show="errors.has('exp_year')"
                                            class="text-danger">{{ errors.first('exp_year') }}</span>
                                    </div>
                                </div>
                            </div>

                            <div class="form-group">
                                <div class="row">
                                    <div class="col-6"><span class="total-price">{{ $t('Total') }}:
                                            <span v-if="currentAppointment.trainerPrice != null">{{ currency }}
                                                {{ currentAppointment.trainerPrice }}</span>
                                            <span v-else>{{ currency }} {{ currentAppointment.programPrice }}</span>
                                        </span></div>
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
                    <form @submit.prevent="newAppointment" id="newAppointmentForm">
                        <div class="modal-body">
                            <div class="row">
                                <div class="col-12">
                                    <div class="form-group">
                                        <label>{{ $t('Start date') }}</label>
                                        <div class="row">
                                            <div class="col-6">
                                                <input type="text" disabled :value="startAppointmentDate"
                                                    class="form-control disabled">
                                            </div>
                                            <div class="col-6">
                                                <input type="text" :placeholder="$t('Start time')" id="startTimepicker"
                                                    class="form-control timepicker">
                                            </div>
                                        </div>
                                        <span v-show="errors.has('AppointmentEndDate')"
                                            class="text-danger">{{ errors.first('AppointmentEndDate') }}</span>
                                    </div>
                                    <div class="form-group" v-if="1 > 2">
                                        <label>{{ $t('Appointment is gonna last until') }}</label>
                                        <div class="row">
                                            <div class="col-6">
                                                <datepicker placeholder="Appointment end Date"
                                                    v-model="endAppointmentDate"></datepicker>
                                            </div>
                                            <div class="col-6">
                                                <input type="text" placeholder="End Time" id="endTimepicker"
                                                    class="form-control timepicker">
                                            </div>
                                        </div>
                                        <span v-show="errors.has('AppointmentEndDate')"
                                            class="text-danger">{{ errors.first('AppointmentEndDate') }}</span>
                                    </div>
                                    <div v-show="showEndDate" class="form-group">
                                        <label>Ende Datum</label>
                                        <input type="text" disabled v-model="endAppointmentDate" class="form-control">
                                    </div>
                                    <div class="form-group">
                                        <label>Trainer</label>
                                        <select v-validate="'required|numeric'" name="Trainer"
                                            v-model="appointmentTrainer" id="trainerSelect" class="form-control">
                                            <option value="" selected>{{ $t('Choose trainer') }}</option>
                                            <option v-for="trainer in trainers" :value="trainer.id">
                                                {{ trainer.firstname }} {{ trainer.lastname }}
                                            </option>
                                        </select>
                                        <span v-show="errors.has('Trainer')"
                                            class="text-danger">{{ errors.first('Trainer') }}</span>
                                    </div>
                                    <div class="form-group" v-show="programs.showTrainerProgramsList == 1">
                                        <label>Program</label>
                                        <select id="trainerProgramsList" v-validate="'required|numeric'"
                                            data-vv-as="Program" name="program" v-model="trainerProgram"
                                            class="form-control">
                                            <option value="" selected>Choose Program</option>
                                            <option v-for="trainerProgram in programs.trainerProgramsList"
                                                :value="trainerProgram.id">
                                                {{ trainerProgram.title }}
                                            </option>
                                        </select>
                                        <span v-show="errors.has('program')"
                                            class="text-danger">{{ errors.first('program') }}</span>
                                    </div>
                                    <span v-show="programs.showTrainerProgramsList == -1"
                                        class="fa fa-spinner fa-spin"></span>
                                    <div class="form-group">
                                        <label>{{ $t('Reason') }}</label>
                                        <textarea v-validate="'required'" name="Reason"
                                            data-vv-as="Appointment Description" class="form-control"
                                            v-model="appointmentDescription"></textarea>
                                        <span v-show="errors.has('Reason')"
                                            class="text-danger">{{ errors.first('Reason') }}</span>
                                    </div>
                                    <div class="form-group">
                                        <label>{{ $t('Further information (optional)') }}</label>
                                        <textarea id="appointmentAdditional" class="form-control"
                                            v-model="appointmentAdditional"></textarea>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="submit" class="btn primary-bg"><i class="fa"
                                    :class="{ 'fa-calendar-plus-o': !buttonSpin, 'fa-spin fa-spinner': buttonSpin }"></i>
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
import axios from "axios";
import Datepicker from "vuejs-datepicker";
import { mapState } from "vuex";
import vueFullCalendar from 'vue-fullcalendar'

export default {
    name: "customer-calendar",
    data() {
        return {
            lang: 'de',
            weeks: [
                this.$t('Sun'),
                this.$t('Mon'),
                this.$t('Tue'),
                this.$t('Wed'),
                this.$t('Thu'),
                this.$t('Fri'),
                this.$t('Sat')
            ],
            months: [
                this.$t('January'),
                this.$t('February'),
                this.$t('Mars'),
                this.$t('April'),
                this.$t('May'),
                this.$t('June'),
                this.$t('July'),
                this.$t('August'),
                this.$t('September'),
                this.$t('October'),
                this.$t('November'),
                this.$t('December'),
            ],
            showEditAppointment: false,
            appointmentId: 0,
            buttonSpin: false,
            appointmentMaxEndDate: process.env.appointmentMaxEndDate,
            fcEvents: null,
            startAppointmentDate: new Date().toDateString(),
            endAppointmentDate: null,
            showEndDate: false,
            startAppointmentTime: null,
            endAppointmentTime: null,
            appointmentTrainer: "",
            appointmentDescription: null,
            appointmentAdditional: null,
            trainers: null,
            agreeLegalTerms: false,
            trainerProgram: '',
            currentAppointment: {},
            payment: {
                number: null,
                cvc: null,
                expMonth: null,
                expYear: null,
                error: null,
                token: null,
                buttonSpin: false
            },
            programs: {
                showTrainerProgramsList: 0,
                trainerProgramsList: '',
            },
            currentProgram: {}
        };
    },
    created() {
        this.getAppointments();
    },
    mounted() {
        let vm = this;
        let date = new Date();
        date.setHours(0, 0, 0, 0);
        $(".timepicker").each(function () {
            $(this).timepicker({
                maxHours: 24,
                showMeridian: false,
                defaultTime: date
            });
        });
        $("#startTimepickerEdit").on("focus", function () {
            $(this).timepicker({
                maxHours: 24,
                showMeridian: false,
                defaultTime: date
            });
        });

        //start time picker on change
        $('#startTimepicker').on('change', function () {
            if (startTimepicker.value != "") {
                let startHours = parseInt(startTimepicker.value.split(":")[0]);
                let startMinutes = startTimepicker.value.split(":")[1];

                let start = new Date(vm.startAppointmentDate);
                start.setHours(startHours);
                start.setMinutes(startMinutes);
                vm.startAppointmentDate = start.toDateString();
                vm.endAppointmentDate = start;
            }
        });


        // trainer on change
        document.getElementById('trainerSelect')
            .addEventListener('change', function () {
                if (this.value.trim() != '') {
                    vm.loadPrograms(this.value);
                }
            });
        if (document.getElementById('trainerProgramsList') != null) {
            document.getElementById('trainerProgramsList')
                .addEventListener('change', function () {
                    if (this.value.trim() != '') {
                        vm.setCurrentProgram(this.value);
                        vm.showEndDate = true;
                    }
                })
        }
    },
    methods: {
        setCurrentProgram(programId) {
            this.programs.trainerProgramsList.map(p => {
                if (p.id == programId) {
                    this.currentProgram = p;
                    return;
                }
            });
            let time = this.currentProgram.duration.split(':');
            let date = new Date(this.endAppointmentDate);
            date.setHours(date.getHours() + parseInt(time[0]));
            date.setMinutes(date.getMinutes() + parseInt(time[1]));
            this.endAppointmentDate = date;
        },
        loadPrograms(trainerId) {
            this.programs.showTrainerProgramsList = -1;
            let vm = this;
            axios.get(process.env.api_hostname + '/getProgramsByTrainerId/' + trainerId).then(response => {
                vm.programs.trainerProgramsList = response.data.data;
                vm.programs.showTrainerProgramsList = 1;
            });
        },
        getAppointments() {
            let vm = this;
            axios
                .get(process.env.api_hostname + "/customerAppointments")
                .then(response => {
                    vm.fcEvents = response.data.data;
                    vm.fcEvents.map(event => {
                        if (event.paymentStatus != 1 && event.status == 1) {
                            event.cssClass = "red";
                        }
                    });
                });
            axios.get(process.env.api_hostname + "/trainerList").then(response => {
                vm.trainers = response.data.trainers;
            });
        },
        showEdit() {
            this.showEditAppointment = true;
            setTimeout(function () {
                $("#startTimepickerEdit,#endTimepickerEdit").on("focus", function () {
                    $(this).timepicker();
                });
            }, 300);
        },
        hideEdit() {
            this.showEditAppointment = false;
        },
        dayClick(day, jsEvent) {
            let d = new Date();
            d.setDate(d.getDate() - 1);
            if (day > d) {
                $("#newCustomerAppointment").modal("show");
                // let date = new Date(day);
                // date.setDate(date.getDate() + 1);
                this.endAppointmentDate = day.toDateString() + ' ' + day.toLocaleTimeString()
                    .replace(" AM", "").replace(" PM", "");
                this.startAppointmentDate = day.toDateString();
            } else {
                this.$swal(this.$t("Warning") + "!", this.$t("You cannot create appointment in past days"));
            }
        },
        eventClick(event, jsEvent, pos) {
            this.currentAppointment = event;
            this.appointmentId = event.appointmentId;
            this.startAppointmentDate = event.start;
            this.endAppointmentDate = event.end;
            this.appointmentDescription = event.title;
            $("#editCustomerAppointment").modal("show");
        },
        moreClick(date, event, jsEvent) {
            console.log(date, event, jsEvent)
        },
        editAppointment() {
            let vm = this;
            // start time
            if (startTimepickerEdit.value != "") {
                let startHours = parseInt(startTimepickerEdit.value.split(":")[0]) + 1;
                let startMinutes = startTimepickerEdit.value.split(":")[1];

                let start = new Date(vm.startAppointmentDate);
                start.setHours(startHours);
                start.setMinutes(startMinutes);
                vm.startAppointmentDate = start.toDateString();
            }
            if (endTimepickerEdit.value != "") {
                // end time
                let endHours = parseInt(endTimepickerEdit.value.split(":")[0]) + 1;
                let endMinutes = endTimepickerEdit.value.split(":")[1];

                // set time to date
                let end = new Date(vm.endAppointmentDate);
                end.setHours(endHours);
                end.setMinutes(endMinutes);
                vm.endAppointmentDate = end;
            }
            // this.$validator.validateAll().then((result) => {
            //     if (result) {
            this.buttonSpin = true;
            axios
                .post(process.env.api_hostname + "/editAppointment", {
                    from: "calendar",
                    for: "customer",
                    appointmentId: vm.appointmentId,
                    description: vm.appointmentDescription,
                    appointmentDate: vm.startAppointmentDate,
                    appointmentEndDate: vm.endAppointmentDate
                })
                .then(response => {
                    this.fcEvents = response.data.data;
                    vm.fcEvents.map(event => {
                        if (event.paymentStatus != 1 && event.status == 1) {
                            event.cssClass = "red";
                        }
                    });
                    $("#newCustomerAppointment").modal("hide");
                    vm.buttonSpin = false;
                    this.$notify({
                        group: "foo",
                        title: this.$t('Message'),
                        text: this.$t("Appointment updated")
                    });
                    vm.startAppointmentDate = null;
                    vm.endAppointmentDate = null;
                    vm.appointmentDescription = null;
                    $(".text-danger").css("visibility", "hidden");
                    vm.showEditAppointment = false;
                    $("#editCustomerAppointment").modal("hide");
                });
            //     }
            // });
        },
        newAppointment() {
            let vm = this;

            let form = $('#newAppointmentForm');
            let input = form.find('input').first();
            let textarea = form.find('textarea').first();
            let select = form.find('select').first();
            if (input.val() === '' || textarea.val() === '' || select.val() === '') {
                this.$validator.validateAll();
                return;
            }
            let check = true;
            form.find('span.text-danger').each(function () {
                if ($(this).text() !== "") {
                    check = false;
                    return;
                }
            });
            if (check === false) {
                return;
            }
            this.buttonSpin = true;

            // start time
            let startHours = parseInt(startTimepicker.value.split(":")[0]) + 1;
            let startMinutes = startTimepicker.value.split(":")[1];
            // // end time
            // let endHours = parseInt(endTimepicker.value.split(":")[0]) + 1;
            // let endMinutes = endTimepicker.value.split(":")[1];
            //
            // // set time to date
            // let end = new Date(vm.endAppointmentDate);
            // end.setHours(endHours);
            // end.setMinutes(endMinutes);
            // vm.endAppointmentDate = end;

            let start = new Date(vm.startAppointmentDate);
            start.setHours(startHours);
            start.setMinutes(startMinutes);
            vm.startAppointmentDate = start;
            // if(vm.startAppointmentDate != vm.endAppointmentDate){
            //     vm.endAppointmentDate.setDate(vm.endAppointmentDate.getDate() + 1);
            // }
            this.createAppointment();
        },
        createAppointment() {
            let vm = this;
            axios
                .post(process.env.api_hostname + "/appointmentRequest", {
                    from: "calendar",
                    for: "customer",
                    userCustomerId: this.userStore.info.id,
                    userTrainerId: vm.appointmentTrainer,
                    programId: vm.currentProgram.id,
                    description: vm.appointmentDescription,
                    furtherInfo: vm.appointmentAdditional,
                    appointmentDate: vm.startAppointmentDate,
                    appointmentEndDate: vm.endAppointmentDate,
                    confirmedByTrainer: false,
                    paymentStatus: false,
                    medicalHealthId: 1,
                    agreeLegalTerms: vm.agreeLegalTerms,
                    createdBy: "customer"
                })
                .then(response => {
                    if (response.data.agreeLegalTerms == false) {
                        this.$swal({
                            title: this.$t("Trainer Legal Terms"),
                            text: response.data.legalTerms,
                            confirmButtonText: this.$t("I agree"),
                            cancelButtonText: this.$t("Cancel"),
                            showCancelButton: true,
                            showCloseButton: true,
                            target: $("#rtl-container")[0]
                        }).then(
                            result => {
                                this.agreeLegalTerms = result;
                                this.createAppointment();
                            },
                            dismiss => {
                                $("#newCustomerAppointment").modal("hide");
                                this.buttonSpin = false;
                            }
                        );
                    } else {
                        this.fcEvents = response.data.data;
                        vm.fcEvents.map(event => {
                            if (event.paymentStatus != 1 && event.status == 1) {
                                event.cssClass = "red";
                            }
                        });
                        $("#newCustomerAppointment").modal("hide");
                        vm.buttonSpin = false;
                        this.$notify({
                            group: "foo",
                            title: this.$t('Message'),
                            text: this.$t("Appointment created")
                        });
                        vm.startAppointmentDate = null;
                        vm.endAppointmentDate = null;
                        vm.appointmentTrainer = "";
                        vm.appointmentDescription = null;
                        vm.appointmentAdditional = null;
                        // $('.text-danger').css('visibility','hidden');
                    }
                });
        },
        getToken() {
            let form = $('#payForm');
            let input = form.find('input').first();
            if (input.val() === '') {
                this.$validator.validateAll();
                return;
            }
            let check = true;
            form.find('span.text-danger').each(function () {
                if ($(this).text() !== "") {
                    check = false;
                    return;
                }
            });
            if (check === false) {
                return;
            }
            let vm = this;
            this.payment.buttonSpin = true;
            // this.plan.payButtonSpin = true;
            Stripe.setPublishableKey(process.env.stripe.publicKey);
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
                vm.currentAppointment.trainerPrice != null
                    ? vm.currentAppointment.trainerPrice
                    : vm.currentAppointment.programPrice;
            axios
                .post(process.env.api_hostname + "/payAppointment", {
                    appointmentId: vm.appointmentId,
                    trainerId: vm.currentAppointment.trainerId,
                    trainerPerHour: vm.currentAppointment.trainerPerHour,
                    customerId: vm.userStore.info.id,
                    start: vm.startAppointmentDate,
                    end: vm.endAppointmentDate,
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
                    vm.getAppointments();
                });
        }
    },
    computed: {
        ...mapState({
            userStore: state => state.user,
            currency: state => state.currency
        })
    },
    components: {
        // "full-calendar": require("vue-full-calendar").default,
        'full-calendar': vueFullCalendar,
        datepicker: Datepicker
    }
};
</script>

<style lang="scss">
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

textarea.form-control {
    min-height: 100px;
    max-height: 200px;
}

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

.total-price {
    font-size: 24px;
}
</style>
