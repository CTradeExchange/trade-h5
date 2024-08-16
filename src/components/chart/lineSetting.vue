<template>
    <popover
        v-if='$isPC'
        :offset='[6, 8]'
        placement='top-end'
        popover-class='showMorePopover'
        :text="$t('common.displaySettings')"
        touch-disabled
    >
        <template #reference>
            <van-popover v-model:show='computedLineShow' :actions='computedLineList' :offset='[20, 10]' placement='bottom-end'>
                <van-checkbox-group ref='checkboxGroup' v-model='settingList' class='py-2' @change='change'>
                    <van-checkbox
                        v-for='item in computedLineList'
                        :key='item.value'
                        class='px-4 flex items-center h-8 van-hairline--bottom'
                        icon-size='16px'
                        :name='item.value'
                    >
                        {{ item.text }}
                    </van-checkbox>
                </van-checkbox-group>
                <template #reference>
                    <van-icon class='icon' name='setting-o' :size='16' />
                </template>
            </van-popover>
        </template>
    </popover>
    <van-dropdown-menu v-else>
        <van-dropdown-item>
            <template #title>
                <van-icon class='icon' name='setting-o' :size='16' />
            </template>

            <van-cell v-for='item in computedLineList' :key='item.value' @click='setLine(item.value)'>
                <template #title>
                    <span class='flex items-center'>
                        {{ item.text }}
                    </span>
                </template>
                <template #right-icon>
                    <van-icon
                        v-if='settingList.includes(item.value)'
                        class='klineTypeRightIcon'
                        :class="settingList.includes(item.value) ? 'text-primary' : ''"
                        name='success'
                    />
                </template>
            </van-cell>
        </van-dropdown-item>
    </van-dropdown-menu>
</template>

<script setup>
import { computed, ref, defineProps, defineEmits } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'

const props = defineProps({
    settingList: Array,
})

const emits = defineEmits(['change'])
const { t } = useI18n()
const store = useStore()

const lineList = ref([
    {
        text: t('chart.lastValueLine'),
        value: 'showLastPrice',
    },
    {
        text: t('chart.buyLine'),
        value: 'showBuyPrice',
    },
    {
        text: t('chart.sellLine'),
        value: 'showSellPrice',
    },
    {
        text: t('trade.buySellFive'),
        value: 'stalls',
    },
    {
        text: t('trade.dealData'),
        value: 'deal',
    },
])

const computedLineShow = ref(false)
const change = (value) => {
    emits('change', value)
}
// 产品信息
const product = computed(() => store.getters.productActived)

const computedLineList = computed(() => {
    if (product.value.tradeType === 9) {
        return lineList.value
    }
    return lineList.value.filter((e) => !['stalls', 'deal'].includes(e.value))
})

const setLine = (value) => {
    let list = [...props.settingList]
    if (props.settingList.includes(value)) {
        list = list.filter((item) => item != value)
    } else {
        list.push(value)
    }
    emits('change', list)
}
</script>
