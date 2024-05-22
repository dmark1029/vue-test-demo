import './bootstrap';
import { createApp } from 'vue';
import createStore from './store';
import { createRouter, createWebHistory } from 'vue-router';


import App from './App.vue';
import FetchRepo from './components/FetchRepo.vue';
import 'bulma/css/bulma.css';

const routes = [
    {
        name: 'Index',
        path: '/',
        component: FetchRepo
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});
const store = createStore();
createApp(App)
    .use(router)
    .use(store)
    .mount('#app');