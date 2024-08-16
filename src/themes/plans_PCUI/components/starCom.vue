<template>
    <div class='star-box'>
        <img
            v-for='(obj, i) in list'
            :key='i'
            class='star-img'
            :src='obj ? starPrimaryIcon : starGrayIcon'
            :style='imgStyle'
        />
    </div>
</template>

<script>
import starGrayIcon from '@planspc/images/home/star-gray.png'
import starPrimaryIcon from '@planspc/images/home/star-primary.png'
import { reactive, computed, toRefs } from 'vue'
export default {
    props: {
        number: {
            type: Number,
            default: 0
        },
        imgStyle: {
            type: Object,
            default: () => {}
        }
    },

    setup (props) {
        const state = reactive({
            starGrayIcon,
            starPrimaryIcon
        })

        const list = computed(() => {
            let res = [0, 0, 0]
            if (props.number === 0) {
                res = [0, 0, 0]
            } else if (props.number === 1) {
                res = [1, 0, 0]
            } else if (props.number === 2) {
                res = [1, 1, 0]
            } else if (props.number >= 3) {
                res = [1, 1, 1]
            }
            return res
        })

        return {
            list,
            ...toRefs(state)
        }
    }
}
</script>

<style lang="scss" scoped>
.star-box {
    display: flex;
    margin: 0 rem(-2.5px);
    .star-img {
        margin: 0 rem(2.5px);
        width: 19px;
        height: 19px;
    }
}
</style>
