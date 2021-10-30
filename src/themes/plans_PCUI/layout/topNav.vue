<template>
    <div class='header-nav'>
        <div class='nav-left'>
            <router-link to='/home'>
                <h1 class='logo'>
                    <img alt='CATS 2.0' src='@planspc/images/logo.png' />
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
                    <el-dropdown>
                        <span class='link'>
                            {{ $t('header.trade') }}<i class='el-icon-caret-bottom'></i>
                        </span>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item v-for='item in plansList' :key='item.id'>
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
                <router-link class='register' to='/'>
                    {{ $t('c.rigister') }}
                </router-link>
            </div>
            <!-- 已登录 -->
            <div v-else class='handle-have'>
                <div class='item'>
                    <div class='user'>
                        <i class='head el-icon-s-custom'></i>
                        <span class='no'>
                            {{ customerInfo.customerNo }}
                        </span>
                    </div>
                </div>
                <div class='item'>
                    <i class='icon icon_zichan' :title="$t('header.assets')"></i>
                </div>
                <div class='item'>
                    <i class='icon icon_xiaoxizhongxin1' :title="$t('header.information')"></i>
                </div>
                <div class='item'>
                    <el-dropdown>
                        <div class='user'>
                            <i class='icon icon_shezhi' :title="$t('header.set')"></i>
                        </div>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item @click='handRoutTo("/bindEmail")'>
                                    绑定邮箱
                                </el-dropdown-item>
                                <el-dropdown-item @click='handRoutTo("/bindMobile")'>
                                    绑定手机
                                </el-dropdown-item>
                                <el-dropdown-item>
                                    <div>
                                        颜色涨跌
                                    </div>
                                    <el-dropdown-menu>
                                        <el-dropdown-item> 红涨绿跌 </el-dropdown-item>
                                        <el-dropdown-item> 绿涨红跌 </el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown-item>
                                <el-dropdown-item @click='logoutHandler'>
                                    退出登录
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </div>
                <div class='line'></div>
            </div>
            <!-- 操作功能 -->
            <div class='handle-feature'>
                <div class='item'>
                    <i class='icon icon_kefu' :title="$t('header.service')"></i>
                </div>
                <div class='item'>
                    <el-dropdown>
                        <i class='icon icon_xiazai' :title="$t('header.download')"></i>
                        <template #dropdown>
                            <div class='download-dialog'>
                                <img src='@planspc/images/home/download-code.png' />
                                <p>{{ $t('header.downloadTip') }}</p>
                            </div>
                        </template>
                    </el-dropdown>
                </div>
                <div class='item'>
                    <el-dropdown>
                        <i class='icon icon_yuyan' :title="$t('header.language')"></i>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item>简体中文</el-dropdown-item>
                                <el-dropdown-item>繁体中文</el-dropdown-item>
                                <el-dropdown-item>ENGLISH</el-dropdown-item>
                                <el-dropdown-item>Русский</el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </div>
                <div class='item'>
                    <el-dropdown>
                        <i class='icon icon_zhuanhuanchengbaitian' :title="$t('header.theme')"></i>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item>白天</el-dropdown-item>
                                <el-dropdown-item>黑夜</el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { MsgSocket } from '@/plugins/socket/socket'
import { useRoute, useRouter } from 'vue-router'
// import UpDownColor from './components/upDownColor'
// import SettingIcon from './components/settingIcon'
export default {
    // components: {
    //     UpDownColor,
    //     SettingIcon,
    // },
    setup () {
        const route = useRoute()
        const router = useRouter()
        const store = useStore()
        // 玩法列表
        const plansList = computed(() => store.state._base.plans)
        const userAccountType = computed(() => store.getters['_user/userAccountType'])
        const customerInfo = computed(() => store.state._user.customerInfo)

        // 路由跳转
        const handRoutTo = (path) => router.push(route.path + path)

        // 退出登录
        const logoutHandler = () => {
            MsgSocket.logout()
            Promise.resolve().then(() => {
                return store.dispatch('_user/logout')
            }).then(() => {
                return router.push({ name: 'Login' })
            }).then(() => {
                location.reload()
            })
        }
        return {
            plansList,
            userAccountType,
            customerInfo,
            logoutHandler,
            handRoutTo,
        }
    }
}
</script>

<style lang="scss" scoped>
.header-nav {
    display: flex;
    justify-content: space-between;
    height: 50px;
    padding: 0 16px;
    background-color: rgba(0,0,0,1);
    position: relative;
    z-index: 100;
    .nav-left {
        display: flex;
        align-items: center;
        height: 100%;
        .logo {
            display: inline-flex;
            align-items: center;
            margin-right: 32px;
            img {
                width: 105px;
                height: 17px;
            }
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
                        margin-top: 4px;
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
            }
        }
    }
}

.download-dialog {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10px 15px;
    img {
        width: 88px;
        height: 88px;
    }
    p {
        width: 88px;
        line-height: 20px;
        font-size: 14px;
        color: var(--color);
    }
}

.el-dropdown-menu {
    .el-dropdown-menu__item {
        font-size: 14px;
        color: var(--color);
        &:hover {
            color: var(--primary);
            background: var(--primaryAssistColor);
        }
    }
}
</style>
