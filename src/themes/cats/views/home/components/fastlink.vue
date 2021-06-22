<template>
    <div>
        <div class='m-fastlink '>
            <div class='m-fastlink_content'>
                <a
                    v-for='item in list'
                    :key='item.img'
                    class='m-fastlink_content_item'
                    href='javascript:void(0)'
                    @click='openUrl(item.href, item.title)'
                >
                    <img alt='' :src='item.img' />
                    <div>{{ item.title }}</div>
                </a>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    setup () {
        const list = [
            {
                img: 'https://img.yienecom.com/upload/%E9%A6%96%E9%A1%B5-%E4%BA%A4%E6%98%93%E5%AD%A6%E9%99%A242x42-2.png',
                href: 'https://m.zhixuan6868.com/lp295A_v3.html?app=ix_app_orig&menu-button=lp295A',
                title: '行情推荐',
            },
            {
                img: 'https://img.yienecom.com/upload/%E9%A6%96%E9%A1%B5-%E5%B8%B8%E8%A7%81%E9%97%AE%E7%AD%9442x42-3.png',
                href: 'https://m.zhixuan6868.com/helpcenter.html?h5=y',
                title: '常见问答',
            },
            {
                img: 'https://img-pc.bbyou.net/images/%E9%A6%96%E9%A1%B5-%E8%B4%A2%E7%BB%8F%E6%97%A5%E5%8E%8642x42-1.png',
                href: 'https://www.zhixuan6868.com/03-App-lp/H5TradeInfo.html?app=ix_app_orig&inIframe=y',
                title: '关于智选',
            },
            {
                img: 'https://img.yienecom.com/upload/%E6%88%91%E7%9A%84-%E5%9C%A8%E7%BA%BF%E5%AE%A2%E6%9C%8D_42X42.png',
                href: 'https://cs.zhixuan6868.com:8188/?company_id=14&chat_type=1&uagent=1000&lang=zh-cn&lastPageDesc=h5%E5%85%AC%E7%89%88&account_no=&reffer=',
                title: '联系客服',
            },
        ]
        return {
            list,
        }
    }
}
</script>

<style lang="scss" scoped>
@import '~@/sass/mixin.scss';
.m- {
    &fastlink_content {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        padding: rem(20px) rem(50px);
        font-size: 0;
    }
    &fastlink_content_item {
        color: var(--color);
        font-size: rem(25px);
        text-align: center;
        img {
            padding-bottom: 5px;
        }
    }
}

</style>
