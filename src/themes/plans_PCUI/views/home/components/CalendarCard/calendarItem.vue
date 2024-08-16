<template>
    <el-row class='tr' @click='goToDetail'>
        <el-col class='col-time' :span='2'>
            <img v-if='activityId' class='cup' src='../../../../images/race-cup.png' @click.stop='$router.push(`/competition?id=${activityId}`)' />
            {{ formatTime() }}
        </el-col>
        <el-col :span='3'>
            <StarCom :number='important' />
        </el-col>
        <el-col class='col-important' :span='6'>
            <img
                :class="[
                    'country-icon',
                    'ceFlags',
                    info?.Currency?.toLowerCase(),
                ]"
            />
            <span class='info-title'>
                {{ info?.Title || '-' }}
            </span>
        </el-col>
        <el-col class='col-act col-center' :span='3'>
            {{ currentActual? fixedNumber(currentActual,info.Scale,info.Unit):fixedNumber(info.Actual,info.Scale,info.Unit) }}
        </el-col>
        <el-col class='col-fore col-center' :span='3'>
            {{ fixedNumber(info.Forecast,info.Scale,info.Unit) }}
        </el-col>
        <el-col class='col-fore col-center' :span='3'>
            {{ fixedNumber(info.Previous,info.Scale,info.Unit) }}
        </el-col>
        <el-col class='col-related col-center' :span='4' @click.stop='goToOrder(relatedDetail.symbolName,relatedDetail.symbolId)'>
            {{ relatedDetail.symbolName || '--' }}
        </el-col>
    </el-row>
</template>

<script>
import { reactive, computed, toRefs, watch } from 'vue'
import dayjs from 'dayjs'
import { isEmpty, fixedNumber, getProductList } from '@/utils/util'
import { useI18n } from 'vue-i18n'
import StarCom from '@planspc/components/starCom.vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { last } from 'lodash'

export default {
    components: { StarCom },
    props: {
        data: {
            type: Object,
            default: () => {
                return {}
            }
        },

    },
    setup (props) {
        const { t } = useI18n({ useScope: 'global' })
        const router = useRouter()
        const store = useStore()
        const state = reactive({
            fixedNumber,
            productList: [],
            productKeys: [],
            currentActual: ''
        })
        const activityId = last(props.data.TActivitySetting)?.ID
        const getDescObj = (desc) => {
            if (!desc) {
                return {}
            }

            return JSON.parse(desc)
        }

        const newsMessage = computed(() => store.state._user.newsMessage)

        const updateData = (obj) => {
            if (isEmpty(obj)) return
            const { type, data } = obj || {}
            const { Description, ItemID } = data || {}
            if (type === 'update') {
                if (Number(ItemID) !== Number(info.value.ItemID)) return
                const description = getDescObj(Description)
                const { Actual } = description || {}
                state.currentActual = Actual
            }
        }

        const info = computed(() => {
            try {
                const { ItemLanguages, Trades } = props.data || {}
                const { Description, Title, PublishTime, ItemID, ID } = !isEmpty(ItemLanguages) ? ItemLanguages[0] : {}
                const parseDesc = Description && JSON.parse(Description)
                const { Important, Forecast, Actual, Previous, Scale, Currency, Unit } = parseDesc || {}

                return { Trades, Title, PublishTime, ItemID, Important, Forecast, Actual, Previous, Scale, Currency, Unit, ID, }
            } catch (e) {
                return {}
            }
        })

        const important = computed(() => {
            return Number(info.value?.Important)
        })

        const relatedDetail = computed(() => {
            if (!props.data.Trades?.length) return {}
            try {
                const details = props.data.Trades.map(item => {
                    const symbolId = JSON.parse(item.Extra)?.SymbolId
                    const product = store.state._quote.productMap?.[symbolId + '_' + 2] || null
                    return product
                }).filter(Boolean)
                return details?.[0] || {}
            } catch (e) {
                console.log('🚀 ~ file: calendarItem.vue:116 ~ relatedDetail ~ e:', e)
                return {}
            }
        })

        const isHoliDay = (e) => {
            return Number(e) === 0
        }

        const formatTime = () => {
            const { Important, PublishTime } = info.value || {}
            if (isHoliDay(Important)) {
                return t('news.allDay')
            }
            if (!PublishTime) return '-'
            return dayjs(PublishTime * 1000).format('HH:mm')
        }

        const goToOrder = (name, id) => {
            if (name && id) {
                router.push(`/order?name=${name}&symbolId=${id}&tradeType=2`)
            }
        }

        const goToDetail = () => {
            router.push({
                path: '/economicCalendar',
                query: { id: info.value.ItemID }
            })
        }

        watch([() => newsMessage.value, () => info.value], (n) => {
            if (isEmpty(info.value)) return
            updateData(newsMessage.value)
        }, { immediate: true, deep: true })

        return {
            isEmpty,
            goToDetail,
            goToOrder,
            relatedDetail,
            fixedNumber,
            important,
            formatTime,
            info,
            activityId,
            ...toRefs(state)
        }
    }

}
</script>

<style scoped lang="scss">
@import "@/sass/mixin.scss";
@import "@/sass/country_currency.scss";
.list-item{
    display:flex;
    height: 64px;
    align-items: center;
    justify-content: space-between;
    padding:0 15px;
    cursor: pointer;
    .item-left,.item-right{
        display: flex;
        align-items: center;
    }
    .time{
        width:120px;
        color:var(--color5);
        font-size:24px;
        font-weight: bold;
    }
    .important{
        width:175px;
    }
    .event{
        display: flex;
        align-items: center;
        flex:1;
        font-size: 22px;
        color:var(--mainColor);

        max-width:600px;
        padding-right: 30px;
        .info-title{
            @include ellipsisLn(2);
            flex:1;
            margin-left: 15px;

        }
    }
    .actual{
        width:150px;
        font-size: 22px;
        color:var(--mainColor);
        text-align: center;
    }
    .forecast{
        font-size: 22px;
        color:#556681;
        width:150px;
        text-align: center;
    }
    .previous{
        font-size: 22px;
        color:#556681;
        width:150px;
        text-align: center;

    }
    .related{
        text-align: right;
        width:220px;
        color:var(--primary);
        font-size: 22px;
    }

}

.tr{
    height: 64px;
    align-items: center;
    padding: 0 15px;
    font-size: 22px;
    cursor: pointer;
    .col-time{
        color:var(--colorCalendar);
        font-size: 22px;
        display: flex;
        align-items: center;
        padding-left: 16px;
        position: relative;
        & > img {
            width: 26px;
            height: 26px;
            position: absolute;
            left: -14px;
        }
    }
    .col-important{
        display: flex;
        align-items: center
    }
    .info-title{
        @include ellipsisLn(2);
        flex:1;
        margin:0 15px;
        line-height:1.2;
        font-size: 20px;
    }
    .col-center{
        text-align: center;
    }
    .col-act{

    }
    .col-fore{
        color:var(--colorCalendar);
    }
    .col-related{
        color:var(--primary)
    }
}
</style>
