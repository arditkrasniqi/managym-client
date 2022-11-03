<template>
    <div>
        <h1 class="page-title">{{ $t('Appointments') }}</h1>
        <customer-calendar v-if="userStore.role == 'customer'"></customer-calendar>
        <trainer-calendar v-else-if="userStore.role == 'trainer'"></trainer-calendar>
    </div>
</template>
<script>
import { mapState } from "vuex";
import CustomerCalendar from './CustomerCalendar.vue'
import TrainerCalendar from './TrainerCalendar.vue'
export default {
  components: {
    "customer-calendar": CustomerCalendar,
    "trainer-calendar": TrainerCalendar
  },
  computed: {
    ...mapState({
      userStore: store => store.user
    })
  }
};
</script>
<style>
.vueconf {
  background-color: #00a65a !important;
}
.full-calendar-body .dates .dates-events .events-week .events-day {
  min-height: 100px;
}
</style>
