<template>
    <div class='totalAssets'>
        <!-- v-if='assetsInfo && assetsInfo.totalBalance>0' -->
        <div class='totalAssetsBlock'>
            <div class='totalAssetsInfo'>
                <p class='label'>
                    <span> {{ $t('trade.asset') }}({{ assetsInfo.currency }}) </span>
                    <span class='tag'>
                        <i
                            class='icon_zijinmingxi2
'
                        ></i>
                    </span>
                </p>
            </div>
        </div>
        <ul class='assetList'>
            <li class='item'>
                <p class='muted'>
                    {{ $t('trade.freeMargin') }}
                </p>
                <p>{{ userAccount?.availableMargin || '--' }} </p>
            </li>
            <li class='item'>
                <p class='muted'>
                    {{ $t('trade.allOriginalMargin') }}
                </p>
                <p>{{userAccount?.occupyMargin || '--'}}</p>
            </li>
        </ul>

        <div class='btns'>
            <van-button
                hairline
                size='mini'
                url='/desposit'
            >
                {{ $t('trade.desposit') }}
            </van-button>
            <van-button
                hairline
                size='mini'
                url='/withdraw'
            >
                {{ $t('trade.withdraw') }}
            </van-button>
        </div>
    </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
export default {
    components: {
    },
    setup () {
        const store = useStore()
        const assetsInfo = computed(() => store.state._user.assetsInfo)
        const userAccount = computed(() => store.state._user.accountAssets[1])
        store.dispatch('_user/queryCustomerAssetsInfo', { tradeType: 3 })
        return {
            assetsInfo,
            userAccount
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.totalAssets {
    padding: rem(30px);
    background: var(--contentColor);
    border-radius: 4px;
}
.totalAssetsBlock {
    margin-bottom: rem(60px);
}
.totalAssetsInfo {
    font-size: rem(28px);
    .label {
        display: flex;
        justify-content: space-between;
        margin-top: rem(20px);
        color: var(--minorColor);
        font-size: rem(28px);
        .tag {
            width: rem(35px);
            color: var(--color);
        }
    }
    .totalAmount {
        margin-top: rem(10px);
        color: var(--color);
        font-size: rem(50px);
    }
}
.assetList {
    display: flex;
    flex-flow: row wrap;
    grid-template-columns: auto auto auto;
    align-content: flex-start;
    justify-content: space-around;
    font-size: rem(34px);
    line-height: 1.5;
    .item {
        flex: 50% 1;
        margin-bottom: rem(30px);
    }
    .muted {
        font-size: rem(24px);
    }
}
.btns {
    display: flex;
    justify-content: space-between;
    .van-button {
        display: block;
        width: 47%;
        height: rem(60px);
        color: var(--primary);
        font-size: rem(24px);
        line-height: rem(60px);
        background: var(--primaryAssistColor);
        border-color: var(--primaryAssistColor);
        border-radius: rem(6px);
    }
}
</style>
