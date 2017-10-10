import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);
import { apiList,apiAudio } from './api/qiniu';

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
            },
            src: '',
            expire: 0,
        },
        currentList: {
            lid: 0,
            title:'',
            img: '',
            tags: '',
            audios:[],
            count: 0,
            current: 0,
        },
        cache:{
            audios:[],
            lists:[],
        },

        playMode: 0,
        isPlay: false,
        version: ~~(Math.random()*999999),
    },
    mutations: {
        playState (state,newState) {
            state.isPlay = newState;
        },
        indexState (state,newState) {
            let list = state.currentList;
            if(newState >= list.audios.length){
                list.current = 0;
            } else if(newState < 0) {
                list.current = list.audios.length-1;
            } else {
                list.current = newState;
            }

        },
        loadAudio (state,audio) {
            state.currentAudio = audio;
        },
        loadList (state,list) {
            state.currentList = list;
        },
        cacheList (state,list) {
            let lists = state.cache.lists;
            for(let i in lists){
                if(lists[i].lid===list.lid){
                    lists.splice(i,1);
                }
            }
            lists.unshift(list);
        },
        cacheAudio (state,audio) {
            let audios = state.cache.audios;
            for(let i in audios){
                if(audios[i].aid===audio.aid){
                    audios.splice(i,1);
                }
            }
            audios.unshift(audio);
        },

    },
    actions: {

        async loadAudio ({ commit,state },aid) {
            let time = (new Date()).getTime()/1000;
            for(let audio of state.cache.audios){
                if(aid===audio.aid&&audio.expire>time){
                    commit('loadAudio',audio);
                    return;
                }
            }
            let res = await apiAudio(aid);
            if(res.ok){
                let audio = res.data;
                commit('loadAudio',audio);
                commit('cacheAudio',audio);
            }

        },
        async loadList ({ commit },lid) {
            let res = await apiList(lid);
            if(res.ok){
                let list = res.data;
                commit('loadList',list);
                commit('cacheList',list);
            }
        },

        async autoMode ({ commit,dispatch,state }){
            let audios = state.currentList.audios;
            let total = audios.length;
            let index = state.currentList.current;
            switch (state.playMode){
                case 1:   // 单曲循环
                break;
                case 2:   // 随机播放
                    let newIndex = Math.floor(Math.random()*total);
                    commit('indexState',newIndex);
                break;
                default:  // 列表循环
                    if(index<total-1){
                        commit('indexState',++index);
                    } else {
                        commit('indexState',0);
                    }
                break;
            }
            let nextAid = audios[state.currentList.current].aid;
            await dispatch('loadAudio',nextAid);
        }

    }
});


export default Store;