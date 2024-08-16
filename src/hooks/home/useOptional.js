// 添加自选
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { computed, ref, unref } from 'vue'
import { addCustomerOptional, removeCustomerOptional } from '@/api/trade'
import { ElMessage } from 'element-plus'
import { isEmpty, localGet } from '@/utils/util'

export default function hooks (state) {
    const store = useStore()
    const { t } = useI18n({ useScope: 'global' })

    const customerInfo = computed(() => store.state._user.customerInfo)

    const isLoading = ref(false) // 接口是否loading

    /** 添加自选逻辑 */
    const userSelfSymbolList = computed(() => store.getters.userSelfSymbolList || {})

    // 本地自选
    const localSelfSymbolList = computed(() => store.state._user.localSelfSymbolList)

    /** 添加自选逻辑 标星状态 */
    const isCollect = (tradeType, symbolId) => {
        if (isEmpty(customerInfo.value)) {
            const newId = symbolId + '_' + tradeType
            if (localGet('selfSymbolListStorage')) {
                if (JSON.parse(localGet('selfSymbolListStorage')).find(el => el === newId)) {
                    return true
                } else {
                    return false
                }
            }
        } else {
            return userSelfSymbolList.value[tradeType]?.find(id => parseInt(id) === parseInt(symbolId))
        }
    }

    const addOptional = async ({ symbolId, tradeType, callback }) => {
        if (customerInfo.value) {
            if (isLoading.value === true) return
            isLoading.value = true
            if (isCollect(tradeType, symbolId)) {
                await removeCustomerOptional({ symbolList: [symbolId], tradeType }).then(async (res) => {
                    if (res.check()) {
                        await store.dispatch('_user/queryCustomerOptionalList')
                        ElMessage.success(t('trade.removeOptionalOk'))
                    }
                }).catch(err => {
                })
            } else {
                await addCustomerOptional({ symbolList: [symbolId], tradeType }).then(async (res) => {
                    if (res.check()) {
                    // 手动修改optional值
                        store.commit('_user/Update_optional', 1)
                        await store.dispatch('_user/queryCustomerOptionalList')
                        ElMessage.success(t('trade.addOptionalOk'))
                    }
                }).catch(err => {
                })
            }
            isLoading.value = false
        } else {
            // 未登录 缓存到本地
            var localSelfSymbolList = localGet('selfSymbolListStorage') ? JSON.parse(localGet('selfSymbolListStorage')) : []
            const newId = symbolId + '_' + tradeType
            if (localSelfSymbolList.find(el => el === newId)) {
                localSelfSymbolList.map((it, index) => {
                    if (it === newId) {
                        localSelfSymbolList.splice(index, 1)
                        ElMessage.success(t('trade.removeOptionalOk'))
                    }
                })
            } else {
                localSelfSymbolList.push(newId)
                ElMessage.success(t('trade.addOptionalOk'))
            }
            store.dispatch('_user/queryLocalCustomerOptionalList', localSelfSymbolList)
        }
        callback && callback()
    }

    // 自选列表【本地取本地，登录后取登录后】
    const selfSymbolList = computed(() => {
        if (customerInfo.value) {
            const res = []
            const selfSymbol = unref(userSelfSymbolList)
            Object.keys(selfSymbol).forEach((item) => {
                selfSymbol[item].forEach((sitem) => {
                    res.push(sitem + '_' + item)
                })
            })
            return res
        } else {
            return localSelfSymbolList.value
        }
    })

    return {
        selfSymbolList,
        isCollect,
        addOptional
    }
}
