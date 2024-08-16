<template>
    <nav v-if='isPC' class='crume'>
        <div
            v-for='(item, index) in list'
            :key='index'
            class='item'
        >
            <div v-if='index > 0' class='icon-arrow'>
                <van-icon name='arrow' size='14' />
            </div>
            <router-link
                v-if='index !== list.length - 1'
                :to='item.value'
            >
                {{ item.name }}
            </router-link>
            <a v-else class='active'>
                {{ item.name }}
            </a>
        </div>
    </nav>
</template>

<script>
// 面包屑组件
export default {
    props: {
        // 导航列表
        list: {
            type: Array,
            default: () => []
        }
    },
    setup () {
        return {
            isPC: window.isPC
        }
    }
}
</script>

<style lang="scss" scoped>
.crume {
    display: flex;
    align-items: center;
    .item {
        display: flex;
        align-items: center;
        .icon-arrow {
            margin: 0 8px;
        }
        a {
            font-size: 16px;
            cursor: pointer;
            color: var(--normalColor);
            &:hover,
            &.active {
                color: var(--color);
            }
            &.active {
                cursor: default;
                font-weight: bold;
            }
            @media screen and (max-width: 768px) {
                font-size: rem(27px);
            }
        }
    }
}
</style>
