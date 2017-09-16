import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);
import { apiAudio,apiList,apiDisc } from './api/qiniu';

const Store = new Vuex.Store({
    state: {
        currentAudio: {
            aid: 0,
            title: '',
            singer: '',
            disc: {
                sid: 0,
                title: '',
                singer: '',
                release_time: 0,
                summary: '',
                img: '',
                expire: 0,
            },
            src: '',
            expire: 0,
        },
        currentList: {
            sid: 0,
            info: {
                title:'古风歌集 - 大爱古风',
                img: '',
                tags: ['华语','古风','影视'],
                count: 20177,
            },
            items:[],
        },
        playedList: [],
    },
    mutations: {
        loadAudio (state,audio) {
            state.currentAudio = audio;
        },
        loadList (state,list) {
            state.currentList = list;
        },
        loadDisc (state,disc) {
            state.currentAudio.disc = disc;
        },
        addPlayed (state) {
            let aid = state.currentAudio.aid;
            let audios = state.playedList;
            for(let i in audios){
                if(audios[i].aid===aid){
                    state.playedList.splice(i,1);
                }
            }
            state.playedList.unshift(state.currentAudio);
        }
    },
    actions: {
        async loadAudio ({ commit,state },aid) {
            let time = (new Date()).getTime()/1000;
            for(let audio of state.playedList){
                if(aid===audio.aid&&audio.expire>time){
                    commit('loadAudio',audio);
                    return;
                }
            }
            let res = await apiAudio(aid);
            if(res.ok){
                let audio = res.data;
                commit('loadAudio',audio);
            }

        },
        async loadList ({ commit },lid) {
            let res = await apiList(lid);
            if(res.ok){
                let list = res.data;
                commit('loadList',list);
            }
        },
        async loadDisc ({ commit,state },sid) {
            let time = (new Date()).getTime()/1000;
            for(let audio of state.playedList){
                if(sid===audio.disc.sid&&audio.disc.expire>time){
                    commit('loadDisc',audio.disc);
                    return;
                }
            }
            let res = await apiDisc(sid);
            if(res.ok){
                let disc = res.data;
                commit('loadDisc',disc);
            }
        },

    }
});


export default Store;