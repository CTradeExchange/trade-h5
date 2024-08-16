<template>
    <div class='tips'>
        <span class='star'>
            *
        </span>
        <span>{{ $t('homeJD.tradingSignalTips') }}</span>
    </div>
</template>

<style lang="scss" scoped>
.tips {
    font-size: 14px;
    margin-top: 15px;
    @media screen and (max-width: 768px) {
        font-size: rem(26px);
    }
    .star {
        color: var(--primary);
    }
    span {
        color: var(--normalColor);
    }
}
</style>
