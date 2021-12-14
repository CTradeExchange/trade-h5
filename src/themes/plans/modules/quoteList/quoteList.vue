<template>
    <div>
        <!-- h5 -->
        <template v-if='!h5Preview'>
            <H5 v-bind='props.data' />
        </template>

        <!-- 编辑预览 -->
        <template v-else>
            <Edit v-bind='props.data' />
        </template>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import Edit from './components/Edit.vue'
import H5 from './components/H5.vue'

const props = defineProps({
    data: {
        type: Object,
        default: () => ({})
    }
})
</script>
