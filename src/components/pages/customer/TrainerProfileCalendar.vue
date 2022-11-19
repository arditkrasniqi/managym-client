<template>
    <div class="card">
        <div class="card-header">
            {{ $t("Today's Calendar") }}
        </div>
        <div class="card-block" v-if="typeof fcEvents === 'object'">
            <full-calendar :config="fcConfig" :events="fcEvents"></full-calendar>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import { mapState } from 'vuex'

export default {
    name: "trainer-profile-calendar",
    props: ['trainerId'],
    data() {
        return {
            trainer: 0,
            fcEvents: '',
            fcConfig: {
                'defaultView': 'agendaDay',
                eventStartEditable: false,
                eventDurationEditable: false,
                locale: localStorage.getItem('locale')
            },
            trainerInfo: ''
        }
    },
    computed: {
        ...mapState({
            userStore: state => state.user
        })
    },
    created() {
        this.trainer = this.trainerId;
        this.getTodaysAppointments();
    },
    mounted() {
    },
    methods: {
        getTodaysAppointments() {
            let vm = this;
            axios.get(`${process.env.api_hostname}/getTodaysAppointments/${this.trainer}`)
                .then(response => {
                    vm.fcEvents = response.data.appointments;
                    this.fcEvents.map(event => {
                        event.title = this.$t('Now Available')
                    });
                    vm.trainerInfo = response.data.trainerInfo;
                    vm.fcConfig.minTime = vm.trainerInfo.availableFrom.split(' ')[0] + ':00';
                    vm.fcConfig.maxTime = (parseInt(vm.trainerInfo.availableTo.split(' ')[0]) + 1) + ':00';
                    // setTimeout(function () {
                    //     $('.fc-right').remove();
                    //     $('.fc-left').remove();
                    // }, 700);
                })
        }
    }
}
</script>

<style lang="scss" scoped>

</style>