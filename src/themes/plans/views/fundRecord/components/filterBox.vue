<template>
    <div class='filterBox'>
        <van-dropdown-menu :active-color='primaryColor' :overlay='true'>
            <van-dropdown-item
                v-model='shareTokenCode'
                :options='option1'
                @change='shareTokenChange'
            />
            <van-dropdown-item
                ref='timeDropdown'
                v-model='timeVal'
                :options='timeList'
                @change='timeChange'
            >
                <template #title v-if='timeVal === 5'>
                    {{ customDate }}
                </template>
                <template #default>
                    <dateRange :is-selected='timeVal === 5' @change='onRangeChange' />
                </template>
            </van-dropdown-item>
        </van-dropdown-menu>
    </div>
</template>

<script setup>
import dateRange from '@plans/components/dateRange'
import { computed, ref, defineProps, defineEmits } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
const props = defineProps({
    assetsList: Array
})

const emit = defineEmits(['assetChange', 'dateChange'])

const store = useStore()
const { t } = useI18n({ useScope: 'global' })
const primaryColor = computed(() => store.state._base.wpCompanyInfo?.themeColor)
const shareTokenCode = ref(0)
const option1 = computed(() => {
    const placeholdItem = [
        { text: t('fundInfo.shareCurrency'), value: 0 }
    ]
    return placeholdItem.concat(props.assetsList)
})
const shareTokenChange = (val) => {
    emit('assetChange', val)
}

const timeVal = ref(0)
const customDate = ref(0)
const timeList = ref([
    { text: t('common.allDate'), value: 0 },
    { text: t('common.curToday'), value: 1 },
    { text: t('common.curWeek'), value: 2 },
    { text: t('common.curMonth'), value: 3 },
    { text: t('common.curThreeMonth'), value: 4 }
])

const getTime = (type) => {
    return window.dayjs().startOf(type).valueOf()
}
const period = {
    1: getTime('day'),
    2: getTime('week'),
    3: getTime('month'),
    4: window.dayjs().startOf('month').subtract(3, 'month').valueOf()
}
// 监听下拉菜单变化
const timeChange = (value) => {
    console.log(value)
    const startTime = period[value]
    const endTime = window.dayjs().endOf('day').valueOf()
    emit('dateChange', startTime ? [startTime, endTime] : null)
}
const onRangeChange = value => {
    // dateModel.value = 5
    emit('dateChange', value)
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.filterBox{
    :deep(.van-dropdown-menu) {
        //background-color: var(--bgColor);
        .van-dropdown-menu__bar {
            align-items: center;
            padding: 0 rem(10px);
            background: var(--bgColor);
            box-shadow: none;
            .van-dropdown-menu__item {
                position: relative;
                justify-content: space-between;
                height: rem(48px);
                margin: 0 rem(10px);
                padding: 0 rem(5px);
                background: var(--contentColor);
                border-radius: rem(6px);
                .van-dropdown-menu__title {
                    position: static;
                    color: var(--color);
                    font-size: rem(20px);
                    &::after {
                        right: rem(10px);
                        border-color: transparent transparent  var(--normalColor) var(--normalColor);
                    }
                }
                .van-cell__title {
                    span {
                        color: var(--color);
                        font-size: rem(20px);
                    }
                }
            }
        }
        .van-dropdown-item__option {
            font-size: rem(20px);
        }
    }
}
</style>
