<template>
    <div class='page-wrap'>
        <van-collapse v-model='activeNames'>
            <van-collapse-item name='1'>
                <template #title>
                    <div>10000.00 USD</div>
                    <p>2020.04.03 16:12:40</p>
                </template>
                <template #right-icon>
                    <div>
                        审核中
                        <van-icon name='arrow-up' />
                    </div>
                </template>
                <div class='withdraw-desc'>
                    <div class='w-item'>
                        <span class='left-label'>
                            取款金额
                        </span>
                        <span class='right-val'>
                            1000
                        </span>
                    </div>
                    <div class='w-item'>
                        <span class='left-label'>
                            币种
                        </span>
                        <span class='right-val'>
                            USD
                        </span>
                    </div>
                    <div class='w-item'>
                        <span class='left-label'>
                            状态
                        </span>
                        <span class='right-val'>
                            审核中
                        </span>
                    </div>

                    <div class='w-item'>
                        <span class='left-label'>
                            手续费
                        </span>
                        <span class='right-val'>
                            0.00
                        </span>
                    </div>
                    <div class='w-item'>
                        <span class='left-label'>
                            入账金额
                        </span>
                        <span class='right-val'>
                            1000
                        </span>
                    </div>
                    <div class='w-item'>
                        <span class='left-label'>
                            提案编号
                        </span>
                        <span class='right-val'>
                            M45482723665
                        </span>
                    </div>
                    <div class='w-item'>
                        <span class='left-label'>
                            提交时间
                        </span>
                        <span class='right-val'>
                            2020.04.23 06:14:01
                        </span>
                    </div>
                    <div class='w-item'>
                        <span class='left-label'>
                            备注
                        </span>
                        <span class='right-val'>
                            --
                        </span>
                    </div>
                </div>
            </van-collapse-item>
            <van-collapse-item icon='shop-o' name='2' title='标题2'>
                内容
            </van-collapse-item>
        </van-collapse>
    </div>
</template>

<script>
import { Collapse, CollapseItem, Toast } from 'vant'
import { reactive, toRefs, ref } from 'vue'
export default {
    components: {
        Collapse,
        CollapseItem
    },
    setup (props) {
        const activeNames = ref(['1'])
        const qq = () => {
            Toast(7777)
        }
        return { activeNames, qq }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.page-wrap {
    .withdraw-desc {
        .w-item {
            display: flex;
            line-height: rem(60px);
            span {
                flex: 1;
            }
            .right-val {
                text-align: right;
            }
        }
    }
}
</style>
