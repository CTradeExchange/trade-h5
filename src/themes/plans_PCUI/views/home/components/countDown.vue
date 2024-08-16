<template>
    <div v-if='show' class='cup-bg' @click.stop='$router.push(`/competition?id=${data.ID}`)'>
        <img :src='cupBg' />
        <div v-if='status===20 || status===10'>
            <CountDown :format='`DD ${$t("api.timeleftCell")} HH:mm:ss`' :time='getEndTime(data)' @finish='finish'>
                <template #default='timeData'>
                    <span>{{ getTimeDataFormat(timeData,data) }}</span>
                </template>
            </CountDown>
        </div>
        <div v-else class='rest-round'>
            <span>{{ $t('competition.competitionIsOver') }}</span>
        </div>
    </div>
</template>

<script>
import { reactive, toRefs, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { isEmpty } from '@/utils/util'
import { CountDown } from 'vant'
import cupBg from '@planspc/images/race-cup.png'

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
            show: false,
            status: null
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
            state.show = true
            if (!state.status) {
                state.status = n.Status
            }
            state.prize = n.RewardsPool + n.RewardsPoolOther
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

    height: 35px;
    border-radius: 35px;
    background: linear-gradient(270deg, #EA643F 0%, #FBB754 100%);
    border: 1px solid #FFE1CB;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 10px;
    img{
        width: 24px;
        height: 24px;
        margin-right:5px;
    }
    :deep{
        .van-count-down{
            font-size: 16px;
            color:var(--contentColor)
        }
    }
    .rest-round{
      color: var(--contentColor);
      opacity: 0.5;
    }

}
</style>
