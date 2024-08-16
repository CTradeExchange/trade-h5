<template>
    <div class='valuable-guide'>
        <title-section
            :title='$t("signal.valuable.guide.new")'
        />
        <ul>
            <li @click='handleItem(0)'>
                <div class='title'>
                    {{ $t('signal.valuable.guide.q1') }}
                </div>
            </li>
            <li @click='handleItem(1)'>
                <div class='title'>
                    {{ $t('signal.valuable.guide.q2') }}
                </div>
            </li>
            <li @click='handleItem(2)'>
                <div class='title'>
                    {{ $t('signal.valuable.guide.q3') }}
                </div>
            </li>
        </ul>
        <drawer
            :position='isPC ? "center": "left"'
            :show='visible'
            :style='style'
            :title='$t("signal.valuable.guide.new")'
            @close='handleClose'
        >
            <div class='valuable-drawer'>
                <div v-if='question[selectQuestion].tab' class='section-tab'>
                    <div
                        v-for='(item, index) in question[selectQuestion].tab'
                        :key='index'
                        class='my-3 text-center section-tab-li'
                        :class='{ active: (index === tabIndex) }'
                        @click='handleJump(index)'
                    >
                        {{ item.title }}
                    </div>
                </div>
                <div v-if='question[selectQuestion].title' class='section-status'>
                    <div class='text-xl mb-3 text-center font-bold '>
                        {{ question[selectQuestion].title }}
                    </div>
                </div>
                <div class='content'>
                    <p>{{ question[selectQuestion].list[step].text }}</p>
                    <div class='img'>
                        <img :src='`/images/signal/valuable_guide/${question[selectQuestion].list[step].img}`' />
                    </div>
                </div>
                <div class='option'>
                    <van-button
                        v-for='(item, index) in question[selectQuestion].list[step].btn'
                        :key='index'
                        block
                        :type='item.type === "prev" ? "default" :"primary"'
                        @click='handleOption(item.type)'
                    >
                        <span> {{ item.text }}</span>
                    </van-button>
                </div>
            </div>
        </drawer>
    </div>
</template>

<script>
import { computed, reactive, toRefs, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import drawer from '@/plugins/signal/components/drawer.vue'
import titleSection from '@/plugins/signal/components/title-section'

export default {
    components: {
        drawer,
        titleSection
    },
    setup (props) {
        const { t } = useI18n()
        const isPC = window.isPC
        const state = reactive({
            visible: false, // 弹窗开关
            selectQuestion: -1, // 弹窗开关
            step: -1, // 步骤
            tabIndex: 0, // 选中的tab索引
            question: [
                {
                    tab: [
                        { title: t('signal.valuable.guide.q1_tab'), step: 0 },
                        { title: t('signal.valuable.guide.q1_tab2'), step: 2 }
                    ],
                    list: [
                        {
                            text: t('signal.valuable.guide.q1_tab_step'),
                            img: 'q1_tab_step.png',
                            btn: [
                                { type: 'next', text: t('signal.common.next') }
                            ]
                        },
                        {
                            text: t('signal.valuable.guide.q1_tab_step2'),
                            img: 'q1_tab_step2.png',
                            btn: [
                                { type: 'prev', text: t('signal.common.prev') },
                                { type: 'nextTab', text: t('signal.valuable.guide.next') }
                            ]
                        },
                        {
                            text: t('signal.valuable.guide.q1_tab2_step'),
                            img: 'q1_tab2_step.png',
                            btn: [
                                { type: 'next', text: t('signal.common.next') }
                            ]
                        },
                        {
                            text: t('signal.valuable.guide.q1_tab2_step2'),
                            img: 'q1_tab2_step2.png',
                            btn: [
                                { type: 'prev', text: t('signal.common.prev') },
                                { type: 'next', text: t('signal.common.next') }
                            ]
                        },
                        {
                            text: t('signal.valuable.guide.q1_tab2_step3'),
                            img: 'q1_tab2_step3.png',
                            btn: [
                                { type: 'prev', text: t('signal.common.prev') },
                                { type: 'succ', text: t('signal.common.complete') }
                            ]
                        }
                    ]
                },
                {
                    title: t('signal.valuable.guide.q2_tab'),
                    list: [
                        {
                            text: t('signal.valuable.guide.q2_tab_step'),
                            img: 'q2_tab_step.png',
                            btn: [
                                { type: 'next', text: t('signal.common.next') }
                            ]
                        },
                        {
                            text: t('signal.valuable.guide.q2_tab_step2'),
                            img: 'q2_tab_step2.png',
                            btn: [
                                { type: 'prev', text: t('signal.common.prev') },
                                { type: 'next', text: t('signal.common.next') }
                            ]
                        },
                        {
                            text: t('signal.valuable.guide.q2_tab_step3'),
                            img: 'q2_tab_step3.png',
                            btn: [
                                { type: 'prev', text: t('signal.common.prev') },
                                { type: 'succ', text: t('signal.common.complete') }
                            ]
                        }
                    ]
                },
                {
                    title: t('signal.valuable.guide.q3_tab'),
                    list: [
                        {
                            text: t('signal.valuable.guide.q3_tab_step'),
                            img: 'q3_tab_step.png',
                            btn: [
                                { type: 'next', text: t('signal.common.next') }
                            ]
                        },
                        {
                            text: t('signal.valuable.guide.q3_tab_step2'),
                            img: 'q3_tab_step2.png',
                            btn: [
                                { type: 'prev', text: t('signal.common.prev') },
                                { type: 'next', text: t('signal.common.next') }
                            ]
                        },
                        {
                            text: t('signal.valuable.guide.q3_tab_step3'),
                            img: 'q3_tab_step3.png',
                            btn: [
                                { type: 'prev', text: t('signal.common.prev') },
                                { type: 'succ', text: t('signal.common.complete') }
                            ]
                        }
                    ]
                }
            ],
            timer: null, // 定时器
        })

        // 清除定时器
        const clearTimer = () => {
            state.timer && clearInterval(state.timer)
            state.timer = null
        }

        // 轮询轮播图
        const startTimer = () => {
            state.timer = setInterval(() => {
                const currentQa = state.question[state.selectQuestion]
                if (state.step + 1 < currentQa.list.length) {
                    state.step += 1
                    if (currentQa.tab) {
                        const currentIndex = currentQa.tab.findLastIndex((item) => state.step >= item.step)
                        if (currentIndex >= 0) {
                            state.tabIndex = currentIndex
                        }
                    }
                } else {
                    clearTimer()
                }
            }, 3000)
        }

        // 点击事件
        const handleItem = (index) => {
            state.visible = true
            state.selectQuestion = index
            state.step = 0
            state.tabIndex = 0
            startTimer()
        }

        // 点击切换步骤
        const handleJump = (index) => {
            state.tabIndex = index
            state.step = state.question[state.selectQuestion].tab[index].step
            clearTimer()
        }

        // 关闭
        const handleClose = () => {
            state.visible = false
            clearTimer()
        }

        // 操作
        const handleOption = (type) => {
            clearTimer()
            if (type === 'prev') {
                // 上一步
                state.step -= 1
            } else if (type === 'nextTab') {
                // 下一段教学
                handleJump(state.tabIndex + 1)
            } else if (type === 'succ') {
                // 已完成
                handleClose()
            } else {
                // 下一步
                state.step += 1
            }
        }

        const style = computed(() => {
            return isPC ? {} : {
                width: '100%',
                height: '100%',
                borderRadius: 0,
            }
        })

        onBeforeUnmount(() => {
            clearTimer()
        })

        return {
            ...toRefs(state),
            isPC: window.isPC,
            handleJump,
            handleItem,
            handleOption,
            handleClose,
            style
        }
    }
}
</script>

<style lang="scss" scoped>
.valuable-guide {
    ul {
        height: 212px;
    }
    li {
        display: flex;
        align-items: center;
        min-height: 55px;
        padding: 0 12px;
        border-bottom: 1px solid var(--lineColor);
        font-size: 14px;
        cursor: pointer;
        .title {
            &:hover {
                color: var(--primary);
            }
        }
    }
}
.valuable-drawer {
    width: 500px;
    height: 560px;
    overflow: hidden;
    padding: 0 20px;
    display: flex;
    flex-direction: column;
    @media screen and (max-width: 768px) {
        width: 100%;
        padding: 0 20px;
        padding-bottom: 84px;
    }
    .section-tab {
        display: flex;
        align-items: center;
        justify-content: center;
        .section-tab-li {
            margin-left: 15px;
            color: var(--minorcolor);
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            &:first-child {
                margin-left: 0;
            }
            &.active {
                color: var(--primary);
            }
        }
    }
    .section-status {
        text-align: center;
        font-size: 18px;
        p {
            margin: 10px 0 15px;
        }
    }
    .content {
        flex: 1;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        p {
            font-size: 14px;
            color: var(--minorcolor);
            line-height: 24px;
            margin-bottom: 5px;
        }
        .img {
            overflow-y: auto;
            flex: 1;
        }
        img {
            max-width: 100%;
            margin: 20px 0 30px;
            display: block;
            border: 1px solid var(--lineColor);
            border-radius: 5px;
        }
    }
    .option {
        margin: 20px 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .van-button:not(:first-child) {
            margin-left: 15px;
        }
        :deep {
            .van-loading {
                margin-right: 3px;
            }
        }
    }
    @media screen and (max-width: 768px) {
        .option {
            position: fixed;
            bottom: 0;
            width: 100%;
            left: 0;
            padding: 20px;
            background: var(--contentColor);
            margin: 0;
        }
    }
}
</style>
