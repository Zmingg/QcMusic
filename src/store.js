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
            lid: 0,
            title:'',
            img: '',
            tags: '',
            audios:[],
            count: 0,
        },
        cache:{
            audios:[],
            discs:[],
            lists:[],
        },
        curIndex: 0,
        volume: 50,
        playMode: 0,
        isPlay: false,
    },
    mutations: {
        playState (state,newState) {
            state.isPlay = newState;
        },
        indexState (state,newState) {
            if(newState>=state.currentList.audios.length){
                state.curIndex = 0;
            } else if(newState<0) {
                state.curIndex = state.currentList.audios.length-1;
            } else {
                state.curIndex = newState;
            }
        },
        loadAudio (state,audio) {
            state.currentAudio = audio;
        },
        loadList (state,list) {
            state.currentList = list;
        },
        loadDisc (state,disc) {
            state.currentAudio.disc = disc;
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
        cacheDisc (state,disc) {
            let discs = state.cache.discs;
            for(let i in discs){
                if(discs[i].sid===disc.aid){
                    discs.splice(i,1);
                }
            }
            discs.unshift(disc);
        },
        cacheAudio (state,audio) {
            let audios = state.cache.audios;
            for(let i in audios){
                if(audios[i].aid===audio.aid){
                    audios.splice(i,1);
                }
            }
            audios.unshift(audio);
        }
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
        async loadList ({ commit,state },lid) {
            let time = (new Date()).getTime()/1000;
            for(let list of state.cache.lists){
                if(lid===list.id&&list.expire>time){
                    commit('loadList',list);
                    return;
                }
            }
            let res = await apiList(lid);
            if(res.ok){
                let list = res.data;
                if(list.img===''){
                    let sid = list.audios[0].disc.sid;
                    for(let disc of state.cache.discs){
                        if(sid===disc.sid&&disc.expire>time){
                            list.img = disc.img;
                            list.expire = disc.expire;
                            return;
                        }
                    }
                    let res = await apiDisc(sid);
                    if(res.ok){
                        let disc = res.data;
                        list.img = disc.img;
                        list.expire = disc.expire;
                        commit('cacheDisc',disc);
                    }
                }
                commit('loadList',list);
                commit('cacheList',list);
            }
        },
        async loadDisc ({ commit,state },sid) {
            let time = (new Date()).getTime()/1000;
            for(let disc of state.cache.discs){
                if(sid===disc.sid&&disc.expire>time){
                    commit('loadDisc',disc);
                    return;
                }
            }
            let res = await apiDisc(sid);
            if(res.ok){
                let disc = res.data;
                commit('loadDisc',disc);
                commit('cacheDisc',disc);
            }
        },
        async autoMode ({ commit,dispatch,state }){
            let audios = state.currentList.audios;
            let total = audios.length;
            let index = state.curIndex;
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
            let nextAid = audios[state.curIndex].aid;
            await dispatch('loadAudio',nextAid);
        }

    }
});


export default Store;