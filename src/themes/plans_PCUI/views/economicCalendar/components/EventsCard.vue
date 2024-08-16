<template>
    <div class='events-card'>
        <el-table :cell-class-name='getCellClass' :data='list' style='width: 100%'>
            <el-table-column
                v-for='col in columns'
                :key='col.label'
                :align='col.align'
                :class-name='className'
                :formatter='formatter'
                :label='col.label'
                :prop='col.prop'
                :width='col.width'
            />
            <!-- <el-table-column :formatter='formatter' :label="$t('common.time')" prop='PublishTime' />
            <el-table-column :formatter='formatter' :label="$t('news.actual')" prop='Actual' />
            <el-table-column :formatter='formatter' :label='$t("news.forecast")' prop='Forecast' />
            <el-table-column :formatter='formatter' :label='$t("news.previous")' prop='Previous' /> -->
        </el-table>
        <div v-if='more' class='view-more'>
            <div class='more-btn' @click="$emit('loadMore')">
                <span>{{ $t("news.more") }}</span>
            </div>
        </div>
    </div>
</template>

<script>
import { reactive, toRefs, watch, computed } from 'vue'
import { getCookie, fixedNumber } from '@/utils/util'
import dayjs from 'dayjs'
import { useI18n } from 'vue-i18n'

export default {
    props: {
        data: {
            type: Array,
            default: () => []
        },
        more: {
            type: Boolean,
            default: false
        }
    },
    setup (props) {
        const { t } = useI18n({ useScope: 'global' })
        const state = reactive({
            columns: [
                {
                    label: t('news.releaseDate'),
                    prop: 'PublishTime',
                    width: 200

                },
                {
                    label: t('common.time'),
                    prop: 'PublishTime',
                    width: 300,

                },
                {
                    label: t('news.actual'),
                    prop: 'Actual',
                    align: 'center'

                },
                {
                    label: t('news.forecast'),
                    prop: 'Forecast',
                    align: 'center'

                },
                {
                    label: t('news.previous'),
                    prop: 'Previous',
                    align: 'center'

                }
            ],
            className: ''
        })

        const list = computed(() => props.data.map(item => {
            const { PublishTime, Description } = item || {}
            const descParse = getDescObj(Description)
            return Object.assign(descParse, { PublishTime })
        }))

        const getDescObj = (str) => {
            if (!str) return {}
            return JSON.parse(str)
        }
        const formatter = (row, col, cell, index) => {
            const { Scale, Unit } = row || {}
            const column = col.getColumnIndex()
            let res = ''
            switch (column) {
                case 0:
                    res = formatTime(cell * 1000)
                    break
                case 1:
                    res = dayjs(cell * 1000).format('HH:mm')
                    break
                case 2:
                case 3:
                case 4:
                    res = fixedNumber(cell, Scale, Unit)
                    break
                default:
                    break
            }

            return res
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
                const res = `${dayjs(time).format('YYYY-MM-DD')}(Q${quarter})`

                return res
            }
        }

        const getCellClass = ({ row, column, rowIndex, columnIndex }) => {
            const { Actual, Forecast, Previous } = row || {}
            const { Actual: n_Act, Forecast: n_Fore, Previous: n_Prev } = list.value[rowIndex + 1] || {}
            let cellClass = ''
            switch (columnIndex) {
                case 2:

                    cellClass = Number(Actual) > Number(n_Act) ? 'up' : Number(Actual) < Number(n_Act) ? 'down' : ''
                    break
                case 3:

                    cellClass = Number(Forecast) > Number(n_Fore) ? 'up' : Number(Forecast) < Number(n_Fore) ? 'down' : ''
                    break
                case 4:
                    cellClass = Number(Previous) > Number(n_Prev) ? 'up' : Number(Previous) < Number(n_Prev) ? 'down' : ''
                    break
                default:
                    break
            }
            return cellClass
        }

        return {
            getCellClass,
            formatter,
            list,
            ...toRefs(state)
        }
    }

}
</script>

<style scoped lang="scss">
.events-card{
    padding-bottom: 50px;
   :deep{
        .up{
            color:var(--fallColor)
        }
        .down{
            color:var(--riseColor)
        }
   }
   .view-more{
        display: flex;
        align-items: center;
        justify-content: center;
        padding-top:20px;
        .more-btn{
            width: 120px;
            height: 42px;
            background: var(--contentColor);
            border: 1px solid var(--cardBg);
            border-radius: 5px;
            display: flex;
            align-items: center;
            justify-content: center;
            color:var(--mainColor);
            font-size: 16px;
            cursor: pointer;
        }
   }
}
</style>
