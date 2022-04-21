<template>
    <div class='applyRecord'>
        <filterBox :assets-list='assetsList' @assetChange='assetChange' @dateChange='dateChange' />
        <div class='listContainer'>
            <listVue
                ref='listRef'
                class='listVue'
                :request-api='fundApplyRecord'
                :request-params='params'
            >
                <template #default='{ list }'>
                    <div v-for='item in list' :key='item.id' class='li'>
                        <fundApplyRecordItem :data='item' />
                    </div>
                </template>
            </listVue>
        </div>
    </div>
</template>

<script setup>
import listVue from '@plans/views/record/components/list.vue'
import fundApplyRecordItem from '@plans/modules/fundApplyRecord/fundApplyRecordItem.vue'
import filterBox from './filterBox.vue'
import { fundApplyRecord } from '@/api/fund'
import { hooks } from './hooks'
import { ref, unref } from 'vue'

const params = {}
const { assetsList } = hooks()

const listRef = ref(null)
const refresh = () => {
    unref(listRef) && unref(listRef).refresh()
}

// 筛选日期
const assetChange = val => {
    params.currencyShares = val || ''
    refresh()
}
// 筛选日期
const dateChange = val => {
    const [startTime, endTime] = val || []
    params.startTime = startTime
    params.endTime = endTime
    refresh()
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.applyRecord{
    height: 100%;
    display: flex;
    flex-flow: column;
    .listContainer{
        background: var(--contentColor);
        flex: 1;
        overflow-y: auto;
    }
}
</style>
