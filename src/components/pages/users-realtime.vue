<template>
    <div>
        <div class="table-responsive">
            <table class="table table-sm">
                <thead>
                <tr>
                    <th>name</th>
                    <th>email</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="user in users" v-bind:key="user.id">
                    <td>{{user.firstname}} {{user.lastname}}</td>
                    <td>{{user.email}}</td>
                </tr>
                </tbody>
            </table>
        </div>

        <div class="row">
            <form @submit.prevent="uploadFile" enctype="multipart/form-data">
                <div class="col-12">
                    <input type="file" multiple @change="fileChanged" class="form-control">
                    <button type="submit" class="btn primary-bg">Upload</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
    import {mapState} from 'vuex'
    import axios from 'axios'
    import pusher from 'pusher-js'

    export default {
        name: "profile",
        data(){
            return {
                users:[],

                pusher:null,
                channel:null,

                fileUpload:{
                    attachments:[],
                    form:new FormData(),
                }
            }
        },
        created(){
            this.getUsers();
            let vm = this;
            this.pusher = new Pusher(process.env.pusher.appKey, {
                cluster:process.env.pusher.appCluster
            });
            this.channel = this.pusher.subscribe('my-channel');
            this.channel.bind('my-event', function(data) {
                // alert('An event was triggered with message: ' + data.message);
                vm.users = data.users;
            });
        },
        methods:{
            getUsers(){
                let vm = this;
                axios.get(process.env.api_hostname + '/usersList')
                    .then(response => {
                        vm.users = response.data;
                    })
            },
            fileChanged(e){
                let files = e.target.files;
                if(!files.length){
                    return false;
                }

                for(let i=0;i<files.length;i++){
                    this.fileUpload.attachments.push(files[i]);
                }
            },
            uploadFile(){
                this.fileUpload.attachments.forEach(file => {
                    this.fileUpload.form.append('pics[]', file)
                });
                let cnf = { headers: {'Content-type': 'multipart/form-data'} };
                axios.post(process.env.api_hostname + '/uploadFile',this.fileUpload.form,cnf)
                    .then(response => {
                    });
            }
        },
        computed:{
            ...mapState({
                userStore:store => store.user
            })
        }
    }
</script>

<style scoped>

</style>