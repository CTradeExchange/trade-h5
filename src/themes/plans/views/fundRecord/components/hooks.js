import { ref } from 'vue'
import { getAssetsList } from '@/api/base'

export const hooks = () => {
    const assetsList = ref([])
    getAssetsList({ type: 2 }).then(res => {
        if (res.check()) {
            assetsList.value = res.data.map(el => {
                return {
                    text: el.name,
                    value: el.code,
                }
            })
        }
    })
    return {
        assetsList
    }
}
