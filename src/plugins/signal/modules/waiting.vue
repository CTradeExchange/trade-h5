<template>
    <div class='waiting'>
        <div class='title'>
            {{ $t('signal.detail.waitwhat') }}
        </div>
        <div class='desc'>
            {{ $t('signal.detail.waitwhatDesc') }}
        </div>
        <div class='option'>
            <van-button
                type='primary'
                @click='handleSubscribe'
            >
                {{ $t('signal.subscribe.freeSubscribe') + ' >' }}
            </van-button>
        </div>
    </div>
</template>

<script>
import useSignal from '@/plugins/signal/hooks/signal'

export default {
    props: {
        signal: {
            type: Object,
            default: () => {}
        },
    },
    setup (props) {
        const { subscribeSignal } = useSignal()

        const handleSubscribe = () => {
            subscribeSignal({ type: 'quick', payload: props.signal })
        }
        return {
            handleSubscribe
        }
    }
}
</script>

<style lang="scss" scoped>
.waiting {
    border: 1px solid var(--lineColor);
    padding: 40px 20px;
    border-radius: 4px;
    text-align: center;
    .title {
        font-weight: bold;
        font-size: 24px;
        @media screen and (max-width: 700px) {
            font-size: 20px;
        }
    }
    .desc {
        margin: 20px 0;
        font-size: 18px;
        @media screen and (max-width: 700px) {
            font-size: 14px;
        }
    }
    .option {
        .van-button {
            min-width: 250px;
            &:hover {
                opacity: 0.8;
            }
        }
    }
}
</style>
