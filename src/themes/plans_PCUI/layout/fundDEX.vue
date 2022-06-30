<template>
    <div class='wrap'>
        <div class='limit-width'>
            <div class='module-body'>
                <div class='side-menu'>
                    <div
                        :class="['handle-item href', { 'active': route.name === 'Dashboard' }]"
                        @click="switchRouter('/dashboard')"
                    >
                        <span class='name'>
                            <van-icon name='paid' /> Dashboard
                        </span>
                    </div>
                    <div class='menu-list'>
                        <div :class="['handle-item']">
                            <span class='name'>
                                <svg
                                    class='svg-icon-1'
                                    fill='currentColor'
                                    stroke='currentColor'
                                    stroke-width='0'
                                    viewBox='0 0 24 24'
                                    xmlns='http://www.w3.org/2000/svg'
                                >
                                    <g><path d='M0 0H24V24H0z' fill='none' /><path d='M5 3v16h16v2H3V3h2zm14.94 2.94l2.12 2.12L16 14.122l-3-3-3.94 3.94-2.12-2.122L13 6.88l3 3 3.94-3.94z' /></g>
                                </svg>
                                Funds
                            </span>
                            <i class='el-icon-caret-bottom'></i>
                        </div>
                        <ul class='children-list'>
                            <li
                                :class="['children-item', { 'active': route.name === 'Earning' }]"
                                @click="switchRouter('/earning')"
                            >
                                <svg
                                    class='svg-icon-2'
                                    fill='currentColor'
                                    stroke='currentColor'
                                    stroke-width='0'
                                    viewBox='0 0 576 512'
                                    xmlns='http://www.w3.org/2000/svg'
                                >
                                    <path d='M560 224h-29.5c-8.8-20-21.6-37.7-37.4-52.5L512 96h-32c-29.4 0-55.4 13.5-73 34.3-7.6-1.1-15.1-2.3-23-2.3H256c-77.4 0-141.9 55-156.8 128H56c-14.8 0-26.5-13.5-23.5-28.8C34.7 215.8 45.4 208 57 208h1c3.3 0 6-2.7 6-6v-20c0-3.3-2.7-6-6-6-28.5 0-53.9 20.4-57.5 48.6C-3.9 258.8 22.7 288 56 288h40c0 52.2 25.4 98.1 64 127.3V496c0 8.8 7.2 16 16 16h64c8.8 0 16-7.2 16-16v-48h128v48c0 8.8 7.2 16 16 16h64c8.8 0 16-7.2 16-16v-80.7c11.8-8.9 22.3-19.4 31.3-31.3H560c8.8 0 16-7.2 16-16V240c0-8.8-7.2-16-16-16zm-128 64c-8.8 0-16-7.2-16-16s7.2-16 16-16 16 7.2 16 16-7.2 16-16 16zM256 96h128c5.4 0 10.7.4 15.9.8 0-.3.1-.5.1-.8 0-53-43-96-96-96s-96 43-96 96c0 2.1.5 4.1.6 6.2 15.2-3.9 31-6.2 47.4-6.2z' />
                                </svg>
                                Earning
                            </li>
                            <li
                                :class="['children-item', { 'active': route.name === 'IndexFunds' }]"
                                @click="switchRouter('/indexFunds')"
                            >
                                <svg
                                    class='svg-icon-2'
                                    fill='currentColor'
                                    stroke='currentColor'
                                    stroke-width='0'
                                    viewBox='0 0 1024 1024'
                                    xmlns='http://www.w3.org/2000/svg'
                                    xmlns:xlink='http://www.w3.org/1999/xlink'
                                >
                                    <path d='M515 376.29c-74.61 0-135.31 60.69-135.31 135.3S440.43 646.9 515 646.9s135.31-60.7 135.31-135.31-60.66-135.3-135.31-135.3z m0 221.16a85.86 85.86 0 1 1 0-171.71 85.86 85.86 0 1 1 0 171.71z' p-id='6121' /><path d='M926.42 482.63h-66.85V203.78a36.76 36.76 0 0 0-36.72-36.72H534.36V108h-51.73v59.07h-275.4a36.77 36.77 0 0 0-36.73 36.72v286.27H98v51.72h72.5V819.4a36.78 36.78 0 0 0 36.73 36.73h282.83v70.29h51.72v-70.29h281.07a36.77 36.77 0 0 0 36.72-36.73v-285h66.85z m-116.3 324H541.78v-40.21h-51.72v40.26H220v-264.9h38v-51.72h-38V216.51h262.63V268h51.73v-51.49h275.76v266.12h-43.7v51.73h43.7z' p-id='6122' />
                                </svg>
                                Index Funds
                            </li>
                        </ul>
                    </div>
                </div>
                <div class='main-content'>
                    <div class='lead'>
                        <div class='lead-left'>
                            <ul v-if='crumbsList.length > 0'>
                                <li v-for='(item, index) in crumbsList' :key='index' class='row'>
                                    <span :class="['path', { 'active': item === curentCrumbs }]" @click='switchCrumbs(item)'>
                                        {{ item }}
                                    </span>
                                    <span v-if='crumbsList.length - 1 !== index' class='split'>
                                        /
                                    </span>
                                </li>
                            </ul>
                        </div>
                        <div class='lead-right'>
                            <el-tooltip
                                class='box-item'
                                content='The app is running in testnet mode.'
                                effect='dark'
                                placement='top'
                            >
                                <div v-show='_web3 && _web3?.testnetMode' class='test-tag'>
                                    TESTNET
                                    <i class='el-icon-info'></i>
                                </div>
                            </el-tooltip>

                            <!-- 已连接钱包 -->
                            <div v-show='_web3?.userAddress' class='handle-wallet'>
                                <div class='wallet-row' @click.stop='toggleWalletMenus'>
                                    <img class='icon' :src='generateIcon(_web3?.userAddress)' />
                                    <span class='address'>
                                        {{ hideWalletMiddleInfo(_web3?.userAddress) }}
                                    </span>
                                    <van-icon class='arrow' :name="showWalletMenus ? 'arrow-up' : 'arrow-down'" />
                                </div>

                                <div :class="['wallet-menus', showWalletMenus ? 'show' : 'hide']" @click.stop>
                                    <div class='account'>
                                        <img class='icon' :src='generateIcon(_web3?.userAddress)' />
                                        <span class='address'>
                                            {{ hideWalletMiddleInfo(_web3?.userAddress) }}
                                        </span>
                                    </div>
                                    <div class='network'>
                                        <label>Network</label>
                                        <div class='name'>
                                            <em></em>
                                            <span>{{ networkConfigs[_web3?.chainId]?.name }}</span>
                                        </div>
                                    </div>
                                    <ul class='options'>
                                        <li class='copy-btn' :data-clipboard-text='_web3?.userAddress' @click='copyAddress($event)'>
                                            <svg
                                                fill='none'
                                                stroke='currentColor'
                                                stroke-width='2'
                                                viewBox='0 0 24 24'
                                                xmlns='http://www.w3.org/2000/svg'
                                            >
                                                <path d='M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z' stroke-linecap='round' stroke-linejoin='round' />
                                            </svg>
                                            <span>Copy address</span>
                                        </li>
                                        <li @click='toAddressQuery'>
                                            <svg
                                                fill='currentColor'
                                                viewBox='0 0 20 20'
                                                xmlns='http://www.w3.org/2000/svg'
                                            >
                                                <path d='M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z' /><path d='M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z' />
                                            </svg>
                                            <span>View on Explorer</span>
                                        </li>
                                        <li @click='disconnect'>
                                            <svg
                                                fill='none'
                                                stroke='currentColor'
                                                stroke-width='2'
                                                viewBox='0 0 24 24'
                                                xmlns='http://www.w3.org/2000/svg'
                                            >
                                                <path d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1' stroke-linecap='round' stroke-linejoin='round' />
                                            </svg>
                                            <span>Disconnect Wallet</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <!-- 未连接钱包 -->
                            <div v-show='!_web3?.userAddress' class='connect-wallet'>
                                <button @click='executeConnect'>
                                    Connect wallet
                                </button>
                            </div>
                            <div class='setting-module'>
                                <div class='setting-control' @click.stop='toggleSettingMenus'>
                                    <van-icon class='icon' name='setting' />
                                </div>
                                <div :class="['setting-menus', showSettingMenus ? 'show' : 'hide']">
                                    <div class='testnet-mode'>
                                        <label>Testnet mode</label>
                                        <span>{{ isTestMode ? 'ON' : 'OFF' }}</span>
                                        <van-switch
                                            v-model='isTestMode'
                                            :active-color='style.primary'
                                            :inactive-color='style.lineColor'
                                            size='16px'
                                            @change='toggleTestMode'
                                            @click.stop
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <router-view />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, ref, onMounted, watch, onBeforeUnmount } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { hideWalletMiddleInfo, localSet, localGet } from '@/utils/util'
import Clipboard from 'clipboard'
import { Toast } from 'vant'
import { useI18n } from 'vue-i18n'
import networkConfigs from '@/plugins/web3/config/networkConfigs'
import { web3Hooks } from '@/plugins/web3/index'
import makeBlockie from 'ethereum-blockies-base64'

const {
    executeConnect,
    disconnect
} = web3Hooks()
const { t } = useI18n({ useScope: 'global' })

const store = useStore()
const route = useRoute()
const router = useRouter()
const style = computed(() => store.state.style)
// web3连接信息
const _web3 = computed(() => store.state._web3)

// 按钮背景色
const btnbg = style.value.primary + '1A'
// 面包屑导航
const crumbsList = ref([])
// 当前选择的面包屑导航
const curentCrumbs = ref('')
// 是否显示钱包下拉菜单
const showWalletMenus = ref(false)
// 是否显示设置下拉菜单
const showSettingMenus = ref(false)
// 是否开启测试模式
const isTestMode = ref(JSON.parse(localGet('isTestMode')) || false)

// 切换路由
const switchRouter = (value) => {
    if (value === route.path) return
    router.replace({ path: value })
}
// 设置面包屑导航
const setCrumbsList = () => {
    const arr = route?.name.split('-') || []
    if (arr.length > 0) {
        crumbsList.value = arr
        curentCrumbs.value = arr[arr.length - 1]
    }
}
// 切换面包屑导航
const switchCrumbs = (name) => {
    if (curentCrumbs.value === name) return
    router.replace({ name })
}
// 控制钱包下拉菜单
const toggleWalletMenus = () => {
    showWalletMenus.value = !showWalletMenus.value
    showSettingMenus.value = false
}
// 控制设置下拉菜单
const toggleSettingMenus = () => {
    showWalletMenus.value = false
    showSettingMenus.value = !showSettingMenus.value
}
// 控制测试模式
const toggleTestMode = (val) => {
    isTestMode.value = val
    store.commit('_web3/Update_testnetMode', val)
    localSet('isTestMode', isTestMode.value)
    closeMenus()
}
// 关闭下拉菜单
const closeMenus = () => {
    showWalletMenus.value = false
    showSettingMenus.value = false
}
// 复制钱包地址
const copyAddress = ($event) => {
    var clipboard = new Clipboard('.copy-btn')
    clipboard.on('success', e => {
        Toast(t('common.copySuccess'))
        // 释放内存
        clipboard.destroy()
    })
    clipboard.on('error', e => {
        // 释放内存
        clipboard.destroy()
    })
    clipboard.onClick($event)
    closeMenus()
}
// 跳转到钱包地址查询页面
const toAddressQuery = () => {
    const explorerLink = networkConfigs[_web3.value.chainId]?.explorerLink + '/address/' + _web3.value.userAddress
    window.open(explorerLink)
    closeMenus()
}

const generateIcon = (address) => {
    if (address) { return makeBlockie(address) }
}

// 监听路由变化
watch(() => route.path, () => {
    setCrumbsList()
})

onMounted(async () => {
    // 监听页面点击事件
    document.body.addEventListener('click', closeMenus, false)
    // 设置面包屑导航
    setCrumbsList()
    if (localGet('walletProvider')) {
        executeConnect()
    }
    // await executeConnect()
})
onBeforeUnmount(() => {
    // 销毁页面监听事件
    document.body.removeEventListener('click', closeMenus, false)
})
</script>

<style lang="scss" scoped>
.wrap {
    min-height: calc(100vh - 162px);
    padding: 20px 20px 150px;
}
.limit-width {
    max-width: 1200px;
    margin: 0 auto;
}
.module-body {
    display: flex;
    min-height: 800px;
}
.main-content {
    flex: 1;
    overflow: hidden;
}
.side-menu {
    width: 200px;
    margin-right: 10px;
    padding-top: 20px;
    padding-left: 10px;
    .van-icon {
        display: inline-block;
        margin-right: 5px;
        font-size: 24px;
        vertical-align: -3px;
    }
    .svg-icon-1 {
        display: inline-block;
        width: 24px;
        height: 24px;
        margin-right: 5px;
        vertical-align: -5px;
        fill: currentColor;
        stroke: currentColor;
        stroke-width: 0;
    }
    .svg-icon-2 {
        display: inline-block;
        width: 22px;
        height: 22px;
        margin-right: 5px;
        vertical-align: -5px;
        fill: currentColor;
        stroke: currentColor;
        stroke-width: 0;
    }
    .handle-item {
        margin-bottom: 12px;
        padding: 10px;
        color: var(--mainColor);
        font-size: 18px;
        line-height: 24px;
        border-radius: 8px;
        transition: ease 0.4s;
        &.href {
            cursor: pointer;
            &:hover {
                color: var(--primary);
                background: v-bind(btnbg);
            }
        }
        &.active {
            color: var(--primary);
        }
        .el-icon-caret-bottom {
            font-size: 20px;
        }
    }
    .children-item {
        margin-bottom: 10px;
        padding: 10px 10px 10px 25px;
        color: var(--mainColor);
        font-size: 16px;
        line-height: 24px;
        border-radius: 8px;
        cursor: pointer;
        transition: ease 0.4s;
        &:hover {
            color: var(--primary);
            background: v-bind(btnbg);
        }
        &.active {
            color: var(--primary);
        }
    }
}
.lead {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 84px;
    padding: 0 25px;
    background: var(--contentColor);
    border-radius: 4px;
    box-shadow: rgb(0 0 0 / 5%) 0 2px 1px, rgb(0 0 0 / 25%) 0 0 1px;
}
.lead-left {
    height: 100%;
    ul {
        display: flex;
        align-items: center;
        height: 100%;
    }
    .row {
        color: var(--minorColor);
        font-size: 16px;
        .path {
            font-weight: bold;
            cursor: pointer;
            &:hover {
                color: var(--color);
            }
        }
        .active {
            color: var(--color);
            cursor: inherit;
        }
        .split {
            margin: 0 5px;
        }
    }
}
.lead-right {
    display: flex;
    align-items: center;
    height: 100%;
    .test-tag {
        margin-right: 10px;
        padding: 0 8px;
        color: #FFF;
        font-size: 12px;
        line-height: 23px;
        text-align: center;
        background: var(--normalColor);
        border-radius: 5px;
        cursor: pointer;
    }
    .wallet-row {
        display: flex;
        align-items: center;
        min-width: 64px;
        height: 36px;
        padding: 0 10px;
        color: var(--primary);
        font-size: 16px;
        background: v-bind(btnbg);
        border: 1px solid transparent;
        border-radius: 5px;
        cursor: pointer;
        .icon {
            width: 20px;
            height: 20px;
            margin-right: 5px;
            border-radius: 50%;
        }
        .arrow {
            margin-top: -5px;
            margin-left: 10px;
        }
        &:hover {
            border: 1px solid var(--primary);
        }
    }
    .connect-wallet {
        button {
            padding: 6px 12px;
            padding: 0 20px;
            color: #FFF;
            font-weight: 500;
            font-size: 14px;
            font-family: Inter, Arial;
            line-height: 36px;
            background: linear-gradient(248.86deg, #5292F1 10.51%, #5BECBC 90.41%);
            border-radius: 4px;
            box-shadow: none;
            cursor: pointer;
            -webkit-transition: all 0.2s ease;
            transition: all 0.2s ease;
            &:hover {
                opacity: 0.8;
            }
        }
    }
}
.handle-wallet {
    position: relative;
    z-index: 100;
}
.wallet-menus {
    position: absolute;
    top: 38px;
    left: 0;
    min-width: 240px;
    background: var(--contentColor);
    border-radius: 4px;
    box-shadow: rgb(0 0 0 / 20%) 0 0 2px, rgb(0 0 0 / 10%) 0 2px 10px;
    transform-origin: 32px 0;
    &.show {
        transform: scale(1, 1);
        visibility: visible;
        opacity: 1;
        transition: opacity 308ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, transform 205ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
    }
    &.hide {
        transform: scale(0.75, 0.5625);
        visibility: hidden;
        opacity: 0;
        transition: opacity 308ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, transform 205ms cubic-bezier(0.4, 0, 0.2, 1) 103ms;
    }
    .account {
        display: flex;
        align-items: center;
        padding: 12px 16px;
        border-bottom: 1px solid var(--lineColor);
        .icon {
            width: 38px;
            height: 38px;
            margin-right: 12px;
            border-radius: 50%;
        }
        .address {
            color: var(--color);
            font-weight: 600;
            font-size: 16px;
        }
    }
    .network {
        display: flex;
        flex-direction: column;
        padding: 12px 16px;
        border-bottom: 1px solid var(--lineColor);
        label {
            margin-bottom: 4px;
            color: var(--minorColor);
            font-size: 12px;
        }
        .name {
            display: flex;
            align-items: center;
            em {
                width: 6px;
                height: 6px;
                margin-right: 8px;
                background-color: rgb(101, 201, 112);
                border-radius: 50%;
                box-shadow: rgb(0 0 0 / 5%) 0 2px 1px, rgb(0 0 0 / 25%) 0 0 1px;
            }
            span {
                color: var(--color);
                font-weight: bold;
                font-size: 14px;
            }
        }
    }
    .options {
        padding: 4px 0;
        li {
            display: flex;
            align-items: center;
            padding: 12px 16px;
            color: var(--normalColor);
            cursor: pointer;
            svg {
                width: 22px;
                height: 22px;
                margin-right: 12px;
            }
            span {
                font-weight: bold;
                font-size: 14px;
            }
            &:hover {
                background: var(--bgColor);
            }
        }
    }
}
.setting-module {
    position: relative;
    z-index: 100;
    margin-left: 12px;
}
.setting-control {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    background: v-bind(btnbg);
    border: 1px solid transparent;
    border-radius: 5px;
    cursor: pointer;
    .icon {
        margin-top: -4px;
        color: var(--primary);
        font-size: 18px;
    }
    &:hover {
        border: 1px solid var(--primary);
    }
}
.setting-menus {
    position: absolute;
    top: 38px;
    right: 0;
    min-width: 240px;
    padding: 4px 0;
    background: var(--contentColor);
    border-radius: 4px;
    box-shadow: rgb(0 0 0 / 20%) 0 0 2px, rgb(0 0 0 / 10%) 0 2px 10px;
    transform-origin: 32px 0;
    &.show {
        transform: scale(1, 1);
        visibility: visible;
        opacity: 1;
        transition: opacity 308ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, transform 205ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
    }
    &.hide {
        transform: scale(0.75, 0.5625);
        visibility: hidden;
        opacity: 0;
        transition: opacity 308ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, transform 205ms cubic-bezier(0.4, 0, 0.2, 1) 103ms;
    }
    .testnet-mode {
        display: flex;
        align-items: center;
        padding: 12px 16px;
        font-size: 14px;
        cursor: pointer;
        label {
            flex: 1;
            color: var(--color);
            font-weight: 600;
            cursor: pointer;
        }
        span {
            margin-right: 6px;
            color: var(--normalColor);
        }
        &:hover {
            background: var(--bgColor);
        }
    }
}
</style>
