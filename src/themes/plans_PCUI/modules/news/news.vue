<template>
    <div class='flow-module auto-width'>
        <div class='flow-left'>
            <div class='tabs'>
                <span :class="{ 'active': currentFlow === 1 }" @click='switchFlow(1)'>
                    {{ $t('information.focusNews') }}
                </span>
                <span :class="{ 'active': currentFlow === 2 }" @click='switchFlow(2)'>
                    {{ $t('information.newsFlash') }}
                </span>
            </div>
            <!-- 新闻 -->
            <div v-show='currentFlow === 1'>
                <newsList />
            </div>
            <!-- 7x24 -->
            <div v-show='currentFlow === 2'>
                <seven />
            </div>
        </div>
        <div class='flow-right'>
            <h3 class='title'>
                {{ $t('information.calendar') }}
            </h3>
            <!-- 财经日历 -->
            <calendar />
        </div>
    </div>
</template>

<script>
// components
import newsList from './newsList.vue'
import calendar from './calendar.vue'
import { reactive, toRefs } from 'vue'

export default {
    components: {
        newsList,
        calendar,
    },
    props: {
        data: {
            type: Object,
            default: function () {
                return {
                    href: '',
                    src: '',
                    target: '',
                }
            }
        },
        moduleId: {
            type: String,
            default: ''
        },
    },
    setup (props) {
        const state = reactive({
            // 当前信息流选项卡
            currentFlow: 1,
        })

        // 切换信息流
        const switchFlow = (num) => {
            state.currentFlow = num
        }

        return {
            ...toRefs(state),
            switchFlow,
        }
    }
}
</script>

<style lang="scss" scoped>
@import '~@/sass/mixin.scss';

// 信息流模块
.flow-module {
    display: flex;
    margin-top: 90px;
    .flow-left {
        flex: 1;
    }
    .flow-right {
        flex: 1;
        padding-left: 30px;
    }
    .title {
        margin-bottom: 38px;
        font-size: 32px;
        font-weight: bold;
        color: var(--color);
    }
    .case {
        height: 600px;
    }
    .tabs {
        margin-bottom: 38px;
        span {
            margin-right: 45px;
            font-size: 32px;
            font-weight: bold;
            color: var(--minorColor);
            cursor: pointer;
            &:last-of-type {
                margin-right: 0;
            }
            &:hover {
                color: var(--color);
            }
        }
        .active {
            color: var(--color);
            border-bottom: 3px solid var(--primary);
        }
    }
}
</style>
