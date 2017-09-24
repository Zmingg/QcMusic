<template>
    <div style="height: 100%;">
    <div class="main">
        <canvas ref="disc"></canvas>
    </div>
    </div>
</template>
<script>
import img_hlight from '../assets/images/disc/hlight.png';
export default {
    data(){
        return {
            radius: 0,
        }
    },

    props: ['isPlay','img'],

    mounted(){
        this.init();
        this.img_album = new Image();
        this.img_album.onload = ()=>{
            this.clipAlbumIco();
        };
        this.img_album.src = this.img;
    },

    destroyed(){
        this.rotatePause();
    },

    watch: {
        isPlay: function () {
            if(this.isPlay){
                this.rotateStart();
            }else{
                this.rotatePause();
            }
        },
        img: function(){
            this.img_album = new Image();
            this.img_album.onload = ()=>{
                this.clipAlbumIco();
            };
            this.img_album.src = this.img;
        }
    },

    methods: {
        init: function(){
            this.dpr = window.devicePixelRatio;
            let dpr = this.dpr;
            let disc = this.$refs.disc;
            disc.width = this.$el.clientWidth*0.9*dpr;
            disc.height = this.$el.clientWidth*0.9*dpr;
            disc.style.width = this.$el.clientWidth*0.9+'px';
            disc.style.height = this.$el.clientWidth*0.9+'px';
            this.R = this.$el.clientWidth*0.45*dpr;
            this.radius = 0.85*this.R;
            this.ctx = disc.getContext("2d");

            this.drawBaseDisc();
            this.drawDisc();

        },
        drawDisc: function () {
            let ctx = this.ctx;
            let R = this.R;
            let r = this.radius*0.68;
            ctx.drawImage(this.baseDisc, 0, 0, R*2, R*2);
            if(this.clipedAlbum){
                ctx.drawImage(this.clipedAlbum, R-r, R-r, r*2, r*2);
            }

        },
        drawBaseDisc: function () {
            let r = this.radius;
            let R = this.R;
            let can = document.createElement('canvas');
            can.width = 2*R;
            can.height = 2*R;
            let ctx = can.getContext('2d');
            ctx.save();
            ctx.beginPath();
            ctx.fillStyle = 'hsla(0,0%,100%,0.2)';
            ctx.shadowBlur=0.05*R;
            ctx.shadowColor="black";
            ctx.arc(R,R,r+0.08*R,0,2*Math.PI);
            ctx.fill();
            ctx.beginPath();
            ctx.fillStyle = '#000';
            ctx.arc(R,R,r,0,2*Math.PI);
            ctx.fill();
            ctx.restore();
            this.drawLines(ctx);
            this.drawHlight(ctx);
            this.baseDisc = can;
        },
        drawHlight: function (ctx) {
            let r = this.radius;
            let R = this.R;
            this.img_hlight = new Image();
            this.img_hlight.onload = ()=>{
                ctx.drawImage(this.img_hlight,R-r,R-r,2*r,2*r);
                this.drawAlbumBack(ctx);
            };
            this.img_hlight.src = img_hlight;
        },
        drawAlbumBack: function (ctx) {
            let R = this.R;
            let r = this.radius;
            ctx.beginPath();
            ctx.fillStyle = '#000';
            ctx.arc(R,R,r*0.7,0,2*Math.PI);
            ctx.fill();
        },
        clipAlbumIco: function () {
            let r = this.radius*0.68;
            let album = document.createElement('canvas');
            album.width = 2*r;
            album.height = 2*r;
            let ctx_al = album.getContext('2d');
            ctx_al.arc(r,r,r,0,2*Math.PI);
            ctx_al.clip();
            ctx_al.drawImage(this.img_album, 0, 0, r*2, r*2);
            this.clipedAlbum = album;
        },
        drawAlbumIco: function () {
            let ctx = this.ctx;
            let R = this.R;
            let r = this.radius*0.68;
            ctx.drawImage(this.clipedAlbum, R-r, R-r, r*2, r*2);
        },

        drawLines: function (ctx) {
            let dpr = this.dpr;
            let r = this.radius;
            ctx.lineJoin="round";
            ctx.strokeStyle = 'hsla(0,0%,40%,0.1)';
            this.drawLine(ctx,r+5*dpr,10);
            ctx.strokeStyle = 'hsla(0,0%,20%,0.1)';
            for(let _r=r*0.7;_r<r;_r+=5*dpr){
                this.drawLine(ctx,_r,4);
            }

        },
        drawLine: function (ctx,r,line) {
            let dpr = this.dpr;
            let R = this.R;
            line = line*dpr;
            let _sAngle = Math.PI/180*100*Math.random();
            for(let sAngle=_sAngle;sAngle<(2*Math.PI+_sAngle);){
                let radian = Math.PI/180*80*(Math.random()*0.8+0.2);
                if (radian>=(2*Math.PI+_sAngle)-sAngle){
                    radian = (2*Math.PI+_sAngle)-sAngle;
                }
                ctx.beginPath();
                ctx.lineWidth = line*(Math.random()*0.3+0.7);
                ctx.shadowBlur=6*dpr;
                ctx.shadowColor='hsla(0,0%,20%,0.2)';
                ctx.arc(R,R,r,sAngle,sAngle+radian);
                ctx.stroke();
                sAngle = sAngle+radian; //+Math.PI/180*5*(Math.random()*0.8+0.2)
            }

        },

        rotateStart: function () {
            let width = this.$refs.disc.width;
            let R = this.R;
            this.rotate = setInterval(()=>{
                this.ctx.clearRect(0,0,width,width);
                this.ctx.translate(R,R);
                this.ctx.rotate(Math.PI/180*0.3);
                this.ctx.translate(-R,-R);
                this.drawDisc();
            },25);
        },

        rotatePause: function () {
            clearInterval(this.rotate);
        }
    }
}

</script>
<style scoped>
* {
    -webkit-touch-callout: none;
}
.main {
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}


</style>