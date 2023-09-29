<template>
    <div>
        <div v-if="trainerPlan && trainerPlan.calendarAccess">
            <div class="card">
                <div class="card-block">
                    <full-calendar @dayClick="dayClick" @eventClick="eventClick" v-if="fcEvents != null"
                        :events="fcEvents" :locale="lang" :weekNames="weeks" :monthNames="months"></full-calendar>
                </div>
            </div>
        </div>
        <div v-else>
            <div v-if="plan.showPlans">
                <div class="card">
                    <div class="card-header">{{ $t('Trainer Plans') }}</div>
                    <div class="card-body">
                        <div class="table-responsive">
                            <table class="table table-hover">
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th class="text-center">{{ $t('Demo Trainer') }}</th>
                                        <th class="text-center">{{ $t('Home Trainer') }}</th>
                                        <th class="text-center">{{ $t('Expert') }}</th>
                                        <th class="text-center">{{ $t('Enterprise') }}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            {{ $t('Listed in search results') }}
                                        </td>
                                        <td class="text-center">
                                            <i class="fa fa-check"></i>
                                        </td>
                                        <td class="text-center">
                                            <i class="fa fa-check"></i>
                                        </td>
                                        <td class="text-center">
                                            <i class="fa fa-check"></i>
                                        </td>
                                        <td class="text-center">
                                            <i class="fa fa-check"></i>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            {{ $t('Access to calendar') }}
                                        </td>
                                        <td class="text-center">
                                            -
                                        </td>
                                        <td class="text-center">
                                            <i class="fa fa-check"></i>
                                        </td>
                                        <td class="text-center">
                                            <i class="fa fa-check"></i>
                                        </td>
                                        <td class="text-center">
                                            <i class="fa fa-check"></i>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            {{ $t('Access to accounting') }}
                                        </td>
                                        <td class="text-center">
                                            -
                                        </td>
                                        <td class="text-center">
                                            <i class="fa fa-check"></i>
                                        </td>
                                        <td class="text-center">
                                            <i class="fa fa-check"></i>
                                        </td>
                                        <td class="text-center">
                                            <i class="fa fa-check"></i>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            {{ $t('Ability to manage trainers') }}
                                        </td>
                                        <td class="text-center">
                                            -
                                        </td>
                                        <td class="text-center">
                                            -
                                        </td>
                                        <td class="text-center">
                                            <i class="fa fa-check"></i>
                                        </td>
                                        <td class="text-center">
                                            <i class="fa fa-check"></i>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            {{ $t('Ability to manage multiple locations') }}
                                        </td>
                                        <td class="text-center">
                                            -
                                        </td>
                                        <td class="text-center">
                                            -
                                        </td>
                                        <td class="text-center">
                                            -
                                        </td>
                                        <td class="text-center">
                                            <i class="fa fa-check"></i>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            {{ $t('Analytics Tools') }}
                                        </td>
                                        <td class="text-center">
                                            -
                                        </td>
                                        <td class="text-center">
                                            -
                                        </td>
                                        <td class="text-center">
                                            -
                                        </td>
                                        <td class="text-center">
                                            <i class="fa fa-check"></i>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            {{ $t('Provision for ManaGym') }}
                                        </td>
                                        <td class="text-center">
                                            10%
                                        </td>
                                        <td class="text-center">
                                            4%
                                        </td>
                                        <td class="text-center">
                                            4%
                                        </td>
                                        <td class="text-center">
                                            4%
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>{{ $t('Monthly Cost') }}</td>
                                        <td class="text-center" v-for="p in trainerPlans">
                                            <span v-if="p.monthlyPay == null">{{ currency }} 0</span>
                                            <span v-else>{{ currency }} {{ p.monthlyPay }}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>{{ $t('Yearly Cost') }}</td>
                                        <td class="text-center" v-for="p in trainerPlans">
                                            <span v-if="p.yearlyPay == null">{{ currency }} 0</span>
                                            <span v-else>{{ currency }} {{ p.yearlyPay }}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td class="text-center">
                                            {{ $t('Choosen') }}
                                        </td>
                                        <td class="text-center">
                                            <button class="btn btn-sm primary-bg"
                                                @click="goToCard(2)">{{ $t('Choose Plan') }}</button>
                                        </td>
                                        <td class="text-center">
                                            <button class="btn btn-sm primary-bg"
                                                @click="goToCard(3)">{{ $t('Choose Plan') }}</button>
                                        </td>
                                        <td class="text-center">
                                            <button class="btn btn-sm primary-bg"
                                                @click="goToCard(4)">{{ $t('Choose Plan') }}</button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="card-footer">
                        <button @click="backDesc" class="btn btn-default">
                            <i class="fa fa-arrow-left"></i>
                        </button>
                    </div>
                </div>
            </div>
            <div class="row" v-else-if="card.showCard">
                <div class="col-12 col-md-6">
                    <div class="card">
                        <div class="card-header">{{ $t('Plan Payment') }}</div>
                        <div class="card-body" id="payForm">
                            <div class="form-group">
                                <label>{{ $t('Credit Card Number') }}</label>
                                <input v-validate="'required|credit_card'" name="credit_card"
                                    :data-vv-as="$t('Credit Card Number')" type="number" v-model="card.number"
                                    class="form-control">
                                <span v-show="errors.has('credit_card')"
                                    class="text-danger">{{ errors.first('credit_card') }}</span>
                            </div>
                            <div class="form-group">
                                <label>{{ $t('CVC') }}</label>
                                <input name="cvc" data-vv-as="CVC" v-validate="'required'" type="number"
                                    v-model="card.cvc" class="form-control">
                                <span v-show="errors.has('cvc')" class="text-danger">{{ errors.first('cvc') }}</span>
                            </div>
                            <div class="form-group">
                                <label>{{ $t('Expiration Month') }}</label>
                                <input v-validate="'required|min_value:1|max_value:12'" type="number" name="exp_month"
                                    :data-vv-as="$t('Month')" v-model="card.expMonth" class="form-control">
                                <span v-show="errors.has('exp_month')"
                                    class="text-danger">{{ errors.first('exp_month') }}</span>
                            </div>
                            <div class="form-group">
                                <label>{{ $t('Expiration Year') }}</label>
                                <input v-validate="'required|min_value:2018'" name="exp_year" :data-vv-as="$t('Year')"
                                    type="number" v-model="card.expYear" class="form-control">
                                <span v-show="errors.has('exp_year')"
                                    class="text-danger">{{ errors.first('exp_year') }}</span>
                            </div>
                            <div class="row">
                                <div class="col-6">
                                    <h5>{{ $t('Pay monthly') }}</h5>
                                    <div class="row">
                                        <h1 class="pay-price col-12">${{ plan.monthCost }}</h1>
                                    </div>
                                    <button class="pay-btn btn-block btn btn-secondary" @click="getToken('month')"><i
                                            class="fa fa-shopping-cart"></i></button>
                                </div>
                                <div class="col-6">
                                    <h5>{{ $t('Pay yearly') }}</h5>
                                    <div class="row">
                                        <h1 class="pay-price col-12">${{ plan.yearCost }}</h1>
                                    </div>
                                    <button class="pay-btn btn-block btn primary-bg" @click="getToken('year')"><i
                                            class="fa fa-shopping-cart"></i></button>
                                    <p class="discount-note">{{ $t('and gain discounts') }}</p>
                                </div>
                                <div class="col-12 text-center">
                                    <i v-if="plan.payButtonSpin" class="fa fa-spinner fa-spin"></i>
                                </div>
                            </div>
                            <div v-if="card.error != null" class="form-group text-danger">
                                {{ card.error }}
                            </div>
                        </div>
                        <div @click="plansBack" class="card-footer">
                            <button class="btn btn-default"><i class="fa fa-arrow-left"></i></button>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else>
                <h5 class="calendar-no-access">{{ $t('Demo Trainers do not have access to calendar') }}</h5>
                <div class="card bg-faded">
                    <div class="card-block calendar-info">
                        <h1>{{ $t('What is the Calendar') }}?</h1>
                        <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque
                            laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi
                            architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit
                            aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione
                            voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet,
                            consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et
                            dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum
                            exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi
                            consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil
                            molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?.</p>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                            labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
                            laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
                            voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                            cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                        <button @click="showPlans" class="btn primary-bg">{{ $t('Go To Plans') }} <i
                                class="fa fa-arrow-right"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <!-- Edit Appointment -->
        <div id="editCustomerAppointment" class="modal fade" role="dialog">
            <div class="modal-dialog">

                <!-- Modal content-->
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal">&times;</button>
                        <h4 class="modal-title">{{ $t('Edit Appointment') }}</h4>
                    </div>
                    <form @submit.prevent="editAppointment">
                        <div class="modal-body">
                            <div v-if="!showEditAppointment" class="row">
                                <div class="col-12">
                                    <div v-if="appointmentStatus == 0" class="form-group">
                                        <p>{{ $t('This appointment is not confirmed') }}</p>
                                        <a @click="confirmAppointment" class="btn primary-bg btn-sm"><i
                                                v-if="showConfirmSpinner" class="fa fa-spinner fa-spin"></i><span
                                                v-if="!showConfirmSpinner">{{ $t('Confirm') }}</span></a>
                                        <a @click="rejectAppointment" class="btn btn-danger btn-sm"><i
                                                v-if="showRejectSpinner" class="fa fa-spinner fa-spin"></i><span
                                                v-if="!showRejectSpinner">{{ $t('Reject') }}</span></a>
                                    </div>
                                    <hr v-if="appointmentStatus == 0">
                                    <div class="form-group">
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
                                                    <th>{{ $t('Payment Status') }}</th>
                                                    <td>
                                                        <span
                                                            v-if="currentAppointment.paymentStatus == 1">{{ $t('Paid') }}</span>
                                                        <span v-else class="text-danger">{{ $t('Pending') }}</span>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th>{{ $t('Total Price') }}</th>
                                                    <td>
                                                        <span
                                                            v-if="currentAppointment.trainerPrice != null">{{ currency }}
                                                            {{ currentAppointment.trainerPrice }}</span>
                                                        <span v-else>{{ currency }}
                                                            {{ currentAppointment.programPrice }}</span>
                                                    </td>
                                                </tr>
                                            </table>
                                        </div>

                                        <div
                                            v-if="currentAppointment.paymentStatus != 1 && currentAppointment.createdBy == 'trainer'">
                                            <a @click="toggleSetOwnPriceForm" v-if="!setOwnPrice"
                                                class="btn primary-bg">{{ $t('Set your own price') }}</a>
                                            <div v-else>
                                                <div class="form-group">
                                                    <input type="number" v-model="trainerPrice"
                                                        :placeholder="$t('Enter Price')" class="form-control">
                                                </div>
                                                <div class="form-group">
                                                    <a @click="updatePrice" class="btn primary-bg">
                                                        <span v-if="priceSpinner"><span
                                                                class="fa fa-spinner fa-spin"></span></span>
                                                        <span v-else>{{ $t('Update') }}</span>
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div v-if="showEditAppointment" class="row">
                                <div class="col-12">
                                    <div class="form-group">
                                        <label>{{ $t('Reason') }}</label>
                                        <textarea v-validate="'required'" name="Reason"
                                            :data-vv-as="$t('Appointment Description')" class="form-control"
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
                            <a v-if="!showEditAppointment" @click="showEdit" class="btn primary-bg"><i
                                    class="fa fa-edit"></i> {{ $t('Edit') }}</a>
                            <button type="button" @click="hideEdit" class="btn btn-default" data-dismiss="modal">
                                {{ $t('Cancel') }}
                            </button>
                        </div>
                    </form>
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
                        <h4 class="modal-title">{{ $t('New Appointment') }}</h4>
                    </div>
                    <form @submit.prevent="newAppointment">
                        <div class="modal-body">
                            <div class="row">
                                <div class="col-12">
                                    <div class="form-group">
                                        <label>{{ $t('Program') }}</label>
                                        <select id="trainerProgramsList" v-validate="'required|numeric'"
                                            :data-vv-as="$t('Program')" name="program" v-model="trainerProgram"
                                            class="form-control">
                                            <option value="" selected>{{ $t('Choose Program') }}</option>
                                            <option v-for="trainerProgram in programs.trainerProgramsList"
                                                :value="trainerProgram.id">
                                                {{ trainerProgram.title }}
                                            </option>
                                        </select>
                                        <span v-show="errors.has('program')"
                                            class="text-danger">{{ errors.first('program') }}</span>
                                    </div>
                                    <div class="form-group">
                                        <label>{{ $t('Start date ?') }}</label>
                                        <div class="row">
                                            <div class="col-6">
                                                <input type="text" disabled :value="startAppointmentDate"
                                                    class="form-control disabled">
                                            </div>
                                            <div class="col-6">
                                                <input type="text" :placeholder="$t('Start Time')" id="startTimepicker"
                                                    class="form-control timepicker">
                                            </div>
                                        </div>
                                        <span v-show="errors.has('AppointmentEndDate')"
                                            class="text-danger">{{ errors.first('AppointmentEndDate') }}</span>
                                    </div>
                                    <div class="form-group">
                                        <label>{{ $t('Appointment is gonna last until ?') }}</label>
                                        <!--<input type="text" name="beforeLimit" :value="startAppointmentDate">-->
                                        <!--<input type="text" name="afterLimit" :value="appointmentMaxEndDate">-->
                                        <!--<input type="text" v-validate="'required||date_between:{12-12-2016,12-12-2018}|date_format:DD-MM-YYYY'" name="AppointmentEndDate"  v-model="endAppointmentDate">-->
                                        <div class="row">
                                            <div class="col-6">
                                                <datepicker placeholder="Appointment end Date"
                                                    v-model="endAppointmentDate"></datepicker>
                                            </div>
                                            <div class="col-6">
                                                <input type="text" :placeholder="$t('End Time')" id="endTimepicker"
                                                    class="form-control timepicker">
                                            </div>
                                        </div>
                                        <span v-show="errors.has('AppointmentEndDate')"
                                            class="text-danger">{{ errors.first('AppointmentEndDate') }}</span>
                                    </div>
                                    <div class="form-group">
                                        <label>{{ $t('Customer') }}</label>
                                        <select v-validate="'required|numeric'" name="Trainer"
                                            v-model="appointmentCustomer" class="form-control">
                                            <option value="" selected>{{ $t('Choose customer') }}</option>
                                            <option v-for="customer in customers" :value="customer.id">
                                                {{ customer.firstname }} {{ customer.lastname }}
                                            </option>
                                        </select>
                                        <span v-show="errors.has('Trainer')"
                                            class="text-danger">{{ errors.first('Trainer') }}</span>
                                    </div>
                                    <div class="form-group">
                                        <label>{{ $t('Description') }}</label>
                                        <textarea v-validate="'required'" name="Reason"
                                            :data-vv-as="$t('Appointment Description')" class="form-control"
                                            v-model="appointmentDescription"></textarea>
                                        <span v-show="errors.has('Reason')"
                                            class="text-danger">{{ errors.first('Reason') }}</span>
                                    </div>
                                    <div class="form-group">
                                        <label>{{ $t('Further information (Additional)') }}</label>
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
                            <button type="button" class="btn btn-default"
                                data-dismiss="modal">{{ $t('Cancel') }}</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios";
import { mapState } from "vuex";
import Datepicker from "vuejs-datepicker";

export default {
    name: "trainer-calendar",
    beforeCreate() {
        axios.get(process.env.api_hostname + "/getTrainerPlans").then(response => {
            this.$store.dispatch("setTrainerPlans", response.data.data);
        });
    },
    created() {
        let vm = this;
        this.getAppointments();
        axios.get(process.env.api_hostname + "/customersList").then(response => {
            vm.customers = response.data.data;
        });
        this.loadPrograms();
    },
    mounted() {
        let vm = this;
        $(".timepicker").each(function () {
            $(this).timepicker({
                maxHours: 24,
                showMeridian: false
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

        if (document.getElementById('trainerProgramsList') != null) {
            document.getElementById('trainerProgramsList')
                .addEventListener('change', function () {
                    if (this.value.trim() != '') {
                        vm.setCurrentProgram(this.value);
                    }
                })
        }
    },
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
            unconfirmedAppointments: [],
            showEditAppointment: false,
            showConfirmSpinner: false,
            showRejectSpinner: false,
            appointmentId: 0,
            buttonSpin: false,
            appointmentMaxEndDate: process.env.appointmentMaxEndDate,
            fcEvents: null,
            startAppointmentDate: null,
            endAppointmentDate: null,
            appointmentCustomer: "",
            appointmentDescription: null,
            appointmentAdditional: null,
            customers: null,
            appointmentStatus: false,
            currentAppointment: {},
            setOwnPrice: false,
            trainerPrice: null,
            priceSpinner: false,
            plan: {
                showPlans: false,
                monthCost: null,
                yearCost: null,
                planId: 0,
                payButtonSpin: false,
                planText: null
            },
            card: {
                number: null,
                cvc: null,
                expMonth: null,
                expYear: null,
                showCard: false,
                error: null
            },
            programs: {
                showTrainerProgramsList: 0,
                trainerProgramsList: '',
            },
            trainerProgram: '',
            currentProgram: {},
            eventButtons: {
                accept: false,
                reject: false,
            }
        };
    },
    methods: {
        setCurrentProgram(programId) {
            this.programs.trainerProgramsList.map(p => {
                if (p.id == programId) {
                    this.currentProgram = p;
                    this.appointmentDurationSettings();
                    return;
                }
            });
        },
        appointmentDurationSettings() {
            let startPicker = startTimepicker.value;
            let time = this.currentProgram.duration.split(':');
            let date = new Date(this.startAppointmentDate);
            date.setHours(parseInt(startPicker.split(':')[0]) + parseInt(time[0]));
            date.setMinutes(parseInt(startPicker.split(':')[1]) + parseInt(time[1]));
            let startHours = date.getHours() + ":" + date.getMinutes();
            if ((parseInt(startPicker.split(':')[0]) + parseInt(time[0])) > 23) {
                alert(startPicker.split(':')[0] + " : " + date.getHours());
                date.setDate(date.getDate() + 1);
            }
            endTimepicker.value = startHours;
            this.endAppointmentDate = date;
            // let startMinutes = (parseInt(startPicker.split(':')[1]) + date.getMinutes()) < 10 ?
            //     '0'+(parseInt(startPicker.split(':')[1]) + date.getMinutes()) : (parseInt(startPicker.split(':')[1]) + date.getMinutes());
            // endTimepicker.value = startHours + ":" + startMinutes;
        },
        loadPrograms() {
            this.programs.showTrainerProgramsList = -1;
            let vm = this;
            axios.get(process.env.api_hostname + '/getProgramsByTrainerId/' + vm.userStore.info.userId).then(response => {
                vm.programs.trainerProgramsList = response.data.data;
                vm.programs.showTrainerProgramsList = 1;
            });
        },
        backDesc() {
            this.plan.showPlans = false;
        },
        plansBack() {
            this.card.showCard = false;
            this.plan.showPlans = true;
        },
        toggleSetOwnPriceForm() {
            this.setOwnPrice = !this.setOwnPrice;
        },
        updatePrice() {
            let vm = this;
            this.priceSpinner = true;
            axios
                .post(process.env.api_hostname + "/setTrainerPrice", {
                    appointmentId: vm.appointmentId,
                    price: vm.trainerPrice
                })
                .then(response => {
                    vm.priceSpinner = false;
                    vm.fcEvents = response.data.data;
                    vm.fcEvents.map(event => {
                        if (event.paymentStatus != 1 && event.status == 1) {
                            event.cssClass = "red";
                        }
                    });
                    vm.currentAppointment.totalPrice = vm.trainerPrice;
                    vm.currentAppointment.trainerPrice = vm.trainerPrice;
                    vm.setOwnPrice = false;
                });
        },
        getAppointments() {
            let vm = this;
            axios.get(process.env.api_hostname + "/trainerAppointments").then(response => {
                vm.fcEvents = response.data.data;
                vm.fcEvents.map(event => {
                    if (event.status == 0) {
                        vm.unconfirmedAppointments.push(event);
                    }
                    if (event.paymentStatus != 1 && event.status == 1) {
                        event.cssClass = "red";
                    }
                });
                setTimeout(() => {
                    this.addButtons();
                }, 100);
            });
        },
        addButtons() {
            $('.event-box').find('.gray').each(function () {
                if ($(this).find('.event-buttons').length == 0) {
                    $(this).append('<div class="event-buttons"><i class="fa fa-check green acceptAppointment"></i><i class="fa fa-remove rejectAppointment"></i></div>');
                }
            });
        },
        confirmAppointment() {
            let payment = this.currentAppointment.programPrice === 0 ?
                true : false;
            let vm = this;
            this.showConfirmSpinner = true;
            axios
                .post(process.env.api_hostname + "/confirmAppointment", {
                    appointmentId: vm.appointmentId,
                    domain: process.env.domain + "/calendar",
                    trainerId: vm.userStore.info.userId,
                    paymentStatus: payment
                })
                .then(response => {
                    vm.appointmentStatus = true;
                    vm.getAppointments();
                    vm.showConfirmSpinner = false;
                    setTimeout(function () {
                        $('.event-box').find('.red').each(function () {
                            if ($(this).find('.event-buttons').length === 1) {
                                $(this).find('.event-buttons').remove();
                            }
                        });
                    }, 2500);
                });
        },
        rejectAppointment() {
            let vm = this;
            this.showRejectSpinner = true;
            axios
                .post(process.env.api_hostname + "/rejectAppointment", {
                    appointmentId: vm.appointmentId
                })
                .then(response => {
                    vm.showRejectSpinner = false;
                    $("#editCustomerAppointment").modal("hide");
                    vm.fcEvents = response.data.data;
                });
        },
        showEdit() {
            this.showEditAppointment = true;
        },
        hideEdit() {
            this.showEditAppointment = false;
        },
        dayClick(day, jsEvent) {
            let d = new Date();
            d.setDate(d.getDate() - 1);
            if (day > d) {
                $("#newCustomerAppointment").modal("show");
                let date = new Date(day);
                date.setDate(date.getDate());
                this.endAppointmentDate = date;
                this.startAppointmentDate = date.toDateString();
            } else {
                this.$swal(this.$t("Warning") + "!", this.$t("You cannot create appointment in past days"));
            }
        },
        eventClick(event, jsEvent, pos) {
            let target = jsEvent.target;
            this.currentAppointment = event;
            this.appointmentId = event.appointmentId;
            if (target.classList.contains('event-item')) {
                this.appointmentStatus = event.status;
                this.appointmentId = event.appointmentId;
                this.appointmentDescription = event.title;
                this.startAppointmentDate = event.start;
                this.endAppointmentDate = event.end;
                $("#editCustomerAppointment").modal("show");
            } else {
                if (target.classList.contains('acceptAppointment')) {
                    target.classList.remove('fa-check', 'green');
                    target.classList.add('fa-spinner', 'fa-spin');
                    this.confirmAppointment();
                } else {
                    target.classList.remove('fa-check');
                    target.classList.add('fa-spinner');
                    target.classList.add('fa-spin');
                    this.rejectAppointment();
                }
                let parent = target.parentNode.parentNode;
                setTimeout(() => {
                    parent.removeChild(parent.childNodes[1]);
                }, 2500);
            }
        },
        editAppointment() {
            let vm = this;
            // this.$validator.validateAll().then((result) => {
            //     if (result) {
            this.buttonSpin = true;
            axios
                .post(process.env.api_hostname + "/editAppointment", {
                    from: "calendar",
                    for: "trainer",
                    appointmentId: vm.appointmentId,
                    description: vm.appointmentDescription
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
                        title: this.$t('message'),
                        text: this.$t('Appointment updated!')
                    });
                    vm.startAppointmentDate = null;
                    vm.endAppointmentDate = null;
                    vm.appointmentDescription = null;
                    $(".text-danger").css("visibility", "hidden");
                    $("#editCustomerAppointment").modal("hide");
                });
            //     }
            // });
        },
        newAppointment() {
            let vm = this;
            this.$validator.validateAll().then(result => {
                if (result) {
                    this.buttonSpin = true;
                    // if(vm.startAppointmentDate != vm.endAppointmentDate){
                    //     vm.endAppointmentDate.setDate(vm.endAppointmentDate.getDate() + 1);
                    // }

                    // start time
                    let startHours = parseInt(startTimepicker.value.split(":")[0]) + 1;
                    let startMinutes = startTimepicker.value.split(":")[1];
                    // end time
                    let endHours = parseInt(endTimepicker.value.split(":")[0]) + 1;
                    let endMinutes = endTimepicker.value.split(":")[1];

                    // set time to date
                    let end = new Date(vm.endAppointmentDate);
                    end.setHours(endHours);
                    end.setMinutes(endMinutes);
                    vm.endAppointmentDate = end;

                    let start = new Date(vm.startAppointmentDate);
                    start.setHours(startHours);
                    start.setMinutes(startMinutes);
                    vm.startAppointmentDate = start;

                    axios
                        .post(process.env.api_hostname + "/appointmentRequest", {
                            from: "calendar",
                            for: "trainer",
                            userCustomerId: vm.appointmentCustomer,
                            userTrainerId: this.userStore.info.userId,
                            description: vm.appointmentDescription,
                            furtherInfo: vm.appointmentAdditional,
                            appointmentDate: vm.startAppointmentDate,
                            appointmentEndDate: vm.endAppointmentDate,
                            confirmedByTrainer: true,
                            paymentStatus: false,
                            medicalHealthId: 1,
                            createdBy: "trainer",
                            programId: vm.trainerProgram
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
                                text: this.$t('Appointment created!')
                            });
                            vm.startAppointmentDate = null;
                            vm.endAppointmentDate = null;
                            vm.appointmentTrainer = "";
                            vm.appointmentDescription = null;
                            vm.appointmentAdditional = null;
                            // $('.text-danger').css('visibility','hidden');
                        });
                }
            });
        },
        showPlans() {
            this.plan.showPlans = true;
        },
        goToCard(id) {
            this.plan.showPlans = false;
            this.card.showCard = true;
            this.plan.planId = id;
            this.trainerPlans.map(plan => {
                if (plan.id == id) {
                    this.plan.yearCost = plan.yearlyPay;
                    this.plan.monthCost = plan.monthlyPay;
                    this.plan.planText = plan.plan
                }
            });
        },
        getToken(period) {
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
            vm.plan.payButtonSpin = true;
            Stripe.setPublishableKey(process.env.stripe.publicKey);
            Stripe.card.createToken(
                {
                    number: this.card.number,
                    cvc: this.card.cvc,
                    exp_month: this.card.expMonth,
                    exp_year: this.card.expYear
                },
                function (status, response) {
                    // if we have errors log the error from response.error.message
                    if (response.error) {
                        vm.card.error = response.error.message;
                        vm.plan.payButtonSpin = false;
                        return;
                    } else {
                        // else response.id is the token
                        vm.card.error = null;
                        vm.plan.token = response.id;
                        vm.createCharge(vm.plan.token, period);
                    }
                    // append the token to the ajax request to server
                }
            );
        },
        createCharge(token, period) {
            let vm = this;
            axios
                .post(process.env.api_hostname + "/payTrainerPlanPayment", {
                    token: token,
                    period: period,
                    planId: vm.plan.planId,
                    isFrom: "calendar",
                    trainerId: vm.userStore.info.userId,
                    planText: vm.plan.planText
                })
                .then(response => {
                    if (response.data.statusCode == 200) {
                        vm.plan.payButtonSpin = false;
                        this.plan.showPlans = false;
                        this.card.showCard = false;
                        axios.get(process.env.api_hostname + "/user").then(response => {
                            this.$store.dispatch("setAuth", true);
                            this.$store.dispatch(
                                "setAuthTrainerPlan",
                                response.data.trainerPlan
                            );
                            this.$store.dispatch(
                                "setUserRole",
                                response.data.role[0].description
                            );
                            if (response.data.role[0].description == "trainer" && Array.isArray(response.data.user)) {
                                this.$store.dispatch("setAuthUser", response.data.user[0]);
                            } else {
                                this.$store.dispatch("setAuthUser", response.data.user);
                            }
                        });
                    }
                });
        }
    },
    computed: {
        ...mapState({
            userStore: state => state.user,
            trainerPlan: state => state.authTrainerPlan,
            trainerPlans: state => state.trainerPlans,
            currency: state => state.currency
        })
    },
    components: {
        "full-calendar": require("vue-fullcalendar"),
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

.calendar-no-access {
    color: #464646;
}

.btn {
    cursor: pointer;
}

.btn-danger {
    color: white !important;
}

/* calendar info */
.calendar-info {
    padding: 15px;
}

.green {
    color: green;
}

.event-item {
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
</style>