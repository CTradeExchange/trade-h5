<template>
    <div class='com'>
        <div class='table'>
            <div class='t-head'>
                <div class='tr'>
                    <div class='th'>
                        {{ $t('competition.rank') }}
                    </div>
                    <div class='th'>
                        {{ $t('competition.player') }}
                    </div>
                    <div class='th'>
                        {{ type==1?$t('competition.profit',{ unit:'USDT' }):$t('competition.profitability') }}
                    </div>
                    <div class='th'>
                        {{ $t('competition.reward',{ unit:'USDT' }) }}
                    </div>
                </div>
            </div>
        </div>
        <van-pull-refresh v-model='loading' @refresh='onRefresh'>
            <div class='table top'>
                <div class='t-body'>
                    <div v-if='myRank' class='tr my-race'>
                        <div class='td'>
                            <div class='rank-col'>
                                <span class='my-mark'></span>
                                <span class='rank-normal'>
                                    {{ myRank }}
                                </span>
                            </div>
                        </div>
                        <div class='td'>
                            <div class='player-col'>
                                <CustomerImg class='avatar' :error-img='defaultAvatar' mode='cover' :src='myRankInfo.HeadImg || defaultAvatar' />

                                <div class='player-info'>
                                    <div class='player-nick-name'>
                                        {{ $t('common.me') }}
                                    </div>
                                    <div class='player-country'>
                                        <img
                                            alt=''
                                            class='icon-country'
                                            :src='`${cdnUrl}/images/countries_flags/${myRankInfo.Country}.png`'
                                            srcset=''
                                        />
                                        <!-- <img :class="['country-icon','ceFlags',item.Country.toLowerCase()]" /> -->
                                        <span>{{ getCountryName(myRankInfo.Country) }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class='td'>
                            {{ type===1 && Number(myRankInfo.CustomerProfit)>0?'+':'' }}
                            {{ type===1?Number(myRankInfo.CustomerProfit).toLocaleString():`${Number(myRankInfo.CustomerProfitRate)}%` }}
                        </div>
                        <div class='td'>
                            {{ Number(myRankInfo.Award).toLocaleString() }}
                        </div>
                    </div>
                    <!-- 未参赛 -->
                    <div v-else-if='customerId' class='tr my-race'>
                        <div class='td'>
                            <div class='rank-col'>
                                <span class='my-mark'></span>
                                <span class='rank-normal'>
                                    -
                                </span>
                            </div>
                        </div>
                        <div class='td'>
                            <div class='player-col'>
                                <CustomerImg class='avatar' :error-img='defaultAvatar' mode='cover' :src='newUserInfo.HeadImg || defaultAvatar' />
                                <div class='player-info'>
                                    <div class='player-nick-name'>
                                        {{ $t('common.me') }}
                                    </div>
                                    <div class='player-country'>
                                        <img
                                            alt=''
                                            class='icon-country'
                                            :src='`${cdnUrl}/images/countries_flags/${newUserInfo.Country}.png`'
                                            srcset=''
                                        />
                                        <span>{{ getCountryName(newUserInfo.Country) }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class='td'>
                            --
                        </div>
                        <div class='td'>
                            <van-button v-if='[10, 20].includes(acitiveStatus)' block class='trade-now' size='small' type='primary' @click='tradeNow'>
                                {{ $t('bannerTopic.tradeNow') }}
                            </van-button>
                            <template v-else>
                                -
                            </template>
                        </div>
                    </div>
                    <div v-for='(item,i) in list' :key='i' class='tr overflow-hidden' :class='{ "my-race": customerId === item.CustomerId }'>
                        <div class='td'>
                            <div class='rank-col reative'>
                                <span v-if='customerId === item.CustomerId' class='my-mark'></span>
                                <img v-if='i<=2' class='rank-bg' :src='i === 0 ? firstPlace : i === 1 ? secondPlace : thirdPlace' />
                                <span :class="[ i<=2?`rank-span`:'rank-normal']">
                                    {{ i+1 }}
                                </span>
                            </div>
                        </div>
                        <div class='td'>
                            <div class='player-col'>
                                <CustomerImg class='avatar' :error-img='defaultAvatar' mode='cover' :src='item.HeadImg || defaultAvatar' />

                                <div class='player-info'>
                                    <div class='player-nick-name'>
                                        {{ item.NickName }}
                                    </div>
                                    <div class='player-country'>
                                        <img
                                            alt=''
                                            class='icon-country'
                                            :src='`${cdnUrl}/images/countries_flags/${item.Country}.png`'
                                            srcset=''
                                        />
                                        <!-- <img :class="['country-icon','ceFlags',item.Country.toLowerCase()]" /> -->
                                        <span>{{ getCountryName(item.Country) }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class='td'>
                            {{ type===1 && Number(item.CustomerProfit)>0?'+':'' }}
                            {{ type===1?Number(item.CustomerProfit).toLocaleString():`${Number(item.CustomerProfitRate)}%` }}
                        </div>
                        <div class='td'>
                            {{ Number(item.Award).toLocaleString() }}
                        </div>
                    </div>
                </div>
                <div v-if='isEmpty(list) && !loading'>
                    <van-empty
                        :description="$t('common.noData')"
                        image='/images/empty.png'
                    />
                </div>
            </div>
        </van-pull-refresh>
    </div>
</template>

<script>
import { cdnUrl } from '@/config'
import { reactive, toRefs, onMounted, watch, onUnmounted, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { isEmpty } from '@/utils/util'
import { GetRankByActiveID } from '@/api/newApi'
import firstPlace from '../../../images/competition/first-place.png'
import secondPlace from '../../../images/competition/second-place.png'
import thirdPlace from '../../../images/competition/third-place.png'
import avatarImg1 from '../../../images/competition/avatar1.png'
import avatarImg2 from '../../../images/competition/avatar2.png'
import CustomerImg from '@plans/views/infoDetail/components/Image'
import defaultAvatar from '@/assets/newPCUI/default-avatar.png'
import useMethods from '@plans/hooks/useMethods'

export default {
    components: {
        CustomerImg
    },
    props: {
        type: {
            type: [Number, String],
            default: 1
        },
        id: {
            type: [String, Number],
            default: ''
        },
        acitiveStatus: {
            type: [Number],
        },
        trades: {
            type: Array,
            default: () => {
                return []
            }
        },
        // data: {
        //     type: Object,
        //     default: () => {}
        // },
        // loading: {
        //     type: Boolean,
        //     default: false
        // }
    },
    setup (props, { emit }) {
        const state = reactive({
            data: {},
            loading: true,
            list: [],
            myRankInfo: {},
            myRank: 0,
            timer: null
        })
        const { toOrderPriority } = useMethods()
        const store = useStore()
        const router = useRouter()
        const getRank = () => {
            const body = {
                ID: Number(props.id),
            }
            GetRankByActiveID({ body }).then(res => {
                const { Data, Code } = res || {}
                if (Code === 1000) {
                    state.data = Data
                    // const { ProfitRank, ProfitRateRank, Rank, RateRank, CustomerProfitVo } = Data || {}
                    // state.myRankInfo = CustomerProfitVo
                    // if (Number(props.type) === 1) {
                    //     state.list = ProfitRank || []
                    //     state.myRank = Rank
                    // } else {
                    //     state.list = ProfitRateRank || []
                    //     state.myRank = RateRank
                    // }
                }
                state.loading = false
            }).catch(err => {
                state.loading = false
            })
        }

        const newUserInfo = computed(() => store.state._user.newUserInfo || {})
        const customerId = computed(
            () => store.state._user.customerInfo.id
        )

        const countryList = computed(() => store.state.countryList)
        const getCountryName = (code) => {
            if (isEmpty(code)) return ''
            const countryInfo = countryList.value.find((o) => o.code === code)
            const { displayName } = countryInfo || {}
            return displayName || ''
        }

        const onRefresh = () => {
            // emit('onRefresh')
            getRank()
        }

        const tradeNow = () => {
            try {
                const symbolId = JSON.parse(props.trades[0].Extra).SymbolId
                router.push({
                    path: '/order',
                    query: {
                        tradeType: 2,
                        symbolId
                    }
                })
            } catch (e) {
                toOrderPriority(2)
            }
        }

        watch([() => props.type, () => state.data], () => {
            const { ProfitRank, ProfitRateRank, Rank, RateRank } = state.data ||
                {}
            if (props.type === 1) {
                state.myRank = Rank
                state.list = ProfitRank
                state.myRankInfo = ProfitRank?.find(item => item.CustomerId === customerId.value) || {}
            } else {
                state.myRank = RateRank
                state.list = ProfitRateRank
                state.myRankInfo = ProfitRateRank?.find(item => item.CustomerId === customerId.value) || {}
            }
        }, { immediate: true, deep: true })

        onMounted(() => {
            getRank()
            // 每10秒刷新数据
            state.timer = setInterval(() => {
                getRank()
            }, 10000)
            if (customerId.value) {
                store.dispatch('_user/getNewUserInfo')
            }
            store.dispatch('getCountryListByParentCode')
        })

        onUnmounted(() => {
            clearInterval(state.timer)
        })

        return {
            cdnUrl,
            isEmpty,
            onRefresh,
            firstPlace,
            secondPlace,
            thirdPlace,
            avatarImg1,
            avatarImg2,
            defaultAvatar,
            newUserInfo,
            tradeNow,
            customerId,
            getCountryName,
            ...toRefs(state)
        }
    }
}
</script>

<style lang="scss" scoped>
@import "@/sass/country_currency.scss";
 .table{
    padding-top:rem(40px);
    &.top{
        padding-top:0;
    }
    .loading-box{
        padding: rem(200px) 0;
    }

    .trade-now {
      width: 100%;
      border-radius: 6px;
      background-color: #ed7141;
      border-color: #ed7141;
    }
    .my-race {
      background-color: #FEF7F5;
    }
    .my-mark {
      position: absolute;
      background: linear-gradient(90deg, rgba(240, 126, 69), rgba(249, 171, 81));
      z-index: 2;
      width: rem(140px);
      text-align: center;
      height: rem(80px);
      color: #fff;
      font-size: 12px;
      left: rem(-90px);
      top: rem(-70px);
      transform: rotate(-45deg);
      &::after {
        content: '';
        background: url('~@/assets/my.png') no-repeat center center;
        width: rem(24px);
        height: rem(24px);
        display: block;
        position: absolute;
        bottom: rem(3px);
        left: rem(55px);
        transform: rotate(45deg);
        background-size: 100%;
      }
    }
    .t-head{
        .tr{
            display: flex;
            flex-wrap: nowrap;
            align-items: center;
            background: var(--colorfa);
            font-size: rem(20px);
            color:#646464;
            padding: 0 rem(20px);
            height: auto;
            min-height: rem(66px);
            .th{
                &:nth-of-type(1){
                    width: rem(85px);
                }
                &:nth-of-type(2){
                    width: rem(242px);
                    padding-left: rem(24px);
                }
                &:nth-of-type(3){
                    width: rem(170px);
                    word-break: break-all;
                }
                &:nth-of-type(4){
                    flex: 1;
                    padding-left: rem(24px);
                    text-align: right;
                    word-break: break-all;
                }
            }
        }
    }
    .t-body{
        .tr{
            display: flex;
            align-items: center;
            height: rem(106px);
            border-bottom: 1px solid var(--lineColor);
            padding: 0 rem(20px);
            .td{
                .rank-col{
                    width: rem(48px);
                    height: rem(41px);
                    display: flex;
                    justify-content: center;
                    position: relative;
                    align-items: center;

                    .rank-bg{
                        position: absolute;
                        top:0;
                        left:0;
                        width: rem(48px);
                        height: rem(41px);
                        display: block;
                    }
                    .rank-span{
                        margin-top:rem(6px);
                        position: relative;
                        color:var(--contentColor);
                        font-size: rem(24px)
                    }
                    .rank-normal{
                        position: relative;
                        color:var(--mainColor);
                        font-size: rem(24px)
                    }
                }
                .player-col{
                    display: flex;
                    align-items: center;
                    .avatar{
                        width: rem(60px);
                        height: rem(60px);
                        border-radius: 50%;
                        overflow: hidden;
                        :deep{
                            .errorDiv{
                                img{
                                    width: 100%;
                                }
                            }
                        }
                    }
                    .player-info{
                        padding-left:rem(15px);
                        .player-nick-name{
                            font-family: 'Inter';
                            font-style: normal;
                            font-weight: 400;
                            font-size: rem(24px);
                            color:var(--mainColor);
                            margin-bottom:rem(8px);
                            @include ellipsis;
                            width: rem(155px);
                        }
                        .player-country{
                            width: rem(155px);
                            font-family: 'Inter';
                            font-style: normal;
                            font-weight: 400;
                            font-size: rem(24px);
                            line-height: rem(30px);
                            display: flex;
                            align-items: center;
                            color:var(--color80);
                            &>span{
                                margin-left:rem(8px);
                                @include ellipsis;
                            }
                            .icon-country{
                                width: 16px;
                            }
                        }

                    }

                }
                &:nth-of-type(1){
                    width: rem(85px);
                }
                &:nth-of-type(2){
                    width: rem(242px);
                }
                &:nth-of-type(3){
                    width: rem(170px);
                    color:#0F9B70;
                    //text-align: center;
                }
                &:nth-of-type(4){
                    flex:1;
                    color:#0F9B70;
                    font-size: rem(26px);
                    text-align: right;
                }
            }
        }
    }
}
.com{
    :deep{
        .van-pull-refresh{
            min-height: rem(300px);
        }
    }
}

</style>
