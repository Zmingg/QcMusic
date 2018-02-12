<template>
    <main>
        <section>
            <div class="title">
                推荐歌单
            </div>
            <ul class="lists" @click="goList">
                <li v-for="list in lists" :data-lid="list.lid">
                    <img :src="list.img + '/thumbnail?v=' + $store.state.version" />
                    <a>{{ list.title }}</a>
                </li>
            </ul>
        </section>

    </main>
</template>
<script>
import 'babel-polyfill';
import { apiLists, apiHotAudios } from '../api/qiniu';
import { mapState, mapMutations, mapActions } from 'vuex';
import PlayState from '../components/playstate.vue';
export default {
    data(){
        return {
            lists: [],
            hotAudios: [],
        }
    },

    components: {
        PlayState
    },

    computed: {
        ...mapState({
            isPlay: state => state.player.isPlay,
            curAudio: state => state.current.audio
        })
    },
    
    mounted(){
        this.getLists();
    },
    
    methods: {
        ...mapMutations({
            setPlay: 'player/CHANGE_PLAY_STATE',
        }),
        ...mapActions({
            loadAudio: 'current/LOAD_AUDIO',
            playSingleAudio: 'current/PLAY_SINGLE_AUDIO',
        }),

        getLists: async function () {
            let res = await apiLists();
            if(res.ok){
                this.lists = res.data;

            }
        },

        goList: function (e) {
            if(e.target.tagName==='LI'){
                let lid = e.target.dataset.lid;
                this.$router.push({ path: 'list/'+lid});
            }

        },


        
        
    }
}
</script>

<style lang="scss" scoped>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    list-style-type: none;
    -webkit-tap-highlight-color: transparent;

}
main {
    margin-top: 60px;
    width: 100%;
}
section > .title {
    position: relative;
    height: 40px;
    line-height: 40px;
    font-size: 16px;
    padding-left: 15px;
}

section > .title::after {
    content: '';
    position: absolute;
    top: 10px;
    left: 0;
    height: 20px;
    width: 3px;
    background: #ff0000;
}

section > .lists {
    margin-top: 5px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;

    li {
        flex: 0;
        flex-basis: 33.33%;
        margin-bottom: 5px;
        font-size: 0;

        a {
            line-height: 1.8rem;
            font-size: 0.8rem;
            padding: 0 5px;
        }

        img {
            width: 100%;
            pointer-events: none;
            font-size: 0;
        }
    }

    li:nth-child(3n+1) {
        padding-right: 4px;
    }

    li:nth-child(3n+2) {
        padding-left: 2px;
        padding-right: 2px;
    }

    li:nth-child(3n) {
        padding-left: 4px;
    }

}
.hot-audios {
    padding-left: 15px;
    padding-right: 15px;
}
.hot-audios > li {
    height: 50px;
    width: 100%;
    line-height: 50px;
    border-bottom: solid 1px #e3e3e3;
    position: relative;
    overflow: hidden;
    white-space: nowrap;
    display: flex;
}
.play-icon {
    margin-right: 5px;
    font-size: 15px;
    font-weight: bold;
    /*pointer-events: none;*/
}

.audio-meta {
    margin-top: 5px;
    height: 40px;
    pointer-events: none;
    white-space: nowrap;
    flex: 1;
}
.audio-meta > .title {
    display: block;
    height: 20px;
    line-height: 20px;
    font-size: 15px;
}
.audio-meta > .other {
    display: block;
    height: 20px;
    line-height: 20px;
    font-size: 10px;
    color: #6e6e6e;
    margin-right: -50px;
}
.play-state {
    margin-top: 17px;
    margin-right: 10px;
    width: 20px;
    height: 16px;
}
</style>