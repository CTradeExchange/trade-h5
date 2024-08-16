<template>
    <div class='page-wrap'>
        <LayoutTop :back='true' />
        <div class='bigIcon'>
            <i class='icon icon_dunpai'></i>
        </div>
        <p class='desc'>
            {{ $t("mfa.enableDesc") }}
        </p>
        <van-cell :title='$t("mfa.enableTitle")'>
            <template #right-icon>
                <van-switch :active-color='$style.primary' :model-value='statusChecked' size='24px' @update:model-value='onUpdateStatus' />
            </template>
        </van-cell>
    </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

const router = useRouter()
const store = useStore()

const statusChecked = computed(() => store.state._user.customerInfo?.googleId > 0)
const onUpdateStatus = (newValue) => {
    router.push({ name: newValue ? 'MFA_install' : 'MFA_bind' })
}
</script>

<style lang="scss" scoped>
.page-wrap {
    width: 100%;
    height: 100%;
    overflow: auto;
    :deep(.topNav .main) {
        max-width: 100%;
    }
    .bigIcon {
        padding-top: rem(60px);
        color: var(--primary);
        font-size: rem(180px);
        text-align: center;
    }
    .desc {
        padding: rem(10px) rem(24px) rem(100px);
        color: var(--minorColor);
        font-size: rem(28px);
        text-align: center;
    }
}
</style>
