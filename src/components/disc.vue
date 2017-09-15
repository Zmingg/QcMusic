<template>
    <div class="main">
        <canvas ref="disc"></canvas>
    </div>
</template>
<script>
//import img_disc from '../assets/images/disc/disc.png';
import img_hlight from '../assets/images/disc/hlight.png';
//import img_light from '../assets/images/disc/light.png';
import img_album from '../assets/images/disc/album.png';
export default {
    data(){
        return {
            radius: 0,
        }
    },

    props: ['isPlay'],

    mounted(){
        this.dpr = window.devicePixelRatio;
        this.init();


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
        }
    },

    methods: {
        init: function(){
            let dpr = this.dpr;
            let disc = this.$refs.disc;
            disc.width = this.$el.clientWidth*0.9*dpr;
            disc.height = this.$el.clientWidth*0.9*dpr;
            disc.style.width = this.$el.clientWidth*0.9+'px';
            disc.style.height = this.$el.clientWidth*0.9+'px';
            disc.style.marginLeft = this.$el.clientWidth*0.05+'px';
            disc.style.marginTop = this.$el.clientHeight*0.05+'px';
            this.R = this.$el.clientWidth*0.45*dpr;
            this.radius = this.$el.clientWidth*0.395*dpr;
            this.ctx = disc.getContext("2d");

            this.drawLines();
            this.linesImg = disc.toDataURL('image/png');

            this.drawBaseDisc();

            this.img_lines = new Image();
            this.img_lines.src = this.linesImg;
            this.img_lines.onload = ()=>{
                this.ctx.drawImage(this.img_lines,0,0,disc.width,disc.width);
            };
            this.img_hlight = new Image();
            this.img_hlight.onload = this.drawHlight;
            this.img_hlight.src = img_hlight;
            this.img_album = new Image();
            this.img_album.onload = ()=>{
                this.drawAlbumBack();
                this.drawAlbumIco();
            };
            this.img_album.src = img_album;

        },
        drawDisc: function () {
            let width = this.$refs.disc.width;
            let ctx = this.ctx;
            this.drawBaseDisc();
            ctx.drawImage(this.img_lines,0,0,width,width);
            this.drawHlight();
            this.drawAlbumBack();
            this.drawAlbumIco();

        },
        drawBaseDisc: function () {
            let ctx = this.ctx;
            let dpr = this.dpr;
            let r = this.radius;
            let R = this.R;
            ctx.save();
            ctx.beginPath();
            ctx.fillStyle = 'hsla(0,0%,60%,0.25)';
            ctx.shadowBlur=5*dpr;
            ctx.shadowColor="black";
            ctx.arc(R,R,r+15*dpr,0,2*Math.PI);
            ctx.fill();
            ctx.beginPath();
            ctx.fillStyle = '#000';

            ctx.arc(R,R,r,0,2*Math.PI);
            ctx.fill();
            ctx.restore();
        },
        drawHlight: function () {
            let width = this.$refs.disc.width;
            this.ctx.drawImage(this.img_hlight,0,0,width,width);
        },
        drawAlbumBack: function () {
            let ctx = this.ctx;
            let R = this.R;
            let r = this.radius;
            ctx.beginPath();
            ctx.fillStyle = '#000';
            ctx.arc(R,R,r*0.7,0,2*Math.PI);
            ctx.fill();
        },
        drawAlbumIco: function () {
            let ctx = this.ctx;
            let R = this.R;
            let r = this.radius*0.68;
            ctx.save();
            ctx.beginPath();
            ctx.arc(R,R,r,0,2*Math.PI);
            ctx.clip();
            ctx.drawImage(this.img_album, R-r, R-r, r*2, r*2);
            ctx.restore();
        },

        drawLight: function () {
            let width = this.$refs.disc.width;
            this.ctx.drawImage(this.img_light,0,0,width,width);
        },

        drawLines: function () {
            let dpr = this.dpr;
            let r = this.radius;
            let ctx = this.ctx;
//            ctx.lineCap="round";
            ctx.lineJoin="round";
            ctx.strokeStyle = 'hsla(0,0%,30%,0.15)';
            this.drawLine(r+5*dpr,10);
            ctx.strokeStyle = 'hsla(0,0%,10%,0.1)';
            for(let _r=r*0.7;_r<r;_r+=5*dpr){
                this.drawLine(_r,6);
            }

        },
        drawLine: function (r,line) {
            let ctx = this.ctx;
            let dpr = this.dpr;
            let R = this.R;
            line = line*dpr;
            let _sAngle = Math.PI/180*100*Math.random();
            for(let sAngle=_sAngle;sAngle<(2*Math.PI+_sAngle-0.5);){
                let radian = Math.PI/180*80*(Math.random()*0.8+0.2);
                if (radian>=(2*Math.PI+_sAngle)-sAngle){
                    radian = (2*Math.PI+_sAngle)-sAngle;
                }
                ctx.beginPath();
                ctx.lineWidth = line*(Math.random()*0.8+0.2);
                ctx.shadowBlur=6*dpr;
                ctx.shadowColor='hsla(0,0%,20%,0.2)';
                ctx.arc(R,R,r,sAngle,sAngle+radian);
                ctx.stroke();
                sAngle = sAngle+radian+Math.PI/180*5*(Math.random()*0.8+0.2);
            }

        },

        rotateStart: function () {
            let width = this.$refs.disc.width;
            let R = this.R;

            this.rotate = setInterval(()=>{
                this.ctx.clearRect(0,0,width,width);
                this.ctx.translate(R,R);
                this.ctx.rotate(Math.PI/180*0.5);
                this.ctx.translate(-R,-R);
                this.drawDisc();
            },30);

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
    width: 100%;
}


</style>