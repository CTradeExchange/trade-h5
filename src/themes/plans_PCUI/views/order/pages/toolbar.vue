<template>
    <div class='toolbar'>
        <div class='tabs'>
            <div class='tabs-content'>
                <!-- <button :class="{ active: pane.module === 'watchlist' }" @click="handleChange('watchlist')">
                    <svg fill='none' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'>
                        <g id='Document'>
                            <g id='Iconly/Light/Document'>
                                <g id='Document_2'>
                                    <path
                                        id='Stroke-1'
                                        d='M15.7161 16.2234H8.49609'
                                        :stroke="pane.module === 'watchlist' ? 'var(--primary)' : '#666'"
                                        stroke-linecap='round'
                                        stroke-linejoin='round'
                                        stroke-width='1.5'
                                    />
                                    <path
                                        id='Stroke-2'
                                        d='M15.7161 12.0369H8.49609'
                                        :stroke="pane.module === 'watchlist' ? 'var(--primary)' : '#666'"
                                        stroke-linecap='round'
                                        stroke-linejoin='round'
                                        stroke-width='1.5'
                                    />
                                    <path
                                        id='Stroke-3'
                                        d='M11.2511 7.8601H8.49609'
                                        :stroke="pane.module === 'watchlist' ? 'var(--primary)' : '#666'"
                                        stroke-linecap='round'
                                        stroke-linejoin='round'
                                        stroke-width='1.5'
                                    />

                                    <path
                                        id='Stroke-4'
                                        clip-rule='evenodd'
                                        d='M15.9085 2.7498C15.9085 2.7498 8.23149 2.7538 8.21949 2.7538C5.45949 2.7708 3.75049 4.5868 3.75049 7.3568V16.5528C3.75049 19.3368 5.47249 21.1598 8.25649 21.1598C8.25649 21.1598 15.9325 21.1568 15.9455 21.1568C18.7055 21.1398 20.4155 19.3228 20.4155 16.5528V7.3568C20.4155 4.5728 18.6925 2.7498 15.9085 2.7498Z'
                                        fill-rule='evenodd'
                                        :stroke="pane.module === 'watchlist' ? 'var(--primary)' : '#666'"
                                        stroke-linecap='round'
                                        stroke-linejoin='round'
                                        stroke-width='1.5'
                                    />
                                </g>
                            </g>
                        </g>
                    </svg>

                    <p>{{ $t('trade.watchlist') }}</p>
                </button> -->
                <button v-if='product?.enableDepthTrade === 2' :class="{ active: pane.module === 'offer' }" @click="handleChange('offer')">
                    <svg fill='none' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'>
                        <g id='Chart'>
                            <g id='Group 44946'>
                                <path
                                    id='Path'
                                    clip-rule='evenodd'
                                    d='M16.6857 2H7.31429C4.04762 2 2 4.31208 2 7.58516V16.4148C2 19.6879 4.0381 22 7.31429 22H16.6857C19.9619 22 22 19.6879 22 16.4148V7.58516C22 4.31208 19.9619 2 16.6857 2Z'
                                    fill-rule='evenodd'
                                    :stroke="pane.module === 'offer' ? 'var(--primary)' : '#666'"
                                    stroke-linecap='round'
                                    stroke-linejoin='round'
                                    stroke-width='1.5'
                                />
                                <g id='Group 44945'>
                                    <path
                                        id='Vector 186'
                                        d='M4 8H6V10.1053H9V11.6842H12V18'
                                        :stroke="pane.module === 'offer' ? 'var(--primary)' : '#666'"
                                        stroke-width='1.5'
                                    />
                                    <path
                                        id='Vector 187'
                                        d='M20 8H18V10.1053H15V11.6842H12V18'
                                        :stroke="pane.module === 'offer' ? 'var(--primary)' : '#666'"
                                        stroke-width='1.5'
                                    />
                                </g>
                            </g>
                        </g>
                    </svg>

                    <p>{{ $t('trade.offer') }}</p>
                </button>
                <button :class="{ active: pane.module === 'signal' }" @click="handleChange('signal')">
                    <svg fill='none' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'>
                        <path d='M12 13V21M9 21H15' :stroke="pane.module === 'signal' ? 'var(--primary)' : '#666'" stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' />
                        <path d='M11.9502 12H12.0502' :stroke="pane.module === 'signal' ? 'var(--primary)' : '#666'" stroke-linecap='round' stroke-linejoin='round' stroke-width='2' />
                        <path d='M5.64 18.36C4.38021 17.1018 3.52193 15.4981 3.17376 13.752C2.82558 12.0059 3.00316 10.1957 3.68402 8.5505C4.36488 6.90531 5.51842 5.49904 6.99871 4.50962C8.47899 3.52019 10.2195 2.99207 12 2.99207C13.7805 2.99207 15.521 3.52019 17.0013 4.50962C18.4816 5.49904 19.6351 6.90531 20.316 8.5505C20.9968 10.1957 21.1744 12.0059 20.8263 13.752C20.4781 15.4981 19.6198 17.1018 18.36 18.36' :stroke="pane.module === 'signal' ? 'var(--primary)' : '#666'" stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' />
                        <path d='M15.54 15.54C16.238 14.8402 16.7129 13.9493 16.9049 12.9797C17.0968 12.0102 16.997 11.0055 16.6182 10.0926C16.2394 9.17968 15.5985 8.39953 14.7765 7.85069C13.9546 7.30184 12.9884 7.00891 12 7.00891C11.0116 7.00891 10.0454 7.30184 9.22347 7.85069C8.40149 8.39953 7.76062 9.17968 7.38181 10.0926C7.00301 11.0055 6.90325 12.0102 7.09515 12.9797C7.28706 13.9493 7.762 14.8402 8.46 15.54' :stroke="pane.module === 'signal' ? 'var(--primary)' : '#666'" stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' />
                    </svg>

                    <p>{{ $t('signal.detail.signal') }}</p>
                </button>

                <button :class="{ active: pane.module === 'event' }" @click="handleChange('event')">
                    <svg fill='none' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'>
                        <path d='M3.09277 9.40425H20.9167' :stroke="pane.module === 'event' ? 'var(--primary)' : '#666'"
                              stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5'
                        />
                        <path d='M16.4419 13.3097H16.4512' :stroke="pane.module === 'event' ? 'var(--primary)' : '#666'" stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' />
                        <path d='M12.0044 13.3097H12.0137' :stroke="pane.module === 'event' ? 'var(--primary)' : '#666'" stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' />
                        <path d='M7.55811 13.3097H7.56737' :stroke="pane.module === 'event' ? 'var(--primary)' : '#666'" stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' />
                        <path d='M16.4419 17.1962H16.4512' :stroke="pane.module === 'event' ? 'var(--primary)' : '#666'" stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' />
                        <path d='M12.0044 17.1962H12.0137' :stroke="pane.module === 'event' ? 'var(--primary)' : '#666'" stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' />
                        <path d='M7.55811 17.1962H7.56737' :stroke="pane.module === 'event' ? 'var(--primary)' : '#666'" stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' />
                        <path d='M16.0439 2V5.29078' :stroke="pane.module === 'event' ? 'var(--primary)' : '#666'" stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' />
                        <path d='M7.96533 2V5.29078' :stroke="pane.module === 'event' ? 'var(--primary)' : '#666'" stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' />
                        <path clip-rule='evenodd' d='M16.2383 3.57919H7.77096C4.83427 3.57919 3 5.21513 3 8.22222V17.2719C3 20.3262 4.83427 22 7.77096 22H16.229C19.175 22 21 20.3546 21 17.3475V8.22222C21.0092 5.21513 19.1842 3.57919 16.2383 3.57919Z' fill-rule='evenodd' :stroke="pane.module === 'event' ? 'var(--primary)' : '#666'" stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' />
                    </svg>

                    <div v-if='hasNewEvent' class='has-new-event'></div>
                    <p>{{ $t('information.event') }}</p>
                </button>

                <button :class="{ active: pane.module === 'funds' }" @click="handleChange('funds')">
                    <svg fill='none' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'>
                        <g id='Wallet'>
                            <g id='Iconly/Light/Wallet'>
                                <g id='Wallet_2'>
                                    <path
                                        id='Stroke-1'
                                        d='M21.6389 14.3958H17.5906C16.1042 14.3949 14.8993 13.1909 14.8984 11.7045C14.8984 10.218 16.1042 9.01413 17.5906 9.01321H21.6389'
                                        :stroke="pane.module === 'funds' ? 'var(--primary)' : '#666'"
                                        stroke-linecap='round'
                                        stroke-linejoin='round'
                                        stroke-width='1.5'
                                    />
                                    <path
                                        id='Stroke-3'
                                        d='M18.0485 11.6429H17.7368'
                                        :stroke="pane.module === 'funds' ? 'var(--primary)' : '#666'"
                                        stroke-linecap='round'
                                        stroke-linejoin='round'
                                        stroke-width='1.5'
                                    />
                                    <path
                                        id='Stroke-5'
                                        clip-rule='evenodd'
                                        d='M7.74766 3H16.3911C19.2892 3 21.6388 5.34951 21.6388 8.24766V15.4247C21.6388 18.3229 19.2892 20.6724 16.3911 20.6724H7.74766C4.84951 20.6724 2.5 18.3229 2.5 15.4247V8.24766C2.5 5.34951 4.84951 3 7.74766 3Z'
                                        fill-rule='evenodd'
                                        :stroke="pane.module === 'funds' ? 'var(--primary)' : '#666'"
                                        stroke-linecap='round'
                                        stroke-linejoin='round'
                                        stroke-width='1.5'
                                    />
                                    <path
                                        id='Stroke-7'
                                        d='M7.03564 7.53816H12.4346'
                                        :stroke="pane.module === 'funds' ? 'var(--primary)' : '#666'"
                                        stroke-linecap='round'
                                        stroke-linejoin='round'
                                        stroke-width='1.5'
                                    />
                                </g>
                            </g>
                        </g>
                    </svg>
                    <p>{{ $t('trade.funds') }}</p>
                </button>

                <div class='separator'></div>

                <button :class="{ active: pane.panel === 'trade' }" @click="handleChange('trade', 'panel')">
                    <svg fill='none' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'>
                        <g id='trade_a 1'>
                            <path
                                id='Vector'
                                d='M17.7511 22.712C20.8251 22.712 23.3171 20.25 23.3171 17.212C23.3171 14.175 20.8251 11.712 17.7511 11.712C14.6771 11.712 12.1851 14.175 12.1851 17.212C12.1851 20.25 14.6771 22.712 17.7511 22.712Z'
                                :fill="pane.panel === 'trade' ? '#FDDED9' : '#f9f9fb'"
                            />
                            <path
                                id='Vector_2'
                                d='M0.416016 11.674C0.416016 6.15101 4.94602 1.67401 10.536 1.67401C16.125 1.67401 20.656 6.15101 20.656 11.674C20.656 17.197 16.125 21.674 10.536 21.674C4.94602 21.674 0.416016 17.197 0.416016 11.674Z'
                                :fill="pane.panel === 'trade' ? 'var(--primary)' : '#666'"
                            />
                            <path
                                id='Vector_3'
                                d='M8.39994 15.222L8.02094 14.566C7.99981 14.5295 7.98609 14.4891 7.98059 14.4472C7.97508 14.4053 7.97789 14.3628 7.98885 14.322C7.99981 14.2812 8.01871 14.243 8.04446 14.2096C8.07022 14.1761 8.10233 14.148 8.13894 14.127L13.9559 10.768C13.9925 10.7467 14.033 10.7329 14.075 10.7273C14.1169 10.7217 14.1596 10.7245 14.2005 10.7354C14.2414 10.7464 14.2797 10.7654 14.3133 10.7912C14.3468 10.817 14.3749 10.8493 14.3959 10.886L14.7739 11.542C14.7952 11.5786 14.8091 11.6191 14.8147 11.661C14.8203 11.703 14.8175 11.7457 14.8065 11.7866C14.7956 11.8275 14.7766 11.8658 14.7508 11.8993C14.7249 11.9329 14.6927 11.961 14.6559 11.982L8.83994 15.34C8.80338 15.3611 8.76301 15.3749 8.72115 15.3804C8.67928 15.3859 8.63674 15.3831 8.59596 15.3721C8.55518 15.3611 8.51696 15.3422 8.4835 15.3165C8.45003 15.2907 8.42198 15.2586 8.40094 15.222H8.39994ZM7.59694 14.444L8.43494 13.956L10.9849 14.606C11.0672 14.6272 11.1377 14.6802 11.181 14.7533C11.2243 14.8264 11.2369 14.9137 11.2159 14.996L11.0109 15.821C10.9906 15.9034 10.9384 15.9743 10.8659 16.0184C10.7934 16.0624 10.7064 16.0759 10.6239 16.056L7.73194 15.362C7.63492 15.3387 7.5471 15.2868 7.47979 15.2132C7.41248 15.1395 7.36875 15.0474 7.35423 14.9486C7.33971 14.8499 7.35506 14.7491 7.39832 14.6592C7.44157 14.5692 7.51075 14.4943 7.59694 14.444ZM12.6319 7.97901L13.0119 8.63501C13.0331 8.67157 13.0468 8.71194 13.0523 8.75381C13.0578 8.79567 13.055 8.83822 13.044 8.879C13.0331 8.91978 13.0142 8.958 12.9884 8.99146C12.9627 9.02492 12.9306 9.05298 12.8939 9.07401L7.07594 12.433C7.0022 12.4754 6.91465 12.4868 6.83253 12.4646C6.75041 12.4425 6.68042 12.3887 6.63794 12.315L6.25794 11.659C6.23681 11.6225 6.22309 11.5821 6.21759 11.5402C6.21208 11.4983 6.21489 11.4558 6.22585 11.415C6.23681 11.3742 6.25571 11.336 6.28147 11.3026C6.30722 11.2691 6.33933 11.241 6.37594 11.22L12.1939 7.86101C12.2677 7.81864 12.3552 7.80727 12.4374 7.8294C12.5195 7.85152 12.5895 7.90533 12.6319 7.97901ZM13.4359 8.75701L12.5979 9.24501L10.0479 8.59501C9.96548 8.57403 9.89472 8.52116 9.85121 8.44803C9.80771 8.3749 9.79502 8.28749 9.81594 8.20501L10.0219 7.38001C10.0423 7.29787 10.0943 7.22709 10.1666 7.18308C10.2389 7.13907 10.3256 7.12539 10.4079 7.14501L13.3009 7.83901C13.398 7.86235 13.4858 7.9142 13.5531 7.98787C13.6204 8.06154 13.6641 8.15366 13.6787 8.25239C13.6932 8.35112 13.6778 8.45194 13.6346 8.54187C13.5913 8.6318 13.5221 8.70672 13.4359 8.75701Z'
                                fill='white'
                            />
                        </g>
                    </svg>
                    <p>{{ $t('trade.trade') }}</p>
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import { computed, watch, onMounted, onUnmounted, reactive, toRefs } from 'vue'
import { useStore } from 'vuex'
import { localSet, localGet, getCookie, isEmpty, } from '@/utils/util'
import { useRouter } from 'vue-router'
import { GetItems } from '@/api/newApi'
import mitt from '@/utils/mitt'

export default {
    props: {
        pane: {
            type: Object,
            default: () => {},
        },
    },
    emits: ['update:pane'],
    setup (props, { emit }) {
        const store = useStore()
        const router = useRouter()

        // 是否模拟
        const customerInfo = computed(() => store.state._user.customerInfo)
        const isDemo = computed(() => customerInfo.value?.companyType === 'demo')
        const product = computed(() => store.getters.productActived)

        const state = reactive({
            hasNewEvent: false
        })

        // 切换页面
        const handleChange = (pageName, type = 'module') => {
            if (pageName == 'funds') {
                if (!customerInfo.value) {
                    router.push('/login')
                    return
                }
            }
            const pane = {
                ...props.pane,
                [type]: props.pane[type] === pageName ? '' : pageName,
            }
            emit('update:pane', pane)
        }

        // 更新面板
        watch(
            () => props.pane,
            (newVal) => {
                localSet('ToolBarPanelStorage', JSON.stringify(newVal))
            },
            {
                deep: true,
            },
        )

        // 关闭页面
        const handleClose = (type = 'module') => {
            handleChange(type, 'module')
        }

        const checkHasNewEvent = () => {
            const body = {
                Limit: 8,
                Offset: 1,
                Conditions: {
                    Type: 1,
                    Status: 2,
                    Language: getCookie('lang') || 'en-US',
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
                            state.hasNewEvent = true
                        } else {
                            if (homeDataCache == JSON.stringify(List)) {
                                state.hasNewEvent = false
                            } else {
                                state.hasNewEvent = true
                            }
                        }
                    } else {
                        state.hasNewEvent = false
                    }
                })
                .catch((err) => {
                    state.hasNewEvent = false
                })
        }

        onMounted(() => {
            checkHasNewEvent()
            mitt.on('EVENT_HAS_UPDATE', (result) => {
                state.hasNewEvent = result
            })
        })
        onUnmounted(() => [
            mitt.off('EVENT_HAS_UPDATE')
        ])

        return {
            handleChange,
            handleClose,
            isDemo,
            ...toRefs(state),
            product
        }
    },
}
</script>

<style lang="scss" scoped>
.toolbar {
    display: flex;
    justify-content: space-between;
    flex: 1;
    width: 64px;
    background-color: var(--contentColor);
    border-radius: 8px;
    &.toolbar-module {
        min-width: 345px;
    }
    .panel-content {
        width: 100%;
        height: 100%;
        position: relative;
    }
    .module-content {
        display: flex;
        flex-direction: column;
        flex: 1;
        height: 100%;
        position: relative;
        .right-wrap-content {
            height: 100%;
            overflow: hidden;
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            display: flex;
            flex-direction: column;
            :deep {
                .btn-subscribe {
                    padding: 0 12px;
                }
            }
        }
    }
    .tabs {
        height: 100%;
        overflow: hidden;
        .tabs-content {
            button {
                height: 70px;
                position: relative;
                width: 70px;
                z-index: 0;
                align-items: center;
                color: var(--color);
                background: none;
                cursor: pointer;
                &::before {
                    content: '';
                    position: absolute;
                    top: 4px;
                    bottom: 4px;
                    left: 4px;
                    right: 4px;
                    border-radius: 8px;
                    z-index: -1;
                }
                &:not(.active):hover::before {
                    background-color: #f0f3fa;
                }
                &.active {
                    color: var(--primary);
                    &::before {
                        background-color: #fef7f6;
                    }
                }
                p {
                    font-size: 12px;
                    font-weight: 500;
                }
                .has-new-event{
                  position: absolute;
                    top: 12px;
                    right: 23px;
                    width:6px;
                    height:6px;
                    background-color:var(--primary);
                    border-radius:3px;
                }
            }
            .separator {
                align-self: stretch;
                background-color: var(--lineColor);
                flex: 0 0 auto;
                height: 1px;
                margin: 6px;
            }
        }
    }
}
body.night {
    .toolbar {
        .tabs {
            .tabs-content {
                button {
                    &:not(.active):hover {
                        &::before {
                            background: var(--primaryAssistColor);
                        }
                    }
                }
            }
        }
    }
}
</style>
