<template>
    <router-view />
    <div id='cpi1' class='cpiDetails'>
        <topNav />
        <div class='cpiPart1'>
            <div class='background1'>
                <div class='heading'>
                    <h1>Claim $50 and Win $5,000</h1>
                    <p>Headline  |  CPI Event  |  Trading Competition</p>
                    <div class='part2Button'>
                        <el-button class='startNow lp_btn lp_btn_register' plain @click='jumpPage(1)'>
                            <p class='startNow lp_btn lp_btn_register'>
                                Join Now
                            </p>
                        </el-button>
                    </div>
                </div>
                <el-row class='row' :gutter='20'>
                    <el-col>
                        <div class='youtubeVideo'>
                            <img alt='money' class='layoutImg' src='../../images/cpi1/usDollar.png' />
                            <iframe
                                allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
                                allowfullscreen
                                class='iframe-player'
                                frameborder='0'
                                src='https://www.youtube.com/embed/3WTMEHmBKWY'
                                title='YouTube video player'
                            ></iframe>
                            <img alt='money' class='layoutImg' src='../../images/cpi1/usDollar.png' />
                        </div>
                    </el-col>
                </el-row>
            </div>

            <div class='background2'>
                <claimLayout />
            </div>
            <div class='background3'>
                <advice />
            </div>
        </div>
        <userLayoutFooter />
    </div>
</template>

<script>
import claimLayout from './components/claim50_2layout.vue'
import advice from './components/AdviceClaim50_2.vue'
import topNav from '@planspc/layout/topNav'
import userLayoutFooter from '@planspc/modules/footer/footer'
export default {
    name: 'CPI2',
    components: {
        claimLayout,
        advice,
        topNav,
        userLayoutFooter
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
.layoutImg{
  width: 590px;
}

.cpiDetails{
  overflow: hidden;
}
.cpiPart1{
  border-bottom: 1px solid #E8E6E6;
  .background1{
    background: linear-gradient(180deg, #000000 0%, #7D1817 100%);
    .heading{
      justify-content: center;
      display: grid;
      padding: 80px 0;
      h1{
        font-weight: bold;
        font-size: 50px;
        color: #fff;
      }
      p{
        font-size: 26px;
        text-align: center;
        color: #FF4040;
      }
    }
  }
  .background2{
    background: linear-gradient(180deg, #7D1817 0%, #D27D7C 95.3125%);
  }
}
.background3{
  background: linear-gradient(180deg, #D27D7C 0%, #FFFFFF 100%);
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

.part2Button{
  justify-content: center;
  display: flex;
  padding-top: 30px;
}

.startNow{
  border: none;
  background-color: #BB2423 !important;
  color: #fff !important;
  border-radius: unset !important;
  width: 150px;
  height: 50px;
  font-size: 20px;
}
.startNow:hover{
  color: #BB2423 !important;
  background-color: #fff !important;
}

@media screen and (max-width: 1700px) {
  .layoutImg{
    width: 450px !important;
  }
}

@media screen and (max-width: 1500px) {
  .layoutImg{
    width: 350px !important;
  }
}
@media screen and (max-width: 1200px) {
  .layoutImg{
    width: 250px !important;
  }
}

@media screen and (max-width: 991px) {
  .cpiPart1{
    .heading{
      padding: 80px 0 40px !important;
      h1{
        font-size: 35px !important;
      }
      p{
        font-size: 20px !important;
      }
    }
  }
  .layoutImg{
    display: none;
  }
}
</style>
