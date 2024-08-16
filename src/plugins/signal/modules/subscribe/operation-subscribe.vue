<template>
    <div
        class='subscribe relative h-full'
        :class="{
            'subscribe-auto': type === 'quick' && step === 0,
        }"
    >
        <div v-if="type !== 'quick' || step > 0" class='subscribe-title'>
            <van-icon class='mr-4 cursor-pointer' name='down' style='transform: rotate(90deg)' @click='handleClose' />
            <span>
                {{ type === 'edit' ? $t('signal.subscribe.eidtSubscribe') : $t('signal.subscribe.subscribeSignal') }}
            </span>
        </div>

        <template v-if='step === 1'>
            <div class='section-info'>
                <div class='section-status mt-5'>
                    <van-icon :name="errorMsg ? 'clear' : 'checked'" size='40' />
                    <p v-if='!errorMsg'>
                        {{ type === 'edit' ? $t('signal.subscribe.updateSucc') : $t('signal.subscribe.subscribeSucc') }}
                    </p>
                    <div v-else class='section-status-error'>
                        <p>{{ $t('signal.subscribe.subscribeFail') }}</p>
                        <span>{{ `${$t('signal.subscribe.subscribeFailReason')}: ${errorMsg}` }}</span>
                    </div>
                </div>
                <div class='section-info-content'>
                    <section class='section-no-padding warp'>
                        <div v-if='payload?.sy' class='flex flex-col items-center'>
                            <div class='signal-info'>
                                <div class='flex justify-space-between items-flex-start'>
                                    <div class='text-xs mr-1'>
                                        <product-icon :show-symbol-icon='false' :symbol-code='payload.sy' />
                                        <div class='list-item-signal my-1 font-medium'>
                                            {{ getIndicatorName(payload) }}
                                        </div>
                                        <div class='text-xs text-minorColor'>
                                            {{ $t('signal.subscribe.expired', [formatTime(payload.et * 1000, 'YYYY/MM/DD')]) }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <van-icon class='my-8' name='down' size='20' />
                        </div>
                        <SubscribeList
                            class='section-content'
                            :editable='false'
                            :list="type === 'edit' ? [subscribeItem] : subscribeList"
                        />
                    </section>
                    <div class='option'>
                        <van-button v-if='showSignal' block class='btn-outline' @click='handleSignal'>
                            {{ $t('signal.subscribe.viewSignal') }}
                        </van-button>
                    </div>
                </div>
            </div>
        </template>

        <template v-else>
            <div ref='subscribeContentRef' class='content'>
                <div class='warp'>
                    <section>
                        <div class='section-title'>
                            {{ $t('signal.subscribe.selectProduct') }}
                        </div>
                        <div class='section-content'>
                            <search-product :symbol-code='subscribeItem.sy' @onChange='handleProduct' />
                        </div>
                    </section>

                    <section class='section-no-padding'>
                        <div class='section-title'>
                            {{ $t('signal.subscribe.selectSignal') }}
                        </div>
                        <div class='section-content'>
                            <div class='section-item'>
                                <classify-list
                                    v-model='subscribeItem.i'
                                    :is-multiple='false'
                                    :list='signalConfig.indicator'
                                    :style-type='2'
                                />
                            </div>
                            <div class='section-item'>
                                <classify-list
                                    v-model='subscribeItem.pe'
                                    :disabled-list='disabledPeriodeList'
                                    :is-multiple='false'
                                    :list='signalConfig.period'
                                    :style-type='2'
                                />
                            </div>
                        </div>
                    </section>
                    <section class='exporation-time'>
                        <ul>
                            <li v-html="$t('signal.signalsExpiredTips')"></li>
                        </ul>
                    </section>
                </div>

                <template v-if="type !== 'edit'">
                    <van-button
                        block
                        class='option w-full my-5'
                        :disabled='!subscribeItem.sy || !subscribeItem.i || !subscribeItem.pe'
                        :loading='loading'
                        plain
                        :type="!subscribeItem.sy || !subscribeItem.i || !subscribeItem.pe ? 'default' : 'primary'"
                        @click='handleSubscribe'
                    >
                        <span class='mr-2'>
                            {{ $t('signal.subscribe.subscribe') }}
                        </span>
                        <i class='icon_arrow_next'></i>
                    </van-button>

                    <div class='warp mt-5'>
                        <section class='section-no-padding'>
                            <div class='section-title'>
                                {{ $t('signal.subscribe.hasSubscribe') }}
                            </div>
                            <SubscribeList
                                class='section-content'
                                :list='subscribeList'
                                :style="{ minHeight: '126px' }"
                                @on-del='handleDel'
                            />
                        </section>
                        <div class='tg-subscribe'>
                            <tg-subscribe v-if='subscribeList?.length' />
                        </div>
                    </div>
                </template>
                <div v-if="type === 'edit'" class='next'>
                    <popover-tips
                        v-if='selectList?.length === 0'
                        v-model='popoverTipsState'
                        :auto-close='!isPC'
                        :text="$t('signal.subscribe.nextTips')"
                    />
                    <van-button block :loading='loading' :loading-text="$t('signal.common.confirm')" type='primary' @click='handleEdit'>
                        {{ $t('signal.common.confirm') }}
                    </van-button>
                </div>
            </div>
        </template>
    </div>

    <!-- 区域弹窗 -->
    <van-popup v-model:show='pickerShow' position='bottom'>
        <van-datetime-picker v-model='datePickerVal' :min-date='minDate' type='date' @cancel='pickerShow = false' @confirm='dateConfirm' />
    </van-popup>

    <van-popup v-model:show='depositTipsPopupShow' closeable round :style="{ width: isPC ? 'auto' : '90%' }">
        <div class='p-4'>
            <div class='mt-10 mb-5 text-center'>
                <div class='mb-2 text-sm font-bold'>
                    {{ $t('signal.signalsUnlimitedTitle') }}
                </div>
                <div class='text-xs text-normalColor'>
                    {{ $t('signal.signalsUnlimitedTips') }}
                </div>
            </div>
            <div class='flex items-center'>
                <van-button class='mr-4 plain-button flex-1' plain type='primary' @click='depositTipsPopupShow = false'>
                    {{ $t('cancel') }}
                </van-button>
                <van-button block class='flex-1' type='primary' @click='deposit'>
                    {{ $t('trade.desposit') }}
                </van-button>
            </div>
        </div>
    </van-popup>
</template>

<script>
import { ref, computed, onMounted, reactive, toRefs, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import classifyList from '@/plugins/signal/components/classify-list.vue'
import searchProduct from '@/plugins/signal/modules/subscribe/search-product.vue'
import { Toast, Dialog } from 'vant'
import SignalEvent from '@/plugins/signal/utils/signalEvent'
import dayjs from 'dayjs'
import { getTimestamp } from '@/plugins/signal/utils/getRelativeTime'
import popoverTips from '@/components/popover-tips.vue'
import SubscribeList from './operation-subscribe-list.vue'
import tgSubscribe from './tg-subscribe.vue'
import useSignal from '@/plugins/signal/hooks/signal'
import { firebaseAnalytics } from '@/utils/firebase'
import productIcon from '@/plugins/signal/components/product-icon.vue'

export default {
    components: {
        classifyList,
        searchProduct,
        popoverTips,
        SubscribeList,
        tgSubscribe,
        productIcon,
    },
    props: {
        // 操作类型
        type: {
            type: String,
            default: 'add',
        },
        // 快捷参数
        payload: {
            type: Object,
            default: () => {},
        },
    },
    emits: ['close', 'setFirstSub'],
    setup (props, { emit }) {
        const store = useStore()
        const route = useRoute()
        const router = useRouter()
        const { t } = useI18n({ useScope: 'global' })
        const subscribeContentRef = ref(null)
        const { saveTabType } = useSignal()
        const signalConfig = computed(() => store.state._signal.config)
        const customerInfo = computed(() => store.state._user.customerInfo)

        const defaultItem = {
            i: '', // 指标
            pe: '', // 周期
            sy: '', // 产品
            ct: 0, // 创建时间
            ut: 0, // 更新时间
            et: 0, // 过期时间
        }
        const isPC = window.isPC

        const state = reactive({
            step: 0, // 步骤
            subscribeItem: {
                ...defaultItem,
            }, // 当前订阅条件
            subscribeList: [], // 当前已订阅的信号
            selectTime: '', // 选择的时间
            loading: false, // 提交数据加载中
            minDate: dayjs(new Date(getTimestamp())).startOf('day').toDate(), // 最小日期
            popoverTipsState: false, // 订阅按钮是否显示气泡提示
            pickerShow: false, // h5选择日期开关
            datePickerVal: '', // h5选择日期值
            errorMsg: '',
            depositTipsPopupShow: false, // 提示充值弹窗
        })

        watch(
            () => state.subscribeItem.i,
            (res) => {
                if (res === '') {
                    // 未选择指标，清空周期
                    state.subscribeItem.pe = ''
                    return
                }
                // 如果已选择周期不在禁用范围不做任何处理
                if (state.subscribeItem.pe && !disabledPeriodeList.value.includes(state.subscribeItem.pe)) return

                // 如果已选择周期在禁用范围，自动选择禁用范围第一个
                const list = signalConfig.value.period.filter((item) => !disabledPeriodeList.value.includes(item.value))
                state.subscribeItem.pe = list?.[0]?.value || ''
            },
        )

        // 已订阅的信号条件
        const hasSubscribeMap = computed(() => {
            const res = {}
            state.subscribeList.forEach((item) => {
                res[item.sy + item.i + item.pe] = true
            })
            return res
        })

        // 禁用的时间选择
        const disabledPeriodeList = computed(() => {
            return state.subscribeList
                .filter((item) => {
                    return item.sy === state.subscribeItem.sy && item.i === state.subscribeItem.i
                })
                .map((item) => item.pe)
        })

        // 是否可以下一步
        const nextDisabled = computed(() => {
            return props.type !== 'edit' && state.subscribeList.length === 0
        })

        // 切换产品
        const handleProduct = (value) => {
            state.subscribeItem.sy = value
            if (!state.subscribeItem.i) return
            // 如果已选择周期不在禁用范围不做任何处理
            if (state.subscribeItem.pe && !disabledPeriodeList.value.includes(state.subscribeItem.pe)) return

            // 如果已选择周期在禁用范围，自动选择禁用范围第一个
            const list = signalConfig.value.period.filter((item) => !disabledPeriodeList.value.includes(item.value))
            state.subscribeItem.pe = list?.[0].value || ''
        }

        // 检测订阅信息
        const checkSubscribe = () => {
            if (!state.subscribeItem.i || !state.subscribeItem.pe) {
                return t('signal.subscribe.selectSignal')
            }
            if (!state.subscribeItem.sy) {
                return t('signal.subscribe.selectProduct')
            }
            // 判断是否已经添加过
            const item = state.subscribeItem
            if (hasSubscribeMap.value[item.sy + item.i + item.pe]) {
                return t('signal.subscribe.hasSubscribeTips')
            }
            // 判断最大长度
            const hasLeft = store.state._signal.config.subscribeLimit - Object.keys(hasSubscribeMap.value).length
            if (hasLeft <= 0) {
                return t('signal.subscribeMsg.E001', [signalConfig.value.subscribeLimit])
            }
            return true
        }

        // 订阅
        const handleSubscribe = () => {
            // 超过数量1并且未充值提示用户充值
            if (state.subscribeList.length >= 1 && customerInfo.value?.activateStatus !== 1) {
                state.depositTipsPopupShow = true
                return
            }
            const msg = checkSubscribe()
            if (msg !== true) {
                return Dialog.alert({
                    message: msg,
                    confirmButtonText: t('signal.common.iknow'),
                })
            }

            handleUpdate([
                {
                    ...state.subscribeItem,
                    et: dayjs(state.selectTime).endOf('day').unix(),
                    isNew: true,
                },
                ...state.subscribeList,
            ])
        }

        // 移除订阅
        const handleDel = (el, index) => {
            Dialog.confirm({
                title: t('common.tip'),
                message: t('signal.subscribe.delConfirm'),
                beforeClose: (action) =>
                    new Promise((resolve) => {
                        setTimeout(() => {
                            if (action === 'confirm') {
                                store
                                    .dispatch('_signal/deleteQuotapIndicatorSub', index)
                                    .then((res) => {
                                        Toast({
                                            message: t('signal.subscribe.delSucc'),
                                        })
                                        if (res?.data?.items) {
                                            state.subscribeList = res.data.items
                                        }

                                        // 更新列表
                                        store.dispatch('_signal/queryAllQuotaIndicatorSub').then(() => {
                                            // 通知需要监听信号的地方
                                            SignalEvent.emit('SubscribeSignal_REFRESH')
                                            resolve(true)
                                        })
                                    })
                                    .catch(() => {
                                        resolve(false)
                                    })
                            } else {
                                resolve(true)
                            }
                        })
                    }),
            })
        }

        // 更新订阅数据并回调
        const handleCallback = (data, callback, fail) => {
            state.loading = true
            // 提前获取tg订阅bot地址，避免下一步文案闪烁
            store.dispatch('_signal/queryTGInfo')

            return store
                .dispatch(
                    '_signal/cudQuotapIndicatorSub',
                    [...data].map((item, index) => {
                        delete item.isNew
                        return item
                    }),
                )
                .then((res) => {
                    emit('setFirstSub', res?.data?.firstSub)
                    callback && callback()
                    state.loading = false
                    // 更新列表
                    store.dispatch('_signal/queryAllQuotaIndicatorSub').then(() => {
                        // 通知需要监听信号的地方
                        SignalEvent.emit('SubscribeSignal_REFRESH')
                    })
                })
                .catch((err) => {
                    emit('setFirstSub', false)
                    state.loading = false
                    let tips = t('signal.subscribeMsg.E000')
                    switch (err?.data?.message) {
                        case 'E001':
                            tips = t('signal.subscribeMsg.E001', [signalConfig.value.subscribeLimit])
                            break
                        case 'E006':
                            tips = t('signal.subscribeMsg.E006')
                            break
                    }
                    if (typeof fail === 'function') {
                        return fail(tips)
                    } else {
                        return Dialog.alert({
                            message: tips,
                        })
                    }
                })
        }

        // 更新
        const handleUpdate = (list) => {
            // 格式化数据
            const now = getTimestamp(true)
            const formatList = list.map((item) => {
                const { ...rest } = item
                return {
                    ...rest,
                    ct: item.ct || now,
                    ut: item.ut || now,
                }
            })
            return handleCallback(formatList, () => {
                Toast({
                    className: 'toast-position white-sapce-nowrap',
                    type: 'html',
                    message: t('competition.SubscribeSuccessful'),
                    teleport: isPC ? '.product-detail-signal' : null,
                })
                // 重置条件
                state.subscribeItem = {
                    ...defaultItem,
                    sy: state.subscribeItem.sy,
                    i: state.subscribeItem.i,
                }
                state.selectTime = dayjs(getTimestamp()).add(3, 'month').toDate()
                state.subscribeList = list
            })
        }

        // 编辑
        const handleEdit = () => {
            const now = getTimestamp(true)
            const subscribeList = [...store.state._signal.subscribeList]
            // 获取当前索引
            const currentIndex = subscribeList.findIndex((item) => {
                return item.sy + item.i + item.pe + item.et === props.payload.sy + props.payload.i + props.payload.pe + props.payload.et
            })
            if (currentIndex === -1) {
                return Dialog.alert({
                    message: t('signal.subscribeMsg.E000'),
                })
            }
            const subscribeItem = {
                ...state.subscribeItem,
                ct: state.subscribeItem.ct || now,
                ut: now,
                et: dayjs(state.selectTime).endOf('day').unix(),
            }
            subscribeList[currentIndex] = {
                ...subscribeItem,
            }
            state.subscribeList[0] = {
                ...subscribeItem,
            }
            return handleCallback(subscribeList, () => {
                state.step = 1
            })
        }

        // 关闭弹窗
        const handleClose = () => {
            emit('close')
        }

        // 是否行情交易页，如果是则隐藏查看信号按钮
        const showSignal = computed(() => {
            return !((isPC && route.path === '/order') || (!isPC && route.path === '/product'))
        })

        // 查看信号
        const handleSignal = () => {
            handleClose()
            // 如果是从我的信号弹窗出来的需要主动关闭
            SignalEvent.emit('DrawerMySubscribeClose')
            saveTabType('mine')
        }

        // 初始化el-picker
        const disabledDate = (time) => {
            return time.getTime() <= state.minDate.getTime()
        }
        const handlePickerChange = (e) => {
            // 某些情况下会选择旧的日期
            if (disabledDate(e)) {
                state.selectTime = state.minDate
            }
        }
        // 选择日期
        const dateConfirm = (val) => {
            state.selectTime = val
            state.pickerShow = false
        }

        onMounted(() => {
            state.subscribeList = [...store.state._signal.subscribeList]
            store.dispatch('_signal/queryTGInfo')
            store.dispatch('_signal/queryAllQuotaIndicatorSub').then((res) => {
                if (res?.data?.items) {
                    state.subscribeList = [...res.data.items]
                    // 点击订阅后，判断订阅过一个信号时，默认给客户ma和1h的默认选中，订阅过信号就不用默认了
                    if (res.data.items.length === 0) {
                        state.subscribeItem = {
                            ...state.subscribeItem,
                            i: 'MA',
                            pe: '1h',
                        }
                    }
                }
            })

            // 初始化条件
            if (props.payload && Object.keys(props.payload).length) {
                // 设置默认产品
                if (props.payload?.sy) {
                    // 信号参数
                    state.subscribeItem = {
                        ...state.subscribeItem,
                        i: props.payload.i || '',
                        pe: props.payload.pe || '',
                        sy: props.payload.sy
                    }
                } else if (props.payload.hasOwnProperty('et')) {
                    // 订阅参数
                    state.subscribeItem = {
                        ...props.payload,
                    }
                }
            }

            // 初始化过期时间 默认一个月
            if (state.subscribeItem.et) {
                const date = new Date(state.subscribeItem.et * 1000)
                state.selectTime = date
                state.datePickerVal = date
            } else {
                const date = dayjs(getTimestamp()).add(3, 'month').toDate()
                state.datePickerVal = date
                state.selectTime = dayjs(getTimestamp()).add(3, 'month').toDate()
            }
        })

        // 充值
        const deposit = () => {
            window.dataLayer?.push({
                event: 'depositBtn',
                'gtm.elementClasses': 'depositButton',
                eventModel: {
                    account_Number: customerInfo.value?.customerNo,
                },
            })

            state.depositTipsPopupShow = false
            firebaseAnalytics('ck_deposit_entrance', {
                key: 'ck_deposit_entrance',
                value: JSON.stringify({
                    email: customerInfo.value?.emailAll || customerInfo.value?.email || '',
                    phone: customerInfo.value?.phoneAll || customerInfo.value?.phone || '',
                    userID: customerInfo.value?.customerNo,
                }),
            })
            if (window.isPC) {
                const url = route.path + '/' + 'recharge'
                router.push(url)
            } else {
                router.push({
                    path: '/deposit',
                })
            }
        }

        const getIndicatorName = (item) => {
            return store.getters['_signal/getIndicatorName'](item)
        }

        return {
            ...toRefs(state),
            subscribeContentRef,
            signalConfig,
            disabledDate,
            handleProduct,
            handleSubscribe,
            handleDel,
            hasSubscribeMap,
            handleClose,
            dateConfirm,
            isPC,
            handlePickerChange,
            nextDisabled,
            showSignal,
            handleSignal,
            disabledPeriodeList,
            deposit,
            getIndicatorName,
            handleEdit,
        }
    },
}
</script>

<style lang="scss">
.toast-position {
    position: absolute !important;
}
// 日期被挡问题
.OperationSubPicker {
    z-index: 999999999 !important;
}
</style>

<style lang="scss" scoped>
@import '~@/sass/mixin.scss';
.subscribe {
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    position: relative;

    &.subscribe-auto {
        height: auto;
    }
    .subscribe-title {
        font-size: 20px;
        font-weight: 700;
        color: var(--color);
        padding: 16px 12px;
        display: flex;
        align-items: center;
        border-bottom: 1px solid var(--lineColor);
    }
    .content {
        flex: 1;
        padding: 12px;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
        @include scroll-bar-vertical;
    }
    .signal-info {
        width: calc(50% - 6px);
        background: var(--bgColor);
        padding: 12px;
        border-radius: 8px;
        position: relative;
        min-width: 180px;
    }
    section {
        &.section-no-padding {
            padding-bottom: 0;
        }
        .section-title {
            display: flex;
            align-items: center;
            font-size: 14px;
            line-height: normal;
            margin-bottom: 12px;
            font-weight: bold;
            &.text-center {
                text-align: center;
            }
            .section-placeholder {
                color: var(--placeholdColor);
            }
            :deep {
                .icon-question {
                    top: 0;
                }
            }
        }
        .section-content {
            margin-bottom: 15px;
            .section-item {
                margin-bottom: 10px;
                &:first-child {
                    border-bottom: 1px solid var(--lineColor);
                }
                :deep {
                    .classify-list {
                        justify-content: space-between;
                        padding-bottom: 10px;
                        .item {
                            position: relative;
                            height: 28px;
                            transition: none;
                            border: 1px solid var(--contentColor);
                            display: flex;
                            margin-right: 0;
                            padding: 0 8px;
                            margin: 0;
                            span::after {
                                content: none;
                            }
                            &.active-item {
                                border-color: var(--primary);
                                border-radius: 3px;
                                &::before {
                                    position: absolute;
                                    right: 3px;
                                    top: 0;
                                    width: 2px;
                                    height: 5px;
                                    border-color: var(--contentColor);
                                    border-style: solid;
                                    border-width: 0 1px 1px 0;
                                    transform: rotate(45deg);
                                    z-index: 99;
                                    color: var(--primary);
                                    content: '';
                                }
                                &::after {
                                    background: var(--primary);
                                    width: 10px;
                                    height: 10px;
                                    position: absolute;
                                    content: '';
                                    right: -1px;
                                    top: -1px;
                                    border-radius: 0 3px;
                                }
                            }
                        }
                    }
                }
            }
            .picker {
                padding: 0 10px;
                height: 30px;
                border: 1px solid var(--minorColor);
                display: inline-flex;
                align-items: center;
                input {
                    color: var(--color);
                    user-select: none;
                }
            }
        }
    }
    .option {
        position: relative;
        .btn-popover-tips {
            top: -2.2rem !important;
            :deep {
                .popover-relative .triangle {
                    left: 60px;
                }
            }
        }
        .van-button {
            min-width: 120px;
            &.btn-outline {
                display: flex;
                margin: 20px auto;
                color: var(--primary);
                border-color: var(--primary);
                background-color: var(--contentColor);
                justify-content: center;
                .icon_arrow_next {
                    display: inline-flex;
                    align-items: center;
                    margin-right: 4px;
                }
                &:hover {
                    opacity: 0.9;
                    background: transparent;
                }
                &::before {
                    content: none;
                }
            }
            &.btn-subscribe {
                height: 35px;
                background: transparent;
            }
        }
        .tips {
            color: var(--minorColor);
            padding: 6px 0;
            font-size: 12px;
        }
    }
    .next {
        width: 100%;
        margin: 15px auto 0;
        position: relative;
        .van-button.disabled,
        .van-button.disabled:hover {
            cursor: not-allowed;
            opacity: var(--van-button-disabled-opacity);
        }
        .popover-tips {
            margin-top: -44px;
        }
        &.step1 {
            display: flex;
            button {
                flex: 1;
                &:last-child {
                    margin-left: 15px;
                }
            }
        }
    }
    .van-button--primary {
        line-height: normal;

        :deep {
            .van-loading {
                margin-right: 5px;
            }
        }
    }
    .section-info {
        .section-status {
            text-align: center;
            .van-icon {
                color: var(--primary);
            }
            .section-status-error {
                padding: 0 20px;
                margin-bottom: 15px;
                p {
                    margin-bottom: 10px;
                }
                span {
                    font-size: 14px;
                    color: var(--normalColor);
                }
            }
            p {
                font-size: 16px;
                font-weight: bold;
                margin: 24px;
            }
        }
        .section-info-content {
            padding: 0 20px;
            .section-title {
                justify-content: center;
            }
            .option {
                margin-top: 40px;
            }
        }
    }
    :deep {
        .van-empty {
            padding: 0 0 10px;
            .van-empty__image {
                --van-empty-image-size: 120px;
            }
            .van-empty__description {
                padding: 0.2rem;
            }
        }
    }
}

.exporation-time {
    font-size: 12px;
    color: var(--minorColor);
    position: relative;
    ul {
        list-style: disc;
        padding-left: 12px;
    }
    p {
        color: var(--color);
    }
}

// 移动版本
@media screen and (max-width: 768px) {
    .subscribe {
        width: 100%;
        overflow: auto;
        max-width: inherit;
        min-height: inherit;
        display: flex;
        flex-direction: column;
        flex: 1;
        .subscribe-title {
            border: none;
        }
        .next {
            margin-bottom: 15px;
        }
    }
}
.h5 {
    .tg-subscribe {
        position: fixed;
        bottom: 0;
        width: 100%;
        left: 0;
        padding: 12px;
        background: var(--contentColor);
        margin: 0;
    }
    .content {
        padding-bottom: 100px;
    }
}
</style>
