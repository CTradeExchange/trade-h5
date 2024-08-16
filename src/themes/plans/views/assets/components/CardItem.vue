<template>
    <div v-if='filterList && filterList.length > 0' class='itemBody'>
        <div v-for='(item, index) in filterList' :key='index' class='listBox'>
            <div style='display: flex;align-items: center;'>
                <CurrencyIcon :currency='item.currency' :size='32' />
                <div class='leftBox'>
                    <span>{{ item.currency }}</span>
                    <span class='amount'>
                        ${{ item.usdRate }}
                    </span>
                </div>
            </div>
            <div class='rightBox'>
                <p v-if='showAmout' class='num'>
                    {{ item.available }}
                </p>
                <p v-else>
                    ******
                </p>
                <p v-if='showAmout' class='amount'>
                    ${{ item.usd }}
                </p>
                <p v-else>
                    ******
                </p>
            </div>
        </div>
    </div>
    <div v-if='!filterList' class='emptyBox'>
        <van-empty :description='$t("common.noData")' image='/images/empty.png' />
    </div>
</template>

<script>
import CurrencyIcon from '@/components/currencyIcon'
import { computed, reactive, toRefs, watch } from 'vue'
import { mul, toFixed } from '@/utils/calculation'
import { isDemoAccount, addThousandthSign } from '@/utils/util'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
export default {
    components: {
        CurrencyIcon
    },
    props: {
        showAmout: {
            type: Boolean,
            default: false
        }
    },
    setup (props, { emit }) {
        const store = useStore()
        const { t } = useI18n({ useScope: 'global' })
        const rateConfigList = computed(() => store.state._base.rateConfigList)
        const accountMap = computed(() => store.state._user.customerInfo?.accountMap)
        const { value: newsSysConfig } = computed(() => store.state._base.newsSysConfig)
        const state = reactive({
            actions: [{
                text: t('wallet.desposit'),
                value: 'toDesposit'
            }, {
                text: t('wallet.withdraw'),
                value: 'toWirhdraw'
            }, {
                text: t('wallet.transfer'),
                value: 'toTransfer'
            }],
            allList: [],
            lists: '',
            currency: null,
            assetsHide: false,
            searchText: '',
            isRealTran: !isDemoAccount()
        })
        const updateAssetsInfoCurrencyList = async () => {
            if (!rateConfigList.value || !accountMap.value) return
            const list = Object.values(accountMap.value) || []
            const data = list.map((item) => {
                const rateItem = rateConfigList.value.find((o) => o.sourceCurrency === item.currency)
                const usd = rateItem ? toFixed(mul(item.available, rateItem.rate), 2) : ''
                return { ...item, usd, usdRate: rateItem?.rate || 0 }
            })
            state.allList = data
            state.allList = handleScreenList()
            emit('callback', data)
            if (state.assetsHide) {
                const list = state.allList ? state.allList.filter((i) => Number(i.available) !== 0) : []
                state.lists = list
            } else {
                state.lists = state.allList
            }
        }

        const onSelect = (val) => {
            emit('jump', val.value, state.currency)
        }

        watch(() => state.assetsHide, (newVal) => {
            if (newVal) {
                const list = state.allList ? state.allList.filter((i) => Number(i.available) !== 0) : []
                state.lists = list
            } else {
                state.lists = state.allList
            }
        }
        )

        watch(() => state.searchText, (newVal) => {
            if (newVal) {
                const list = state.allList ? state.allList.filter((i) => i.currency.indexOf(newVal.toLocaleUpperCase()) > -1) : []
                state.lists = list
            } else {
                state.lists = state.allList
            }
        })

        const handleScreenList = () => {
            const arr = Object.assign([], state.allList)
            const { Value } = newsSysConfig.find(i => i.Key === 'sortCurrencyList') || {}
            const valArr = Value?.split(',').filter(i => i)
            const result = []
            arr.forEach(i => {
                const index = valArr.indexOf(i.currency)
                if (result.length > index && index !== -1) {
                    result.splice(index, 0, i)
                } else {
                    result.push(i)
                }
            })
            return result
        }

        const filterList = computed(() => {
            return state.lists?.filter(item => ['USDT', 'USDC', 'DAI'].includes(item.currency)) || []
        })

        watch([rateConfigList, accountMap], () => {
            updateAssetsInfoCurrencyList()
        }, {
            immediate: true
        })

        return {
            onSelect,
            addThousandthSign,
            filterList,
            ...toRefs(state)
        }
    }
}
</script>

<style lang="scss" scoped>
.itemBody {
    width: rem(750px);
    padding: rem(40px) rem(30px) rem(12px) rem(30px);
    background: var(--contentColor);
}
.titleBox {
    display: flex;
    justify-content: space-between;
    padding: rem(20px);
    font-size: rem(24px);
    background-color: var(--contentColor);
    border-bottom: 1px solid var(--lineColor);
    .searchBox {
        display: flex;
        width: rem(347px);
        height: rem(62px);
        background: var(--contentColor);
        border: 1px solid var(--lineColor);
        align-items: center;
        overflow: hidden;
        padding: 0 rem(10px);
        font-size: rem(26px);
        & > i {
            margin-right: rem(10px);
        }
        & > input {
            width: 100%;
        }
    }
}
.listBox {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height:rem(88px);
  margin-bottom: rem(48px);
  .leftBox{
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    color: var(--primaryText);
    font-size: rem(28px);
    font-family: Roboto;
    font-weight: 500;
    line-height: rem(48px);
    .amount{
      margin-top: rem(8px);
      color:var(--minorColor);
      font-size: rem(24px);
      line-height: rem(32px);
    }

  }
    & > div:nth-of-type(1) > img {
            width: rem(64px);
            height: rem(64px);
            margin-right: rem(16px);
    }
    .rightBox{
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      font-family: Roboto;
      .num{
        font-size: rem(28px);
        font-weight: 500;
        line-height: rem(40px);
      }
      .amount{
        margin-top: rem(4px);
        font-size: rem(24px);
        line-height: rem(40px);
        color:var(--minorColor);
      }

    }

}
.emptyBox {
    :deep(.van-empty__description) {
        font-size: rem(28px);
    }
}
</style>
