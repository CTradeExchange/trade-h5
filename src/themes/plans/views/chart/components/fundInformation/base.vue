<template>
    <div>
        <h4 class='cellTitle'>
            {{ $t("fundInfo.fundSurvey") }}
        </h4>
        <ul v-if='fundInfo' class='fundBaseList'>
            <li v-if='fundInfo.fundName' class='item'>
                <span class='hd'>
                    {{ $t('fundInfo.fundName') }}
                </span>
                <span class='ft'>
                    {{ fundInfo.fundName }}
                </span>
            </li>
            <li v-if='fundInfo.upDate' class='item'>
                <span class='hd'>
                    {{ $t('fundInfo.fundCreateTime') }}
                </span>
                <span class='ft'>
                    {{ fundInfo.upDate }}
                </span>
            </li>
            <li v-if='fundInfo.preShare' class='item'>
                <span class='hd'>
                    {{ $t('fundInfo.latestPart') }}
                </span>
                <span class='ft'>
                    {{ fundInfo.preShare }}
                </span>
            </li>
            <li v-if='fundInfo.managerName' class='item'>
                <span class='hd'>
                    {{ $t('fundInfo.fundManager') }}
                </span>
                <span class='ft'>
                    {{ fundInfo.managerName }}
                </span>
            </li>
            <li v-if='fundInfo.trackIndex' class='item'>
                <span class='hd'>
                    {{ $t('fundInfo.followIndex') }}
                </span>
                <span class='ft'>
                    {{ fundInfo.trackIndex }}
                </span>
            </li>
            <li v-if='fundInfo.operationMode' class='item'>
                <span class='hd'>
                    {{ $t('fundInfo.operationMode') }}
                </span>
                <span class='ft'>
                    {{ fundInfo.operationMode===1 ? $t('fundInfo.operationModeValue1') : $t('fundInfo.operationModeValue2') }}
                </span>
            </li>
            <li v-if='fundInfo.fundType' class='item'>
                <span class='hd'>
                    {{ $t('fundInfo.fundType') }}
                </span>
                <span class='ft'>
                    {{ fundInfo.fundType }}
                </span>
            </li>
        </ul>
    </div>
</template>

<script setup>
import { useFundInfo } from './hooks/base'

const { fundInfo } = useFundInfo()

</script>

<style lang="scss" scoped>
@import '~@/sass/mixin.scss';
.cellTitle{
    font-size: rem(32px);
    line-height: rem(80px);
}
.fundBaseList{
    .item{
        display: flex;
        justify-content: space-between;
        font-size: rem(28px);
        line-height: rem(60px);
        .hd{
            color: var(--minorColor);
        }
    }
}
</style>
