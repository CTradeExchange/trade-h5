<template>
    <div class='footer-nav'>
        <div class='footer-auto auto-width'>
            <div class='nav-left'>
                <img class='logo' src='@planspc/images/logo.png' />
                <p class='year'>
                    © 2013-2021 CATS
                </p>
            </div>
            <div class='nav-right'>
                <ul>
                    <li>
                        <h4 class='title'>
                            关于
                        </h4>
                        <p class='name'>
                            <a href='javascript:;'>
                                Cats 2.0
                            </a>
                        </p>
                        <p class='name'>
                            <a href='javascript:;'>
                                职业机会
                            </a>
                        </p>
                        <p class='name'>
                            <a href='javascript:;'>
                                费率标准
                            </a>
                        </p>
                        <p class='name'>
                            <a href='javascript:;'>
                                合作伙伴
                            </a>
                        </p>
                    </li>
                    <li>
                        <h4 class='title'>
                            工具
                        </h4>
                        <p class='name'>
                            <a href='javascript:;'>
                                客户端下载
                            </a>
                        </p>
                        <p class='name'>
                            <a href='javascript:;'>
                                API文档
                            </a>
                        </p>
                        <p class='name'>
                            <a href='javascript:;'>
                                数字资产介绍
                            </a>
                        </p>
                        <p class='name'>
                            <a href='javascript:;'>
                                官方验证通道
                            </a>
                        </p>
                        <p class='name'>
                            <a href='javascript:;'>
                                历史数据下载
                            </a>
                        </p>
                    </li>
                    <li>
                        <h4 class='title'>
                            服务
                        </h4>
                        <p class='name'>
                            <a href='javascript:;'>
                                费率
                            </a>
                        </p>
                        <p class='name'>
                            <a href='javascript:;'>
                                借币额度
                            </a>
                        </p>
                        <p class='name'>
                            <a href='javascript:;'>
                                帮助中心
                            </a>
                        </p>
                        <p class='name'>
                            <a href='javascript:;'>
                                新手指南
                            </a>
                        </p>
                        <p class='name'>
                            <a href='javascript:;'>
                                合约课堂
                            </a>
                        </p>
                    </li>
                    <li>
                        <h4 class='title'>
                            支持
                        </h4>
                        <p class='name'>
                            <a href='javascript:;'>
                                合作申请
                            </a>
                        </p>
                        <p class='name'>
                            <a href='javascript:;'>
                                机构服务
                            </a>
                        </p>
                        <p class='name'>
                            <a href='javascript:;'>
                                大客户权益
                            </a>
                        </p>
                        <p class='name'>
                            <a href='javascript:;'>
                                广告权限申请
                            </a>
                        </p>
                    </li>
                    <li>
                        <h4 class='title'>
                            条款
                        </h4>
                        <p class='name'>
                            <a href='javascript:;'>
                                用户协议
                            </a>
                        </p>
                        <p class='name'>
                            <a href='javascript:;'>
                                隐私条款
                            </a>
                        </p>
                        <p class='name'>
                            <a href='javascript:;'>
                                交易规则
                            </a>
                        </p>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
import { reactive, toRefs } from 'vue'
import { useStore } from 'vuex'
export default {
    setup () {
        const store = useStore()
        return {}
    }
}
</script>

<style lang="scss" scoped>
.footer-nav {
    height: 380px;
    background: #21262F;
    .footer-auto {
        display: flex;
        justify-content: space-between;
    }
    .nav-left {
        padding-top: 87px;
        .logo {
            width: 98px;
            height: 17px;
        }
        .year {
            margin-top: 18px;
            font-size: 12px;
            color: #9293A3;
        }
    }
    .nav-right {
        padding-top: 90px;
        ul {
            display: flex;
        }
        li {
            margin-right: 120px;
            &:last-of-type {
                margin-right: 0;
            }
            .title {
                font-size: 14px;
                color: #515366;
            }
            .name {
                margin-top: 10px;
                a {
                    font-size: 14px;
                    color: #9293A3;
                }
            }
        }
    }
}
</style>
