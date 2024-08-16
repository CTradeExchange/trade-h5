<template>
    <span v-if='currencyList.length' class='img-group'>
        <img :src='`/images/currency_icon/${currencyList[0]}.png`' />
        <img :src='`/images/currency_icon/${currencyList[1]}.png`' />
    </span>
</template>

<script>
import { computed } from 'vue'
import useSymbolIcon from '@/hooks/useSymbolIcon'
export default {
    props: {
        // 产品key
        symbolKey: String
    },
    setup (props) {
        const symbolKey = computed(() => props.symbolKey)
        const { currencyList } = useSymbolIcon(symbolKey)

        return {
            currencyList
        }
    }
}
</script>

<style lang="scss" scoped>
.img-group {
  display: flex;
  align-items: center;
  overflow: hidden;
  img {
      width: 24px;
      height: 24px;
      border: 1px solid #FFF;
      border-radius: 100%;
      &:last-child {
          margin-left: -10px;
      }
  }
}

</style>
