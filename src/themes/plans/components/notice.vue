<template>
    <van-popup
        v-model:show='show'
        class='notice-wrap'
        close-on-popstate
        :overlay='false'
        position='top'
        :style='{ zIndex: 9999,overflow: "hidden" }'
        teleport='#app'
    >
        <div :class='["notice", { "paymentSuccessClass": bizTypeFlag }]' @click="show=false;$router.push('/msg')">
            <div class='top'>
                <p class='title'>
                    {{ noticeContent.title || $t('c.biaoTi') }}
                </p>
                <van-icon name='cross' @click.stop='show = false' />
            </div>
            <div class='content'>
                {{ computeHtmlTime(noticeContent.text) }}
            </div>
        </div>
    </van-popup>
    <!-- H5会出现白屏问题：js运行在dom节点渲染之前 -->
</template>

<script>
import { isEmpty } from '@/utils/util'
import { useRoute } from 'vue-router'
import { computed, onUnmounted, reactive, toRefs } from 'vue'
import getTrackingInvestingFtd from '@/utils/investingComFtd'
import { useStore } from 'vuex'
export default {
    setup (props) {
        const store = useStore()
        const route = useRoute()
        const state = reactive({
            show: false,
            noticeContent: '',
            bizTypeFlag: false
        })

        const customerInfo = computed(() => store.state._user.customerInfo)

        let noticeCloseTimer
        const gotMsg = res => {
            // state.show = true
            state.noticeContent = res.detail.content
            const bizType = res.detail.content?.bizType
            if (noticeCloseTimer) clearTimeout(noticeCloseTimer)
            state.bizTypeFlag = bizType === 'CASH_IN'

            const { customerNo, activateStatus } = customerInfo.value || {}

            // 出金入金更新用户信息
            const arr = ['CASH_IN', 'CASH_IN_BO']
            if (arr.includes(bizType) && customerNo) {
                store.dispatch('_user/findCustomerInfo', false)
            }

            if (state.bizTypeFlag && customerNo && activateStatus !== 1) {
                /* const { subID } = route?.params || route?.query || {}
                const body = { user_id: customerNo }
                if (subID) body['subID'] = subID
                getTrackingInvestingFtd(body) */
                let { subID, subid } = route?.params || {}
                if (!subID && !subid) {
                    subID = route?.query?.subID
                    subid = route?.query?.subid
                }
                const body = { user_id: customerNo }
                if (subID || subid) body['subID'] = subID || subid
                getTrackingInvestingFtd(body)
            }

            noticeCloseTimer = setTimeout(() => {
                state.show = false
            }, 500000)
        }

        document.body.addEventListener('GotMsg_notice', gotMsg, false)
        onUnmounted(() => {
            document.body.removeEventListener('GotMsg_notice', gotMsg)
        })
        const computeHtmlTime = (content) => {
            try {
                const reg = /<?time[^>]*>[^<]*<\/time>/gi
                const tag = content?.match(reg)
                let returnVal
                if (!isEmpty(tag) && tag.length > 0) {
                    tag.forEach(item => {
                        returnVal = content.replace(reg, function (matchStr) {
                            const time = matchStr.toString().replace(/<\/?time>/g, '')
                            const timeStr = window.dayjs(Number(time)).format('YYYY-MM-DD HH:mm:ss')
                            return timeStr
                        })
                    })
                    return returnVal
                } else {
                    return content
                }
            } catch (error) {
                console.log(error)
            }
        }

        return {
            computeHtmlTime,
            ...toRefs(state)
        }
    }
}
</script>

<style lang="scss">
@import '~@plans/style.scss';
.notice-wrap {
    width: 96% !important;
    height: 15%;
    margin: 2% !important;
    overflow: hidden;
    background: var(--contentColor);
    border-radius: rem(10px);
    box-shadow: rem(2px) rem(3px) rem(5px) var(--minorColor);
    .notice {
        padding: rem(30px);
        .top {
            display: flex;
            justify-content: space-between;
            margin-bottom: rem(10px);
            .title {
                font-weight: bold;
            }
        }
        .content {
            display: -webkit-box;
            overflow: hidden;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 3;
        }
    }
}
</style>
