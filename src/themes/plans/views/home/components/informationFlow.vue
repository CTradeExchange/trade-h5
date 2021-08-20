<template>
    <div class='m-infoflow'>
        <div class='m-infoflow_title'>
            资讯参考
        </div>
        <div class='container'>
            <van-tabs v-model:active='state.activeTab' color='rgb(60, 113, 227)' title-inactive-color='rgb(60, 113, 227)' @click='tabClick'>
                <van-tab v-for='(tab,index) in state.newsTypes' :key='tab.id' class='extra-tabpanel' :name='index' :title='tab.name'>
                    <template v-if='state.activeTab===0'>
                        <van-pull-refresh
                            v-model='state.focusNews.refreshing'
                            success-text='刷新成功'
                            @refresh='onFocusNewsRefresh'
                        >
                            <van-list
                                v-model:loading='state.focusNews.loading'
                                :finished='state.focusNews.finished'
                                finished-text='没有更多了'
                                @load='onLoadFocusNews'
                            >
                                <van-cell v-for='news in state.focusNews.list' :key='news.id' class='new'>
                                    <template #title>
                                        <div class='new-con'>
                                            <div class='new-left'>
                                                <div class='new-desc'>
                                                    <a href='javascript:void(0)'>
                                                        <span v-if="news.top==='1'">
                                                            置顶
                                                        </span>
                                                        {{ news.title }}
                                                    </a>
                                                </div>
                                                <div class='new-source'>
                                                    <span>{{ news.resource }}</span>
                                                    <span>4 小时前</span>
                                                </div>
                                            </div>
                                            <div class='new-right'>
                                                <img alt='' :src='news.image' />
                                            </div>
                                        </div>
                                    </template>
                                </van-cell>
                            </van-list>
                        </van-pull-refresh>
                    </template>
                    <template v-if='state.activeTab===1'>
                        <van-pull-refresh
                            v-model='state.newsFlash.refreshing'
                            success-text='刷新成功'
                            @refresh='onNewsFlashRefresh'
                        >
                            <van-list
                                v-model:loading='state.newsFlash.loading'
                                :finished='state.newsFlash.finished'
                                finished-text='没有更多了'
                                @load='onLoadNewsFlash'
                            >
                                <div class='story-date'>
                                    {{ today }}
                                </div>
                                <van-cell v-for='flash in state.newsFlash.list' :key='flash.id'>
                                    <template #title>
                                        <div class='story-item'>
                                            <div class='iconfont icon-yuandianxiao'></div>
                                            <div class='story-time'>
                                                {{ flash.shotTime }}
                                            </div>
                                            <div class='story-desc'>
                                                <div class='story-text story-ellipsis'>
                                                    {{ flash.title }}
                                                </div>
                                            </div>
                                        </div>
                                    </template>
                                </van-cell>
                            </van-list>
                        </van-pull-refresh>
                    </template>
                    <template v-if='state.activeTab===2'>
                        <div class='canlendar'>
                            <div class='self-tab'>
                                <div class='canlendar'></div>
                                <div class='canlendar'></div>
                            </div>
                            <div class='canlendar'></div>
                            <div class='self-container'>
                                <div class='self-content'>
                                    <div v-for='calendar in state.calendarList' :key='calendar.id' class='item'>
                                        <div class='flag'>
                                            <img alt='' :src='`http://cdn.jin10.com/assets/img/commons/flag/flash/${calendar.country}.png`' />
                                        </div>
                                        <div class='info'>
                                            <div class='top'></div>
                                            <div class='middle'>
                                                {{ calendar.text }}
                                            </div>
                                            <div class='bottom'>
                                                <span>前值：{{ calendar.prev_value }}</span>
                                                <span>预期：{{ calendar.expect }}</span>
                                                <span>公布：{{ calendar.public_value }}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>
                </van-tab>
            </van-tabs>
        </div>
    </div>
</template>

<script>
import { reactive } from 'vue'
import dayjs from 'dayjs'
import { newsListByType, newsListByTypeByPage, canlendarListByDate, articleDetail } from '@/api/information'
export default {

    setup () {
        const state = reactive({
            count: 0,
            isLoading: false,
            loading: false,
            finished: false,
            refreshing: false,
            activeTab: 0,
            newsTypes: [],
            newsList: [],
            focusNews: { // 要闻
                list: [],
                page: 1,
                pages: 1,
                refreshing: false,
                loading: false,
                finished: false,
                timeAxis: 0 // 记录最新一条的时间轴
            },
            newsFlash: { // 7x24
                list: [],
                page: 1,
                pages: 1,
                refreshing: false,
                loading: false,
                finished: false,
                timeAxis: 0 // 记录最新一条的时间轴
            },
            calendarList: []
        })
        const today = dayjs().format('YYYY年MM月DD日')
        const getNewsListByTypeByPage = (record) => {
            newsListByTypeByPage({
                page: 1,
                pageSize: 10,
                type: 7, // 类目id, 要闻:7; 7X24快讯:8; 财经日历:10
                orgid: 2 // 机构id
            }).then(({ data, page, pageSize, total }) => {
                if (Array.isArray(data) && data.length > 0) {
                    state.newsList = data
                    // getNewsListByTypeByPage(data[0])
                }
            })
        }
        const getNewsListByType = (params, callback) => {
            newsListByTypeByPage(params).then(({ data, pages }) => {
                if (typeof (callback) === 'function') {
                    callback({ data: data, pages: pages })
                }
            })
        }
        const getNewsFlash = (callback) => {
            newsListByTypeByPage({
                page: 1,
                pageSize: 10,
                type: 8, // 类目id, 要闻:7; 7X24快讯:8; 财经日历:10
                orgid: 2 // 机构id
            }).then(({ data }) => {
                typeof (callback) === 'function' && callback()
                if (Array.isArray(data) && data.length > 0) {
                    const tempData = data.map(el => ({ ...el, shotTime: el.addtime_text.slice(11, 16) }))
                    if (state.newsFlash.timeAxis > 0) {
                        const filterData = tempData.filter(el => el.addtime > state.newsFlash.timeAxis)
                        state.newsFlash.list = [...filterData, ...state.newsFlash.list]
                    } else {
                        state.newsFlash.list = [...tempData]
                    }
                    state.newsFlash.timeAxis = data[0].addtime
                }
            })
        }
        const onLoadFocusNews = () => { // 要闻上拉加载
            state.focusNews.page++
            getNewsListByType({
                page: state.focusNews.page,
                pageSize: 10,
                type: 7, // 类目id, 要闻:7; 7X24快讯:8; 财经日历:10
                orgid: 2 // 机构id
            }, ({ data, pages }) => {
                state.focusNews.loading = false
                if (state.focusNews.page >= pages) {
                    state.focusNews.finished = true
                }
                if (Array.isArray(data) && data.length > 0) {
                    state.focusNews.list = [...state.focusNews.list, ...data]
                }
            })
        }
        const onLoadNewsFlash = () => { // 快讯上拉加载
            // debugger
            state.newsFlash.page++
            getNewsListByType({
                page: state.newsFlash.page,
                pageSize: 10,
                type: 8, // 类目id, 要闻:7; 7X24快讯:8; 财经日历:10
                orgid: 2 // 机构id
            }, ({ data, pages }) => {
                state.newsFlash.loading = false
                if (state.newsFlash.page >= pages) {
                    state.newsFlash.finished = true
                }
                if (Array.isArray(data) && data.length > 0) {
                    state.newsFlash.list = [...state.newsFlash.list, ...data]
                }
            })
        }
        const onFocusNewsRefresh = () => { // 要闻上拉加载
            getNewsListByType({
                page: 1,
                pageSize: 10,
                type: 7, // 类目id, 要闻:7; 7X24快讯:8; 财经日历:10
                orgid: 2 // 机构id
            }, ({ data }) => {
                state.focusNews.refreshing = false
                if (Array.isArray(data) && data.length > 0) {
                    const tempData = data.map(el => ({ ...el, shotTime: el.addtime_text }))
                    if (state.focusNews.timeAxis > 0) {
                        const filterData = tempData.filter(el => el.addtime > state.focusNews.timeAxis)
                        state.focusNews.list = [...filterData, ...state.focusNews.list]
                    } else {
                        state.focusNews.list = [...tempData]
                    }
                    state.focusNews.timeAxis = data[0].addtime
                }
            })
        }
        const onNewsFlashRefresh = () => { // 快讯下拉刷新
            getNewsListByType({
                page: 1,
                pageSize: 10,
                type: 8, // 类目id, 要闻:7; 7X24快讯:8; 财经日历:10
                orgid: 2 // 机构id
            }, ({ data }) => {
                state.newsFlash.refreshing = false
                if (Array.isArray(data) && data.length > 0) {
                    const tempData = data.map(el => ({ ...el, shotTime: el.addtime_text.slice(11, 16) }))
                    if (state.newsFlash.timeAxis > 0) {
                        const filterData = tempData.filter(el => el.addtime > state.newsFlash.timeAxis)
                        state.newsFlash.list = [...filterData, ...state.newsFlash.list]
                    } else {
                        state.newsFlash.list = [...tempData]
                    }
                    state.newsFlash.timeAxis = data[0].addtime
                }
            })
        }

        const getCalendar = () => {
            canlendarListByDate({
                timestamp: Date.now()
            }).then((data) => {
                // debugger
                if (Array.isArray(data) && data.length > 0) {
                    state.calendarList = data
                    // getNewsListByTypeByPage(data[0])
                }
            })
        }
        const tabClick = (name) => {
            if (name === 1 && state.newsFlash.list.length === 0) {
                getNewsListByType({
                    page: 1,
                    pageSize: 10,
                    type: 8, // 类目id, 要闻:7; 7X24快讯:8; 财经日历:10
                    orgid: 2 // 机构id
                }, ({ data }) => {
                    state.newsFlash.loading = false
                    if (Array.isArray(data) && data.length > 0) {
                        state.newsFlash.list = data
                    }
                })
            }
            if (name === 2 && state.calendarList.length === 0) {
                getCalendar()
            }
        }
        const getArticleDetail = ({ id, orgid }) => {
            articleDetail({
                id,
                orgid
            }).then((data) => {
                if (Array.isArray(data) && data.length > 0) {
                    state.calendarList = data
                    // getNewsListByTypeByPage(data[0])
                }
            })
        }
        const getNewsType = () => {
            newsListByType({ orgid: 1, langue_type: 'zn' }).then(typeList => {
                if (Array.isArray(typeList) && typeList.length > 0) {
                    state.newsTypes = typeList
                    getNewsListByType({
                        page: 1,
                        pageSize: 10,
                        type: 7, // 类目id, 要闻:7; 7X24快讯:8; 财经日历:10
                        orgid: 2 // 机构id
                    }, ({ data }) => {
                        state.focusNews.loading = false
                        if (Array.isArray(data) && data.length > 0) {
                            state.focusNews.list = data
                        }
                    })
                }
            })
        }
        const onRefresh = () => {

        }
        getNewsType()
        // newsListByTypeByPage({
        //     page: 1,
        //     pageSize: 10,
        //     type: 7, // 类目id, 要闻:7; 7X24快讯:8; 财经日历:10
        //     orgid: 2 // 机构id
        // }).then(res => {
        //     console.log(res)
        // })
        return {
            state,
            today,
            getNewsListByTypeByPage,
            getNewsType,
            getNewsFlash,
            getCalendar,
            getArticleDetail,
            onRefresh,
            tabClick,
            onNewsFlashRefresh,
            onFocusNewsRefresh,
            onLoadFocusNews,
            onLoadNewsFlash
        }
        // canlendarListByDate({
        //     timestamp: Date.now()
        // }).then(res => {
        //     console.log(res)
        // })
        // articleDetail({
        //     id: Date.now(),
        //     orgid:1
        // }).then(res => {
        //     console.log(res)
        // })
    },
}
</script>

<style lang="scss" scoped>
@import '~@/sass/mixin.scss';
.m-infoflow_title {
    padding: rem(20px) rem(30px);
    color: #121C32;
    font-size: rem(34px);
}
.container {
    :deep(.van-tabs__wrap) {
        position: sticky;
        top: -1px;
        right: 0;
        left: 0;
        z-index: 100;
        height: rem(80px);
        background: #FFF;
        border: none;
        border-bottom: 1px solid #F1F1F1;
    }
    :deep(.van-tab) {
        color: rgb(118, 126, 143);
        font-size: rem(30px);
        line-height: 40px;
    }
}
.extra-tabpanel {
    padding: 0 rem(28px);
}
.new {
    padding: 0 rem(26px);
    .new-con {
        display: flex;
        flex-direction: row;
        padding: rem(26px) 0;
        border-color: #F1F1F1;
        border-bottom-width: 1px;
        border-bottom-style: solid;
        .new-left {
            flex: 1;
        }
        .new-desc {
            display: -webkit-box;
            min-height: rem(106px);
            max-height: rem(160px);
            overflow: hidden;
            text-overflow: ellipsis;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            a {
                display: block;
                color: #111;
                font-size: rem(30px);
                line-height: rem(54px);
                span {
                    height: rem(34px);
                    margin-right: 5px;
                    padding: rem(4px);
                    color: #FFF;
                    font-size: rem(18px);
                    background-color: #DC143C;
                    border: 1px solid #DC143C;
                    border-radius: 2px;
                }
            }
        }
        .new-source {
            display: flex;
            flex-direction: row;
            align-items: flex-end;
            justify-content: space-between;
            height: rem(54px);
            span {
                color: #767E8F;
                font-size: rem(26px);
            }
        }
        .new-right {
            margin-left: rem(26px);
            img {
                width: rem(240px);
                height: rem(160px);
                border-radius: rem(14px);
            }
        }
    }
}
.story-date {
    padding: 0 rem(26px);
    color: #626262;
    font-weight: 700;
    font-size: rem(26px);
    line-height: rem(80px);
}
.story-item {
    position: relative;
    padding-left: rem(32px);
    &::before {
        position: absolute;
        top: 0;
        left: 0;
        width: 1px;
        height: 100%;
        background-color: #F1F1F1;
        content: '';
    }
    &::after {
        position: absolute;
        top: rem(32px);
        left: rem(-6px);
        width: rem(14px);
        height: rem(14px);
        background-color: #A1A6B1;
        border-radius: rem(14px);
        content: '';
    }
    .icon-yuandianxiao {
        position: absolute;
        top: rem(14px);
        left: rem(-18px);
        color: #8F8E93;
        font-size: rem(40px);
    }
    .story-time {
        padding-top: rem(22px);
        padding-bottom: rem(6px);
        color: #8F8E93;
        font-size: rem(26px);
    }
    .story-text {
        display: -webkit-box;
        overflow: hidden;
        color: #111;
        font-size: rem(28px);
        line-height: rem(52px);
        text-overflow: ellipsis;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
    }
}
.self-container {
    padding: 0.2rem 0;
    .self-content {
        display: flex;
        flex-direction: column;
        .item {
            display: flex;
            flex-direction: row;
            align-content: center;
            justify-content: space-between;
            justify-items: center;
            margin-bottom: 15px;
            .flag {
                width: rem(96px);
                height: rem(96px);
                overflow: hidden;
                border-radius: 50%;
                img {
                    display: block;
                    max-width: 100%;
                    border: none;
                    outline: none;
                }
            }
            .info {
                display: flex;
                flex: 0 0 83%;
                flex-direction: column;
                justify-content: space-between;
                min-height: rem(160px);
                padding-bottom: 15px;
                color: #888;
                border-bottom: 1px solid #F1F1F1;
                .top {
                    display: flex;
                    align-items: center;
                    margin-bottom: rem(14px);
                }
                .middle {
                    margin-bottom: 10px;
                    color: #555;
                    font-size: rem(28px);
                    line-height: rem(52px);
                    text-align: justify;
                }
                .bottom {
                    display: flex;
                    font-size: rem(18px);
                    line-height: rem(28px);
                    span {
                        margin-right: 10px;
                    }
                }
            }
        }
    }
}
</style>
