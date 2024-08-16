<template>
    <div class="recordBody">
        <LayoutTop :title='$t("route.noticeTitle")'>
        </LayoutTop>
        <van-collapse v-model="activeNames" :border="false">
            <van-collapse-item v-for="(item, index) in datas" :key="index" :name="index" class="itemBox">
                <template #title>
                    <div class="titleBox">
                        <p>20022年</p>
                        <p>累计存款 100.00 USDT</p>
                    </div>
                </template>
                <div v-for="(items, key) in lists" :key="key" class="listBox">
                    <h3>存款成功</h3>
                    <p>
                        <span>订单号：20229485872902</span>
                        <span>100.00 USDT</span>
                    </p>
                    <p>
                        <span>到账时间</span>
                        <span>2022-08-08 15:20</span>
                    </p>
                </div>
            </van-collapse-item>
        </van-collapse>
    </div>
</template>

<script>
import { toRefs, reactive, ref } from 'vue'
export default {
    setup () {
        const activeNames = ref(['1']);
        const state = reactive({
            datas: [{}, {}],
            lists: [{}, {}]
        })
        return {
            activeNames,
            ...toRefs(state)
        }
    }
}
</script>

<style lang="scss" scoped>
.recordBody {
    padding-top: rem(110px);
}
.itemBox {
    border-bottom: 0.5px solid var(--lineColor);
    :deep(.van-collapse-item__content) {
        padding: 0;
    }
    :deep(.van-cell) {
        padding: rem(30px);
        background-color: var(--cellBg);
    }
    :deep(.van-cell:after) {
        border-bottom: none;
    }
    &::after {
        border-top: none;
    }
}
.titleBox {
    font-size: rem(30px);
    color: var(--placeholdColor);
    & > p:first-of-type {
        font-size: rem(36px);
        color: var(--primaryText);
    }
}
.listBox {
    line-height: 1.6;
    padding: rem(30px);
    border-bottom: 0.5px solid var(--lineColor);
    & > h3 {
        font-size: rem(28px);
        color: var(--primaryText);
        font-weight: 400;
    }
    & > p {
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: var(--placeholdColor);
        font-size: rem(24px);
    }
    & > p:first-of-type > span:last-of-type {
        font-size: rem(36px);
        color: var(--color2);
    }
    &:last-of-type {
        border-bottom: none;
    }
}
</style>