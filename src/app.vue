<template>
    <div :data-dpr="dpr">
        <header :class="{hidden:isHidden}">
            <span class="logo"><router-link to="/">QcPlayer</router-link></span>
            <ul class="nav">
                <li><router-link to="/cates">歌单</router-link></li>
                <li><router-link to="/search">搜索</router-link></li>
            </ul>
        </header>

        <router-view></router-view>

        <Player></Player>

    </div>
</template>
<script>
import Player from './components/player.vue';
export default {
    components: {
        Player
    },
    data(){
        return {
            dpr: window.devicePixelRatio,
        }
    },

    computed: {
        isHidden: function(){
            let route = this.$route.name;
            if(route==='home'||route==='cates'){

            } else {
                return true;
            }
        }
    },

}

</script>
<style lang="scss" scoped>
* {
    text-decoration: none;
    list-style-type: none;
    color: #000;
    font-size: 15px;
}

header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    background: #ffffff;
}

.logo {
    width: 100px;
    text-align: center;
}

.nav {
    height: 50px;
    line-height: 50px;
    flex: 1;
    display: flex;
    justify-content: flex-end;
}
.nav li {
    margin-right: 1rem;
}

.hidden {
    display: none;
}

</style>