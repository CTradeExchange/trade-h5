<template>
    <div class='event-list'>
        <div class='tr'>
            <div class='left'>
                <div class='th'>
                    {{ $t("news.releaseDate") }}
                </div>
                <div class='th'>
                    {{ $t("common.time") }}
                </div>
            </div>
            <div class='right'>
                <div class='th'>
                    {{ $t("news.actualShort") }}
                </div>
                <div class='th'>
                    {{ $t("news.forecastShort") }}
                </div>
                <div class='th'>
                    {{ $t("news.previousShort") }}
                </div>
            </div>
        </div>
        <div v-for='(item, i) in list' :key='item.ID' class='tr'>
            <div class='left'>
                <div class='td'>
                    {{ formatTime(item.PublishTime * 1000) }}
                </div>
                <div class='td'>
                    {{ dayjs(item.PublishTime * 1000).format("HH:mm") }}
                </div>
            </div>

            <div class='right'>
                <div class='td' :class="[textColor(item,i,'Actual')]">
                    {{ fixedNumber(description(item).Actual,description(item).Scale,description(item).Unit) }}
                    <!-- {{ description(item).Actual? `${description(item).Actual}${description(item).Scale}`: "--" }} -->
                    <!-- {{ getDescKey(item.Description, "Actual") }} -->
                </div>
                <div class='td' :class="[textColor(item,i,'Forecast')]">
                    {{ fixedNumber(description(item).Forecast,description(item).Scale,description(item).Unit) }}
                    <!-- {{ description(item).Forecast? `${description(item).Forecast}${description(item).Scale}`: "--" }} -->
                </div>
                <div class='td' :class="[textColor(item,i,'Previous')]">
                    {{ fixedNumber(description(item).Previous,description(item).Scale,description(item).Unit) }}
                    <!-- {{ description(item).Previous? `${description(item).Previous}${description(item).Scale}`: "--" }} -->
                </div>
            </div>
        </div>
        <div v-if='more' class='view-more' @click="$emit('loadMore')">
            <span>{{ $t("news.more") }}</span>
            <img class='down-icon' :src='downIcon' />
        </div>
    </div>
</template>

<script>
import { toRefs, reactive, computed } from 'vue'
import { getCookie, fixedNumber } from '@/utils/util'
import downIcon from '@plans/images/down-gray.png'
import { useStore } from 'vuex'
import dayjs from 'dayjs'
export default {
    props: {
        list: {
            type: Array,
            default: () => {
                return []
            }
        },
        more: {
            type: Boolean,
            default: false
        }
    },
    setup (props, { emit }) {
        const state = reactive({
            dayjs,
            downIcon,
            fixedNumber
        })

        const description = computed(() => {
            return (item) => {
                const { Description } = item || {}
                const res = Description && JSON.parse(Description)
                return res || {}
            }
        })

        const textColor = computed(() => {
            return (item, i, key) => {
                const maxLen = props.list.length
                let className = ''
                if (i + 1 >= maxLen) {
                    className = ''
                    return className
                }
                const { Description } = item || {}
                const descObj = Description && JSON.parse(Description)
                const { Description: prevDesc } = props.list[i + 1] || {}
                const prevDescObj = prevDesc && JSON.parse(prevDesc)
                const n_Act = descObj[key] ? Number(descObj[key]) : 0
                const n_Prev_Act = prevDescObj[key] ? Number(prevDescObj[key]) : 0
                if (n_Act > n_Prev_Act) {
                    className = 'up'
                    // return store.state.style.fallColor || '#B72122'
                } else if (n_Act < n_Prev_Act) {
                    className = 'down'
                    // return store.state.style.riseColor || '#0062FF'
                } else {
                    className = ''
                }
                return className
            }
        })

        const getDescKey = (desc, key, defaultVal = '--') => {
            let obj = {}
            if (!desc) {
                obj = {}
            }
            obj = JSON.parse(desc)
            return obj[key] || defaultVal
        }

        const formatTime = (time) => {
            const lang = getCookie('lang') || 'en-US'
            const isChina = lang.indexOf('zh') > -1
            const month = Number(dayjs(time).format('M'))

            if (isChina) {
                let quarter = ''
                if (month < 4) {
                    quarter = '一'
                } else if (month > 3 && month < 7) {
                    quarter = '二'
                } else if (month > 6 && month < 10) {
                    quarter = '三'
                } else if (month > 9) {
                    quarter = '四'
                }
                const res = dayjs(time).format(
                    `YYYY年M月DD日(第${quarter}季度)`
                )
                return res
            } else {
                let quarter = ''
                if (month < 4) {
                    quarter = '1'
                } else if (month > 3 && month < 7) {
                    quarter = '2'
                } else if (month > 6 && month < 10) {
                    quarter = '3'
                } else if (month > 9) {
                    quarter = '4'
                }
                const res = dayjs(time).format(`YYYY-MM-DD(Q${quarter})`)
                return res
            }
        }

        return {
            textColor,
            description,
            formatTime,
            getDescKey,
            ...toRefs(state)
        }
    }
}
</script>

<style lang="scss" scoped>
@import "@/sass/mixin.scss";
.event-list {
    margin-top: rem(20px);
    .tr {
        height: rem(64px);
        display: flex;
        border-bottom: rem(2px) solid var(--colorddd);
        align-items: center;
        justify-content: space-between;
        text-align: center;
        .left {
            display: flex;
            align-items: center;
            justify-content: space-between;
            .th {
                font-size: rem(24px);
                &:nth-of-type(1) {
                    text-align: left;
                    width: rem(250px);
                }
                &:nth-of-type(2) {
                    width: rem(60px);
                }
            }
            .td {
                font-size: rem(20px);
                &:nth-of-type(1) {
                    text-align: left;
                    width: rem(250px);
                }
                &:nth-of-type(2) {
                    width: rem(60px);
                }
            }
        }
        .right {
            display: flex;
            align-items: center;
            justify-content: space-between;
            .th {
                font-size: rem(24px);

                &:nth-of-type(1) {
                    width: rem(100px);
                }
                &:nth-of-type(2) {
                    width: rem(100px);
                }
                &:nth-of-type(3) {
                    width: rem(100px);
                }
            }
            .td {
                position: relative;
                //@include ellipsis;
                &.up{
                    color:var(--fallColor)
                }
                &.down{
                    color:var(--riseColor)
                }
                font-size: rem(20px);
                &:nth-of-type(1) {
                    width: rem(100px);
                }
                &:nth-of-type(2) {
                    width: rem(100px);
                }
                &:nth-of-type(3) {
                    width: rem(100px);
                }
                // &:hover::after{
                //     position:absolute;
                //     content:'111';
                //     color:var(--mainColor);
                //     font-size: rem(28px);
                //     left:0;
                //     bottom:rem(30px);
                //     background: var(--color7a);
                //     padding: rem(10px);
                //     z-index: 99;
                // }
            }
        }
    }
    .view-more {
        display: flex;
        align-items: center;
        justify-content: center;
        height: rem(86px);
        width: 100%;
        font-size: rem(26px);
        color: var(--color7a);
        & > span {
            margin-right: rem(8px);
        }
        .down-icon {
            width: rem(13px);
            height: rem(8px);
        }
    }
}
</style>
