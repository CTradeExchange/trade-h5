<template>
    <div class='fullPageWrapper record'>
        <layoutTop>
            <p>{{ $t("record.records") }}</p>
        </layoutTop>
        <van-tabs v-model:active='liabilitiesType' class='tabs'>
            <van-tab :name='1' :title='$t("record.loanRecord")'>
                <div class='content'>
                    <loanList />
                </div>
            </van-tab>
            <van-tab :name='2' :title='$t("record.repaymentRecord")'>
                <div class='content'>
                    <repaymentList />
                </div>
            </van-tab>
        </van-tabs>
    </div>
</template>

<script>
import { ref } from 'vue'
import loanList from './components/loanList'
import repaymentList from './components/repaymentList'
export default {
    components: { loanList, repaymentList },
    setup () {
        const liabilitiesType = ref(1)
        return {
            liabilitiesType,
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.record {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    overflow: hidden;
    .tabs {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        :deep(.van-tabs__wrap) {
            flex: 0 0 44px;
        }
        :deep(.van-tabs__content) {
            height: 100%;
            overflow-y: auto;
        }
        :deep(.van-tab__text) {
            font-size: rem(28px);
        }
        :deep(.van-tabs__line) {
            width: 50%;
            background-color: var(--primary);
        }
    }
    .content {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        box-sizing: border-box;
        width: 100%;
        padding: rem(30px) rem(20px);
    }
}

</style>
