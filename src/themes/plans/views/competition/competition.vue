<template>
    <LayoutTop :title="$t('competition.competitionDetails')">
        <template #right>
            <div class='top-right-btn' @click='gotoMyRace'>
                <img src='../../images/competition/record-icon.png' />
            </div>
        </template>
    </LayoutTop>
    <div class='page-competition'>
        <ComCoundown :data='details' @finish='finish' />
        <div class='content-block'>
            <ComTable :id='id' :acitive-status='details.Status' :loading='loading' :trades='trades' :type='RanType' />
        </div>
        <div class='rules-block'>
            <div class='rules-btn' @click="$router.push('/competitionRules')">
                <span>{{ $t('competition.competitionRules') }}</span>
                <van-icon name='play' />
            </div>
        </div>
        <TradeList :trades='trades' />
    </div>
</template>

<script>
import { reactive, toRefs, onMounted, onUnmounted } from 'vue'
import TradeList from '@plans/components/TradeList'
import ComTable from './components/table.vue'
import { getAcitiveDetail } from '@/api/newApi'
import { useRoute, useRouter } from 'vue-router'
import { isEmpty, debounce } from '@/utils/util'
import ComCoundown from '@plans/components/competitionCoutdown.vue'
import _ from 'lodash'
export default {
    components: { TradeList, ComTable, ComCoundown },
    setup () {
        const route = useRoute()
        const router = useRouter()
        const { id, from } = route.query || {}
        const state = reactive({
            RanType: 1,
            details: {},
            endTime: 0,
            trades: [],
            timer: null,
            loading: true,
        })

        const getDetails = () => {
            getAcitiveDetail({ body: { ID: Number(id) } }).then(res => {
                const { Code, Data } = res || {}
                if (Code === 1000) {
                    state.details = Data
                    if (![10, 20].includes(Data.Status)) {
                        clearInterval(state.timer)
                    }
                    const SymbolIDs = Data.SymbolIDs
                    if (isEmpty(SymbolIDs)) return
                    const arr = _.uniq(SymbolIDs.split(','))
                    const res = []
                    arr.map(item => {
                        if (!item) return
                        const obj = { Extra: `{"SymbolId":"${item}"}` }
                        res.push(obj)
                    })
                    state.trades = res
                }
            }).finally(() => {
                state.loading = false
            })
        }

        const finish = debounce(() => {
            getDetails()
        }, 2000)

        const changeTab = (e) => {
            const { name } = e || {}
            state.RanType = name
            window.scrollTo(0, 0)
        }

        const gotoMyRace = () => {
            if (from !== 'myRace') {
                router.push('/myRace')
                return
            }
            router.go(-1)
        }

        onMounted(() => {
            if (!id) {
                router.go(-1)
                return
            }
            getDetails()
            // 每10秒刷新数据
            state.timer = setInterval(() => {
                getDetails()
            }, 10000)
        })

        onUnmounted(() => {
            clearInterval(state.timer)
        })

        return {
            isEmpty,
            gotoMyRace,
            id,
            changeTab,
            finish,
            ...toRefs(state)
        }
    }

}
</script>

<style lang="scss" scoped>
@import "@/sass/country_currency.scss";
.top-right-btn{
    display: flex;
    align-items: center;
    height: 100%;
}
.page-competition{
    flex:1;
    background: var(--contentColor);
    padding: rem(20px);
    .cup-bg{
        position: relative;
        img{
            width: 100%;
        }
        .cup-content{
            position: absolute;
            top:0;
            left:0;
            bottom:0;
            right:0;
            padding-left:rem(150px);
            display: flex;
            flex-direction: column;
            justify-content: center;
            .rest-round{
                font-size: rem(24px);
                line-height: rem(40px);
                color: var(--contentColor);
                opacity: 0.5;
                display: flex;
                &>span{
                    margin-right:rem(30px)
                }
                :deep{
                    .van-count-down{
                        font-size: unset;
                        color:unset
                    }
                }
            }
            .current-prize{
                font-weight: 500;
                font-size: rem(28px);
                line-height: rem(40px);
                color: var(--contentColor);
                //margin-top:10px;
            }
        }
    }
    .content-block{
       // min-height: rem(600px);
        .tabs{
            :deep{
                .van-tab__text{
                    font-size: rem(36px);
                    font-weight: 400;
                    color:var(--mainColor);
                }
                .van-tab--active{
                    .van-tab__text{
                        color:var(--primary)
                    }
                }
                .van-tabs__line{
                    background:var(--primary)
                }
            }
        }

    }
    .rules-block{
        padding:rem(20px) 0;
        display: flex;
        justify-content: flex-end;
        .rules-btn{
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0 rem(16px);
            background: #FEF7F5;
            border-radius: rem(10px);
            height: rem(68px);
            color: #EA653F;
        }
    }
}
</style>
