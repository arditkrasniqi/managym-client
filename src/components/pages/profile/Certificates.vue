<template>
    <div class="card">
        <h4 class="card-header">
            {{ $t('Certificates') }}
        </h4>
        <div class="card-block">
            <div class="row">
                <div v-if="showUploadForm" class="col-12">
                    <form @submit.prevent="storeCertificates">
                        <div class="form-group">
                            <label>{{ $t('Title') }}</label>
                            <input v-validate="'required'" v-model="certificateTitle" type="text" name="title"
                                :data-vv-as="$t('Title')" class="form-control">
                            <span v-show="errors.has('title')" class="text-danger">{{ errors.first('title') }}</span>
                        </div>
                        <div class="form-group">
                            <label>{{ $t('Description') }}</label>
                            <textarea v-validate="'required'" v-model="certificateDesc" name="description"
                                :data-vv-as="$t('Description')" class="form-control certificate-description"></textarea>
                            <span v-show="errors.has('description')"
                                class="text-danger">{{ errors.first('description') }}</span>
                        </div>
                        <div class="form-group">
                            <label>{{ $t('Choose certificate') }}</label>
                            <input v-validate="'required'" accept=".pdf,.doc,.docx,.xls,.ppt" id="fileUploads"
                                name="certificate" :data-vv-as="$t('Certificate')" type="file" @change="fileChanged"
                                class="form-control">
                            <span v-show="errors.has('certificate')"
                                class="text-danger">{{ errors.first('certificate') }}</span>
                        </div>
                        <div class="form-group">
                            <button type="submit" class="btn primary-bg">
                                <i v-if="uploadButtonSpinner" class="fa fa-spinner fa-spin"></i>
                                <span v-else>{{ $t('Upload') }}</span>
                            </button>
                        </div>
                    </form>
                </div>
                <div v-else class="col-12">
                    <div class="form-group">
                        <a href="javascript:void(0)" @click="toggleUploadForm" class="btn primary-bg"><i
                                class="fa fa-upload"></i> {{ $t('Upload Certificate') }}</a>
                    </div>
                    <div class="table-responsive">
                        <table class="table table-hover">
                            <thead>
                                <tr>
                                    <th>{{ $t('Title') }}</th>
                                    <th class="w50">{{ $t('Open') }}</th>
                                    <th class="w50">{{ $t('Verified') }}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="cer in trainerCertificates" :key="cer.id">
                                    <td>{{ cer.title }}</td>
                                    <td class="text-center">
                                        <a target="_blank" :href="hostname + cer.path">
                                            <i class="fa fa-external-link-square"></i>
                                        </a>
                                    </td>
                                    <td class="text-center">
                                        <i v-if="cer.verified == 1" class="fa fa-check"></i>
                                        <i v-else class="fa fa-times"></i>
                                    </td>
                                </tr>
                                <tr v-if="typeof trainerCertificates == 'object' && trainerCertificates.length == 0">
                                    <td colspan="3" class="text-center">{{ $t('No certificates found') }}</td>
                                </tr>
                                <tr v-if="typeof trainerCertificates == 'string' && trainerCertificates == ''">
                                    <td colspan="3" class="text-center">
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
        <div v-if="showUploadForm" class="card-footer">
            <a href="javascript:void(0)" @click="toggleUploadForm" class="btn btn-secondary">
                <i class="fa fa-arrow-left"></i> {{ $t('Go Back') }}
            </a>
        </div>
    </div>
</template>
<script>
import { mapState } from "vuex";
import axios from "axios";

export default {
    data() {
        return {
            trainerCertificates: "",
            attachment: null,
            form: new FormData(),
            certificateTitle: null,
            certificateDesc: null,
            uploadButtonSpinner: false,
            showUploadForm: false,
            hostname: process.env.domain + "/"
        };
    },
    created() {
        this.getCertificates();
    },
    methods: {
        toggleUploadForm() {
            this.showUploadForm = !this.showUploadForm;
        },
        getCertificates() {
            let vm = this;
            axios.get(process.env.api_hostname + "/trainerCertificates").then(response => {
                vm.trainerCertificates = response.data.data;
            });
        },
        fileChanged(e) {
            let file = e.target.files[0];
            this.attachment = file;
        },
        storeCertificates() {
            this.$validator.validateAll().then(result => {
                if (result) {
                    let vm = this;
                    this.uploadButtonSpinner = true;
                    this.form = new FormData();
                    this.form.append("certificate", this.attachment);

                    let configuration = {
                        headers: {
                            "Content-type":
                                "multipart/form-data; charset=utf-8; boundary=" +
                                Math.random()
                                    .toString()
                                    .substr(2)
                        }
                    };
                    axios
                        .post(
                            process.env.api_hostname + "/storeCertificates",
                            this.form,
                            configuration
                        )
                        .then(response => {
                            axios
                                .post(process.env.api_hostname + "/storeCertificateToDatabase", {
                                    title: vm.certificateTitle,
                                    description: vm.certificateDesc,
                                    folder: response.data.folderPath,
                                    file: response.data.file
                                })
                                .then(res => {
                                    vm.trainerCertificates = res.data.data;
                                    vm.toggleUploadForm();
                                    this.$notify({
                                        group: "foo",
                                        title: this.$t('Message'),
                                        text: this.$t('Uploaded successfully') + "!"
                                    });
                                    vm.attachments = null;
                                    document.getElementById("fileUploads").value = "";
                                    vm.uploadButtonSpinner = false;
                                    vm.certificateTitle = null;
                                    vm.certificateDesc = null;
                                });
                        })
                        .catch(error => {
                            vm.uploadButtonSpinner = false;
                        });
                }
            })
        }
    },
    computed: {
        ...mapState({
            userStore: store => store.user
        })
    }
};
</script>
<style lang="scss">
.certificate-description {
    max-width: 100%;
    min-width: 100%;
    min-height: 100px;
    max-height: 200px;
    height: 150px;
}
</style>
