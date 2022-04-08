<template>
    <div class='form-item'>
        <van-field
            v-model='googleCode'
            :formatter='formatter'
            label=''
            maxlength='6'
            :placeholder='$t("common.inputGoogleCode")'
            type='text'
            @input='handleInput'
        />
        <span class='paste' @click='handlePaste'>
            {{ $t('common.paste') }}
        </span>
    </div>
</template>

<script setup>
import { ref, watch, unref, computed, defineEmits } from 'vue'
import { Dialog, Toast } from 'vant'
import { useI18n } from 'vue-i18n'
const emit = defineEmits(['getGooleVerifyCode'])
const googleCode = ref('')
const { t } = useI18n({ useScope: 'global' })
const handlePaste = async (e) => {
    try {
        if (!navigator.clipboard) Toast(t('common.unSupported'))
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

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.form-item {
    position: relative;
    flex: 1;
    display: flex;
    align-items: center;
    //padding: 0 rem(30px);
    margin-bottom: rem(20px);
    background: var(--contentColor);
    :deep(.van-cell){
        padding-left: 0;
        padding-right: 0;
        input{
            //padding: 0 5px;
        }
    }
    .title{
        color: var(--normalColor);
        padding: rem(20px) rem(30px);
    }
    .paste{
        width: rem(100px);
        cursor: pointer;
        text-align: center;
        &::before {
            font-size: rem(30px);
        }
        color: var(--primary);
    }
}
</style>
