<template>
    <div class='fullPageWrapper record'>
        <layoutTop>
            <p>{{ $t("record.records") }}</p>
            <template #right>
                <dateFilter class='dateFilter' :show-title-icon='true' @change='onDateChange' />
            </template>
        </layoutTop>
        <template v-if='reRender'>
            <template v-if='componentList.length>1'>
                <van-tabs v-model:active='modelActive' class='tabs' :line-width='1 / componentList.length * 100 + "%"'>
                    <van-tab v-for='item in componentList' :key='item.name' :name='item.name' :title='item.title'>
                        <div class='content'>
                            <component :is='item.component' :request-params='requestParams' />
                        </div>
                    </van-tab>
                </van-tabs>
            </template>
            <div v-else-if='componentList.length === 1' class='singleContent'>
                <component :is='componentList[0].component' :request-params='requestParams' />
            </div>
        </template>
    </div>
</template>

<script>
import { ref, computed, unref, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import loanList from './components/loanList'
import repaymentList from './components/repaymentList'
// import cransferList from './components/cransferList'
import capitalList from './components/capitalList'
import dateFilter from '@plans/components/dateFilter'

export default {
    components: {
        dateFilter
    },
    setup () {
        const route = useRoute()
        const { t } = useI18n({ useScope: 'global' })
        const tradeType = Number(route.query.tradeType)
        const type = Number(route.query.type)
        const reRender = ref(true)
        const allList = [
            {
                name: 1,
                title: t('record.loanRecord'),
                component: loanList
            },
            {
                name: 2,
                title: t('record.repaymentRecord'),
                component: repaymentList
            },
            // {
            //     name: 3,
            //     title: t('record.cransferRecord'),
            //     component: cransferList
            // },
            {
                name: 4,
                title: t('record.capitalRecord'),
                component: capitalList
            }
        ]
        const componentList = computed(() => {
            // 过滤逻辑
            switch (tradeType) {
                case 1:
                case 2: {
                    return allList.filter(e => e.name === 4)
                }
                case 3:
                case 9: {
                    return allList.filter(e => [1, 2, 4].includes(e.name))
                }
            }
            return []
        })

        const modelActive = ref(type || unref(componentList)[0].name)

        const requestParams = ref({})
        const onDateChange = (value) => {
            if (value) {
                [requestParams.value.startTime, requestParams.value.endTime] = value
            } else {
                requestParams.value = {}
            }

            reRender.value = false
            nextTick(() => {
                reRender.value = true
            })
        }
        return {
            modelActive,
            componentList,
            onDateChange,
            reRender,
            requestParams
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.record {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    overflow: hidden;
    .tabs {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        :deep(.van-tabs__wrap) {
            flex: 0 0 44px;
        }
        :deep(.van-tabs__content) {
            height: 100%;
            overflow-y: auto;
        }
        :deep(.van-tab__text) {
            font-size: rem(28px);
        }
        :deep(.van-tabs__line) {
            background-color: var(--primary);
        }
        :deep(.van-tab__pane) {
            height: 100%;
        }
        :deep(.content) {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            height: 100%;
        }
    }
    .content {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        box-sizing: border-box;
        width: 100%;
        padding: rem(30px) 0;
    }
    .singleContent {
        width: 100%;
        height: 100%;
        padding: rem(30px) 0;
    }
    .dateFilter {
        :deep(.van-dropdown-menu__title) {
            &::after {
                display: none;
            }
        }
    }
}

</style>
