<template>
    <div class='left-side'>
        <div class='left-menus'>
            <div v-for='(item, i) in menuList' :key='i' class='menu-item'>
                <div class='menu-link' :class="[currentPath===item.href && 'active']" @click='goToPage(item.href)'>
                    <img class='menu-icon' :src='currentPath===item.href?item.activeIcon:item.icon' />
                    <div>{{ item.title }}</div>
                </div>
            </div>
        </div>
        <!-- <SwitchMode /> -->
    </div>
</template>

<script>
import { reactive, toRefs, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import {
    homeIcon,
    homeActIcon,
    quoteIcon,
    quoteActIcon,
    transactionIcon,
    transactionActIcon,
    walletIcon,
    walletActIcon,
    platformsIcon,
    platformsActIcon,
    moneyIcon
} from '../images/leftMenu'
import SwitchMode from './switch-mode.vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
    components: { SwitchMode },
    setup (props, { emit }) {
        const router = useRouter()
        const store = useStore()
        const { t } = useI18n({ useScope: 'global' })
        const state = reactive({
            moneyIcon,
            menuList: [
                {
                    title: t('route.home'),
                    href: '/home',
                    icon: homeIcon,
                    activeIcon: homeActIcon
                },
                {
                    title: t('route.quote'),
                    href: '/quote',
                    icon: quoteIcon,
                    activeIcon: quoteActIcon
                },
                {
                    title: t('route.trade'),
                    href: '/order',
                    icon: transactionIcon,
                    activeIcon: transactionActIcon
                },
                {
                    title: t('route.assets'),
                    href: '/assets',
                    icon: walletIcon,
                    activeIcon: walletActIcon
                },
                {
                    title: t('informationTable.row2'),
                    href: '/download',
                    icon: platformsIcon,
                    activeIcon: platformsActIcon
                }
            ],
            currentPath: ''
        })

        const symbolKey = computed(() => store.state._quote.productActivedID)

        const goToPage = (url) => {
            let href = url
            if (url === '/order') {
                const [symbolId, tradeType] = symbolKey.value?.split('_') || []
                href = `/order?symbolId=${symbolId || ''}&tradeType=${tradeType || ''}`
            }
            router.push(href)
        }

        watch(() => router.currentRoute.value, (n) => {
            const { path } = n || {}
            state.currentPath = path
        }, { immediate: true })

        return {
            goToPage,
            ...toRefs(state)
        }
    }
}
</script>

<style lang="scss" scoped>
.left-side {
    position: sticky;
    top:0;
    width: 100px;
    background: var(--color3c);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    min-height: 100vh;
    z-index: 100;
    padding: 30px 0;
    .left-menus {
        display: flex;
        flex-direction: column;

        align-items: center;
        .menu-item {
            margin-bottom: 45px;
            .menu-link {
                color: var(--White);
                font-size: 12px;
                display: flex;
                flex-direction: column;
                align-items: center;
                cursor: pointer;
                &.active{
                    color: var(--primary);
                    font-weight: bold;
                }
                .menu-icon {
                    width: 40px;
                    height: 40px;
                }
            }
        }
    }
}
</style>
