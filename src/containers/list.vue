<template>
    <div>

        <div ref="head">
            <canvas class="bg" ref="bg"></canvas>
            <div class="navbar">
                <div class="back">返回</div>
                <div class="nav-title">歌单</div>
                <div class="play-state">state</div>
            </div>

            <div class="album-header">
                <div class="pic">
                    <img :src="img"/>
                </div>
                <div class="info">
                    <div class="title">{{title}}</div>
                    <div class="tags">{{tags}}</div>
                    <div class="count">{{count}} 次播放</div>
                </div>
            </div>
        </div>


        <List :audios="audios"></List>


    </div>


</template>
<script>
import List from '../components/songlist.vue'
import img_album from '../assets/images/disc/album.png';
import { mapActions } from 'vuex';
export default  {

    data(){
        return {
            lid: 1,
            title:'',
            img: '',
            tags: '',
            count: 0,
            audios: [],
            curAid: 0,
        }
    },

    components: {
        List
    },

    created(){
        let list = this.$store.state.currentList;
        if(list.lid===0){
            this.lid = 1;
        }
        if(this.lid!==list.lid){
            this.getList();
        } else {
            this.refresh();
        }

    },

    mounted(){
        this.drawBackImg();
    },
    
    methods: {
        ...mapActions([
            'loadList'
        ]),

        getList: async function () {
            await this.loadList(this.lid);
            this.refresh();

        },

        refresh: function () {
            let list = this.$store.state.currentList;
            this.audios = list.audios;
            this.title = list.title;
            this.tags = list.tags;
            this.count = list.count;
            let img = new Image();
            img.onload = ()=>{
                this.img = list.img;
                this.drawBackImg();
            };
            img.src = list.img;
        },
        
        drawBackImg: function () {
            let canvas = this.$refs.bg;
            let width = this.$refs.head.clientWidth;
            let height = this.$refs.head.clientHeight;
            canvas.width = width;
            canvas.height = height;
            canvas.style.width = width+'px';
            canvas.style.height = height+'px';
            let ctx = canvas.getContext('2d');
            let img = new Image();
            img.onload = ()=>{
                if(img.width>width){

                }else{
                    let img_y = (width-img.height)/2;
                    let img_h = height/width*img.width;
                    ctx.drawImage(img,0,img_y,img.width,img_h,0,0,width,height);
                }
            };
            img.src = img_album;


        }
    }


}
</script>
<style scoped>
    img {
        width: 100%;
    }
    .bg {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        z-index: -99;
        -webkit-filter: blur(10px);
        -ms-filter: blur(10px);
        filter: blur(10px);
    }
    .navbar {
        position: absolute;
        top: 0;
        width: 100%;
        height: 2.4rem;
        color: #fff;
        font-weight: lighter;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .back {
        margin-left: 0.6rem;
        text-align: left;
    }
    .nav-title {

    }
    .play-state {
        margin-right: 0.6rem;
        text-align: right;
    }
    .album-header {
        padding-top: 2.4rem;
        width: 100%;
        height: 10rem;
        background: hsla(0,0%,30%,0.5);
        display: flex;
        align-items: center;
        overflow: hidden;
    }
    .pic {
        width: 35%;
        height: 8rem;
        margin: 0 5%;
        font-size: 0;
        display: flex;
        align-items: center;
        overflow: hidden;
    }
    .info {
        width: 55%;
        color: #fff;
        font-weight: lighter;
        display: flex;
        flex-direction: column;
    }
    .title {
        font-size: 1.2rem;
        margin-bottom: 1.2rem;
    }
    .tags {
        font-size: 0.8rem;
        margin-bottom: 3px;
    }
    .count {
        font-size: 0.8rem;
        align-self: stretch;
    }
</style>