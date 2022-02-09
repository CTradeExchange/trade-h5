<template>
    <div class='applyRecord'>
        <filterBox />
        <div class='listContainer'>
            <listVue
                ref='listRef'
                class='listVue'
                :request-api='queryPlatFormMessageLogList'
                :request-params='params'
            >
                <template #default='{ list }'>
                    <div v-for='item in list' :key='item.id' class='li'>
                        <fundApplyRecordItem />
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
import { queryPlatFormMessageLogList } from '@/api/user'
const params = {}
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
