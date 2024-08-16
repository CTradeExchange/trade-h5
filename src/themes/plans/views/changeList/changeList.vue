<template>
    <layoutTop :title='$t("record.records")' />
    <van-tabs v-model:active='modelActive' class='tabs'>
        <van-tab v-for='item in allList' :key='item.name' :name='item.name' :title='item.title'>
            <div class='content'>
                <component :is='item.component' :ref='el => { el && (childs[item.name]=el)}' :is-show='false' :name='item.name' />
            </div>
        </van-tab>
    </van-tabs>
</template>

<script>
import { reactive, toRefs, ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'

import PositionList from '../../../../themeCommon/user/deposit/depositRecord.vue'
import WithdrawRecord from '../../../../themeCommon/user/withdraw/withdrawRecord.vue'
import TransferList from '../../views/record/components/transferList.vue'

export default {
    setup () {
        const state = reactive({
            modelActive: 1,
            tradeType: '',
            accountId: ''
        })
        const childs = ref({})
        const router = useRouter()
        const route = useRoute()
        const { t } = useI18n({ useScope: 'global' })
        const allList = [
            {
                name: 1,
                title: t('wallet.desposit'),
                component: PositionList
            },
            {
                name: 2,
                title: t('wallet.withdraw'),
                component: WithdrawRecord
            },
            // {
            //     name: 3,
            //     title: t('wallet.transfer'),
            //     component: TransferList
            // },

        ]
        const toRecord = () => {
            router.push({
                path: '/capitalList',
                query: {
                    tradeType: state.tradeType,
                }
            })
        }
        onMounted(() => {
            const { accountId, tradeType } = route.query || {}
            state.tradeType = Number(tradeType)
            state.accountId = Number(accountId)
        })
        return {
          ...toRefs(state),
          allList,
          childs,
          toRecord
        }
    }

}

</script>

<style lang="scss" scoped>
@import "@/sass/mixin.scss";

.content{
  height: calc(100% - rem(334px));
  background: var(--contentColor);
  overflow-y:auto;
  :deep(.page-wrap){
    background-color: var(--contentColor);
    height: calc(100% - rem(96px));
  }
  :deep(.filter-wrap){
    width: 100%;
    position: sticky;
    top: 0;
    z-index: 99;
    background: var(--bgColor);

  }
  :deep(.van-dropdown-menu__bar){
      width:rem(360px);
    }
  :deep(.van-cell .van-cell__title){
    color: var(--mainColor);
    font-size: rem(28px);
  }
  :deep(.van-dropdown-item__option--active .van-cell__title){
    color: var(--primary) !important;
  }
}
</style>
