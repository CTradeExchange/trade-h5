<template>
    <div v-if='$isPC' class='flex items-center'>
        <div class='flex items-center border-right px-4 cursor-pointer menu py-1 text-xs mx-1' @click='visible = true'>
            <div class='tv-li-label mr-1'>
                {{ $t('trade.priceChart') }}:
            </div>
            <span class='mr-1'>
                {{ formatLabel.mainStudy ? formatLabel.mainStudy : $t('headLineTrade.unset') }}
            </span>
            <van-icon class='ml-1' name='arrow-down' />
        </div>
        <div class='flex items-center px-4 cursor-pointer menu py-1 text-xs mx-1' @click='visible = true'>
            <div class='tv-li-label mr-1'>
                {{ $t('trade.indicatorChart') }}:
            </div>
            <span class='mr-1'>
                {{ formatLabel.subStudy ? formatLabel.subStudy : $t('headLineTrade.unset') }}
            </span>
            <van-icon class='ml-1' name='arrow-down' />
        </div>
        <StudyList
            :product='product'
            :prop-main-study='mainStudy'
            :prop-sub-study='subStudy'
            :show='visible'
            @update:show='updateShow'
            @updateStudy='updateStudy'
        />
    </div>
    <van-dropdown-menu v-else class='study-popover'>
        <van-dropdown-item ref='dropdownItem' @close='visible = false' @open='visible = true'>
            <template #title>
                <div
                    class='flex items-center text-xs mt-1'
                    :class="visible ? 'text-primary' : mainStudy || subStudy ? 'text-color' : 'text-minorColor'"
                >
                    <span>IND</span>
                    <van-icon class='ml-1' :name="visible ? 'arrow-up' : 'arrow-down'" size='12' />
                </div>
            </template>
            <div class='px-4 pt-2 pb-2 w-full'>
                <div class='mb-2'>
                    <div class='mb-4 text-xs font-bold'>
                        {{ $t('chart.mainStudy') }}
                    </div>
                    <div class='flex flex-wrap'>
                        <span
                            v-for='(item, i) in mainstudies'
                            :key='i'
                            class='px-3 py-3 text-xs study-item rounded-sm text-minorColor  mr-3 mb-3'
                            :class="{ active: (mainStudy || '') === item.name }"
                            @click="updateStudy([item.name === '' ? null : item.name, subStudy])"
                        >
                            {{ item.label }}
                        </span>
                    </div>
                </div>

                <div>
                    <div class='mb-4 text-xs font-bold'>
                        {{ $t('chart.subStudy') }}
                    </div>
                    <div class='flex flex-wrap'>
                        <span
                            v-for='(item, i) in substudies'
                            :key='i'
                            class='px-3 py-3 text-xs study-item rounded-sm text-minorColor mr-3 mb-3'
                            :class="{ active: (subStudy || '') === item.name }"
                            @click="updateStudy([mainStudy, item.name === '' ? null : item.name])"
                        >
                            {{ item.label }}
                        </span>
                    </div>
                </div>
            </div>
        </van-dropdown-item>
    </van-dropdown-menu>
</template>

<script setup>
import { defineProps, defineEmits, ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { MAINSTUDIES, SUBSTUDIES } from '@/components/tradingview/datafeeds/userConfig/config'
import StudyList from './studyList'

const props = defineProps({
    mainStudy: {
        type: String,
        default: '',
    },
    subStudy: {
        type: String,
        default: '',
    },
    product: {
        type: Object,
    },
})
const emit = defineEmits(['updateStudy'])

const { t } = useI18n()

const dropdownItem = ref(null)
const visible = ref(false)

const updateShow = (val) => {
    visible.value = val
}
const updateStudy = (value) => {
    emit('updateStudy', value)
    dropdownItem.value?.toggle()
}

// 格式化名称
const formatLabel = computed(() => {
    const mainStudy = MAINSTUDIES.find((item) => item.name === props.mainStudy)?.label
    const subStudy = SUBSTUDIES.find((item) => item.name === props.subStudy)?.label
    return {
        mainStudy,
        subStudy,
    }
})

const mainstudies = ref([
    {
        label: t('common.close'),
        name: '',
        type: 'mainStudy',
    },
    ...MAINSTUDIES,
])

const substudies = computed(() => [
    {
        label: t('common.close'),
        name: '',
        type: 'mainStudy',
    },
    ...(!props.product.isCryptocurrency ? SUBSTUDIES.filter((item) => item.name !== 'Volume') : SUBSTUDIES),
])
</script>

<style lang="scss">
.study-popover {
    .mt-1 {
        margin-top: 1px;
    }
    .study-item {
        border: 1px solid var(--assistColor);
        background-color: var(--assistColor);
        &.active {
            border-color: var(--primary);
            color: var(--color);
            font-weight: 500;
        }
    }
}
</style>
