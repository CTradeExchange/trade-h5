<template>
    <div class='filter-block'>
        <van-checkbox
            v-model='checked'
            icon-size='16px'
            shape='round'
            @change='changeState'
        >
            隐藏0资产
        </van-checkbox>
        <van-search
            v-model='searchText'
            input-align='center'
            placeholder='搜索资产'
            @clear='clear'
            @update:model-value='search'
        />
    </div>
</template>

<script setup>
import { defineProps, ref, defineEmits } from 'vue'
import { localGet, debounce, localSet, isEmpty } from '@/utils/util'
const emit = defineEmits(['changeState', 'searchAsset'])
defineProps({
    data: Object,
    index: Number
})
const checked = ref(JSON.parse(localGet('hideAsset')))
const searchText = ref('')
console.log('checked====', checked)

if (isEmpty(localGet('hideAsset'))) {
    localSet('hideAsset', false)
}

// 点击隐藏0资产
const changeState = val => {
    localSet('hideAsset', val)
    emit('changeState', val)
}

// 搜索资产
const search = debounce(val => {
    emit('searchAsset', val)
}, 800)

const clear = () => {
    searchText.value = ''
    emit('searchAsset', '')
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.filter-block {
    display: flex;
    justify-content: space-between;
    padding: 0 rem(30px);
    background: var(--contentColor);
    border-bottom: solid 1px var(--lineColor);
    :deep(.van-checkbox) {
        //flex: 1;
        width: 60%;
        .van-checkbox__label {
            margin-top: 3px;
        }
    }
    :deep(.van-search) {
        flex: 1;
        margin: rem(20px) 0;
        padding: rem(10px) 0;
        //border: solid 1px var(--lineColor);
        .van-cell {
            padding-right: rem(20px);
            border: solid 1px var(--lineColor);
            border-radius: rem(10px);
        }
    }
    :deep(.van-search__content) {
        background-color: var(--contentColor);
    }
}
</style>
