<template>
    <van-tabbar v-model='active' :active-color='$style.primary' class='footerMenu' :class='{ h5Preview }'>
        <van-tabbar-item v-for='item in data.items' :key='item.href' :name='item.href.name' @click='menuHandler(item)'>
            <template #icon>
                <img
                    v-if='item.src'
                    class='imgIcon'
                    :src='item.src'
                />
                <i v-else-if='item.icon' class='icon' :class='item.icon'></i>
            </template>
            <p class='title'>
                {{ item.title }}
            </p>
        </van-tabbar-item>
    </van-tabbar>
</template>

<script>
import { reactive, toRefs, watchEffect, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
export default {
    props: {
        data: {
            type: Object,
            default: function () {
                return {}
            }
        },
    },
    setup (props) {
        const router = useRouter()
        const route = useRoute()
        const store = useStore()
        const { t } = useI18n({ useScope: 'global' })
        const symbolKey = computed(() => store.state._quote.productActivedID)
        const state = reactive({
            active: route.name,
            menuList: [
                {
                    title: t('route.home'),
                    href: '/home',
                    icon: 'icon_icon_home',
                },
                {
                    title: t('route.quote'),
                    href: '/quote',
                    icon: 'icon_icon_quotes',
                },
                {
                    title: t('route.trade'),
                    href: '/order',
                    icon: 'icon_jiaoyi1',
                },
                {
                    title: t('route.assets'),
                    href: '/assets',
                    icon: 'icon_zichan',
                },
                {
                    title: t('route.mine'),
                    href: '/mine',
                    icon: 'icon_icon_mine',
                },
            ]
        })
        watchEffect(() => (state.active = route.name))

        // 切换导航
        const menuHandler = (item) => {
            if (process.env.VUE_APP_h5Preview) {
                return false
            }
            let href = item.href
            if (href?.name === 'Order') {
                const [symbolId, tradeType] = symbolKey.value?.split('_')
                href = `/order?symbolId=${symbolId}&tradeType=${tradeType}`
            }
            router.push(href).catch(err => {
                state.active = route.path
            })
        }
        return {
            ...toRefs(state),
            menuHandler
        }
    },
    created () {
        console.log(this)
    },
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.footerMenu {
    background: var(--contentColor);
    &.h5Preview {
        padding-top: 140%;
        &::after {
            display: none;
        }
    }
    .van-tabbar-item--active {
        color: var(--primary);
        background: var(--contentColor);
    }
    .van-tabbar-item {
        color: var(--placeholdColor);
    }
    .imgIcon {
        opacity: 0.6;
        filter: grayscale(1);
    }
    .van-tabbar-item--active .imgIcon {
        opacity: 1;
        filter: grayscale(0);
    }
}
:deep(.van-tabbar-item__icon) {
    font-size: rem(46px);
}
:deep(.van-tabbar-item__text) {
    font-size: rem(20px);
}
.title {
    text-align: center;
}
</style>
