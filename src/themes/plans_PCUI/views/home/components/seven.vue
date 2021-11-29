<template>
    <div v-loading="loading === 'loading'" class='seven-module'>
        <div class='seven-list'>
            <p class='today'>
                {{ today }}
            </p>
            <el-timeline>
                <el-timeline-item
                    v-for='item in list'
                    :key='item.id'
                    :timestamp='item.title'
                >
                    {{ item.addtime_text.slice(11, 16) }}
                </el-timeline-item>
            </el-timeline>
        </div>
        <div class='pagination-case'>
            <el-pagination layout='prev, pager, next' :total='total' @current-change='changePage' />
        </div>
        <!-- <div v-if="loading !== 'noMore'" class='load-more'>
            <a href='javascript:;' @click='getNewsLilst'>
                <span>{{ $t('loadMore') }}</span>
                <i class='el-icon-arrow-down'></i>
            </a>
        </div> -->
    </div>
</template>

<script>
import { reactive, onMounted, toRefs, computed } from 'vue'
import { useStore } from 'vuex'
import { getCookie } from '@/utils/util'
import { newsListByTypeByPage } from '@/api/information'

export default {
    setup () {
        const store = useStore()
        const wpCompanyInfo = computed(() => store.state._base.wpCompanyInfo)
        const today = window.dayjs().format('YYYY-MM-DD')
        const state = reactive({
            today,
            lang: getCookie('lang') || 'zh-CN',
            page: 1,
            type: 8,
            size: 10,
            list: [],
            total: 0,
            loading: 'more'
        })

        // 获取新闻列表
        const getNewsLilst = () => {
            if (state.loading !== 'more') return
            state.loading = 'loading'
            const params = {
                type: state.type,
                page: state.page,
                pageSize: state.size,
                orgid: wpCompanyInfo.value.orgid || 1
            }
            newsListByTypeByPage(params, state.lang, wpCompanyInfo.value.newsArea).then(res => {
                state.list = res.data
                state.total = res.total
                state.loading = 'more'
            })
        }

        // 改变当前分页
        const changePage = (value) => {
            state.page = value
            getNewsLilst()
        }

        onMounted(() => {
            // 获取新闻列表
            getNewsLilst()
        })

        return {
            ...toRefs(state),
            getNewsLilst,
            changePage
        }
    }
}
</script>

<style lang="scss" scoped>
@import '~@/sass/mixin.scss';
.seven-list {
    @include scroll-pc();
    height: 600px;
    padding-right: 20px;
    overflow-y: auto;
    .today {
        margin-bottom: 30px;
        font-size: 14px;
        color: var(--minorColor);
    }
}
:deep(.el-timeline) {
    .el-timeline-item {
        .el-timeline-item__node {
            width: 8px;
            height: 8px;
            left: 1px;
            background: var(--placeholdColor);
        }
        .el-timeline-item__tail {
            border-left: 1px solid var(--lineColor);
        }
        .el-timeline-item__content {
            font-size: 14px;
            color: var(--minorColor);
        }
        .el-timeline-item__timestamp {
            line-height: 22px;
            font-size: 16px;
            color: var(--color);
        }
    }
}
.pagination-case {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 50px;
    font-size: 14px;
}
.load-more {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 80px;
    cursor: pointer;
    a {
        display: inline-flex;
        align-items: center;
        height: 100%;
        color: var(--minorColor);
    }
    span {
        margin-right: 2px;
        font-size: 14px;
    }
}
</style>
