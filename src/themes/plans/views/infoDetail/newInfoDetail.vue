<template>
    <div class='infoDetailBox'>
        <LayoutTop v-if='!isUniapp' :title="$t('news.hotTopicTitle')" />
        <loading :show='loading' />
        <div v-if='info?.ContentType === 1' class='detailPage'>
            <TitleCard :info='info' />
            <ContCard :info='info' @viewPoint='viewPoint' />
            <ComCoundown v-if='hasRace' :data='raceInfo' @click='$router.push(`/competition?id=${raceInfo.ID}`)' />
            <TradeList class='trade-card' :trades='info.Trades' />
            <NewsCard class='news-card' :info='info' />
        </div>
        <div v-else-if='info?.ContentType === 2' id='iframebBodyID' class='iframe-body'>
            <EmbedIframe v-if='detail.EmbedLink' :extra='detail.EmbedExtra' :link='detail.EmbedLink' :refresh='refreshFlag' :source='detail.EmbedSource' />
            <NewTradeList
                v-model:showBlockAtm='showBlockAtm'
                :embed='info.EmbedButton'
                :trades='info.Trades'
                @changeDom='refreshFlag = refreshFlag + 1'
                @openBlockAtm='confirmOpenBlockAtm'
            />
        </div>
    </div>
    <blockAtmDialog ref='blockAtmDialogRef' />
</template>

<script>
import { GetItemByID, postViewPoint, getAcitiveListByItemID } from '@/api/newApi'
import { getCookie, getPathParams, isEmpty } from '@/utils/util.js'
import { toRefs, reactive, computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'

import TitleCard from './components/TitleCard.vue'
import ContCard from './components/ContCard.vue'
import NewsCard from './components/NewsCard.vue'
import NewTradeList from './components/NewTradeList'
import TradeList from '@plans/components/TradeList'
import ComCoundown from '@plans/components/competitionCoutdown.vue'
import EmbedIframe from '@/components/embedIframe.vue'
import blockAtmDialog from '@/components/blockAtmDialog'
import { firebaseAnalytics } from '@/utils/firebase'

export default {
    components: {
        TitleCard,
        ContCard,
        NewsCard,
        TradeList,
        ComCoundown,
        EmbedIframe,
        NewTradeList,
        blockAtmDialog,
    },
    setup () {
        const store = useStore()
        const route = useRoute()
        const router = useRouter()
        const { id } = route.query || {}
        const blockAtmDialogRef = ref(null)
        const { isUniapp } = getPathParams()
        const state = reactive({
            loading: true,
            info: {},
            newsPage: 1,
            newsList: [],
            raceInfo: {},
            hasRace: false,
            countDownTime: 0,
            prize: 0,
            refreshFlag: 1,
            showBlockAtm: false
        })

        const customerInfo = computed(
            () => store.state._user.customerInfo
        )
        // watch(
        //     () => state.showBlockAtm,
        //     (newVal) => {
        //         if (newVal) {
        //             confirmOpenBlockAtm()
        //         }
        //     }
        // )
        const accountList = computed(() =>
            store.state._user.customerInfo.accountList.filter((el) => Number(el.tradeType) === Number(tradeType.value)),
        )

        // 获取玩法列表
        const plans = computed(() => store.state._base.plans)
        // 是否模拟账户
        const isDemo = computed(() => {
            return store.state._user.customerInfo?.companyType === 'demo'
        })

        const tradeType = computed(() => (isDemo.value ? plans.value[0].id : 5)) // 和移动端一样写死玩法5

        const confirmOpenBlockAtm = () => {
            // window.dataLayer.push({
            //     event: 'depositBtn',
            //     'gtm.elementClasses': 'depositButton',
            //     eventModel: {
            //         'account_Number': customerInfo.value?.customerNo
            //     }
            // })
            firebaseAnalytics('ck_deposit_entrance', {
                key: 'ck_deposit_entrance',
                value: JSON.stringify({
                    email: customerInfo.value?.emailAll || customerInfo.value?.email || '',
                    phone: customerInfo.value?.phoneAll || customerInfo.value?.phone || '',
                    userID: customerInfo.value?.customerNo,
                }),
            })

            // 直接默认USDT，默认交易模式是5
            const accountList = store.state._user.customerInfo.accountList.filter((el) => Number(el.tradeType) === 5)
            const { accountId } = accountList.find((e) => e.currency === 'USDT') || {}
            // 判断pc端h5端
            if (window.isPC) {
                const url = route.path + '/' + 'recharge'
                const search = `?accountIds=${accountId}&currencys=USDT&tradeTypes=5`
                router.push(url + search)
            } else {
                router.push({
                    path: '/deposit'
                })
            }

            // blockAtmDialogRef.value.open()
        }

        const detail = computed(() => {
            const language = getCookie('lang') || 'en-US'
            const { ItemLanguages } = state.info
            const currentItem = !isEmpty(ItemLanguages) ? ItemLanguages.find(i => i.Language === language) ? ItemLanguages.find(i => i.Language === language) : ItemLanguages[0] : {}
            const { EmbedLink, EmbedExtra, EmbedSource } = currentItem || {}
            return { EmbedLink, EmbedExtra, EmbedSource }
        })

        const getInfo = (ID) => {
            state.loading = true
            GetItemByID({ body: { ID: Number(ID), Language: getCookie('lang') || 'en-US' } }).then((res) => {
                const { Item } = res || {}
                state.info = Item
                state.loading = false
            }).catch(err => {
                state.loading = false
            })
        }

        const viewPoint = (ID) => {
            if (!ID) return
            const { customerNo } = customerInfo?.value || {}
            if (!customerNo) {
                router.push(`/login?back=infoDetail?id=${id}`)
                return
            }
            postViewPoint({ body: { ID } }).then((res) => {
                if (res.Code === 1000) {
                    getInfo(id)
                }
            })
        }

        const getActiveList = () => {
            const body = { ItemID: Number(id) }
            getAcitiveListByItemID({ body }).then(res => {
                const { Code, Data } = res || {}
                if (Code === 1000) {
                    state.raceInfo = Data[0] || {}
                    state.prize = Data[0]?.RewardsPool + Data[0]?.RewardsPoolOther
                    if (!isEmpty(state.raceInfo)) {
                        state.hasRace = true
                        state.countDownTime = state.raceInfo.EndTime - new Date().getTime()
                    } else {
                        state.hasRace = false
                    }
                }
            })
        }

        onMounted(() => {
            if (!id) {
                router.go(-1)
                return
            }
            getActiveList()
            getInfo(id)
        })

        return {
            detail,
            isUniapp,
            viewPoint,
            blockAtmDialogRef,
            confirmOpenBlockAtm,
            ...toRefs(state)
        }
    }
}
</script>

<style scoped lang="scss">
.infoDetailBox {
    height: 100%;
    display: flex;
    flex-direction: column;
}
.loading-box{
    flex:1;
    display: flex;
    align-items: center;
    justify-content: center;
}
.iframe-body {
    flex: 1;
    padding-top: rem(2px);
    height: calc(100% - rem(110px));
    overflow: hidden;
    box-sizing: border-box;
    background: #fff;
    .iframe-box-other {
        padding: 0 rem(20px) rem(20px);
    }
    &::-webkit-scrollbar {
        display: none;
    }
}
.detailPage{
    .trade-card{
        padding:rem(20px);
    }
    .news-card{
        padding:rem(20px)
    }
    .cup-bg{
        position: relative;
        margin:  rem(20px);
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
            }
        }
    }
}
.headerTop {
    height: rem(110px);
}

</style>
