<template>
    <div class='extra-info'>
        <div class='extra-item'>
            <div class='label'>
                {{ $t("news.importance") }}:
            </div>
            <StarCom :number='Number(description.Important)' />
        </div>
        <div class='extra-item'>
            <div class='label'>
                {{ $t("news.countryOrArea") }}:
            </div>
            <div class='value'>
                <img
                    :class="[
                        'country-icon',
                        'ceFlags',
                        description.Currency?.toLowerCase(),
                    ]"
                />
            </div>
        </div>
        <div class='extra-item'>
            <div class='label'>
                {{ $t("news.currency") }}:
            </div>
            <div class='value'>
                {{ description.Currency }}
            </div>
        </div>

        <div class='extra-item'>
            <div class='label'>
                {{ $t("news.releaseDate") }}:
            </div>
            <div class='publishTime'>
                {{ dayjs(data.PublishTime * 1000).format("YYYY-MM-DD") }}
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
</template>

<script>
import StarCom from './StarCom.vue'
import { reactive, toRefs, computed } from 'vue'
import dayjs from 'dayjs'
import { isEmpty } from '@/utils/util'
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
    setup (props, { emit }) {
        const state = reactive({
            dayjs
        })

        const description = computed(() => {
            const desc = !isEmpty(props.data?.Description)
                ? props.data.Description
                : ''
            return (desc && JSON.parse(desc)) || {}
        })

        return {
            description,
            ...toRefs(state)
        }
    }
}
</script>

<style lang="scss" scoped>
@import "@/sass/country_currency.scss";
.extra-info {
    margin-top: rem(20px);
    .extra-item {
        padding: rem(10px) 0;
        display: flex;
        align-items: center;
        .label {
            width: rem(240px);
            font-size: rem(26px);
            color: var(--mainColor);
        }
        .value {
            flex: 1;
            font-size: rem(26px);
            color: var(--mainColor);
            & > a {
                color: var(--color2);
            }
            & > span {
                color: var(--color80);
            }
        }
        .publishTime {
            flex: 1;
            font-size: rem(26px);
            color: var(--color80);

        }
    }
}
</style>
