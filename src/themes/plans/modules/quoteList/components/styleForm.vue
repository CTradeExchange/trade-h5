<template>
    <div>
        <el-form-item
            label='样式'
        >
            <el-select
                v-model='styleType'
                clearable
                placeholder='请选择'
            >
                <el-option
                    v-for='item in options'
                    :key='item.value'
                    :label='item.label'
                    :value='item.value'
                />
            </el-select>
        </el-form-item>
        <!-- <el-form-item
            label='显示标题'
        >
            <el-radio-group v-model='showTitle'>
                <el-radio :label='true'>
                    显示
                </el-radio>
                <el-radio :label='false'>
                    隐藏
                </el-radio>
            </el-radio-group>
        </el-form-item> -->
    </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { getSelectOptions } from './dataConfig'

const props = defineProps({
    activeData: {
        type: Object,
        default: () => ({})
    }
})

const emit = defineEmits(['update:activeData'])

const options = getSelectOptions()

const styleType = computed({
    get: () => props.activeData['styleType'],
    set: val => emit('update:activeData', 'styleType', val)

})

const showTitle = computed({
    get: () => {
        return props.activeData['showTitle']
    },
    set: val => emit('update:activeData', 'showTitle', val)
})

onMounted(() => {
    if (!props.activeData['styleType']) {
        emit('update:activeData', {
            styleType: 2,
            showTitle: true
        })
    }
})

</script>
