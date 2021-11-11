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
                            {{ $t('footer.about.title') }}
                        </h4>
                        <p class='name'>
                            <a href='javascript:;'>
                                {{ $t('footer.about.1') }}
                            </a>
                        </p>
                        <p class='name'>
                            <a href='javascript:;'>
                                {{ $t('footer.about.2') }}
                            </a>
                        </p>
                        <p class='name'>
                            <a href='javascript:;'>
                                {{ $t('footer.about.3') }}
                            </a>
                        </p>
                        <p class='name'>
                            <a href='javascript:;'>
                                {{ $t('footer.about.4') }}
                            </a>
                        </p>
                    </li>
                    <li>
                        <h4 class='title'>
                            {{ $t('footer.tool.title') }}
                        </h4>
                        <p class='name'>
                            <a href='javascript:;'>
                                {{ $t('footer.tool.1') }}
                            </a>
                        </p>
                        <p class='name'>
                            <a href='javascript:;'>
                                {{ $t('footer.tool.2') }}
                            </a>
                        </p>
                        <p class='name'>
                            <a href='javascript:;'>
                                {{ $t('footer.tool.3') }}
                            </a>
                        </p>
                        <p class='name'>
                            <a href='javascript:;'>
                                {{ $t('footer.tool.4') }}
                            </a>
                        </p>
                        <p class='name'>
                            <a href='javascript:;'>
                                {{ $t('footer.tool.5') }}
                            </a>
                        </p>
                    </li>
                    <li>
                        <h4 class='title'>
                            {{ $t('footer.serve.title') }}
                        </h4>
                        <p class='name'>
                            <a href='javascript:;'>
                                {{ $t('footer.serve.1') }}
                            </a>
                        </p>
                        <p class='name'>
                            <a href='javascript:;'>
                                {{ $t('footer.serve.2') }}
                            </a>
                        </p>
                        <p class='name'>
                            <a href='javascript:;'>
                                {{ $t('footer.serve.3') }}
                            </a>
                        </p>
                        <p class='name'>
                            <a href='javascript:;'>
                                {{ $t('footer.serve.4') }}
                            </a>
                        </p>
                        <p class='name'>
                            <a href='javascript:;'>
                                {{ $t('footer.serve.5') }}
                            </a>
                        </p>
                    </li>
                    <li>
                        <h4 class='title'>
                            {{ $t('footer.support.title') }}
                        </h4>
                        <p class='name'>
                            <a href='javascript:;'>
                                {{ $t('footer.support.1') }}
                            </a>
                        </p>
                        <p class='name'>
                            <a href='javascript:;'>
                                {{ $t('footer.support.2') }}
                            </a>
                        </p>
                        <p class='name'>
                            <a href='javascript:;'>
                                {{ $t('footer.support.3') }}
                            </a>
                        </p>
                        <p class='name'>
                            <a href='javascript:;'>
                                {{ $t('footer.support.4') }}
                            </a>
                        </p>
                    </li>
                    <li>
                        <h4 class='title'>
                            {{ $t('footer.terms.title') }}
                        </h4>
                        <p class='name'>
                            <a href='javascript:;'>
                                {{ $t('footer.terms.1') }}
                            </a>
                        </p>
                        <p class='name'>
                            <a href='javascript:;'>
                                {{ $t('footer.terms.2') }}
                            </a>
                        </p>
                        <p class='name'>
                            <a href='javascript:;'>
                                {{ $t('footer.terms.3') }}
                            </a>
                        </p>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    setup () {
        return {}
    }
}
</script>

<style lang="scss" scoped>
.footer-nav {
    height: 380px;
    background: #15191E;
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
