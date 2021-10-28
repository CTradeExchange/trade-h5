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
                <el-dropdown class='item'>
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
        <div class='nav-right'>
            <!-- 未登录 -->
            <div v-if='false' class='handle-not'>
                <router-link class='login' to='/'>
                    登录
                </router-link>
                <router-link class='register' to='/'>
                    注册
                </router-link>
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
            font-size: 14px;
            .login {
                margin-right: 15px;
                color: #fff;
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
