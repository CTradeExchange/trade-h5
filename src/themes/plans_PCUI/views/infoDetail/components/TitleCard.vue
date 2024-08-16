<template>
    <div class='titleBox' :style="{ '--bgImg': `url(${info.CoverURL})` }">
        <div>
            <p class='titleInfo'>
                {{ info.Title }}
            </p>
            <el-button class='publishTime' round>
                <div>
                    <img
                        class='topRechargeIcon'
                        src='../../../../plans_PCUI/images/craigIndexImg/competition.png'
                    />
                    {{ formatPublishTime(info.PublishTime) }}
                </div>
            </el-button>
        </div>
    </div>
</template>

<script>
import { computed, reactive, toRefs, watch } from 'vue'
import dayjs from 'dayjs'
export default {
    props: {
        info: {
            type: Object,
            default: () => {
                return {}
            }
        },

    },
    setup (props) {
        const state = reactive({
            type: 1
        })
        const formatPublishTime = (time) => {
            return dayjs(time * 1000).format('YYYY-MM-DD HH:mm:ss')
        }

        return {
            formatPublishTime,
          ...toRefs(state)
        }
    }
}
</script>

<style lang="scss" scoped>
.publishTime{
color: #fff;
font-size: 16px;
font-weight: 700;
background: linear-gradient(180deg, #BE1E2D 0%, rgba(190, 30, 45, 0) 100%), linear-gradient(90deg, #BE1E2D 0%, #F53A4C 49.48%, #BE1E2D 100%);
border: 1px solid rgba(255, 255, 255, 0.5);
cursor: context-menu;
}

.titleBox {
height: 175px;
  padding: rem(20px);
  background-image: var(--bgImg);
  background-size: 100%;
  background-position: center;
  & > div {
      padding: 20px 250px;
      border-radius: rem(10px);
      & > p:first-of-type {
          color: #fff;
          font-size: rem(40px);
          color: (--primaryText);
          font-weight: 800;
          line-height: 1.5;
      }
      & > p:last-of-type {
          display: flex;
          font-weight: 700;
          justify-content: space-between;
          color: #fff;
          font-size: 40px;
          margin-top: rem(20px);
      }
  }
}
.titleBoxs {
  padding: rem(40px) rem(30px) rem(20px);
  background: var(--contentColor);
  & > p:first-of-type {
      font-size: rem(48px);
      font-weight: 700;
      line-height: 1.5;
      color: (--primaryText);
  }
  & > p:last-of-type {
      display: flex;
      justify-content: space-between;
      margin-top: rem(55px);
      font-size: rem(24px);
      color: var(--placeholdColor);
  }
}
</style>
