<template>
    <div>
        <h1 class="page-title">Organisations</h1>
        <!-- If the current user has created organisations list the organisations -->
        <div class="card">
            <div class="card-block">
                <div v-if="organisations > 0" class="table-responsive">
                    <table class="table table-hover table-sm">
                        <thead>
                        <tr>
                            <th>Name</th>
                            <th class="text-right">Visit</th>
                            <th class="text-right">Close</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="organisation in organisations" :key="organisation.id">
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

                <div v-else>
                    <p>Is your business growing? You have staff? Then create a new Organisation to help you manage those employees.</p>


                </div>
            </div>
        </div>
    </div>
</template>
<script>
import axios from "axios";
import { mapState } from "vuex";
import config from "config";

export default {
  data() {
    return {
      organisations: [],
        upgradeShow:false
    };
  },
  created() {},
  methods: {

  },
  computed: {
    ...mapState({
      userStore: state => state.user,
      trainerPlans: store => store.trainerPlans,
      trainerPlan: store => store.authTrainerPlan
    })
  }
};
</script>
<style lang="scss">
    .card-block{
        padding:20px;
    }
</style>

