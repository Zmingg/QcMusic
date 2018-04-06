<template>
    <main>
        <section>
            <div class="title">
                推荐歌单
            </div>
            <ul class="lists" @click="goList">
                <li v-for="list in lists" :data-lid="list.lid">
                    <img :src="list.img | url($store.state.version) "/>
                    <a>{{ list.title }}</a>
                </li>
            </ul>
        </section>
        <section>
            <div class="title">
                热门单曲
            </div>
            <ul class="hot-audios" @click="playAudio">
                <li v-for="audio in hotAudios" :data-aid="audio.aid">
                    <play-state class="play-state" :color="'#ff0000'" v-if="audio.aid===curAudio.aid"></play-state>
                    <div class="audio-meta">
                        <span class="title">{{ audio.title }}</span>
                        <span class="other">{{ audio.singer}} - {{ audio.disc }}</span>
                    </div>
                    <span class="play-icon" @click="goPlayer" v-if="audio.aid===curAudio.aid">...</span>
                </li>
            </ul>
        </section>
    </main>
</template>
<script>
    import 'babel-polyfill';
    import { domain, apiLists, apiHotAudios } from '../api/qiniu';
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

        filters: {
            url: function (value, version) {
                if (!value) return '';
                return  domain + value + '/thumbnail?v=' + version;
            }
        },

        computed: {
            ...mapState({
                isPlay: state => state.player.isPlay,
                curAudio: state => state.current.audio
            })
        },

        mounted(){
            this.getLists();
            this.getHotAudios();
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

            getHotAudios: async function () {
                let res = await apiHotAudios();
                if(res.ok){
                    this.hotAudios = res.data;
                }
            },

            playAudio: async function (e) {
                if(e.target.tagName==='LI'){
                    let aid = parseInt(e.target.dataset.aid);
                    if(this.curAudio && (this.curAudio.aid === aid)) {
                        this.isPlay || this.setPlay();
                    }else{
                        this.$root.$emit('load');
                        await this.loadAudio(aid);
                        this.playSingleAudio(this.curAudio);
                    }
                }

            },

            goPlayer: function () {
                this.$router.push({ path: 'player'});
            }



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
        height: 1.2em;
        line-height: 1.2em;
        font-size: 1rem;
    }
    .audio-meta > .other {
        display: block;
        height: 1.2rem;
        line-height: 1.2rem;
        font-size: 0.8rem;
        color: #777777;
        margin-right: -50px;
    }
    .play-state {
        margin-top: 17px;
        margin-right: 10px;
        width: 20px;
        height: 16px;
    }
</style>