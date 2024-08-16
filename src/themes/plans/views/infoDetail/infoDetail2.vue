<template>
    <LayoutTop :title="$t('news.hotTopicTitle')" />
    <div v-if='loading' class='loading-box'>
        <van-loading type='spinner' />
    </div>
    <div v-else class='detailPage'>
        <div class='banner'>
            <div style='background-color: rgba(0,0,0,0.5);'>
                <!--<h1>{{ info.Title }}</h1>-->
                <h1>{{ `${$t("bannerTopic.title1")}` }}<br />{{ `${$t("bannerTopic.title2")}` }}</h1>
                <p>{{ `${$t("bannerTopic.title3")}` }}</p>
            </div>
        </div>
        <ContCard :info='info' @viewPoint='viewPoint' />

        <ComCoundown v-if='hasRace' :data='raceInfo' @click='$router.push(`/competition?id=${raceInfo.ID}`)' />
        <TradeList class='trade-card' :trades='info.Trades' />
        <NewsCard class='news-card' :info='info' />
    </div>
    <partnerContainer />
</template>

<script>
import partnerContainer from './components/partner.vue'
import { toRefs, reactive, computed, onMounted } from 'vue'
import { GetItemByID, postViewPoint, getAcitiveListByItemID } from '@/api/newApi'
import TitleCard from './components/TitleCard.vue'
import ContCard from './components/ContCardTopic.vue'
import NewsCard from './components/NewsCard.vue'
import TradeList from '@plans/components/TradeList'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { getCookie, isEmpty } from '@/utils/util.js'
import ComCoundown from '@plans/components/competitionCoutdown.vue'
export default {
    components: {
        TitleCard,
        ContCard,
        NewsCard,
        TradeList,
        partnerContainer,
        ComCoundown
    },
    setup () {
        const store = useStore()
        const route = useRoute()
        const router = useRouter()
        const { id } = route.query || {}
        const state = reactive({
            loading: true,
            info: {},
            newsPage: 1,
            newsList: [],
            raceInfo: {},
            hasRace: false,
            countDownTime: 0,
            prize: 0
        })

        const customerInfo = computed(
            () => store.state._user.customerInfo
        )
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
            viewPoint,
            ...toRefs(state)
        }
    }
}
</script>

<style scoped lang="scss">
.banner{
        background-image: url("../.././images/cpi1/topicBanner/topicBannerImg.jpg");
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center center;
        h1{
          color: #F3BE42;
          font-size: 40px;
          text-align: center;
          padding-top: 50px;
        }
        p{
          color: #fff;
          font-size: 25px;
          text-align: center;
          padding-bottom: 50px;
          font-weight: bold;
        }
    }
.loading-box{
    flex:1;
    display: flex;
    align-items: center;
    justify-content: center;
}
.detailPage{
    padding-bottom: rem(110px);
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
                //margin-top:10px;
            }
        }
    }
}
.headerTop {
    height: rem(110px);
}
</style>
