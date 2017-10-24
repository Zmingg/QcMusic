import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);
import player from './modules/player';
import current from './modules/current';
import history from './modules/history';

const Store = new Vuex.Store({
    modules: {
        player,current,history
    },

    state: {
        version: ~~(Math.random() * 999999),
    }

});


export default Store;