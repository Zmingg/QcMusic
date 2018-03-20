<template>
    <div>
        <audio class="player" :src="this.src" ref="player"></audio>
    </div>
</template>
<script>
import { mapState,mapActions,mapMutations } from 'vuex';
import emptyAudio from '../assets/media/empty.mp3';
export default{

    computed: {
        ...mapState({
            src: state => state.current.audio.src || emptyAudio,
            isPlay: state => state.player.isPlay,
            isSeeking: state => state.player.isSeeking,
            audios: state => state.current.list.audios,
            index: state => state.current.index,
            mode: state => state.player.mode
        }),
    },

    watch: {
        isPlay: function () {
            this.isPlay ? this.play() : this.pause();
        },
        isSeeking: function () {
            if ( !this.isSeeking ) {
                this.$refs.player.currentTime = this.$store.state.player.curTime;
            }
        }
    },

    mounted(){
        let player = this.$refs.player;
        player.addEventListener('durationchange', this.duration);
        player.addEventListener('progress',this.progress);
        player.addEventListener('timeupdate', this.timeUpdate);
        player.addEventListener('ended',this.next);
        player.addEventListener('play',()=>{
            this.isPlay || this.changePlayState();
        });
        player.addEventListener('pause',()=>{
            this.isPlay && this.changePlayState();
        });

        this.$root.$on('load',this.load);
        this.$root.$on('play',this.play);
    },
    updated(){
        this.play();
    },
    methods: {
        ...mapMutations({
            setProgress: 'player/SET_PROGRESS',
            setFullTime: 'player/SET_FULL_TIME',
            setCurTime: 'player/SET_CUR_TIME',
            changePlayState: 'player/CHANGE_PLAY_STATE',
            setIndex: 'current/SET_INDEX',
            setMode: 'player/SET_MODE'
        }),
        ...mapActions({
            loadAudio: 'current/LOAD_AUDIO',
        }),

        duration: function () {
            this.setFullTime(this.$refs.player.duration);
        },

        progress: function () {
            let timeRanges = this.$refs.player.buffered;
            if ( timeRanges.length < 1 ){
                return;
            }
            this.setProgress(timeRanges.end(timeRanges.length-1)); // 最后一段的结束点
        },

        timeUpdate: function () {
            if ( !this.isSeeking ) {
                this.setCurTime(this.$refs.player.currentTime);
            }
        },

        async next () {
            let total = this.audios.length;
            if (total===1) {
                this.setMode(1);
            }
            switch (this.mode){
                case 1:   // 单曲循环
                    this.play();
                    break;
                case 2:   // 随机播放
                    let randomIndex = Math.floor(Math.random()*total);
                    this.setIndex(randomIndex);
                    break;
                default:  // 列表循环
                    if(this.index<total-1){
                        this.setIndex(this.index + 1);
                    } else {
                        this.setIndex(0);
                    }
                    break;
            }
            let nextAid = this.audios[this.index].aid;
            await this.loadAudio(nextAid);
        },

        load: function () {
            this.$refs.player.load();
        },

        play: function () {
            this.$refs.player.play();
        },

        pause: function () {
            this.$refs.player.pause();
        },

    }
}
</script>
<style></style>
