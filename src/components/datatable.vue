<template>
    <div>
        <ul>
            <li v-for="animal in animals">
                {{ animal.name }}
            </li>
        </ul>
        <datatable :resource_url="resource_url" @update="updateResource"></datatable>
        <!--<h1>ardit</h1>-->
    </div>
</template>
<script>
    import Vue from 'vue'
    import VueResource from 'vue-resource'
    Vue.use(VueResource)
    Vue.http.options.emulateJSON = true
    import vuejsPaginator from 'vuejs-paginator'
    export default{
        components:{
            'datatable':vuejsPaginator
        },
        data(){
            return {
                animals:[
                    {
                        "id": 1,
                        "name": "Crocodile"
                    },
                    {
                        "id": 2,
                        "name": "Bobcat"
                    },
                    {
                        "id": 3,
                        "name": "Elephant"
                    },
                    {
                        "id": 4,
                        "name": "bandicoot"
                    },
                    {
                        "id": 5,
                        "name": "barracuda"
                    }
                ],
                resource_url: 'http://hootlex.github.io/vuejs-paginator/samples/animals1.json'
            }
        },
        methods:{
            updateResource(data){
                // this.animals = data
            }
        }
    }
</script>
<style lang="scss">

</style>