<template>
    <div class='list-box'>
        <van-pull-refresh
            v-model='refreshing'
            :loading-text="$t('compLang.loading')"
            :loosing-text="$t('compLang.vanPullRefresh.loosing')"
            :pulling-text="$t('compLang.vanPullRefresh.pulling')"
            @refresh='onRefresh'
        >
            <div v-if='isEmpty(list) && Array.isArray(list)'>
                <van-empty
                    :description="$t('common.noData')"
                    image='/images/empty.png'
                />
            </div>
            <template #finished>
                <div v-if='!isEmpty(list)'>
                    {{ $t('common.noMore') }}
                </div>
            </template>
            <van-list
                v-model:error='error'
                v-model:loading='loading'
                :error-text="$t('c.loadError')"
                :finished='finished'
                :finished-text="$t('common.noMore')"
                :loading-text="$t('compLang.loading')"
                :offset='10'
                @load='onLoad'
            >
                <div v-for='(item,i) in list' :key='i' class='item-card' @click='$router.push(`/competition?id=${item.ActivityId}&from=myRace`)'>
                    <div class='status-bar' :class="[status===20?'inProgress':'finished']">
                        <span class='status-text'>
                            {{ status===20?$t('competition.inProgress'):$t('competition.finished') }}
                        </span>
                    </div>
                    <div class='item-top'>
                        <img class='cup' src='../../../../images/competition/cup.png' />
                        <div class='race-name'>
                            {{ item.AllActivityNames[0]?.ActivityName }}
                        </div>
                    </div>
                    <div class='item-middle'>
                        <div>{{ $t('competition.totalReward') }}：{{ (item.AwardPool || 0).toLocaleString() }}</div>
                        <div>{{ $t('competition.rankOfProfit') }}：{{ item.AmountRank>999?'999+':item.AmountRank ?item.AmountRank:'-' }}</div>
                    </div>
                    <div class='item-bottom'>
                        <div class='item-time'>
                            <van-icon name='clock-o' size='16' />
                            <span>
                                {{ dayjs(Number(item.StartTime)).format('YYYY.MM.DD') }}-{{ dayjs(Number(item.EndTime)).format('YYYY.MM.DD') }}
                            </span>
                        </div>
                        <!-- <div>{{ $t('competition.rankOfProfitability') }}：{{ item.RateRank>999?'999+': item.RateRank?item.RateRank:'-' }}</div> -->
                    </div>
                </div>
            </van-list>
        </van-pull-refresh>
    </div>
</template>

<script>
import { reactive, toRefs, onMounted } from 'vue'
import { getCookie, isEmpty } from '@/utils/util'
import dayjs from 'dayjs'
import { getUserActiveList } from '@/api/newApi'
export default {
    props: {
        status: {
            type: [Number, String],
            default: 1
        },

    },
    setup (props) {
        const state = reactive({
            list: null,
            isFetch: false,
            loading: false,
            finished: false,
            error: false,
            refreshing: false,
            offset: 1,
            limit: 10
        })

        const getList = () => {
            const body = { ActivityStatus: [props.status], Offset: state.offset, Limit: state.limit, Language: getCookie('lang') || 'en-US' }
            state.loading = true
            getUserActiveList({ body }).then(res => {
                const { Code, Data, } = res || {}
                if (Code === 1000) {
                    const { Records, Total } = Data || {}
                    if (state.offset === 1) {
                        state.list = Records || []
                    } else {
                        state.list = (state.list || []).concat(Records)
                    }
                    if (state.list.length >= Total) {
                        state.finished = true
                    } else {
                        state.offset += 1
                    }
                }
                state.loading = false
                state.isFetch = true
            }).catch(err => {
                state.finished = true
                state.loading = false
                state.isFetch = true
            })
        }

        const onRefresh = () => {
            if (state.refreshing) {
                // state.list = null
                state.refreshing = false
            }
            state.finished = false
            state.offset = 1
            onLoad()
        }

        const onLoad = () => {
            getList()
        }

        // onMounted(() => {
        //     getList()
        // })

        return {
            dayjs,
            onRefresh,
            isEmpty,
            onLoad,
            ...toRefs(state)
        }
    }
}
</script>

<style lang="scss" scoped>
 .list-box{
        padding: 0 rem(30px);
        .item-card{
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            height: rem(236px);
            width: 100%;
            position: relative;
            background: url('../../../../images/competition/card-bg.png');
            margin-top:rem(80px);
            background-repeat: no-repeat;
            background-size: 100%;
            padding:rem(25px) rem(20px);
            .status-bar{
                height: rem(60px);
                padding:0 rem(20px);
                border-radius: rem(20px) rem(20px) 0 0;
                color:var(--contentColor);
                font-size: rem(28px);
                position: absolute;
                left:0;
                top:rem(-40px);
                display: flex;
                align-items: center;
                &::after{
                    position: absolute;
                    content: '';
                    width:rem(15px);
                    height: rem(6px);
                    border-radius: 0 rem(3px) rem(3px) 0;
                    background: var(--mainColor);
                    opacity: 0.5;
                    bottom:0;
                    right:0;
                    transform: translateX(100%);
                }
                &.inProgress{
                    background: linear-gradient(270deg, #4640BC 0%, #5F8DF8 100%);
                }
                &.finished{
                    background: linear-gradient(270deg, #7B7C7C 0%, #AEAFB1 100%);
                }
            }
            .item-top{
                display: flex;
                align-items: center;
                .cup{
                    width: rem(80px);
                    height: rem(80px);
                }
                .race-name{
                    flex:1;
                    color:var(--contentColor);
                    padding-left:rem(15px);
                    font-size: rem(32px);
                    @include ellipsisLn(2);
                    word-break: unset;
                }
            }
            .item-middle{
                display: flex;
                justify-content: space-between;
                color:var(--contentColor);
                font-size: rem(24px);
                align-items: center;
            }
            .item-bottom{
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: rem(22px);
                color:var(--contentColor);
                opacity: 0.5;
                .item-time{
                    display: flex;
                    align-items: center;
                    &>i{
                        margin-top: rem(-7px);
                    }
                    &>span{
                        margin-left:rem(20px)
                    }
                }
            }
        }
    }
</style>
