<template>
    <div v-loading="loading === 'loading'" class='news-module'>
        <div class='news-list'>
            <div v-for='item in list' :key='item.id' class='item' @click='openNewsDialog(item)'>
                <div class='item-left'>
                    <p class='title'>
                        {{ item.title }}
                    </p>
                    <p class='row'>
                        <span>{{ item.resource }}</span>
                        <span>{{ item.updatetimeStr }}</span>
                    </p>
                </div>
                <div class='item-right'>
                    <img :src='item.image' />
                </div>
            </div>
        </div>
        <div v-if="loading !== 'noMore'" class='load-more'>
            <a href='javascript:;' @click='getNewsLilst'>
                <span>{{ $t('loadMore') }}</span>
                <i class='el-icon-arrow-down'></i>
            </a>
        </div>
    </div>
    <!-- 新闻详情弹窗 -->
    <news-dialog ref='dialog' />
</template>

<script>
// components
import newsDialog from './news-dialog.vue'
import { beforeTime } from '../util.js'

import { ref, reactive, onMounted, toRefs, computed } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { getCookie } from '@/utils/util'
import { newsListByTypeByPage, articleDetail } from '@/api/information'

export default {
    components: {
        newsDialog
    },
    setup () {
        const store = useStore()
        const { t } = useI18n({ useScope: 'global' })
        const dialog = ref(null)
        const wpCompanyInfo = computed(() => store.state._base.wpCompanyInfo)
        const state = reactive({
            lang: getCookie('lang') || 'zh-CN',
            page: 1,
            type: 7,
            size: 10,
            list: [],
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
                res.data.map(elem => {
                    elem.updatetimeStr = beforeTime(elem.updatetime * 1000, t)
                })
                state.list = state.page === 1 ? res.data : state.list.concat(res.data)
                state.loading = state.list.length === res.total ? 'noMore' : 'more'
                state.page += 1
            })
        }

        // 打开新闻详情弹窗
        const openNewsDialog = (item) => {
            const params = {
                id: item.id,
                orgid: item.orgid
            }
            articleDetail(params, state.lang).then(res => {
                dialog.value.open(res)
            })
        }

        onMounted(() => {
            // 获取新闻列表
            getNewsLilst()
        })

        return {
            ...toRefs(state),
            getNewsLilst,
            openNewsDialog,
            dialog
        }
    }
}
</script>

<style lang="scss" scoped>
@import '~@/sass/mixin.scss';
.news-list {
    @include scroll-pc();
    height: 600px;
    overflow-y: auto;
    .item {
        display: flex;
        height: 120px;
        margin-bottom: 40px;
        cursor: pointer;
        &:last-of-type {
            margin-bottom: 0;
        }
        .item-left {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            width: 332px;
            height: 100%;
            margin-right: 25px;
            .title {
                @include ellipsisLn(3);
                line-height: 22px;
                font-size: 16px;
                color: var(--color);
            }
            .row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: 14px;
                color: var(--minorColor);
            }
        }
        .item-right {
            width: 200px;
            height: 120px;
            img {
                display: block;
                width: 200px;
                height: 120px;
            }
        }
    }
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
