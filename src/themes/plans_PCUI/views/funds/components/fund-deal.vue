<template>
    <div class='fund-deal'>
        <!-- 选项卡 -->
        <!-- <el-tabs v-model='activeName'>
            <el-tab-pane :label="$t('fundInfo.buy')" name='apply'>
            </el-tab-pane>
            <el-tab-pane :label="$t('fundInfo.sell')" name='redeem'>
            </el-tab-pane>
            <el-tab-pane :label="$t('funds.cashDeal')" name='trade' />
        </el-tabs> -->
        <div class='deal-case'>
            <fundApply v-if="activeName === 'apply'" :fund='fund' />
            <fundRedeem v-if="activeName === 'redeem'" :fund='fund' />
        </div>
    </div>
</template>

<script setup>
import { ref, defineProps, inject } from 'vue'
import fundApply from './fund-apply.vue'
import fundRedeem from './fund-redeem.vue'

defineProps({
    fund: {
        type: Object,
        default: () => {}
    }
})
const dealAcitve = inject('dealAcitve')

// 当前选择选项卡 apply:申购 redeem:赎回 trade:现货买卖
const activeName = ref(dealAcitve.value || 'apply')
</script>

<style lang='scss' scoped>
.deal-case {
    width: 100%;
    padding: 32px;
    background-color: #fff;
    border-radius: 12px;
    box-shadow: 3px 3px 20px rgb(0 0 0 / 9%);
}
</style>
