<template>
<div>
    <form @submit.prevent="changePassword">
        <div class="card">
            <h4 class="card-header">
                {{$t('Change Password')}}
            </h4>
                <div class="card-body">
                    <div class="form-group col-12 col-sm-6">
                        <label>{{$t('Old Password')}}</label>
                        <input v-validate="'required|min:6'" v-model="oldPass" type="password" name="oldPassword" :data-vv-as="$t('Old Password')" class="form-control">
                        <span v-show="errors.has('oldPassword')" class="text-danger">{{ errors.first('oldPassword') }}</span></div>
                    <div class="form-group col-12 col-sm-6">
                        <label>{{$t('New Password')}}</label>
                        <input v-validate="'required|min:6'" v-model="newPass" name="newPass" :data-vv-as="$t('New Password')" type="password" class="form-control">
                        <span v-show="errors.has('newPass')" class="text-danger">{{ errors.first('newPass') }}</span></div>
                    <div class="form-group col-12 col-sm-6">
                        <label>{{$t('Confirm Password')}}</label>
                        <input v-validate="{ confirmed:newPass }" id="confNewPass" type="password" name="confirmation" class="form-control">
                        <span v-show="errors.has('confirmation')" class="text-danger">{{ errors.first('confirmation') }}</span></div>
                    <div class="form-group text-danger" v-if="error">
                        {{error}}
                    </div> 
                </div>
                <div class="card-footer">
                    <button type="submit" class="btn primary-bg pull-left">
                        <i class="fa fa-spinner fa-spin" v-if="passwordSpinner"></i>
                        <span v-else>{{$t('Change Password')}}</span>
                    </button>
                </div>
        </div>
    </form>
</div>
</template>
<script>
import { mapState } from "vuex";
import axios from "axios";

export default {
  data() {
    return {
      oldPass: null,
      newPass: null,
      confirmPass: null,
      error: false,
      passErrors: {
        currentPasswordMismatch: this.$t('You entered wrong password'),
        passwordMismatch: this.$t('Your new passwords does not match'),
        passLen: this.$t('Password must contain at least 4 characters')
      },
      passwordSpinner: false
    };
  },
  computed: {
    ...mapState({
      userStore: state => state.user
    })
  },
  methods: {
    changePassword() {
      this.$validator.validateAll().then(result => {
          if(result){
              this.passwordSpinner = true;
              let vm = this;
              let userId = this.userStore.info.hasOwnProperty("userId")
                  ? this.userStore.info.userId
                  : this.userStore.info.id;
              axios
                  .put(process.env.api_hostname + "/changeUserPassword", {
                      userId: userId,
                      oldPass: vm.oldPass,
                      newPass: vm.newPass,
                      confirmPass: confNewPass.value
                  })
                  .then(response => {
                      vm.passwordSpinner = false;
                      $('.text-danger').text('');
                      if (response.data.error) {
                          let err = response.data.error;
                          if (err == "passwordMismatch") {
                              vm.error = vm.passErrors.passwordMismatch;
                          } else if (err == "passLen") {
                              vm.error = vm.passErrors.passLen;
                          } else {
                              vm.error = vm.passErrors.currentPasswordMismatch;
                          }
                      } else {
                          this.$notify({
                              group: "foo",
                              title: this.$t('Message'),
                              text: this.$t('Password Changed') + "!"
                          });
                          vm.oldPass = null;
                          vm.newPass = null;
                          vm.confirmPass = null;
                          confNewPass.value = '';
                          vm.error = null;
                      }
                  })
                  .catch(error => {
                  });
          }
      });
    }
  }
};
</script>
<style lang="scss">

</style>
