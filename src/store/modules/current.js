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
        RESET_CUSTOM_LIST: ( state ) => {
            state.list = {
                lid: 0,
                title:'默认播放列表',
                audios:[],
                count: 0,
            };
        },
        UPDATE_CUSTOM_LIST: ( state, audio ) => {
            state.list.audios.push(audio);
        }

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
        PLAY_SINGLE_AUDIO: ( { commit, state }, audio) => {
            if (state.list.lid !== 0) {
                commit('RESET_CUSTOM_LIST');
            }
            commit('UPDATE_CUSTOM_LIST', audio);
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

        }



    }
}