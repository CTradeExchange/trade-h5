<template>
    <div v-if='show' class='competition'>
        <div class='competition-btn' @click.stop='$router.push(`/competition?id=${data.ID}`)'>
            <img src='../../../images/competition/cup.png' />
            <CountDown
                v-if='status === 20 || status === 10'
                :format="`DD ${$t('api.timeleftCell')} HH:mm:ss`"
                :time='getEndTime(data)'
                @finish='finish'
            >
                <template #default='timeData'>
                    <span>{{ getTimeDataFormat(timeData, data) }}</span>
                </template>
            </CountDown>
            <div v-else class='rest-round'>
                <span>{{ $t('competition.competitionIsOver') }}</span>
            </div>
        </div>
    </div>
</template>

<script>
import { reactive, toRefs, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { isEmpty } from '@/utils/util'
import { CountDown } from 'vant'

export default {
    components: { CountDown },
    props: {
        data: {
            type: Object,
            default: () => {},
        },
    },
    setup (props, { emit }) {
        const { t } = useI18n({ useScope: 'global' })
        const state = reactive({
            prize: 0,
            endStatus: false,
            startStatus: false,
            show: false,
            status: null,
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

        watch(
            () => props.data,
            (n) => {
                if (isEmpty(n)) {
                    state.show = false
                    return
                }
                state.show = true
                if (!state.status) {
                    state.status = n.Status
                }
                state.prize = n.RewardsPool + n.RewardsPoolOther
            },
            { immediate: true },
        )

        return {
            getTimeDataFormat,
            getEndTime,
            finish,
            ...toRefs(state),
        }
    },
}
</script>

<style lang="scss" scoped>
.competition-btn {
    display: flex;
    align-items: center;
    height: rem(70px);
    background: linear-gradient(270deg, #ea643f 0%, #fbb754 100%);
    border: 1px solid #ffe1cb;
    border-radius: rem(35px);
    padding: 0 rem(22px);
    & > img {
        width: rem(48px);
        height: rem(48px);
    }
    :deep {
        .el-statistic__number {
            color: var(--contentColor);
            margin-left: rem(10px);
            font-size: rem(30px);
        }
    }
    .van-count-down {
        color: var(--contentColor);
        margin-left: rem(10px);
        font-size: rem(30px);
    }
    .rest-round{
            font-size: rem(24px);
            line-height: rem(40px);
            color: var(--contentColor);
            opacity: 0.5;
            display: flex;
            &>span{
                margin-left:8px;
            }
            :deep{
                .van-count-down{
                    font-size: unset;
                    color:unset
                }
            }
        }
}

</style>
