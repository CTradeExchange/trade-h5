<template>
    <div class='filter-block'>
        <van-checkbox
            v-model='checked'
            icon-size='16px'
            shape='round'
            @change='changeState'
        >
            {{ $t('assets.hideAsset') }}
        </van-checkbox>
        <van-search
            v-model='searchText'
            :placeholder='$t("assets.searchAsset")'
            @clear='clear'
            @update:model-value='search'
        />
    </div>
</template>

<script setup>
import { defineProps, ref, defineEmits, defineExpose, watch } from 'vue'
import { localGet, debounce, localSet, isEmpty } from '@/utils/util'
const emit = defineEmits(['changeState', 'searchAsset'])
const props = defineProps({
    hideAsset: Boolean,
    searchText: String
})

const checked = ref(JSON.parse(localGet('hideAsset')))

const searchText = ref(props.searchText || '')

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

watch(() => props.hideAsset, newVal => {
    checked.value = newVal
})

</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.filter-block {
    display: flex;
    justify-content: space-between;
    height: rem(100px);
    padding: 0 rem(30px);
    background: var(--contentColor);
    border-radius: 4px 4px 0 0;
    border-bottom: solid 1px var(--lineColor);
    :deep(.van-checkbox) {
        .van-checkbox__label {
            margin-top: 3px;
        }
        .van-icon-success {
            line-height: 0.9;
        }
    }
    :deep(.van-search) {
        width: rem(340px);
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
