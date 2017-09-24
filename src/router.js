import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);
import Home from './containers/index.vue';
import Cates from './containers/cates.vue';
import Singers from './containers/singers.vue';
import Rank from './containers/rank.vue';
import List from './containers/list.vue';
import Player from './containers/player.vue';

export default new VueRouter({
    mode:'history',
    base: '/music/',
    routes:[
        { path: '/', name: 'home', component: List },
        { path: '/cates', component: Cates },
        { path: '/singers', component: Singers },
        { path: '/rank', component: Rank },
        { path: '/list', component: List },
        { path: '/player', component: Player },
        { path: '/search', component: List },
    ]
});
