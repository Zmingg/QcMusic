<template>
    <div :data-dpr="dpr">
        <ul class="nav" :class="{hidden:isHidden}">
            <li><router-link to="/">QcPlayer</router-link></li>
            <li><router-link to="/cates">歌单</router-link></li>
            <!--<li><router-link to="/singers">歌手</router-link></li>-->
            <!--<li><router-link to="/rank">排行</router-link></li>-->
            <!--<li><router-link to="/search">搜索</router-link></li>-->
        </ul>

        <div>
            <router-view></router-view>
        </div>

        <audio class="player" :src="this.$store.state.currentAudio.src"></audio>
    </div>

</template>
<script>
import { mapActions } from 'vuex';
export default {
    data(){
        return {
            dpr: window.devicePixelRatio,
        }
    },

    computed: {
        isHidden: function(){
            let route = this.$route.name
            if(route==='player'||route==='list'){
                return true;
            }
        }
    },

    mounted(){
        this.player = document.querySelector('audio');

        this.player.addEventListener('ended',this.endEvent);

    },

    methods: {

        ...mapActions([
            'autoMode'
        ]),

        endEvent: function () {
            this.autoMode().then(()=>{
                this.player.src = this.$store.state.currentAudio.src;
                this.player.load();
                this.player.play();
            });

        }
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
    height: 50px;
    line-height: 50px;
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