<template>
    <div>
        <van-pull-refresh
            v-model="refresh"
            :loading-text="$t('compLang.loading')"
            :loosing-text="$t('compLang.vanPullRefresh.loosing')"
            :pulling-text="$t('compLang.vanPullRefresh.pulling')"
            @refresh="onRefresh"
        >
            <div v-if="isEmpty(data) && !loading">
                <van-empty
                    :description="$t('common.noData')"
                    image="/images/empty.png"
                />
            </div>

            <van-list
                v-else
                v-model:error="isError"
                v-model:loading="loading"
                :error-text="errorTip"
                :finished="finished"
                :finished-text="$t('common.noMore')"
                :loading-text="$t('compLang.loading')"
                @load="onLoad"
                :offset="10"
            >
                <div
                    v-for="(item, index) in data"
                    :key="index"
                    class="card-item"
                    @click="goNewsDetail(item.ID)"
                >
                    <Image :src="item.CoverURL" alt="" mode="cover" class="itemImg" />
                    <div class="itemContent">
                        <div class="itemTitle">
                            <span>{{ `NO.${index + 2}` }}</span>
                            <span>{{ item.Title }}</span>
                        </div>
                        <div v-if="item.Trades" class="relatedTrade">
                            {{ $t("news.relatedTrade") }}
                        </div>
                        <TradeBtn :data="item" position="item" />
                    </div>
                </div>
            </van-list>
        </van-pull-refresh>
    </div>
</template>

<script>
import { reactive, toRefs } from 'vue'
import { isEmpty } from '@/utils/util'
import { useRouter } from 'vue-router'
import TradeBtn from './TradeBtn.vue'
import Image from './Image'

export default {
    components: { TradeBtn ,Image},
    props: {
        data: {
            type: Array,
            default: () => {
                return []
            }
        },
        loading: {
            type: Boolean,
            default: false
        },
        refresh: {
            type: Boolean,
            default: false
        },
        finished: {
            type: Boolean,
            default: false
        }
    },
    setup (props, { emit }) {
        const router = useRouter()

        const state = reactive({
            // loadingNt: false,
            isError: false,
            errorTip: '',
            isEmpty
        })

        const goNewsDetail = (id) => {
            router.push({ name: 'InfoDetail', query: { id } })
        }

        const onRefresh = () => {
            emit('onRefresh', 0)
        }

        const onLoad = () => {
            emit('onLoad', 0)
        }

        return {
            goNewsDetail,
            onLoad,
            onRefresh,
            ...toRefs(state)
        }
    }
}
</script>

<style lang="scss" scoped>
@import "@/sass/mixin.scss";
.card-item {
    display: flex;
    background: var(--contentColor);
    padding: rem(12px) rem(17px);
    box-sizing: border-box;
    // & > img {
    //     width: rem(226px);
    //     height: rem(167px);
    //     object-fit: cover;
    //     background: var(--colorddd);
    // }
    & > .itemImg {
        width: rem(226px);
        height: rem(167px);
        overflow: hidden;
        display: block;
    }
    & > .itemContent {
        flex: 1;
        padding: rem(10px) 0 0 rem(20px);
        & > .itemTitle {
            font-size: rem(30px);
            font-weight: bold;
            color: var(--primaryText);
            @include ellipsisLn(2);
            //width: rem(490px);
            & > span:last-of-type {
                font-size: rem(44px);
                margin-left: rem(10px);
            }
        }
        & > .relatedTrade {
            font-size: rem(22px);
            color: var(--primaryText);
            margin-bottom: rem(12px);
            @include ellipsis;
            //width: rem(490px);
        }
        & > .card-item {
            display: flex;
            & > span {
                width: auto;
                height: rem(42px);
                border-radius: rem(10px);
                color: var(--primaryText);
                background: var(--cellBg);
                display: flex;
                align-items: center;
                padding: 0 rem(30px);
                margin-right: rem(12px);
                font-size: rem(22px);
                &:last-of-type {
                    margin-right: 0;
                }
            }
        }
    }
}
</style>
