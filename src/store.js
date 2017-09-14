import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

const Store = new Vuex.Store({
    state: {
        currentAudio: {
            aid: 0,
            title: '',
            singer: '',
            disc: '',
            url:'',
        },
    },
    mutations: {
        loadAudio (state,audio) {
            state.currentAudio = audio;
        }
    },
    actions: {
        loadAudio ({ commit },audio) {
            commit('loadAudio',audio);
        }
    }
});


export default Store;