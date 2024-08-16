<template>
    <LayoutTop
        bottomLine
        :title="$t('news.financialEvent')"
    >
        <template #right>
            <div class='top-right-btn' @click='switchSubcribeItem'>
                <img :src='isSubscribe?subscribeYes:subscribeNo' />
            </div>
        </template>
    </LayoutTop>
    <div v-if='loading' class='loading-box'>
        <van-loading type='spinner' />
    </div>
    <div v-else class='economicCalendar'>
        <div class='wrapper'>
            <div class='title'>
                {{ info.Title }}
            </div>
            <ValueCard :data='description' />
            <ExtraCard :data='info' />
            <div v-if='info.Content' class='content' v-html='info.Content'></div>

            <ChartCard :list='list.slice(0, 8)' />

            <EventList
                :list='list'
                :more='totalPage > page'
                @loadMore='handleLoadMore'
            />
            <ComCoundown v-if='hasRace' :data='raceInfo' @click='$router.push(`/competition?id=${raceInfo.ID}`)' />
            <TradeList :trades='trades' />
            <NewsList :info='info' />
        </div>
        <van-popup v-model:show='showPopup' closeable @close='handleClose'>
            <div class='modal-content'>
                <div class='modal-head'>
                    <span>{{ $t('news.createReminder') }}</span>
                </div>
                <h4>{{ $t('news.setTime') }}</h4>
                <div class='modal-select' @click='handleShowSelect'>
                    <div class='select-content'>
                        <span>{{ currentOption.name }}</span>
                        <van-icon name='arrow-down' />
                    </div>
                </div>
                <div class='modal-bottom'>
                    <div class='confirm-btn' @click='handleSubscribe'>
                        <span>{{ $t('compLang.OK') }}</span>
                    </div>
                </div>
            </div>
        </van-popup>
    </div>
    <van-action-sheet v-model:show='show' :actions='options' @select='onSelect' />
    <!-- <Loading :show='loadingSubscribe' /> -->
</template>

<script>
import { toRefs, reactive, onMounted, ref, computed, watch } from 'vue'
import { getCookie, isEmpty } from '@/utils/util'
import { useRoute, useRouter } from 'vue-router'
import { GetItemForCalendarByID, SubscribeItem, UnsubscribeItem, getAcitiveListByItemID } from '@/api/newApi'
import dayjs from 'dayjs'
import ValueCard from './components/ValueCard.vue'
import ExtraCard from './components/ExtraCard.vue'
import EventList from './components/EventList.vue'
import NewsList from './components/NewsList.vue'
import TradeList from '@plans/components/TradeList'
import ChartCard from './components/ChartCard.vue'
import subscribeNo from '@/assets/newPCUI/subscribe-no.png'
import subscribeYes from '@/assets/newPCUI/subscribe-yes.png'
import { useStore } from 'vuex'
import ComCoundown from '@plans/components/competitionCoutdown.vue'
import { Toast } from 'vant'
import { useI18n } from 'vue-i18n'
export default {
    components: {
        ValueCard,
        ExtraCard,
        EventList,
        NewsList,
        TradeList,
        ChartCard,
        ComCoundown
    },
    setup () {
        const { t } = useI18n({ useScope: 'global' })
        const store = useStore()
        const router = useRouter()
        const route = useRoute()
        const { id } = route.query || {}
        const state = reactive({
            lang: getCookie('lang') || 'en-US',
            isEmpty,
            id,
            item: {},
            info: {},
            page: 1,
            limit: 10,
            list: [],
            totalPage: 0,
            description: {},
            countryCode: '',
            dayjs,
            more: false,
            trades: [],
            isSubscribe: false,
            loading: true,
            showPopup: false,
            curOptionIndex: 0,
            loadingSubscribe: false,
            RemindTime: 0,
            ItemSubscribe: {},
            show: false,
            currentOption: {},
            raceInfo: {},
            hasRace: false,

        })

        const newsMessage = computed(() => store.state._user.newsMessage)

        const updateData = (obj) => {
            if (isEmpty(obj)) return
            const { type, data } = obj || {}
            const { Source, SourceURL, PublishTime, Description, ItemID } = data || {}
            if (type === 'update') {
                if (Number(ItemID) !== Number(id)) return
                const description = getDescObj(Description)
                state.description = Object.assign(description, { Source, SourceURL, PublishTime })
            }
        }

        watch(() => newsMessage.value, (n) => {
            updateData(n)
        }, { immediate: true, deep: true })

        const options = computed(() => {
            const lang = getCookie('lang') || 'en-US'
            const newsSysConfig = store.state._base.newsSysConfig
            const obj = (newsSysConfig || []).find(i => i.Key === 'subscribeItem')
            const { Value } = obj || {}
            const arr = (Value && JSON.parse(Value)) || []
            const res = arr.map(item => {
                const obj1 = {}
                obj1.value = item.key
                obj1.name = item[lang] || item['en-US']
                return obj1
            })
            return res
        })

        const customerInfo = computed(() => store.state._user.customerInfo)

        const getDetail = () => {
            const body = {
                limit: state.limit,
                offset: state.page,
                ItemID: Number(id),
                Language: getCookie('lang') || 'en-US'
            }
            if (state.page <= 1) state.loading = true
            GetItemForCalendarByID({ body }).then((res) => {
                const { ItemLanguage, TotalPage, Trades } = res || {}
                const { Description, ItemLanguageHistories, ItemSubscribe } = ItemLanguage || {}
                if (state.page <= 1) {
                    state.info = ItemLanguage
                    state.ItemSubscribe = ItemSubscribe || {}
                    if (customerInfo.value?.id === state.ItemSubscribe?.UserID) {
                        state.isSubscribe = true
                    }
                    state.description = getDescObj(Description)
                    state.trades = Trades || []
                }
                if (!isEmpty(ItemLanguageHistories)) {
                    state.list = state.list.concat(ItemLanguageHistories)
                }
                state.totalPage = TotalPage
                state.loading = false
            }).catch(err => {
                state.loading = false
            })
        }

        const getActiveList = () => {
            const body = { ItemID: Number(id) }
            getAcitiveListByItemID({ body }).then(res => {
                const { Code, Data } = res || {}
                if (Code === 1000) {
                    state.raceInfo = Data[0] || {}
                    if (!isEmpty(state.raceInfo)) {
                        state.hasRace = true
                    } else {
                        state.hasRace = false
                    }
                }
            })
        }

        const handleLoadMore = () => {
            state.page += 1
            getDetail()
        }

        const getDescObj = (desc) => {
            if (!desc) {
                return {}
            }

            return JSON.parse(desc)
        }

        const formatTimeList = (time) => {
            if (!time) return
            return dayjs(time * 1000).format('HH:mm')
        }

        const switchSubcribeItem = () => {
            if (isEmpty(customerInfo.value)) {
                router.push(`/login?back=economicCalendar?id=${id}`)
                return
            }
            const RemindTime = options.value[state.curOptionIndex]?.key
            if (state.isSubscribe) {
                // 取消订阅操作
                const body = { ItemID: Number(id), RemindTime }
                UnsubscribeItem({ body }).then(res => {
                    if (res.Code === 1000) {
                        state.isSubscribe = false
                    }
                })
            } else {
                state.showPopup = true
            }
        }

        const handleShowSelect = () => {
            state.show = true
        }

        const onSelect = (e) => {
            state.currentOption = e
            state.show = false
        }

        const handleSubscribe = () => {
            const RemindTime = state.currentOption.value
            // 订阅操作后关闭popup
            state.showPopup = false
            state.loadingSubscribe = true
            const body = { ItemID: Number(id), RemindTime, Language: getCookie('lang') || 'en-US' }
            SubscribeItem({ body }).then(res => {
                state.loadingSubscribe = false
                if (res.Code === 1000) {
                    state.isSubscribe = true
                    Toast(t('competition.SubscribeSuccessful'))
                }
            }).catch(({ Msg }) => {
                Toast(Msg)
                state.loadingSubscribe = false
            })
        }

        watch(() => options.value, (n) => {
            if (isEmpty(n)) return
            state.currentOption = n[0]
        }, {
            immediate: true
        })

        onMounted(() => {
            if (!id) {
                router.go(-1)
                return
            }
            getDetail()
            getActiveList()
        })
        return {
            onSelect,
            options,
            handleSubscribe,
            handleShowSelect,
            switchSubcribeItem,
            subscribeNo,
            subscribeYes,
            handleLoadMore,
            formatTimeList,
            getDescObj,
            ...toRefs(state)
        }
    }
}
</script>

<style lang="scss" scoped>
@import "@/sass/mixin.scss";
@import "@/sass/country_currency.scss";
.loading-box{
    flex:1;
    display: flex;
    align-items: center;
    justify-content: center;
}
.top-right-btn{
    height: 100%;
    display: flex;
    align-items: center;
    &>img{
        width:rem(42px);
        height: rem(44px);
    }
}
.economicCalendar {

    background: var(--contentColor);
    padding-bottom: rem(40px);
    .headerTop {
        height: rem(110px);
    }
    .wrapper {
        flex: 1;
        padding: rem(40px) rem(30px) 0 rem(30px);
        background: var(--contentColor);
        .title {
            font-size: rem(48px);
            font-weight: bold;
        }
        .content {
            margin-top: rem(20px);
            font-size: rem(28px);
            line-height: rem(44px);
            color: var(--color50);
            padding-top: rem(20px);
            border-top: rem(2px) solid var(--cardBg);
        }
    }
    :deep{
        .van-popup{
            overflow-y: unset;
        }
        .van-popup--center{
            border-radius: rem(16px)
        }
    }
    .cup-bg{
        position: relative;
        margin:  rem(20px) 0;
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
}

.modal-content{
    width:rem(670px);
    padding:rem(40px) rem(35px) rem(60px) rem(35px);
    border-radius: rem(16px);
    .modal-head{
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: rem(36px);
        font-weight:600
    }
    &>h4{
        padding:rem(60px) 0 rem(30px) 0;
        font-size: rem(32px);
        font-weight: normal;
    }
    .modal-select{
        padding:0 rem(30px);
        border-radius: rem(10px);
        border:1px solid #ebebeb;
        height: rem(90px);
        position: relative;
        display: flex;
        align-items: center;
        .select-content{
            display: flex;
            justify-content: space-between;
            width: 100%;
            &>span{
                flex:1;
            }
        }
        .dropdown{
            position: absolute;
            width: 100%;
            box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.15);
            background: var(--contentColor);
            top:rem(100px);
            left:0;
            overflow-y: auto;
            border-radius: rem(10px);
            max-height: rem(540px);
            li{
                display: flex;
                align-items: center;
                padding: 0 rem(30px);
                height: rem(90px);
                color:var(--mainColor);
                font-size:rem(28px);
                border-top: 1px solid var(--lineColor);
                &:first-of-type{
                    border-top:none
                }

            }
        }
    }
    .modal-bottom{
        padding-top:rem(140px);
        .confirm-btn{
            display: flex;
            justify-content: center;
            align-items: center;
            height: rem(90px);
            color:var(--contentColor);
            font-size: rem(28px);
            background: var(--primary);
            border-radius: rem(8px);
        }
    }
}

</style>
