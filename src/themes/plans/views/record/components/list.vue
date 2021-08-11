<template>
    <van-pull-refresh v-model='state.refreshing' @refresh='onRefresh'>
        <van-list
            v-model:loading='state.loading'
            :finished='state.finished'
            :finished-text='$t("historyList.noMore")'
            @load='onLoad'
        >
            <slot :list='state.list'></slot>
        </van-list>
    </van-pull-refresh>
</template>

<script>
import { reactive } from 'vue'
import { queryLiabilitiesWaterByPage } from '@/api/user'
import { useRoute } from 'vue-router'

export default {
    emits: ['queryData'],
    props: {
        liabilitiesType: {
            type: [Number, String],
            require: true,
            default: '',
        }
    },
    setup (props) {
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
                tradeType: state.tradeType,
                accountId: Number(route.query.accountId),
                liabilitiesType: props.liabilitiesType,
                current: state.current,
                size: 20
            }

            return queryLiabilitiesWaterByPage(params)
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
            onRefresh
        }
    }
}
</script>

<style lang="scss" scoped>

</style>
