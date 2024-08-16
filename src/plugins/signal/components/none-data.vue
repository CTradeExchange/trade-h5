<template>
    <div class='none-data px-2'>
        <!-- <p class='none-data-text'>
            {{ description || $t('common.noData') }}
        </p> -->
        <van-empty :description="description || $t('common.noData')" image='/images/empty.png' />
    </div>
</template>

<script>
export default {
    props: {
        description: {
            type: String,
            default: ''
        }
    }
}
</script>

<style lang='scss' scoped>
@import '@/plugins/signal/style/signal.scss'
</style>
