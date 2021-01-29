<template>
    <div>
        <listItem class='tradeItem' :title='title'>
            <span class='first'>日期</span>
            <span class='col'>类型</span>
            <span class='last'>金额</span>
        </listItem>
        <listItem v-for='item in list' :key='item' class='tradeItem' :title='title'>
            <span class='first'>
                2021-01-21 12:50
            </span>
            <span>
                存款
            </span>
            <div class='last'>
                11000.66
            </div>
        </listItem>
        <div class='tradeOverview'>
            <div class='col'>
                <p>存款</p>
                <p>1 000 .00</p>
            </div>
            <div class='col'>
                <p>取款</p>
                <p>10 .00</p>
            </div>
        </div>
    </div>
</template>

<script>
import listItem from '@ct/components/listItem'
export default {
    components: {
        listItem,
    },
    data () {
        return {
            title: [
                { name: '日期' },
                { name: '类型' },
                { name: '金额' },
            ],
            list: [...new Array(3)]
        }
    },
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.tradeItem {
    justify-content: space-between;
    text-align: left;
    .first {
        width: rem(220px);
    }
    .last {
        width: rem(120px);
    }
}
.iconArrow {
    font-size: 1.2em;
}
.tradeOverview {
    display: flex;
    margin: rem(40px) rem(22px);
    color: var(--mutedColor);
    font-size: rem(24px);
    line-height: 1.4;
    text-align: center;
    .col {
        flex: 1;
    }
}
</style>
