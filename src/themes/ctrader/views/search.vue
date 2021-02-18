<template>
    <div class='search'>
        <Top back>{{ $route.meta.title }}</Top>
        <van-search v-model='keywords' placeholder='寻找交易品种' />
        <ul class='productList'>
            <li class='item'>
                <div class='titleBar'>
                    <i class='icon icon_you'></i>
                    <span class='title'>Metals</span>
                </div>
                <div class='subList'>
                    <div v-for='item in list' :key='item' class='subItem' @click='onClick(item)'>
                        <i class='icon' :class="[item.collected?'icon_yishoucang':'icon_shoucang']" @click.stop='item.collected=!item.collected'></i>
                        <p class='name'>{{ item.name }}</p>
                        <p class='desc'>{{ item.desc }}</p>
                    </div>
                </div>
            </li>
        </ul>
        <a class='fastOrder' href='javascript:;' @click='$router.back()'>
            <i class='icon_gou'></i>
        </a>
    </div>
</template>

<script>
import Top from '@ct/layout/top'
export default {
    components: {
        Top
    },
    data () {
        return {
            keywords: '',
            collected: false,
            list: new Array(10).fill('').map(el =>
                (
                    {
                        collected: false,
                        name: 'XAGEUR',
                        desc: 'Silver vs Euro',
                    }
                )
            )
        }
    },
    methods: {
        onClick (item) {
            console.log(item)
            this.$router.push({ name: 'ProductDetail', params: { id: '1' } })
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.search {
    display: flex;
    flex-flow: column;
    height: 100%;
    background: var(--bgColor);
    .van-search {
        background: none;
    }
    .productList {
        flex: 1;
        overflow: auto;
    }
    :deep(.van-search__content) {
        background: var(--white);
    }
    .icon_yishoucang {
        color: var(--primary);
    }
}
.productList {
    margin-top: rem(30px);
    .item {
        margin-bottom: rem(40px);
    }
    .titleBar {
        padding: 0 rem(40px);
        font-size: rem(32px);
        .icon {
            display: inline-block;
            width: rem(100px);
            font-size: rem(38px);
        }
    }
    .subList {
        margin-left: rem(140px);
        padding-top: rem(30px);
    }
    .subItem {
        position: relative;
        padding: 0 0 rem(40px) rem(60px);
        font-size: rem(30px);
        line-height: 1.4;
        .desc {
            color: var(--mutedColor);
            font-size: rem(24px);
        }
        .icon {
            position: absolute;
            top: 0;
            left: 0;
            font-size: rem(38px);
        }
    }
}
.fastOrder {
    position: absolute;
    right: rem(30px);
    bottom: rem(60px);
    width: rem(120px);
    height: rem(120px);
    color: var(--white);
    font-size: rem(66px);
    line-height: rem(120px);
    text-align: center;
    background: var(--primary);
    border-radius: 100%;
}
</style>
