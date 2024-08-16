<template>
    <van-tabbar
        v-if='!isUniapp'
        v-model='active'
        :active-color='primaryColor'
        class='footerMenu'
        :class='{ h5Preview }'
        z-index='102'
    >
        <van-tabbar-item v-for='(item, i) in data.items' :key='item.href' :name='item.href.name' @click='menuHandler(item)'>
            <template #icon>
                <!-- <img
                    alt=''
                    class='imgIcon'
                    :src='getUrl(item, index)'
                /> -->
                <img

                    class='imgIcon'
                    :class='[{ "title_active": active === item.href.name }]'
                    :src='active === item.href.name?iconList[i].activeIcon:iconList[i].icon'
                />
            </template>
            <p v-if='item.title' :class='["title", { "title_active": active === item.href.name }]'>
                {{ item.title }}
            </p>
        </van-tabbar-item>
    </van-tabbar>
</template>

<script>
import { useRoute } from 'vue-router'
import Base from '@/store/modules/base'
import { homeIcon, homeActiveIcon, quoteIcon, quoteActiveIcon, tradeIcon, tradeActiveIcon, assetsIcon, assetsActiveIcon, myIcon, myActiveIcon } from '@plans/images/tabbar'
export default {
    props: {
        data: {
            type: Object,
            default: function () {
                return {}
            }
        },
    },
    data () {
        return {
            active: '',
            // 是否为app页面
            isUniapp: false,
            iconList: [
                {
                    icon: homeIcon,
                    activeIcon: homeActiveIcon
                },
                {
                    icon: quoteIcon,
                    activeIcon: quoteActiveIcon
                },
                {
                    icon: tradeIcon,
                    activeIcon: tradeActiveIcon
                },
                {
                    icon: assetsIcon,
                    activeIcon: assetsActiveIcon
                },
                {
                    icon: myIcon,
                    activeIcon: myActiveIcon
                },
            ]
        }
    },
    computed: {
        symbolKey () {
            return this.$store.state._quote.productActivedID
        },
        primaryColor () {
            return Base.state.wpCompanyInfo?.themeColor || ''
        }
    },
    created () {
        const route = useRoute()
        const { isUniapp } = route.query
        this.isUniapp = isUniapp
        if (!this.h5Preview) {
            this.active = this.$route.name
            this.$watch('$route.name', function (newval) {
                this.active = newval
            })
        }
    },

    methods: {
        menuHandler (item) {
            if (this.h5Preview) return false
            let href = item.href

            if (href?.name === 'Order') {
                const [symbolId, tradeType] = this.symbolKey?.split('_') || []
                href = `/order?symbolId=${symbolId || ''}&tradeType=${tradeType || ''}`
            }
            this.$router.push(href).catch(err => {
                this.active = this.$route.name
            })
        },
        getUrl (item, index) {
            const suffix = item.href.name === this.active ? 's' : ''
            return require(`../../../../assets/newUI/tab${suffix}_${index + 1}.png`)
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.footerMenu {
    padding-bottom: 10px;
    padding-top: 10px;

    @supports(-webkit-touch-callout:none) {
      padding-bottom: 14px;
      padding-top: 10px;
    }

    background: var(--contentColor);
    box-shadow: 0px 6px 8px rgba(0,0,0,0.3);
    &.h5Preview {
        position: relative;
        padding-top: 140%;
        &::after {
            display: none;
        }
    }
    .van-tabbar-item--active {
        color: var(--primary);
        //background: var(--primary);
    }
    .van-tabbar-item {
        color: var(--contentColor);
    }
    .imgIcon {
        height: 26px;
        opacity: 0.6;
        filter: grayscale(1);
    }
    .van-tabbar-item--active .imgIcon {
        opacity: 1;
        filter: grayscale(0);
    }
}
:deep(.van-tabbar-item__icon) {
    margin-bottom: 0;
    font-size: rem(46px);
}
:deep(.van-tabbar-item__text) {
    font-size: rem(20px);
    color: var(--placeholdColor);
}
.title {
    margin-top: 6px;
    text-align: center;
    font-size:12px;
}
.title_active {
    color: var(--primary);
}
</style>
