<template>
    <div id='topNav' class='page-head'>
        <div
            :class="['topNav', { topNavLine: bottomLine }]"
            :style='customStyle'
        >
            <div class='left'>
                <slot name='left'>
                    <a
                        v-if='back'
                        class='backIcon'
                        href='javascript:void(0);'
                        @click='handleBack'
                    >
                        <van-icon name='down' style='transform: rotate(90deg)' />
                    </a>
                </slot>
            </div>
            <div class='main'>
                <slot name='main'>
                    <span v-if='showTitle' class='title'>
                        {{ title || $t($route.meta.title) || "" }}
                    </span>
                </slot>
            </div>
            <div class='right'>
                <slot name='right'>
                    <a
                        v-if='rightAction'
                        class='rightClick'
                        href='javascript:;'
                        @click="$emit('rightClick')"
                    >
                        <span
                            v-if='rightAction && rightAction.title'
                            class='right-text'
                        >
                            {{ rightAction.title }}
                        </span>
                        <van-icon name='arrow' />
                    </a>
                </slot>
            </div>
        </div>
        <div v-if='showReal' class='real-height'></div>
    </div>
</template>

<script>

export default {
    name: 'Top',
    props: {
        title: {
            type: String
        },
        back: {
            type: [Boolean, Function],
            default: true
        },
        showTitle: {
            type: Boolean,
            default: true
        },
        customBack: {
            type: Boolean,
            default: false
        },
        customStyle: {
            type: Object
        },
        bottomLine: {
            type: Boolean,
            default: false
        },
        rightAction: {
            type: [Object, Boolean],
            default: false
        },
        showReal: {
            type: Boolean,
            default: true
        }
    },
    data () {
        return {
            iframePage: ['OpenAccount'],
            historyLength: -1
        }
    },
    computed: {
        isDropdownMenu () {
            return ['TradeIndex', 'PositionIndex', 'SelfSymbolIndex'].includes(
                this.$route.name
            )
        }
    },
    mounted () {
        if (this.iframePage.indexOf(this.$route.name) >= 0) {
            this.historyLength = window.history.length
        }
    },
    methods: {
        handleBack () {
            if (this.customBack || this.$route.name === 'Nest') {
                this.$emit('back')
            } else if (this.iframePage.indexOf(this.$route.name) >= 0) {
                this.$router.go(this.historyLength - window.history.length - 1)
            } else {
                this.$router.go(-1)
            }
        }
    }
}
</script>

<style lang="scss" scoped>
@import "~@/sass/mixin.scss";
.page-head {
    flex-shrink: 0;
    position: relative;
    width: 100%;
}
.real-height {
    height:55px;
}
.rightClick {
    display: flex;
    align-items: center;
    height: 100%;
    font-size: rem(20px);
    line-height: 1.2;
    & > i {
        font-size: rem(24px) !important;
    }
}
.right-text {
    flex: 1;
    vertical-align: middle;
    word-break: break-all;
}
.topNavColor {
    background: var(--primary) !important;
    color: var(--contentColor) !important;
    .backIcon {
        color: var(--contentColor) !important;
    }
    .main {
        color: var(--contentColor) !important;
    }
}
.topNavLine {
    box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.1);
}
.topNav {
    position: fixed;
    left: 0;
    top: 0;
    display: flex;
    align-items: center;
    width: 100%;
    height: rem(110px);
    color: var(--mainColor);
    background: var(--contentColor);
    z-index: 99;
    justify-content: space-between;
    &.mainColorBg {
        color: var(--contentColor);
    }
    &.nobg {
        background: none;
    }
    .left,
    .right {
        max-width: 25%;
        position: absolute;
        height: 100%;
        cursor: pointer;
        display: flex;
        align-items: center;
    }
    .left {
        left: 0;
        padding: 0 rem(10px) 0 rem(24px);
    }
    .right {
        right: 0;
        padding: 0 rem(24px) 0 rem(10px);
        i {
            font-size: rem(24px);
        }
    }
    .main {
        max-width: 50%;
        margin: 0 auto;
        text-align: center;
        color: var(--color);
        display: flex;
        justify-content: center;
        .title {
            text-transform: capitalize;
            line-height: 1.2;
            color: var(--mainColor);
            font-family: 'Roboto';
            font-size: 18px;
            font-weight: 700;
        }
    }
    a {
        color: inherit;
        &:active {
            box-shadow: 0 0 999px rgba(0, 0, 0, 0.05) inset;
            opacity: 0.7;
        }
    }
    .backIcon {
        margin-left: rem(-10px);
        padding: rem(10px);
        font-size: rem(30px);
        color: var(--color);
    }
}
</style>

<style lang="scss">
@import "~@/sass/mixin.scss";
.m-dropDownChangeAccount {
    display: inline-block;
    height: rem(48px);
    padding: rem(5px) rem(30px) rem(5px) rem(10px);
    background-color: #f9f9f9;
    border-radius: rem(24px);
    .van-dropdown-menu__item {
        height: 100%;
    }
    .van-dropdown-menu__title {
        color: #333;
        font-size: rem(24px);
        line-height: rem(24px);
        &::after {
            right: -2px;
            border-width: rem(4px);
        }
    }
    &::after {
        border: none;
    }
}

@media screen and (min-width: 750px) {
    .topNav {
        //position: relative !important;
    }
    .van-popup--bottom {
        right: 60px;
        bottom: 60px;
        left: inherit;
        z-index: 100000 !important;
        width: 400px;
    }
    .dialog-header {
        position: relative;
        padding: rem(43px) 0 rem(45px) 0;
        color: #333;
        font-size: rem(34px);
        .title {
            text-align: center;
        }
        .right {
            position: absolute;
            right: 0;
            bottom: 0;
            height: 100%;
            padding: rem(45px) rem(30px);
            i {
                font-size: rem(28px);
            }
        }
    }
}
</style>
