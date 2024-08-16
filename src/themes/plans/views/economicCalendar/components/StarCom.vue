<template>
    <div class='star-box'>
        <img
            v-for='(obj, i) in list'
            :key='i'
            class='star-img'
            :src='obj ? starPrimaryIcon : starGrayIcon'
        />
    </div>
</template>

<script>
import starGrayIcon from '@plans/images/star-gray.png'
import starPrimaryIcon from '@plans/images/star-primary.png'
import { reactive, computed, toRefs } from 'vue'
export default {
    props: {
        item: {
            type: Object,
            default: () => {
                return {}
            }
        },
        number: {
            type: Number,
            default: 0
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
    margin: 0 rem(-5px);
    .star-img {
        margin: 0 rem(5px);
        width: rem(24px);
        height: rem(23px);
    }
}
</style>
