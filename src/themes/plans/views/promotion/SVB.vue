<template>
    <router-view />
    <div id='SVB' class='svbDetails'>
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
                        src='https://www.youtube.com/embed/J6cxpQUYjeY'
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
                <div>
                    <h1 style='font-size: 30px; font-weight: 800;'>
                        Silicon Valley Bank: The 2nd Biggest Bank Failure Since 2008 in US
                    </h1>
                    <el-row class='mb-4 buttonRow' style='padding: 10px 0 0;'>
                        <el-button class='tagButton lp_btn' plain>
                            Silicon Valley Bank
                            <el-icon class='arrow'>
                                <ArrowRightBold />
                            </el-icon>
                        </el-button>
                        <el-button class='tagButton lp_btn' plain>
                            Shares
                            <el-icon class='arrow'>
                                <ArrowRightBold />
                            </el-icon>
                        </el-button>
                        <el-button class='tagButton lp_btn' plain>
                            Interest Rate
                            <el-icon class='arrow'>
                                <ArrowRightBold />
                            </el-icon>
                        </el-button>
                        <el-button class='tagButton lp_btn' plain>
                            Tech
                            <el-icon class='arrow'>
                                <ArrowRightBold />
                            </el-icon>
                        </el-button>
                    </el-row>
                </div>
                <h1 class='date'>
                    Headline.net | Friday 17 March 2023
                </h1>
            </el-col>
        </el-row>
        <news />
    </div>
</template>

<script>
import news from './components/text.vue'

export default {
    name: 'SVB',
    components: {
        news,
    },
    setup (props) {
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
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

.tagButton:hover .arrow{
  color: #fff;
}

.tagButton{
  border: 1px solid #BB2423;
  color: #BB2423;
  border-radius: unset !important;
}
.tagButton:hover{
  color: #fff;
  background-color: #BB2423;
}

.date{
  font-size: 14px;
  font-weight: 400;
  padding: 10px 0;
}

@media screen and (max-width: 600px) {
  .el-button+.el-button{
  margin-left: unset;
  }
  .buttonRow{
    display: grid;
  }
  .el-button{
    margin-top: 5px;
  }
}

</style>
