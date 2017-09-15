<template>
    <div class="main">
        <div class="playall">
            <span class="iconfont icon-play"></span>
            播放全部
        </div>
        <ul class="list" @click="play">
            <li v-for="(song,index) in data" :data-aid="song.id" :data-index="index">
                <div class="left" :class="{ current: song.id===currentId }">
                    <span class="play-index">{{index}}</span>
                    <!--<span class="play-state"></span>-->
                    <div class="info">
                        <div>
                            <span class="title">{{song.title}}</span>
                            <span class="icon-q icon-sq"></span>
                        </div>
                        <a class="txt">{{song.singer}} - {{song.disc}}</a>
                    </div>
                </div>
                    <!--<div class="iconfont icon-mv need-active url" data-url="/mv/692053"></div>-->
                    <!--<div class="download iconfont icon-download need-active"></div>-->
            </li>
        </ul>

    </div>
</template>
<script>
import { apiAudio } from '../api/qiniu';
export default{
    props: [
        'data',
    ],

    data(){
        return {
            currentId: 0,
        }
    },

    created(){
        this.currentId = this.$store.state.currentAudio.aid;
    },

    mounted(){
        this.player = document.querySelector('audio');
    },
    
    methods: {
        play: async function (e) {
            if(e.target.tagName==='LI'){
                let aid = parseInt(e.target.dataset.aid);
                if(this.currentId!==(aid||0)) {
                    this.player.load();
                    this.player.src = await this.load(aid);
                    this.player.load();
                    this.player.play();
                }else{
                    this.player.play();
                }
                let index = parseInt(e.target.dataset.index);
                this.$router.push({ path: '/player', query: {index:index}})
            }
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
                return audioData.url;
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