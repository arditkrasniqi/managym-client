<template>
    <div>
        <h1 class="page-title">{{$t('Invoices')}}</h1>
        <div class="card">
            <div class="card-block">
                <div class="loader" v-if="typeof invoices == 'string'">
                    <i class="fa fa-spinner fa-spin"></i>
                    <p>
                        <span>{{$t('Loading invoices')}}...</span>
                        <span>{{$t('Please wait!')}}</span>
                    </p>
                </div>
                <div v-else-if="typeof invoices == 'object' && invoices.length > 0">
                    <!--<p v-for="(invoice, index) in invoices">-->
                    <!--<a :href="storage + invoice" target="_blank">Invoice # {{ index }}</a>-->
                    <!--</p>-->
                    <div class="table-responsive">
                        <table class="table table-hover">
                            <thead>
                            <tr>
                                <th>{{$t('Invoice')}}</th>
                                <th>{{$t('Date')}}</th>
                                <th>{{$t('Total')}}</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="invoice in invoices" :key="invoice.id">
                                <td>
                                    <a :href="storage + invoice.name" target="_blank">{{ invoice.id }}</a>
                                </td>
                                <td>{{ invoice.date }}</td>
                                <td>{{ invoice.total.replace("$","CHF ") }}</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="loader" v-else>
                    <p>{{$t('No invoices found !')}}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';
    import config from '../../../config';

    export default {
        name: "invoices",
        data(){
            return {
                storage:config.hostname + '/storage/',
                invoices:''
            }
        },
        created(){
            this.getInvoices();
        },
        // beforeDestroy(){
        //     alert('destroying');
        // },
        // destroyed(){
        //     alert('destroyed');
        // },
        methods:{
            getInvoices(){
                let vm = this;
                axios.get(config.api_hostname + '/invoices')
                    .then(response => {
                        vm.invoices = response.data.files;
                    });
            }
        }

    }
</script>

<style lang="scss">
    .card-block{
        padding:20px;
        .loader{
            text-align:center;
            i{
                font-size:40px;
            }
            p{
                margin-top:20px;
                color:#8c8c8c;
                span{
                    display:block;
                    margin:3px;
                }
            }
        }
    }
</style>