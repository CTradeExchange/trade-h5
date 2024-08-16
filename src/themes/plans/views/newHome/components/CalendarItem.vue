<template>
    <div class='list-item' @click='goToDetail'>
        <div class='item-left'>
            <div class='format-time'>
                {{ formatTime(item) }}
            </div>
            <StarCom :number='Number(detail.Important)' />
            <div v-if='activityId' class='cup-box' @click.stop='$router.push(`/competition?id=${activityId}`)'>
                <img class='cup' src='../../../images/competition/cup.png' />
            </div>
        </div>
        <div class='item-right'>
            <div class='item-title'>
                {{ detail.Title }}
            </div>
            <div class='item-content'>
                <img
                    :class="[
                        'country-icon',
                        'ceFlags',
                        countryCode?.toLowerCase(),
                    ]"
                />
                <div class='item-main'>
                    <div>
                        <span>{{ $t("news.actualShort") }}:</span>
                        <span>{{ currentActual? fixedNumber(currentActual,detail.Scale,detail.Unit):fixedNumber(detail.Actual,detail.Scale,detail.Unit) }}</span>
                        <!-- <span>{{ `${detail.Actual}${detail.Scale}` || "-" }}</span> -->
                    </div>
                    <div>
                        <span>{{ $t("news.forecastShort") }}:</span>
                        <span>{{ fixedNumber(detail.Forecast,detail.Scale,detail.Unit) }}</span>
                        <!-- <span>{{ `${detail.Forecast}${detail.Scale}` || "-" }}</span> -->
                    </div>
                    <div>
                        <span>{{ $t("news.previousShort") }}:</span>
                        <span>{{ fixedNumber(detail.Previous,detail.Scale,detail.Unit) }}</span>
                        <!-- <span>{{ `${detail.Previous}${detail.Scale}` || "-" }}</span> -->
                    </div>
                </div>
            </div>
            <!-- <TradeBtn :trades="trades" position="item" /> -->
            <ProductList ref='productListEl' :trades='trades' />
        </div>
    </div>
</template>

<script>
import {
    reactive,
    computed,
    toRefs,
    watch
} from 'vue'
import { isEmpty, fixedNumber } from '@/utils/util'
import StarCom from './StarCom'
import { useRouter } from 'vue-router'
import ProductList from './ProList/productList.vue'
import { useI18n } from 'vue-i18n'
import dayjs from 'dayjs'
import { useStore } from 'vuex'
export default {
    components: { StarCom, ProductList },
    props: {
        item: {
            type: Object,
            default: () => {
                return {}
            }
        },
        countryCode: {
            type: String,
            default: ''
        },
        trades: {
            type: Array,
            default: () => {
                return []
            }
        },
        activityId: {
            type: [Number, String],
            default: ''
        }
    },

    setup (props) {
        const store = useStore()
        const router = useRouter()
        const { t } = useI18n({ useScope: 'global' })
        const state = reactive({
            currentActual: '',
            fixedNumber
        })

        const detail = computed(() => {
            try {
                const { PublishTime, Description, Title, ItemID, ID } = props.item || {}
                const descObj = Description && JSON.parse(Description)
                const { Actual, Forecast, Previous, Scale, Important, Unit } = descObj || {}
                return { Title, ItemID, Actual, Forecast, Previous, Scale, PublishTime, Important, Unit, ID }
            } catch {
                return {}
            }
        })

        const isHoliDay = (desc) => {
            try {
                const descObj = desc && JSON.parse(desc)
                const { Important } = descObj || {}
                return Number(Important) === 0
            } catch (error) {
                return false
            }
        }

        const formatTime = (item) => {
            const { PublishTime, Description } = item || {}

            if (isHoliDay(Description)) {
                return t('news.allDay')
            }
            return PublishTime ? dayjs(PublishTime * 1000).format('HH:mm') : '--'
        }

        const formatDesc = (desc, key, dValue = '-') => {
            if (isEmpty(desc)) return ''
            try {
                return JSON.parse(desc)[key] || dValue
            } catch (e) {
                return dValue
            }
        }

        const goToDetail = () => {
            router.push({
                path: '/economicCalendar',
                query: { id: props.item.ItemID }
            })
        }

        const getDescObj = (desc) => {
            if (!desc) {
                return {}
            }
            try {
                return JSON.parse(desc)
            } catch (e) {
                return {}
            }
        }

        const newsMessage = computed(() => store.state._user.newsMessage)

        const updateData = (obj) => {
            if (isEmpty(obj)) return
            const { type, data } = obj || {}
            const { Description, ItemID } = data || {}
            if (type === 'update') {
                if (Number(ItemID) !== Number(detail.value.ItemID)) return
                const description = getDescObj(Description)
                const { Actual } = description || {}
                state.currentActual = Actual
            }
        }

        watch([() => newsMessage.value, () => detail.value], (n) => {
            if (isEmpty(detail.value)) return
            updateData(newsMessage.value)
        }, { immediate: true, deep: true })

        return {
            detail,
            goToDetail,
            formatDesc,
            formatTime,
            ...toRefs(state)
        }
    }
}
</script>

<style lang="scss" scoped>
@import "@/sass/mixin.scss";
@import "@/sass/country_currency.scss";
.list-item {
    display: flex;
    padding: rem(30px) 0;
    //border-bottom: 1px solid var(--lineColor);
    .item-left {
        font-size: rem(30px);
        color: var(--color7a);
        padding-right: rem(40px);
        .format-time {
            margin-bottom: rem(24px);
        }
        .cup-box{
            margin-top:rem(24px);
            display: flex;
            align-items: center;
            justify-content: center;
            .cup{
                width: rem(48px);
                height:rem(48px);
            }
        }

    }
    .item-right {
        flex: 1;
        .item-title {
            @include ellipsisLn(2);
            font-size: rem(30px);
            //font-weight: bold;
            color: var(--mainColor);
            margin-bottom: rem(20px);
        }
        .item-content {
            display: flex;
            align-items: center;
            margin-bottom: rem(10px);
            .country-icon {
            }
            .item-main {
                flex: 1;
                padding: 0 rem(20px);
                display: flex;
                justify-content: space-between;

                & > div {
                    color: var(--mainColor);
                    flex:1;
                    & > span:nth-of-type(1) {
                        font-size: rem(24px);
                        color: var(--color80);
                        white-space: nowrap;
                    }
                    & > span:nth-of-type(2) {
                        font-size: rem(26px);
                        color: var(--mainColor);
                    }
                }
            }
        }
    }
}
</style>
