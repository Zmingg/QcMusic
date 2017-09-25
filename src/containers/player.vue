<template>
    <div class="main">
        <div class="bg_shadow" :class="{hlight:bg.hlight}"></div>
        <div class="bg_img" ref="bg">
            <transition name="fade" @before-leave="beforeLeave" @after-leave="afterLeave">
                <img :src="backImgUrl"  :key="bg.backImgState"/>
            </transition>
        </div>

        <div class="header">
            <div class="back" @click="back">返回</div>
            <div class="info">
                <span class="title">{{audio.title}}</span>
                <span class="singer">{{audio.singer}} - {{disc.title}}</span>
            </div>
            <div class="share"></div>
        </div>

        <div class="show" @click="changeView">
            <transition name="show-fade">
                <keep-alive>
                    <div :is="curView"
                         :isPlay="state.isPlay"
                         :img="disc.img"
                         :backImg="backImgUrl"
                         :isChanging="state.discChanging"
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
                <span class="fulltime">{{fullTimeStr}}</span>
            </div>
            <div class="control_play">
                <span class="prev" @touchend="prev"></span>
                <span class="play" :hidden="state.isPlay" @click="play"></span>
                <span class="pause" :hidden="!state.isPlay" @click="pause"></span>
                <span class="next" @click="next"></span>
            </div>
        </div>
    </div>
</template>
<script>
import gaussBlur from '../lib/gaussBlur';
import smartCrop from '../lib/smartcrop';
import Disc from '../components/disc.vue';
import Lyric from '../components/lyric.vue';
import { mapMutations,mapActions } from 'vuex';
import defaultBg from '../assets/images/disc_default.jpg';

export default {
    components: {
        Disc, Lyric,
    },

    data(){
        return {
            audio: {
                aid: 0,
                title: '',
                singer: '',
                lyric: '',
                expire: 0,
            },
            disc: { img:'',title:'' },
            state: {
                isPlay: false,
                curTime: 0,
                fullTime: 0,
                progress: 0,
                index:0,
                timeRating: false,
                discChanging: false,
                showDisc: true,
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
        backImgUrl: function () {
            return this.bg.backImgs[this.bg.backImgState];
        },
        playRate: function () {
            let state = this.state;
            return state.fullTime===0?0:state.curTime/state.fullTime;
        },
        progressRate:function () {
            let state = this.state;
            return state.fullTime===0?0:state.progress/state.fullTime;
        },
        curTimeStr: function () {
            return this.secondsToString(this.state.curTime);
        },
        fullTimeStr: function () {
            return this.secondsToString(this.state.fullTime);
        },
    },

    created(){
        this.state.index = ~~this.$route.params.index;

    },

    mounted(){
        this.init();
        this.refresh(this.$store.state.currentAudio);
    },

    destroyed(){
        this.player.ondurationchange = null;
        this.player.onprogress = null;
        this.player.ontimeupdate = null;
        this.player.onended = null;
    },

    methods: {
        ...mapMutations([
            'playState','indexState'
        ]),
        ...mapActions([
            'loadAudio','loadDisc','autoMode'
        ]),
        init: function () {
            let state = this.state;
            this.player = document.querySelector('audio');
            state.isPlay = !this.player.paused||false;
            state.fullTime = this.player.duration||0;
            this.getProgress();
            this.player.ondurationchange = ()=>{
                state.fullTime = this.player.duration;
            };
            this.player.onprogress=()=>{
                this.getProgress();
            };
            this.player.ontimeupdate = ()=>{
                if(!state.timeRating){
                    state.curTime = this.player.currentTime;
                }
            };
            this.player.onended = async ()=>{
                await this.autoMode();
                this.reset();
                this.refresh(this.$store.state.currentAudio);
                this.play();

            }

        },

        load: async function (aid) {
            await this.loadAudio(aid);
            this.refresh(this.$store.state.currentAudio);
            this.player.src  = this.$store.state.currentAudio.src;
            this.player.load();
        },

        refresh: function (audio) {
            this.state.index = this.$store.state.curIndex;
            this.audio = {
                aid: audio.aid,
                title: audio.title,
                singer: audio.singer,
                lyric: audio.lyric,
                expire: audio.expire,
            };
            this.changeDisc(audio.disc.sid);
        },

        changeDisc: async function (sid) {
            await this.loadDisc(sid);
            let disc = this.$store.state.currentAudio.disc;
            this.disc.title = disc.title;
            let img = new Image();
            img.onload = ()=>{
                this.disc.img = img.src;
                this.drawBackImg();
            };
            img.src = disc.img;
        },

        next: async function () {
            this.reset();
            this.indexState(++this.state.index);
            let aid = this.$store.state.currentList.audios[this.$store.state.curIndex].aid;
            await this.load(aid);
            this.state.isPlay && this.player.play();

        },

        prev: async function () {
            this.reset();
            this.indexState(--this.state.index);
            let aid = this.$store.state.currentList.audios[this.$store.state.curIndex].aid;
            await this.load(aid);
            this.state.isPlay && this.player.play();
        },

        play: function () {
            this.player.play();
            this.state.isPlay = true;
            this.playState(true);
        },
        pause: function () {
            this.player.pause();
            this.state.isPlay = false;
            this.playState(false);
        },
        reset: function () {
            let state = this.state;
            this.player.pause();
            this.player.currentTime = 0;
            state.curTime = 0;
            state.fullTime = 0;
            state.progress = 0;
        },
        getProgress: function () {
            let timeRanges = this.player.buffered;
            if(timeRanges.length<1){
                return;
            }
            this.state.progress = timeRanges.end(0); // audio一般没有分段缓冲,只需计算第一段
        },
        secondsToString: (seconds)=>{
            let cur_time = Math.round(seconds);
            let cur_minutes = Math.floor(cur_time/60)<10?'0'+Math.floor(cur_time/60).toString():Math.floor(cur_time/60).toString();
            let cur_seconds = cur_time%60<10?'0'+(cur_time%60).toString():cur_time%60;
            return cur_minutes+':'+cur_seconds;
        },
        timeChange: function(e){
            e.preventDefault();
            e.stopPropagation();
            if (e.target!==this.$refs.time) {
                return;
            }
            this.player.currentTime = (e.clientX-e.target.offsetLeft)/e.target.offsetWidth*this.state.fullTime;
        },
        timeSlider: function(e){
            e.preventDefault();
            let state = this.state;
            state.timeRating = true;
            let handleX = e.offsetX-6;   //修正控制点位置偏差
            let moveHandle = (e)=>{
                e.preventDefault();
                let durX = e.clientX-this.$refs.time.offsetLeft-handleX;
                let max = this.$refs.time.offsetWidth;
                if(durX>max){
                    durX = max;
                } else if(durX<0){
                    durX = 0;
                }
                state.curTime = state.fullTime*(durX/max);
            };
            let finishMove = (e)=>{
                e.preventDefault();
                state.timeRating = false;
                this.player.currentTime = state.curTime;
                this.$el.removeEventListener('mousemove',moveHandle);
                this.$el.removeEventListener('mouseup',finishMove);
            };
            this.$el.addEventListener('mousemove',moveHandle,false);
            this.$el.addEventListener('mouseup',finishMove,false);
        },
        timeSliderTouch: function(e){
            e.preventDefault();
            e.stopPropagation();
            let state = this.state;
            state.timeRating = true;
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
                state.curTime = state.fullTime*(cur/max);
            };
            let finishMove = (e)=>{
                e.preventDefault();
                e.stopPropagation();
                this.player.currentTime = state.curTime;
                state.timeRating = false;
                this.$el.removeEventListener('touchmove',moveHandle);
                this.$el.removeEventListener('touchend',finishMove);
            };
            this.$el.addEventListener('touchmove',moveHandle,false);
            this.$el.addEventListener('touchend',finishMove,false);
        },

        drawBackImg: function () {
            let canvas = document.createElement('canvas');
            let ctx = canvas.getContext('2d');
            let win_w = this.$el.clientWidth;
            let win_h =  this.$el.clientHeight;
            canvas.width = win_w;
            canvas.height = win_h;
            let img = new Image();
            img.crossOrigin = "Anonymous";
            img.onload = ()=>{

                let _canvas = document.createElement('canvas');
                _canvas.width = img.width;
                _canvas.height = img.height;
                let _ctx = _canvas.getContext('2d');
                _ctx.drawImage(img, 0, 0, img.width, img.height);
                let backImgData = _ctx.getImageData(0, 0, img.width, img.width);
                // 高斯处理
                let gaussImgData = gaussBlur(backImgData,20,15);
                _ctx.clearRect(0, 0, img.width, img.height);
                _ctx.putImageData(gaussImgData, 0, 0);
                // smartcrop
                smartCrop.crop(_canvas, {width: win_w, height: win_h}).then((res)=>{
                    let crop = res.topCrop;
                    ctx.drawImage(_canvas, crop.x, crop.y, crop.width, crop.height, 0, 0, win_w, win_h);
                    ctx.fillStyle = 'hsla(0, 0%, 0%, 0.6)';
                    ctx.fillRect(0, 0, win_w, win_h);
                    let bg = this.bg;
                    let img = new Image();
                    img.onload = ()=>{
                        bg.backImgs[bg.backImgState+1] = img.src;
                        bg.backImgState++;
                    };
                    img.src = canvas.toDataURL();
                });

            };
            img.src = this.disc.img;
        },

        darkBack: function () {
            this.bg.hlight = !this.bg.hlight;
        },

        changeView: function () {
            this.curView = (this.curView==='disc')?'lyric':'disc';
        },

        beforeLeave: function () {
            this.state.discChanging = true;
        },

        afterLeave: function () {
            this.state.discChanging = false;
        },

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
    background: hsla(0,0%,100%,0.1);
    z-index: -99;
    transition: 0.5s;
    opacity: 0;

}
.hlight {
    opacity: 1;
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
.back {

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