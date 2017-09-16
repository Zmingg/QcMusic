<template>
    <div class="main">
        <div class="playall">
            <span class="iconfont icon-play"></span>
            播放全部
        </div>
        <ul class="list" @click="play">
            <li v-for="(audio,index) in audios" :data-aid="audio.aid" :data-index="index">
                <div class="left" :class="{ current: audio.aid===curAid }">
                    <span class="play-index">{{index}}</span>
                    <!--<span class="play-state"></span>-->
                    <div class="info">
                        <div>
                            <span class="title">{{audio.title}}</span>
                            <span class="icon-q icon-sq"></span>
                        </div>
                        <a class="txt">{{audio.singer}} - {{audio.disc.title}}</a>
                    </div>
                </div>
                    <!--<div class="iconfont icon-mv need-active url" data-url="/mv/692053"></div>-->
                    <!--<div class="download iconfont icon-download need-active"></div>-->
            </li>
        </ul>

    </div>
</template>
<script>
    import 'babel-polyfill';
import { mapActions } from 'vuex';
export default{
    props: [
        'audios',
    ],

    data(){
        return {
            curAid: 0,
        }
    },

    created(){
        this.curAid = this.$store.state.currentAudio.aid;
    },

    mounted(){
        this.player = document.querySelector('audio');
    },
    
    methods: {
        ...mapActions([
            'loadAudio'
        ]),
        play: async function (e) {
            if(e.target.tagName==='LI'){
                let aid = parseInt(e.target.dataset.aid);
                if(this.curAid!==aid) {
                    this.player.load();
                    await this.loadAudio(aid);
                    this.player.src = this.$store.state.currentAudio.src;
                    this.player.load();
                    this.player.play();
                }else{
                    this.player.play();
                }
                let index = parseInt(e.target.dataset.index);
                this.$router.push({ path: '/player', query: {index:index}})
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
    align-items: center;
    pointer-events: none;
}
.current {
    color: #ee0000;
}
.play-index {
    width: 1.5rem;
    color: #777777;
}
.info {
    width: 90%;
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