<template>
    <div>
        <h1 class="page-title">
            {{ $t('Dashboard') }}
        </h1>
        <div v-if="userStore.role != 'admin'">
            <div class="card" v-if="appointments != '' && appointments != '_'">
                <h4 class="card-header">{{ $t("Today's Appointments") }}</h4>
                <div class="card-body">
                    <div class="row">
                        <div class="table-responsive">
                            <table class="table table-hover">
                                <thead>
                                    <tr>
                                        <th>{{ $t('Description') }}</th>
                                        <!--<th>-->
                                        <!--<span v-if="userStore.role == 'customer'">Trainer</span>-->
                                        <!--<span v-else>Customer</span>-->
                                        <!--</th>-->
                                        <th>{{ $t('Start Time') }}</th>
                                        <th>{{ $t('End Time') }}</th>
                                        <th class="icons">{{ $t('Details') }}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="appointment in appointments">
                                        <td @click="appointmentDetails(appointment.id)" class="pointer">
                                            {{ appointment.description }}</td>
                                        <!--<td>{{ appointment.firstname }} {{ appointment.lastname }}</td>-->
                                        <td>{{ appointments != '_' && appointments.length > 0 ?
                                            appointment.appointmentDate.split(' ')[1] : ''
                                        }}
                                        </td>
                                        <td>{{ appointments != '_' && appointments.length > 0 ?
                                            appointment.appointmentEndDate.split(' ')[1] : ''
                                        }}
                                        </td>
                                        <td class="icons"><a @click="appointmentDetails(appointment.id)"
                                                href="javascript:void(0)"><i class="fa fa-info-circle"></i></a>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else-if="appointments == '_'" class="text-center">
                <i class="fa fa-spinner fa-spin"></i>
                <p>{{ $t('Loading next appointments') }}...</p>
            </div>
            <div v-else>
                <h5>{{ $t('No appointments for today') }}</h5>
                <div class="create-appointment">
                    <p v-if="userStore.role == 'customer'">
                        {{ $t('Go to calendar and create new appointments with the best Trainers near you') }}.</p>
                    <p v-else>{{ $t('Go to calendar and confirm any appointment request or create new appointments') }}.
                    </p>
                    <router-link to="calendar" class="btn primary-bg">{{ $t('Go to Calendar') }}</router-link>
                </div>
            </div>
        </div>
        <div v-else>
            this is admin panel
        </div>
        <!-- Modal -->
        <div id="appointment" class="modal fade" role="dialog">
            <div class="modal-dialog">

                <!-- Modal content-->
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal">&times;</button>
                        <h4 class="modal-title">{{ $t('Appointment Details') }}</h4>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-12">
                                <div class="table-responsive">
                                    <table class="table table-sm no-border">
                                        <tr>
                                            <th>{{ $t('Description') }}</th>
                                            <td>{{ details.description }}</td>
                                        </tr>
                                        <tr>
                                            <th>
                                                <span v-if="userStore.role == 'customer'">Trainer</span>
                                                <span v-else>Customer</span>
                                            </th>
                                            <td>{{ details.firstname }} {{ details.lastname }}</td>
                                        </tr>
                                        <tr>
                                            <th>{{ $t('Start Date') }}</th>
                                            <td>{{ details.appointmentDate }}</td>
                                        </tr>
                                        <tr>
                                            <th>{{ $t('End Date') }}</th>
                                            <td>{{ details.appointmentEndDate }}</td>
                                        </tr>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal">{{ $t('Close') }}</button>
                    </div>
                </div>

            </div>
        </div>

        <!-- Modal -->
        <div id="notifyForTrainer" class="modal fade" role="dialog">
            <div class="modal-dialog">

                <!-- Modal content-->
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal">&times;</button>
                        <h4 class="modal-title">{{ $t('Become Trainer') }}</h4>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-12">
                                <h3>Become A Trainer</h3>
                                <p>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                                    incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                                    exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                                    irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                                    pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
                                    deserunt mollit anim id est laborum.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn primary-bg"
                            @click="becomeTrainer">{{ $t('I want to become Trainer') }}</button>
                        <button type="button" class="btn btn-default" @click="dismissNotification"
                            data-dismiss="modal">{{ $t('Cancel') }}</button>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>
<script>
import axios from "axios";
import { mapState } from "vuex";

export default {
    data() {
        return {
            appointments: "_",
            details: ""
        };
    },
    computed: {
        ...mapState({
            trainerId: state => state.trainerVisit,
            userStore: state => state.user
        })
    },
    created() {
        this.storeData();
        setTimeout(() => {
            if (this.userStore.role === 'customer' && this.userStore.info.becomeTrainerNotify === 1) {
                $('#notifyForTrainer').modal('show');
            }
        }, 6000);
    },
    mounted() {
        let vm = this;
        $('#notifyForTrainer').on('hidden.bs.modal', function () {
            vm.dismissNotification();
        })
    },
    methods: {
        dismissNotification() {
            let vm = this;
            this.$store.commit('setTrainerNotify', 1);
            axios.post(`${process.env.api_hostname}/disableNotificationForTrainer`, {
                status: 0,
                userId: vm.userStore.info.id
            }).then(response => { });
        },
        becomeTrainer() {
            $('#notifyForTrainer').modal('hide');
            this.$router.push('/become-trainer');
        },
        storeData() {
            let vm = this;
            if (localStorage.getItem("token") !== null) {
                axios.defaults.headers.common["Authorization"] = localStorage.getItem(
                    "token"
                );
                axios.get(process.env.api_hostname + "/user").then(response => {
                    this.$store.dispatch("setAuth", true);
                    this.$store.dispatch("setAuthTrainerPlan", response.data.trainerPlan);
                    this.$store.dispatch(
                        "setUserRole",
                        response.data.role[0].description
                    );
                    if (response.data.role[0].description == "trainer" && Array.isArray(response.data.user)) {
                        this.$store.dispatch("setAuthUser", response.data.user[0]);
                    } else {
                        this.$store.dispatch("setAuthUser", response.data.user);
                    }
                    if (response.data.hasOwnProperty("affiliateLink")) {
                        this.$store.dispatch(
                            "setAffiliateLink",
                            `${process.env.domain}/?affiliateLink=${response.data.affiliateLink[0].affiliateLink}`
                        );
                    }
                    if (vm.trainerId != 0) {
                        this.$router.push("trainer/" + vm.trainerId);
                        this.$store.commit('setTrainerVisitId', 0);
                    }
                    if (vm.userStore.role == "trainer") vm.trainerAppointments();
                    else if (vm.userStore.role == "customer") vm.customerAppointments();

                    // check if user was registered by organisation email link
                    if (localStorage.getItem('redirBcTrainer') != null) {
                        this.$router.push('/become-trainer');
                        localStorage.removeItem('redirBcTrainer');
                    }
                });
            }
        },
        trainerAppointments() {
            let vm = this;
            axios
                .get(process.env.api_hostname + "/dashboardTrainerAppointments")
                .then(response => {
                    if (response.data.length == 0) {
                        vm.appointments = "";
                    } else {
                        vm.appointments = response.data;
                    }
                });
        },
        customerAppointments() {
            let vm = this;
            axios
                .get(process.env.api_hostname + "/dashboardCustomerAppointments")
                .then(response => {
                    vm.appointments = response.data;
                });
        },
        appointmentDetails(id) {
            let vm = this;
            this.appointments.map(item => {
                if (item.id == id) {
                    vm.details = item;
                }
            });
            $("#appointment").modal("show");
        }
    }
};
</script>
<style lang="scss">
@import "../../styles/_variables.scss";

@media screen and (min-width: 771px) {
    main:not(.guest-main) {
        margin-left: 240px !important;
        padding: 20px;
    }
}

@media screen and (max-width: 770px) {
    main {
        margin-left: 0 !important;
    }
}

.icons {
    text-align: right;
    max-width: 100px;

    i {
        font-size: 22px;
        color: $primary-color;
    }
}

dd {
    margin-left: 30px;
}

.no-border {

    th,
    td {
        border: none !important;
    }
}
</style>