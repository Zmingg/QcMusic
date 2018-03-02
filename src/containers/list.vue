<template>
    <div>
        <div ref="head" class="head">
            <img class="bg" ref="bg" :src="bg"/>
            <div class="navbar">
                <div class="button" @click="back">返回</div>
                <div class="nav-title">歌 单</div>
                <div class="button" @click="goPlayer">
                    <PlayState class="play-state"></PlayState>
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

        <List class="list" :isCur="isCur" :audios="list.audios" :playList="play"></List>

    </div>


</template>
<script>
import List from '../components/songlist.vue';
import PlayState from '../components/playstate.vue';
import { domain } from '../api/qiniu';
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
            return (this.list.img && domain + this.list.img+'/headbg');
        },
        thumb: function () {
            return (this.list.img && domain + this.list.img+'/thumb?v=' + this.$store.state.version);
        }
    },

    mounted(){
        this.isCur = (this.list.lid === this.$store.state.current.list.lid);
    },

    beforeRouteEnter (to, from, next) {
        next(async vm =>
            vm.list = await vm.loadList(~~to.params.lid)
        );
    },

    methods: {

        ...mapActions({
            playList: 'current/PLAY_LIST',
            loadList: 'current/LOAD_LIST',
        }),

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
    .head {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        height: 200px;
    }
    .bg {
        position: absolute;
        width: 100%;
        height: 100%;
        z-index: -99;
    }
    .navbar {
        position: absolute;
        width: 100%;
        height: 50px;
        color: #fff;
        font-weight: lighter;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .button {
        width: 50px;
        height: 50px;
        line-height: 50px;
        text-align: center;
    }

    .nav-title {
        flex: 1;
        text-align: center;
    }

    .play-state {
        margin: 15px 0;
        width: 20px;
        height: 20px;
    }

    .album-header {
        padding-top: 50px;
        width: 100%;
        height: 150px;
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
    .list {
        margin-top: 200px;
    }
</style>