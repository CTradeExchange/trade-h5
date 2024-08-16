<template>
    <div class='signal-section'>
        <div class='title'>
            <h3>{{ title }}</h3>
            <div class='tips' @click='handleTips'>
                <svg fill='none' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
                    <path clip-rule='evenodd' d='M6.5 3H19v18H6.5v-2.5H4V16h2.5v-2.75H4v-2.5h2.5V8H4V5.5h2.5V3zm6.25 4.75c-.69 0-1.25.56-1.25 1.25v.5H9V9a3.75 3.75 0 116.402 2.652L14 13.053V14.5h-2.5v-2.482l2.134-2.134a1.25 1.25 0 00-.884-2.134zM11.5 19v-2.5H14V19h-2.5z' fill='currentColor' fill-rule='evenodd' />
                </svg>
                <span>{{ $t('signal.valuable.operationMode') }}</span>
            </div>
        </div>
        <div class='text'>
            <p>
                {{ desc }}
            </p>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        title: String, // 标题
        desc: String, // 描述
    },
    emits: ['handle-tips'], // 运作方式
    setup (props, { emit }) {
        const handleTips = () => {
            emit('handle-tips')
        }
        return {
            handleTips
        }
    }
}
</script>

<style lang="scss" scoped>
.signal-section {
    width: 100%;
    margin: 30px auto 0;
    .title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        h3 {
            font-weight: normal;
            color: var(--mainColor);
            font-size: 26px;
        }
        .tips {
            flex-shrink: 0;
            font-size: 14px;
            display: flex;
            align-items: center;
            margin-left: 8px;
            cursor: pointer;
            &:hover {
                color: var(--primary);
            }
            svg {
                width: 1em;
                height: 1em;
            }
        }
    }
    .text {
        margin-top: 12px;
        font-size: 16px;
    }
    @media screen and (max-width: 768px) {
        margin: 0 0 15px;
        .title {
            h3 {
                font-size: 22px;
            }
            .tips {
                font-size: 13px;
            }
        }
        .text {
            font-size: 14px;
        }
    }
}
</style>
