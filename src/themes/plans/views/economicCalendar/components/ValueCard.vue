<template>
    <div class='value-line'>
        <div class='value-item'>
            <div class='value'>
                {{ fixedNumber(data.Actual,data.Scale) }}
            </div>
            <div class='label'>
                {{ $t("news.actual") }}
            </div>
        </div>
        <div class='value-item'>
            <div class='value'>
                {{ fixedNumber(data.Forecast,data.Scale) }}
            </div>
            <div class='label'>
                {{ $t("news.forecast") }}
            </div>
        </div>
        <div class='value-item'>
            <div class='value'>
                {{ fixedNumber(data.Previous,data.Scale) }}
            </div>
            <div class='label'>
                {{ $t("news.previous") }}
            </div>
        </div>
    </div>
</template>

<script>
import { fixedNumber } from '@/utils/util'
import { reactive, toRefs } from 'vue'
export default {
    props: {
        data: {
            type: Object,
            default: () => {
                return {}
            }
        }
    },
    setup () {
        const state = reactive({
            fixedNumber
        })

        return {
            ...toRefs(state)
        }
    }
}
</script>

<style lang="scss" scoped>
.value-line {
    margin-top: rem(50px);
    display: flex;
    border-top: rem(2px) solid var(--colorbf);
    border-bottom: rem(2px) solid var(--colorbf);
    padding: rem(20px) rem(20px) rem(35px) rem(20px);
    .value-item {
        flex: 1;
        display: flex;
        flex-direction: column;
        text-align: center;
        border-left: rem(2px) solid var(--colorbf);
        &:first-of-type {
            border-left: none;
        }
        .value {
            font-size: rem(30px);
            color: var(--mainColor);
        }
        .label {
            margin-top: 10px;
            font-size: rem(24px);
            color: var(--color80);
        }
    }
}
</style>
