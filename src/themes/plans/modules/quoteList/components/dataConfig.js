
import { useI18n } from 'vue-i18n'
import Item_1 from './common/Item_1.vue'
import Item_2 from './common/Item_2.vue'
import Item_3 from './common/Item_3.vue'
import Item_4 from './common/Item_4.vue'

export const getSelectOptions = () => {
    const { t } = useI18n({ useScope: 'global' })
    return [
        { value: 1, label: t('quote.style_1') },
        { value: 2, label: t('quote.style_2') },
        { value: 3, label: t('quote.style_3') },
        { value: 4, label: t('quote.style_4') },
    ]
}

export const getComponentMap = () => {
    return {
        1: Item_1,
        2: Item_2,
        3: Item_3,
        4: Item_4,
    }
}

export const productKlineList = [
    '153.7',
    '153.0',
    '152.7',
    '153.9',
    '155.5',
    '156.1',
    '156.7',
    '155.2',
    '157.7',
    '156.8',
    '152.1',
    '153.5',
    '151.6',
    '151.0',
    '150.9',
    '149.4',
    '150.5',
    '151.5',
    '151.3',
    '152.3',
    '152.6',
    '153.7',
    '154.6',
    '154.4',
    '152.8',
    '152.6',
    '151.5',
    '151.8',
    '148.4',
    '150.3',
    '148.9',
    '151.1',
    '150.1',
    '150.8',
    '151.7',
    '152.3',
    '151.7',
    '151.6',
    '152.8',
    '153.2',
    '153.5',
    '153.6',
    '152.1',
    '152.6',
    '152.9'
]
