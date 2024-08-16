<template>
    <centerViewDialog>
        <LayoutTop />
        <div class='record'>
            <el-tabs v-model='activeName' class='record-tabs-box' @tab-click='handleClick'>
                <el-tab-pane v-for='(item, index) in componentList' :key='item.name' :label='item.title'>
                    <div class='search-box'>
                        <dateFilter class='dateFilter' @change='onDateChange' />
                    </div>
                    <div v-if='activeName == index' class='content'>
                        <component :is='item.component' :ref='el => { el && (childs[item.name]=el)}' />
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
    </centerViewDialog>
</template>

<script>
import centerViewDialog from '@planspc/layout/centerViewDialog'
import { ref, computed, unref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import despositList from './components/despositList'
import withdrawList from './components/withdrawList'
import transferList from './components/transferList'
import dateFilter from './components/dateFilter'

export default {
    components: {
        dateFilter,
        centerViewDialog
    },
    setup () {
        const route = useRoute()
        const { t } = useI18n({ useScope: 'global' })
        const type = Number(route.query.type)

        const activeName = ref('0')

        const allList = [
            {
                name: 1,
                title: t('wallet.desposit'),
                component: despositList
            },
            {
                name: 2,
                title: t('wallet.withdraw'),
                component: withdrawList
            },
            // {
            //     name: 3,
            //     title: t('wallet.transfer'),
            //     component: transferList
            // },
        ]

        const componentList = computed(() => allList)

        const modelActive = ref(type || unref(componentList)[0]?.name)

        const onDateChange = (value) => {
            const child = unref(childs)[unref(modelActive)]
            if (child && typeof child.refresh === 'function') {
                // 更新对应子组件参数
                let params = {}
                const [startTime, endTime] = value || []
                if (startTime && endTime) {
                    params = {
                        startTime,
                        endTime
                    }
                } else {
                    params = {}
                }
                child.setParams(params)
                // 调用子组件方法-重新请求数据
                child.refresh()
            }
        }

        const childs = ref({})

        const handleClick = () => {

        }

        return {
            modelActive,
            componentList,
            onDateChange,
            handleClick,
            activeName,
            childs
        }
    }
}
</script>

<style lang="scss">
.record-tabs-box {
    width: 100%;
    height: 100%;
        display: flex;
    flex-direction: column;
    .el-tabs__header {
        margin: 0 0 1px;
        padding: 0 24px;
    }
    .el-tabs__item.is-active {
        color: var(--primary);
    }
    .el-tabs__item {
        color: #999999;
        text-align: center;
        min-width: 100px;
        padding: 0 10px;
    }
    .el-tabs__nav-wrap::after {
        height: 0;
    }
    .el-tabs__item:hover {
        color: var(--primary);
    }
    .el-tabs__active-bar {
        background-color: var(--primary);
    }
    .el-tabs__content {
        flex: 1;
    }
    .el-tab-pane {
        height: 100%;
        display: flex;
        flex-direction: column;
    }
}
</style>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.search-box {
    flex-shrink: 0;
    width: 100%;
    height: 56px;
    display: flex;
    align-items: center;
    background: #FAF9F9;
    padding: 0 24px;
}
.record {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    overflow: hidden;
    user-select: none;
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
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        box-sizing: border-box;
        width: 100%;
        overflow: hidden;
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
    :deep(.van-dropdown-item) {
        width: 520px;
        margin: auto;
    }
}

</style>
