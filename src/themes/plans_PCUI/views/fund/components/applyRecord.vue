<template>
    <el-table :cell-style="{ background:'none' }" :data='list'>
        <template #empty>
            <span class='emptyText'>
                {{ $t('c.noData') }}
            </span>
        </template>
    </el-table>
</template>

<script setup>
import { defineProps } from 'vue'

defineProps({
    list: {
        type: Array,
        default: () => []
    }
})
</script>

<style lang="scss" scoped>
@import '../table.scss'
</style>
