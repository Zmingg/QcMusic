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
                <ul class="lyric" ref="lyric">
                    <li>{{ message }}</li><li v-for="item in lyric">
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
import gauss from '../lib/gaussBlur';
export default {
    data(){
        return {
            dpr: window.devicePixelRatio,
            lyric: [],
        }
    },

    computed: {
        message: function () {
            return (this.lyric.length===0)?'无歌词':'';
        }
    },

    props: ['lyricUrl','backImg','isChanging','darkBack'],

    mounted(){
        this.init();
    },

    destroyed(){
        this.player.removeEventListener('timeupdate',this.syncLrc);
        this.player.removeEventListener('seeked',this.seekLrc);
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
        lyricUrl:function () {
            if(this.lyricUrl!==''){
                getLyric(this.lyricUrl,(res)=>{
                    this.lyric = res;
                });
            } else {
                this.lyric = [];
            }

        },

//        backImg: function () {
//            let img = new Image();
//            img.crossOrigin = "anonymous";
//            img.onload = ()=>{
//                this.clipShadow(img);
//            };
//            img.src = this.backImg;
//        },

        isChanging: function () {
            this.$refs.lyric_bg.style.display =  this.isChanging?'none':'';
        }
    },

    methods: {
        init: function () {
            this.player = document.querySelector('audio');
            if(this.lyricUrl!==''){
                getLyric(this.lyricUrl,(res)=>{
                    this.lyric = res;
                });
            }

//            if(this.backImg!==''){
//                let img = new Image();
//                img.crossOrigin = "anonymous";
//                img.onload = ()=>{
//                    this.clipShadow(img);
//                };
//                img.src = this.backImg;
//            }

            this.player.addEventListener('timeupdate',this.syncLrc);
            this.player.addEventListener('seeked',this.seekLrc);
        },

        clipShadow: function (img) {

            let top = Math.ceil(this.$el.clientHeight*0.1)+50;
            let width = Math.ceil(this.$refs.lyric_box.clientWidth);
            let height = Math.ceil(this.$refs.lyric_box.clientHeight)+1;
            let canvas = document.createElement('canvas');
            let ctx = canvas.getContext('2d');
            canvas.width = width;
            canvas.height = height;
            let full = document.createElement('canvas');
            full.width = window.screen.width;
            full.height = window.screen.height;
            let _ctx = full.getContext('2d');
            _ctx.drawImage(img,0,0,window.screen.width,window.screen.height);
            _ctx.fillStyle = "hsla(0,0%,0%,0.7)";
            _ctx.fillRect(0,0,window.screen.width,window.screen.height);

            ctx.globalAlpha = 1;
            for(let i = 0; i<10; i++){
                ctx.drawImage(full,0,top+i*5,width,5,0,i*5,width,5);
                ctx.globalAlpha = ctx.globalAlpha-0.1;
            }
            ctx.globalAlpha = 1;
            for(let i = 0; i<10; i++){
                ctx.drawImage(full,0,height+top-(i+1)*5,width,5,0,height-(i+1)*5,width,5);
                ctx.globalAlpha = ctx.globalAlpha-0.1;
            }


            this.$refs.lyric_bg.src = canvas.toDataURL();


        },

        syncLrc: function () {
            if(this.lyric.length===0) return;

            let lyric = this.lyric;
            let id = 0;
            for(let i=0;i<lyric.length;i++){
                if(this.player.currentTime > lyric[i][0]){
                    id++;
                }
            }

            if(id===0) return;
            let ref_lrc = this.$refs.lyric;
            let li_h = 2.5;
            ref_lrc.childNodes[id-1].className = '';
            ref_lrc.childNodes[id].className = 'on';
            ref_lrc.style.transform = 'translateY('+(-id*li_h)+'rem)';
        },

        seekLrc: function () {
            if(this.lyric.length===0) return;

            let ref_lrc = this.$refs.lyric;
            for(let i = 1; i < ref_lrc.length; i++){
                ref_lrc.childNodes[i].className = '';
            }
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