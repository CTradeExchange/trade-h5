<template>
    <router-view />
    <div id='cpi1' class='cpiDetails'>
        <topNav />
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
                            Investment opportunities are all in Headline
                        </h1>
                        <p class='sub-heading'>
                            Headlines | Trade | Profit
                        </p>
                        <p class='sub-heading'>
                            "Effortless investments with our new trading method. Two clicks for smart trades with push alerts. Upgrade your game now."
                        </p>
                        <el-button class='signUp lp_btn_register lp_btn' plain @click='jumpPage(1)'>
                            <p class='signUp lp_btn_register lp_btn'>
                                Register
                            </p>
                            <el-icon class='arrow'>
                                <ArrowRightBold />
                            </el-icon>
                        </el-button>
                    </div>
                </el-col>
            </el-row>
        </div>
        <banner />
        <cpi />
        <competition />
        <advice />
        <userLayoutFooter />
    </div>
</template>

<script>
import cpi from './components/cpi1layout.vue'
import advice from './components/ProfessionalAdvice2.vue'
import banner from './components/banner.vue'
import competition from './components/competition.vue'
import topNav from '@planspc/layout/topNav'
import userLayoutFooter from '@planspc/modules/footer/footer'
export default {
    name: 'CPI2',
    components: {
        cpi,
        advice,
        banner,
        competition,
        topNav,
        userLayoutFooter,
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
  overflow: hidden;
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

.signUp:hover .arrow{
  color: #fff;
}

.signUp{
  border: 1px solid #BB2423;
  color: #BB2423;
  border-radius: unset !important;
  width: 200px;
  height: 50px;
}
.signUp:hover{
  color: #fff;
  background-color: #BB2423;
}

</style>
