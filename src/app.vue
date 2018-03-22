<template>
    <div :data-dpr="dpr">
        <header :class="{hidden:isHidden}">
            <span class="logo"><router-link to="/">清尘音乐</router-link></span>
            <ul class="nav">
                <li><router-link to="/">推荐</router-link></li>
                <li><router-link to="/cates">歌单</router-link></li>
                <li><router-link to="/search">搜索</router-link></li>
            </ul>
        </header>

        <router-view></router-view>

        <footer :class="{hidden:isHidden}">
            <span>清尘音乐 天籁无垠</span>
            <span class="copyright">仅供学习 非商业用途</span>
        </footer>

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
    background: #f32642;
    z-index: 999;
}

header a {
    color: #ffffff;
}

.logo {
    width: 100px;
    text-align: center;
    font-style: italic;
    font-weight: bold;
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
footer {
    margin-top: 10px;
    margin-bottom: 10px;
}
footer span{
    display: block;
    text-align: center;
    font-size: 0.8rem;
    font-weight: lighter;
    color: #c3c3c3;
}
.copyright {
    font-size: 0.4rem;
}
</style>