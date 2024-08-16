<template>
    <div class='image' :style="{ '--mode': mode }">
        <div v-if='loading' class='loadingDiv'>
            <van-loading type='spinner' />
        </div>
        <div v-if='error' class='errorDiv'>
            <img :src='errorImg' />
        </div>

        <img
            v-else
            ref='imgRef'
            class='img'
            :src='src'
            @error='handleError'
            @load='handleLoad'
        />
    </div>
</template>

<script>
import { onMounted, reactive, toRefs, ref, watch } from 'vue'
import errorImg from './assets/errorImg.png'
import defaultImg from './assets/defaultImg.png'
export default {
    props: {
        src: {
            type: String,
            default: ''
        },
        mode: {
            type: String,
            default: 'cover'
        },
        errorImg: {
            type: String,
            default: errorImg
        }
    },
    setup (props) {
        const imgRef = ref(null)
        const state = reactive({
            // errorImg,
            defaultImg,
            error: false,
            loading: true,
            url: ''
        })
        const handleError = (e) => {
            console.log({ e })
            state.error = true
            state.loading = false
        }

        const handleLoad = () => {
            state.loading = false
            state.error = false
        }

        // watch(() => props.src, (url) => {
        //     state.url = url
        //     console.log({ url })
        // }, { immediate: true })

        return {
            imgRef,
            handleLoad,
            handleError,
            ...toRefs(state)
        }
    }
}
</script>

<style scoped lang="scss">
.image {
    .loadingDiv {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        background: var(--colorddd);
    }
    .errorDiv {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        background: var(--colorddd);
        & > img {
            width: 30%;
            max-width: rem(100px);
        }
    }
    & > .img {
        width: 100%;
        height: 100%;
        object-fit: var(--mode);
    }
}
</style>
