<template>
    <van-cell title="账户类型" is-link arrow-direction="down" :value="currentAction.name" @click="actionSheetVisible=true" v-bind="$attrs" />
    <van-action-sheet v-model:show='actionSheetVisible' :actions='actionsList' @select='actionOnSelect' />
</template>

<script>
import { computed, reactive, toRefs } from 'vue'
import { useStore } from 'vuex'
export default {
    props: {
        modelValue: [String,Number]
    },
    emits:['update:modelValue'],
    setup (props,{emit}) {
        const store = useStore()
        const state = reactive({
            actionSheetVisible:false
        })
        const actionsList = computed(()=> store.state._base.wpCompanyInfo.tradeTypeList)
        const currentAction = computed(()=> actionsList.value.find(el=>el.value==props.modelValue))
        const actionOnSelect = (item)=>{
            emit('update:modelValue', item.value)
            state.actionSheetVisible = false
        }

        return {
            ...toRefs(state),
            actionsList,
            currentAction,
            actionOnSelect,
        }
    }
}
</script>

<style lang="scss" scoped>

</style>
