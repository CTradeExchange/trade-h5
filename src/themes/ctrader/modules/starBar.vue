<template>
    <div class='starBar'>
        <vueSelect v-model='productListType' :actions='productListTypes' close='取消' value='val' />
        <a class='icon' href='javascript:;'>
            <i class='icon_tianjia'></i>
        </a>
        <a class='icon' href='javascript:;'>
            <i class='icon_bianji'></i>
        </a>
    </div>
</template>

<script>
import vueSelect from '@ct/components/select'
export default {
    components: {
        vueSelect,
    },
    data () {
        return {
            productListType: 1,
            productListTypes: [
                { name: '最受欢迎的', val: 1 },
                { name: 'aaa', val: 2 },
                { name: '创建关注列表', val: 3 },
            ],
        }
    },
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.starBar {
    display: flex;
    align-items: center;
    padding: rem(10px) rem(40px) rem(10px) rem(20px);
    background: var(--white);
    .icon {
        margin-left: rem(40px);
        color: var(--mutedColor);
        font-size: rem(44px);
    }
}
</style>
