<template>
    <div class='titleBox'>
        <p class='title'>
            {{ $t("wallet.wallet") }}
        </p>
        <van-checkbox
            v-model='assetsHide'
            checked-color='#ee0a24'
            icon-size='0.4rem'
        >
            {{ $t("wallet.hiddenZero") }}
        </van-checkbox>
    </div>
    <div v-if='lists && lists.length > 0' class='itemBody'>
        <div>
            <div>{{ $t("wallet.name") }}</div>
            <div>{{ $t("wallet.available") }}</div>
            <div>{{ $t("wallet.more") }}</div>
        </div>
        <div v-for='(item, index) in lists' :key='index' class='listBox'>
            <div>
                <CurrencyIcon :currency='item.currency' :size='24' />
                <span>{{ item.currency }}</span>
            </div>
            <div>
                <p>{{ item.available }}</p>
                <p>${{ item.usd }}</p>
            </div>
            <div v-if='isRealTran'>
                <van-popover
                    v-model:show='item.show'
                    :actions='actions'
                    placement='bottom-end'
                    @select='onSelect'
                >
                    <template #reference>
                        <van-icon
                            name='ellipsis'
                            size='20'
                            @click='currency = item.currency;accountId=item.accountId'
                        />
                    </template>
                </van-popover>
            </div>
            <div v-else>
                --
            </div>
        </div>
    </div>
    <div v-if='isEmpty(lists)' class='emptyBox'>
        <van-empty
            :description="$t('common.noData')"
            image='/images/empty.png'
        />
    </div>
</template>

<script>
import CurrencyIcon from '@/components/currencyIcon'
import { computed, reactive, toRefs, watch } from 'vue'
import { mul, toFixed } from '@/utils/calculation'
import { isDemoAccount, isEmpty } from '@/utils/util'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
export default {
    components: {
        CurrencyIcon
    },
    setup (props, { emit }) {
        const store = useStore()
        const { t } = useI18n({ useScope: 'global' })
        const state = reactive({
            actions: computed(() => {
                return !isDemoAccount()
                    ? [
                        {
                            text: t('wallet.desposit'),
                            value: 'toDesposit'
                        },
                        {
                            text: t('wallet.withdraw'),
                            value: 'toWirhdraw'
                        },
                        {
                            text: t('wallet.transfer'),
                            value: 'toTransfer'
                        }
                    ]
                    : [
                        {
                            text: t('wallet.transfer'),
                            value: 'toTransfer'
                        }
                    ]
            }),
            allList: [],
            lists: '',
            accountId: '',
            currency: null,
            assetsHide: false,
            isEmpty
        })

        const isRealTran = computed(() => !isDemoAccount())
        const accountMap = computed(() => store.state._user.customerInfo?.accountMap)
        const rateConfigList = computed(() => store.state._base.rateConfigList)

        const updateAssetsInfoCurrencyList = async () => {
            if (!rateConfigList.value || !accountMap.value) return
            const list = Object.values(accountMap.value) || []
            const data = list.map((item) => {
                const rateItem = rateConfigList.value.find((o) => o.sourceCurrency === item.currency)
                const usd = rateItem ? toFixed(mul(item.available, rateItem.rate), 2) : ''
                return { ...item, usd }
            })
            state.allList = data
            emit('callback', data)
            if (state.assetsHide) {
                const list = state.allList
                    ? state.allList.filter((i) => Number(i.available) !== 0)
                    : []
                state.lists = list
            } else {
                state.lists = state.allList
            }
        }

        const onSelect = (val) => {
            emit('jump', val.value, { currency: state.currency, accountId: state.currency })
        }

        watch(
            () => state.assetsHide,
            (newVal) => {
                if (newVal) {
                    const list = state.allList
                        ? state.allList.filter((i) => Number(i.available) !== 0)
                        : []
                    state.lists = list
                } else {
                    state.lists = state.allList
                }
            }
        )

        watch([rateConfigList, accountMap], () => {
            updateAssetsInfoCurrencyList()
        }, {
            immediate: true
        })

        return {
            isRealTran,
            onSelect,
            ...toRefs(state)
        }
    }
}
</script>

<style lang="scss" scoped>
.itemBody {
    background: var(--contentColor);
    margin-bottom: 20px;
    & > div {
        height: 100px;
        display: flex;
        border-bottom: 0.5px solid var(--lineColor);
        &:first-of-type {
            align-items: flex-end;
            height: 50px;
            font-size: 14px;
            color: var(--placeholdColor);
            border-bottom: none;
        }
        & > div:nth-of-type(1) {
            flex: 2;
            padding-left: 30px;
        }
        & > div:nth-of-type(2) {
            flex: 1;
        }
        & > div:nth-of-type(3) {
            flex: 1;
            text-align: right;
            padding-right: 30px;
            cursor: pointer;
        }
    }
}
.titleBox {
    display: flex;
    justify-content: space-between;
    margin-top: 30px;
    border-top: 1px solid var(--cardBg);
    padding: 20px 0;
    .title {
        font-size: 16px;
        color: var(--primaryText);
    }
}
.listBox {
    padding-top: 20px;
    &:last-of-type {
        border-bottom: none;
    }
    & > div:nth-of-type(1) {
        display: flex;
        line-height: 20px;
        font-size: 14px;
        color: var(--primaryText);
        & > img {
            width: 20px;
            height: 20px;
            margin-right: 10px;
        }
    }
    & > div:nth-of-type(2) {
        font-size: 12px;
        color: var(--placeholdColor);
        & > p:first-of-type {
            font-size: 14px;
            color: var(--primaryText);
            font-weight: bold;
        }
    }
}
.emptyBox {
    :deep(.van-empty__description) {
        font-size: 14px;
    }
}
</style>
