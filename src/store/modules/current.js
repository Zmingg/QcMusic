import { apiList,apiAudio } from '../../api/qiniu';
export default {
    namespaced: true,

    state: {

        list: {
            lid: 0,
            title:'',
            img: '',
            tags: '',
            audios:[],
            count: 0,
        },

        audio: {
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

        index: -1,
        mode: 0,

    },

    mutations: {
        SET_INDEX: ( state, index ) => {
            let length = state.list.audios.length;
            if( index >= length ){
                state.index = 0;
            } else if( index < 0 ) {
                state.index = length - 1;
            } else {
                state.index = index;
            }
        },
        SET_MODE: ( state, mode ) => {
            state.mode = mode;
        },
        SET_CUR_LIST: ( state, list ) => {
            state.list = list;
        },
        SET_CUR_AUDIO: ( state, audio ) => {
            state.audio = audio;
        },


    },

    actions: {
        LOAD_LIST: async ( { commit, rootState }, lid ) => {
            for(let list of rootState.history.lists){
                if(lid === list.lid){
                    commit('history/UPDATE_LIST_HISTORY', list, { root: true });
                    return list;
                }
            }
            let res = await apiList(lid);
            if(res.ok){
                let list = res.data;
                commit('history/UPDATE_LIST_HISTORY', list, { root: true });
                return list;
            }
        },
        PLAY_LIST:  ( { commit }, list ) => {
            commit('SET_CUR_LIST', list);

        },
        LOAD_AUDIO: async ({ commit, rootState }, aid) => {
            let time = (new Date()).getTime()/1000;
            for(let audio of rootState.history.audios){
                if(aid === audio.aid && audio.expire > time){
                    commit('SET_CUR_AUDIO', audio);
                    return;
                }
            }
            let res = await apiAudio(aid);
            if(res.ok){
                let audio = res.data;
                commit('SET_CUR_AUDIO', audio);
                commit('history/UPDATE_AUDIO_HISTORY', audio,  { root: true });
            }

        },
        AUTO_NEXT: async ({ commit,dispatch,state }) => {
            let audios = state.list.audios;
            let total = audios.length;
            let index = state.index;
            switch (state.mode){
                case 1:   // 单曲循环
                    break;
                case 2:   // 随机播放
                    let randomIndex = Math.floor(Math.random()*total);
                    commit('SET_INDEX', randomIndex);
                    break;
                default:  // 列表循环
                    if(index<total-1){
                        commit('SET_INDEX', ++index);
                    } else {
                        commit('SET_INDEX', 0);
                    }
                    break;
            }
            let nextAid = audios[state.index].aid;

            await dispatch('LOAD_AUDIO', nextAid);
        }


    }
}