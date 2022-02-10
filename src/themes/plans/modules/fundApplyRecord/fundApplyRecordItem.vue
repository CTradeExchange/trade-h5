<template>
    <div class='fundApplyRecordItem'>
        <p class='title'>
            申购  ARX 20 Fund
        </p>
        <ul class='infos'>
            <li class='item'>
                <span class='label'>
                    申购金额(USDT)
                </span>
                <span>200</span>
            </li>
            <li class='item'>
                <span class='label'>
                    净值(USDT)
                </span>
                <span>1.4</span>
            </li>
            <li class='item'>
                <span class='label'>
                    申购手续费(USDT)
                </span>
                <span>1.4</span>
            </li>
            <li class='item'>
                <span class='label'>
                    申购份额(ARX20)
                </span>
                <span>2</span>
            </li>
            <li class='item'>
                <span class='label'>
                    份额代币
                </span>
                <span>ARX20</span>
            </li>
            <li class='item'>
                <span class='label'>
                    份额确认状态
                </span>
                <span>已确认</span>
            </li>
            <li class='item'>
                <span class='label'>
                    2022-01-08 21:09:09
                </span>
            </li>
            <li class='item'>
                <span class='label'>
                    P355454654
                </span>
            </li>
        </ul>
    </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.fundApplyRecordItem{
    padding: rem(10px) 0;
    .title{
        font-size: rem(28px);
        line-height: 2;
    }
    .infos{
        line-height: rem(42px);
        display: grid;
        grid-column-gap: rem(20px);
        grid-template-columns: 1fr 1fr;
        font-size: rem(24px);
        .item{
            display: flex;
            justify-content: space-between;
        }
        .label{
            color: var(--minorColor);
        }
    }
}
</style>
