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
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const statusChecked = ref(false)
const onUpdateStatus = (newValue) => {
    console.log(newValue)
    router.push({ name: 'MFA_install' })
}
</script>

<style lang="scss" scoped>
.page-wrap {
    width: 100%;
    height: 100%;
    margin-top: rem(110px);
    overflow: auto;
    // background: var(--contentColor);
    .bigIcon{
        padding-top: rem(60px);
        text-align: center;
        font-size: rem(180px);
        color: var(--primary);
    }
    .desc{
        font-size: rem(28px);
        color: var(--minorColor);
        padding-top: rem(10px);
        padding-bottom: rem(100px);
        text-align: center;
    }
}
</style>
