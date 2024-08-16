<template>
    <centerViewDialog class='dialog-boxs-ts'>
        <div class='success-box'>
            <LayoutTop />
            <img class='success-img' src='../../../../assets/newPCUI/tran_s.png' />
            <p>Your transfer is Finished</p>
            <div>
                <p>
                    <span>{{ $t("wallet.currency") }}</span>
                    <span>USDT</span>
                </p>
                <p>
                    <span>{{ $t("") }}</span>
                    <span>Trading account</span>
                </p>
                <p>
                    <span>{{ $t("") }}</span>
                    <span>Trading account</span>
                </p>
                <p>
                    <span>{{ $t("wallet.amount") }}</span>
                    <span>Trading account</span>
                </p>
                <p>
                    <span>{{ $t("") }}</span>
                    <span>Trading account</span>
                </p>
                <p>
                    <span>{{ $t("common.time") }}</span>
                    <span>Trading account</span>
                </p>
                <p>
                    <span>{{ $t("common.status") }}</span>
                    <span>Trading account</span>
                </p>
            </div>
        </div>
    </centerViewDialog>
</template>

<script>
import centerViewDialog from '@planspc/layout/centerViewDialog'
export default {
    components: {
        centerViewDialog
    }
}
</script>

<style lang="scss" scope>
.success-box {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;

    & > img {
        width: 52px;
        height: 52px;
        margin-top: 44px;
    }

    & > p {
        font-size: 16px;
        font-weight: 700;
        color: var(--primaryText);
        margin: 20px 0 32px;
    }

    & > div {
        width: 448px;
        height: auto;
        border-radius: 8px;
        background: #FAF9F9;
        padding: 12px 24px;
        display: flex;
        flex-direction: column;
        & > p {
            line-height: 2.5;
            font-size: 14px;
            color: var(--primaryText);
            display: flex;
            justify-content: space-between;
            & > span:first-of-type {
                color: #999999;
            }
        }
    }
}
</style>
