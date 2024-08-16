<template>
    <div class='contBox'>
        <div>
            <p class='topicDesc'>
                <span>{{ `#${$t("news.topicDesc")}` }}</span>
            </p>
            <div class='newsContent'>
                <p class='text'>
                    {{ `${$t("bannerTopic.content")}` }} <span class='red'>
                        {{ `${$t("bannerTopic.content2")}` }}
                    </span>
                </p>

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
                    <el-col
                        :lg='12'
                        :md='12'
                        :sm='12'
                        :xl='12'
                        :xs='20'
                    >
                        <video
                            id='video-id'
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
                    </el-col>
                </el-row>

                <a
                    v-if='detail.SourceURL'
                    class='seeSource'
                    :href='detail.SourceURL'
                    target='_blank'
                >
                    {{ $t("news.seeSource") }}
                </a>
            </div>
            <van-radio-group
                v-model='checked'
                class='contRadio'
                @change='changeRadio'
            >
                <div v-for='(item) in info.Viewpoints' :key='item.ID'>
                    <div class='contRadioCard' :style='getStyleObj(item)[0]'>
                        <van-radio
                            :checked-color='item.Color'
                            :disabled='getStyleObj(item)[2]'
                            :name='item.ID'
                        >
                            <span
                                class='radioText'
                                :style='getStyleObj(item)[1]'
                            >
                                {{ getViewpointsItem(item)?.Title }}
                            </span>
                        </van-radio>
                    </div>
                    <div class='progressBlock'>
                        <div class='progress'>
                            <div
                                class='percent'
                                :style='{
                                    background: item.Color,
                                    width: calcPercent(item.LikeCount),
                                }'
                            ></div>
                        </div>
                        <div class='percentText'>
                            {{ calcPercent(item.LikeCount) }}
                        </div>
                    </div>
                </div>
            </van-radio-group>

            <div v-if='info.Viewpoints'>
                <van-button
                    block
                    :color="'var(--primary)'"
                    :disabled='info.ViewpointID > 0'
                    @click='viewPoint'
                >
                    {{
                        info.ViewpointID > 0
                            ? $t("news.voted")
                            : $t("news.confirmVotes")
                    }}
                </van-button>
            </div>
        </div>
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
            getViewpointsItem,
            detail,
            getStyleObj,
            calcPercent,
            viewPoint,
            changeRadio,
            jumpPage,
            handleSkip,
            ...toRefs(state)
        }
    }
}
</script>

<style lang="scss" scoped>
.topicDesc{
  padding-top: 15px;
}
.iframe-player{
  width: 100%;
  aspect-ratio: 16 / 9;
}
.newsContent{
  .text{
    font-size: 16px;
    color: #000;
    line-height: 1.5em;
    .red{
      color: #cb0d11;
      font-weight: bold;
    }
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
      margin-top: 15px;
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

.contBox {
    padding: 0 rem(20px) rem(20px);
    & > div {
        background: var(--contentColor);
        padding: rem(20px);
        border-radius: rem(10px);
        & > p:first-of-type {
            display: flex;
            justify-content: space-between;

            margin-bottom: rem(20px);
            & > span:first-of-type {
                font-size: rem(34px);
                color: var(--primary);
            }
        }
        & > .newsContent {
            font-size: rem(28px);
            color: var(--textColor);
            line-height: 1.5;
            margin-bottom: rem(20px);
            .seeSource {
                color: var(--color2);
            }
        }
    }
    .contRadio {
        margin-bottom: rem(20px);
        margin-top: rem(30px);
        .contRadioCard {
            width: 100%;
            height: auto;
            background: #ffffff;
            border: 1px solid var(--colord6);
            border-radius: rem(8px);
            padding: rem(20px);

            //margin-top: rem(30px);
        }
        .progressBlock {
            margin: rem(30px) 0;
            display: flex;
            align-items: center;
            .progress {
                flex: 1;
                height: rem(24px);
                border-radius: rem(24px);
                background: var(--colorf4);
                .percent {
                    height: rem(24px);
                    border-radius: rem(24px);
                }
            }
            .percentText {
                font-size: rem(24px);
                width: rem(100px);
                text-align: right;
            }
        }
    }
}
.contBoxs {
    padding: 0 rem(24px) rem(24px);
    background: var(--contentColor);
    font-size: rem(28px);
    color: var(--textColor);
    line-height: 1.5;
}
</style>
