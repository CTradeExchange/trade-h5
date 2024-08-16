<template>
    <div v-if='!$store.state._user.customerInfo' class='flex justify-center py-20 text-sm'>
        <router-link class='px-1 text-primary cursor-pointer' to='/login'>
            {{ `${$t('c.login')} / ${$t('c.register')}` }}
        </router-link>
    </div>
    <div v-else-if='Number(assets?.availableMargin) === 0 && props.isPosition' class='flex flex-col py-10 items-center justify-center'>
        <div class='text-base font-bold'>
            {{ $t('headLineTrade.noAssetsTips') }}
        </div>
        <div class='text-sm text-minorColor mt-1'>
            {{ $t('register.goDepositStartTrading') }}
        </div>
        <img class='my-4 cursor-pointer w-10 h-10' src='/images/deposit.svg' @click='deposit' />
        <div class='text-sm'>
            {{ $t('trade.deposit') }}
        </div>
    </div>
    <van-empty v-else image='/images/empty.png' :image-size='100'>
        <div class='text-center font-bold text-base'>
            {{ props.description }}
        </div>
    </van-empty>
</template>

<script setup>
import { defineProps } from 'vue'
import { useRouter } from 'vue-router'
import { useAssets } from '@/hooks/assets'

const props = defineProps({
    description: String,
    isPosition: Boolean
})
const router = useRouter()
const deposit = () => {
    router.push(window.isPC ? '/order/recharge' : '/deposit')
}
const assets = useAssets()
</script>
