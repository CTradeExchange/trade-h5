<template>
    <div class='form-item'>
        <van-field
            v-model='googleCode'
            :formatter='formatter'
            label=''
            maxlength='6'
            placeholder='请输入谷歌验证码'
            type='text'
            @input='handleInput'
        />
        <span class='paste' @click='handlePaste'>
            粘贴
        </span>
    </div>
</template>

<script setup>
import { ref, watch, unref, computed, defineEmits } from 'vue'
const emit = defineEmits(['onGetGooleVerifyCode'])
const googleCode = ref('')
const handlePaste = async (e) => {
    try {
        const text = await navigator.clipboard.readText()
        googleCode.value = text.substr(0, 6)
        emit('getGooleVerifyCode', googleCode.value)
    } catch (err) {
        console.error('Failed to copy!', err)
    }
}

const handleInput = () => {
    emit('getGooleVerifyCode', googleCode.value)
}
function formatter (value) {
    // 过滤输入的非数字
    return value.replace(/[^\d]/g, '')
}
</script>

<style lang="scss">
@import '@/sass/mixin.scss';
.form-item {
    position: relative;
    //padding: 0 rem(30px);
    margin-bottom: rem(20px);
    background: var(--contentColor);
    .van-cell{
        padding-left: 0;
        padding-right: 0;
        input{
            padding: 0 5px;
        }
    }
    .title{
        color: var(--normalColor);
        padding: rem(20px) rem(30px);
    }
    .paste{
        position: absolute;
        top: rem(25px);
        right: rem(20px);
        z-index: 99;
        cursor: pointer;
        &::before {
            font-size: rem(30px);
        }
        color: var(--primary);
    }
}
</style>
