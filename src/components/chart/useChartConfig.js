
import { useI18n } from 'vue-i18n'

export default function useChartConfig () {
    const { t, } = useI18n({ useScope: 'global' })

    const resolutionConfig = {
        1: t('chart.1min'),
        5: t('chart.5min'),
        15: t('chart.15min'),
        30: t('chart.30min'),
        60: t('chart.1hour'),
        120: t('chart.2hour'),
        240: t('chart.4hour'),
        '1D': t('chart.day'),
        '1W': t('chart.week'),
        '1M': t('chart.month'),
    }

    const chartTypeList = {
        0: t('chart.bars'),
        1: t('chart.candles'),
        2: t('chart.line'),
        3: t('chart.area'),
        9: t('chart.hollowCandles'),
        8: t('chart.heikinAshi'),
        10: t('chart.baseLine'),
    }

    return {
        resolutionConfig,
        chartTypeList
    }
}
