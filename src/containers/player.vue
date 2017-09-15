<template>
    <div class="main">
        <div class="bg_img">
            <!--<img src="../assets/images/album.jpg"/>-->
        </div>
        <div class="bg_shadow"></div>
        <div class="header">
            <div class="back" @click="back">返回</div>
            <div class="info">
                <span class="title">{{title}}</span>
                <span class="singer">{{singer}} - {{disc}}</span>
            </div>
            <div class="share"></div>
        </div>
        <div class="show">
            <Disc :isPlay="isPlay"></Disc>
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
                <span class="prev" @touchend="next"></span>
                <span class="play" :hidden="isPlay" @click="play"></span>
                <span class="pause" :hidden="!isPlay" @click="pause"></span>
                <span class="next" @click="next"></span>
            </div>
        </div>
    </div>
</template>
<script>
import Disc from '../components/disc.vue';
import { apiAudio } from '../api/qiniu';
import { mapActions } from 'vuex';
export default {
    components: {
        Disc,
    },

    data(){
        return {
            aid: 0,
            title: '',
            singer: '',
            disc: '',
            url:'',
            isPlay: false,
            requireLoad: false,
            curTime: 0,
            fullTime: 0,
            progress: 0,
            index:0,
            total:0,
        }
    },

    computed: {
        playRate: function () {
            return this.fullTime===0?0:this.curTime/this.fullTime;

        },
        progressRate:function () {
            return this.fullTime===0?0:this.progress/this.fullTime;
        },
        curTimeStr: function () {
            return this.secondsToString(this.curTime);
        },
        fullTimeStr: function () {
            return this.secondsToString(this.fullTime);
        },
    },

    created(){
        this.refresh();
        let sheet = this.$store.state.sheet;
        this.index = this.$route.query.index;
        this.total = sheet.items.length;

    },

    mounted(){
        this.init();
    },

    methods: {
        ...mapActions([
            'loadAudio'
        ]),
        init: function () {
            this.player = document.querySelector('.player');
            this.isPlay = !this.player.paused||false;
            this.fullTime = this.player.duration||0;

            this.player.ondurationchange = ()=>{
                this.fullTime = this.player.duration;
                this.getProgress();
            };
            this.player.onprogress=()=>{
                this.getProgress();

            };
            this.player.ontimeupdate = ()=>{
                if(!this.timeRating){
                    this.curTime = this.player.currentTime;
                }
            };

        },

        refresh: function () {
            let currentAudio = this.$store.state.currentAudio;
            this.aid = currentAudio.aid;
            this.title = currentAudio.title;
            this.singer = currentAudio.singer;
            this.disc = currentAudio.disc;
            this.url = currentAudio.url;
        },

        load: async function (aid) {
            let res = await apiAudio(aid);
            if(res.ok){
                let audioData = res.data;
                this.$store.dispatch('loadAudio',{
                    aid: audioData.id,
                    title: audioData.title,
                    singer: audioData.singer,
                    disc: audioData.disc,
                    url: audioData.url,
                });
                this.aid = audioData.aid;
                this.title = audioData.title;
                this.singer = audioData.singer;
                this.disc = audioData.disc;
                this.url = audioData.url;
                return audioData.url;
            }
        },

        next: async function () {
            this.reset();
            if(this.index===this.total-1){
                this.index = 0;
            }else{
                this.index++;
            }
            let sheet = this.$store.state.sheet;
            let aid = sheet.items[this.index].id;
            this.player.src  = await this.load(aid);
            this.player.load();
            if(this.isPlay){
                this.player.play();
            }
        },

        prev: async function () {
            this.reset();
            if(this.index===0){
                this.index = this.total-1;
            }else{
                this.index--;
            }
            let sheet = this.$store.state.sheet;
            let aid = sheet.items[this.index].id;
            this.player.src  = await this.load(aid);
            this.player.load();
            if(this.isPlay){
                this.player.play();
            }
        },

        play: function () {
            this.player.play();
            this.isPlay = true;
        },
        pause: function () {
            this.player.pause();
            this.isPlay = false;
        },
        reset: function () {
            this.player.pause();
            this.player.currentTime = 0;
            this.curTime = 0;
            this.fullTime = 0;
            this.progress = 0;
        },
        getProgress: function () {
            let timeRanges = this.player.buffered;
            if(timeRanges.length<1){
                return;
            }
            this.progress = timeRanges.end(0); // audio一般没有分段缓冲,只需计算第一段
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
            this.player.currentTime = (e.clientX-e.target.offsetLeft)/e.target.offsetWidth*this.fullTime;
        },
        timeSlider: function(e){
            e.preventDefault();
            this.timeRating = true;
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
                this.curTime = this.fullTime*(durX/max);
            };
            let finishMove = (e)=>{
                e.preventDefault();
                this.timeRating = false;
                this.player.currentTime = this.curTime;
                this.$el.removeEventListener('mousemove',moveHandle);
                this.$el.removeEventListener('mouseup',finishMove);
            };
            this.$el.addEventListener('mousemove',moveHandle,false);
            this.$el.addEventListener('mouseup',finishMove,false);
        },
        timeSliderTouch: function(e){
            e.preventDefault();
            e.stopPropagation();
            this.timeRating = true;
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
                this.curTime = this.fullTime*(cur/max);
            };
            let finishMove = (e)=>{
                e.preventDefault();
                e.stopPropagation();
                this.player.currentTime = this.curTime;

                this.timeRating = false;
                this.$el.removeEventListener('touchmove',moveHandle);
                this.$el.removeEventListener('touchend',finishMove);
            };
            this.$el.addEventListener('touchmove',moveHandle,false);
            this.$el.addEventListener('touchend',finishMove,false);
        },

        back: function () {
            this.$router.go(-1);
        }
    }



}

</script>
<style scoped>
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
.bg_img {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: -100;
}
.bg_shadow {
    position: absolute;
    width: 100%;
    height: 100%;
    background: rgba(8, 7, 7, 0.65);
    z-index: -99;
}
.header {
    /*width: 100%;*/
    padding: 0 10px;
    height: 50px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 0.1px solid #a5a5a5;
    color: #eeeeee;
    font-weight: lighter;
}
.back {
    width: 50px;
}
.share {
    width: 50px;
}
.info {
    display: flex;
    flex-direction: column;
    align-items: center;
}
.title {
    font-size: 1em;
}
.singer {
    font-size: 0.5em;
}
.controls {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 98px;
}
.control_time {
    height: 18px;
    margin: 0 15px;
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
    width: 100%;
    height: 2px;
    background: rgba(60,60,60,0.9);
    pointer-events: none;
}
.time_bar_cur {
    position: absolute;
    top: 8px;
    left: 0;
    width: 50%;
    height: 2px;
    background: #ee0000;
    pointer-events: none;
}
.time_bar_ball {
    position: absolute;
    left: 50%;
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
    margin: 0 auto;
}

</style>