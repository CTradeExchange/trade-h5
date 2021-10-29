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
                            行情
                        </span>
                    </router-link>
                </div>
                <div class='item'>
                    <el-dropdown>
                        <span class='link'>
                            交易<i class='el-icon-caret-bottom'></i>
                        </span>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item>现货交易</el-dropdown-item>
                                <el-dropdown-item>杠杆交易</el-dropdown-item>
                                <el-dropdown-item>合约全仓</el-dropdown-item>
                                <el-dropdown-item>合约逐仓</el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </div>
            </div>
        </div>
        <div class='nav-right'>
            <!-- 未登录 -->
            <div class='handle-not'>
                <router-link class='login' to='/'>
                    登录
                </router-link>
                <router-link class='register' to='/'>
                    注册
                </router-link>
            </div>
            <!-- 已登录 -->
            <div v-if='false' class='handle-have'>
                <div class='item'>
                    <el-dropdown>
                        <div class='user'>
                            <i class='head el-icon-s-custom'></i>
                            <span class='no'>
                                565666
                            </span>
                        </div>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item>退出登录</el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </div>
                <div class='item'>
                    <i class='icon icon_xiaoxizhongxin' title='资产'></i>
                </div>
                <div class='item'>
                    <i class='icon icon_gerenxinxi' title='个人消息'></i>
                </div>
                <div class='item'>
                    <i class='icon icon_shezhi' title='设置'></i>
                </div>
                <div class='line'></div>
            </div>
            <!-- 操作功能 -->
            <div class='handle-feature'>
                <div class='item'>
                    <i class='icon icon_kefu' title='客服'></i>
                </div>
                <div class='item'>
                    <i class='icon icon_xiazai' title='下载'></i>
                </div>
                <div class='item'>
                    <el-dropdown>
                        <i class='icon icon_yuyan' title='语言'></i>
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
                        <i class='icon icon_zhuanhuanchengheiye' title='主题'></i>
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
export default {

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
                    color: #D6DAE1;
                    cursor: pointer;
                    .head {
                        margin-right: 2px;
                        font-size: 20px;
                    }
                    .no {
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
