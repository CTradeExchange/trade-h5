<template>
    <div class='page-wrap'>
        <div class='m-mine' data-v-1b9bb399=''>
            <div class='layout layout-1'>
                <div class='item-1'>
                    <div class='face'>
                        <img src='../../images/face.png' />
                    </div><div class='account'>
                        <div class='no'>
                            {{ customInfo.customerNo }} <i class='icon van-icon '></i>
                        </div><!---->
                    </div>
                </div>
            </div>
            <div class='asset' @click='fundVis=true'>
                <div class='m-myAsset'>
                    <div class='showMore'>
                        <div class='header-wrap'>
                            <span class='title'>
                                {{ $t('trade.accountOverview') }}({{ mainAccount.currency }})
                            </span><i class='icon van-icon van-icon-arrow'></i>
                        </div><div class='flex-content'>
                            <div class='item'>
                                <div class='sub'>
                                    {{ $t('trade.balance') }}
                                </div><div class='number'>
                                    {{ computePrice(accountInfo.balance) }}
                                </div>
                            </div><div class='item'>
                                <div class='sub'>
                                    {{ $t('trade.freeMargin') }}
                                </div><div class='number'>
                                    {{ computePrice(accountInfo.availableMargin) }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class='layout-3'>
                <van-cell
                    icon='location-o'
                    is-link
                    title='最新公告'
                    @click='toPage(item)'
                >
                    <template #icon>
                        <img class='icon_icon' src='https://img.yienecom.com/upload/%E5%B0%8F%E9%88%B4%E9%90%BA%2042x42.png' />
                    </template>
                </van-cell>
                <van-cell
                    icon='location-o'
                    is-link
                    title='在线客服'
                    @click='toPage(item)'
                >
                    <template #icon>
                        <img class='icon_icon' src='https://img.yienecom.com/upload/%E6%88%91%E7%9A%84_%E5%9C%A8%E7%BA%BF%E5%AE%A2%E6%9C%8D%2042x42.png' />
                    </template>
                </van-cell>
                <van-cell
                    icon='location-o'
                    is-link
                    title='消息中心'
                    to='/msg'
                    @click='toPage(item)'
                >
                    <template #icon>
                        <img class='icon_icon' src='https://img.yienecom.com/upload/%E6%88%91%E7%9A%84_%E6%B6%88%E6%81%AF%E4%B8%AD%E5%BF%83%2042X42.png' />
                    </template>
                </van-cell>
                <van-cell
                    icon='location-o'
                    is-link
                    title='设置'
                    to='/setting'
                    @click='toPage(item)'
                >
                    <template #icon>
                        <img class='icon_icon' src='https://img.yienecom.com/upload/%E6%88%91%E7%9A%84_%E8%AE%BE%E7%BD%AE%2042x42.png' />
                    </template>
                </van-cell>
            </div>
        </div>
    </div>
    <Fund v-if='fundVis' :show='fundVis' @update:show='updateShow' />
</template>

<script>
import { reactive, toRefs, onUpdated, computed } from 'vue'
import { getArrayObj, priceFormat, isEmpty } from '@/utils/util'
import Fund from '@c/components/fund'
import { useStore } from 'vuex'
export default {
    components: {
        Fund
    },
    setup (props) {
        const store = useStore()
        const state = reactive({ fundVis: false })
        const customInfo = computed(() => store.state._user.customerInfo)
        const mainAccount = getArrayObj(customInfo.value.accountList, 'accountId', customInfo.value.accountId)
        const accountInfo = computed(() => store.state._user.accountAssets)

        const updateShow = (val) => {
            state.fundVis = val
        }

        const computePrice = (price,) => {
            return price === '' ? '--' : price
        }

        return {
            ...toRefs(state),
            updateShow,
            customInfo,
            mainAccount,
            accountInfo,
            computePrice
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.page-wrap {
    height: 100%;
    .m-mine {
        height: 100%;
        padding-bottom: rem(90px);
        overflow: auto;
        background-color: var(--bgColor2);
        .asset {
            padding: 0 rem(30px) rem(30px) rem(30px);
            background-color: #FFF;
            .m-myAsset {
                width: 100%;
                .assetIcon {
                    right: 0;
                    bottom: 0;
                    height: 100%;
                    line-height: rem(90px);
                    .other {
                        position: relative;
                        top: rem(-5px);
                        display: inline-block;
                        margin-left: rem(10px);
                        font-size: rem(28px);
                        line-height: rem(50px);
                        i {
                            margin-left: rem(10px);
                            font-size: rem(24px);
                        }
                    }
                    &.adequate {
                        color: #11B873;
                    }
                    &.less {
                        color: #F39800;
                    }
                    &.stopout {
                        color: #E3525C;
                    }
                    i {
                        font-size: rem(45px);
                    }
                }
                .showMore {
                    box-sizing: border-box;
                    padding: rem(30px) rem(40px) rem(15px);
                    background-color: #F9F9F9;
                    .header-wrap {
                        display: flex;
                        flex-direction: row;
                        justify-content: space-between;
                        .title,
                        .icon {
                            line-height: rem(32px);
                        }
                        .title {
                            font-size: rem(30px);
                        }
                        .icon {
                            position: relative;
                            right: rem(-4px);
                        }
                    }
                    .flex-content {
                        position: relative;
                        display: flex;
                        align-content: center;
                        justify-content: space-between;
                        padding: rem(20px) 0 0;
                        border-radius: rem(5px);
                        .item {
                            flex: 1;
                            &:first-child {
                                text-align: left;
                            }
                            &:last-child {
                                text-align: right;
                            }
                        }
                        .sub {
                            color: #333;
                            font-size: rem(24px);
                            // margin-bottom: rem(10px);
                        }
                        .number {
                            color: #477FD3;
                            font-size: rem(46px);
                        }
                    }
                }
            }
        }
        .layout-1 {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: rem(30px) rem(30px) rem(20px) rem(30px);
            background-color: #FFF;
            .btn {
                display: inline-block;
                height: rem(46px);
                margin-right: rem(10px);
                padding: 0 rem(20px);
                line-height: rem(46px);
                background: #F9F9F9;
                border-radius: rem(24px);
            }
            &.guest {
                text-align: center;
            }
            .renzheng {
                i {
                    color: #B7B7B7;
                    font-size: rem(30px);
                }
                span {
                    position: relative;
                    top: rem(-7px);
                    left: (-3px);
                    display: inline-block;
                    height: rem(22px);
                    padding-right: rem(6px);
                    padding-left: rem(2px);
                    color: #FFF;
                    font-size: rem(14px);
                    line-height: rem(22px);
                    background-color: #B7B7B7;
                    border-radius: 0 rem(2px) rem(2px) 0;
                }
                &.status0 {
                    i {
                        color: #FE654C;
                    }
                    span {
                        background-color: #FE654C;
                    }
                }
                &.status1 {
                    i {
                        color: #10B873;
                    }
                    span {
                        background-color: #10B873;
                    }
                }
                &.status2 {
                    i {
                        color: #FEB04C;
                    }
                    span {
                        background-color: #FEB04C;
                    }
                }
                &.status3 {
                    i {
                        color: #FE654C;
                    }
                    span {
                        background-color: #FE654C;
                    }
                }
            }
            .face {
                display: inline-block;
                width: rem(110px);
                height: rem(110px);
                margin: 0 auto;
                overflow: hidden;
                border-radius: 50%;
                img {
                    width: 100%;
                    height: 100%;
                }
            }
            .account {
                display: inline-block;
                margin-left: rem(20px);
                color: #333;
                vertical-align: top;
                .no {
                    margin-top: rem(20px);
                    font-size: rem(34px);
                    .icon {
                        color: #C4C4C4;
                        font-size: rem(24px);
                    }
                }
            }
        }
        .layout-2 {
            display: flex;
            align-content: center;
            justify-content: space-between;
            margin-bottom: rem(20px);
            padding: rem(20px) 0 rem(25px) 0;
            text-align: center;
            background-color: #FFF;
            .row-1 {
                flex: 1;
                padding: 0 rem(15px);
                &:first-child {
                    padding-left: rem(30px);
                }
                &:last-child {
                    padding-right: rem(30px);
                }
            }
            .link {
                height: rem(80px);
                // margin-top: rem(20px);
                color: #FFF;
                font-size: rem(34px);
                line-height: rem(80px);
                border-radius: rem(80px);
            }
            a {
                display: inline-block;
                width: 50%;
                height: rem(80px);
                margin-right: rem(30px);
                color: #FFF;
                font-weight: 500;
                font-size: rem(34px);
                line-height: rem(80px);
                text-align: center;
                background-color: #477FD3;
                border-radius: rem(40px);
                &:nth-of-type(2) {
                    margin-right: 0;
                    color: #FFF;
                    background-color: #F39800;
                }
                .sub {
                    font-size: rem(20px);
                    line-height: 1.2;
                }
                &.haveSub {
                    line-height: 1.5;
                }
            }
            .link-1 {
                background-color: #F39800;
            }
            .link-2 {
                background-color: #477FD3;
            }
            .item-3 {
                display: flex;
                flex-direction: column;
                align-content: center;
                justify-content: space-between;
                width: 100%;
                .item {
                    display: flex;
                    flex: 1;
                    padding: 0 rem(30px);
                    padding: rem(20px) rem(30px) 0;
                    &.one {
                        a {
                            width: 100%;
                            margin-right: 0;
                        }
                    }
                }
            }
            .item-4 {
                display: flex;
                justify-content: space-between;
                width: 100%;
                .item {
                    width: 50%;
                    padding: 0 rem(30px);
                    a {
                        display: inline-block;
                        width: 100%;
                        text-align: center;
                    }
                }
            }
        }
        .layout-3 {
            margin-bottom: rem(20px);
            .settingIcon {
                color: #477FD3;
                font-size: rem(43px);
            }
            ::v-deep {
                .van-cell {
                    padding: rem(20px) rem(30px);
                    &::after {
                        left: 0;
                    }
                    &.borrow {
                        display: none;
                        &.visible {
                            display: flex;
                        }
                    }
                    .icon_icon {
                        width: rem(40px);
                        height: rem(40px);
                        color: #477FD3;
                        &::before {
                            display: none;
                            content: '';
                        }
                    }
                    .van-cell__title {
                        margin-left: rem(28px);
                        color: #333;
                        font-size: rem(28px);
                    }
                    .van-cell__value {
                        color: #999;
                        font-size: rem(24px);
                    }
                    .van-cell__right-icon {
                        margin-left: rem(20px);
                        color: #C4C4C4;
                        font-size: rem(16px);
                    }
                }
            }
            .flg {
                position: relative;
                top: rem(-3px);
                display: inline-block;
                width: rem(72px);
                height: rem(40px);
                overflow: hidden;
                color: #FFF;
                font-size: rem(24px);
                line-height: rem(40px);
                text-align: center;
                vertical-align: middle;
                background-color: #E95A5A;
                border-radius: rem(20px);
            }
        }
    }
}

</style>
