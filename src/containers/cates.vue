<template>
    <div>
        <ul class="lists" @click="goList">
            <li v-for="list in lists" :data-lid="list.lid">
                <img :src="list.img" />
                <a>{{ list.title }}</a>
            </li>
        </ul>
    </div>

</template>
<script>
import 'babel-polyfill';
import { mapActions } from 'vuex';
export default {
    data(){
        return {
            lists: [],
        }
    },
    
    mounted(){
        this.getLists();
    },
    
    methods: {
        ...mapActions([
            'loadLists'
        ]),

        getLists: async function () {
            this.lists = await this.loadLists();
        },

        goList: function (e) {
            if(e.target.tagName==='LI'){
                let lid = e.target.dataset.lid;
                this.$router.push({ name: 'list', params: {lid:lid}})
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
.lists {
    width: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;

    li {
        flex: 0;
        flex-basis: 50%;
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

    li:nth-child(2n+1) {
        padding-right: 5px;
    }

    li:nth-child(2n) {
        padding-left: 5px;
    }


}
</style>