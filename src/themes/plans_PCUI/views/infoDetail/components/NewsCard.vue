<template>
    <div v-if='!isEmpty(list)' class='cardBox'>
        <div class='newsTitle'>
            <div>{{ $t("news.relatedNews") }}</div>
        </div>

        <div class='list-box'>
            <NewsItem v-for='(item,i) in list' :key='item.ID' :index='i' :item='item' />
        </div>
        <div v-if='loading' class='loading'>
            <van-loading type='spinner'>
                {{ $t('compLang.loading') }}
            </van-loading>
        </div>
        <div v-if='totalPage>page' class='view-more'>
            <div class='more-btn' @click='onLoad'>
                <span>{{ $t("news.more") }}</span>
            </div>
        </div>
        <!-- <van-list
            v-else
            v-model:loading='loading'
            class='cardList'
            :finished='finished'
            :finished-text="$t('common.noMore')"
            :loading-text="$t('compLang.loading')"
            :offset='100'
            @load='onLoad'
        >
            <NewsItem v-for='(item,i) in list' :key='item.ID' :index='i' :item='item' />
        </van-list> -->
    </div>
</template>

<script>
import { isEmpty, getCookie } from '@/utils/util.js'
import { toRefs, reactive, onMounted, watch } from 'vue'
import { GetItems } from '@/api/newApi'
import NewsItem from './NewsItem.vue'
export default {
    components: { NewsItem },
    props: {
        info: {
            type: Object,
            default: () => {
                return {}
            }
        },

    },

    setup (props, { emit }) {
        const state = reactive({
            isEmpty,
            page: 1,
            pageSize: 10,
            list: [],
            loading: false,
            finished: false,
            keywords: '',
            totalPage: 0,
        })

        const getRelateItems = (Keywords) => {
            state.loading = true
            GetItems({
                body: {
                    Conditions: {
                        Type: 1,
                        Keywords,
                        Language: getCookie('lang') || 'en-US',
                        SoryType: 11,
                        SourceItemLanguageID: Number(props.info.ID)
                    },
                    Limit: state.pageSize,
                    Offset: state.page
                }
            })
                .then((res) => {
                    state.loading = false
                    const { Code, List, TotalPage } = res || {}
                    state.totalPage = TotalPage
                    if (Code === 1000) {
                        const arr = List.filter((i) => i.ID !== Number(props.info.ID))
                        state.list = state.list.concat(arr)
                        if (state.page >= TotalPage) {
                            state.finished = true
                        }
                    }
                })
                .catch((err) => {
                    state.loading = false
                })
        }

        const onLoad = () => {
            state.page += 1
            getRelateItems(state.keywords)
        }

        watch(() => props.info, (n) => {
            if (isEmpty(n)) return
            const Keywords = n.Keywords || n.Title
            state.keywords = Keywords
            getRelateItems(Keywords)
        }, { immediate: true })

        return {
            onLoad,
            ...toRefs(state)
        }
    }
}
</script>

<style lang="scss" scoped>
@import "@/sass/mixin.scss";
.cardBox {
    padding: 60px 0;
    .newsTitle {
        position: relative;
        font-weight: bold;
        display: flex;
        align-items: center;
        font-size: 36px;
        margin-bottom: 15px;
        color:var(--mainColor)
    }
    .view-more{
        display: flex;
        justify-content: center;
        padding-top:20px;
        .more-btn{
            width: 120px;
            height: 42px;
            background: var(--contentColor);
            border: 1px solid var(--cardBg);
            border-radius: 5px;
            display: flex;
            align-items: center;
            justify-content: center;
            color:var(--mainColor);
            font-size: 16px;
            cursor: pointer;
        }
    }
    .loading{
        padding:15px 0;
    }
}
</style>
