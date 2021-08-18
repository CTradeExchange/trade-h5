<template>
    <div class='m-infoflow'>
        <div class='m-infoflow_title'>
            资讯参考
        </div>
        <div class='container'>
            <van-tabs v-model:active='information.activeTab' color='rgb(60, 113, 227)' title-inactive-color='rgb(60, 113, 227)' @click='tabClick'>
                <van-tab v-for='(tab,index) in information.newsTypes' :key='tab.id' class='extra-tabpanel' :name='index' :title='tab.name'>
                    <template v-if='information.activeTab===0'>
                        <div class='new-total'>
                            <van-pull-refresh
                                v-model='isLoading'
                                success-text='刷新成功'
                                @refresh='onRefresh'
                            >
                                <div v-for='news in information.newsList' :key='news.id' class='new'>
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
                                </div>
                            </van-pull-refresh>
                        </div>
                    </template>
                    <template v-if='information.activeTab===1'>
                        <div class='story-con'>
                            <div class='story-lists'>
                                <div class='story-date'>
                                    2021年08月17日
                                </div>
                                <div class='story-list'>
                                    <div v-for='flash in information.newsFlash' :key='flash.id' class='story-item'>
                                        <div class='iconfont icon-yuandianxiao'></div>
                                        <div class='story-time'>
                                            {{ flash.addtime_text }}
                                        </div>
                                        <div class='story-desc'>
                                            <div class='story-text story-ellipsis'>
                                                {{ flash.title }}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>
                    <template v-if='information.activeTab===2'>
                        <div class='canlendar'>
                            <div class='self-tab'>
                                <div class='canlendar'></div>
                                <div class='canlendar'></div>
                            </div>
                            <div class='canlendar'></div>
                            <div class='self-container'>
                                <div class='self-content'>
                                    <div v-for='calendar in information.calendarList' :key='calendar.id' class='item'>
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

import { newsListByType, newsListByTypeByPage, canlendarListByDate, articleDetail } from '@/api/information'
export default {

    setup () {
        const information = reactive({
            count: 0,
            isLoading: false,
            activeTab: 0,
            newsTypes: [],
            newsList: [],
            newsFlash: [],
            calendarList: []
        })

        const getNewsListByTypeByPage = (record) => {
            newsListByTypeByPage({
                page: 1,
                pageSize: 10,
                type: 7, // 类目id, 要闻:7; 7X24快讯:8; 财经日历:10
                orgid: 2 // 机构id
            }).then(({ data, page, pageSize, total }) => {
                if (Array.isArray(data) && data.length > 0) {
                    information.newsList = data
                    // getNewsListByTypeByPage(data[0])
                }
            })
        }
        const getNewsFlash = () => {
            newsListByTypeByPage({
                page: 1,
                pageSize: 10,
                type: 8, // 类目id, 要闻:7; 7X24快讯:8; 财经日历:10
                orgid: 2 // 机构id
            }).then(({ data, page, pageSize, total }) => {
                if (Array.isArray(data) && data.length > 0) {
                    information.newsFlash = data
                    // getNewsListByTypeByPage(data[0])
                }
            })
        }

        const getCalendar = () => {
            canlendarListByDate({
                timestamp: Date.now()
            }).then((data) => {
                // debugger
                if (Array.isArray(data) && data.length > 0) {
                    information.calendarList = data
                    // getNewsListByTypeByPage(data[0])
                }
            })
        }
        const tabClick = (name) => {
            if (name === 1 && information.newsFlash.length === 0) {
                getNewsFlash()
            }
            if (name === 2 && information.calendarList.length === 0) {
                getCalendar()
            }
        }
        const getArticleDetail = ({ id, orgid }) => {
            articleDetail({
                id,
                orgid
            }).then((data) => {
                debugger
                if (Array.isArray(data) && data.length > 0) {
                    information.calendarList = data
                    // getNewsListByTypeByPage(data[0])
                }
            })
        }
        const getNewsType = () => {
            newsListByType({ orgid: 1, langue_type: 'zn' }).then(data => {
                if (Array.isArray(data) && data.length > 0) {
                    information.newsTypes = data
                    getNewsListByTypeByPage(data[0])
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
            information,
            getNewsListByTypeByPage,
            getNewsType,
            getNewsFlash,
            getCalendar,
            getArticleDetail,
            onRefresh,
            tabClick
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
.new-total {
    overflow: scroll;
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
}
.story-lists {
    padding-left: rem(66px);
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
