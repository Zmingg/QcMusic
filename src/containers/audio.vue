<template>
    <div class="main">
        <div class="bg_shadow" :class="{hlight:bg.hlight}"></div>
        <div class="bg_img" ref="bg">
            <transition name="fade" >
                <img :src="backImgUrl"  :key="bg.backImgState"/>
            </transition>
        </div>

        <div class="header">
            <div class="back" @click="back">返回</div>
            <div class="info">
                <span class="title">{{ audio.title }}</span>
                <span class="singer">{{ audio.singer }} - {{ audio.disc.title }}</span>
            </div>
            <div class="share"></div>
        </div>

        <div class="show" @click="changeView">
            <transition name="show-fade">
                <keep-alive>
                    <div :is="curView"
                         :isPlay="isPlay"
                         :img="discImgUrl"
                         :backImg="backImgUrl"
                         :lyricUrl="audio.lyric"
                         :darkBack="darkBack">
                    </div>
                </keep-alive>
            </transition>
        </div>

        <div class="controls">
            <div class="control_time">
                <span class="curtime">{{curTimeStr}}</span>
                <div class="time_bar" ref="time" @click="timeChange">
                    <div class="time_bar_back"></div>
                    <div class="time_bar_progress" :style="{width:progressRate*100+'%'}"></div>
                    <div class="time_bar_cur" :style="{width:playRate*100+'%'}"></div>
                    <div class="time_bar_ball" :style="{left:playRate*100+'%'}"
                         @mousedown="timeSlider" @touchstart="timeSliderTouch"></div>
                </div>
                <span class="fulltime">{{ fullTimeStr }}</span>
            </div>
            <div class="control_play">
                <span class="prev" @click="prev"></span>
                <span class="play" @click="play" v-if="!isPlay"></span>
                <span class="pause" @click="play" v-else></span>
                <span class="next" @click="next"></span>
            </div>
        </div>
    </div>
</template>
<script>
import gaussBlur from '../lib/gaussBlur';
import smartCrop from '../lib/smartcrop';
//import Disc from '../components/disc.vue';
import Lyric from '../components/lyric.vue';
import { mapState,mapGetters,mapMutations,mapActions } from 'vuex';
import defaultBg from '../assets/images/disc_default.jpg';
import Disc from '../components/disc.vue';
export default {
    components: {
        Disc, Lyric
    },

    data(){
        return {
            state: {
                index:0,
                discChanging: false,
            },
            bg: {
                backImgState: 0,
                backImgs: [],
                hlight: true,
            },
            curView: 'disc',
        }
    },

    computed: {
        ...mapState({
            fullTime: state => state.player.fullTime,
            curTime: state => state.player.curTime,
            isPlay: state => state.player.isPlay,
            audio: state => state.current.audio,
        }),

        ...mapGetters({
            fullTimeStr: 'player/fullTime',
            curTimeStr: 'player/curTime',
        }),

        discImgUrl: function () {
            let ver = this.$store.state.version;
            return this.audio.disc.img !== ''
                ? this.audio.disc.img + '/thumbnail?v=qc' + ver
                : '';
        },

        backImgUrl: function () {
            return this.bg.backImgs[this.bg.backImgState];
        },

        playRate: function () {
            if (this.fullTime === 0) {
                return 0;
            }
            return this.curTime/this.fullTime;
        },

        progressRate:function () {
            return this.fullTime === 0
                ? 0
                : this.$store.state.player.progress/this.fullTime;
        },
    },

    watch: {
        ['audio.aid']: function () {
            this.drawBackImg();
        }
    },

    created(){
        if(this.$store.state.current.audio.aid){
            this.drawBackImg();
        }
    },

    methods: {
        ...mapMutations({
            setCurTime: 'player/SET_CUR_TIME',
            seek: 'player/TIME_SEEK',
            changePlayState: 'player/CHANGE_PLAY_STATE',
            setIndex: 'current/SET_INDEX',
        }),

        ...mapActions({
            loadAudio: 'current/LOAD_AUDIO',
        }),

        next: function () {
            let current = this.$store.state.current;
            this.setIndex(++current.index);
            let aid = current.list.audios[current.index].aid;
            this.loadAudio(aid);
        },

        prev: function () {
            let current = this.$store.state.current;
            this.setIndex(--current.index);
            let aid = current.list.audios[current.index].aid;
            this.loadAudio(aid);
        },

        play: function () {
            this.changePlayState();
        },

        timeChange: function(e){
            e.preventDefault();
            e.stopPropagation();
            if (e.target!==this.$refs.time) {
                return;
            }
            let cur = (e.clientX - e.target.offsetLeft) / e.target.offsetWidth * this.fullTime;
            this.seek();
            this.setCurTime(cur);
            this.$nextTick(()=>{
                this.seek();
            });
        },

        timeSlider: function(e){
            e.preventDefault();
            this.seek();
            let handleX = e.offsetX-6;   //修正控制点位置偏差
            let moveHandle = (e)=>{
                e.preventDefault();
                let cur = e.clientX-this.$refs.time.offsetLeft-handleX;
                let max = this.$refs.time.offsetWidth;
                if(cur > max){
                    cur = max;
                } else if(cur < 0){
                    cur = 0;
                }
                this.setCurTime(this.fullTime*(cur/max));
            };
            let finishMove = (e)=>{
                e.preventDefault();
                this.seek();
                this.$el.removeEventListener('mousemove',moveHandle);
                this.$el.removeEventListener('mouseup',finishMove);
            };
            this.$el.addEventListener('mousemove',moveHandle,false);
            this.$el.addEventListener('mouseup',finishMove,false);
        },

        timeSliderTouch: function(e){
            e.preventDefault();
            e.stopPropagation();
            this.seek();
            let ballX = e.target.offsetLeft+6;  //ball初始圆心
            let originX = e.changedTouches[0].pageX;  //初始控制点位置
            let moveHandle = (e)=>{
                e.preventDefault();
                e.stopPropagation();
                let touch = e.changedTouches[0];
                let _x =  touch.pageX-originX;   //计算偏移
                let cur = ballX+_x;   // 偏移后的圆心
                let max = this.$refs.time.offsetWidth;
                if(cur > max){
                    cur = max;
                } else if(cur < 0){
                    cur = 0;
                }
                this.setCurTime(this.fullTime*(cur/max));
            };
            let finishMove = (e)=>{
                e.preventDefault();
                e.stopPropagation();
                this.seek();
                this.$el.removeEventListener('touchmove',moveHandle);
                this.$el.removeEventListener('touchend',finishMove);
            };
            this.$el.addEventListener('touchmove',moveHandle,false);
            this.$el.addEventListener('touchend',finishMove,false);
        },

        drawBackImg: function () {
            let bg = this.bg;
            let img = new Image();
            img.onload = ()=>{
                bg.backImgs[bg.backImgState+1] = img.src;
                bg.backImgState++;
            };
            img.src = this.audio.disc.img+'/playerbg';

        },

        darkBack: function () {
            this.bg.hlight = !this.bg.hlight;
        },

        changeView: function () {
            this.curView = (this.curView === 'disc') ? 'lyric' : 'disc';
        },

//        beforeLeave: function () {
//            this.state.discChanging = true;
//        },
//
//        afterLeave: function () {
//            this.state.discChanging = false;
//        },

        back: function () {
            this.$router.go(-1);
        }
    }

}

</script>
<style lang="scss" scoped>
img {
    width: 100%;
    height: 100%;
}
.main {
    width: 100%;
    height: 100%;
    position: fixed;
    -webkit-tap-highlight-color: transparent;
}
.bg_shadow {
    position: absolute;
    width: 100%;
    height: 100%;
    background: hsla(0,0%,0%,0.7);
    z-index: -99;
    transition: 0.5s;
    opacity: 1;

}
.hlight {
    opacity: 0.6;
}
.bg_img {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: -100;
    display: flex;
    align-items: center;

    img {
        position: absolute;
        width: 100%;
        height: 100%;
    }
}
//  切换背景
.fade-enter-active, .fade-leave-active {
    transition: opacity 1s
}
.fade-leave-to {
    opacity: 0;
    z-index: -100;
}
.fade-enter {
    opacity: 1;
    z-index: -101;
}
.fade-enter-to {
    opacity: 1;
    z-index: -101;
}
.fade-leave {
    opacity: 1;
    z-index: -100;
}
//  切换disc/lyric
.show-fade-enter-active, .show-fade-leave-active {
    transition: opacity 0.5s;
}
.show-fade-enter, .show-fade-leave-to {
    opacity: 0;
 }

.header {
    width: 100%;
    padding: 0 20px;
    height: 50px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 0.1px solid #a5a5a5;
    color: #eeeeee;
    font-weight: lighter;
}

.share {
    width: 50px;
}
.info {
    margin-top: 0.5rem;
    height: 2.5rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
.title {
    font-size: 1rem;
    line-height: 1.2rem;
    height: 1.2rem;
}
.singer {
    font-size: 0.7rem;
    line-height: 1rem;
    height: 1rem;
}
.controls {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 98px;
}
.control_time {
    height: 1.2rem;
    margin: 0 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #dddddd;
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    font-size: 12px;

}
.time_bar {
    margin: 0 15px;
    width: 100%;
    height: 18px;
    position: relative;
}
.time_bar_back {
    position: absolute;
    top: 8px;
    left: 0;
    width: 100%;
    height: 2px;
    background: rgba(150,150,150,0.7);
    pointer-events: none;
}
.time_bar_progress {
    position: absolute;
    top: 8px;
    left: 0;
    width: 0;
    height: 2px;
    background: rgba(60,60,60,0.9);
    pointer-events: none;
}
.time_bar_cur {
    position: absolute;
    top: 8px;
    left: 0;
    width: 0;
    height: 2px;
    background: #ee0000;
    pointer-events: none;
}
.time_bar_ball {
    position: absolute;
    left: 0;
    margin-left: -6px;
    border-color: #ffffff;
    border-style: solid;
    border-width: 7px;
    width: 4px;
    height: 4px;
    border-radius: 9px;
    background: #ee0000;
}
.control_play {
    margin: 0 25%;
    width: 50%;
    height: 80px;
    display: flex;
    justify-content: space-around;
    align-items: center;
}
.play {
    width: 48px;
    height: 48px;
    border-radius: 24px;
    background: url(../assets/images/control.png) no-repeat 0 0 ;
    background-size: 133px 133px;
}
.pause {
    width: 48px;
    height: 48px;
    border-radius: 24px;
    background: url(../assets/images/control.png) no-repeat -48px 0 ;
    background-size: 133px 133px;
}
.prev {
    width: 48px;
    height: 48px;
    background: url(../assets/images/control.png) no-repeat 0 -54px;
    background-size: 150px 150px;
}
.next {
    width: 48px;
    height: 48px;
    background: url(../assets/images/control.png) no-repeat -48px -54px;
    background-size: 150px 150px;
}

.show {
    height: calc(100% - 150px);
    width: 100%;
    position: relative;
}


</style>