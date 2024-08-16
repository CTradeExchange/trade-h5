<template>
    <el-dialog
        v-model='visibles'
        center
        class='dialog-box'
        :title="$t('common.Related')"
        width='500px'
        @close='handleClose'
    >
        <div class='mPopupBox'>
            <div v-for='item in tradeItemList' :key='item.ID' class='mpb-content' :onclick='item.ID === 35630 ? () => handleDatalayerEvent() : null' @click='handleSkip(item)'>
                <div :class="[item.Type===1?'content-1':'content-2']">
                    <el-rate
                        v-if='item.Type===2'
                        v-model='item.Important'
                        disabled
                        max='3'
                    />
                    <p>{{ item.Title }}</p>
                </div>
                <van-icon name='arrow' />
            </div>
            <div class='mpb-footer'>
                <div @click='handleTradePage(-1)'>
                    <van-icon name='arrow-left' />
                </div>
                <div @click='handleTradePage(1)'>
                    <van-icon name='arrow' />
                </div>
            </div>
        </div>
    </el-dialog>
</template>

<script>
import { reactive, toRefs, watch } from 'vue'
import { GetTrade, GetTradeByID } from '@/api/newApi'
import { getCookie, parseJSON } from '@/utils/util'
import { useRouter, useRoute } from 'vue-router'
import { Toast } from 'vant'
import { useI18n } from 'vue-i18n'
export default {
    props: {
        initLoad: {
            Type: Boolean,
            default: false
        },
        visibles: {
            Type: Boolean,
            default: false
        },
        tradeID: {
            default: null
        },
        symbolId: {
            default: null
        },
    },
    setup (props, context) {
        const router = useRouter()
        const route = useRoute()
        const { t } = useI18n({ useScope: 'global' })
        const state = reactive({
            tradeItemCount: 0,
            tradeItemList: [],
            tradeCurPage: 1,
            tradeItemObj: {},
            isCallBack: false
        })
        const handleTradePage = (num) => {
            const Offset = state.tradeCurPage + num
            if (num > 0 && state.tradeCurPage * 5 >= state.tradeItemCount) {
                Toast(t('common.noMore'))
                return
            } else if (num < 0 && Offset <= 0) {
                Toast(t('common.noMore'))
                return
            }
            handleGetTrade(Offset)
        }

        const handleSkip = (item) => {
            const { ID, Type } = item || {}
            handleClose()
            if (Type === 1) {
                router.push(`/infoDetail?id=${ID}`)
            } else {
                router.push(`/economicCalendar?id=${ID}`)
            }
        }

        const handleGetTrade = async (Offset = 1) => {
            const { symbolId, tradeID } = props || {}
            let tradeId = tradeID
            if (!tradeId && symbolId) {
                await GetTrade({
                    body: {
                        Conditions: {
                            SymbolId: String(symbolId)
                        },
                        Language: getCookie('lang')
                    }
                }).then(res => {
                    const [{ ID } = {}] = res.List || []
                    tradeId = ID
                })
            }
            if (!tradeId) return
            await GetTradeByID({
                body: {
                    ID: tradeId,
                    Language: getCookie('lang'),
                    Limit: 5,
                    Offset
                }
            }).then(res => {
                if (state.tradeItemCount !== res.TotalCount) {
                    state.tradeItemCount = res.TotalCount
                }
                state.tradeCurPage = res.CurPage || 1
                state.tradeItemList = (res.Trade?.Items || []).map(i => ({
                    ...i,
                    ...(parseJSON(i.Description) || {})
                }))
                if (res.CurPage === 1) {
                    state.tradeItemObj = res.Trade?.Items ? res.Trade?.Items[0] || {} : {}
                }
                if (!state.isCallBack && props.initLoad) {
                    state.isCallBack = true
                    if (res.TotalCount > 0) {
                        context.emit('callBack', {
                            title: state.tradeItemObj.Title,
                            count: res.TotalCount
                        })
                    } else {
                        context.emit('callBack', null)
                    }
                }
            })
        }

        watch(() => props.visibles, (newVal) => {
            if (newVal) handleGetTrade()
        })

        watch(() => [props.tradeID, props.symbolId, props.initLoad], ([tUd, sId, init]) => {
            if ((tUd || sId) && init) {
                state.isCallBack = false
                handleGetTrade()
            }
        }, {
            immediate: true
        })

        const handleClose = () => {
            context.emit && context.emit('close')
        }

        const handleDatalayerEvent = () => {
            const dataLayer = window.dataLayer || []
            const path = window.location.pathname
            const elementId = path.includes('quote') ? 'click_quote_hotevent' : 'click_trade_hotevent'

            dataLayer.push({
                'event': 'clickRate',
                'gtm.elementId': elementId
            })
        }

        return {
            handleTradePage,
            handleClose,
            handleSkip,
            handleDatalayerEvent,
            ...toRefs(state)
        }
    }
}
</script>

<style lang="scss">
.dialog-box {
    & > div:last-of-type {
        padding: 0;
    }
}
</style>

<style lang="scss" scoped>
.mPopupBox {
    width: 100%;
    height: 60vh;
    min-height: 600px;
    background: #FFFFFF;
    border-radius: remFree(15px);
    position: relative;
    padding: 0 0 remFree(110px);
    overflow: hidden;
    .mpb-content {
        height: remFree(110px);
        display: flex;
        align-items: center;
        border-bottom: 1px solid var(--lineColor);
        margin: 0 remFree(30px);
        padding: remFree(10px) 0;
        cursor: pointer;
        &:hover {
            opacity: 0.75;
        }
        & > div {
            flex: 1;
            height: 100%;
            display: flex;
            flex-direction: column;
            font-size: remFree(24px);
            color: var(--primary);
            padding-right: remFree(10px);
            box-sizing: border-box;
            &.content-1{
                justify-content: center;
            }
            &.content-2{
                justify-content: space-between
            }
            & > p {
                line-height: 1.2;
                @include ellipsisLn(2);
            }
            :deep(.el-rate) {
                height: auto;
            }
            :deep(.el-rate__icon) {
                --color: #be1e2d;
                font-size: remFree(20px) !important;
            }
        }
    }
    .mpb-footer {
        width: 100%;
        height: remFree(110px);
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        bottom: 0;
        z-index: 1;
        background: var(--contentColor);
        & > div {
            width: remFree(44px);
            height: remFree(44px);
            border-radius: 50%;
            background: #8D8D8D;
            display: flex;
            justify-content: center;
            align-items: center;
            color: var(--contentColor);
            margin: 0 remFree(30px);
            cursor: pointer;
            &:active {
                opacity: 0.75;
            }
        }
    }
}
</style>
