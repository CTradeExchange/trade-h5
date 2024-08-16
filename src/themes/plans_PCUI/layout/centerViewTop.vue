<template>
    <div id='topNav' class='topNav' :style='{ height:`${boxHeight}px`,boxShadow:boxShadowShow?`0px 0 4px rgba(0,0,0,0.1)`:0 }'>
        <div class='left'>
            <slot name='left'>
                <a class='backIcon' href='javascript:void(0);' @click='back'>
                    <i :class='iconName'></i>
                </a>
            </slot>
        </div>
        <div v-if='showMain' class='main'>
            <slot>
                {{ title?title:$t($route.meta.title) }}
            </slot>
        </div>
        <div class='right' @click='rightBackHandle'>
            <slot name='right'>
            </slot>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Top',
    // props: ['title', 'customBack', 'icon'],
    props: {
        title: {
            type: String,
            default: ''
        },
        customBack: {
            type: Boolean,
            default: false
        },
        icon: {
            type: String,
            default: ''
        },
        showMain: {
            type: Boolean,
            default: true
        },
        rightBack: {
            type: Boolean,
            default: false
        },
        // 高度
        boxHeight: {
            type: Number,
            default: 56
        },
        boxShadowShow: {
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
            return ['TradeIndex', 'PositionIndex', 'SelfSymbolIndex'].includes(this.$route.name)
        },
        iconName () {
            return this.icon || 'icon_icon_back1'
        }
    },
    mounted () {
        if (this.iframePage.indexOf(this.$route.name) >= 0) {
            this.historyLength = window.history.length
        }
    },
    methods: {
        back () {
            if (this.customBack || this.$route.name === 'Nest') {
                this.$emit('back')
            } else {
                const { path, query } = this.$route
                const matched = this.$route.matched || []
                const levelArr = matched.filter(i => !['/', path].includes(i.path)) || []
                const { path: pushPath } = levelArr[0] || {}
                if (this.iframePage.indexOf(this.$route.name) >= 0) {
                    this.$router.go(this.historyLength - window.history.length - 1)
                } else if (levelArr.length >= 1) {
                    this.$router.go(-1)
                } else if (pushPath) {
                    const arr = Object.keys(query || {}).map(i => `${i}=${query[i]}`)
                    this.$router.replace(`${pushPath}?${arr.join('&')}`)
                } else {
                    this.$router.replace('/')
                }
            }
        },
        rightBackHandle () {
            this.rightBack && this.back()
        }
    }
}
</script>

<style lang="scss" scoped>
@import '~@/sass/mixin.scss';
.topNav {
    display: flex;
    align-items: center;
    flex-shrink: 0;
    width: 100%;
    // height: 56px;
    color: var(--mainColor);
    font-size: 20px;
    background: var(--contentColor);
    position: relative;
    overflow: hidden;
    // box-shadow: 0px 0 4px rgba(0,0,0,0.1);
    &.mainColorBg {
        color: var(--contentColor);
    }
    &.nobg {
        background: none;
    }
    .left,
    .right {
        position: absolute;
        padding: 0 20px;
        cursor: pointer;
    }
    .left {
        left: 0;
        min-width: 20px;
    }
    .right {
        right: 0;
        i {
            font-size: 20px;
        }
    }
    .main {
        max-width: 60%;
        margin: 0 auto;
        color: var(--mainColor);
        text-align: center;
        font-size: 20px;
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
        color: var(--mainColor);
        font-size: 18px;
    }
}
</style>

<style lang="scss">
@import '~@/sass/mixin.scss';
.m-dropDownChangeAccount {
    display: inline-block;
    height: rem(48px);
    padding: rem(5px) rem(30px) rem(5px) rem(10px);
    background-color: #F9F9F9;
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
    // .van-popup--bottom {
    //     right: 60px;
    //     bottom: 60px;
    //     left: inherit;
    //     z-index: 100000 !important;
    //     width: 400px;
    // }
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
                font-size: rem(40px);
            }
        }
    }
}
</style>
