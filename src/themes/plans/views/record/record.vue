<template>
    <div class='fullPageWrapper record'>
        <layoutTop>
            <p>{{ $t("record.records") }}</p>
        </layoutTop>
        <van-tabs v-model:active='modelActive' class='tabs' :line-height='componentList.length === 1 ? 0 : 3' :line-width='1 / componentList.length * 100 + "%"'>
            <van-tab v-for='item in componentList' :key='item.name' :name='item.name' :title='item.title'>
                <div class='content'>
                    <component :is='item.component' />
                </div>
            </van-tab>
        </van-tabs>
    </div>
</template>

<script>
import { ref, computed, unref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import loanList from './components/loanList'
import repaymentList from './components/repaymentList'
// import cransferList from './components/cransferList'
import capitalList from './components/capitalList'

export default {
    setup () {
        const route = useRoute()
        const { t } = useI18n({ useScope: 'global' })
        const tradeType = Number(route.query.tradeType)
        const type = Number(route.query.type)

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
        return {
            modelActive,
            componentList
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
            // width: 50%;
            background-color: var(--primary);
        }
    }
    .content {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        box-sizing: border-box;
        width: 100%;
        padding: rem(30px) rem(20px);
    }
}

</style>
