import { useI18n } from 'vue-i18n'
import { Toast } from 'vant'
import { checkOrderStatus } from '@/api/trade.js'

export default function () {
    const { t } = useI18n({ useScope: 'global' })

    // 验证是否可调整保证金和杠杆倍数
    const checkOrderStatusFn = (tradeType, orderId, operatorType) => {
        return new Promise((resolve, reject) => {
            checkOrderStatus({
                tradeType,
                operatorType,
                orderId
            }).then(res => {
                if (res.check()) {
                    resolve()
                } else {
                    Toast(operatorType === 1 ? t('trade.leverageTip') : t('trade.marginTip'))
                    reject()
                }
            }).catch(() => {
                Toast(operatorType === 1 ? t('trade.leverageTip') : t('trade.marginTip'))
                reject()
            })
        })
    }

    return {
        checkOrderStatusFn
    }
}
