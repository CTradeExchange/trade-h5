<template>
    <van-dialog
        v-model:show="show"
        :title='$t("common.tip")'
        show-cancel-button
        class="add-neet-info"
        confirm-button-color='#4069F2'
        :confirm-button-text='$t("login.goSet")'
        :cancel-button-text='$t("common.cancel")'
        @cancel="$router.go(-1)"
        @confirm="handleConfirm"
    >
        <div class="dialog-set">{{ $t("common.noSetInfo") }}</div>
    </van-dialog>
</template>

<script>
import { computed, reactive, toRefs, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
export default {
    setup() {
        const store = useStore()
        const router = useRouter()
        const customerInfo = computed(() => store.state._user.customerInfo)
        const state = reactive({
            show: false
        })

        watch(() => customerInfo.value, () => {
            const flag = customerInfo.value?.customerNo && !customerInfo.value?.email && !customerInfo.value?.phone
            if (flag !== state.show) state.show = flag
        }, { immediate: true })

        const handleConfirm = () => {
            router.push('/appRegister?type=add')
        }

        return {
            ...toRefs(state),
            customerInfo,
            handleConfirm
        }
    },
}
</script>

<style lang="scss" scope>
.add-neet-info {
    .van-dialog__header {
        font-size: 18px;
        font-weight: 600;
        color: #000;
    }
    .van-button__text {
        color: #4069F2 !important;
        font-size: 16px;
    }
}
    .dialog-set {
        font-size: 16px;
        text-align: center;
        margin: 24px 0 32px;
        padding: 0 12px;
    }
</style>