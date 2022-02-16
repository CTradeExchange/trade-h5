import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

export default function hooks () {
    const route = useRoute()
    const { t } = useI18n({ useScope: 'global' })
    const { direction } = route.query
    const pageTitle = direction === 'buy' ? t('fundInfo.applyRecords') : t('fundInfo.redeemRecords')
    return {
        pageTitle,
    }
};
