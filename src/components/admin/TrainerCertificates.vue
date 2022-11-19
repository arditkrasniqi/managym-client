<template>
  <div>
    <h1 class="page-title">{{ $t('Trainer Certificates Management') }}</h1>
    <div class="card">
      <p class="card-header">{{ $t('Unverified Certificates') }}</p>
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-hover">
            <thead>
              <tr>
                <th>{{ $t('Title') }}</th>
                <th>{{ $t('Trainer') }}</th>
                <th class="w50">{{ $t('Open') }}</th>
                <th class="w50">{{ $t('Verify') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="certificate in certificates" :key="certificate.id">
                <td>{{ certificate.title }}</td>
                <td>{{ certificate.trainerName }}</td>
                <td class="text-center">
                  <a :href="hostname + certificate.path" target="_blank">
                    <i class="fa fa-external-link-square"></i>
                  </a>
                </td>
                <td class="text-center">
                  <a href="javascript:void(0)" @click="verifyCertificate(certificate)"><i
                      class="fa fa-square-o"></i></a>
                </td>
              </tr>
              <tr v-if="typeof certificates == 'object' && certificates.length == 0">
                <td colspan="4" class="text-center">{{ $t('No certificates found') }}</td>
              </tr>
              <tr v-if="typeof certificates == 'string' && certificates == ''">
                <td colspan="4" class="text-center">
                  <i class="fa fa-spinner fa-spin"></i>
                  <p>{{ $t('Loading') }}...</p>
                </td>
              </tr>
            </tbody>
          </table>
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
      certificates: "",
      hostname: process.env.domain + "/"
    };
  },
  created() {
    this.getUnverifiedCertificates();
  },
  computed: {
    ...mapState({
      userStore: state => state.user
    })
  },
  methods: {
    getUnverifiedCertificates() {
      let vm = this;
      axios
        .get(process.env.api_hostname + "/unverifiedCertificates")
        .then(response => {
          vm.certificates = response.data.data;
        });
    },
    verifyCertificate(cer) {
      let vm = this;
      this.$swal({
        title: this.$t('Are you sure you want to verify this certificate ?'),
        confirmButtonText: this.$t('Yes'),
        cancelButtonText: this.$t('Cancel'),
        showCancelButton: true,
        showCloseButton: true,
        target: $("#rtl-container")[0]
      }).then(
        result => {
          axios
            .post(process.env.api_hostname + "/verifyCertificate", {
              certificateId: cer.id
            })
            .then(response => {
              vm.certificates = response.data.data;
              this.$notify({
                group: "foo",
                title: this.$t('Message'),
                text: this.$t('Certificate verified')
              });
            });
        },
        dismiss => { }
      );
    }
  }
};
</script>
<style lang="scss">
.card-body {
  padding: 15px;
}

td {
  a {
    i {
      font-size: 20px !important;
    }

    outline: none;
  }
}
</style>
