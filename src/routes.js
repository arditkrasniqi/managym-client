import Vue from 'vue'
import VueRouter from 'vue-router'
import Dashboard from './components/static/Dashboard.vue'
import SearchTrainer from './components/pages/customer/TrainerSearch.vue'
import OrganisationsList from './components/pages/Organisation/List.vue'
import OrganisationsCreate from './components/pages/Organisation/Create.vue'
import TrainerProfile from './components/pages/customer/TrainerProfile.vue'
import organisation from './components/pages/Organisation/Organisation.vue'
import calendar from './components/pages/calendars/Calendar.vue'
import profile from './components/pages/profile/Profile.vue'
import Certificates from './components/pages/profile/Certificates.vue'
import BecomeTrainer from './components/pages/customer/BecomeTrainer.vue'
import organisationCalendar from './components/pages/Organisation/Calendar.vue'
import assignPrograms from './components/pages/Organisation/Programs.vue'
import organisationPrograms from './components/pages/Organisation/OrganisationPrograms.vue'
import FrontPage from './components/frontpage/FrontPage.vue'
import TrainerCertificates from './components/admin/TrainerCertificates.vue'
import PayoutRequests from './components/admin/PayoutRequests.vue'
import ProgramDefine from './components/pages/programs/DefineProgram.vue'
import Programs from './components/pages/programs/Programs.vue'
import Invoices from './components/pages/customer/Invoices.vue'
import AccountBalance from './components/pages/customer/AccountBalance.vue'

import datatable from './components/datatable.vue'

Vue.use(VueRouter);

const router = new VueRouter({
    mode: 'history',
    routes: [
        {
            path: '/',
            component: FrontPage,
            meta: {
                forVisitors: true
            }
        },
        {
            path: '/dashboard',
            component: Dashboard,
            meta: {
                forAuth: true
            }
        },
        {
            path: '/organisations/create',
            name: 'organisations.create',
            component: OrganisationsCreate,
            meta: {
                forAuth: true
            },
        },
        {
            path: '/organisations/myOrgs',
            name: 'myOrgs',
            component: OrganisationsList,
            meta: {
                forAuth: true
            }
        },
        {
            path: '/organisations/:id',
            component: organisation,
            meta: {
                forAuth: true
            },
        },
        {
            path: '/organisations/:id/calendar/',
            name: 'organisation.calendar',
            component: organisationCalendar,
            meta: {
                forAuth: true
            },
        },
        {
            path: '/organisations/:id/assignPrograms/',
            name: 'organisation.assignPrograms',
            component: assignPrograms,
            meta: {
                forAuth: true
            },
        },
        {
            path: '/organisations/:id/programs/',
            name: 'organisation.programs',
            component: organisationPrograms,
            meta: {
                forAuth: true
            },
        },
        {
            path: '/search-trainer',
            component: SearchTrainer,
            meta: {
                forAuth: true
            }
        },
        {
            path: '/trainer/:id',
            component: TrainerProfile,
            meta: {
                forAuth: true
            }
        },
        {
            path: '/calendar',
            component: calendar,
            meta: {
                forAuth: true
            }
        },
        {
            path: '/profile',
            component: profile,
            meta: {
                forAuth: true
            },
        },
        {
            path: '/profile/certificates',
            component: Certificates,
            name: 'trainer.certificates',
            meta: {
                forAuth: true
            }
        },
        {
            path: '/become-trainer',
            component: BecomeTrainer,
            meta: {
                forAuth: true
            }
        },
        {
            path: '/trainer-certificates',
            component: TrainerCertificates,
            name:'trainer.certificates.admin',
            meta: {
                forAuth: true
            }
        },
        {
            path: '/payout-requests',
            component:PayoutRequests,
            name:'payout.requests',
            meta: {
                forAuth: true
            }
        },
        {
            path: '/define-program',
            component: ProgramDefine,
            name:'define.program',
            meta: {
                forAuth: true
            }
        },
        {
            path: '/my-programs',
            name:'my.programs',
            component: Programs,
            meta: {
                forAuth: true
            }
        },
        {
            path:'/datatable',
            component:datatable
        },
        {
            path:'/invoices',
            component:Invoices,
            meta: {
                forAuth: true,
                forTrainer: true
            }
        },
        {
            path:'/account-balance',
            component:AccountBalance,
            name:'account.balance',
            meta:{
                forAuth:true,
                forTrainer:true
            }
        }
    ]
});

export default router
