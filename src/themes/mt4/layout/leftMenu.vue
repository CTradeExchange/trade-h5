<template>
    <van-popup
        v-model:show='visible'
        position='left'
        :style="{ height: '100%' }"
        teleport='#app'
    >
        <div class='mainWrap'>
            <!-- <div class="flagWrap"> </div> -->
            <!-- <span class='flag'>Demo</span> -->
            <figure class='userFigure of-1px-bottom'>
                <span class='face'>
                    <img alt='' src='@m/images/face.png' />
                </span>
                <figcaption>
                    <p><strong>Cats2.0 H5</strong></p>
                    <p v-if='customerNo'>
                        {{ customerNo }} - MetaQuotes
                    </p>
                    <a v-if='customerNo' class='accountManager' href='javascript:;' @click="visible=false;$router.push('/accountManager')">
                        {{ $t('c.managAccount') }}
                    </a>
                    <a v-else class='accountManager' href='javascript:;' @click="visible=false;$router.push('/login')">
                        {{ $t('c.loginAccont') }}
                    </a>
                </figcaption>
            </figure>
            <ul class='menuList'>
                <!-- <li class='item' @click="visible=false;$router.push('/quote')"> <i class='icon icon_hangqing'></i> <strong>行情</strong> </li>
                <li class='item' @click="visible=false;$router.push('/chart')"> <i class='icon icon_tubiao'></i> <strong>图表</strong> </li>
                <li class='item' @click="visible=false;$router.push('/trade')"> <i class='icon icon_jiaoyi'></i> <strong>交易</strong> </li>
                <li class='item' @click="visible=false;$router.push('/history')"> <i class='icon icon_lishi'></i> <strong>历史</strong> </li> -->
                <li class='item' @click="visible=false;$router.push({ path:'/deposit' })">
                    <i class='icon icon_cunkuan'></i> <strong>{{ $t('cRoute.deposit') }}</strong>
                </li>
                <li class='item' @click="visible=false;$router.push('/withdraw')">
                    <i class='icon icon_qukuan'></i> <strong>{{ $t('cRoute.withdraw') }}</strong>
                </li>
                <li class='item' @click="visible=false;$router.push('/fund')">
                    <i class='icon icon_jiemian'></i> <strong>{{ $t('cRoute.fund') }}</strong>
                </li>
                <li class='item' @click="visible=false;$router.push('/fundLog')">
                    <i class='icon icon_zijinmingxi'></i> <strong>{{ $t('cRoute.fundLog') }}</strong>
                </li>
                <li class='item' @click="visible=false;$router.push('/personal')">
                    <i class='icon icon_gerenxinxi '></i> <strong>{{ $t('cRoute.personal') }}</strong>
                </li>
                <li v-if='openNews' class='item' @click='toNews'>
                    <i class='icon icon_xinwen'></i> <strong>{{ $t('route.news') }}</strong>
                </li>

                <li v-if='borrowReturn' class='item' @click='toBorrow'>
                    <i class='icon icon_xinwen'></i> <strong>{{ $t('c.borrowReturn') }}</strong>
                </li>
                <li class='item' @click="visible=false;$router.push('/msg')">
                    <i class='icon icon_xinxi'></i> <strong>{{ $t('cRoute.msg') }}</strong>
                </li>

                <li class='item' @click="visible=false;$router.push('/page')">
                    <i class='icon icon_jiemian'></i> <strong>{{ $t('cRoute.page') }}</strong>
                </li>
                <li class='item' @click="visible=false;$router.push('/chartSetting')">
                    <i class='icon icon_tubiaoxian'></i> <strong>{{ $t('route.chart') }}</strong>
                </li>
                <li v-if='$store.state._base.wpCompanyInfo?.onlineService' class='item'>
                    <a :href='$store.state._base.wpCompanyInfo?.onlineService' rel='noopener noreferrer' target='_blank'>
                        <i class='icon icon_kefu'></i> <strong>{{ $t('c.onlineService') }}</strong>
                    </a>
                </li>
                <li class='item' @click="visible=false;$router.push('/setting')">
                    <i class='icon icon_shezhi'></i> <strong>{{ $t('cRoute.setting') }}</strong>
                </li>
            </ul>
        </div>
    </van-popup>
</template>

<script>
import { computed, reactive, toRefs } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
export default {
    setup () {
        const router = useRouter()
        const store = useStore()
        const { t } = useI18n({ useScope: 'global' })
        const state = reactive({
            visible: false,
        })

        const customerNo = computed(() => store.state._user.customerInfo?.customerNo)
        const borrowReturn = computed(() => store.state._base.wpCompanyInfo.borrowReturn)
        const openNews = computed(() => {
            if (localStorage.getItem('openNews')) return JSON.parse(localStorage.getItem('openNews'))
        })

        const toNews = () => {
            state.visible = false
            router.replace('/news')
        }

        // 借还
        const toBorrow = () => {
            state.visible = false
            if (!customerNo.value) return router.push({ name: 'Login' })
            router.push({
                name: 'Otherpage',
                params: { type: 'page' },
                query: {
                    url: encodeURIComponent(borrowReturn.value),
                    pageTitle: t('c.borrowReturn')
                }
            })
        }

        return {
            ...toRefs(state),
            borrowReturn,
            customerNo,
            openNews,
            toBorrow,
            toNews

        }
    },
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.mainWrap {
    position: relative;
    width: 70vw;
    overflow: hidden;
}
.flag {
    position: absolute;
    top: 0;
    right: 0;
    display: block;
    width: rem(180px);
    height: rem(44px);
    color: #FFF;
    font-weight: bold;
    font-size: rem(24px);
    line-height: rem(44px);
    text-align: center;
    text-shadow: #267200 1px 0 0, #267200 0 1px 0, #267200 -1px 0 0, #267200 0 -1px 0;
    background: #4DC90F;
    transform: rotate(45deg) translate(rem(44px), rem(-20px));
}
.userFigure {
    display: flex;
    padding: rem(30px);
    font-size: rem(24px);
    line-height: 1.5;
    .face {
        width: rem(100px);
        height: rem(100px);
        img {
            width: rem(60px);
            height: rem(60px);
        }
    }
    strong {
        font-size: rem(28px);
    }
    .accountManager {
        display: block;
        margin-top: rem(20px);
        color: var(--primary);
    }
}
.menuList {
    padding: rem(10px) 0;
    font-size: rem(26px);
    .item {
        @include active()
    ;
        padding: rem(19px) rem(30px);
        strong {
            vertical-align: middle;
        }
    }
    .icon {
        display: inline-block;
        margin-right: 0.8em;
        color: var(--mutedColor);
        font-size: rem(52px);
        vertical-align: middle;
    }
}
</style>
