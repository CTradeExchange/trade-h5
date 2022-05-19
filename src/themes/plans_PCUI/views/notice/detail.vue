<template>
    <router-view />
    <div class='wrapper'>
        <div class='page-title'>
            <span class='back-icon' @click='back'>
                ＜
            </span>
            <!-- {{ $t('api.editHeader') }} -->
            公告详情
        </div>
        <div class='notice-detail'>
            <Loading :show='loading' />
            <div class='pageWrap'>
                <div class='detailTop'>
                    {{ detailData.title }}
                </div>
                <div class='time'>
                    {{ formatTime(detailData.pubTime) }}
                </div>
                <div class='content'>
                    {{ detailData.content }}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { computed, toRefs, reactive, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Toast, Dialog } from 'vant'
import { getNoticeDetail } from '@/api/user'

export default {
    components: {

    },
    setup () {
        const router = useRouter()
        const route = useRoute()
        const store = useStore()
        const { t } = useI18n({ useScope: 'global' })
        const state = reactive({
            loading: false,
            query: {
                purview: [],
                tag: '',
                id: '',
                whiteIps: ''
            },
            detailData: {},
        })

        // console.log(store.state)
        // 获取账户信息
        const customInfo = computed(() => store.state._user.customerInfo)
        const companyId = computed(() => customInfo.value.companyId)
        const inviteVis = computed(() => {
            return (location.href.includes('uat') && companyId.value === 1) || (location.href.includes('pre') && companyId.value === 360) || (companyId.value === 11)
        })

        // 初始获取详情
        const initData = () => {
            const id = route.query.id
            state.noticeId = id
            getNoticeDetial()
        }

        // 获取公告详情
        const getNoticeDetial = () => {
            state.loading = true
            state.errorTip = ''
            console.log(customInfo.value)

            getNoticeDetail({
                current: state.currentNt,
                id: state.noticeId,
                lang: state.lang,
                companyId: customInfo.value.companyId
            }).then(res => {
                state.loading = false
                console.log(res)
                if (res.check()) {
                    state.detailData = res.data
                }
            }).catch(err => {
                state.errorTip = t('c.loadError')
            })
        }

        const handRoutTo = (path, tag) => router.push({
            path: route.path + path,
            query: {
                tag: tag ? '' : tag,
                originPage: 'apiEdit'
            }
        })

        // 跳转到编辑页
        const back = (id) => {
            console.log(id)
            router.back()
        }

        const showApiHelp = () => {
            state.helpPopupShow = true
        }

        onMounted(() => {
            initData()
        })

        return {
            initData,
            handRoutTo,
            getNoticeDetial,
            showApiHelp,
            inviteVis,
            back,
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
        .back-icon {
            cursor: pointer;
        }
    }
    .pageWrap {
        .detailTop {
            padding: 15px;
            font-size: 32px;
            text-align: center;
        }
        .time {
            padding: 15px;
            color: var(--minorColor);
            text-align: center;
        }
        .content {
            margin-top: 20px;
            padding: 20px 30px;
            line-height: 42px;
            white-space: normal;
            word-break: break-all;
            background: var(--contentColor);
        }
    }
}
</style>
