<template>
    <div class="main">
        <div class="playall">
            <span class="icon-play"></span>
            播放全部
        </div>
        <ul class="list" @click="play">
            <li :class="{ current: audio.aid === curAid}"
                v-for="(audio,index) in audios"
                :data-aid="audio.aid"
                :data-index="index">
                    <span v-if="audio.aid === curAid" class="play-state"
                          :class="{active:$store.state.player.isPlay}">
                    </span>

                    <span class="play-index" v-else>{{index+1}}</span>
                <div class="info">
                    <div class="info-up">
                        <span>{{audio.title}}</span>
                    </div>
                    <div class="info-down">
                        <span v-if="audio.hq" class="hq">HQ</span>
                        <a class="txt">{{audio.singer}} - {{audio.disc}}</a>
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
            curAid: state => state.current.audio.aid
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
                if(this.curAid === aid) {
                    this.isPlay || this.setPlay();
                }else{
                    this.$root.$emit('load');
                    await this.loadAudio(aid);
                }
                this.playList();
                this.setIndex(index);
                this.$router.push({ name: 'audio', params: {index:index}})
            }
        },
    }
}
</script>
<style lang="scss" scoped>
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
    width: 88%;
    height: 3.2rem;
    border-bottom: 1px solid #eee;
    color: #3a3a3a;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.list li.current {
    color: #ee0000;
}
.play-index {
    width: 20px;
    height: 20px;
    line-height: 20px;
    margin-right: 10px;
    color: #777777;
    text-align: center;
}
.play-state {
    $width: 250px;
    $rat: 20/30;
    width: 20px;
    height: 20px;
    margin-right: 10px;
    font-size: 0;
    background-image: url(../assets/images/control.png);
    background-repeat: no-repeat;
    background-position: #{-180px*$rat} 0;
    background-size: #{250px*$rat} #{250px*$rat};
}
.play-state.active {
    $rat: 20/30;
    background-position: #{-150px*$rat} 0;
}
.info {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    overflow: hidden;
    pointer-events: none;
}
.info-up {
    display: inline-block;
    height: 1.2em;
    line-height: 1.2em;
    font-size: 1rem;
}
.info-down {
    height: 1.2em;
    line-height: 1.2em;
    font-size: 1rem;
    display: flex;
    align-items: center;
}
.hq {
    width: 20px;
    height: 1em;
    line-height: 1em;
    color: #ff0000;
    font-size: 0.6rem;
    text-align: center;
    border: solid 0.1em #ff0000;
    margin-right: 10px;
}
.txt {
    display: inline-block;
    height: 1.2rem;
    line-height: 1.2rem;
    font-size: 0.8rem;
    color: #777777;
    overflow: hidden;
    white-space:nowrap;
    text-overflow:ellipsis;

}
</style>