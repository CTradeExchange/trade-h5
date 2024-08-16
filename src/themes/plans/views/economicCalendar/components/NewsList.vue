<template>
    <div v-if='!isEmpty(list)' class='cardBox'>
        <div class='newsTitle'>
            <div>{{ $t("news.relatedNews") }}</div>
        </div>
        <div v-if='isEmpty(list)'>
            <van-empty
                :description="$t('common.noData')"
                image='/images/empty.png'
            />
        </div>
        <van-list
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
        </van-list>
    </div>
</template>

<script>
import { isEmpty, getCookie } from '@/utils/util.js'
import { toRefs, reactive, watch } from 'vue'
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
        }
    },

    setup (props, { emit }) {
        const state = reactive({
            isEmpty,
            page: 1,
            list: [],
            loading: false,
            finished: false,
            keywords: ''
        })
        const getRelateItems = (Keywords) => {
            if (isEmpty(Keywords)) return
            state.loading = true
            GetItems({
                body: {
                    Conditions: {
                        Type: 1,
                        Keywords,
                        Language: getCookie('lang'),
                        SoryType: 11,
                        SourceItemLanguageID: Number(props.info.ID)
                    },
                    Limit: 10,
                    Offset: state.page
                }
            })
                .then((res) => {
                    state.loading = false
                    const { Code, List, TotalPage } = res || {}
                    if (Code === 1000) {
                        const arr = List.filter((i) => i.ID !== props.info.ID)
                        state.list = state.list.concat(arr)
                        if (state.page >= TotalPage) {
                            state.finished = true
                            return
                        }
                        state.page += 1
                    }
                })
                .catch((err) => {
                    state.loading = false
                })
        }

        const onLoad = () => {
            if (state.page === 1) return
            getRelateItems(state.keywords)
        }

        watch(() => props.info, (n) => {
            if (isEmpty(n)) return
            const { Keywords, Title } = n || {}
            state.keywords = Keywords || Title
            getRelateItems(state.keywords)
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
    margin-top:rem(40px);
    .newsTitle {
        position: relative;
        height: rem(62px);
        display: flex;
        align-items: center;
        border-radius: rem(10px) rem(10px) 0 0;
        background: var(--primaryLc);
        font-size: rem(24px);
        padding-left: rem(30px);
        &::before {
            position: absolute;
            content: "";
            width: rem(7px);
            height: rem(30px);
            background: var(--color1);
            left: 0;
        }
    }
    .cardList {
        .cardItem {
            display: flex;
            justify-content: space-between;
            padding: rem(30px) rem(10px);
            background: var(--contentColor);
            border-top: 1px solid var(--cardBg);
            &.first {
                border-top: none;
            }
            .itemContent {
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                flex: 1;
                padding-right: rem(45px);
                .itemTitle {
                    @include ellipsisLn(2);
                    font-size: rem(28px);
                    font-weight: 400;
                    color: var(--primaryText);
                    line-height: rem(41px);
                }
                .itemTime {
                    font-size: rem(24px);
                    font-weight: 400;
                    color: var(--color80);
                }
            }
            & > .itemImg {
                width: rem(221px);
                height: rem(150px);
                border-radius: rem(10px);
                overflow: hidden;
            }
        }
    }
}
</style>
