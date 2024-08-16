<template>
    <div class='cpiPart1'>
        <div class='part2'>
            <el-row class='titleContainer'>
                <el-col
                    :lg='5'
                    :md='0'
                    :xl='5'
                >
                    <img alt='bear' class='animals' src='../../../images/cpi1/bull.png' />
                </el-col>
                <el-col
                    class='challenge'
                    :lg='12'
                    :md='20'
                    :sm='20'
                    :xl='10'
                    :xs='20'
                >
                    <div class='challenge'>
                        <h1 class='title1'>
                            {{ `${$t("bannerTopic.title4")}` }}
                        </h1>
                        <h1>{{ `${$t("bannerTopic.title5")}` }}</h1>
                    </div>
                </el-col>
                <el-col
                    class='animalTwo'
                    :lg='5'
                    :md='0'
                    :xl='5'
                >
                    <img alt='bull' class='animals' src='../../../images/cpi1/bear.png' />
                </el-col>
            </el-row>
        </div>
        <el-row class='cards' :gutter='30'>
            <el-col
                class='cardContainer'
                :lg='7'
                :md='7'
                :sm='22'
                :xl='7'
                :xs='22'
            >
                <el-card class='box-card'>
                    <h1>{{ `${$t("bannerTopic.card1Title")}` }}</h1>
                    <p>
                        {{ `${$t("bannerTopic.card1Content")}` }}
                    </p>
                </el-card>
            </el-col>
            <el-col
                class='cardContainer'
                :lg='7'
                :md='7'
                :sm='22'
                :xl='7'
                :xs='22'
            >
                <el-card class='box-card'>
                    <h1>{{ `${$t("bannerTopic.card2Title")}` }}</h1>
                    <p>{{ `${$t("bannerTopic.card2Content")}` }}</p>
                </el-card>
            </el-col>
            <el-col
                class='cardContainer'
                :lg='7'
                :md='7'
                :sm='22'
                :xl='7'
                :xs='22'
            >
                <el-card class='box-card'>
                    <h1>{{ `${$t("bannerTopic.card3Title")}` }}</h1>
                    <p>{{ `${$t("bannerTopic.card3Content")}` }}</p>
                </el-card>
            </el-col>
        </el-row>
        <el-row :gutter='10' style='justify-content: center; padding: 50px 0 20px'>
            <el-col
                :lg='5'
                :md='6'
                :sm='8'
                style='text-align: center;'
                :xl='3'
                :xs='20'
            >
                <el-button class='tradeContainer tradeBtn' @click='jumpPage(1)'>
                    <p class='tradeBtn'>
                        {{ `${$t("bannerTopic.tradeNow")}` }}
                    </p>
                </el-button>
            </el-col>
            <el-col
                :lg='5'
                :md='6'
                :sm='8'
                style='text-align: center;'
                :xl='3'
                :xs='20'
            >
                <el-button class='depositContainer depositBtn' @click.stop='handleSkip()'>
                    <p>
                        {{ `${$t("bannerTopic.deposit")}` }}
                    </p>
                </el-button>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import { computed, reactive, toRefs, watch } from 'vue'
import { isEmpty, getCookie } from '@/utils/util'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
export default {
    props: {
        info: {
            type: Object,
            default: () => {
                return {}
            }
        }
    },
    setup (props, { emit }) {
        const store = useStore()
        const route = useRoute()
        const router = useRouter()
        const state = reactive({
            type: 1,
            checked: 0,
            isEmpty
        })

        const detail = computed(() => {
            const language = getCookie('lang') || 'en-US'
            const { TotalLikeCount, ItemLanguages } = props.info
            const currentItem = !isEmpty(ItemLanguages) ? ItemLanguages.find(i => i.Language === language) ? ItemLanguages.find(i => i.Language === language) : ItemLanguages[0] : {}
            const { PublishTime, Title, Content, SourceURL } = currentItem || {}
            return { TotalLikeCount, Title, PublishTime, Content, SourceURL }
        })

        const changeRadio = (e) => {
            state.checked = e
        }

        const viewPoint = () => {
            if (props.info.ViewpointID > 0) return
            emit('viewPoint', state.checked)
        }

        const calcPercent = (i) => {
            const { TotalLikeCount } = props.info
            if (!TotalLikeCount) {
                return
            }
            const percent = ((i * 100) / TotalLikeCount).toFixed(2)

            return `${percent}%`
        }

        const getStyleObj = (item) => {
            const { ID, Color: color } = item || {}
            let style1 = {}
            let style2 = {}
            let disabled = false
            if (!color) {
                return {}
            }
            if (props.info.ViewpointID > 0) {
                if (ID === props.info.ViewpointID) {
                    style1 = {
                        color,
                        border: `1px solid ${color}`
                    }
                    style2 = {
                        color
                    }
                } else {
                    style1 = {
                        color: 'var(--colord6)',
                        border: '1px solid var(--cellBg)'
                    }
                    style2 = {
                        color: 'var(--colord6)'
                    }
                    disabled = true
                }
            } else {
                style1 = {
                    color,
                    border: `1px solid ${color}`
                }
                style2 = {
                    color
                }
            }

            return [style1, style2, disabled]
        }

        const getViewpointsItem = (item) => {
            const language = getCookie('lang') || 'en-US'
            const { ViewpointLanguages = [] } = item || {}
            const currentViewpointItem = (ViewpointLanguages || []).find(i => i.Language === language) || ViewpointLanguages[0]
            return currentViewpointItem
        }

        watch(
            () => props.info,
            (news) => {
                const { Viewpoints, ViewpointID } = news || {}
                const { ID } = (Viewpoints && Viewpoints[0]) || {}
                state.checked = ViewpointID || ID
            }, {
                immediate: true
            }
        )

        const jumpPage = (attr) => {
            switch (attr) {
                case 1 :
                    location.replace('https://www.headline.net/en-US/order?symbolId=1437&tradeType=2&name=EUR/USD')
                    break
            }
        }

        const customerInfo = computed(
            () => store.state._user.customerInfo
        )

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
            jumpPage,
            handleSkip,
            ...toRefs(state)
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';

.animals{
      width: 550px;
      filter: invert(74%) sepia(92%) saturate(3855%) hue-rotate(352deg) brightness(87%) contrast(100%);
    }

.cpiPart1{
  .background1{
    background: radial-gradient(circle at 50% 50%, #000000 0%, #7D1817 100%);
    display: flex;
    .bear{
      position: relative;
      right: 50px;
    }
    .bull{
      position: relative;
      right: 50px;
    }
    .bullContainer1{
      align-self: end;
    }
    .heading{
      text-align: center;
      padding: 120px 0;
      z-index: 999;
      h1{
        font-weight: bold;
        font-size: 80px;
        color: #fff;
      }
      p{
        font-size: 35px;
        text-align: center;
        color: #fff;
      }
      .yellow{
        color: #FFF86B;
      }
      .bold{
        font-size: 50px;
      }
      .signUpButton{
        justify-content: center;
        display: flex;
        padding: 40px 0 10px;
      }

      .terms{
        color: #FFF86B;
        font-size: 16px;
      }
      .terms:hover{
        color: #BB2423;
      }
      .part2Button{
        justify-content: center;
        display: flex;
        .part2Button{
          padding: 30px 0;
        }
      }
    }
  }
  .part2{
    display: flex;
    justify-content: center;
    padding: 20px 0;
    .titleContainer{
      justify-content: center;
    }
    .challenge{
      align-self: center;
      text-align: center;
      align-self: center;
      h1{
        font-weight: 600;
        font-size: 40px;
        color: #000;
      }
      .title1{
        color: #BB2423;
        font-size: 56px;
      }
    }
    .animals{
      width: 100%;
    }
  }
  .cards{
    justify-content: center;
    .box-card{
      min-height: 322px;
      border-radius: 25px;
      h1{
        color: #BB2423;
        font-weight: bold;
        font-size: 35px;
      }
      p{
        padding-top: 20px;
        font-size: 21px;
        .bold{
          font-weight: bold;
        }
      }
    }
  }
}
.container1{
  text-align: center;
  padding: 20px 0;
}
.sub-heading{
  font-size: 20px;
  padding: 0 0 20px;
}
.row{
  justify-content: center;
  color: #000;
  word-wrap: break-word;
}
.youtubeVideo{
  text-align: -webkit-center;
  padding: 30px 0;
  display: flex;
}
.iframe-player{
  width: 100%;
  aspect-ratio: 16 / 9;
}

.containerPart2{
  text-align: center;
  p{
    font-size: 30px;
    padding-top: 50px;
  }
  .part2Button{
    padding: 30px 0;
  }
  span{
    font-weight: bold;
    font-size: 18px;
  }
    .home{
      background-color: #7D1817 !important;
      color: #fff;
      border-radius: 25px;
      width: 255px;
      height: 45px;
    }
    .home:hover{
      background-color: #BB2423 !important;
    }
    .download{
      background-color: #000 !important;
      color: #fff;
      border-radius: 25px;
      width: 255px;
      height: 45px;
    }
    .download:hover{
      background-color: #BB2423 !important;
    }
    .telegram{
      background-color: #3D9BE9 !important;
      color: #fff;
      border-radius: 25px;
      width: 255px;
      height: 45px;
    }
    .telegram:hover{
      background-color: unset !important;
      border: 1px solid #3D9BE9;
      color:#3D9BE9
    }
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

@media screen and (max-width: 1715px) {
  .box-card{
    min-height: 323px !important;
  }
}
@media screen and (max-width: 1500px) {
  .heading{
    h1{
      font-size: 60px !important;
    }
    .bold{
      font-size: 30px !important;
    }
    p{
      font-size: 20px !important;
    }
  }

  .cards{
    .box-card{
      h1{
        font-size: 30px !important;
      }
      p{
        font-size: 18px !important;
      }
    }
  }
}
@media screen and (max-width: 1400px) {
    .cpiPart1{
    .background1{
      .animals{
        width: 450px;
      }
    }
  }
}
@media screen and (max-width: 1350px) {
  .part2{
    .challenge{
      h1{
        font-size: 40px !important;
      }
    }
  }
}
@media screen and (max-width: 1300px) {
    .cpiPart1{
    .background1{
      .animals{
        width: 430px;
      }
    }
  }
}

@media screen and (max-width: 1200px) {
  .box-card{
    min-height: 417px !important;
  }
}

@media screen and (max-width: 991px) {
  .heading{
    padding: unset !important;
  }
  .bullContainer1{
    text-align: end;
  }

  .cardContainer{
    padding-top: 20px;
  }
  .box-card{
    height: auto !important;
    min-height: unset !important;
  }
  .animals{
    display:none !important;
  }
}

@media screen and (max-width: 900px) {
  .part2Button{
        display: inline-grid;
        .home{
          margin-left: 10px;
        }
        .download{
          margin-top: 20px;
        }
        .telegram{
          margin-top: 20px;
        }
      }
}

@media screen and (max-width: 767px) {
  .depositContainer{
    margin-top: 10px;
  }
}

@media screen and (max-width: 650px) {

  .signUpButton{
    .startNow{
      width: 120px !important;
    }
  }
  .heading{
    h1{
      font-size: 35px !important;
    }
    .bold{
      font-size: 24px !important;
    }
    p{
      font-size: 14px !important;
    }
    .terms{
      font-size: 12px !important;
    }
  }

  .part2{
    .challenge{
      h1{
        font-size: 30px !important;
      }
    }
  }
}
</style>
