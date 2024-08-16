<template>
    <div class='faq-module'>
        <div class='faq-module-warp'>
            <h2 v-if='showTitle' class='title'>
                <span class='text'>
                    {{ $t('signal.help.qa') }}
                </span>
            </h2>
            <van-collapse v-model='activeName' accordion :border='false'>
                <van-collapse-item v-for='(item, index) in list' :key='index' :name='index'>
                    <template #title>
                        {{ item.title }}
                    </template>
                    <div class='desc'>
                        <template v-if='Array.isArray(item.desc)'>
                            <p v-for='(sitem, si) in item.desc' :key='si'>
                                {{ sitem }}
                            </p>
                        </template>
                        <template v-else>
                            <span>{{ item.desc }}</span>
                            <span v-if='item.link'>
                                <a :href='item.link' target='_blank'>
                                    {{ item.linkText }}
                                </a>
                            </span>
                        </template>
                    </div>
                </van-collapse-item>
            </van-collapse>
        </div>
    </div>
</template>

<script>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import useSignal from '@/plugins/signal/hooks/signal'

export default {
    props: {
        showTitle: {
            type: Boolean,
            default: true
        }
    },
    setup () {
        const { t } = useI18n({ useScope: 'global' })
        const activeName = ref(0)
        const { getAcademyIndicatorUrl } = useSignal()

        const indicatorUrl = getAcademyIndicatorUrl()

        const list = ref([
            {
                title: t('signal.faq.faq1'),
                desc: t('signal.faq.faq1Desc')
            },
            {
                title: t('signal.faq.faq2'),
                desc: t('signal.faq.faq2Desc'),
                link: indicatorUrl,
                linkText: t('signal.faq.faq2Link'),
            },
            {
                title: t('signal.faq.faq3'),
                desc: t('signal.faq.faq3Desc'),
                link: indicatorUrl,
                linkText: t('signal.faq.faq3Link'),
            },
            {
                title: t('signal.faq.faq4'),
                desc: t('signal.faq.faq4Desc')
            },
            {
                title: t('signal.faq.faq5'),
                desc: [
                    t('signal.faq.faq5Desc'),
                    t('signal.faq.faq5Desc2'),
                    t('signal.faq.faq5Desc3'),
                    t('signal.faq.faq5Desc4'),
                ]
            },
        ])
        return {
            activeName,
            list
        }
    }
}
</script>

<style lang="scss" scoped>
.faq-module {
    color: var(--color);
    margin: 6px 0 8px;
    border-radius: 8px;
    padding: 0 rem(32px) 0 rem(32px);
    background: #FFF;
    .title {
        font-size: rem(48px);
        padding-top: rem(80px);
        padding-bottom: rem(20px);
        margin-bottom: rem(30px);
        text-align: center;
        font-weight: 600;
        border-bottom: rem(4px) solid var(--lineColor);
    }
    .desc {
        color: var(--normalColor);
        font-size: rem(28px);
        font-weight: 400;
        line-height: rem(45px);
        a {
            color: var(--color);
            margin: 0 10px;
            position: relative;
            text-decoration: underline;
            text-underline-offset: 0.4em;
        }
        p {
            margin-bottom: 12px;
            &:last-child {
                margin-bottom: 0;
            }
        }
    }
    :deep {
        .van-collapse-item {
            border: 1px solid var(--lineColor);
            border-radius: rem(32px);
            overflow: hidden;
            margin-bottom: rem(30px);
            &:last-child {
                margin-bottom: rem(30px);
            }
            &.van-collapse-item--border::after {
                content: none;
            }
            .van-cell {
                line-height: rem(38px);
                height: rem(144px);
                display: flex;
                align-items: center;
                padding: 0 rem(48px);
                background: none;
                &::after {
                    display: none;
                }
                .van-cell__title {
                    position: relative;
                    &::before {
                        content: '';
                        background: url(/images/signal/faq.png) no-repeat top center;
                        background-size: cover;
                        min-width: rem(28px);
                        height: rem(32px);
                        margin-right: rem(32px);
                    }
                }
            }
            .van-cell__title {
                color: var(--color);
                font-size: rem(30px);
                font-weight: 600;
                display: flex;
                align-items: center;
            }
            .van-icon-arrow {
                font-size: rem(48px);
            }
            .van-collapse-item__content {
                background: none;
                padding: 0 rem(30px) rem(50px);
            }
            .guilde-item {
                margin-bottom: 0;
            }
        }
    }
}
body.night {
    .faq-module {
        background: var(--bgColor);
        :deep {
            .van-collapse-item {
                &:hover {
                    border-color: #FFF;
                }
                .van-cell {
                    .van-cell__title {
                        &::before {
                            filter: invert(1);
                        }
                    }
                }
            }
        }
    }
}

@media (min-width: 768px) {
    .faq-module {
        max-width: 1400px;
        padding-bottom: 30px;
        margin: 0 auto 30px;
        .faq-module-warp {
            width: 886px;
            margin: 0 auto;
            padding: 0 32px;
        }
        .title {
            text-align: center;
            color: var(--color);
            font-size: 32px;
            line-height: 38px;
            font-weight: 600;
            margin: 30px 0;
            .text {
                position: relative;
                display: inline-block;
                padding-bottom: 12px;
            }
        }
        .desc {
            color: var(--color);
            font-size: 16px;
            line-height: 30px;
            padding: 0 24px;
            a {
                &:hover {
                    color: var(--primary);
                    &::after {
                        background: var(--primary);
                    }
                }
            }
        }
        :deep {
            .van-collapse-item {
                margin-bottom: rem(40px);
                &:last-child {
                    margin-bottom: rem(40px);
                }
                &:hover {
                    border-color: var(--lineColor);
                }
                .van-cell {
                    line-height: rem(38px);
                    height: rem(144px);
                    .van-cell__title {
                        color: var(--color);
                        font-size: 20px;
                        line-height: 38px;
                        font-weight: 600;
                    }
                }
                .van-collapse-item__content {
                    padding-left: rem(60px);
                    padding-right: rem(60px);
                }
            }
        }
    }
}
</style>
