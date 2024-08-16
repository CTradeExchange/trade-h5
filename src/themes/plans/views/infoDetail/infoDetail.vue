<template>
    <div class="infoDetailBox">
        <LayoutTop v-if="!isUniapp" :title="$t('news.hotTopicTitle')" />
        <!-- <div v-if='loading' class='loading-box'>
            <van-loading type='spinner' />
        </div> -->
        <loading :show="loading" />
        <div v-if="info?.ContentType === 1" class='detailPage'>
            <TitleCard :info='info' />
            <ContCard :info='info' @viewPoint='viewPoint' />
            <ComCoundown v-if='hasRace' :data='raceInfo' @click='$router.push(`/competition?id=${raceInfo.ID}`)' />
            <TradeList class='trade-card' :trades='info.Trades' />
            <NewsCard class='news-card' :info='info' />
        </div>
        <div v-else-if="info?.ContentType === 2" class="iframe-body" :style="{ height: isUniapp ? '100%' : 'calc(100% - rem(110px))' }">
            <EmbedIframe v-if="detail.EmbedLink" :Link="detail.EmbedLink" :Extra="detail.EmbedExtra" :Source="detail.EmbedSource"  />
            <TradeList class='trade-card' :trades='info.Trades' :embed="info.EmbedButton" :link='true' />
            <ModelNFP/>
            <!-- <ModelCPI/> -->
            <!-- <Model/> -->
        </div>
    </div>
</template>

<script>
import { toRefs, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getCookie, getPathParams, isEmpty } from '@/utils/util.js'
import { useStore } from 'vuex'
import { GetItemByID, postViewPoint, getAcitiveListByItemID } from '@/api/newApi'

import TitleCard from './components/TitleCard.vue'
import ContCard from './components/ContCard.vue'
import NewsCard from './components/NewsCard.vue'
import TradeList from '@plans/components/TradeList'
import ComCoundown from '@plans/components/competitionCoutdown.vue'
import EmbedIframe from '@/components/embedIframe.vue'
import ModelNFP from "@plans/views/infoDetail/components/modelTemplate/modelNFP.vue";
import ModelCPI from "@plans/views/infoDetail/components/modelTemplate/modelCPI.vue";
import Model from "@plans/views/infoDetail/components/modelTemplate/model.vue";


export default {
    components: {
        TitleCard,
        ContCard,
        NewsCard,
        TradeList,
        ComCoundown,
        EmbedIframe,
        ModelNFP,
        ModelCPI,
        Model
    },
    setup () {
        const store = useStore()
        const route = useRoute()
        const router = useRouter()
        const { id } = route.query || {}
        const { isUniapp } = getPathParams()
        const state = reactive({
            loading: true,
            info: {},
            newsPage: 1,
            newsList: [],
            raceInfo: {},
            hasRace: false,
            countDownTime: 0,
            prize: 0,
           
        })

        const customerInfo = computed(
            () => store.state._user.customerInfo
        )

        const detail = computed(() => {
            const language = getCookie('lang') || 'en-US'
            const { ItemLanguages } = state.info
            const currentItem = !isEmpty(ItemLanguages) ? ItemLanguages.find(i => i.Language === language) ? ItemLanguages.find(i => i.Language === language) : ItemLanguages[0] : {}
            const { EmbedLink, EmbedExtra, EmbedSource } = currentItem || {}
            return { EmbedLink, EmbedExtra, EmbedSource }
        })

        const getInfo = (ID) => {
            state.loading = true
            GetItemByID({ body: { ID: Number(ID), Language: getCookie('lang') || 'en-US' } }).then((res) => {
                const { Item } = res || {}
                state.info = Item
                state.loading = false
            }).catch(err => {
                state.loading = false
            })
        }

        const viewPoint = (ID) => {
            if (!ID) return
            const { customerNo } = customerInfo?.value || {}
            if (!customerNo) {
                router.push(`/login?back=infoDetail?id=${id}`)
                return
            }
            postViewPoint({ body: { ID } }).then((res) => {
                if (res.Code === 1000) {
                    getInfo(id)
                }
            })
        }

        const getActiveList = () => {
            const body = { ItemID: Number(id) }
            getAcitiveListByItemID({ body }).then(res => {
                const { Code, Data } = res || {}
                if (Code === 1000) {
                    state.raceInfo = Data[0] || {}
                    state.prize = Data[0]?.RewardsPool + Data[0]?.RewardsPoolOther
                    if (!isEmpty(state.raceInfo)) {
                        state.hasRace = true
                        state.countDownTime = state.raceInfo.EndTime - new Date().getTime()
                    } else {
                        state.hasRace = false
                    }
                }
            })
        }

        onMounted(() => {
            if (!id) {
                router.go(-1)
                return
            }
            getActiveList()
            getInfo(id)
        })

        return {
            detail,
            viewPoint,
            isUniapp,
            ...toRefs(state)
        }
    }
}
</script>

<style scoped lang="scss">
.infoDetailBox {
    height: 100%;
    display: flex;
    flex-direction: column;
}
.loading-box{
    flex:1;
    display: flex;
    align-items: center;
    justify-content: center;
}
.iframe-body {
    flex: 1;
    overflow-y: auto;
    padding: rem(20px) 0;
    .iframe-box-other {
        padding: 0 rem(20px) rem(20px);
    }
    &::-webkit-scrollbar {
        display: none;
    }
}
.detailPage{
    .trade-card{
        padding:rem(20px);
    }
    .news-card{
        padding:rem(20px)
    }
    .cup-bg{
        position: relative;
        margin:  rem(20px);
        img{
            width: 100%;
        }
        .cup-content{
            position: absolute;
            top:0;
            left:0;
            bottom:0;
            right:0;
            padding-left:rem(150px);
            display: flex;
            flex-direction: column;
            justify-content: center;
            .rest-round{
                font-size: rem(24px);
                line-height: rem(40px);
                color: var(--contentColor);
                opacity: 0.5;
                display: flex;
                &>span{
                    margin-right:rem(30px)
                }
                :deep{
                    .van-count-down{
                        font-size: unset;
                        color:unset
                    }
                }
            }
            .current-prize{
                font-weight: 500;
                font-size: rem(28px);
                line-height: rem(40px);
                color: var(--contentColor);
            }
        }
    }
}
.headerTop {
    height: rem(110px);
}

</style>
