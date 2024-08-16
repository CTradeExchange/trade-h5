<template>
    <div class='contBox'>
        <div>
            <p>
                {{ info.Content }}
                <a
                    v-if='info.SourceURL'
                    class='seeSource'
                    :href='info.SourceURL'
                    target='_blank'
                >
                    {{ $t("news.seeSource") }}
                </a>
            </p>
            <!--<van-radio-group      //投票功能，暫不展示
              v-model='checked'
              class='contRadio'
              @change='changeRadio'
          >
              <div v-for='(item, i) in info.Viewpoints' :key='item.ID'>
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
                              {{ item.Title }}
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

          <div>
              <span>{{ $t('news.userJoin',{ allVotes:info.TotalLikeCount }) }}</span>
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
          </div>-->
        </div>
    </div>
</template>

<script>
import { computed, reactive, toRefs, watch } from 'vue'
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
        const state = reactive({
            type: 1,
            checked: 0
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
        watch(
            () => props.info,
            (news) => {
                const { Viewpoints = [], ViewpointID } = news
                const { ID } = Viewpoints[0] || {}
                state.checked = ViewpointID || ID
            }
        )

        return {
            getStyleObj,
            calcPercent,
            viewPoint,
            changeRadio,
          ...toRefs(state)
        }
    }
}
</script>

<style lang="scss" scoped>
.contBox {
  padding: 0 rem(20px) rem(20px);
  justify-content: center;
  display: flex;
  & > div {
      background: var(--contentColor);
      padding: rem(20px);
      border-radius: rem(10px);
      width: 62.5%;
      & > p:first-of-type {
          display: flex;
          justify-content: space-between;

          margin-bottom: rem(20px);
          & > span:first-of-type {
              font-size: rem(34px);
              color: var(--primary);
          }
      }
      & > p:last-of-type {
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
