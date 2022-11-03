<template>
    <div v-if="userStore.info">
        <h1 class="page-title">
            {{ userStore.info.firstname }} {{ userStore.info.lastname }}
        </h1>
        <div class="row">
            <!--<h1 class="page-title">Trainer Name #1</h1>-->
            <div class="col-12 col-lg-4 col-xl-3">
                <div class="card trainer-info">
                    <div class="card-header">
                        <!--<center>-->
                        <a href="javascript:void(0)" data-toggle="modal" data-target="#profilePictureModal">
                            <img class="card-header-profile-picture" :src="hostname + userStore.info.avatar"
                                 alt="Profile Picture">
                        </a>
                        <div class="form-group">
                            <a data-toggle="modal" data-target="#profilePictureModal" href="javascript:void(0)"
                               class="card-title">{{$t('Change Profile Picture')}}</a>
                        </div>
                        <!--</center>-->
                    </div>
                    <div class="card-block">
                        <div class="nav flex-column nav-pills" id="v-pills-tab" role="tablist"
                             aria-orientation="vertical">
                            <a @click="setActiveModule('accountSettings')" class="nav-link active" id="v-pills-home-tab"
                               data-toggle="pill" href="#v-pills-home" role="tab" aria-controls="v-pills-home"
                               aria-selected="true">{{$t('Account Settings')}}</a>
                            <a @click="setActiveModule('changePassword')" class="nav-link" id="v-pills-home-tab"
                               data-toggle="pill" href="#v-pills-home" role="tab" aria-controls="v-pills-home"
                               aria-selected="true">{{$t('Change Password')}}</a>
                            <a v-if="userStore.role == 'trainer'" @click="setActiveModule('certificates')"
                                class="nav-link" id="v-pills-profile-tab" data-toggle="pill" href="#v-pills-profile"
                               role="tab" aria-controls="v-pills-profile" aria-selected="false">{{$t('Certificates')}}</a>
                            <a v-if="userStore.role == 'trainer'" @click="setActiveModule('trainerPlans')" class="nav-link" id="trainerPlansProfileButton"
                               data-toggle="pill" href="#v-pills-home" role="tab" aria-controls="v-pills-home"
                               aria-selected="true">{{$t('Plans')}}</a>
                            <a v-if="userStore.role == 'trainer'" @click="setActiveModule('accountBalance')" class="nav-link" id="v-pills-home-tab"
                               data-toggle="pill" href="#v-pills-home" role="tab" aria-controls="v-pills-home"
                               aria-selected="true">{{$t('Account Balance')}}</a>
                    </div>
                    </div>
                </div>
            </div>
            <div class="col-12 col-lg-8 col-xl-9">
                <user-update-info v-if="activeModule == 'accountSettings'"></user-update-info>
                <trainer-certificates v-else-if="activeModule == 'certificates'"></trainer-certificates>
                <change-password v-else-if="activeModule == 'changePassword'"></change-password>
                <trainer-plans v-else-if="activeModule == 'trainerPlans'"></trainer-plans>
                <div class="card" v-else-if="activeModule == 'accountBalance'">
                    <h4 class="card-header">
                        {{$t('Account Balance')}}
                    </h4>
                    <account-balance ></account-balance>
                </div>
            </div>
        </div>

        <!-- Modal -->
        <div id="profilePictureModal" class="modal fade" role="dialog">
            <div class="modal-dialog">

                <!-- Modal content-->
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal">&times;</button>
                        <h4 class="modal-title">{{$t('Change Profile Picture')}}</h4>
                    </div>
                    <div class="modal-body">
                        <input id="pictureFile" @change="pictureChanged" type="file" class="form-control" accept="image/*">
                        <div class="text-center form-group">
                            <img @click="browseImage" class="profile-img img-thumbnail"
                                 src="../../../assets/img/camera.jpg" alt="">
                        </div>
                        <div v-if="showModalFooter" class="form-group text-center">
                            <i>{{ uploads.picture.name }}</i>
                        </div>
                        <div class="form-group">
                            <a href="javascript:void(0)" class="btn primary-bg btn-block" @click="browseImage">{{$t('Browse Image')}}</a>
                        </div>
                    </div>
                    <div v-if="showModalFooter" class="modal-footer">
                        <button type="button" class="btn primary-bg" @click="updateProfilePicture">
                            <i v-if="uploads.showSpinner" class="fa fa-spinner fa-spin"></i>
                            <span v-else>{{$t('Update Profile Picture')}}</span>
                        </button>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>
<script>
    import {mapState} from "vuex";
    import axios from "axios";
    import config from "../../../config";
    import Certificates from "./Certificates.vue";
    import UpdateInfo from "./UpdateInfo.vue";
    import ChangePassword from "./PasswordChange.vue";
    import TrainerPlans from './TrainerPlans.vue'
    import AccountBalance from './AccountBalance.vue'

    export default {
        data() {
            return {
                activeModule: "accountSettings",
                hostname: config.hostname + "/storage/",
                showModalFooter: false,
                uploads: {
                    showSpinner: false,
                    form: new FormData(),
                    picture: null,
                    picInfo: null
                }
            };
        },
        created(){
            if(localStorage.getItem('showPlans') != null){
                this.setActiveModule('trainerPlans');
                setTimeout(() => {
                    document.getElementById('trainerPlansProfileButton').click();
                },500);
                localStorage.removeItem('showPlans');
            }
        },
        components: {
            "trainer-certificates": Certificates,
            "user-update-info": UpdateInfo,
            "change-password": ChangePassword,
            'trainer-plans': TrainerPlans,
            'account-balance': AccountBalance,
        },
        methods: {
            setActiveModule(moduleName) {
                this.activeModule = moduleName;
            },
            browseImage() {
                document.getElementById("pictureFile").click();
            },
            pictureChanged(e) {
                this.uploads.picInfo = e.target.files[0].name;
                this.uploads.picture = e.target.files[0];
                this.showModalFooter = true;
            },
            updateProfilePicture() {
                let vm = this;
                let userId = this.userStore.info.hasOwnProperty('userId') ?
                    this.userStore.info.userId : this.userStore.info.id;
                this.uploads.showSpinner = true;
                // this.uploadButtonSpinner = true;
                this.uploads.form = new FormData();
                this.uploads.form.append("picture", this.uploads.picture);

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
                        config.api_hostname + "/updateProfilePicture",
                        this.uploads.form,
                        configuration
                    )
                    .then(response => {
                        vm.uploads.showSpinner = false;
                        axios
                            .post(config.api_hostname + "/savePictureToDB", {
                                userId: userId,
                                folder: response.data.folder,
                                picture: response.data.picture
                            })
                            .then(res => {
                                vm.uploads.showSpinner = false;
                                vm.userStore.info.avatar = res.data;
                                $("#profilePictureModal").modal("hide");
                            });
                    });
            },
        },
        computed: {
            ...mapState({
                userStore: store => store.user
            })
        }
    };
</script>
<style lang="scss">
    .trainer-info {
        .card-header {
            text-align: center;
            .card-title {
                margin-top: 15px;
            }
        }
    }

    .card {
        .card-header {
            img {
                background: white;
                width: 40%;
                border-radius: 100%;
                border: 1px solid #ccc;
            }
            p {
                font-size: 14px;
                margin: 2px;
            }
        }
        margin-bottom: 20px;
        .card-block {
            padding: 15px;
        }
    }

    .profile-left {
        width: 100%;
    }

    a.nav-link {
        color: #000000;
    }

    td {
        a {
            i {
                font-size: 20px;
            }
        }
    }

    .card-header-profile-picture {
        height: 115px !important;
        width: 115px !important;
    }
</style>
