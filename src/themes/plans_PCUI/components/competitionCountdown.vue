<template>
    <div v-if='show' class='cup-bg' @click.stop="$emit('click')">
        <img :src='cupBg' />
        <div class='cup-content'>
            <div v-if='status===20 || status===10'>
                <CountDown :format='`DD ${$t("api.timeleftCell")} HH:mm:ss`' :time='getEndTime(data)' @finish='finish'>
                    <template #default='timeData'>
                        <span class='text-contentColor'>
                            {{ getTimeDataFormat(timeData,data) }}
                        </span>
                    </template>
                </CountDown>
            </div>
            <div v-else class='rest-round'>
                <span>{{ $t('competition.competitionIsOver') }}</span>
            </div>
            <div class='current-prize'>
                {{ status===20 || status===10 ? $t('competition.currentPrize',{ val:prize.toLocaleString() }) : $t('competition.totalPrize',{ val:prize.toLocaleString() }) }} USDT
            </div>
        </div>
    </div>
</template>

<script>
import { CountDown } from 'vant'
import { reactive, toRefs, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { isEmpty } from '@/utils/util'
import cupBg from '@planspc/views/competition/assets/cup-bg.png'
import { plus } from '@/utils/calculation'

export default {
    components: { CountDown },
    props: {
        data: {
            type: Object,
            default: () => {}
        },
    },
    setup (props, { emit }) {
        const { t } = useI18n({ useScope: 'global' })
        const state = reactive({
            prize: 0,
            endStatus: false,
            startStatus: false,
            status: null,
            show: false
        })

        const getEndTime = (item) => {
            const { EndTime, StartTime } = item || {}
            if (state.status === 10) {
                return StartTime - new Date().getTime()
            } else {
                return EndTime - new Date().getTime()
            }
        }

        const getTimeDataFormat = (timeData, item) => {
            const { days, hours, minutes, seconds } = timeData || {}
            const daysStr = days >= 1 ? `${days} ${t('api.timeleftCell')}` : ''
            const hoursStr = hours < 10 ? `0${hours}` : hours
            const minutesStr = minutes < 10 ? `0${minutes}` : minutes
            const secondsStr = seconds < 10 ? `0${seconds}` : seconds
            const res = `${daysStr} ${hoursStr}:${minutesStr}:${secondsStr}`
            if (state.status === 10) {
                return t('competition.startTime', { val: res })
            } else {
                return t('competition.endTime', { val: res })
            }
        }

        const finish = () => {
            if (state.status === 10) {
                state.status = 20
            } else if (state.status === 20) {
                state.status = 30
            }
            emit('finish')
        }

        watch(() => props.data, (n) => {
            if (isEmpty(n)) {
                state.show = false
                return
            }
            if (!state.status) {
                state.status = n.Status
            }
            state.prize = plus(n.RewardsPool, n.RewardsPoolOther)
            state.show = true
        }, { immediate: true })

        return {
            cupBg,
            getTimeDataFormat,
            getEndTime,
            finish,
            ...toRefs(state)
        }
    }

}
</script>

<style lang="scss" scoped>
.cup-bg{
    position: relative;
    cursor: pointer;
    img{
        width: 100%;
    }
    .cup-content{
        position: absolute;
        top:0;
        left:0;
        bottom:0;
        right:0;
        padding-left:130px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        .rest-round{
            font-size: 20px;
            line-height: 20px;
            color: var(--contentColor);
            opacity: 0.5;
            display:flex;
            &>span{
                margin-right:5px;
            }
            :deep{
                .van-count-down{
                    color:var(--contentColor);
                    font-size: 16px;
                }
                .el-statistic__number{
                    color:var(--contentColor);
                    font-size: 16px;
                }
            }
        }
        .current-prize{
            font-weight: 600;
            font-size: 24px;
            line-height: 20px;
            color: var(--contentColor);
            margin-top:10px;
        }
    }
}
</style>
