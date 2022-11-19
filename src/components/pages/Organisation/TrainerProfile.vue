
<template>
    <div v-if="trainer.details !== ''" class="row">
        <!--<h1 class="page-title">Trainer Name #1</h1>-->
        <div class="col-12 col-lg-4 col-xl-3">
            <div class="card trainer-info">
                <div class="card-header">
                    <!--<center>-->
                    <img :src="trainer.details.avatar" alt="">
                    <h4 class="card-title">{{ trainer.details.firstname }} {{ trainer.details.lastname}}</h4>
                    <p>{{ trainer.details.availableFrom }} - {{ trainer.details.availableTo }}</p>
                    <p>${{ trainer.details.perHour }}.00 / hour</p>
                    <!--</center>-->
                </div>
                <div class="card-block">
                    <p><b>About {{ trainer.details.firstname }}</b></p>
                    <p class="card-text">{{ trainer.details.description }}</p>
                    <div v-if="trainer.rewards.length > 0 && trainer.rewards !== ''" id="trainerRewards">
                        <hr>
                        <p>
                            <b>Rewards</b>
                        </p>
                        <p class="trainer-reward" v-for="reward in trainer.rewards"><i class="fa fa-trophy"></i> {{ reward.description }}</p>
                    </div>
                    <div v-if="trainer.certificates.length > 0 && trainer.certificates !== ''" id="trainerCertificates">
                        <hr>
                        <p>
                            <b>Certificates</b>
                        </p>
                        <p class="trainer-certificate" v-for="certificate in trainer.certificates">
                            <i class="fa fa-certificate"></i>
                            <a :href="certificate.certificatePath">{{ certificate.description }}</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-12 col-lg-8 col-xl-9">
            <div class="card profile-left" id="appointment">
                <div class="card-header">
                    Make an appointment
                </div>
                <div class="card-block">
                    <form @submit.prevent="sendAppointmentRequest">
                        <div class="form-group">
                            <label>Choose date</label>
                            <datepicker v-validate="'required'" name="AppointmentDate" placeholder="Appointment Date" v-model="appointmentDate"></datepicker>
                            <span v-show="errors.has('AppointmentDate')" class="text-danger">{{ errors.first('AppointmentDate') }}</span>
                        </div>
                        <div class="form-group">
                            <label>Why do you want to go to {{ trainer.details.firstname }}?</label>
                            <textarea v-validate="'required'" name="description" class="form-control" v-model="appointmentReason" placeholder="Reason"></textarea>
                            <span v-show="errors.has('description')" class="text-danger">{{ errors.first('description') }}</span>
                        </div>
                        <div class="form-group">
                            <label>Further information for {{ trainer.details.firstname }}</label>
                            <textarea v-model="appointmentFurtherInfo" class="form-control" placeholder="Additional"></textarea>
                        </div>
                        <div class="form-group">
                            <div class="row">
                                <div class="col-sm-4 col-lg-3 text-right">
                                    <button type="submit" class="btn btn-block primary-bg">
                                        <i class="fa" :class="{'fa-paper-plane-o':!buttonSpin, 'fa-spin fa-spinner':buttonSpin}"></i>
                                        Send</button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import axios from 'axios'
    import {mapState} from 'vuex'
    import Datepicker from 'vuejs-datepicker'
    export default {
        components:{
            'datepicker':Datepicker
        },
        data(){
            return {
                appointmentDate:null,
                appointmentReason:null,
                appointmentFurtherInfo:null,
                buttonSpin:false,
                trainerId:'',
                trainer:{
                    details:'',
                    rewards:'',
                    certificates:''
                },
            }
        },
        created(){
            this.getTrainerId();
            this.getTrainer();
        },
        computed:{
            ...mapState({
                userStore: state => state.user
            })
        },
        methods:{
            sendAppointmentRequest(){
                let vm = this;
                this.$validator.validateAll().then((result) => {
                    if(result){
                        this.buttonSpin = true;
                        axios.post(process.env.api_hostname + '/appointmentRequest',
                            {
                                userCustomerId:this.userStore.info.id,
                                userTrainerId:vm.trainerId,
                                description:vm.appointmentReason,
                                furtherInfo:vm.appointmentFurtherInfo,
                                appointmentDate:vm.appointmentDate,
                                appointmentEndDate:vm.appointmentDate,
                                createdBy:this.userStore.info.id,
                                confirmedByTrainer:false,
                                paymentStatus:false,
                                medicalHealthId:1
                            })
                            .then(response => {
                                this.$notify({
                                    group: 'foo',
                                    title: 'Message',
                                    text: 'Appointment Request sent!'
                                });
                                vm.appointmentDate = null;
                                vm.appointmentReason = null;
                                vm.appointmentFurtherInfo = null;
                                vm.buttonSpin = false;
                                $('.text-danger').css('visibility','hidden');
                            })
                    }
                });
            },
            getTrainer(){
                var vm = this
                axios.post(process.env.api_hostname+'/getTrainerById',{id:this.trainerId})
                    .then(response => {
                        vm.trainer.details = response.data.trainer[0];
                        vm.trainer.rewards = response.data.rewards;
                        vm.trainer.certificates = response.data.certificates;
                    });
            },
            getTrainerId(){
                var path = document.location.href;
                this.trainerId = path.substr(path.lastIndexOf('/') + 1);
            }
        }
    }
</script>
<style lang="scss">
    .trainer-info{
        .card-header{
            text-align:center;
            .card-title{
                margin-top:15px;
            }
        }
    }
    .card{
        .card-header{
            img{
                background:white;
                width:40%;
                border-radius:100%;
                /*box-shadow:0 0 5px black;*/
                border:1px solid #ccc;
                /*padding:5px;*/
                /*transition:all 0.2s;*/
                &:hover{
                    /*padding:5px;*/
                }
            }
            p{
                font-size:14px;
                margin:2px;
            }
        }
        margin-bottom:20px;
        .card-block{
            padding:15px;
            #trainerRewards, #trainerCertificates{
                .trainer-reward, .trainer-certificate{
                    margin:5px;
                    color:#2b2b2b;
                    font-size:15px;
                    .fa{
                        font-size:15px;
                        margin-right:5px;
                    }
                    a{
                        color:#367ac3;
                    }
                }
            }
        }
    }
    .profile-left{
        width:100%;
    }
    .vdp-datepicker{
        input{
            display: block;
            width: 100%;
            padding: .5rem .75rem;
            font-size: 1rem;
            line-height: 1.25;
            color: #495057;
            background-color: #fff;
            background-image: none;
            background-clip: padding-box;
            border: 1px solid rgba(0,0,0,.15);
            border-radius: .25rem;
            transition: border-color ease-in-out .15s,box-shadow ease-in-out .15s;
        }
    }
    #appointment{
        textarea{
            height:100px;
            min-height:100px;
            max-height:200px;
        }
        .text-danger{
            font-size:14px;
        }
    }
</style>