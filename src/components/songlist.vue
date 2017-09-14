<template>
    <div class="main">
        <div class="playall">
            <span class="iconfont icon-play"></span>
            播放全部
        </div>
        <ul class="list" @click="play">
            <li v-for="song in data" class="song_item" :data-aid="song.id" >
                <div class="left">
                    <span class="icon-play-state"></span>
                    <div class="info">
                        <div>
                            <span class="title">{{song.title}}</span>
                            <span class="icon-q icon-sq"></span>
                        </div>
                        <span class="txt">{{song.singer}} - {{song.disc}}</span>
                    </div>
                </div>
                    <!--<div class="iconfont icon-mv need-active url" data-url="/mv/692053"></div>-->
                    <!--<div class="download iconfont icon-download need-active"></div>-->
            </li>
        </ul>

    </div>
</template>
<script>
export default{
    props: [
        'data',
    ],
    
    methods: {
        play: function (e) {
            if(e.target.tagName==='LI'){
                let audio = document.getElementsByTagName('audio')[0];
                audio.play();
                this.$router.push({ path: '/player', query: {aid:e.target.dataset.aid}})
            }
        }
    }
}
</script>
<style scoped>
a, li {
    text-decoration: none;
    list-style: none;
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
    height: 50px;
    padding-top: 5px;
    padding-bottom: 5px;
    border-bottom: 1px solid #eee;
}
.left {
    width: 80%;
    height: 100%;
    overflow: hidden;
    pointer-events: none;
}
.title {
    color: #000;
}
.txt {
    color: #000;
    font-size: 12px;
    line-height: 13px;
}
</style>