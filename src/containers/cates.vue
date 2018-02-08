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
        <section>
            <div class="title">
                热门单曲
            </div>
            <ul class="hot-audios">
                <li v-for="audio in hotAudios" :data-aid="audio.aid">
                    <div class="audio-title">{{ audio.title }}</div>
                    <div class="audio-meta">{{ audio.singer }} - {{ audio.disc }}</div>
                </li>
            </ul>
        </section>
    </main>
</template>
<script>
import 'babel-polyfill';
import { apiLists, apiHotAudios } from '../api/qiniu';
import { mapActions } from 'vuex';
export default {
    data(){
        return {
            lists: [],
            hotAudios: [],
        }
    },

    
    mounted(){
        this.getLists();
        this.getHotAudios();
    },
    
    methods: {

        getLists: async function () {
            let res = await apiLists();
            if(res.ok){
                this.lists = res.data;
            }
        },

        goList: function (e) {
            if(e.target.tagName==='LI'){
                let lid = e.target.dataset.lid;
                this.$router.push({ name: 'list', params: {lid:lid}})
            }

        },

        getHotAudios: async function () {
            let res = await apiHotAudios();
            if(res.ok){
                this.hotAudios = res.data;
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
    left: 0;
    top: 10px;
    height: 20px;
    width: 3px;
    background-color: #ff3c2d;
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
    border-bottom: solid 1px #e3e3e3;
}
.audio-title {
    position: relative;
    top: 5px;
    height: 20px;
    font-size: 15px;
}
.audio-meta {
    position: relative;
    top: 5px;
    height: 20px;
    font-size: 10px;
    color: #6e6e6e;
}
</style>