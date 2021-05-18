<template>
    <div>
        <van-cell arrow-direction='down' is-link title='提币币种' value='44' @click='showCurrencyAction = true' />
    </div>

    <van-action-sheet
        v-model:show='showCurrencyAction'
        :actions='actions'
        class='action-sheet'
        close-on-click-action
        @select='onSelectCurrency'
    />
</template>

<script>
import { reactive, toRefs } from 'vue'
export default {
    setup (props) {
        const state = reactive({
            showCurrencyAction: false
        })
        const actions = [
            { name: '选项一' },
            { name: '选项二' },
            { name: '选项三' },
        ]

        const onSelectCurrency = () => {

        }

        return {
            actions,
            ...toRefs(state),
            onSelectCurrency
        }
    }

}
</script>
