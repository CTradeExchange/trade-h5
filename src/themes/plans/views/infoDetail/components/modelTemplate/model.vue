<template>
    <div class="custom-header">
                <p>{{ $t('common.detailTitle1') }}</p>
                <p>{{ $t('common.detailTitle2') }}</p>
            </div>
            <div class="custom-content">
                <div v-for="(item, index) in state.lists" :key="index">
                    <p>{{ item.label }}</p>
                    <p>{{ item.value }}</p>
                </div>
            </div>
            <div class="custom-footer">
                <p>{{ $t('common.detailFooter') }}</p>
                <img src="../../../../../../assets/newUI/dft1.png" alt="">
                <img src="../../../../../../assets/newUI/dft2.png" alt="">
                <img src="../../../../../../assets/newUI/dft3.png" alt="">
            </div>
</template>

<script setup>
import { reactive } from "vue";
import { useI18n } from 'vue-i18n'
const { t } = useI18n({ useScope: 'global' })

const state=reactive({
    lists: [{
                label: t('common.detailLabel1'),
                value: t('common.detailValue1')
            }, {
                label: t('common.detailLabel2'),
                value: t('common.detailValue2')
            }, {
                label: t('common.detailLabel3'),
                value: t('common.detailValue3')
            }],
})
</script>

<style lang="scss" scoped>
.custom-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: rem(42px);
    color: var(--primaryText);
    font-weight: 700;
    margin: rem(56px) 0;
    & > p:first-of-type {
        color: var(--primary);
        font-size: rem(48px);
        margin-bottom: rem(12px);
    }
}
.custom-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0 rem(24px);
    & > div {
        width: 100%;
        height: auto;
        background: #FFFFFF;
        box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
        border-radius: rem(20px);
        padding: rem(24px);
        margin-bottom: rem(36px);
        font-size: rem(24px);
        color: var(--primaryText);
        line-height: 1.5;
        & > p:first-of-type {
            text-align: center;
            font-size: rem(36px);
            color: var(--primary);
            margin-bottom: rem(24px);
            font-weight: 700;
        }
    }
}
.custom-footer {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: rem(50px) 0;
    & > p {
        font-size: rem(36px);
        color: var(--primary);
        margin-bottom: rem(36px);
        font-weight: 700;
    }
    & > img {
        max-width: rem(360px);
        margin-bottom: rem(36px);
    }
}
</style>