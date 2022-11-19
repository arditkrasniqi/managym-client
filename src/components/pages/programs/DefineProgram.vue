<template>
    <div>
        <h1 class="page-title">{{$t('Define a program')}}</h1>

        <form @submit.prevent="defineProgram">
            <div class="card">
                <div class="card-block">
                    <div class="row">
                        <div class="col-12">
                            <div class="form-group">
                                <label>{{$t('Title')}}</label>
                                <input v-validate="'required'" v-model="program.title" name="title" :data-vv-as="$t('Title')" type="text" class="form-control">
                                <span v-show="errors.has('title')" class="text-danger">{{ errors.first('title') }}</span>
                            </div>
                            <div class="form-group">
                                <label>{{$t('Description')}}</label>
                                <textarea v-validate="'required'" v-model="program.description" type="text" name="description" :data-vv-as="$t('Description')" class="form-control"></textarea>
                                <span v-show="errors.has('description')" class="text-danger">{{ errors.first('description') }}</span>
                            </div>
                            <div class="form-group">
                                <label>{{$t('Duration')}}</label>
                                <input readonly v-validate="'required'" v-model="program.duration" type="text" name="duration" :data-vv-as="$t('Duration')" placeholder="hh:mm" class="timepicker form-control"></input>
                                <span v-show="errors.has('duration')" class="text-danger">{{ errors.first('duration') }}</span>
                            </div>
                            <div class="form-group">
                                <label>{{$t('Price')}}</label>
                                <div class="input-group">
                                    <span class="input-group-addon" id="basic-addon1">CHF</span>
                                    <input type="text" v-model="program.price" v-validate="'required|decimal'" class="form-control" name="price" :data-vv-as="$t('Price')">
                                </div>
                                <p v-show="errors.has('price')" class="text-danger">{{ errors.first('price') }}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card-footer">
                    <a class="btn btn-outline-secondary" @click="goBack">
                        <i class="fa fa-arrow-left"></i> {{$t('Go Back')}}
                    </a>
                    <button type="submit" class="pull-right btn primary-bg">
                        <i v-if="defineProgramSpinner" class="fa fa-spinner fa-spin"></i>
                        <span v-else>{{$t('Define Program')}}</span>
                    </button>
                </div>
            </div>
        </form>
    </div>
</template>
<script>
    import {mapState} from "vuex";
    import axios from "axios";

    export default {
        data() {
            return {
                defineProgramSpinner: false,
                program:{
                    title:'',
                    description:'',
                    price:null,
                    duration:null
                }
            };
        },
        mounted(){
            let vm = this;
            $(".timepicker").each(function() {
                $(this).timepicker({
                    maxHours:100,
                    showMeridian:false
                });
            });
            $('.timepicker').on('change',function(){
                if($(this).val().endsWith(':')){
                    $(this).val($(this).val() + '00')
                }
                vm.program.duration = $(this).val()
            });
        },
        computed: {
            ...mapState({
                userStore: state => state.user
            })
        },
        methods: {
            goBack(){
                this.$router.push('my-programs');
            },
            defineProgram() {
                this.$validator.validateAll().then(result => {
                    if(result){
                        let vm = this;
                        this.defineProgramSpinner = true;
                        axios.post(process.env.api_hostname + '/newProgram',
                            {
                                trainerId:vm.userStore.info.userId,
                                title:vm.program.title,
                                description:vm.program.description,
                                duration:vm.program.duration,
                                price:vm.program.price
                            }).then(response => {
                            vm.defineProgramSpinner = false;
                            this.$notify({
                                group: "foo",
                                title: "Message",
                                text: "Program created!"
                            });
                            vm.goBack();
                        });
                    }
                });
            }
        }
    };
</script>
<style lang="scss">
    textarea.form-control {
        min-height: 100px;
        max-height: 150px;
    }
    .card-block{
        padding:20px;
    }
</style>
