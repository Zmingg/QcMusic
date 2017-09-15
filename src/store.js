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
        sheet: {
            sid: 0,
            info: {
                title:'古风歌集 - 大爱古风',
                img: '',
                tags: ['华语','古风','影视'],
                count: 20177,
            },
            items:[],
        }
    },
    mutations: {
        loadAudio (state,audio) {
            state.currentAudio = audio;
        },
        loadSheet (state,sheet) {
            state.sheet = sheet;
        },
    },
    actions: {
        loadAudio ({ commit },audio) {
            commit('loadAudio',audio);
        },
        loadSheet ({ commit },sheet) {
            commit('loadSheet',sheet);
        },
    }
});


export default Store;