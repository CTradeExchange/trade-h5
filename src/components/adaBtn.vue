<template>
    <el-popover
        v-if='customerInfo?.customerNo && !!onlineService && !flag'
        :persistent='false'
        placement='bottom-end'
        popper-class='popover_service'
        trigger='click'
    >
        <template #reference>
            <slot></slot>
        </template>
        <iframe v-if='srcHref' class='iframe_service' :src='srcHref'></iframe>
    </el-popover>
    <div v-else-if='!!onlineService && flag' @click='handleSkip'>
        <slot></slot>
    </div>
    <div v-else-if='!!onlineService' @click="$router.push('/login')">
        <slot></slot>
    </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { getCookie } from '@/utils/util'
export default {
    setup () {
        const store = useStore()
        const customerInfo = computed(() => store.state._user.customerInfo)
        const onlineService = computed(() => store.state._base.wpCompanyInfo?.onlineService)
        const flag = onlineService.value?.indexOf('im.headline.net/im') > -1
        const { email, emailAll, customerNo, phone, phoneAll } = customerInfo.value || {}
        let srcHref = onlineService.value ?? ''
        if (!flag && srcHref) {
            if (srcHref?.indexOf('?') === -1) srcHref += '?'
            srcHref += `&i=${customerNo ?? ''}&n=${emailAll || email || ''}&p=${phoneAll || phone || ''}&l=${getCookie('lang')}`
        }
        const handleSkip = () => {
            window.open(onlineService.value)
        }
        return {
            flag,
            srcHref,
            handleSkip,
            customerInfo,
            onlineService
        }
    }
}
</script>

<style lang="scss">
.iframe_service {
    width: 100%;
    height: 100%;
    border: none;
    box-shadow: none;
}
.popover_service {
    width: 320px !important;
    height: 520px !important;
    max-height: 72vh;
    padding: 0 !important;
    overflow: hidden;
}
</style>
