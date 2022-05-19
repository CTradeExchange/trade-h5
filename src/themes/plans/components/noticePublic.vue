<template>
    <van-popup
        v-model:show='publicShow'
        class='public-pop'
        closeable
        position='center'
        :style="{ height: '60%',width: '80%' }"
    >
        <div class='pop-top'>
            {{ $t('notice.poptitle') }}
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
import { computed, onMounted, onUnmounted, ref, reactive, toRefs } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { getQueryVariable, sessionSet, getCookie, setCookie } from '@/utils/util'
import { getNoticeList } from '@/api/user'

export default {
    setup () {
        const store = useStore()
        const router = useRouter()
        const { t } = useI18n({ useScope: 'global' })
        const cacheViews = computed(() => store.state.cacheViews)

        // 获取账户信息
        const customInfo = computed(() => store.state._user.customerInfo)

        const state = reactive({
            publicShow: false,
            lang: getCookie('lang') || 'zh-CN',
            noticePubTime: getCookie('pubTimeUpdate'),
            currentNt: 1,
            noticeData: []
        })
        window.store = store
        if (getQueryVariable('b_superiorAgent')) {
            sessionSet('b_superiorAgent', getQueryVariable('b_superiorAgent'))
        }

        const getPublicData = (val) => {
            state.publicShow = val
        }

        // 获取公告列表
        const getNoticeData = () => {
            console.log(state.noticePubTime)
            getNoticeList({
                current: state.currentNt,
                // pubTimeFrom: '',
                // pubTimeTo: '',
                lang: state.lang,
                size: 10,
                companyId: customInfo.value.companyId,
                customerNo: customInfo.value.customerNo
            }).then(res => {
                console.log(res)
                if (res.check()) {
                    if (res.data.records && res.data.records.length > 0) {
                        state.noticeData = res.data.records
                        getPublicData(true)
                        console.log(state.noticeData[0].pubTime)
                        setCookie('pubTimeUpdate', state.noticeData[0].pubTime)
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
            cacheViews,
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
