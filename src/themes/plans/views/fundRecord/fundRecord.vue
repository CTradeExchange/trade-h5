<template>
    <div class='pageWrapp'>
        <LayoutTop :back='true' :menu='false' :title='pageTitle' />
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
    </div>
</template>

<script setup>
import dateRange from '@plans/components/dateRange'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import hooks from './hooks'
const store = useStore()
const { t } = useI18n({ useScope: 'global' })
const { pageTitle } = hooks()
const primaryColor = computed(() => store.state._base.wpCompanyInfo?.themeColor)
const shareTokenCode = ref(0)
const option1 = [
    { text: '份额代币', value: 0 },
    { text: '代币A', value: 1 },
    { text: '代币B', value: 2 },
]
const shareTokenChange = () => {
    console.log(1111)
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
const timeChange = () => {
    console.log(222)
}
const onRangeChange = () => {
    console.log(333)
}

</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.pageWrapp{
    margin-top: rem(110px);
    margin-bottom: rem(120px);
    overflow-y: auto;
}
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
