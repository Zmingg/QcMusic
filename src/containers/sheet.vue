<template>
    <div>
        <div class="album_header">
            <div class="pic">
                <img :src="img"/>
            </div>
            <div class="info">
                <div class="title">{{title}}</div>
                <div class="tags">{{tags}}</div>
                <div class="count">{{count}} 次播放</div>
            </div>
        </div>

        <List :audios="audios"></List>


    </div>


</template>
<script>
import List from '../components/songlist.vue'
import img from '../assets/images/disc/album.png';
import { mapActions } from 'vuex';
export default  {

    data(){
        return {
            lid: 1,
            title:'',
            img: img,
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
        if(this.lid!==list.lid){
            this.getList();
        } else {
            this.refresh();
        }

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
        },

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