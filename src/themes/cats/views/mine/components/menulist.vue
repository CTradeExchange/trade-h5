<template>
    <div class='menulist'>
        <template v-for='(item,i) in menuData' :key='item.icon+i'>
            <van-cell v-if='item.role.includes(userAccountType)' :is-link='!!item.href' :title='item.title' @click='handlerMenu(item)'>
                <template #icon>
                    <img class='icon_icon' :src='item.icon' />
                </template>
            </van-cell>
        </template>
    </div>
</template>

<script>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
export default {
    setup () {
        const store = useStore()
        const router = useRouter()
        const userAccountType = computed(() => store.getters['_user/userAccountType'])
        const menuData = [
            {
                icon: 'https://img.yienecom.com/upload/%E8%B5%84%E9%87%91%E6%98%8E%E7%BB%86.jpg',
                title: '资金明细',
                href: '/fundLog',
                role: ['D', 'R_3', 'R_2', 'R_1'],
            },
            {
                icon: 'https://img.yienecom.com/upload/%E6%88%91%E7%9A%84_%E6%B6%88%E6%81%AF%E4%B8%AD%E5%BF%83%2042X42.png',
                title: '消息中心',
                href: '/msg',
                role: ['D', 'R_3', 'R_2', 'R_1'],
            },
            {
                icon: 'https://img.yienecom.com/upload/%E6%88%91%E7%9A%84_%E4%B8%AA%E4%BA%BA%E4%BF%A1%E6%81%AF%2042x42.png',
                title: '个人信息',
                href: '/personal',
                role: ['D', 'R_3', 'R_2', 'R_1'],
            },
            {
                icon: 'https://img.yienecom.com/upload/%E6%88%91%E7%9A%84_%E5%9C%A8%E7%BA%BF%E5%AE%A2%E6%9C%8D%2042x42.png',
                title: '在线客服',
                href: 'https://cs.zhixuan6868.com:8188/?company_id=14&chat_type=1&uagent=1000&lang=zh-cn&lastPageDesc=h5%E5%85%AC%E7%89%88&account_no=&reffer=',
                role: ['G', 'D', 'R_3', 'R_2', 'R_1'],
            },
            {
                icon: 'https://img.yienecom.com/upload/%E6%88%91%E7%9A%84_%E8%AE%BE%E7%BD%AE%2042x42.png',
                title: '设置',
                href: '/setting',
                role: ['G', 'D', 'R_3', 'R_2', 'R_1'],
            }
        ]
        // 点击菜单
        const handlerMenu = (item) => {
            const { href } = item
            if (href && href.startsWith('/')) {
                router.push(href)
            } else if (href && href.startsWith('http')) {
                router.push({ name: 'Otherpage', params: { type: 'page' }, query: { pageTitle: item.title, url: encodeURIComponent(href) } })
            }
        }
        return {
            userAccountType,
            menuData,
            handlerMenu,
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.menulist {
    margin-top: rem(20px);
}
.icon_icon {
    width: rem(40px);
    height: rem(40px);
    color: #477FD3;
    &::before {
        display: none;
        content: '';
    }
}
:deep() {
    .van-cell__title {
        margin-left: rem(28px);
        color: #333;
        font-size: rem(28px);
    }
    .van-cell__value {
        color: #999;
        font-size: rem(24px);
    }
}
</style>
