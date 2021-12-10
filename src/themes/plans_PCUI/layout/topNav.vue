<template>
    <div class='header-nav'>
        <div class='nav-left'>
            <router-link to='/home'>
                <h1 class='logo'>
                    <img alt='' src='@planspc/images/logo.png' />
                </h1>
            </router-link>
            <div class='menus'>
                <div class='item'>
                    <router-link to='/quote'>
                        <span class='link'>
                            {{ $t('header.quote') }}
                        </span>
                    </router-link>
                </div>
                <div class='item'>
                    <el-dropdown @command='changePlans'>
                        <span class='link'>
                            {{ plansName }}
                            <i class='el-icon-caret-bottom'></i>
                        </span>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item
                                    v-for='item in plansList'
                                    :key='item.id'
                                    :command='item'
                                >
                                    {{ item.name }}
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </div>
            </div>
        </div>
        <div class='nav-right'>
            <!-- 未登录 -->
            <div v-if="userAccountType==='G'" class='handle-not'>
                <router-link class='login' to='/login'>
                    {{ $t('c.login') }}
                </router-link>
                <router-link class='register' to='/register'>
                    {{ $t('c.register') }}
                </router-link>
            </div>
            <!-- 已登录 -->
            <div v-else-if='customerInfo' class='handle-have'>
                <div class='item'>
                    <div class='user'>
                        <i class='head el-icon-s-custom'></i>
                        <span class='no'>
                            {{ customerInfo.customerNo }}
                        </span>
                    </div>
                </div>
                <div class='item'>
                    <i class='icon icon_zichan' :title="$t('header.assets')" @click="$router.push('/assets')"></i>
                </div>
                <div class='item'>
                    <Msg />
                </div>
                <div class='item'>
                    <el-dropdown>
                        <i class='icon icon_gerenxinxi' :title="$t('cRoute.personal')"></i>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item v-if='customerInfo.companyKycStatus===1' @click="handRoutTo('/authentication')">
                                    {{ $t('cRoute.regKyc') }}
                                </el-dropdown-item>
                                <el-dropdown-item @click="handRoutTo('/bankList')">
                                    {{ $t('cRoute.bankList') }}
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </div>
                <div class='item'>
                    <SettingIcon />
                </div>
                <div class='line'></div>
            </div>
            <!-- 操作功能 -->
            <div class='handle-feature'>
                <div v-if='onlineService' class='item'>
                    <a :href='onlineService' target='_blank'>
                        <i class='icon icon_kefu' :title="$t('header.service')"></i>
                    </a>
                </div>
                <div class='item'>
                    <DownloadIcon />
                </div>
                <div class='item'>
                    <LangIcon />
                </div>
                <div class='item'>
                    <ThemeIcon />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { onBeforeMount, computed, reactive, toRefs, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import { isEmpty } from '@/utils/util'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import SettingIcon from './components/settingIcon'
import ThemeIcon from './components/themeIcon'
import LangIcon from './components/langIcon'
import Msg from './components/msg'
import DownloadIcon from './components/downloadIcon'

export default {
    components: {
        SettingIcon,
        ThemeIcon,
        LangIcon,
        Msg,
        DownloadIcon
    },
    setup () {
        const route = useRoute()
        const router = useRouter()
        const store = useStore()
        const { t } = useI18n({ useScope: 'global' })
        const state = reactive({
            rightAction: { title: 444 }
        })

        const plansName = computed(() => {
            if (route.query.tradeType) {
                const tradeType = route.query.tradeType
                return t('tradeType[' + tradeType + ']')
            } else {
                return t('header.trade')
            }
        })

        // 获取账户信息
        const customInfo = computed(() => store.state._user.customerInfo)
        // 在线客服地址
        const onlineService = computed(() => store.state._base.wpCompanyInfo?.onlineService)

        onBeforeMount(() => {

        })
        onUnmounted(() => {

        })
        const formatTime = (val) => {
            return window.dayjs(val).format('YYYY-MM-DD HH:mm:ss')
        }

        // 玩法列表
        const plansList = computed(() => store.state._base.plans)
        const userAccountType = computed(() => store.getters['_user/userAccountType'])
        const customerInfo = computed(() => store.state._user.customerInfo)

        const changePlans = (item) => {
            state.plansName = item.name
            const symbolId = store.state._quote.productList.find(el => Number(el.tradeType) === Number(item.id))?.symbolId
            store.commit('_quote/Update_productActivedID', `${symbolId}_${item.id}`)

            router.push({
                path: '/order',
                query: {
                    symbolId,
                    tradeType: item.id
                }
            })
        }

        // 路由跳转
        const handRoutTo = (path) => router.push(route.path + path)

        return {
            plansList,
            onlineService,
            userAccountType,
            customerInfo,
            handRoutTo,
            customInfo,
            formatTime,
            changePlans,
            plansName,
            ...toRefs(state)
        }
    }
}
</script>

<style lang="scss" scoped>
.header-nav {
    display: flex;
    justify-content: space-between;
    min-width: 1200px;
    height: 50px;
    padding: 0 16px;
    background-color: rgba(21,25,30,1);
    position: relative;
    z-index: 100;
    &.Home{
        position: sticky;
        top: 0;
        left: 0;
        width: 100%;
        background-color: rgba(0,0,0,.5);
    }
    .nav-left {
        display: flex;
        align-items: center;
        height: 100%;
        .logo {
            display: inline-flex;
            align-items: center;
            margin-right: 32px;
        }
        .menus {
            display: flex;
            align-items: center;
            height: 100%;
            .item {
                margin-right: 30px;
                cursor: pointer;
                &:last-of-type {
                    margin-right: 0;
                }
                .link {
                    font-size: 14px;
                    color: #fff;
                    cursor: pointer;
                    &:hover {
                        color: var(--primary);
                    }
                }
            }
        }
    }
    .nav-right {
        display: flex;
        align-items: center;
        height: 100%;
        .handle-not {
            display: flex;
            align-items: center;
            margin-right: 24px;
            font-size: 14px;
            .login {
                margin-right: 15px;
                color: #fff;
                &:hover {
                    color: var(--primary);
                }
            }
            .register {
                display: inline-flex;
                justify-content: center;
                align-items: center;
                width: 64px;
                height: 28px;
                color: #fff;
                background: #477FD3;
                border-radius: 4px;
            }
        }
        .handle-have {
            display: flex;
            align-items: center;
            height: 100%;
            .item {
                margin-right: 20px;
                &:nth-last-child(2) {
                    margin-right: 0;
                }
                .user {
                    display: flex;
                    align-items: center;
                    color: #D6DAE1;
                    cursor: pointer;
                    .head {
                        display: inline-flex;
                        justify-content: center;
                        align-items: center;
                        width: 28px;
                        height: 28px;
                        margin-right: 8px;
                        background: #91B6EE;
                        border-radius: 50%;
                        overflow: hidden;
                        i {
                            margin-top: 10px;
                            font-size: 24px;
                            color: #fff;
                        }
                    }
                    .no {
                        line-height: 1;
                        font-size: 16px;
                    }
                }
                .icon {
                    font-size: 20px;
                    color: #D6DAE1;
                    cursor: pointer;
                }

            }
            .line {
                width: 1px;
                height: 18px;
                margin: 0 24px;
                background: #515366;
            }
        }
        .handle-feature {
            display: flex;
            align-items: center;
            height: 100%;
            .item {
                margin-right: 20px;
                &:last-of-type {
                    margin-right: 0;
                }
                .icon {
                    font-size: 20px;
                    color: #D6DAE1;
                    cursor: pointer;
                }
                &:deep(.icon_yuyan) {
                    display: inline-flex;
                    margin-top: 2px;
                }
            }
        }
    }
}
.information_box{
    width:400px;
    height:600px;
    border-radius: 10px;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.2);
    background-color:rgba(0, 0, 0, 0.2);
    .information_head{
        width:100%;
        height:48px;
        background-color:#ffffff;
        text-align:center;
        box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.2);
        .current_type{
            font-size: 16px;
            line-height: 48px;
            cursor:pointer;
            i{
                margin-left:4px;
                color:#dcdfe6;
                cursor:pointer;
            }
        }
    }
    .type_list{
        ul{
            width:100%;
            li{
                width:100%;
                height:40px;
                line-height: 44px;
                font-size: 14px;
                text-align:center;
                background-color:#ffffff;
                cursor:pointer;
            }
        }
        .activeLi{
            color:#ee0a24;
        }
    }
    .msg-list {
        flex: 1;
        height: 552px;
        overflow: auto;
        background-color: var(--bgColor);
        .msg-item {
            margin: 7px;
            padding: 10px;
            background-color: var(--contentColor);
            border-top: solid 10px var(--bgColor);
            .msg-title {
                color: var(--color);
                font-weight: bold;
                font-size: 14px;
                line-height: 30px;
            }
            .msg-content {
                color: var(--color);
                font-weight: 500;
                font-size: 12px;
                line-height: 20px;
            }
            .msg-time {
                color: var(--minorColor);
                font-weight: 400;
                font-size: 12px;
                line-height: 30px;
            }
        }
    }
}
</style>
