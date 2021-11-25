<template>
    <div class='page-wrap'>
        <layoutTop />
        <!-- 认证成功 -->
        <div class='main'>
            <div v-show='reacShow' class='success'>
                <i class='icon_success'></i>
                <p>验证成功</p>
            </div>

            <canvas v-show='resultCanvasShow' id='mainCanvas'></canvas>
            <div v-show='reacShow' class='rect' :style='classObj'></div>
            <div id='mainMask' class='mask' style='display: none;'></div>
        </div>
        <!-- 认证失败 -->
        <div v-if='videoShow' class='video'>
            <p class='notice'>
                {{ $t('common.faceDetectTip') }}
            </p>
            <video
                autoplay
                playsinline
            >
            </video>
            <div class='mask'></div>
        </div>
        <div v-if='videoShow' class='btns'>
            <van-button type='primary' @click='openCamera'>
                开始认证
            </van-button>
            <van-button type='primary' @click='takeSnapshot'>
                提交验证
            </van-button>
        </div>
        <div v-else class='btns'>
            <van-button type='primary' @click='$router.back()'>
                确定
            </van-button>
        </div>
    </div>
</template>

<script>
import { computed, reactive, toRefs, ref, unref, watch, onUnmounted, onMounted } from 'vue'
import { faceDetect } from '@/api/user'
import axios from 'axios'
import qs from 'qs'
import { localSet } from '@/utils/util'
import { Toast } from 'vant'
const constraints = {
    audio: false,
    video: true
}

export default {
    setup (props) {
        const state = reactive({
            faceDetectSuccess: false,
            classObj: {},
            reacShow: false,
            resultCanvasShow: false,
            videoShow: true
        })
        let video
        const gotStream = (stream) => {
            window.stream = stream // 拿到stream实例存一下
            video.srcObject = stream
        }
        let mCanvas

        const openCamera = (e) => {
            navigator.mediaDevices.getUserMedia(constraints).then(gotStream).catch(onError)
        }

        const takeSnapshot = (e) => {
            state.resultCanvasShow = true
            mCanvas = window.canvas = document.querySelector('#mainCanvas')
            mCanvas.width = 480
            mCanvas.height = 360
            mCanvas.width = video.videoWidth
            mCanvas.height = video.videoHeight
            mCanvas.getContext('2d').drawImage(video, 0, 0, mCanvas.width, mCanvas.height)

            // 新增1张
            var divItem = document.createElement('div')
            divItem.style.display = 'block'
            divItem.width = 100
            divItem.height = divItem.width * video.videoHeight / video.videoWidth // 计算一下比例
            divItem.style.width = divItem.width + 'px'
            divItem.style.height = divItem.height + 'px'
            console.log('div item size: ', divItem.width, divItem.height)

            var c1 = document.createElement('canvas')
            c1.width = 1000
            c1.height = 1000
            c1.getContext('2d').drawImage(video, 0, 0, mCanvas.width, mCanvas.height, 0, 0, c1.width, c1.height)
            console.log('video', video)
            divItem.appendChild(c1)
            // 隐藏video
            state.videoShow = false
            c1.toBlob(function (blobObj) {
                uploadImg(blobObj)
                console.log('blob', blobObj) // blobObj就是blob对象（类文件）
            })
            document.getElementById('mainMask').style.display = 'block'
        }

        const uploadImg = (base64) => {
            const formData = new FormData()
            formData.append('api_key', 'c4wGaiW6hAbnAwSta2WdNm3v1fbdn6Lc')
            formData.append('api_secret', 'JFmsAxsey_NN_1IU7DbuzS_3O4AUcgxu')
            formData.append('image_file', base64)

            const url = 'https://120.79.87.9:7443/facepp/v3/detect'
            axios.post(url, formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then(res => {
                console.log('res', res)
                if (res.data.face_num === 1) {
                    localSet('faceDetectSuccess', true)
                    state.faceDetectSuccess = true
                    debugger
                    const rectangle = res.data.faces[0].face_rectangle
                    const widthrate = document.body.clientWidth / 1000
                    const heightRate = mCanvas.clientHeight / 1000
                    debugger
                    let style = ''
                    for (const key in rectangle) {
                        if (rectangle.hasOwnProperty(key)) {
                            if (key !== 'top') {
                                const val = rectangle[key] * widthrate + 'px'
                                style += key + ':' + val + ';'
                            } else {
                                const val = rectangle[key] * heightRate + 50 + 'px'
                                style += key + ':' + val + ';'
                            }
                        }
                    }
                    state.reacShow = true
                    state.classObj = style
                } else {
                    Toast('验证失败，请重新提交')
                }
            }).catch(error => {
                alert('失败' + error)
            })
        }

        const onError = (error) => {
            console.log('navigator.MediaDevices.getUserMedia error: ', error.message, error.name)
        }

        watch(() => state.faceDetectSuccess, newVal => {
            if (newVal) {
                // takeSnapshot()
            }
        })

        onMounted(() => {
            video = document.querySelector('video')
        })

        return {
            openCamera,
            takeSnapshot,
            ...toRefs(state)
        }
    }

}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.page-wrap{
    padding-top: rem(100px);
    .notice{
        text-align: center;
        color: var(--contentColor);
        font-size: rem(28px);
        position: relative;
        top: rem(40px);
        z-index: 100;
    }
    .video{
        position: relative;
        height: 510px;
        width: 100%;
        .mask{
            position: absolute;
            transform: translate3d(0, 0,10px);
            background-image: url('../../../public/images/face-wrapper.png');
            background-repeat: no-repeat;
            background-position: center center;
            background-size: cover;
            height: 500px;
            top: 0;
            width: 100%;

        }
        video{
            height: 480px;
            background: rgb(255, 255, 255,0.5);
            max-width: 100%;
        }
    }

    .btns{
        display: flex;
        padding: 0 rem(30px);
        margin-top: rem(30px);
        justify-content: space-evenly;
        .van-button{
            flex: 1;
            background: none;
            color: var(--primary);
            border: solid 1px var(--primary);
            &:first-child{
                margin-right: rem(20px);
            }
        }
    }
    .main{
        width: 100%;
        position: relative;
        text-align: center;
       font-size: 18px;
       padding: 0 rem(30px);
       .success{
           padding: rem(60px) 0;
           .icon_success{
               font-size: 40px;
               color: var(--success)
           }
       }
        canvas{
            width: 100%;
            border-radius: 10px;
        }
        .rect{
            position: absolute;
            border:solid 4px var(--success)
        }
    }
}
</style>
