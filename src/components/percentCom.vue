<template>
    <div ref='divRef' class='percent-line' @click.stop='click1' @touchmove='touchmove'>
        <span v-for='i in 5' :key='i' @click.stop='onClick(i-1)'></span>

        <div
            ref='circleRef'
            class='circle'
            :style='circleStyle'
            @touchend='isMousedown=false'
            @touchstart='touchstart'
        ></div>
    </div>
</template>

<script>

export default {
    data () {
        return {
            isMousedown: false,
            circleStyle: {},
            isMobile: false
        }
    },
    mounted () {
        this.isMobile = this._isMobile()
        if (this.isMobile) {
            console.log('Mobile')
        } else {
            console.log('PC')
        }
    },

    methods: {
        _isMobile () {
            const flag = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone|)/i)
            return flag
        },
        touchmove (e) {
            const { changedTouches } = e
            const pageX = changedTouches[0]?.pageX

            const left = this.$refs.divRef.offsetLeft

            const w = this.$refs.divRef.offsetWidth
            // console.log(w)
            const targetX = (pageX - left) < 0 ? 0 : (pageX - left) > w ? w : pageX - left
            // console.log(this.isMousedown)
            if (!this.isMousedown) return
            this.circleStyle = {
                transform: `translateX(${targetX}px)`
            }
            this.$emit('change', targetX / w)
        },
        onClick (i) {
            const itemW = this.$refs.divRef.offsetWidth / 4
            const targetX = itemW * i

            this.circleStyle = {
                transform: `translateX(${targetX}px)`
            }
            this.$emit('change', targetX / this.$refs.divRef.offsetWidth)
        },
        touchstart (e) {
            this.isMousedown = true
        },
        click1 (e) {
            const pageX = e.pageX

            const left = this.$refs.divRef.offsetLeft

            const w = this.$refs.divRef.offsetWidth
            const itemW = this.$refs.divRef.offsetWidth / 4
            // console.log(w)
            let targetX = (pageX - left) < 0 ? 0 : (pageX - left) > w ? w : pageX - left
            const percent = targetX / w
            if (percent > 0.125 && percent < 0.25) {
                targetX = itemW
            } else if (percent > 0.375 && percent < 0.5) {
                targetX = itemW * 2
            } else if (percent > 0.625 && percent < 0.75) {
                targetX = itemW * 3
            } else if (percent > 0.875 && percent < 1) {
                targetX = itemW * 4
            }
            this.circleStyle = {
                transform: `translateX(${targetX}px)`
            }
            this.$emit('change', targetX / w)
        }

    }

}
</script>

<style lang="scss" scoped>

.percent-line{
    position: relative;
    width: 100%;
    height: 10px;
    background: blue;
    &>span{
        position: absolute;
        top:-5px;
        background:#fff;
        border:1px solid #999;
        height: 20px;
        width: 20px;
        border-radius: 50%;
        transform: translateX(-50%);
        cursor: pointer;
        &:nth-of-type(1){
           left:0;

        }
        &:nth-of-type(2){
            left:25%

        }
        &:nth-of-type(3){

            left:50%

        }
        &:nth-of-type(4){
            left:75%

        }
        &:nth-of-type(5){
            left:100%

        }
    }
    .circle{
        position: absolute;
        left:-10px;
        top:-5px;
        background: red;
        height: 20px;
        width: 20px;
        border-radius: 50%;
        cursor: pointer;
        transition: all linear 0.1s;
    }

}
</style>
