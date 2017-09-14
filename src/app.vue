<template>
    <div>
        <ul class="nav" :class="{hidden:isHidden}">
            <li><router-link to="/">QcPlayer</router-link></li>
            <li><router-link to="/cates">分类</router-link></li>
            <li><router-link to="/singers">歌手</router-link></li>
            <li><router-link to="/rank">排行</router-link></li>
            <li><router-link to="/search">搜索</router-link></li>
        </ul>

        <div>
            <router-view></router-view>
        </div>

        <audio class="player"></audio>
    </div>

</template>
<script>
export default {
    computed: {
        isHidden: function(){
            return (this.$route.path==='/player'||'/');
        }
    },

}

</script>
<style scoped>
* {
    text-decoration: none;
    list-style-type: none;
    color: #000;
}

.nav {

    display: flex;
    justify-content: flex-end;
}
.nav li {
    margin: 10px;
}

.hidden {
    display: none;
}
</style>