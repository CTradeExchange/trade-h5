<template>
    <div class='contractWrapper' :class='source'>
        <div ref='valuableRef' class='signal-valuable'>
            <div class='valuable-list-slide'>
                <h1 class='h1'>
                    {{ $t("signal.valuable.evaluate") }}
                </h1>
                <evaluate-widget :allow-touch-move='false' class='list' />
            </div>
            <div class='valuable-list-slide'>
                <h1 class='h1'>
                    {{ $t("signal.valuable.ranking") }}
                </h1>
                <ranking-widget :allow-touch-move='false' class='list' />
            </div>
        </div>
        <div class='options'>
            <van-button
                block
                :loading='downloading'
                loading-text='截图'
                type='primary'
                @click='download'
            >
                截图
            </van-button>
        </div>
    </div>
</template>

<script>
// 给市场用的排行榜页面
import { computed, ref, onMounted } from 'vue'
import evaluateWidget from '@/plugins/signal/modules/evaluate/widget.vue'
import rankingWidget from '@/plugins/signal/modules/ranking/widget.vue'
import useSignal from '@/plugins/signal/hooks/signal'
import html2canvas from 'html2canvas'

export default {
    components: {
        evaluateWidget,
        rankingWidget,
    },
    props: {
        source: {
            type: String,
            default: 'h5'
        }
    },
    setup (props) {
        // 信号配置

        const { getEvaluateParams, getRankingParams } = useSignal()

        const downloading = ref(false)
        const valuableRef = ref(null)

        onMounted(() => {
            getRankingParams({
                days: '7'
            })
            getEvaluateParams({
                pe: '1d'
            })
        })

        const download = () => {
            downloading.value = true
            setTimeout(() => {
                const myBox = valuableRef.value
                html2canvas(myBox, {
                    scale: 2,
                    useCORS: true,
                    scrollX: 0,
                    scrollY: 0,
                }).then(function (canvas) {
                    const imgUrl = canvas.toDataURL('image/png', 1)
                    const eleLink = document.createElement('a')
                    eleLink.href = imgUrl // 转换后的图片地址
                    eleLink.download = 'Headline'
                    // 触发点击
                    document.body.appendChild(eleLink)
                    eleLink.click()
                    // 然后移除
                    document.body.removeChild(eleLink)
                    downloading.value = false
                })
            }, 500)
        }

        return {
            valuableRef,
            download,
            downloading
        }
    }
}
</script>

<style lang="scss" scoped>
.contractWrapper {
    margin-top: 6px;
    &.pc {
        margin-top: var(--navHeight);
        .signal-valuable {
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-direction: row;
            margin: 0 auto;
            margin-top: 30px;
            width: 1200px;
            padding: 0 12px;
        }
        .valuable-list-slide {
            width: calc(50% - 15px);
            &:first-child {
                margin-left: 0;
                :deep {
                    .list {
                        position: relative;
                        &::after {
                            content: '';
                            width: 1px;
                            height: 212px;
                            position: absolute;
                            top: 0;
                            right: -15px;
                            background-color: var(--lineColor);
                        }
                    }
                }
            }
        }
    }
    &.h5 {
        :deep {
            .signal-item {
                .col {
                    .number {
                        svg {
                            width: 21px;
                            height: 21px;
                        }
                    }
                }
            }
        }
    }
}
.signal-valuable {
    padding: rem(5px) 0 rem(40px) 0;
    margin: 0 auto;
    background: var(--contentColor);
    width: 100%;
    .h1 {
        font-size: rem(48px);
        color: var(--primary);
        text-align: center;
        margin: rem(30px) 0;
    }
    :deep {
        .evaluate-tab,
        .title-section {
            display: none;
        }
    }
}
.options {
    margin: 40px auto;
    width: 60%;
    max-width: 320px;
}
.light {
    .signal-valuable {
        background-color: #FFF;
    }
}

</style>
