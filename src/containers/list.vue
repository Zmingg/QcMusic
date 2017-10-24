<template>
    <div>

        <div ref="head">
            <img class="bg" ref="bg" :src="bg"/>
            <div class="navbar">
                <div class="back" @click="back">返回</div>
                <div class="nav-title">歌单</div>
                <div class="play-state" @click="goPlayer">
                    <PlayState></PlayState>
                </div>

            </div>

            <div class="album-header">
                <div class="pic">
                    <img :src="thumb"/>
                </div>
                <div class="info">
                    <div class="title">{{ list.title }}</div>
                    <div class="tags">{{ list.tags }}</div>
                    <div class="count">{{ list.count }} 次播放</div>
                </div>
            </div>
        </div>


        <List :isCur="isCur" :audios="list.audios" :playList="play"></List>


    </div>


</template>
<script>
import List from '../components/songlist.vue';
import PlayState from '../components/playstate.vue';
import { mapState,mapMutations,mapActions } from 'vuex';
export default  {
    components: {
        List,PlayState
    },

    data(){
        return {
            list: {},
            isCur: false,
        }
    },

    computed: {
        ...mapState({
            isPlay: state => state.player.isPlay,
        }),
        bg: function () {
            return (this.list.img && this.list.img+'/headbg');
        },
        thumb: function () {
            return (this.list.img && this.list.img+'/thumb?v=' + this.$store.state.version);
        }
    },

    mounted(){
        this.getList();
        this.isCur = (this.list.lid === this.$store.state.current.list.lid);
    },

    
    methods: {

        ...mapActions({
            playList: 'current/PLAY_LIST',
            loadList: 'current/LOAD_LIST',
        }),

        getList: async function () {
            if(!this.$route.params.lid){
                this.list = this.$store.state.history.lists[0];
            } else {
                this.list.lid = ~~this.$route.params.lid;
                this.list = await this.loadList(this.list.lid);
            }

        },

        play: function () {
            this.playList(this.list);
        },

        goPlayer: function () {
            this.$router.push({ name: 'audio' })
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
    }
    .bg {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: calc(10rem + 50px);;
        z-index: -99;
    }
    .navbar {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        height: 50px;
        padding: 0 20px;
        color: #fff;
        font-weight: lighter;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .play-state {
        width: 1.2em;
        height: 1.2em;
    }

    .album-header {
        padding-top: 50px;
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