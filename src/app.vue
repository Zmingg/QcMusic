<template>
    <div :data-dpr="dpr">
        <ul class="nav" :class="{hidden:isHidden,transparent:isTrans}">
            <li><router-link to="/">QcPlayer</router-link></li>
            <li><router-link to="/cates">分类</router-link></li>
            <li><router-link to="/singers">歌手</router-link></li>
            <li><router-link to="/rank">排行</router-link></li>
            <li><router-link to="/search">搜索</router-link></li>
        </ul>

        <div>
            <router-view></router-view>
        </div>

        <audio class="player" src=""></audio>
    </div>

</template>
<script>
export default {
    data(){
        return {
            dpr: window.devicePixelRatio,
        }
    },

    computed: {
        isHidden: function(){
            return (this.$route.path==='/player'||'/');
        },
        isTrans: function(){
            return (this.$route.path==='/search');
        }

    },

    mounted(){
//        if(this.$route.path==='/sheet'){
//            this.isTrans = true;
//        }
    }

}

</script>
<style lang="scss" scoped>
* {
    text-decoration: none;
    list-style-type: none;
    color: #000;
    font-size: 15px;
}

.nav {
    height: 2.4rem;
    line-height: 2.4rem;
    display: flex;
    justify-content: flex-end;
}
.nav li {
    margin-right: 1rem;
}

.transparent {
    position: absolute;
    top: 0;
    right: 0;
    background: transparent;
}

.hidden {
    display: none;
}
</style>