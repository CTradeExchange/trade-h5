<template>
    <div class='loginTypeBar'>
        <van-tabs v-model:active='type'>
            <van-tab name='password' title='密码' />
            <van-tab name='checkCode' title='验证码' />
        </van-tabs>
    </div>
</template>

<script>
import { computed } from 'vue'
export default {
    props: ['modelValue'],
    emits: ['update:modelValue'],
    setup (props, { emit }) {
        const type = computed({
            get: () => {
                return props.loginType
            },
            set: (val) => {
                emit('update:modelValue', val)
            }
        })

        return {
            type,
        }
    }
}
</script>

<style lang="scss" scoped>
.loginTypeBar{
    :deep(.van-tabs__nav){
        .van-tab {
            flex: none;
            margin: 0 10px;
        }
        --van-tabs-bottom-bar-color: var(--primary)
    }
}
</style>
