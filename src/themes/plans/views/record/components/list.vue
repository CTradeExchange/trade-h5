<template>
    <div v-if='context.slots.filter' class='filterWrap'>
        <slot name='filter'></slot>
    </div>
    <div class='scrollBody'>
        <van-pull-refresh v-model='state.refreshing' v-bind='$attrs' class='list' @refresh='onRefresh'>
            <van-list
                v-model:loading='state.loading'
                :finished='state.finished'
                :finished-text='$t("historyList.noMore")'
                @load='onLoad'
            >
                <slot :list='state.list'></slot>
            </van-list>
        </van-pull-refresh>
    </div>
</template>

<script>
import { reactive } from 'vue'
import { useRoute } from 'vue-router'

export default {
    emits: ['queryData'],
    props: {
        liabilitiesType: {
            type: [Number, String],
            require: true,
            default: '',
        },
        requestApi: {
            type: Function,
            default: null
        },
        requestParams: {
            type: Object,
            default: () => ({})
        }
    },
    setup (props, context) {
        const route = useRoute()

        const state = reactive({
            list: [],
            loading: false,
            finished: false,
            current: 1,
            refreshing: false,
            tradeType: route.query.tradeType
        })

        const getList = () => {
            const params = {
                ...props.requestParams,
                tradeType: state.tradeType,
                accountId: Number(route.query.accountId),
                liabilitiesType: props.liabilitiesType,
                current: state.current,
                size: 20
            }

            return props.requestApi(params)
                .then(res => {
                    if (res.code === '0' && Array.isArray(res.data.records)) {
                        return [res.data.records, res.data.total]
                    }
                    return []
                })
        }

        const onLoad = () => {
            getList()
                .then(([data, total]) => {
                    if (state.refreshing) {
                        state.list = []
                        state.refreshing = false
                    }
                    state.list.push(...data)
                    state.loading = false
                    state.current++
                    if (!data.length || total <= state.list.length) {
                        state.finished = true
                    }
                })
        }

        const onRefresh = () => {
            state.loading = true
            state.finished = false
            state.current = 1
            onLoad()
        }

        return {
            state,
            onLoad,
            onRefresh,
            context
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.filterWrap {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    margin-bottom: rem(20px);
}
.scrollBody {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    padding: 0 rem(20px);
    overflow-y: auto;
}
.list {
    width: 100%;
}
</style>
