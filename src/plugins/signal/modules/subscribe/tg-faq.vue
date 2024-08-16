<template>
    <ul class='tg-faq'>
        <li>
            <h5>{{ $t('signal.subscribeFaq.q1') }}</h5>
            <p>{{ $t('signal.subscribeFaq.a1') }}</p>
            <img src='/images/signal/tg-subscribe.png?date=1231231231' />
        </li>
        <li>
            <h5>{{ $t('signal.subscribeFaq.q2') }}</h5>
            <p>{{ $t('signal.subscribeFaq.a2') }}</p>
        </li>
        <li>
            <h5>{{ $t('signal.subscribeFaq.q3') }}</h5>
            <p>{{ $t('signal.subscribeFaq.a3') }}</p>
        </li>
        <li>
            <van-button
                block
                class='btn-close'
                type='primary'
                @click='hanldeClose'
            >
                {{ $t('signal.common.close') }}
            </van-button>
        </li>
    </ul>
</template>

<script>
export default {
    emits: ['close'], // 关闭回调
    setup (props, { emit }) {
        const hanldeClose = () => {
            emit('close')
        }
        return {
            hanldeClose
        }
    }
}
</script>

<style lang="scss" scoped>
.tg-faq {
    li {
        margin-bottom: 10px;
        h5 {
            font-size: 14px;
            margin: 12px 0 10px;
        }
        p {
            font-size: 13px;
            color: var(--minorcolor);
            line-height: 24px;
            margin-bottom: 5px;
        }
        img {
            max-width: 100%;
            display: block;
            margin: 10px 0;
        }
        .btn-close {
            margin: 20px 0;
        }
    }
}
</style>
