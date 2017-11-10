import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);
import Home from './containers/index.vue';
import Cates from './containers/cates.vue';
import Search from './containers/search.vue';
import List from './containers/list.vue';
import Audio from './containers/audio.vue';
export default new VueRouter({
    mode:'history',
    routes:[
        { name: 'home', path: '/', component: Cates },
        { name: 'cates', path: '/cates', component: Cates },
        { name: 'search', path: '/search', component: Search },
        { name: 'list', path: '/list', component: List },
        { name: 'audio', path: '/player', component: Audio },

    ]
});
