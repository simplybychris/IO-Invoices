import Vue from 'vue'
import VueRouter from 'vue-router'
import Invoices from '../views/Invoices.vue'
// import About from '../views/About.vue'
import EditInvoice from '../views/EditInvoice.vue'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Invoices',
        component: Invoices,
    },
    {
        path: '/edit/:id',
        name: 'EditInvoice',
        component: EditInvoice,
    },
]

const router = new VueRouter({
    mode: 'history',
    // base: process.env.BASE_URL,
    routes,
})

export default router
