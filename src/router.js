import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);
import Index from './containers/index.vue';
import Cates from './containers/cates.vue';
import Singers from './containers/singers.vue';
import Rank from './containers/rank.vue';
import Sheet from './containers/sheet.vue';
import Player from './containers/player.vue';

export default new VueRouter({
    mode:'history',
    routes:[
        { path: '/', component: Sheet },
        { path: '/cates', component: Cates },
        { path: '/singers', component: Singers },
        { path: '/rank', component: Rank },
        { path: '/sheet', component: Sheet },
        { path: '/player', component: Player },
    ]
});
