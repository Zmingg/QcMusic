<template>
    <div>
        <div class="top">
            <div class="search">
                <form class="search-form" action="/" method="GET">
                    <span class="search-icon"></span>
                    <input class="search-input" type="search" title="search"
                           v-model="curKey" placeholder="歌曲 / 歌手 / 专辑" />
                    <span class="clear-icon" @click="clear" v-show="curKey!==''"></span>
                </form>
            </div>
            <div class="cancel" @click="cancle">{{(!isSearching)?'返回':'取消'}}</div>
        </div>
        <div class="hot" v-show="isSearching || result.length===0" @click="searchHot">
            <span class="hot-key" v-for="key in hotKeys" :data-key="key">{{ key }}</span>
        </div>
        <ul class="history" v-show="isSearching || result.length===0"  @click="searchHistory">
            <li v-if="historyKeys.length===0">
                暂无搜索记录
            </li>
            <li v-for="key in historyKeys" :data-key="key">
                {{ key }}
            </li>
        </ul>
        <ul class="result" v-show="!isSearching">
            <li v-for="item in result">
                <div class="item" v-if="item.type==='disc'" @click="click">
                    <img class="item-img" :src="item.img+'/thumbnail'" />
                    <div class="item-detail">
                        <span class="item-title">{{ item.title }}</span>
                        <span class="item-info">
                            {{ item.singer && item.singer.name }} - {{ secToDate(item.release_time) }}
                        </span>
                    </div>
                </div>
                <div class="item" v-else-if="item.type==='singer'" @click="click">
                    <img class="item-img" :src="singerImg(item)" />
                    <div class="item-detail">
                        <span class="item-title">{{ item.name }}</span>
                        <span class="item-info">
                            专辑数：{{ item.discs_count }}张 &nbsp&nbsp&nbsp&nbsp  歌曲数：{{ item.audios_count }}首
                        </span>
                    </div>
                </div>
                <div class="item" v-else-if="item.type==='audio'" @click="click(item)">
                    <PlayState class="play-state"
                               :color="'red'"
                               v-if="isPlay && curAid === item.aid">
                    </PlayState>
                    <div class="item-detail">
                        <span class="item-title" :class="{on:(isPlay&&curAid===item.aid)}">
                            {{ item.title }}
                        </span>
                        <span class="item-info">
                            {{ item.singer }} - {{ item.disc && item.disc.title }}
                        </span>
                    </div>
                </div>
            </li>
        </ul>
    </div>

</template>
<script>
import { apiHotKey,apiSearch } from '../api/qiniu';
import { mapState,mapActions } from 'vuex';
import PlayState from '../components/playstate.vue';
import defaultImg from '../assets/images/default_thumb.png';
export default {
    components: {
        PlayState
    },
    data(){
        return {
            curKey: '',
            hotKeys: [],
            historyKeys: [],
            result: [],
            isSearching: false
        }
    },
    computed: {
        ...mapState({
            isPlay: state => state.player.isPlay,
            curAid: state => state.current.audio.aid
        }),
    },
    mounted(){
        this.hot();
        let form = document.querySelector('.search-form');
        form.onsubmit = (e) => {
            e.preventDefault();
            this.search();
            document.activeElement.blur();
            form.blur();
        };
        let input = document.querySelector('.search-input');
        input.onfocus = () => {
            this.isSearching = true;
        };
    },
    methods: {
        ...mapActions({
            loadAudio: 'current/LOAD_AUDIO'
        }),
        hot: async function () {
            let res = await apiHotKey();
            if (res.ok) {
                this.hotKeys = res.data;
            }
        },
        search: async function () {
            if (this.curKey === '') {
                this.isSearching = false;
                return;
            }
            let res = await apiSearch(this.curKey);
            if (res.ok) {
                this.result = res.data;
                this.isSearching = false;
            }
            this.pushHistory(this.curKey);
        },
        searchHot: function (e) {
            if (e.target.tagName === 'SPAN') {
                this.curKey = e.target.dataset.key;
                this.search();
            }
        },
        searchHistory: function (e) {
            if (e.target.tagName === 'LI' && e.target.dataset.key) {
                this.curKey = e.target.dataset.key;
                this.search();
            }
        },
        pushHistory: function (curkey) {
            let keys = this.historyKeys;
            let his = {};
            for (let i = 0; i < keys.length; i++) {
                his[keys[i]] = i;
            }
            if (typeof his[curkey] === 'number') {
                keys.splice(his[curkey],1);
            }
            keys.unshift(curkey);
        },
        secToDate: function (sec) {
            return new Date(sec*1000).toLocaleDateString();
        },
        singerImg: function (item) {
            return item.img
                ? item.img + '/thumbnail'
                : defaultImg;
        },
        cancle: function () {
            if (!this.isSearching) {
                this.$router.go(-1);
            } else {
                this.isSearching = false;
            }
        },
        clear: function () {
            this.curKey = '';
            let input = document.querySelector('.search-input');
            input.focus();
        },
        click: function (item) {
            if (item.type === 'audio' && this.curAid !== item.aid) {
                this.$root.$emit('load');
                this.loadAudio(item.aid);
            }
        }
    }
}
</script>
<style scoped>
* {
    -webkit-tap-highlight-color: transparent;
}
li {
    display: block;
}
.top {
    width: 100%;
    height: 30px;
    margin: 10px 0;
    font-size: 15px;
}
.cancel {
    float: left;
    width: 50px;
    height: 30px;
    line-height: 32px;
    margin-left: -50px;
    color: #626262;
    font-size: 16px;
    text-align: center;
}
.search {
    float: left;
    width: 100%;
    height: 100%;
}
.search-form {
    height: 28px;
    margin-left: 10px;
    margin-right: 50px;
    border: solid 1px #9b9b9b;
    border-radius: 15px;
    display: flex;
    align-items: center;
}
.search-icon {
    margin-left: 10px;
    width: 20px;
    height: 20px;
    background: url(../assets/images/control.png) no-repeat -150px -30px;
    background-size: 250px 250px;
}
.clear-icon {
    margin-right: 10px;
    width: 20px;
    height: 20px;
    background: url(../assets/images/control.png) no-repeat -170px -30px;
    background-size: 250px 250px;
}
.search-input {
    border: none;
    flex: 1;
    height: 100%;
    padding: 0 10px;
    background: transparent;
    font-size: inherit;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    outline: 0;
    -webkit-appearance: textfield;
}
.search-input::-webkit-search-cancel-button{
    display: none;
}
.search-input::-webkit-input-placeholder {
    line-height: normal;
    color: #939393;
}
input[type="search"]:focus{
    line-height: normal;
}
.hot {
    overflow: hidden;
    font-size: 16px;
}
.hot-key {
    color: #333;
    font-size: 14px;
    padding: 0 4px;
    height: 36px;
    line-height: 36px;
    float: left;
    margin: 10px 0 0 10px;
    border: 1px solid #C5E8FA;
    background-color: #EEF9FF;
}
.hot-key:nth-child(even) {
    border: 1px solid #F9E3B3;
    background-color: #FFF6E7;
}
.history {
    margin: 20px 10px;
    font-size: 16px;
    color: #636363;
    border-top: solid 1px #696969;
}
.history li {
    padding: 0 10px;
    height: 40px;
    line-height: 40px;
    border-bottom: solid 1px #696969;
}
.result {
    margin: 10px;
    font-size: 16px;
}
.item {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 55px;
    padding: 3px 0;
    border-bottom: solid 1px #cccccc;
}
.item-img {
    width: 50px;
    height: 50px;
}
.item-detail {
    padding-left: 15px;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
}
.item-title {
    display: block;
    font-size: 1.1em;
    color: #3a3a3a;
}
.on {
    color: #ff151d;
}
.item-info {
    display: block;
    font-size: 0.7em;
    color: #888888;
}
.play-state {
    width: 22px;
    height: 22px;
    margin-left: 10px;
}


</style>