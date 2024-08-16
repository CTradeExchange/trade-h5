<template>
    <div>
        
        <el-dialog
            title="提示"
            :visible.sync="dialogVisible"
            width="30%"
            :before-close="handleClose">
            <div class='mPopupBox'>
                <div class='mpb-header'>
                    <span>{{ $t('common.Related') }}</span>
                    <van-icon name='cross' @click='showPopup = false' />
                </div>
                <div v-for='item in tradeItemList' :key='item.ID' class='mpb-content' @click='handleSkip(item)'>
                    <div :class="[item.Type===1?'content-1':'content-2']">
                        <van-rate v-if='item.Type===2' v-model='item.Important' count='3' readonly :size='18' />
                        <p>{{ item.Title }}</p>
                    </div>
                    <van-icon name='arrow' />
                </div>
                <div class='mpb-footer'>
                    <div @click='handleTradePage(-1)'>
                        <van-icon name='arrow-left' />
                    </div>
                    <div @click='handleTradePage(1)'>
                        <van-icon name='arrow' />
                    </div>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    setup () {
        
    }
}
</script>

<style lang="scss" scoped>

.mPopupBox {
    width: rem(670px);
    height: rem(1010px);
    background: #FFFFFF;
    border-radius: rem(15px);
    position: relative;
    padding: rem(130px) 0 rem(110px);
    overflow: hidden;
    .mpb-header {
        width: 100%;
        height: rem(130px);
        position: absolute;
        font-size: rem(34px);
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--contentColor);
        top: 0;
        z-index: 1;
        & > i {
            position: absolute;
            right: rem(40px);
            font-size: rem(36px);
        }
    }
    .mpb-content {
        height: rem(153px);
        display: flex;
        align-items: center;
        border-bottom: 1px solid var(--lineColor);
        margin: 0 rem(40px);
        padding: rem(20px) 0;
        & > div {
            flex: 1;
            height: 100%;
            display: flex;
            flex-direction: column;
            font-size: rem(30px);
            color: var(--primary);
            padding-right: rem(10px);
            box-sizing: border-box;
            &.content-1{
                justify-content: center;
            }
            &.content-2{
                justify-content: space-between
            }
            & > p {
                line-height: 1.2;
                @include ellipsisLn(2);
            }
            :deep(.van-rate__icon) {
                font-size: rem(24px) !important;
            }
        }
    }
    .mpb-footer {
        width: 100%;
        height: rem(110px);
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        bottom: 0;
        z-index: 1;
        background: var(--contentColor);
        & > div {
            width: rem(44px);
            height: rem(44px);
            border-radius: 50%;
            background: #8D8D8D;
            display: flex;
            justify-content: center;
            align-items: center;
            color: var(--contentColor);
            margin: 0 rem(30px);
            &:active {
                opacity: 0.75;
            }
        }
    }
}
</style>