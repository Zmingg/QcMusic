<template>
    <div class="main">
        <div class="playall">
            <span class="icon-play"></span>
            播放全部
        </div>
        <ul class="list" @click="play">
            <li v-for="(audio,index) in audios" :data-aid="audio.aid" :data-index="index">
                <div class="left" :class="{ current: isCur && (index === curIndex) }">
                    <span v-if="isCur && (index === curIndex)" class="play-state" :class="{active:$store.state.player.isPlay}"></span>
                    <span class="play-index" v-else>{{index+1}}</span>
                    <div class="info">
                        <div>
                            <span class="title">{{audio.title}}</span>
                            <span class="icon-q icon-sq"></span>
                        </div>
                        <a class="txt">{{audio.singer}} - {{audio.disc.title}}</a>
                    </div>
                </div>
            </li>
        </ul>

    </div>
</template>
<script>
import 'babel-polyfill';
import { mapState,mapMutations,mapActions } from 'vuex';
export default{
    props: [
        'audios','playList','isCur'
    ],

    computed: {
        ...mapState({
            isPlay: state => state.player.isPlay,
            curIndex: state => state.current.index
        })
    },

    methods: {
        ...mapMutations({
            setIndex: 'current/SET_INDEX',
            setPlay: 'player/CHANGE_PLAY_STATE',
        }),
        ...mapActions({
            loadAudio: 'current/LOAD_AUDIO',
        }),

        play: async function (e) {
            if(e.target.tagName==='LI'){
                let index = parseInt(e.target.dataset.index);
                let aid = parseInt(e.target.dataset.aid);
                if(this.isCur && (this.curIndex === index)) {
                    this.isPlay || this.setPlay();
                }else{
                    this.$root.$emit('load');
                    await this.loadAudio(aid);
                    this.playList();
                }
                this.setIndex(index);
                this.$router.push({ name: 'audio', params: {index:index}})
            }
        },
    }
}
</script>
<style scoped>
a, li {
    text-decoration: none;
    list-style: none;
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
}
.main {
    padding: 15px;
    -webkit-tap-highlight-color: transparent;
}
.playall {
    min-height: 40px;
    border-bottom: 1px solid #eee;
}
.list li {
    height: 3.5rem;
    border-bottom: 1px solid #eee;
}
.left {
    width: 88%;
    height: 100%;
    color: #000;
    display: flex;
    justify-content: space-between;
    align-items: center;
    pointer-events: none;
}
.current {
    color: #ee0000;
}
.play-index {
    width: 28px;
    min-width: 28px;
    margin-right: 2%;
    color: #777777;
    text-align: center;
}
.play-state {
    width: 28px;
    min-width: 28px;
    height: 20px;
    margin-right: 2%;
    font-size: 0;
    background: url(../assets/images/control.png) no-repeat -30px -180px;
}
.active {
    background: url(../assets/images/control.png) no-repeat 0 -180px;
}
.info {
    width: 93%;
    display: flex;
    flex-direction: column;
    justify-content: center;
}
.title {
    display: inline-block;
    height: 1.2rem;
    line-height: 1.2rem;
    font-size: 1rem;
}
.txt {
    display: inline-block;
    height: 1rem;
    line-height: 1rem;
    font-size: 0.8rem;
    color: #777777;
    overflow: hidden;
    white-space:nowrap;
    text-overflow:ellipsis;

}
</style>