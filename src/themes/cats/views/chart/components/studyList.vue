<template>
    <div class='list-wrap'>
        <van-nav-bar
            left-arrow
            title='添加指标'
            @click-left='onClickLeft'
        />
        <van-cell-group class='content'>
            <van-cell v-for='item in list' :key='item.label' :title='item.label' @click='onAdd(item)' />
        </van-cell-group>
    </div>
</template>

<script>
import { MAINSTUDIES, SUBSTUDIES } from '@/components/tradingview/datafeeds/userConfig/config.js'
import { computed } from 'vue'

export default {
    props: {
        type: {
            type: String,
            default: ''
        }
    },
    setup (props, context) {
        // 头部返回
        const onClickLeft = () => {
            context.emit('back')
        }
        // 添加指标
        const onAdd = value => {
            context.emit('addStudy', {
                type: props.type,
                value
            })
            onClickLeft()
        }

        const list = computed(() => {
            const obj = {
                'main': MAINSTUDIES,
                'sub': SUBSTUDIES,
            }
            return obj[props.type]
        })

        return {
            onClickLeft,
            onAdd,
            list
        }
    }
}
</script>

<style lang="scss" scoped>
@import '~@/sass/mixin.scss';
.list-wrap {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    .content {
        flex: 1;
        overflow-y: auto;
    }
}

</style>
