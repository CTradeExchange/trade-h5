<template>
    <div style='overflow: hidden'>
        <router-view />
        <Loading :show='loading' />
        <div v-if='!loading' class='info-detail'>
            <div class='banner'>
                <div style='background-color: rgba(0,0,0,0.5);'>
                    <!--<h1>{{ info.Title }}</h1>-->
                    <h1>{{ `${$t("bannerTopic.title1")}` }}<br />{{ `${$t("bannerTopic.title2")}` }}</h1>
                    <p>{{ `${$t("bannerTopic.title3")}` }}</p>
                </div>
            </div>
            <div class='detailPage'>
                <!--<div class='page-title'>
                {{ info.Title }}
            </div>
            <div class='user-join'>
                <span>{{ $t('news.userJoin',{ allVotes: info.TotalLikeCount }) }}</span>          -舊的，不要的
                <span>{{ dayjs(info.PublishTime*1000).format('YYYY-MM-DD HH:mm:ss') }}</span>     -新的，需要的
            </div> -->
                <div class='topic-label'>
                    {{ `${$t("news.topicDesc")}` }}
                </div>
                <div class='content'>
                    <!--<div class='ql-editor' v-html='info.Content'></div>-->
                    <p class='text'>
                        {{ `${$t("bannerTopic.content")}` }} <span class='red'>
                            {{ `${$t("bannerTopic.content2")}` }}
                        </span>
                    </p>
                    <!--<div class='ql-editor' v-html='info.Content'></div>-->
                    <el-row :gutter='10' style='justify-content: center; padding: 20px 0'>
                        <el-col
                            :lg='7'
                            :md='8'
                            :sm='9'
                            style='text-align: center;'
                            :xl='6'
                            :xs='20'
                        >
                            <el-button class='tradeContainer tradeBtn' @click='jumpPage(1)'>
                                <p class='tradeBtn'>
                                    {{ `${$t("bannerTopic.tradeNow")}` }}
                                </p>
                            </el-button>
                        </el-col>
                        <el-col
                            :lg='7'
                            :md='8'
                            :sm='9'
                            style='text-align: center;'
                            :xl='6'
                            :xs='20'
                        >
                            <el-button class='depositContainer depositBtn' @click.stop='handleSkip()'>
                                <p>
                                    {{ `${$t("bannerTopic.deposit")}` }}
                                </p>
                            </el-button>
                        </el-col>
                    </el-row>
                    <el-row :gutter='10' style='justify-content: center; padding: 20px 0'>
                        <video
                            id='video'
                            autoplay
                            class='iframe-player'
                            controls
                            controlsList='nodownload footbar noplaybackrate'
                            disablePictureInPicture
                            loop
                            muted
                            :poster='videoCover'
                            src='https://www.headline.net/wp-content/uploads/2023/06/ECB30June2.mp4'
                        ></video>
                    </el-row>

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
                <!-- <TradeCard :trades='info.Trades' />暫時隱藏-->
                <!-- <TradeList :trades='info.Trades' /> -->
                <NewsCard :info='info' />
            </div>
            <div class='container'>
                <img alt='banner' class='bannerImg' src='../../images/cpi1/topic/bannerImg.jpg' />
                <div class='tradeCardContainer'>
                    <TradeCard class='tradeCard' :trades='info.Trades' />
                </div>
            </div>
            <partnerContainer />
        </div>
    </div>
</template>

<script>
import partnerContainer from './components/partner.vue'
import { onMounted, toRefs, reactive, watch, computed } from 'vue'
import { GetItems, GetItemByID, postViewPoint, getAcitiveListByItemID } from '@/api/newApi'
import NewsCard from './components/NewsCard.vue'
import TradeCard from './components/BannerRelatedProductListCard.vue'
// import TradeList from '@planspc/components/TradeList'
import VoteCard from './components/VoteCard.vue'
import { useRoute, useRouter } from 'vue-router'
import { localGet, isEmpty, getCookie } from '@/utils/util.js'
import { useStore } from 'vuex'
import dayjs from 'dayjs'
import cupBg from '@planspc/views/competition/assets/cup-bg.png'
import ComCountdown from '@planspc/components/competitionCountdown.vue'
export default {
    components: {
        NewsCard,
        TradeCard,
        VoteCard,
        ComCountdown,
        partnerContainer,

    },
    setup () {
        const store = useStore()
        const route = useRoute()
        const router = useRouter()
        const { id } = route.query || {}
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
                const { ItemLanguages, Trades, ViewpointID, Viewpoints, UserPortrait, TotalLikeCount } = Item || {}
                let obj = {}
                if (!isEmpty(ItemLanguages)) {
                    obj = ItemLanguages[0] || {}
                }
                const { Content, Keywords, PublishTime, Source, SourceURL, Title } = obj || {}
                state.info = { Trades, ViewpointID, Viewpoints, UserPortrait, Content, Keywords, PublishTime, Source, SourceURL, Title, TotalLikeCount, ID }
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

        const jumpPage = (attr) => {
            switch (attr) {
                case 1 :
                    location.replace('https://www.headline.net/en-US/order?symbolId=1437&tradeType=2&name=EUR/USD')
                    break
            }
        }

        const handleSkip = (flag) => {
            if (!customerInfo.value?.customerNo) {
                router.push('/login')
            } else if (!flag) {
                location.replace('https://www.headline.net/en-US/assets')
            } else {
                state.show = !state.show
            }
        }
        return {
            cupBg,
            dayjs,
            confirmVote,
            getActiveList,
            jumpPage,
            handleSkip,
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

.tradeCardContainer{
  justify-content: center;
  display: flex;
  .tradeCard{
    max-width: 960px !important;
    width: 100%;
    bottom: 80px;
  }
}
.content{
  .text{
    font-size: 18px;
    color: #000;
    line-height: 1.5em;
    .red{
      color: #cb0d11;
      font-weight: bold;
    }
  }
}
.topic-label{
    font-size: 35px;
    color:  #BB2423;
    font-weight: bold;
    padding-top: 50px;
  }

  .iframe-player{
  width: 100%;
  aspect-ratio: 16 / 9;
}

  .tradeContainer{
      background-color: #000 !important;
      color: #fff;
      border-radius: unset !important;
      width: 188px;
      height: 34px;
      font-size: 18px;
      font-weight: bold;
    }
    .depositContainer{
      background-color: #BB2423 !important;
      color: #fff;
      border-radius: unset !important;
      width: 188px;
      height: 34px;
      font-size: 18px;
      font-weight: bold;
    }
    .depositContainer:hover{
      background-color: #fff !important;
      border: 1px solid #000;
      color:#000
    }
    .tradeContainer:hover{
      background-color: #fff !important;
      border: 1px solid #000;
      color:#000
    }

.info-detail{
    width: 100%;
    background: rgb(237, 237, 237);
    flex:1;
    .banner{
        background-image: url("../.././images/topicBanner/topicBannerImg.jpg");
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center center;
        h1{
          color: #F3BE42;
          font-size: 70px;
          text-align: center;
          padding-top: 50px;
        }
        p{
          color: #fff;
          font-size: 50px;
          text-align: center;
          padding-bottom: 50px;
          font-weight: bold;
        }
    }
    .bannerImg{
    width: 100%;
    height: 205px;
    object-fit: cover;
    position: relative;
    top: 50px;
    }
}
.detailPage{
    margin: 0 auto;
    max-width: 960px;
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

@media screen and (max-width: 1100px) {
  .info-detail{
    .banner{
        h1{
          font-size: 60px;
        }
        p{
          font-size: 40px;
        }
    }
  }
}

@media screen and (max-width: 850px) {
  .info-detail{
    .banner{
        h1{
          font-size: 50px;
        }
        p{
          font-size: 30px;
        }
    }
  }
  .topic-label{
    font-size: 25px;
  }
  .content{
    .text{
      font-size: 16px;
    }
  }
}

@media screen and (max-width: 767px) {
  .depositContainer{
    margin-top: 10px;
  }
}

@media screen and (max-width: 700px) {
  .info-detail{
    .banner{
        h1{
          font-size: 40px;
        }
        p{
          font-size: 25px;
        }
    }
  }
}
</style>
