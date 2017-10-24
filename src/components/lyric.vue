<template>
    <div style="
    position: absolute;
    top: 0;
    bottom:0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;">
        <div class="main">
            <div class="lyric-box" ref="lyric_box">
                <div class="lyric-bg">
                    <img src="" ref="lyric_bg">
                </div>
                <ul class="lyric" ref="lyric" :style="{ transform:transform }">
                    <li>{{ message }}</li><li v-for="(item,index) in lyric" :class="{ on:(index===curId) }">
                        {{ item[1] }}
                    </li>
                </ul>
            </div>

        </div>
    </div>
</template>
<script>
import Vue from 'vue';
import getLyric from '../lib/lyric';
import { mapState } from 'vuex';
export default {
    data(){
        return {
            dpr: window.devicePixelRatio,
            lyric: [],
            curId: 0,
        }
    },

    computed: {
        ...mapState({
            curTime: state => state.player.curTime,
        }),
        message: function () {
            return (this.lyric.length===0)?'无歌词':'';
        },
        transform: function () {
            return 'translateY('+ (-this.curId * 2.5) + 'rem)';
        },
    },

    props: ['lyricUrl','backImg','darkBack'],

    mounted(){
        this.getLyricData();
    },

    activated: function () {
        this.darkBack();
        this.syncLrc();
        this.$refs.lyric_bg.style.opacity = 1;
    },

    deactivated: function () {
        this.$refs.lyric_bg.style.opacity = 0;
        this.darkBack();
    },

    watch: {
        lyricUrl: function () {
            this.getLyricData();
        },

        curTime: function () {
            this.syncLrc();
        },

    },

    methods: {

        getLyricData: function () {
            if(this.lyricUrl!==''){
                getLyric(this.lyricUrl,(res)=>{
                    this.lyric = res;
                });
            }
        },

        syncLrc: function () {
            let lyric = this.lyric;
            if(lyric.length===0) return;
            let id = 0;
            for(let i=0;i<lyric.length;i++){
                if(this.curTime > lyric[i][0]){
                    id++;
                } else {
                    break;
                }
            }
            this.curId = id-1;
        },

    }

}
</script>
<style lang="scss" scoped>
.main {
    height: 80%;
    width: 100%;
}

.lyric-box {
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;
}

.lyric-bg {
    width: 100%;
    height:100%;
    position: absolute;
    z-index: 1;

    img {
        transition: 0.3s;
    }

}


.lyric {
    position: absolute;
    top: 45%;
    left: 0;
    right: 0;
    bottom: 0;
    color: #999999;
    transition: 1s;
    li {
        height: 2.5rem;
        font-size: 1rem;
        line-height: 2.5rem;
        text-align: center;
    }

    .on {
        color: #ffffff;
    }

}


</style>