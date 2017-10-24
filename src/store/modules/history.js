export default {
    namespaced: true,

    state: {
        lists: [],
        audios: [],
    },

    mutations: {
        UPDATE_LIST_HISTORY: ( state, list ) => {
            let lists = state.lists;
            for(let i in lists){
                if(lists[i].lid === list.lid){
                    lists.splice(i,1);
                }
            }
            lists.unshift(list);
        },

        UPDATE_AUDIO_HISTORY ( state, audio ) {
            let audios = state.audios;
            for(let i in audios){
                if(audios[i].aid === audio.aid){
                    audios.splice(i,1);
                }
            }
            audios.unshift(audio);
        },
    }

}