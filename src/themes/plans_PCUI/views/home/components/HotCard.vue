<template>
    <div style='justify-content: center;'>
        <van-pull-refresh
            v-model='refresh'
            :loading-text="$t('compLang.loading')"
            :loosing-text="$t('compLang.vanPullRefresh.loosing')"
            :pulling-text="$t('compLang.vanPullRefresh.pulling')"
            @refresh='onRefresh'
        >
            <div v-if='isEmpty(data) && !loading'>
            </div>

            <van-list
                v-else
                v-model:error='isError'
                v-model:loading='loading'
                class='topicInfo'
                :error-text='errorTip'
                :finished='finished'
                :finished-text="$t('common.noMore')"
                :loading-text="$t('compLang.loading')"
                :offset='10'
                @load='onLoad'
            >
                <div
                    v-for='(item, index) in data'
                    :key='index'
                    class='card-item'
                    @click='goNewsDetail(item.ID)'
                >
                    <!--<Image alt='' class='itemImg' mode='cover' :src='item.CoverURL' />-->
                    <div class='itemContent' :style="{ '--bgImg': `url(${item.CoverURL})` }">
                        <div class='itemTitle'>
                            <span>{{ `NO.${index + 2}` }}</span>
                            <span>{{ item.Title }}</span>
                            <p class='tradesName'>
                                {{ item.Trades[0].Name }}
                            </p>
                        </div>
                        <TradeBtn :data='item' position='item' />
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
    components: { TradeBtn, Image },
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

.topicInfo{
  display: flex;
}
.card-item {
    display: flex;
    background: var(--contentColor);
    padding: rem(12px) rem(17px);
    box-sizing: border-box;
    width: 380px;
    height: 210px;
    // & > img {
    //     width: rem(226px);
    //     height: rem(167px);
    //     object-fit: cover;
    //     background: var(--colorddd);
    // }
    & > .itemImg {
        width: rem(380px);
        height: rem(210px);
        overflow: hidden;
        display: block;
    }
    & > .itemContent {
        flex: 1;
        padding: rem(10px) 0 0 rem(20px);
        background-image: var(--bgImg);
        background-size: 100% 100%;
        -webkit-border-radius: 8px;
        & > .itemTitle {
            font-size: rem(30px);
            font-weight: bold;
            color: #fff;
            position:absolute;
            bottom:0;
            @include ellipsisLn(2);
            .tradesName{
              border: 1px solid #fff;
            }
            //width: rem(490px);
            & > span:last-of-type {
                font-size: rem(44px);
                margin-left: rem(10px);
            }
        }
        & > .relatedTrade {
            font-size: rem(22px);
            color: #fff;
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
