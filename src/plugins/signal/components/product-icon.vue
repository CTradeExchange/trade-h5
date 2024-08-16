<template>
    <div class='symbol-name'>
        <span v-if='showSymbolIcon && currencyList.length' class='icon'>
            <img :src='`/images/currency_icon/${currencyList[0]}.png`' />
            <img :src='`/images/currency_icon/${currencyList[1]}.png`' />
        </span>
        <span v-if='showSymbolName' class='symbol-code'>
            {{ product.symbolName || symbolCode }}
        </span>
    </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import useSymbolIcon from '@/hooks/useSymbolIcon'

export default {
    props: {
        symbolCode: String,
        // 显示品种名称
        showSymbolName: {
            type: Boolean,
            default: true
        },
        // 显示图标
        showSymbolIcon: {
            type: Boolean,
            default: true,
        }
    },
    setup (props) {
        const store = useStore()

        const symbolKey = computed(() => store.getters['_signal/getSignalSymbolKey'](props.symbolCode))

        const product = computed(() => store.getters['_signal/getSignalProduct'](props.symbolCode))

        const { currencyList } = useSymbolIcon(symbolKey)

        return {
            currencyList,
            product
        }
    }
}
</script>

<style lang="scss" scoped>
.symbol-name {
    display: flex;
    align-items: center;
    overflow: hidden;
    .icon {
        display: inline-flex;
        margin-right: 10px;
        img {
            width: 0.5rem;
            height: 0.5rem;
            border: 1px solid #FFF;
            border-radius: 100%;
            &:last-child {
                margin-left: -6px;
            }
        }
    }
    .symbol-code {
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
    }
}

</style>
