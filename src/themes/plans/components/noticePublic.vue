<template>
    <van-popup
        v-model:show='publicShow'
        class='public-pop'
        closeable
        position='center'
        :style="{ height: '60%',width: '80%' }"
    >
        <div class='pop-top'>
            {{ $t('route.noticeTitle') }}
        </div>
        <div class='pop-content'>
            <div class='public-list'>
                <div v-for='(item,index) in noticeData' :key='index' class='item' @click='goNoticeDetail(item.id)'>
                    <div class='item-tit'>
                        {{ item.title }}
                    </div>
                    <div class='item-time'>
                        {{ formatTime(item.pubTime) }}
                    </div>
                </div>
            </div>
        </div>
    </van-popup>
</template>

<script>

import { useStore } from 'vuex'
import { computed, onMounted, onUnmounted, ref, reactive, toRefs, provide } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { getCookie, localGet, localRemove, localSet } from '@/utils/util'
import { getNoticeList } from '@/api/user'

export default {
    setup () {
        const store = useStore()
        const router = useRouter()
        const { t } = useI18n({ useScope: 'global' })

        // 获取账户信息
        const customInfo = computed(() => store.state._user.customerInfo)

        const state = reactive({
            publicShow: false,
            lang: getCookie('lang') || 'zh-CN',
            noticePubTime: getCookie('pubTimeUpdate'),
            currentNt: 1,
            noticeData: []
        })

        // 设定全局的 noticePopShow，在任何地方均可调用
        provide('noticePopShow', (value) => {
            // state.isReLoad = value
            if (value === true) {
                getNoticeData()
            }
        })

        const getPublicData = (val) => {
            state.publicShow = val
        }

        // 公告弹窗
        const getNoticeData = () => {
            var params = {
                current: state.currentNt,
                lang: state.lang,
                size: 5,
            }
            if (customInfo.value.companyId) {
                params.companyId = customInfo.value.companyId
            }
            if (customInfo.value.customerNo) {
                params.customerNo = customInfo.value.customerNo
            }
            console.log(localGet('noticeParams'))
            // 判断是否新游客
            if (localGet('noticeParams')) { // 不是
                var nData = JSON.parse(localGet('noticeParams')) // 提取最新的pubTime
                if (nData.type === 'user') { // 已登录用户
                    params.pubTimeFrom = nData.pubTime
                }
                // if (nData.type === 'guest') { // 已登录用户
                // }
            } else { // 是
                // 获取当日的所有公告，显示完且缓存弹出次数
            }

            getNoticeList(params).then(res => {
                // console.log(res)
                if (res.check()) {
                    if (res.data.records && res.data.records.length > 0) {
                        state.noticeData = res.data.records
                        // 获取公告列表后，再缓存最新的一条的pubTime在本地
                        let noticeParams = {}
                        // 判断是否新游客
                        // console.log(localGet('noticeParams'))
                        if (localGet('noticeParams')) { // 不是
                            var nData = JSON.parse(localGet('noticeParams')) // 提取最新的pubTime
                            if (customInfo.value.customerNo) { // 已登录用户
                                if (nData.popShowNum < 2) {
                                    getPublicData(true) // 普通游客第一次显示公告弹窗
                                }
                                noticeParams = {
                                    type: 'user', // 'user' ? 'guest'
                                    pubTime: state.noticeData[0].pubTime,
                                    popShowNum: nData.popShowNum + 1,
                                    userNo: customInfo.value.companyId
                                }
                            } else { // 未登录
                                if (nData.popShowNum === 0) {
                                    getPublicData(true) // 普通游客第一次显示公告弹窗
                                }
                                noticeParams = {
                                    type: 'guest', // 'user' ? 'guest'
                                    pubTime: '',
                                    popShowNum: nData.popShowNum + 1,
                                    userNo: ''
                                }
                            }
                        } else { // 是新游客
                            getPublicData(true) // 普通游客第一次显示公告弹窗
                            // 获取当日的所有公告，显示完且缓存弹出次数
                            noticeParams = {
                                type: 'guest', // 'user' ? 'guest'
                                pubTime: '',
                                popShowNum: 1,
                                userNo: ''
                            }
                        }
                        console.log(noticeParams)
                        localSet('noticeParams', JSON.stringify(noticeParams))
                    }
                }
            }).catch(err => {
                state.errorTip = t('c.loadError')
            })
        }

        const goNoticeDetail = (id) => {
            router.push({
                path: '/noticeDetail',
                query: {
                    id: id
                }
            })
        }

        onMounted(() => {
            getNoticeData()
        })

        onUnmounted(() => {

        })

        const formatTime = (val) => {
            return window.dayjs(val).format('YYYY-MM-DD HH:mm:ss')
        }

        return {
            customInfo,
            goNoticeDetail,
            formatTime,
            getNoticeData,
            getPublicData,
            ...toRefs(state)
        }
    },
}
</script>

<style lang="scss" scoped >
@import '~@/sass/mixin.scss';
.public-pop {
    border-radius: rem(10px);
    .pop-top {
        padding-left: rem(30px);
        font-size: rem(36px);
        line-height: rem(120px);
    }
    .van-popup__close-icon {
        top: rem(20px);
        right: rem(20px);
    }
    .pop-content {
        max-height: 80%;
        padding: 0 rem(30px) rem(20px) rem(30px);
        overflow: auto;
    }
    .public-list {
        margin: 0;
        .item {
            margin: rem(15px) 0 rem(25px) 0;
            .item-tit {
                margin-bottom: rem(10px);
                color: var(--color);
                font-size: rem(28px);
            }
            .item-time {
                color: var(--minorColor);
                font-size: rem(24px);
            }
        }
    }
}
</style>
