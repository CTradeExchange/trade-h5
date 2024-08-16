<template>
    <router-view />
    <Loading :show='loading' />
    <div v-if='!loading' class='info-detail'>
        <div v-if='info.ContentType === 2' class='iframe-box'>
            <EmbedIframe v-if='info.EmbedLink' :extra='info.EmbedExtra' :link='info.EmbedLink' :source='info.EmbedSource' />
            <div class='trade-back'></div>
            <div class='trade-box'>
                <TradeCard :embed='info.EmbedButton' :link='true' :trades='info.Trades' />
            </div>
            <!-- <ModelNFP/> -->
            <!-- <ModelCPI/> -->
            <Model />
        </div>
        <div v-if='info.ContentType === 1||info.ContentType === 2' class='detailPage'>
            <div class='page-title'>
                {{ info.Title }}
            </div>
            <div class='user-join'>
                <!-- <span>{{ $t('news.userJoin',{ allVotes: info.TotalLikeCount }) }}</span> -->
                <span>{{ dayjs(info.PublishTime*1000).format('YYYY-MM-DD HH:mm:ss') }}</span>
            </div>
            <div class='topic-label'>
                {{ `#${$t("news.topicDesc")}` }}
            </div>
            <div class='content'>
                <div class='ql-editor' v-html='info.Content'></div>
                <a
                    v-if='info.SourceURL'
                    class='seeSource'
                    :href='info.SourceURL'
                    target='_blank'
                >
                    {{ $t("news.seeSource") }}
                </a>
            </div>
            <VoteCard :info='info' @confirm='confirmVote' />
            <ComCountdown :data='raceInfo' @click='$router.push(`/competition?id=${raceInfo.ID}`)' @finish='getActiveList' />
            <TradeCard :trades='info.Trades' />
            <!-- <TradeList :trades='info.Trades' /> -->
            <NewsCard :info='info' />
        </div>
    </div>
</template>

<script>
import { GetItemByID, postViewPoint, getAcitiveListByItemID } from '@/api/newApi'
import { onMounted, toRefs, reactive, computed } from 'vue'
import NewsCard from './components/NewsCard.vue'
import TradeCard from './components/RelatedProductListCard.vue'
// import TradeList from '@planspc/components/TradeList'
import VoteCard from './components/VoteCard.vue'
import { useRoute, useRouter } from 'vue-router'
import { isEmpty, getCookie } from '@/utils/util.js'
import cupBg from '@planspc/views/competition/assets/cup-bg.png'
import ComCountdown from '@planspc/components/competitionCountdown.vue'
import EmbedIframe from '@/components/embedIframePC.vue'
import ModelNFP from './components/modelTemplate/modelNFP.vue'
import ModelCPI from './components/modelTemplate/modelCPI.vue'
import Model from './components/modelTemplate/model.vue'

import { useStore } from 'vuex'
import dayjs from 'dayjs'

export default {
    components: {
        NewsCard,
        TradeCard,
        VoteCard,
        ComCountdown,
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
        if (!id) router.replace('/home')
        const state = reactive({
            headerStyle: { height: 'rem(90px)' },
            info: {},
            newsPage: 1,
            newsList: [],
            loading: false,
            raceInfo: {},
            prize: 0,
            hasRace: false,
            countDownTime: 0

        })

        const customerInfo = computed(
            () => store.state._user.customerInfo
        )
        const getInfo = (ID) => {
            state.loading = true
            GetItemByID({ body: { ID: Number(ID), Language: getCookie('lang') || 'en-US' } }).then((res) => {
                const { Item, SupportedLanguages } = res || {}
                const { ItemLanguages, Trades, ViewpointID, Viewpoints, UserPortrait, TotalLikeCount, ContentType, EmbedButton } = Item || {}
                let obj = {}
                if (!isEmpty(ItemLanguages)) {
                    obj = ItemLanguages[0] || {}
                }
                const { Content, Keywords, PublishTime, Source, SourceURL, Title, EmbedLink, EmbedExtra, EmbedSource } = obj || {}
                state.info = { Trades, ViewpointID, Viewpoints, UserPortrait, Content, Keywords, PublishTime, Source, SourceURL, Title, TotalLikeCount, ID, ContentType, EmbedLink, EmbedExtra, EmbedSource, EmbedButton }
                state.loading = false
                store.commit('_base/Update_supportedLanguages', SupportedLanguages)
            }).catch(err => {
                state.loading = false
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

        const confirmVote = (ID) => {
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

        onMounted(() => {
            if (!id) {
                router.go(-1)
            }
            getActiveList()
            getInfo(id)
        })
        return {
            cupBg,
            dayjs,
            confirmVote,
            getActiveList,
          ...toRefs(state)
        }
    }
}
</script>

<style lang="scss">
@import '@/sass/quill.scss';
</style>

<style scoped lang="scss">
@import "@/sass/mixin.scss";
.info-detail{
    width: 100%;
    overflow-x: auto;
    background: var(--contentColor);
    @include scroll-bar-horizontal();
}
.iframe-box {
    min-width: 1280px;
    background: var(--cardBg);
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: hidden;
}
.detailPage{
    margin: 0 auto;
    max-width: 960px;
    min-width: 960px;
    padding:20px 30px 30px 30px;
    flex:1;
    .cup-bg{
        position: relative;
        cursor: pointer;
        img{
            width: 100%;
        }
        .cup-content{
            position: absolute;
            top:0;
            left:0;
            bottom:0;
            right:0;
            padding-left:130px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            .rest-round{
                font-size: 20px;
                line-height: 20px;
                color: var(--contentColor);
                opacity: 0.5;
                display:flex;
                &>span{
                    margin-right:5px;
                }
                :deep{
                    .el-statistic__number{
                        color:var(--contentColor);
                        font-size: 16px;
                    }
                }
            }
            .current-prize{
                font-weight: 600;
                font-size: 24px;
                line-height: 20px;
                color: var(--contentColor);
                margin-top:10px;
            }
        }
    }
    .page-title{
        font-size: 30px;
        color:var(--mainColor);
        @include ellipsisLn(2);

    }
    .user-join{
        font-size: 12px;
        margin:24px 0;
        &>span:first-of-type{
            color:var(--mainColor);
            margin-right: 10px;
        }
        &>span:last-of-type{
            color:var(--color80)

        }
        .user-join{
            font-size: 12px;
            margin:24px 0;
            &>span:first-of-type{
                color:var(--mainColor);
                margin-right: 10px;
            }
            &>span:last-of-type{
                color:var(--color80)

            }
        }
        .topic-label{
            font-size: 18px;
            color: var(--primary);
        }
        .content{
            color:var(--color3c);
            font-size:14px;
            padding: 15px 0;
            line-height: 1.5;
            .seeSource{
                color: var(--color2);
            }
        }
    }
}
.trade-back {
    background-image: url(../../../../assets/newUI/dbg.png);
    width: 100%;
    height: 162px;
    background-repeat: no-repeat;
    background-size: 100%;
}
.trade-box {
    margin-top: -126px;
    min-height: 126px;
}

</style>
