<template>
    <div>
        <van-popover
            v-model:show="show"
            :overlay="true"
            :overlay-style="{ background: 'transparent' }"
        >
            <div class="selectList" v-if="lists.length > 0">
                <div
                    v-for="(item, index) in lists"
                    :key="index"
                    @click="onSelect(item)"
                >
                    <span>{{ item?.usd }}</span>
                    <CurrencyIcon :currency="item?.currency" />
                    <span>{{ item?.currency }}</span>
                </div>
            </div>
            <template #reference>
                <div class="selectText">
                    <div @click.stop="handleSkip(true)">
                        <span>{{ items?.usd || "0.000000" }}</span>
                        <CurrencyIcon :currency="items?.currency || 'USDT'" />
                        <van-icon name="arrow-down" />
                    </div>
                    <div @click.stop="handleSkip()">
                        <img src="../images/wallet.png" />
                    </div>
                </div>
            </template>
        </van-popover>
    </div>
</template>

<script>
import CurrencyIcon from '@/components/currencyIcon'
import { computed, reactive, toRefs, watch } from 'vue'
import { mul, toFixed } from '@/utils/calculation'
import { isEmpty, localGet, localSet } from '@/utils/util'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { Toast } from 'vant'
export default {
    components: {
        CurrencyIcon
    },
    setup () {
        const store = useStore()
        const route = useRoute()
        const router = useRouter()
        const customerInfo = computed(() => store.state._user?.customerInfo)
        const rateConfigList = computed(() => store.state._base.rateConfigList)
        const accountMap = computed(
            () => store.state._user.customerInfo?.accountMap
        )

        const state = reactive({
            plansList: [],
            items: {},
            lists: [],
            show: false
        })

        const updateAssetsInfoCurrencyList = async () => {
            if (!rateConfigList.value || !accountMap.value) return
            const list = Object.values(accountMap.value) || []
            const data = list.map((item) => {
                const rateItem = rateConfigList.value.find(
                    (o) => o.sourceCurrency === item.currency
                )
                const usd = rateItem
                    ? toFixed(mul(item.available, rateItem.rate), 2)
                    : ''
                return { ...item, usd }
            })
            state.lists = data
            const currency = localGet('wlt')
            if (isEmpty(state.items)) {
                let res = null
                if (currency) {
                    res = data.find((i) => i.currency === currency)
                }
                if (!res && data.length) res = data[0]
                state.items = res
            }
        }

        watch(
            () => state.items,
            (val) => {
                if (!isEmpty(val) && val?.currency) {
                    localSet('wlt', val.currency)
                }
            },
            {
                immediate: true
            }
        )

        watch(
            [rateConfigList, accountMap],
            () => {
                updateAssetsInfoCurrencyList()
            },
            {
                immediate: true
            }
        )

        const onSelect = (val) => {
            state.items = val
            state.show = false
        }

        const handleSkip = (flag) => {
            if (!customerInfo.value?.customerNo) {
                router.push('/login')
            } else if (!flag && route.path === '/assets') {
                // Toast('已经在资产页面')
            } else if (!flag) {
                router.push('/assets')
            } else {
                state.show = !state.show
            }
        }

        return {
            onSelect,
            handleSkip,
            ...toRefs(state)
        }
    }
}
</script>

<style lang="scss" scope>
@import '~@/sass/mixin.scss';
.selectList {
    width: rem(400px);
    height: auto;
    max-height: rem(600px);
    overflow-y: auto;
    background: #fff;
    font-size: rem(28px);
    padding: rem(10px) 0;
    @include scroll-bar-vertical();
    & > div {
        width: 100%;
        height: rem(66px);
        padding: 0 rem(20px) 0 rem(30px);
        display: flex;
        align-items: center;
        cursor: pointer;
        & > span {
            flex: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            &:last-of-type {
                flex: none;
                width: rem(100px);
            }
        }
        & > img {
            width: rem(36px) !important;
            height: rem(36px) !important;
            margin: 0 rem(20px);
        }
    }
}
.selectText {
    width: 198px;
    height: 36px;
    display: flex;
    overflow: hidden;
    cursor: pointer;
    & > div:first-of-type {
        width: 160px;
        border: 1px solid #f0f0f0;
        border-right: none;
        padding: 0 12px;
        display: flex;
        align-items: center;
        font-size: 14px;
        color: var(--primaryText);
        border-radius: 6px 0 0 6px;
        & > span {
            flex: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        & > img {
            width: 17px !important;
            height: 17px !important;
            margin: 0 6px;
        }
    }
    & > div:last-of-type {
        width: 36px;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #BE1E2D;
        border-radius: 0 6px 6px 0;
        img {
            width: 17px;
            height: 17px;
        }
    }
}
</style>