<template>
    <div v-if='isLoadIndicator'>
        <div
            class='content'
            :class="isMore ? 'contentClosed': ''"
        >
            <MACD v-if="type === 'MACD'" />
            <RSI v-if="type === 'RSI'" />
            <KDJ v-if="type ==='KDJ'" />
            <MA v-if="type ==='MA'" />
            <VOL v-if="type ==='VOL'" />
            <CCI v-if="type ==='CCI'" />
        </div>
        <div class='read-more'>
            <a data-ga-signal='signal_detailPage_readMoreWd_cl' @click='handleMore'>
                <span>
                    {{ isMore ? $t('signal.common.readmore'): $t('signal.common.readless') }}
                </span>
                <van-icon
                    :name="isMore ? 'arrow-down': 'arrow-up'"
                    :size='16'
                />
            </a>
        </div>
    </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import MACD from './MACD/index'
import RSI from './RSI/index'
import KDJ from './KDJ/index'
import MA from './MA/index'
import VOL from './VOL/index'
import CCI from './CCI/index'

export default {
    components: {
        MACD,
        RSI,
        KDJ,
        MA,
        VOL,
        CCI
    },
    props: {
        type: String
    },
    setup (props) {
        const { locale } = useI18n({ useScope: 'global' })
        // 是否显示更多
        const isMore = ref(true)
        // 仅指定指标加载
        const isLoadIndicator = computed(() => {
            return ['MACD', 'RSI', 'KDJ', 'MA', 'VOL', 'CCI'].includes(props.type)
        })
        const handleMore = () => {
            isMore.value = !isMore.value
        }
        return {
            locale,
            isMore,
            handleMore,
            isLoadIndicator
        }
    }
}
</script>

<style lang="scss" scoped>
.content {
    height: unset;
    overflow: unset;
    text-overflow: unset;
    min-height: 20em;
}
.contentClosed {
    flex-grow: 1;
    height: 30em;
    overflow: hidden;
    text-overflow: ellipsis;
    position: relative;
    &::before {
        content: '';
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 8em;
        background: linear-gradient(180deg, rgba(255, 255, 255, 0), var(--contentColor));
    }
}
.read-more {
    margin: 20px 0 40px;
    @media screen and (max-width: 700px) {
        margin-bottom: 20px;
    }
    a {
        color: var(--primary);
        cursor: pointer;
    }
    .van-icon {
        margin-left: 6px;
    }
}
</style>
