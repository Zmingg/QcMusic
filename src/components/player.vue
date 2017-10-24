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
        }),
        ...mapActions({
            autoNext: 'current/AUTO_NEXT',
        }),

        duration: function () {
            this.setFullTime(this.$refs.player.duration);
        },

        progress: function () {
            let timeRanges = this.$refs.player.buffered;
            if ( timeRanges.length < 1 ){
                return;
            }
            this.setProgress(timeRanges.end(0)); // audio一般没有分段缓冲,只需计算第一段
        },

        timeUpdate: function () {
            if ( !this.isSeeking ) {
                this.setCurTime(this.$refs.player.currentTime);
            }
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

        next: function () {
            this.autoNext();
        },

    }
}
</script>
<style></style>
