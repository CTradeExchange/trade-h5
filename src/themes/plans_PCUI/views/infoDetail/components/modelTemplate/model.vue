<template>
      <div class="custom-header">
                <img src="../../../../../../assets/newUI/dtl.png" alt="">
                <div>
                    <p>{{ $t('common.detailTitle1') }}</p>
                    <p>{{ $t('common.detailTitle2') }}</p>
                </div>
                <img src="../../../../../../assets/newUI/dtr.png" alt="">
            </div>
            <div class="custom-content">
                <div>
                    <div v-for="(item, index) in state.lists" :key="index">
                        <p>{{ item.label }}</p>
                        <p>{{ item.value }}</p>
                    </div>
                </div>
            </div>
            <div class="custom-footer">
                <div>
                    <p>{{ $t('common.detailFooter') }}</p>
                </div>
                <div>
                    <img src="../../../../../../assets/newUI/dft1.png" alt="">
                </div>
                <div>
                    <img src="../../../../../../assets/newUI/dft2.png" alt="">
                </div>
                <div>
                    <img src="../../../../../../assets/newUI/dft3.png" alt="">
                </div>
            </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { reactive } from 'vue'
const { t } = useI18n({ useScope: 'global' })

  const state = reactive({
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
    width: 1280px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 50px;
    & > img {
        width: 310px;
        height: 234px;
    }
    & > div {
        flex: 1;
        padding: 0 36px;
        font-weight: 700;
        font-size: 32px;
        color: var(--primaryText);
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        line-height: 1.2;
        & > p:first-of-type {
            font-size: 45px;
            white-space: nowrap;
            color: var(--primary);
            margin-bottom: 12px;
        }
    }
}
.custom-content {
    width: 1182px;
    overflow: hidden;
    & > div {
        width: 1282px;
        display: table;
        table-layout: fixed;
        border-spacing: 50px;
        margin-left: -50px;
        & > div {
            display: table-cell;
            width: 360px;
            height: 100%;
            padding: 24px;
            background: #FFFFFF;
            box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
            border-radius: 20px;
            font-size: 19px;
            color: var(--primaryText);
            box-sizing: border-box;
            border-right: 24px solid transparent;
            & > p:first-of-type {
                font-weight: 700;
                font-size: 25px;
                color: var(--primary);
                margin-bottom: 14px;
            }
            &:last-of-type {
                border-right: none;
            }
        }
    }
}
.custom-footer {
    display: flex;
    align-items: center;
    width: 1182px;
    height: 164px;
    background: #FFFFFF;
    max-width: 100%;
    border-radius: 20px;
    font-size: 25px;
    color: var(--primary);
    font-weight: 700;
    margin-bottom: 50px;
    & > div {
        flex: 1;
        padding: 0 24px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
}
</style>