<template>
    <router-view />
    <top />
    <div id='cpi1' class='cpiDetails'>
        <div class='cpiPart1'>
            <el-row class='row' :gutter='20'>
                <el-col
                    :lg='16'
                    :md='16'
                    :sm='24'
                    :xl='16'
                    :xs='24'
                >
                    <div class='youtubeVideo'>
                        <iframe
                            allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
                            allowfullscreen
                            class='iframe-player'
                            frameborder='0'
                            src='https://www.youtube.com/embed/bjkos_-5tZM'
                            title='YouTube video player'
                        ></iframe>
                    </div>
                </el-col>
            </el-row>

            <el-row class='row' :gutter='20'>
                <el-col
                    :lg='16'
                    :md='16'
                    :sm='24'
                    :xl='16'
                    :xs='24'
                >
                    <div class='container1'>
                        <h1 style='font-size: 36px; font-weight: 800; padding-bottom: 10px;'>
                            Win $5000 Prize in Trading Competition!!
                        </h1>
                        <p class='sub-heading'>
                            Headlines | Trade | Profit
                        </p>
                        <p class='sub-heading'>
                            During 4.12 - 4.26, Headline will launch a trading competition related to the CPI release.<br />You can trade the chosen financial instruments and the best trader can win $5000 prize!
                        </p>
                        <el-button class='joinNow lp_btn lp_btn_register' plain @click='jumpPage(1)'>
                            Join Now
                            <el-icon class='arrow'>
                                <ArrowRightBold />
                            </el-icon>
                        </el-button>
                    </div>
                </el-col>
            </el-row>
        </div>
        <cpi />
        <instruments />
        <advice />
    </div>
</template>

<script>
import cpi from './components/cpi3layout.vue'
import advice from './components/ProfessionalAdvice2.vue'
import instruments from './components/instruments.vue'
import top from '../../components/eventTop.vue'
export default {
    name: 'CPI2',
    components: {
        cpi,
        advice,
        instruments,
        top
    },
    setup (props) {
        const jumpPage = (attr) => {
            switch (attr) {
                case 1 :
                    window.open('https://www.headline.net/en-US/register')
                    break
            }
        }
        return {
            jumpPage,
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';

.cpiDetails{
  overflow-x: hidden;
}
.cpiPart1{
  border-bottom: 1px solid #E8E6E6;
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
}
.iframe-player{
  width: 100%;
  aspect-ratio: 16 / 9;
}
.arrow{
  color: #BB2423;
}

.joinNow:hover .arrow{
  color: #fff;
}

.joinNow{
  border: 1px solid #BB2423;
  color: #BB2423;
  border-radius: unset !important;
  background: #fff !important;
  width: 200px;
  height: 50px;
}
.joinNow:hover{
  color: #fff;
  background: #BB2423 !important;
}

</style>
