export default {
    namespaced: true,

    state: {
        fullTime: 0,
        curTime: 0,
        progress: 0,
        isPlay: false,
        isSeeking: false,
    },

    getters: {
        fullTime: state => secondsToString(state.fullTime),
        curTime: state => secondsToString(state.curTime),
    },

    mutations: {
        SET_PROGRESS: ( state, time ) => {
            state.progress = time;
        },
        SET_FULL_TIME: ( state, time ) => {
            state.fullTime = time;
        },
        SET_CUR_TIME: ( state, time ) => {
            state.curTime = time;
        },
        TIME_SEEK: ( state ) => {
            state.isSeeking = !state.isSeeking;
        },
        CHANGE_PLAY_STATE: ( state ) => {
            state.isPlay = !state.isPlay;
        },

    }

}

let secondsToString = (seconds)=>{
    let cur_time = Math.round(seconds);
    let cur_minutes = Math.floor(cur_time/60)<10?'0'+Math.floor(cur_time/60).toString():Math.floor(cur_time/60).toString();
    let cur_seconds = cur_time%60<10?'0'+(cur_time%60).toString():cur_time%60;
    return cur_minutes+':'+cur_seconds;
};