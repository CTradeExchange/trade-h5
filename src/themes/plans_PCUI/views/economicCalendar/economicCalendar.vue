<template>
    <router-view />
    <Loading :show='loading' />
    <div class='calendar-page'>
        <div class='detaill-age'>
            <template v-if='!loading'>
                <div class='page-title'>
                    {{ info.Title }}
                </div>
                <div class='publish-time'>
                    <div>
                        <span>{{ $t('news.releaseDate') }}</span>
                        <span>{{ publishTime }}</span>
                    </div>
                    <div class='subcribe-btn' @click='switchSubcribeItem'>
                        <img :src='isSubscribe?subscribeYes:subscribeNo' />
                    </div>
                </div>
                <ValueVard :data='description' />
                <div class='detail-content' v-html='info.Content'>
                </div>
            </template>
            <ChartCard :list='list.slice(0,10)' />
            <!-- <EventsCard :data='list' :more='totalPage > page'  /> -->
            <EventsCard :data='list' :more='totalPage > page' @loadMore='loadMore' />
            <ComCountdown :data='raceInfo' @click='$router.push(`/competition?id=${raceInfo.ID}`)' @finish="getActiveList" />
            <TradeCard :trades='trades' />
            <NewsCard :info='info' />
        </div>
    </div>
    <el-dialog v-model='showDialog' center :title="$t('news.createReminder')" :width='550'>
        <div class='modal-body'>
            <div class='label'>
                {{ $t('news.setTime') }}
            </div>
            <el-select v-model='RemindTime'>
                <el-option v-for='item in options' :key='item.value' :label='item.text' :value='item.value' :value-key='item.value' />
            </el-select>
            <div class='confirm-btn' @click='handleSubscribe'>
                <span>{{ $t('compLang.OK') }}</span>
            </div>
        </div>
    </el-dialog>
</template>

<script>
import { reactive, toRefs, onMounted, computed, watch } from 'vue'
import { getCookie, isEmpty } from '@/utils/util'
import dayjs from 'dayjs'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { GetItemForCalendarByID, SubscribeItem, UnsubscribeItem, getAcitiveListByItemID } from '@/api/newApi'
import ValueVard from './components/ValueCard.vue'
import ChartCard from './components/ChartCard.vue'
import EventsCard from './components/EventsCard.vue'
import TradeCard from '@planspc/views/infoDetail/components/RelatedProductListCard.vue'
import NewsCard from '@planspc/views/infoDetail/components/NewsCard.vue'
import subscribeNo from '@/assets/newPCUI/subscribe-no.png'
import subscribeYes from '@/assets/newPCUI/subscribe-yes.png'
import { useStore } from 'vuex'
import cupBg from '@planspc/views/competition/assets/cup-bg.png'
import ComCountdown from '@planspc/components/competitionCountdown.vue'
import { Toast } from 'vant'
export default {
    components: {
        ValueVard,
        ChartCard,
        EventsCard,
        TradeCard,
        NewsCard,
        ComCountdown
    },
    setup () {
        const store = useStore()
        const route = useRoute()
        const router = useRouter()
        const { t } = useI18n({ useScope: 'global' })
        const state = reactive({
            info: {},
            list: [],
            trades: [],
            totalPage: 0,
            description: {},
            page: 1,
            limit: 10,
            loading: false,
            isSubscribe: false,
            showDialog: false,
            RemindTime: 0,
            ItemSubscribe: {},
            raceInfo: {},
            prize: 0,
            hasRace: false,
            countDownTime: 0
        })

        const newsMessage = computed(() => store.state._user.newsMessage)

        const updateData = (obj) => {
            if (isEmpty(obj)) return
            const { type, data } = obj || {}
            const { Source, SourceURL, PublishTime, Description, ItemID } = data || {}
            if (type === 'update') {
                if (Number(ItemID) !== Number(route?.query?.id)) return
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
                obj1.text = item[lang] || item['en-US']
                return obj1
            })
            return res
        })

        const customerInfo = computed(() => store.state._user.customerInfo)

        const publishTime = computed(() => dayjs(state.info.PublishTime * 1000).format('YYYY-MM-DD HH:mm:ss'))

        const getDetail = () => {
            const body = {
                Limit: state.limit,
                Offset: state.page,
                ItemID: Number(route?.query?.id),
                Language: getCookie('lang') || 'en-US'
            }
            state.loading = true
            GetItemForCalendarByID({ body }).then((res) => {
                const { ItemLanguage, TotalPage, Trades, SupportedLanguages } = res || {}
                state.info = ItemLanguage
                const { Description, ItemLanguageHistories, Source, SourceURL, PublishTime, ItemSubscribe } = ItemLanguage || {}
                state.ItemSubscribe = ItemSubscribe || {}
                if (customerInfo.value?.id === state.ItemSubscribe?.UserID) {
                    state.isSubscribe = true
                }
                const description = getDescObj(Description)
                state.description = Object.assign(description, { Source, SourceURL, PublishTime })
                state.trades = Trades || []
                state.totalPage = TotalPage
                if (!isEmpty(ItemLanguageHistories)) {
                    state.list = state.list.concat(ItemLanguageHistories)
                }
                state.loading = false
                store.commit('_base/Update_supportedLanguages', SupportedLanguages)
            }).catch(err => {
                state.loading = false
            })
        }

        const getActiveList = () => {
            const body = { ItemID: Number(route?.query?.id) }
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

        const getDescObj = (str) => {
            if (!str) return {}
            return JSON.parse(str)
        }

        const loadMore = () => {
            state.page += 1
            getDetail()
        }

        const switchSubcribeItem = () => {
            if (isEmpty(customerInfo.value)) {
                router.push(`/login?back=economicCalendar?id=${route?.query?.id}`)
                return
            }
            if (state.isSubscribe) {
                // 取消订阅
                const body = { ItemID: Number(route?.query?.id), RemindTime: state.RemindTime }
                UnsubscribeItem({ body }).then(res => {
                    if (res.Code === 1000) {
                        state.isSubscribe = false
                    }
                })
            } else {
                state.showDialog = true
            }
        }

        const handleSubscribe = () => {
            const body = {
                ItemID: Number(route?.query?.id),
                RemindTime: state.RemindTime, Language: getCookie('lang') || 'en-US'
            }
            state.showDialog = false
            SubscribeItem({ body }).then(res => {
                if (res.Code === 1000) {
                    state.isSubscribe = true
                    Toast(t('competition.SubscribeSuccessful'))
                }
            }).catch(({ Msg }) => {
                Toast(Msg)
            })
        }

        watch(() => route.query, (newVal) => {
            if (newVal?.id) {
                getDetail()
                getActiveList()
            }
        }, { immediate: true })

        onMounted(() => {
            if (!route?.query?.id) {
                router.go(-1)
            }
        })

        return {
            cupBg,
            options,
            handleSubscribe,
            switchSubcribeItem,
            subscribeNo,
            subscribeYes,
            loadMore,
            publishTime,
            getActiveList,
            ...toRefs(state)
        }
    }
}
</script>

<style scoped lang="scss">
.calendar-page{
    background: var(--contentColor);
    padding-bottom: 30px;
}
.detaill-age{
    max-width: 960px;
    padding: 0 30px;
    margin:0 auto;
    .page-title{
        font-size: 30px;
        font-weight: 500;
        color:var(--mainColor);
        text-align: center;
        padding: 60px 0 25px 0;

    }
    .publish-time{
        display: flex;
        justify-content: space-between;
        align-items: center;
        .subcribe-btn{
            width:21px;
            height: 22px;
            cursor: pointer;
            &>img{
                width: 100%;
                height: auto;
            }
        }
        span{
            font-size: 12px;
            &:first-of-type{
                color:var(--color50);
            }
            &:last-of-type{
                color:var(--colorac);
                margin-left:8px;
            }
        }
    }
    .detail-content{
        color: var(--color50);
        font-size: 14px;
        line-height: 24px;
        padding: 15px 0;
    }
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
}
.modal-body{
    padding: 20px 50px 0 50px;
    .label{
        font-size: 18px;
        line-height: 22px;
        color:var(--mainColor);
        margin-bottom:15px;
    }
    :deep{
        .el-select{
            width: 100%;
        }
        .el-input__inner{
            height: 45px;
        }
    }
    .confirm-btn{
        width: 300px;
        margin:60px auto 0 auto;
        height:45px;
        display: flex;
        align-items: center;
        justify-content: center;
        color:var(--contentColor);
        font-size: 16px;
        background: var(--primary);
        border-radius: 4px;
        cursor: pointer;
    }
}
</style>
