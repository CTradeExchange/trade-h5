<template>
    <div v-if='status' class='footer'>
        <van-loading v-if='status === "loading"'>
            {{ $t('compLang.loading') }}
        </van-loading>
        <div v-if='status === "finished"' class='finished-text'>
            {{ $t("common.noMore") }}
        </div>
    </div>
</template>

<script>
export default {
    props: {
        status: String
    }
}
</script>

<style lang="scss" scoped>

.footer{
    padding: 12px 0;
    text-align: center;
    font-size: 14px;
    color: var(--minorColor);
    :deep{
        .van-loading__spinner {
            width: 16px;
            height: 16px;
        }
        .van-loading__text{
            font-size: 14px;
            color: var(--minorColor);
        }
    }
}

</style>
