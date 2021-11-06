<template>
    <!-- 杠杆倍数设置 -->
    <van-popup v-model:show='show' position='bottom'>
        <div class='multipleSet'>
            <div class='header'>
                <p class='title'>
                    杠杆设置
                </p>
                <a class='close' href='javascript:;'>
                    <i class='icon_icon_close_big'></i>
                </a>
            </div>
            <div class='body'>
                <StepperComp
                    v-model='num'
                    class='stepper'
                    :class="{ 'warn': warn }"
                    :controlbtn='true'
                    :digits='0'
                    :max='max'
                    :min='min'
                    :step='step'
                    @change='change'
                    @firstMinus='firstChange'
                    @firstPlus='firstChange'
                />
                <div class='multipleRange'>
                    杠杆范围：1x-10x
                </div>
                <div class='multipleVal'>
                    5x
                </div>
                <ul class='multipleList'>
                    <li class='item'>
                        1x
                    </li>
                    <li class='item active'>
                        5x
                    </li>
                    <li class='item'>
                        10x
                    </li>
                    <li class='item'>
                        20x
                    </li>
                    <li class='item'>
                        50x
                    </li>
                </ul>
                <div class='warnTip'>
                    过高的杠杆会增加仓位强平风险，请注意自身风险承受级别，合理设置杠杆
                </div>
            </div>

            <van-button block type='primary'>
                保存设置
            </van-button>
        </div>
    </van-popup>
</template>

<script>
import { computed, reactive, toRefs } from 'vue'
import { useStore } from 'vuex'
import StepperComp from '@plans/components/stepper'
export default {
    components: {
        StepperComp,
    },
    props: {
        modelValue: {
            type: Boolean,
            default: false
        },
    },
    emits: ['update:modelValue'],
    setup (props, { emit }) {
        const store = useStore()
        const show = computed({
            get: () => props.modelValue,
            set: val => emit('update:modelValue', val)
        })
        const state = reactive({
            num: '',
            max: 100,
            min: 1,
            step: 1,
            warn: 1,
        })

        const change = () => {}
        const firstChange = () => {}

        return {
            ...toRefs(state),
            show,
            change,
            firstChange,
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.multipleSet{
    .header{
        height: rem(100px);
        line-height: rem(100px);
        position: relative;
        text-align: center;
        font-size: rem(34px);
        .close{
            position: absolute;
            right: rem(30px);
            top: rem(0px);
            font-size: rem(32px);
            color: var(--color);
        }
    }
    .body{
        padding: rem(10px) rem(30px) rem(30px);
    }
    .stepper{
        background: var(--bgColor);
        display: flex;
        :deep(.input){
            flex: 1;
        }
    }
    .multipleRange{
        margin-top: rem(20px);
        color: var(--minorColor);
    }
    .multipleVal{
        background: var(--bgColor);
        text-align: center;
        height: rem(80px);
        line-height: rem(80px);
        color: var(--color);
        font-size: rem(28px);
    }
    .multipleList{
        margin-top: rem(20px);
        color: var(--color);
        display: flex;
        justify-content: flex-start;
        text-align: center;
        font-size: rem(24px);
        .item{
            margin-right: 10px;
            width: rem(96px);
            height: rem(40px);
            line-height: rem(40px);
            background: var(--bgColor);
            &.active{
                color: var(--primary);
                background: var(--primaryAssistColor);
            }
        }
    }
    .warnTip{
        margin-top: rem(90px);
        padding: rem(15px) rem(20px);
        font-size: rem(24px);
        background: #FEF6F7;
        color: #EF5350;
    }
}
</style>
