<template>
    <div class='event-detail'>
        <div id='iframebBodyID' class='iframe-box'>
            <!-- <EmbedIframe v-if='info.EmbedLink' :extra='info.EmbedExtra' :link='info.EmbedLink' /> -->
            <EmbedIframeMOB v-if='info.EmbedLink' :extra='info.EmbedExtra' :link='info.EmbedLink' :refresh='refreshFlag' :source='info.EmbedSource' />

            <div v-else class='my-pape'>
                <div class='my-pape-title'>
                    <h4>{{ info.Title }}</h4>
                </div>
                <div class='my-pape-content' v-html='info.Content'></div>
            </div>
        </div>

        <div v-if='list&&list.length<2' id='cardBoxID' class='token-detail'>
            <div class='token-detail-title'>
                <div class='token-detail-title-box'>
                    <span>{{ 'Name/code' }}</span>
                </div>

                <div class='token-detail-title-box'>
                    <span>{{ 'Latesrt price' }}</span>
                </div>
                <div class='token-detail-title-box'>
                    <span>{{ '24H change%' }}</span>
                </div>
            </div>
            <div class='token-detail-list'>
                <div v-for='(item,index) in list' :key='index' class='token-list-item' @click.stop='goToDetail(item)'>
                    <div :class="['token-list-item-box', 'name']">
                        {{ item.symbolName }}
                    </div>
                    <div :class="['token-list-item-box', 'price']">
                        {{ item.rolling_last_price }}
                    </div>
                    <div :class="['token-list-item-box', 'updown',item.rolling_upDownColor]">
                        {{ !item.rolling_upDownWidth && item.rolling_upDownWidth != 0 ? '- -' : item.rolling_upDownWidth }}
                    </div>
                </div>
            </div>
        </div>
        <div v-else-if='list&&list.length>1' id='cardBoxID' class='events-item-token'>
            <div v-for='(k, i) in list' :key='i' class='events-item-token-item' @click.stop='goToDetail(k)'>
                <span class='token-name'>
                    {{ k.symbolName }}
                </span>
                <span class='token-price'>
                    {{ k.rolling_last_price }}
                </span>
                <span :class="['token-ups-and-downs', k.rolling_upDownColor]">
                    {{ !k.rolling_upDownWidth && k.rolling_upDownWidth != 0 ? '- -' : k.rolling_upDownWidth }}
                </span>
            </div>
        </div>
    </div>
</template>

<script>
import { reactive, toRefs, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getProductList, isEmpty, getCookie } from '@/utils/util.js'
import { QuoteSocket } from '@/plugins/socket/socket'
import { GetItemByID } from '@/api/newApi'
import EmbedIframeMOB from '@/components/embedIframeMoForPc.vue'

import { useStore } from 'vuex'

export default {
    components: {
        EmbedIframeMOB
    },
    props: {
        selectData: {
            type: Object,
            default: () => {},
        },
    },
    setup (props) {
        const router = useRouter()
        const store = useStore()
        const state = reactive({
            list: [],
            productList: [],
            productKeys: [],
            SourceURL: '',
            itemID: '',
            info: {},
            refreshFlag: 1,
        })

        const goToDetail = (item) => {
            const { symbolId, symbolName, tradeType } = item || {}
            if (!symbolId) return
            router.push(`/order?name=${symbolName || ''}&symbolId=${symbolId || ''}&tradeType=${tradeType}`)
        }

        // watch(
        //     () => props.selectData,
        //     (newVal) => {
        //         if (JSON.stringify(newVal) !== '{}') {
        //             const productList = getProductList(newVal?.Trades) || []
        //             const { ExternalLink, ItemID } = newVal || {}
        //             if (ExternalLink) {
        //                 state.SourceURL = ExternalLink
        //             } else {
        //                 state.ItemID = ItemID
        //                 ItemID && getInfo(ItemID)
        //             }
        //             const symbolKeys = productList.map((i) => i.symbolKey)
        //             state.list = productList

        //             if (!isEmpty(symbolKeys)) {
        //                 QuoteSocket.send_subscribe24H(symbolKeys)
        //             }
        //         }
        //     },
        //     { immediate: true },
        // )

        onMounted(() => {
            if (JSON.stringify(props.selectData) !== '{}') {
                // console.log('🚀 ~ file: eventDetail.vue:119 ~ onMounted ~ props.selectData:', props.selectData)
                const productList = getProductList(props.selectData?.Trades) || []
                const { EmbedLink, ItemID } = props.selectData || {}
                // state.SourceURL = SourceURL
                getInfo(ItemID)
                const symbolKeys = productList.map((i) => i.symbolKey)
                state.list = productList

                if (!isEmpty(symbolKeys)) {
                    QuoteSocket.send_subscribe24H(symbolKeys)
                }
            }
        })

        // const getInfo = (ID) => {
        //     // state.loading = true
        //     GetItemByID({ body: { ID: Number(ID), Language: getCookie('lang') || 'en-US' } }).then((res) => {
        //         const { Item, SupportedLanguages } = res || {}
        //         const { ItemLanguages, Trades, ViewpointID, Viewpoints, UserPortrait, TotalLikeCount, ContentType, EmbedButton } = Item || {}
        //         let obj = {}
        //         if (!isEmpty(ItemLanguages)) {
        //             obj = ItemLanguages[0] || {}
        //         }
        //         const { Content, Keywords, PublishTime, Source, SourceURL, Title, EmbedLink, EmbedExtra, EmbedSource } = obj || {}
        //         state.info = { Trades, ViewpointID, Viewpoints, UserPortrait, Content, Keywords, PublishTime, Source, SourceURL, Title, TotalLikeCount, ID, ContentType, EmbedLink, EmbedExtra, EmbedSource, EmbedButton }
        //         // console.log('🚀state.info:-----------》', state.info)
        //         // state.loading = false
        //         // store.commit('_base/Update_supportedLanguages', SupportedLanguages)
        //     }).catch(err => {
        //         // state.loading = false
        //     })
        // }

        const getInfo = (ID) => {
            state.loading = true
            GetItemByID({ body: { ID: Number(50299), Language: getCookie('lang') || 'en-US' } }).then((res) => {
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

        // const handleClickBanner = (item) => {

        //     const { ExternalLink, ItemID } = item || {}
        //     if (ExternalLink) {
        //         // window.open(ExternalLink)
        //         state.activeLink = ExternalLink
        //     } else {
        //         // ItemID &&
        //         //     router.push({
        //         //         name: 'InfoDetail',
        //         //         query: { id: ItemID }
        //         //     })
        //     }
        // }

        return {
            goToDetail,
          ...toRefs(state),
        }
    },
}
</script>

<style scoped lang="scss">
iframe {
  width: 100%;
  height: 100%;
}
.event-detail {
  height: 90vh;
  display: flex;
  flex-direction: column;
  .iframe-box {
      width: 100%;
    height: calc(100% - 174px);
      overflow: auto;
      @include scroll();
      .my-pape{
        padding:30px 10px;
        .my-pape-title{
          &>h4{
            font-size:24px;
            line-height:30px;
            // text-align:center;
            color:var(--primary)
          }
        }
        .my-pape-content{
            font-size:14px;
            margin-top:20px;
            padding:0 10px;
        }
      }
  }
  .token-detail {
      // height:174px;
      padding:0 10px;
      padding-top:20px;
      border-top:1px solid var(--fafColor);
      width: 100%;
      display: flex;
      flex-direction: column;
      .token-detail-title {
          height: 30px;
          display: flex;
          justify-content: space-between;
          .token-detail-title-box {
              width: 33%;
              display: flex;
              & > span {
                  color: #999;
                  font-family: 'Roboto';
                  font-size: 12px;
                  font-weight: 400;
              }
          }
      }
      .token-detail-list {
          width: 100%;
          display: flex;
          flex-direction: column;
          .token-list-item {
              width: 100%;
              display: flex;
              justify-content: space-between;
              .token-list-item-box {
                  min-height:30px;
                  margin-bottom:6px;
                  width: 100%;
                  display: flex;
                  align-items:center;
                  &.name {
                      color: var(--mainColor);
                      font-family: 'Arial';
                      font-size: 14px;
                      font-weight: 700;
                  }
                  &.price {
                      font-family: 'Roboto';
                      font-size: 14px;
                  }
                  &.updown {
                      font-family: 'Roboto';
                      font-size: 14px;
                  }
              }
          }
      }
  }
}
.events-item-token {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  // padding: 10px 0;
  .events-item-token-item {
      min-height: 102px;
      border-radius: 4px;
      background-color: var(--fafColor);
      flex: 1;
      min-width: 46%;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 10px;
      margin: 5px;
      .token-name {
          color: var(--mainColor);
          font-family: 'DM Sans';
          font-size: 14px;
          font-style: normal;
          font-weight: 700;
          line-height: 24px;
      }
      .token-price {
          color: var(--mainColor);
          font-family: 'DM Sans';
          font-size: 18px;
          font-style: normal;
          font-weight: 700;
          line-height: 24px;
          margin-bottom: 6px;
      }
      .token-ups-and-downs {
          color: var(--normalColor);
          font-family: 'DM Sans';
          font-size: 14px;
          font-style: normal;
          font-weight: 700;
          line-height: 24px;
      }
  }
}
</style>
