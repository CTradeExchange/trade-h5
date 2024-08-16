<template>
    <div class='card'>
        <div class='card-left'>
            <div class='left-item'>
                <div class='item-label'>
                    {{ $t('news.actual') }}
                </div>
                <div class='item-value'>
                    {{ fixedNumber(data.Actual,data.Scale,data.Unit) }}
                </div>
            </div>
            <div class='left-item'>
                <div class='item-label'>
                    {{ $t('news.forecast') }}
                </div>
                <div class='item-value'>
                    {{ fixedNumber(data.Forecast,data.Scale,data.Unit) }}
                </div>
            </div>
            <div class='left-item'>
                <div class='item-label'>
                    {{ $t('news.previous') }}
                </div>
                <div class='item-value'>
                    {{ fixedNumber(data.Previous,data.Scale,data.Unit) }}
                </div>
            </div>
        </div>
        <div class='card-right'>
            <div class='extra-item'>
                <div class='label'>
                    {{ $t("news.importance") }}:
                </div>
                <StarCom :img-style="{ width:'16px',height:'13px' }" :number='Number(data.Important)' />
            </div>
            <div class='extra-item'>
                <div class='label'>
                    {{ $t("news.countryOrArea") }}:
                </div>
                <img
                    :class="[
                        'country-icon',
                        'ceFlags',
                        data.Currency?.toLowerCase(),
                    ]"
                />
            </div>
            <div class='extra-item'>
                <div class='label'>
                    {{ $t("news.currency") }}:
                </div>
                <div class='value'>
                    {{ data.Currency }}
                </div>
            </div>
            <div class='extra-item'>
                <div class='label'>
                    {{ $t("news.source1") }}:
                </div>
                <div class='value'>
                    <a
                        v-if='data.SourceURL'
                        :href='data.SourceURL'
                        target='_blank'
                    >
                        {{ data.Source }}
                    </a>
                    <span v-else>
                        {{ data.Source }}
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import StarCom from '@planspc/components/starCom.vue'
import { reactive, toRefs } from 'vue'
import { fixedNumber } from '@/utils/util'
import dayjs from 'dayjs'
export default {
    components: { StarCom },
    props: {
        data: {
            type: Object,
            default: () => {
                return {}
            }
        }

    },
    setup (props) {
        const state = reactive({

        })

        return {
            fixedNumber,
            ...toRefs(state)
        }
    }

}
</script>

<style scoped lang="scss">
@import "@/sass/country_currency.scss";
.card{
    margin-top:10px;
    padding: 20px 0;
    border-top:1px solid var(--cardBg);
    border-bottom:1px solid var(--cardBg);
    display: flex;
    align-items: center;
    .card-left{
        display: flex;
        justify-content: space-between;
        align-items: center;
        width:50%;
        .left-item{
            flex:1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }
    }
    .card-right{
        border-left:1px solid var(--cardBg);
        width:50%;
        padding-left: 60px;
        .extra-item{
            display: flex;
            align-items: center;
            .label{
                width:100px
            }
            .value{
                & > a {
                    color: var(--color2);
                }
                & > span {
                    color: var(--color80);
                }
            }
        }
    }
}
</style>
