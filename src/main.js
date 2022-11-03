// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App.vue'
import Router from './routes.js'
import Notifications from 'vue-notification'
import VeeValidate from 'vee-validate'
import Auth from './packages/auth/Auth.js'
import { store } from './store/store'
import VueSweetAlert from 'vue-sweetalert'
import VueI18n from 'vue-i18n'
// import de from './i18n/de.js'
import FullCalendar from 'vue-full-calendar'

Vue.config.productionTip = false

Vue.use(Notifications);
Vue.use(VeeValidate);
Vue.use(Auth);
Vue.use(VueSweetAlert);
Vue.use(VueI18n);
Vue.use(FullCalendar);

Router.beforeEach(
    (to, from, next) => {
        if(to.matched.some(record => record.meta.forVisitors)){
            if(Vue.auth.isAuth()){
                next({
                    path:'/search-trainer'
                });
            }else next()
        }else if(to.matched.some(record => record.meta.forAuth)){
            if(!Vue.auth.isAuth()){
                next({
                    path:'/'
                });
            }else next()
        }else next()
    }
);

if(localStorage.getItem('locale') === null){
    localStorage.setItem('locale','en');
}

const i18n = new VueI18n({
    silentTranslationWarn: true,
    locale: localStorage.getItem('locale'),
    // messages: { de },
});

new Vue({
    i18n,
    store:store,
    el: '#app',
    components: { App },
    template: '<App/>',
    router:Router
});