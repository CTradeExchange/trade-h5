<template>
    <router-view />
    <div class='apiInfo'>
        <van-notice-bar
            v-if='isShowIcon'
            background='#9d9d9d'
            class='notice-bar'
            color='#fff'
            left-icon='volume-o'
            mode='closeable'
            :scrollable='true'
            :text='notice.title'
            @click='goNoticeDetail(notice.id)'
            @close.stop='show = false'
        />
        <div
            class='header'
            :style="{ '--bgImg': `url(${topicItem.CoverPC || topicItem.CoverURL})` }"
        >
            <!-- <img class='top-image' :src='topicItem.CoverURL' /> -->
            <div
                class='headerBg'
                onclick="dataLayer.push({'event': 'clickRate', 'gtm.elementId': 'click_home_banner' });"
                @click='handleClickBanner2(topicItem)'
            >
                <ComCountdown
                    :data='getTActivityForItem(topicItem.TActivitySetting).data'
                    @finish='getTopicData'
                />
                <!--<div class='headerRace'>
              <div class='raceBtn'>
                  <img :src='raceCupImg' />
                  <span>{{ $t('competition.progressing') }}</span>
              </div>
          </div>-->
                <div v-if='bannerLive.includes(topicItem.ItemID)' class='swipe-live mt-4'>
                    <img alt='' src='../../../../assets/newUI/live.gif' />
                </div>
                <div class='headerTitle'>
                    <span>{{ topicItem.Title }}</span>
                    <!--<span>{{ `${$t("bannerTopic.title")}` }}</span>-->
                </div>
                <TradeBtn :trades='topicItem.Trades' />
            </div>
        </div>
        <div class='home-container'>
            <div v-if='isShowTopicList' class='selected-events'>
                <div class='selected-events-title'>
                    {{ $t("news.selectedEvents") }}
                </div>
                <div class='events-box'>
                    <div
                        v-for='item in topicList'
                        :key='item.ID'
                        class='event-item'
                        @click='handleClickBanner(item)'
                    >
                        <img class='event-image' :src='item.CoverURL' />
                        <div class='event-item-content'>
                            <div class='content-bg'>
                                <div class='listRace'>
                                    <ComCountdown
                                        :data='getTActivityForItem(item.TActivitySetting).data'
                                    />
                                </div>
                                <div class='event-item-title'>
                                    {{ item.Title }}
                                </div>
                                <TradeBtn position='center' :trades='item.Trades' />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <CalendarCard />
        </div>
        <NoticePublic />
        <el-dialog
            v-model='noticeOpen'
            align-center
            class='notice-modal'
            :close-on-click-modal='false'
            :close-on-press-escape='false'
            onclick="dataLayer.push({'event': 'clickRate', 'gtm.elementId': 'click_home_popup' });"
            :show-close='false'
            :width='600'
        >
            <div
                onclick="dataLayer.push({'event': 'clickRate', 'gtm.elementId': 'click_home_popup' });"
                :style="{
                    backgroundImage:
                        'url(' + (bulletinBox?.webBackUrl || bulletinBox?.backUrl) + ')',
                }"
                @click='closeNotice(true)'
            >
                <p>{{ bulletinBox?.lang?.label }}</p>
                <p>{{ bulletinBox?.lang?.text }}</p>
            </div>
            <div
                onclick="dataLayer.push({'event': 'clickRate', 'gtm.elementId': 'click_home_popup' });"
                @click='closeNotice()'
            >
                <el-icon><CloseBold /></el-icon>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { onMounted, toRefs, reactive, watch, computed } from 'vue'
import { GetItems } from '@/api/newApi'
import { getCookie, isEmpty, localGet, localSet, parseJSON } from '@/utils/util'
import TradeBtn from './components/TradeBtn.vue'
import NoticePublic from '@plans/components/noticePublic.vue'
import CalendarCard from './components/CalendarCard/calendar.vue'
import { useStore } from 'vuex'
import { QuoteSocket } from '@/plugins/socket/socket'
import { useRouter } from 'vue-router'
import { getNoticeList } from '@/api/user'
import noticeIcon from '../../images/topNav/notice-icon.png'
import closeIcon from '../../images/topNav/close-icon.png'
import raceCupImg from '../../images/race-cup.png'
import ComCountdown from './components/countDown.vue'
import { last } from 'lodash'

export default {
    components: {
        TradeBtn,
        NoticePublic,
        CalendarCard,
        ComCountdown
    },
    setup () {
        const store = useStore()
        const router = useRouter()
        const state = reactive({
            lang: getCookie('lang') || 'en-US',
            topData: {},
            homeData: [],
            isShowIcon: false,
            notice: {},
            closeIcon,
            noticeIcon,
            raceCupImg,
            currentNt: 1,
            noticeInfo: '',
            noticeOpen: false
        })

        const customInfo = computed(() => store.state._user.customerInfo)
        const newsSysConfig = computed(() => store.state._base.newsSysConfig)
        const eventConfig = computed(() => {
            const result =
                newsSysConfig.value.find((o) => o.Key === 'indexHotEventPC') ||
                {}
            return parseJSON(result.Value) || {}
        })

        const bannerLive = computed(() => {
            const result =
                newsSysConfig.value.find(
                    (o) => o.Key === 'bannerLiveEventID'
                ) || {}
            const value = parseJSON(result?.Value) || {}
            return value?.webPC || []
        })

        const topicItem = computed(() => {
            if (isEmpty(state.homeData)) {
                return {}
            } else {
                const {
                    ID,
                    ItemLanguages,
                    CoverURL,
                    CoverPC,
                    Trades,
                    ExternalLink,
                    TActivitySetting
                } = state.homeData[0] || {}
                return Object.assign(
                    {
                        ItemID: ID,
                        CoverURL,
                        CoverPC,
                        Trades,
                        ExternalLink,
                        TActivitySetting
                    },
                    ItemLanguages[0]
                )
            }
        })

        const getTActivityForItem = (TActivitySetting) => {
            if (isEmpty(TActivitySetting)) {
                return { hasRace: false, data: {} }
            } else {
                const { ID, EndTime, StartTime, Status } = last(TActivitySetting) || {}
                if (ID) {
                    return { hasRace: true, data: { ID, EndTime, StartTime, Status } }
                } else {
                    return { hasRace: false, data: { ID, EndTime, StartTime, Status } }
                }
            }
        }

        const topicList = computed(() => {
            if (isEmpty(state.homeData)) {
                return []
            } else {
                const arr = state.homeData.slice(1, 4).map((item, i) => {
                    const {
                        ItemLanguages,
                        CoverURL,
                        Trades,
                        ExternalLink,
                        TActivitySetting
                    } = item || {}
                    return Object.assign(
                        { CoverURL, Trades, ExternalLink, TActivitySetting },
                        ItemLanguages[0]
                    )
                })
                return arr
            }
        })

        const isShowTopicList = computed(() => !isEmpty(topicList.value))

        const categoryList = computed(() => {
            const userProductCategory = store.getters.userProductCategory
            return (userProductCategory[1] || []).filter(
                (e) => e.listByUser.length
            )
        })
        // 处理只显示玩法2的产品
        const productMap = computed(() => {
            const _productMap = store.state._quote.productMap
            if (!_productMap) return {}
            const productList = {}
            for (const key in _productMap) {
                // eslint-disable-next-line eqeqeq
                if (_productMap[key].tradeType == 2) {
                    productList[key] = _productMap[key]
                }
            }
            return productList
        })

        const { value: bulletinBox } = computed(() => {
            const arr = store.state._base.newsSysConfig
            const obj = arr.find((i) => i.Key === 'bulletinBox') || {}
            state.noticeInfo = obj.Value || ''
            const { lang, ...res } = parseJSON(obj.Value) || {}
            return { ...res, lang: lang[getCookie('lang')] || {} }
        })

        const noticeFlag = computed(() => {
            const info = localGet('fullNoticeInfo')
            const num = isNaN(Number(bulletinBox?.cycleTime))
                ? 0
                : Number(bulletinBox?.cycleTime)
            if (info !== state.noticeInfo && state.noticeInfo) {
                if (currentPopup.value === 'drainaged') {
                    store.commit('_user/Update_currentPopup', 'drainage')
                }
                return true
            }
            if (num <= 0) {
                const flag = !localGet('fullNoticeMark')
                if (
                    flag &&
                    bulletinBox?.state == 1 &&
                    currentPopup.value === 'drainaged'
                ) {
                    store.commit('_user/Update_currentPopup', 'drainage')
                }
                return flag
            }
            const time = Math.floor(
                (localGet('fullNoticeMark') || 0) / (num * 1000)
            )
            const nowTime = Math.floor(Date.now() / (num * 1000))
            if (
                time !== nowTime &&
                bulletinBox?.state == 1 &&
                currentPopup.value === 'drainaged'
            ) {
                store.commit('_user/Update_currentPopup', 'drainage')
            }
            return time !== nowTime
        })

        const currentPopup = computed(() => store.state._user.currentPopup)

        watch(
            () => [currentPopup.value, noticeFlag.value, bulletinBox],
            () => {
                const flag = bulletinBox?.state == 1 && noticeFlag.value
                state.noticeOpen = flag && currentPopup.value === 'drainage'
            }
        )

        watch(
            productMap,
            (n) => {
                if (categoryList.value.length > 0) {
                    const defaultCategoryIndex =
                        categoryList.value.length > 1 ? 1 : 0
                    subscribeAll(categoryList.value[defaultCategoryIndex])
                }
            },
            {
                deep: true
            }
        )

        const closeNotice = (flag) => {
            state.noticeOpen = false
            localSet('fullNoticeMark', Date.now())
            if (state.noticeInfo) localSet('fullNoticeInfo', state.noticeInfo)
            store.commit('_user/Update_currentPopup', 'drainaged')
            if (flag) {
                const url =
                    bulletinBox?.jumpType == 1
                        ? 'infoDetail'
                        : 'economicCalendar'
                router.push(`/${url}?id=${bulletinBox?.jumpValue}`)
            }
        }

        const handleClickBanner = (item) => {
            const { ExternalLink, ItemID } = item || {}
            if (ExternalLink) {
                window.open(ExternalLink)
            } else {
                ItemID &&
                    router.push({
                        name: 'InfoDetail',
                        query: { id: ItemID }
                    })
            }
        }

        const handleClickBanner2 = (item) => {
            const { ExternalLink, ItemID } = item || {}
            if (ExternalLink) {
                window.open(ExternalLink)
            } else {
                ItemID &&
                    router.push({
                        name: 'InfoDetail',
                        query: { id: ItemID }
                    })
            }
        }

        const subscribeAll = (item) => {
            const list = Object.assign([], item.listByUser)
            const tradeType = 1
            const productList = []
            if (Object.keys(productMap.value).length > 0) {
                list.forEach((symbolId) => {
                    const product = productMap.value[`${symbolId}_${tradeType}`]
                    if (product) {
                        productList.push(product)
                    }
                })
                const productKeys = productList.map(
                    (el) => `${el.symbolId}_${el.tradeType}`
                )
                if (productKeys.length > 0) {
                    QuoteSocket.send_subscribe24H(productKeys)
                }
            }
        }

        const getTopicData = () => {
            const { num = 4 } = eventConfig.value || {}
            const body = {
                Limit: num,
                Offset: 1,
                Conditions: {
                    Type: 1,
                    Status: 2,
                    Language: state.lang,
                    SortType: 6,
                    Label: 1
                }
            }
            GetItems({ body })
                .then((res) => {
                    const { List } = res
                    if (!isEmpty(List)) {
                        state.homeData = List
                        localSet('homeData', JSON.stringify(List))
                    } else {
                        const homeDataCache = localGet('homeData')
                        if (!isEmpty(homeDataCache)) {
                            state.homeData = JSON.parse(homeDataCache)
                        }
                    }
                })
                .catch((err) => {
                    const homeDataCache = localGet('homeData')
                    if (!isEmpty(homeDataCache)) {
                        state.homeData = JSON.parse(homeDataCache)
                    }
                })
        }

        const getHomeNoticeList = () => {
            const { companyId, customerNo } = customInfo.value || {}
            const params = { current: state.currentNt, size: 3 }
            if (companyId) {
                params.companyId = companyId
            }
            if (customerNo) {
                params.customerNo = customerNo
            }

            getNoticeList(params)
                .then((res) => {
                    const { data } = res || {}
                    const { records } = data || {}

                    if (!isEmpty(records)) {
                        state.notice = records[0]
                        state.isShowIcon = !isEmpty(state.notice)
                        localSet('noticeCache', JSON.stringify(records[0]))
                    } else {
                        const noticeCache = localGet('noticeCache')
                        if (!isEmpty(noticeCache)) {
                            state.notice = JSON.parse(noticeCache)
                            state.isShowIcon = !isEmpty(state.notice)
                        }
                        state.isShowIcon = false
                    }
                })
                .catch((err) => {
                    const noticeCache = localGet('noticeCache')
                    if (!isEmpty(noticeCache)) {
                        state.notice = JSON.parse(noticeCache)
                        state.isShowIcon = !isEmpty(state.notice)
                    }
                })
        }

        const goNoticeDetail = (id) => {
            router.push({
                path: '/noticeDetail',
                query: {
                    id: id,
                    type: 'notice',
                    from: 'home'
                }
            })
        }

        onMounted(() => {
            getTopicData()
            getHomeNoticeList() // 顶部通知栏
            // 订阅事件推送
        })

        // const jumpPage = (attr) => {
        //     switch (attr) {
        //         case 1 :
        //             window.open('https://www.headline.net/en-US/infoDetail2?id=22356')
        //             break
        //     }
        // }

        return {
            getTActivityForItem,
            handleClickBanner,
            handleClickBanner2,
            goNoticeDetail,
            isShowTopicList,
            topicList,
            topicItem,
            // jumpPage,
            bulletinBox,
            closeNotice,
            bannerLive,
            getTopicData,
      ...toRefs(state)
        }
    }
}
</script>

<style lang="scss">
.notice-modal {
background: transparent !important;
.el-dialog__header {
padding: 0;
}
.el-dialog__body {
padding: 0;
& > div:first-of-type {
height: 324px;
background: transparent;
background-repeat: no-repeat;
background-size: cover;
position: relative;
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
user-select: none;
overflow: hidden;
cursor: pointer;
& > p:first-of-type {
  width: 374px;
  font-size: 26px;
  color: #edbe2c;
  word-break: keep-all;
  text-align: center;
  font-weight: bold;
}
& > p:last-of-type {
  font-size: 19px;
  color: #ffffff;
  margin-top: 12px;
  padding: 0 24px;
  text-align: center;
}
}
& > div:last-of-type {
position: absolute;
top: 0;
right: 0;
width: 29px;
height: 27px;
border-radius: 0px 0px 0px 14px;
background: #d2d2d2;
display: flex;
justify-content: center;
align-items: center;
padding: 0 0 2px 3px;
overflow: hidden;
cursor: pointer;
& > i {
  font-size: 16px;
  color: #ffffff;
}
}
}
}
</style>

<style lang="scss" scoped>
@import "@/sass/mixin.scss";
.apiInfo {
background: var(--contentColor);
.notice-bar {
cursor: pointer;
height: 53px;
color: var(--contentColor);
font-size: 16px;
.notice-title {
position: relative;
flex: 1;
text-align: center;
}
.icon {
position: relative;
padding: 15px 30px;
box-sizing: content-box;
& > img {
  width: 100%;
  height: auto;
  display: block;
}

&:first-of-type {
  width: 19px;
  height: 20px;
}
&:last-of-type {
  width: 11px;
  height: 11px;
}
}
}
}
.header {
width: 100%;
height: 520px;
background-repeat: no-repeat;
background-size: cover;
position: relative;
background-position: center;
background-image: var(--bgImg);

.top-image {
width: 100%;
height: auto;
max-height: 520px;
object-fit: cover;
}

.headerBg {
//background-image: url("../../../plans_PCUI/images/topicBanner/topicBannerImg.jpg");  //新加上去換熱門事件的背景
//background-size: cover;
// background-repeat: no-repeat;
//background-position: center center;
position: absolute;
left: 0;
top: 0;
bottom: 0;
right: 0;
background-color: var(--colorTopBg);
display: flex;
flex-direction: column;
justify-content: flex-end;
align-items: flex-start;
z-index: 2;
padding: 0 130px 100px 130px;
cursor: pointer;
.swipe-live {
width: 112px;
height: 38px;
background: #fff;
border-radius: 38px;
margin-bottom: 12px;
display: flex;
align-items: center;
overflow: hidden;
& > img {
  width: 100%;
  height: auto;
}
}
.headerRace {
display: flex;
margin-bottom: 20px;
// .raceBtn {
//     height: 35px;
//     background: linear-gradient(270deg, #ea643f 0%, #fbb754 100%);
//     border: 1px solid #ffe1cb;
//     border-radius: 17.5px;
//     display: flex;
//     align-items: center;
//     padding: 0 15px;
//     img {
//         width: 24px;
//         height: 24px;
//     }
//     & > span {
//         margin-left: 10px;
//         color: var(--contentColor);
//         font-size: 16px;
//     }
// }
}
& > .headerRace {
width: 190px;
height: 35px;
border-radius: 35px;
background: linear-gradient(270deg, #ea643f 0%, #fbb754 100%);
border: 1px solid #ffe1cb;
display: flex;
align-items: center;
justify-content: space-between;
padding: 0 10px;
&.no {
  background: none;
  border: none;
}
.raceCupImg {
  width: 24px;
  height: 24px;
  margin-right: 5px;
}
:deep {
  .el-statistic__number {
    color: var(--contentColor);
    font-size: 16px;
  }
}
}
& > .headerTitle {
font-weight: bold;
color: var(--contentColor);
letter-spacing: 2px;
@include ellipsisLn(2);
word-break: unset;
margin: 20px 0 10px 0;
line-height: 50px;
& > span {
  font-size: 48px;
  word-break: keep-all;
  word-wrap: break-word;
}
}
& > .headerTradeBox {
padding-bottom: rem(80px);
& > .relatedTrade {
  font-size: rem(30px);
  color: var(--contentColor);
  padding: rem(70px) rem(68px) rem(10px) rem(68px);
  letter-spacing: 1px;
  @include ellipsis;
}
}
}
}
.home-container {
max-width: 1440px;
padding: 0 30px;
margin: 0 auto;
}
.finInfo {
text-align: -webkit-center;
.finHeading {
max-width: 1200px;
text-align: left;
font-weight: 800;
font-size: 24px;
line-height: 28px;
}
}

.topicInfo {
text-align: -webkit-center;
h1 {
max-width: 1200px;
text-align: left;
font-weight: 800;
font-size: 24px;
line-height: 28px;
}
}
.tabBox {
padding-bottom: rem(110px);
:deep(.van-tabs__nav) {
background: transparent;
}
:deep(.van-tabs__wrap) {
border-bottom: 1px solid var(--lineColor);
padding: 0 rem(75px);
box-sizing: border-box;
}
:deep(.van-tab__text) {
font-size: rem(30px);
}
}
// :deep(.van-popup) {
//     display: flex;
//     background: blue;
//     .pickerItem {
//         flex: 1;
//         background: #000;
//     }
// }
@media (max-width: 1100px) {
.apiInfo {
margin: unset;
}
}
.selected-events {
padding: 54px 0 0 0;

.selected-events-title {
font-size: 48px;
font-weight: bold;
color: var(--mainColor);
margin-bottom: 30px;
}
.events-box {
display: flex;
//justify-content: space-between;
margin: 0 -10px;
.event-item {
padding: 0 10px;
flex: 1;
max-width: 33.33%;
position: relative;
cursor: pointer;
min-height: 245px;
.event-image {
  width: 100%;
  border-radius: 10px;
  overflow: hidden;
  display: block;
  height: 100%;
  object-fit: cover;
}
.event-item-content {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  z-index: 2;
  padding: 0 10px;

  .content-bg {
    background-color: var(--colorTopBg);
    height: 100%;
    border-radius: 10px;
    overflow: hidden;
    padding: 12px;
    display: flex;
    flex-direction: column;
    & > .listRace {
      display: flex;
      height: 35px;
    }
    .event-item-title {
      font-weight: bold;
      color: var(--contentColor);
      letter-spacing: 2px;
      @include ellipsisLn(2);
      font-size: 30px;
      word-break: unset;
      margin: 10px 0;
      line-height: 1.4;
    }
  }
}
}
}
}
</style>
