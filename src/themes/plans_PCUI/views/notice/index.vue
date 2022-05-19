<template>
    <router-view />

    <div class='wrapper'>
        <div class='page-title'>
            {{ $t('route.noticeTitle') }}
        </div>

        <van-tabs v-model:active='active' class='noticePage'>
            <van-tab :title="$t('route.notice')">
                内容 1
            </van-tab>
            <van-tab :title="$t('route.notice')">
                内容 2
            </van-tab>
        </van-tabs>

        <div class='list'>
            <Loading :show='loading' />
            <div class='listScroll'>
            </div>
            <van-empty
                v-if='apiList.length === 0'
                :description="$t('api.listnone')"
                image='/images/empty.png'
            />
        </div>
    </div>
</template>

<script>
import { computed, toRefs, reactive, onMounted, ref, provide } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Toast, Dialog } from 'vant'
import { queryPlatFormMessageLogList, getNoticeList } from '@/api/user'
import Clipboard from 'clipboard'

export default {
    components: {

    },

    setup () {
        const router = useRouter()
        const route = useRoute()
        const store = useStore()
        const { t } = useI18n({ useScope: 'global' })
        const { type } = route.query
        const state = reactive({
            loading: false,
            active: ref(0),
            showApiHelp: false,
            query: {
                tag: ''
            },
            apiList: [],
            isReLoad: false
        })

        const accountList = computed(() => store.state._user.customerInfo.accountList.filter(el => Number(el.tradeType) === Number(state.tradeType)))
        const activeIndex = ref()
        // console.log(store.state)
        // 获取账户信息
        const customInfo = computed(() => store.state._user.customerInfo)
        const companyId = computed(() => customInfo.value.companyId)
        const inviteVis = computed(() => {
            return (location.href.includes('uat') && companyId.value === 1) || (location.href.includes('pre') && companyId.value === 360) || (companyId.value === 11)
        })

        const onSiderBarChange = (index) => {
            console.log(index)
        }

        // 跳转到编辑页
        const goDetails = (id) => {
            console.log(id)
            router.push({
                path: '/apiEdit',
                query: {
                    id: id
                }
            })
        }

        // 获取消息列表
        const getMsgList = () => {
            state.pageLoading = true
            state.errorTip = ''
            queryPlatFormMessageLogList({
                current: state.current,
                parentType: state.type,
            }).then(res => {
                state.loading = false
                state.pageLoading = false
                if (res.check()) {
                    if (res.data.records && res.data.records.length > 0) {
                        state.list = state.list.concat(res.data.records)
                    }

                    // 数据全部加载完成
                    if (res.data.size * res.data.current >= res.data.total) {
                        state.finished = true
                    }
                }
            }).catch(err => {
                state.errorTip = t('c.loadError')
                state.pageLoading = false
            })
        }

        // 获取公告列表
        const getNoticeData = () => {
            // state.pageLoading = true
            state.errorTip = ''
            console.log(customInfo.value)

            getNoticeList({
                current: state.currentNt,
                // pubTimeFrom: '',
                // pubTimeTo: '',
                lang: state.lang,
                size: 10,
                companyId: customInfo.value.companyId,
                customerNo: customInfo.value.customerNo
            }).then(res => {
                state.loading = false
                state.pageLoading = false
                if (res.check()) {
                    if (res.data.records && res.data.records.length > 0) {
                        state.listNotice = state.listNotice.concat(res.data.records)
                    }

                    // 数据全部加载完成
                    if (res.data.size * res.data.current >= res.data.total) {
                        state.finishedNt = true
                    }
                }
            }).catch(err => {
                state.errorTip = t('c.loadError')
                state.pageLoading = false
            })
        }

        const handRoutTo = (path, tag) => router.push({
            path: route.path + path,
            query: {
                tag: tag || '',
                originPage: 'apiList'
            }
        })

        onMounted(() => {
            // getAPIList()
        })

        return {
            handRoutTo,
            onSiderBarChange,
            goDetails,
            getNoticeData,
            getMsgList,
            inviteVis,
            ...toRefs(state)
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.wrapper {
    width: 1200px;
    margin: 20px auto;
    .page-title {
        font-weight: bold;
        font-size: 32px;
    }
    .noticePage {
        :deep(.van-tab) {
            display: inline-block;
            flex: inherit;
        }
    }
    .col_black {
        color: var(--normalColor);
    }
}

@media screen and (max-width: 1200px) {
    .wrapper {
        width: 980px;
    }
}

@media screen and (max-width: 980px) {
    .wrapper {
        width: 720px;
    }
}
</style>
