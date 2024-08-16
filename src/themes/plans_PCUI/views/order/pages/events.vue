<template>
    <div class='events'>
        <div v-if='activeDetail' class='header'>
            <div class='title'>
                <el-icon class='title-back' @click='backEvenntListHandle'>
                    <Back />
                </el-icon>
            </div>
        </div>

        <EventDetail v-if='activeDetail' :select-data='activeItemToken' />
        <div v-else class='events-list'>
            <div v-for='(item, index) in eventList' :key='index' class='events-item'>
                <div class='events-item-type'>
                    <img v-if='index == 0' alt='' src='@/themeCommon/image/home/fire.png' />
                    <span>{{ item.Keywords }}</span>
                    <div v-if='showNew.includes(item.ID)' class='new-event'>
                        <span>{{ 'New' }}</span>
                    </div>
                </div>
                <div class='events-item-img' :style="{ backgroundImage: 'url(' + item.CoverURL + ')' }" @click='handleClickBanner2(item)'>
                    <div v-if='bannerLive.includes(item.ItemID)' class='events-item-live'>
                        <img alt='' src='@/assets/newUI/live.gif' />
                    </div>
                    <div class='events-item-img-text'>
                        <span>{{ item.Title }}</span>
                    </div>
                </div>

                <NewTranBtn :trades='item.Trades' />
            </div>
        </div>
    </div>
</template>

<script>
import { reactive, toRefs, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

import { GetItems, GetItemByID } from '@/api/newApi'
import { getCookie, isEmpty, localGet, localSet, parseJSON } from '@/utils/util'
import NewTranBtn from './components/newTranBtn.vue'
import EventDetail from './components/eventDetail.vue'
import mitt from '@/utils/mitt'

export default {
    components: {
        NewTranBtn,
        EventDetail,
    },
    props: {
        module: String,
    },
    emits: ['onclose'],
    setup (props, { emit }) {
        const store = useStore()
        const router = useRouter()

        const state = reactive({
            showAmout: true,
            lang: getCookie('lang') || 'en-US',
            homeData: [],
            activeDetail: false,
            activeItemToken: null,
            showNew: [],
        })

        const newsSysConfig = computed(() => store.state._base.newsSysConfig)

        const bannerLive = computed(() => {
            const result = newsSysConfig.value.find((o) => o.Key === 'bannerLiveEventID') || {}
            const value = parseJSON(result?.Value) || {}
            return value?.webPC || []
        })

        const eventList = computed(() => {
            if (isEmpty(state.homeData)) {
                return []
            } else {
                const arr = state.homeData.map((item, i) => {
                    const { ItemLanguages, CoverURL, Trades, ExternalLink, TActivitySetting, ContentType } = item || {}
                    return Object.assign({ CoverURL, Trades, ExternalLink, TActivitySetting, ContentType }, ItemLanguages[0])
                })

                return arr
            }
        })

        const getEventList = () => {
            const body = {
                Limit: 8,
                Offset: 1,
                Conditions: {
                    Type: 1,
                    Status: 2,
                    Language: state.lang,
                    SortType: 6,
                    Label: 1,
                },
            }
            const homeDataCache = localGet('eventList')

            GetItems({ body })
                .then((res) => {
                    const { List } = res
                    if (!isEmpty(List)) {
                        if (!homeDataCache) {
                            state.homeData = List
                            const formatList = List.map((item, i) => {
                                const { ItemLanguages, CoverURL, Trades, ExternalLink, TActivitySetting, ContentType } = item || {}
                                return Object.assign(
                                    { CoverURL, Trades, ExternalLink, TActivitySetting, ContentType },
                                    ItemLanguages[0],
                                )
                            })
                            const showNew = formatList.map((item) => {
                                return item.ID
                            })
                            // console.log('过滤后的出来的数据---->', showNew)
                            state.showNew = showNew
                            localSet('eventList', JSON.stringify(List))
                            mitt.emit('EVENT_HAS_UPDATE', false)
                        } else {
                            state.homeData = List
                            if (homeDataCache == JSON.stringify(List)) {
                                // 没有变化
                            } else {
                                const homeDataCacheFormat = JSON.parse(homeDataCache)
                                // console.log('数据对比---->', List, homeDataCacheFormat)
                                const formatList = List.map((item, i) => {
                                    const { ItemLanguages, CoverURL, Trades, ExternalLink, TActivitySetting, ContentType } = item || {}
                                    return Object.assign(
                                        { CoverURL, Trades, ExternalLink, TActivitySetting, ContentType },
                                        ItemLanguages[0],
                                    )
                                })
                                const formatCacheList = homeDataCacheFormat.map((item, i) => {
                                    const { ItemLanguages, CoverURL, Trades, ExternalLink, TActivitySetting, ContentType } = item || {}
                                    return Object.assign(
                                        { CoverURL, Trades, ExternalLink, TActivitySetting, ContentType },
                                        ItemLanguages[0],
                                    )
                                })

                                const showNew = formatList.map((item) => {
                                    if (!formatCacheList.find((k) => k.ID == item.ID)) {
                                        return item.ID
                                    }
                                })
                                // console.log('过滤后的出来的数据---->', showNew)
                                state.showNew = showNew
                                // 设置新的缓存数据，并告诉侧边栏不要再显示红点了
                                localSet('eventList', JSON.stringify(List))
                                mitt.emit('EVENT_HAS_UPDATE', false)
                            }
                        }
                        // console.log('我准备设置本地缓存homeData了')
                    } else {
                        if (!isEmpty(homeDataCache)) {
                            state.homeData = JSON.parse(homeDataCache)
                            mitt.emit('EVENT_HAS_UPDATE', false)
                        }
                    }
                })
                .catch((err) => {
                    const homeDataCache = localGet('eventList')
                    if (!isEmpty(homeDataCache)) {
                        state.homeData = JSON.parse(homeDataCache)
                        mitt.emit('EVENT_HAS_UPDATE', false)
                    }
                })
        }

        const handleClickBanner = (item) => {
            const { ContentType } = item || {}
            // 如果是1，则是结构式的内容，可v-html渲染
            if (ContentType === 1) {
                state.activeItemToken = item
                state.activeDetail = true
            }
            // 如果是2，则是用iframe链接生成的
            if (ContentType === 2) {
                getInfo(item.ItemID)
            }
        }

        // 点击文章跳转页面
        const handleClickBanner2 = (item) => {
            const { ExternalLink, ItemID } = item || {}
            if (ExternalLink) {
                window.open(ExternalLink)
            } else {
                ItemID &&
                    router.push({
                        name: 'InfoDetail',
                        query: { id: ItemID },
                    })
            }
        }

        const getInfo = (ID) => {
            GetItemByID({ body: { ID: Number(ID), Language: getCookie('lang') || 'en-US' } })
                .then((res) => {
                    const { Item } = res || {}
                    const { ItemLanguages, Trades, ViewpointID, Viewpoints, UserPortrait, TotalLikeCount, ContentType, EmbedButton } =
                        Item || {}
                    let obj = {}
                    if (!isEmpty(ItemLanguages)) {
                        obj = ItemLanguages[0] || {}
                    }
                    const { Content, Keywords, PublishTime, Source, SourceURL, Title, EmbedLink, EmbedExtra, EmbedSource } = obj || {}
                    state.info = {
                        Trades,
                        ViewpointID,
                        Viewpoints,
                        UserPortrait,
                        Content,
                        Keywords,
                        PublishTime,
                        Source,
                        SourceURL,
                        Title,
                        TotalLikeCount,
                        ID,
                        ContentType,
                        EmbedLink,
                        EmbedExtra,
                        EmbedSource,
                        EmbedButton,
                    }
                    state.loading = false
                    window.open(EmbedLink, '_blank')

                    // store.commit('_base/Update_supportedLanguages', SupportedLanguages)
                })
                .catch((err) => {
                    state.loading = false
                })
        }

        const backEvenntListHandle = () => {
            state.activeDetail = false
            state.activeLink = ''
        }

        onMounted(() => {
            getEventList()
        })

        return {
            ...toRefs(state),
            eventList,
            bannerLive,
            handleClickBanner,
            handleClickBanner2,
            backEvenntListHandle,
        }
    },
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';

.events {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background: var(--contentColor);

    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 12px;
        border-bottom: 1px solid var(--lineColor);
        background-image: url('../../../images/funds-bg.png');
        background-size: cover;
        background-position: center;
        .title {
            min-height: 56px;
            color: var(--color);
            font-size: 20px;
            font-weight: bold;
            display: flex;
            align-items: center;
            .title-back {
                cursor: pointer;
                font-size: 24px;
            }
        }
    }
    .events-list {
        display: flex;
        flex-direction: column;
        padding: 0 10px;

        overflow: auto;
        background-image: url('../../../images/funds-bg.png');
        background-size: inherit;
        background-position: top;
        background-repeat: no-repeat;
        @include scroll();
        .events-item {
            display: flex;
            flex-direction: column;
            // min-width: 275px;
            border-bottom: 1x solid var(--fafColor);
            width: 100%;
              .events-item-type {
                width: 100%;
                display: flex;
                align-items: center;
                padding: 20px;
                & > img {
                    margin-right: 6px;
                    max-width: 24px;
                    max-height: 24px;
                }
                & > span {
                    color: var(--mainColor);
                    font-family: 'Inter';
                    font-size: 16px;
                    font-style: normal;
                    font-weight: 700;
                    line-height: 16px;
                }
                .new-event {
                    margin-left: 8px;
                    min-width: 40px;
                    min-height: 20px;
                    background-color: var(--primary);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 4px;
                    & > span {
                        color: #fff;
                        font-family: 'Inter';
                        font-size: 10px;
                        font-style: normal;
                        font-weight: 700;
                    }
                }
            }
            .events-item-img {
                width: 100%;
                height: 180px;
                border-radius: 4px;
                overflow: hidden;
                // background-image: url('../../../images/videocover.png');
                background-size: cover;
                background-position: center;
                background-repeat: no-repeat;
                position: relative;
                display: flex;
                align-items: flex-end;
                cursor: pointer;
                .events-item-img-text {
                    width: 100%;
                    min-height: 30px;
                    background-color: rgba(0, 0, 0, 0.4);
                    padding: 10px;
                    & > span {
                        color: var(--fffColor);
                        text-align: justify;
                        font-family: 'DM Sans';
                        font-size: 14px;
                        font-weight: 500;
                        line-height: 20px;
                        // letter-spacing:1px;
                    }
                }
                .events-item-live {
                    position: absolute;
                    top: 10px;
                    left: 10px;
                    width: 80px;
                    height: 28px;
                    border-radius: 28px;
                    overflow: hidden;
                    background-color: rgba(255, 255, 255, 0.95);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    & > img {
                        // width: 80px;
                        height: 78px;
                    }
                }
            }
        }
    }
}
</style>
