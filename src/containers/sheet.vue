<template>
    <div>
        <div class="album_header">
            <div class="pic">
                <img :src="info.img"/>
            </div>
            <div class="info"  @click="show">
                <div class="title">{{info.title}}</div>
                <div class="tags">{{info.tags}}</div>
                <div class="count">{{info.count}} 次播放</div>
            </div>
        </div>
        <List :data="items"></List>
    </div>


</template>
<script>
import { apiSheet } from '../api/qiniu';
import List from '../components/songlist.vue'
import img from '../assets/images/disc/album.png';
export default  {

    data(){
        return {
            info: {
                title:'古风歌集 - 大爱古风',
                img: img,
                tags: ['华语','古风','影视'],
                count: 20177,
            },
            items:[],
        }
    },

    components: {
        List
    },

    mounted(){
        this.getSheet();
    },
    
    methods: {
        getSheet: async function () {
            let res = await apiSheet();
            if(res.ok){
                this.items = res.data;
            }
        },

        show: function () {
            console.log(this.items)
        }
    }


}
</script>
<style scoped>
    img {
        width: 100%;
    }
    .album_header {
        width: 100%;
        height: 160px;
        background: #eee;
        display: flex;
        justify-content: space-around;
        align-items: center;
        overflow: hidden;
    }
    .pic {
        flex-basis: 30%;
        font-size: 0;
        /*padding: 30px;*/
    }
    .info {
        flex-basis: 60%;
    }
    .title {
        font-size: 20px;
        margin-bottom: 10px;
    }
    .tags {
        font-size: 13px;
        margin-bottom: 3px;
    }
    .count {
        font-size: 13px;
    }
</style>