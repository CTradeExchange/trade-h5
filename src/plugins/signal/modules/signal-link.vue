<template>
    <div class='guide'>
        <a v-if='showTeach' class='guide-item' :href='teachUrl' target='_blank'>
            <i class='icon icon_teach'></i>
            <div class='content'>
                <div class='title'>
                    {{ $t('signal.teachGuide.title') }}
                </div>
                <div class='desc'>
                    {{ $t('signal.teachGuide.desc') }}
                </div>
            </div>
            <van-icon name='arrow' />
        </a>
        <div
            v-if='showMoreSignal'
            class='guide-item'
            @click='handleMoreSignal'
        >
            <van-icon class='icon' name='expand-o' />
            <div class='content'>
                <div class='title'>
                    {{ $t('signal.detail.moreSignal', [moreSignal]) }}
                </div>
                <div class='desc'>
                    {{ $t('signal.teachGuide.findMoreSignal') }}
                </div>
            </div>
            <van-icon name='arrow' />
        </div>
        <!-- <div class='guide-item' @click='handleServiceBot'>
            <i class='icon icon_telegram_outline'></i>
            <div class='content'>
                <div class='title'>
                    {{ $t("signal.serviceBot.title") }}
                </div>
                <div class='desc'>
                    {{ $t("signal.serviceBot.tips") }}
                </div>
            </div>
            <van-icon name='arrow' />
        </div> -->
    </div>
</template>

<script>
import useSignal from '@/plugins/signal/hooks/signal'
import { openTgServiceBot } from '@/utils/util'

export default {
    props: {
        // 是否展示教学
        showTeach: {
            type: Boolean,
            default: true
        },
        // 是否展示信号
        showMoreSignal: {
            type: Boolean,
            default: false
        },
        moreSignal: String, // 信号指标值
        gaMoreSignal: String, // 更多信号埋点
        gaServiceBot: String, // 服务Bot埋点
    },
    setup (props, { emit }) {
        const { getAcademyIndicatorUrl, getTelegramChannel, jumpSignalTab } = useSignal()
        // 更多信号事件
        const handleMoreSignal = () => {
            jumpSignalTab('indicator', {
                i: props.moreSignal
            })
        }
        // 服务bot
        const handleServiceBot = () => {
            openTgServiceBot()
        }
        return {
            teachUrl: getAcademyIndicatorUrl(), // 教学地址
            channelUrl: getTelegramChannel(), // tg频道地址
            handleServiceBot,
            handleMoreSignal
        }
    }
}
</script>

<style lang="scss" scoped>
.guide {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-direction: column;
    padding: 0 12px;
    align-items: stretch;
    &:nth-child(1) {
        margin-bottom: 15px;
    }
    .guide-item {
        display: flex;
        align-items: center;
        width: 100%;
        flex: 0.5;
        margin: 0 auto;
        border: 1px solid var(--lineColor);
        padding: 14px 10px;
        border-radius: 4px;
        cursor: pointer;
        color: var(--color);
        &:hover {
            border-color: var(--placeholdColor);
        }
        &:nth-child(1) {
            margin-bottom: 15px;
        }
        .icon {
            font-size: 24px;
            margin-right: 6px;
        }
        .icon_telegram_outline {
            margin-right: 6px;
            font-size: 24px;
        }
        .content {
            flex: 1;
            margin-left: 10px;
            .title {
                font-size: 14px;
                margin-bottom: 8px;
            }
            .desc {
                font-size: 12px;
                color: var(--minorColor);
            }
        }
        .van-icon-arrow {
            display: none;
        }
    }
}
:deep {
    .tg-subscribe-link {
        width: 100%;
    }
}

@media (min-width: 768px) {
    .guide {
        padding-bottom: 20px;
        flex-direction: row;
        &:nth-child(1) {
            margin-bottom: 0;
        }
        .guide-item {
            align-items: center;
            padding: 20px 30px;
            border-radius: 8px;
            &:nth-child(2) {
                margin-left: 35px;
            }
            &:nth-child(1) {
                margin-bottom: 0;
            }
            .icon {
                font-size: 40px;
            }
            .content {
                margin: 0 20px;
                .title {
                    font-size: 16px;
                    margin-bottom: 8px;
                }
                .desc {
                    font-size: 14px;
                }
            }
            .van-icon-arrow {
                display: block;
            }
        }
    }
}

</style>
