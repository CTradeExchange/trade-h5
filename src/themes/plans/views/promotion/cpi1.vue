<template>
    <router-view />
    <top />
    <div id='cpi1' class='cpiDetails'>
        <div class='cpiPart1'>
            <el-row class='row' :gutter='20'>
                <el-col
                    :lg='17'
                    :md='18'
                    :sm='20'
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
                    :lg='17'
                    :md='18'
                    :sm='20'
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
                        <el-button class='signUp lp_btn lp_btn_register' plain @click='jumpPage(1)'>
                            Register
                            <el-icon class='arrow'>
                                <ArrowRightBold />
                            </el-icon>
                        </el-button>
                    </div>
                </el-col>
            </el-row>
        </div>
        <cpi />
        <advice />
    </div>
</template>

<script>
import cpi from './components/cpi1layout.vue'
import advice from './components/ProfessionalAdvice.vue'
import top from '../../components/eventTop.vue'
export default {
    name: 'CPI1',
    components: {
        cpi,
        advice,
        top,
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

.signUp:hover .arrow{
  color: #fff;
}

.signUp{
  border: 1px solid #BB2423;
  color: #BB2423;
  border-radius: unset !important;
  background: #fff !important;
  width: 200px;
  height: 50px;
}
.signUp:hover{
  color: #fff;
  background: #BB2423 !important;
}

</style>
