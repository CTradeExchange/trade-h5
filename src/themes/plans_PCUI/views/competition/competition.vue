<template>
    <router-view />
    <div class='page-competition'>
        <div class='competition-main'>
            <ComCountdown :data='info' @finish='finish' />
            <div class='rank-box'>
                <div class='rank-table'>
                    <table border='0' cellpadding='0' cellspacing='0'>
                        <thead>
                            <tr>
                                <!-- <th v-for='(col,i) in columns' :key='`th_${i}`' :align='col.align' :width='col.width'>
                                    {{ col.label }}
                                </th> -->
                                <th align='left' width='130'>
                                    {{ $t('competition.rank') }}
                                </th>
                                <th align='left' width='180'>
                                    {{ $t('competition.player') }}
                                </th>
                                <th align='left' width='210'>
                                    {{ $t('competition.country') }}
                                </th>
                                <th align='center' width=''>
                                    {{ currentTab.value===1? $t('competition.profit', { unit: 'USDT' }):$t('competition.profitability') }}
                                </th>
                                <th align='right' width=''>
                                    {{ $t('competition.reward', { unit: 'USDT' }) }}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-if='myRank' class='my-race'>
                                <td class='overflow-hidden'>
                                    <div class='rank-col relative'>
                                        <span class='my-mark'></span>
                                        <span class='rank-normal'>
                                            {{ myRank }}
                                        </span>
                                    </div>
                                </td>
                                <td>
                                    <div class='player-col'>
                                        <!-- <img class='avatar' :src='item.HeadImg || defaultAvatar' /> -->
                                        <el-avatar class='avatar' :size='36' :src='myRankInfo.HeadImg'>
                                            <img
                                                :src='defaultAvatar'
                                            />
                                        </el-avatar>
                                        <span class='nick-name'>
                                            {{ $t('common.me') }}
                                        </span>
                                    </div>
                                </td>
                                <td>
                                    <div class='country-col'>
                                        <!-- <img :class="['country-icon','ceFlags',myRankInfo.Country.toLowerCase()]" /> -->
                                        <img
                                            alt=''
                                            class='icon-country'
                                            :src='`${cdnUrl}/images/countries_flags/${myRankInfo.Country}.png`'
                                            srcset=''
                                        />
                                        <span class='country-span'>
                                            {{ myCountry }}
                                        </span>
                                    </div>
                                </td>
                                <td align='center'>
                                    <div class='profit-col'>
                                        {{ currentTab.value===1? Number(myRankInfo.CustomerProfit).toLocaleString():`${myRankInfo.CustomerProfitRate}%` }}
                                    </div>
                                </td>
                                <td align='right'>
                                    <div class='reward-col'>
                                        {{ Number(myRankInfo.Award).toLocaleString() }}
                                    </div>
                                </td>
                            </tr>
                            <!-- 未参赛 -->
                            <tr v-else-if='customerId' class='my-race'>
                                <td class='overflow-hidden'>
                                    <div class='rank-col'>
                                        <span class='my-mark'></span>
                                        <span class='rank-normal'>
                                            -
                                        </span>
                                    </div>
                                </td>
                                <td>
                                    <div class='player-col'>
                                        <el-avatar class='avatar' :size='36' :src='newUserInfo.HeadImg || defaultAvatar' />
                                        <span class='nick-name'>
                                            {{ $t('common.me') }}
                                        </span>
                                    </div>
                                </td>
                                <td>
                                    <div class='country-col'>
                                        <img
                                            alt=''
                                            class='icon-country'
                                            :src='`${cdnUrl}/images/countries_flags/${newUserInfo.Country}.png`'
                                            srcset=''
                                        />
                                        <span class='country-span'>
                                            {{ myCountry }}
                                        </span>
                                    </div>
                                </td>
                                <td align='center'>
                                    <div class='profit-col'>
                                        --
                                    </div>
                                </td>
                                <td align='right'>
                                    <div class='reward-col'>
                                        <van-button v-if='[10, 20].includes(info.Status)' block class='trade-now' size='small' type='primary' @click='tradeNow'>
                                            {{ $t('bannerTopic.tradeNow') }}
                                        </van-button>
                                        <template v-else>
                                            -
                                        </template>
                                    </div>
                                </td>
                            </tr>
                            <tr v-for='(item,i) in list' :key='`tbody_${i}`' :class='{ "my-race": customerId === item.CustomerId }'>
                                <td class='overflow-hidden'>
                                    <div class='rank-col relative'>
                                        <span v-if='customerId === item.CustomerId' class='my-mark'></span>
                                        <img v-if='i<=2' class='rank-bg' :src='i ===0 ? firstPlace : i === 1 ? secondPlace : thirdPlace' />
                                        <span :class="[ i<=2?`rank-span`:'rank-normal']">
                                            {{ i+1 }}
                                        </span>
                                    </div>
                                </td>
                                <td>
                                    <div class='player-col'>
                                        <el-avatar class='avatar' :size='36' :src='item.HeadImg || defaultAvatar'>
                                            <img
                                                :src='defaultAvatar'
                                            />
                                        </el-avatar>
                                        <span class='nick-name'>
                                            {{ item.NickName }}
                                        </span>
                                    </div>
                                </td>
                                <td>
                                    <div class='country-col'>
                                        <img
                                            alt=''
                                            class='icon-country'
                                            :src='`${cdnUrl}/images/countries_flags/${item.Country}.png`'
                                            srcset=''
                                        />
                                        <span class='country-span'>
                                            {{ getCountryName(item.Country) }}
                                        </span>
                                    </div>
                                </td>
                                <td align='center'>
                                    <div class='profit-col'>
                                        {{ currentTab.value===1? Number(item.CustomerProfit).toLocaleString():`${item.CustomerProfitRate}%` }}
                                    </div>
                                </td>
                                <td align='right'>
                                    <div class='reward-col'>
                                        {{ Number(item.Award).toLocaleString() }}
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div v-if='loading' class='loading' :class="[!isFetch && 'first']">
                    <van-loading type='spinner'>
                        {{ $t('compLang.loading') }}
                    </van-loading>
                </div>

                <div v-if='isEmpty(list) && !loading' class='none-data'>
                    <van-empty :description='$t("common.noData")' image='/images/empty.png' />
                </div>
                <div class='rules'>
                    <div class='rules-btn' @click="$router.push('/competitionRules')">
                        <el-icon color='#EA653F'>
                            <Document />
                        </el-icon>
                        <span>{{ $t('competition.competitionRules') }}</span>
                        <el-icon color='#EA653F'>
                            <CaretRight />
                        </el-icon>
                    </div>
                </div>
                <TranCard :trades='trades' />
            </div>
        </div>
    </div>
</template>

<script>
import { cdnUrl } from '@/config'
import { onMounted, reactive, toRefs, watch, onUnmounted, computed } from 'vue'
import cupBg from './assets/cup-bg.png'
import { useI18n } from 'vue-i18n'
import firstPlace from './assets/first-place.png'
import secondPlace from './assets/second-place.png'
import thirdPlace from './assets/third-place.png'
import defaultAvatar from '@/assets/newPCUI/default-avatar.png'
import TranCard from '@planspc/views/infoDetail/components/RelatedProductListCard.vue'
import { useRoute, useRouter } from 'vue-router'
import { getAcitiveDetail, GetRankByActiveID } from '@/api/newApi'
import { isEmpty, debounce } from '@/utils/util'
import ComCountdown from '@planspc/components/competitionCountdown.vue'
import _ from 'lodash'
import { useStore } from 'vuex'

export default {
    components: { TranCard, ComCountdown },
    setup () {
        const { t } = useI18n({ useScope: 'global' })
        const route = useRoute()
        const router = useRouter()
        const store = useStore()
        const { id } = route.query || {}
        const tabsList = [
            {
                label: t('competition.rankOfProfit'),
                value: 1
            },
            {
                label: t('competition.rankOfProfitability'),
                value: 2
            },

        ]

        const state = reactive({
            info: {},
            currentTab: {
                label: t('competition.rankOfProfit'),
                value: 1
            },
            list: [],
            list1: [],
            list2: [],
            loading: true,
            isFetch: false,
            trades: [],
            columns: [
                {
                    label: t('competition.rank'),
                    prop: 'rank',
                    width: 130,
                    align: 'left',

                },
                {
                    label: t('competition.player'),
                    prop: 'avatar',
                    width: 180,
                    align: 'left',

                },

                {
                    label: t('competition.country'),
                    prop: 'country',
                    width: 210,
                    align: 'left',

                },
                {
                    label: t('competition.profit', { unit: 'USDT' }),
                    prop: 'profit',
                    align: 'center',

                },
                {
                    label: t('competition.reward', { unit: 'USDT' }),
                    prop: 'reward',
                    align: 'right',

                }
            ],
            myRank1: 0,
            myRank2: 0,
            myRank: 0,
            myRankInfo: {},
            timer: null
        })
        const newUserInfo = computed(() => store.state._user.newUserInfo || {})
        const customerId = computed(
            () => store.state._user.customerInfo.id
        )
        const countryList = computed(() => store.state.countryListAll)
        const myCountry = computed(() => {
            const countryInfo = countryList.value.find((o) => o.code === newUserInfo.value.Country)
            const { displayName } = countryInfo || {}
            return displayName || ''
        })
        const getCountryName = (code) => {
            if (isEmpty(code)) return ''
            const countryInfo = countryList.value.find((o) => o.code === code)
            const { displayName } = countryInfo || {}
            return displayName || ''
        }

        const changeTabIndex = (item) => {
            const { value } = item || {}
            if (value === state.currentTab.value) return
            state.currentTab = item
        }

        const getRank = () => {
            const body = {
                ID: Number(id)
            }
            GetRankByActiveID({ body }).then(res => {
                const { Data, Code } = res || {}
                if (Code === 1000) {
                    const { ProfitRank, ProfitRateRank, Rank, RateRank } = Data || {}
                    state.myRankInfo = ProfitRank.find(item => item.CustomerId === customerId.value)
                    state.list = ProfitRank
                    state.list1 = ProfitRank
                    state.list2 = ProfitRateRank
                    state.myRank1 = Rank
                    state.myRank2 = RateRank
                }
                state.loading = false
            }).catch(err => {
                state.loading = false
            })
        }

        const getDetails = () => {
            getAcitiveDetail({ body: { ID: Number(id) } }).then(res => {
                const { Code, Data } = res || {}
                if (Code === 1000) {
                    if (![10, 20].includes(Data.Status)) {
                        clearInterval(state.timer)
                    }
                    state.info = Data
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
            })
        }

        const finish = debounce(() => {
            getDetails()
        }, 2000)

        const tradeNow = () => {
            try {
                const symbolId = JSON.parse(state.trades[0].Extra).SymbolId
                router.push({
                    path: '/order',
                    query: {
                        tradeType: 2,
                        symbolId
                    }
                })
            } catch (e) {
                router.push({
                    path: '/order',
                })
            }
        }

        watch([() => state.currentTab, () => state.list1], (n) => {
            const { value } = n[0] || {}
            state.list = value === 1 ? state.list1 : state.list2
            state.myRank = value === 1 ? state.myRank1 : state.myRank2
        }, { immediate: true })

        onMounted(() => {
            if (!id) {
                router.go(-1)
                return
            }
            store.dispatch('getCountryListByParentCode')
            getRank()
            getDetails()
            // 每10秒刷新数据
            state.timer = setInterval(() => {
                getRank()
                getDetails()
            }, 10000)
        })

        onUnmounted(() => {
            clearInterval(state.timer)
        })

        return {
            cdnUrl,
            isEmpty,
            firstPlace,
            secondPlace,
            thirdPlace,
            defaultAvatar,
            changeTabIndex,
            tabsList,
            getDetails,
            cupBg,
            tradeNow,
            newUserInfo,
            customerId,
            finish,
            getCountryName,
            myCountry,
            ...toRefs(state)
        }
    }
}
</script>

<style scoped lang="scss">
//second place
@import "@/sass/country_currency.scss";
.page-competition{
    flex:1;
    background: var(--contentColor);
    display: flex;
    flex-direction: column;
    align-items: center;
    .trade-now {
      width: auto;
      padding: 0 16px;
      border-radius: 6px;
      background-color: #ed7141;
      border-color: #ed7141;
    }
    .my-mark {
      position: absolute;
      background: linear-gradient(90deg, rgba(240, 126, 69), rgba(249, 171, 81));
      z-index: 2;
      width: 70px;
      text-align: center;
      height: 40px;
      color: #fff;
      font-size: 12px;
      left: -47px;
      top: -35px;
      transform: rotate(-45deg);
      &::after {
        content: '';
        background: url('~@/assets/my.png') no-repeat center center;
        width: 12px;
        height: 12px;
        display: block;
        position: absolute;
        bottom: 3px;
        left: 27px;
        transform: rotate(45deg);
        background-size: 100%;
      }
    }

    .competition-main{
        width: 100%;
        max-width: 1027px;
        padding: 37px 30px;
        display: flex;
        flex-direction: column;
        align-items: center;
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
                padding-left:130px;
                display: flex;
                flex-direction: column;
                justify-content: center;
                .rest-round{
                    font-size: 20px;
                    line-height: 20px;
                    color: var(--contentColor);
                    opacity: 0.5;
                    display:flex;
                    &>span{
                        margin-right:5px;
                    }
                    :deep{
                        .el-statistic__number{
                            color:var(--contentColor);
                            font-size: 16px;
                        }
                    }
                }
                .current-prize{
                    font-weight: 600;
                    font-size: 24px;
                    line-height: 20px;
                    color: var(--contentColor);
                    margin-top:10px;
                }
            }
        }

        .rank-box{
            padding-top:30px;
            width: 100%;
            .loading{
                padding: 30px 0;
                &.first{
                    padding: 115px 0;
                }
            }
            .dropdown-link{
                display: flex;
                align-items: center;
                font-size: 16px;
                color:var(--mainColor);
                cursor: pointer;
                &>span{
                    margin-right: 8px;
                }
            }
            .rank-table{
                margin-top:20px;
                width: 100%;
                overflow-x: auto;
                //min-height: 300px;
                table{
                    width: 967px;
                    margin: 0 auto;
                    tbody{
                        tr{
                            background: var(--contentColor);
                            &:hover{
                                background: var(--lineColor);
                            }
                        }
                    }
                    th{
                        padding: 0 15px;
                        height: 33px;
                        background:var(--colorfa);
                        font-weight: 400;
                        font-size: 14px;
                        color:#646464;
                    }
                    td{
                       // background: var(--contentColor);
                        padding: 0 15px;
                        height: 53px;
                        border-bottom: 1px solid var(--lineColor);
                    }
                    .my-race {
                      background-color: #FEF7F5;
                    }
                    .rank-col{
                        width:24px;
                        height: 20.5px;
                        position: relative;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        .rank-bg{
                            position: absolute;
                            top:0;
                            left:0;
                            width: 24px;
                            height: 20.5px;
                            display: block;
                        }
                        .rank-span{
                            position: relative;
                            color:var(--contentColor);
                            font-size: 14px;
                        }
                        .rank-normal{
                            position: relative;
                            color:var(--mainColor);
                            font-size: 14px;
                        }
                    }
                    .player-col{
                        display: flex;
                        align-items: center;
                        .avatar{
                            width:36px;
                            height:36px;
                            display: block;
                            margin-right:8px;
                            :deep{
                                img{
                                    width:100%
                                }
                            }
                        }
                        .nick-name{
                            color:var(--mainColor);
                            font-size: 14px;
                            @include ellipsis;
                        }
                    }
                    .country-col{
                        display: flex;
                        align-items: center;
                        .country-span{
                            font-size:14px;
                            color:var(--mainColor);
                            margin-left:8px
                        }
                        .icon-country{
                            width:20px;
                            height: 12px;
                        }
                    }
                    .profit-col,.reward-col{
                        color: #0F9B70;
                        font-size:16px
                    }
                }

            }
        }
        .rules{
            display: flex;
            padding: 20px 0;
            .rules-btn{
                padding:0 10px;
                background: #FEF7F5;
                height: 34px;
                border-radius: 5px;
                position: relative;
                display: flex;
                align-items: center;
                color: #EA653F;
                font-size: 14px;
                cursor: pointer;
                &>span{
                    padding: 0 10px;
                }
            }
        }
    }
}
</style>
