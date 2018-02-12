<template>
    <svg viewBox="0 0 80 80" >
        <line :class="{paused:!isPlay}" x1="10" y1="80" x2="10" y2="0" :style="{stroke: color}"></line>
        <line :class="{paused:!isPlay}" x1="40" y1="80" x2="40" y2="0" :style="{stroke: color}" ></line>
        <line :class="{paused:!isPlay}" x1="70" y1="80" x2="70" y2="0" :style="{stroke: color}" ></line>
    </svg>
</template>

<script>
export default {

    props: [
       'color'
    ],

    computed: {
        isPlay: function () {
            return this.$store.state.player.isPlay;
        }
    },

}
</script>

<style scoped>
    @keyframes lineMove {
        0%{
            stroke-dasharray: 20, 80;
        }
        50%{
            stroke-dasharray: 80, 80;
        }
        100%{
            stroke-dasharray: 20, 80;
        }
    }

    .paused {
        animation-play-state: paused;
        -webkit-animation-play-state: paused;
    }

    line {
        fill: none;
        stroke: rgb(255, 255, 255);
        stroke-width: 20;
        stroke-dashoffset: 0;
        animation: lineMove 1s linear infinite;
    }

    line:nth-child(1) {
        stroke-dasharray: 50, 80;
        animation-delay: 0.5s;
    }
    line:nth-child(2) {
        stroke-dasharray: 30, 80;
        animation-delay: 0.7s;
    }
    line:nth-child(3) {
        stroke-dasharray: 65, 80;
        animation-delay: 0.9s;
    }
</style>