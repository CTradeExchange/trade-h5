<template>
    <div class='header-nav' flex='main:justify'>
        <div class='nav-left' flex='cross:center'>
            <router-link to='/home'>
                <h1 class='logo' flex='cross:center'>
                    <img alt='CATS 2.0' src='../images/logo.png' />
                </h1>
            </router-link>
            <ul class='menus' flex>
                <li>
                    <router-link to='/quote'>
                        <span class='link'>
                            行情
                        </span>
                    </router-link>
                </li>
                <li>
                    <router-link to='/quote'>
                        <span class='link'>
                            交易
                        </span>
                    </router-link>
                </li>
            </ul>
        </div>
        <div class='nav-right' flex='cross:center'>
            <!-- 未登录 -->
            <div class='handle-not' flex='cross:center'>
                <router-link class='login' to='/'>
                    登录
                </router-link>
                <router-link class='register' flex='main:center cross:center' to='/'>
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
    height: 50px;
    padding: 0 16px;
    background: #000;
    .nav-left {
        height: 100%;
        .logo {
            margin-right: 32px;
            img {
                width: 105px;
                height: 17px;
            }
        }
        .menus {
            height: 100%;
            li {
                display: inline-flex;
                align-items: center;
                height: 100%;
                margin-right: 30px;
                &:last-of-type {
                    margin-right: 0;
                }
                .link {
                    font-size: 14px;
                    color: #fff;
                }
            }
        }
    }
    .nav-right {
        height: 100%;
        .handle-not {
            font-size: 14px;
            .login {
                margin-right: 15px;
                color: #fff;
            }
            .register {
                width: 64px;
                height: 28px;
                color: #fff;
                background: #477FD3;
                border-radius: 4px;
            }
        }
    }
}
</style>
