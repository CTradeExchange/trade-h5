<template>
    <div class='btnGroup'>
        <div v-for='(item) in list' :key='item.symbolName' class='btnOutSide' :class='position'>
            <div v-if='item.symbolName' class='list-item' @click.stop='goToDetail(item)'>
                <div class='list-item-name'>
                    <div class='list-item-name-left'>
                        <!-- <img alt='' src='../../images/fire.png' /> -->
                        <div class='token-swap-icon'>
                            <img :src='`/images/currency_icon/${setH5FormatIconHandle(item.symbolKey, 0)}.png`' />
                            <img :src='`/images/currency_icon/${setH5FormatIconHandle(item.symbolKey, 1)}.png`' />
                        </div>
                        <span>{{ item.symbolName }}</span>
                    </div>

                    <div class='list-item-name-right'>
                        <!-- <svg
                            v-if="item?.rolling_upDownColor && item?.rolling_upDownColor == 'riseColor'"
                            fill='none'
                            height='40'
                            viewBox='0 0 72 40'
                            width='72'
                            xmlns='http://www.w3.org/2000/svg'
                        >
                            <g clip-path='url(#clip0_78_9179)'>
                                <path
                                    d='M13.5384 27.5834C9.27338 30.9975 1.16406 30.7447 1.16406 30.7447L1.16406 41.9959H70.9998V23.0465C70.9998 23.0465 63.9781 32.0882 58.8651 30.7447C55.1865 29.7781 54.2948 25.5677 51.0132 23.0465C48.2164 20.8977 48.4677 18.498 43.5183 18.498C37.8078 18.498 38.0242 7.16992 33.199 7.16992C26.8988 7.16992 26.2461 15.498 21.3903 15.498C17.6173 15.498 17.4937 24.4173 13.5384 27.5834Z'
                                    fill='url(#paint0_linear_78_9179)'
                                />
                                <path
                                    d='M1.16406 30.7467C1.16406 30.7467 9.27338 30.9994 13.5384 27.5854C17.4937 24.4192 17.6173 15.5 21.3903 15.5C26.2461 15.5 26.8988 7.17187 33.199 7.17188C38.0242 7.17188 37.8078 18.5 43.5183 18.5C48.4677 18.5 48.2164 20.8996 51.0132 23.0484C54.2948 25.5696 55.1865 29.7801 58.8651 30.7467C63.9781 32.0902 70.9998 23.0484 70.9998 23.0484'
                                    stroke='url(#paint1_linear_78_9179)'
                                    stroke-linecap='round'
                                />
                            </g>
                            <defs>
                                <linearGradient
                                    id='paint0_linear_78_9179'
                                    gradientUnits='userSpaceOnUse'
                                    x1='36.0233'
                                    x2='36.0233'
                                    y1='1.99414'
                                    y2='41.9941'
                                >
                                    <stop stop-color='#02C173' stop-opacity='0.3' />
                                    <stop offset='0.817708' stop-color='#02C173' stop-opacity='0' />
                                </linearGradient>
                                <linearGradient
                                    id='paint1_linear_78_9179'
                                    gradientUnits='userSpaceOnUse'
                                    x1='70.9998'
                                    x2='1.04678'
                                    y1='29.5'
                                    y2='29.5'
                                >
                                    <stop stop-color='#02C173' />
                                    <stop offset='1' stop-color='#02C173' stop-opacity='0' />
                                </linearGradient>
                                <clipPath id='clip0_78_9179'>
                                    <rect fill='white' height='40' width='72' />
                                </clipPath>
                            </defs>
                        </svg> -->

                        <!-- <svg
                            v-if="item?.rolling_upDownColor && item?.rolling_upDownColor == 'fallColor'"
                            fill='none'
                            height='40'
                            viewBox='0 0 72 40'
                            width='72'
                            xmlns='http://www.w3.org/2000/svg'
                        >
                            <g clip-path='url(#clip0_78_9191)'>
                                <path
                                    d='M13.5385 8C8.06237 10.5444 1.16406 14 1.16406 14V41.996H70.9998V21C69.5717 18.6315 67.4629 10.6038 63.1478 10C59.6119 9.50526 58.4797 15.9229 54.9391 15.5C50.0902 14.9208 51.5385 7.0515 46.7303 6C41.8932 4.94218 40.8485 11.5 36.0232 11.5C29.7231 11.5 29.4582 1 24.6023 1C20.8293 1 17.562 6.13049 13.5385 8Z'
                                    fill='url(#paint0_linear_78_9191)'
                                />
                                <path
                                    d='M1.16406 14C1.16406 14 8.06237 10.5444 13.5385 8C17.562 6.13049 20.8293 1 24.6023 1C29.4582 1 29.7231 11.5 36.0232 11.5C40.8485 11.5 41.8932 4.94218 46.7303 6C51.5385 7.0515 50.0902 14.9208 54.9391 15.5C58.4797 15.9229 59.6119 9.50526 63.1478 10C67.4629 10.6038 69.5717 18.6315 70.9998 21'
                                    stroke='url(#paint1_linear_78_9191)'
                                    stroke-linecap='round'
                                />
                            </g>
                            <defs>
                                <linearGradient
                                    id='paint0_linear_78_9191'
                                    gradientUnits='userSpaceOnUse'
                                    x1='36.0233'
                                    x2='36.0233'
                                    y1='1'
                                    y2='41.9961'
                                >
                                    <stop stop-color='#E11A38' stop-opacity='0.3' />
                                    <stop offset='0.692708' stop-color='#E11A38' stop-opacity='0' />
                                </linearGradient>
                                <linearGradient
                                    id='paint1_linear_78_9191'
                                    gradientUnits='userSpaceOnUse'
                                    x1='1.04678'
                                    x2='70.9998'
                                    y1='21.1775'
                                    y2='21.1775'
                                >
                                    <stop stop-color='#E11A38' stop-opacity='0' />
                                    <stop offset='1' stop-color='#E11A38' />
                                </linearGradient>
                                <clipPath id='clip0_78_9191'>
                                    <rect fill='white' height='40' width='72' />
                                </clipPath>
                            </defs>
                        </svg> -->
                    </div>
                </div>
                <div class='list-item-price'>
                    <span class='item-price-num'>
                        {{ item.rolling_last_price }}
                    </span>
                    <span :class="['item-up-down', item.rolling_upDownColor]">
                        {{ !item.rolling_upDownWidth && item.rolling_upDownWidth != 0 ? '- -' : item.rolling_upDownWidth }}
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { reactive, toRefs, } from 'vue'
import { useRouter } from 'vue-router'
import useSymbolIcon from '@/hooks/useSymbolIcon'

export default {
    props: {
        trades: {
            type: Array,
            default: () => [],
        },
        position: {
            type: String,
            default: 'top',
        },
    },
    setup (props) {
        const router = useRouter()

        const state = reactive({
            list: [],
            productList: [],
            productKeys: [],
        })

        const goToDetail = (item) => {
            const { symbolId, symbolName, tradeType } = item || {}
            if (!symbolId) return
            router.push(`/order?name=${symbolName || ''}&symbolId=${symbolId || ''}&tradeType=${tradeType}`)
        }

        // 生成h5页面对应的产品图标[]
        const setH5FormatIconHandle = (symbolKey, number) => {
            const { currencyList } = useSymbolIcon(symbolKey)

            return currencyList?.value ? currencyList.value[number] : ''
        }

        return {
            goToDetail,
            setH5FormatIconHandle,
            ...toRefs(state),
        }
    },
}
</script>

<style scoped lang="scss">
.btnGroup {
    display: flex;
    flex-wrap: wrap;
    gap:16px;
    .btnOutSide {
        .list-item {
            border-radius: 16px;
            border: 1px solid #ffebee;
            background: #fff;
            width: 220px;
            min-height: 102px;
            padding: 16px 10px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            cursor: pointer;
            .list-item-name {
                display: flex;
                align-items: center;
                .list-item-name-left {
                    & > img {
                        max-width: 24px;
                        max-height: 24px;
                        margin-right: 4px;
                    }
                    .token-swap-icon {
                      display: flex;
                        align-items: center;
                        img {
                            width: 24px;
                            height: 24px;
                            border: 1px solid #fff;
                            border-radius: 100%;
                            margin-bottom:10px;
                            &:last-child {
                                margin-left: -10px;
                            }
                        }

                    }
                    & > span {
                        color: var(--mainColor);
                        font-size: 14px;
                        font-weight: 700;
                        line-height: 24px;
                    }
                }
                .list-item-name-right {
                    display: none;
                }
            }
            .list-item-price {
                display: flex;
                justify-content: space-between;
                align-items: flex-end;
                .item-price-num {
                    color: var(--mainColor);
                    font-size: 20px;
                    font-weight: 700;
                }
                .item-up-down {
                    font-size: 16px;
                    font-weight: 700;
                    line-height: 24px;
                }
            }
        }
    }
}

@media screen and (max-width: 767px) {
    .btnGroup {
        max-width: 100vw;
        display: flex;
        flex-wrap: wrap;
        // justify-content:center;
        gap:10px;
        // flex-direction: column;
        // justify-content: center;
        // align-items: center;
        .btnOutSide {
            // margin: 5px;
            .list-item {
                border-radius: 8px;
                border: 1px solid #ffebee;
                border-radius: 4px;
                background: #f9f9fb;
                width: 42vw;
                // min-height: 120px;
                min-height: 100px;

                padding: 4px;
                margin-right: 0;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                cursor: pointer;
                .list-item-name {
                    display: flex;
                    align-items: center;
                    .list-item-name-left {
                        & > img {
                            max-width: 24px;
                            max-height: 24px;
                            margin-right: 4px;
                        }
                        .token-swap-icon {
                        display: flex;
                        align-items: center;
                        img {
                            width: 24px;
                            height: 24px;
                            border: 1px solid #fff;
                            border-radius: 100%;
                            margin-bottom:10px;
                            &:last-child {
                                margin-left: -10px;
                            }
                        }
                    }
                        & > span {
                          margin-top:6px;

                            color: var(--mainColor);
                            font-size: 14px;
                            font-weight: 700;
                            line-height: 16px;
                        }
                    }
                    .list-item-name-right {
                        display: inline-block;
                        & > img {
                            max-width: 72px;
                        }
                    }
                }
                .list-item-price {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                    .item-price-num {
                        color: var(--mainColor);
                        font-size: 20px;
                        font-weight: 700;
                    }
                    .item-up-down {
                        font-size: 16px;
                        font-weight: 700;
                        line-height: 24px;
                    }
                }
            }
        }
    }
}
</style>
