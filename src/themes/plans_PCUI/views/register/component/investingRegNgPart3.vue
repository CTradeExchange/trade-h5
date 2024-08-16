<template>
    <div class='container3'>
        <div style='max-width: 1350px'>
            <el-row class='row1' :gutter='10'>
                <el-col
                    class='col1'
                    :lg='12'
                    :md='12'
                    :sm='12'
                    :xl='12'
                    :xs='22'
                >
                    <h1 class='title'>
                        {{ $t('investingPart3.title') }}
                    </h1>
                    <p class='content'>
                        {{ $t('investingPart3.content') }}
                    </p>
                    <el-row class='row2 newRow' :gutter='10'>
                        <el-col
                            class='row2Col1'
                            :lg='3'
                            :md='3'
                            :sm='3'
                            :xl='3'
                            :xs='3'
                        >
                            <img alt='' class='icon' src='../../../images/investingCom/commodities.png' />
                        </el-col>
                        <el-col
                            class='row2Col2'
                            :lg='20'
                            :md='20'
                            :sm='20'
                            :xl='20'
                            :xs='20'
                        >
                            <h2 class='subTitle'>
                                {{ $t('investingPart3.subTitle1') }}
                            </h2>
                            <p class='subContent'>
                                {{ $t('investingPart3.content1') }}
                            </p>
                        </el-col>
                    </el-row>
                    <el-row class='row2  newRow2' :gutter='10'>
                        <el-col
                            class='row2Col1'
                            :lg='3'
                            :md='3'
                            :sm='3'
                            :xl='3'
                            :xs='3'
                        >
                            <img alt='' class='icon' src='../../../images/investingCom/forex.png' />
                        </el-col>
                        <el-col
                            class='row2Col2'
                            :lg='20'
                            :md='20'
                            :sm='20'
                            :xl='20'
                            :xs='20'
                        >
                            <h2 class='subTitle'>
                                {{ $t('investingPart3.subTitle2') }}
                            </h2>
                            <p class='subContent'>
                                {{ $t('investingPart3.content2') }}
                            </p>
                        </el-col>
                    </el-row>
                    <el-row class='row2  newRow2' :gutter='10'>
                        <el-col
                            class='row2Col1'
                            :lg='3'
                            :md='3'
                            :sm='3'
                            :xl='3'
                            :xs='3'
                        >
                            <img alt='' class='icon' src='../../../images/investingCom/crypto.png' />
                        </el-col>
                        <el-col
                            class='row2Col2'
                            :lg='20'
                            :md='20'
                            :sm='20'
                            :xl='20'
                            :xs='20'
                        >
                            <h2 class='subTitle'>
                                {{ $t('investingPart3.subTitle3') }}
                            </h2>
                            <p class='subContent'>
                                {{ $t('investingPart3.content3') }}
                            </p>
                        </el-col>
                    </el-row>
                </el-col>
                <el-col
                    class='col2'
                    :lg='12'
                    :md='12'
                    :sm='12'
                    :xl='12'
                    :xs='22'
                >
                    <img alt='' class='pageView' src='../../../images/investingCom/pageView.png' />
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
export default {
    setup () {
        const jumpPage = (attr) => {
            switch (attr) {
                case 1 :
                    window.open('https://www.headline.net/en-US/home')
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
@import "@/sass/mixin.scss";
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz@9..40&family=Inter&family=Poppins&display=swap');
.container3{
padding: 80px 0;
text-align: -webkit-center;
.row1{
  justify-content: center;
  .col1{
    text-align: start;
    .title{
      color: #000;
      font-family: Poppins;
      font-size: 48px;
      font-style: normal;
      font-weight: 700;
      line-height: normal;
      align-self: center;
    }
    .content{
      color: #000;
      font-family: DM Sans;
      font-size: 16px;
      font-style: normal;
      font-weight: 400;
      line-height: 20px;
    }
    .row2{
      .row2Col1{
          .icon{
              width: 48px;
              height: auto;
          }
      }
      .row2Col2{
          .subTitle{
              color: #1C1C1C;
              font-family: Poppins;
              font-size: 20px;
              font-style: normal;
              font-weight: 700;
              line-height: 20px;
          }
          .subContent{
              color: #999;
              font-family: Poppins;
              font-size: 14px;
              font-style: normal;
              line-height: 20px;
              padding-top: 8px;
          }
      }
    }
    .newRow{
      padding-top: 64px;
    }
    .newRow2{
      padding-top: 48px;
    }
  }
  .col2{
  text-align: center;
  align-self: center;
    .pageView{
      max-width: 528px;
      width: 100%;
    }
  }

}
}
@media screen and (max-width: 1400px) {
.container3{
  padding: 60px 20px !important;
}
}
@media screen and (max-width: 1200px) {
.container3{
.row1{
  .col1{
    .title{
      font-size: 40px;
    }
    .content{
      font-size: 14px;
    }
    .row2{
      .row2Col1{
          .icon{
              width: 28px !important;
          }
      }
    }
  }
}
}
.newRow{
    padding-top: 40px;
    .subTitle{
      font-size: 16px;
    }
    .subContent{
      font-size: 12px;
    }
}
    .newRow2{
      padding-top: 30px;
    }
}
@media screen and (max-width: 767px) {
.container3{
  padding: 32px 10px !important;
.row1{
  justify-content: center;
  .col1{
    .title{
      font-size: 24px;
    }
    .content{
      font-size: 13px;
    }
    .row2{
      .row2Col1{
          .icon{
              width: 32px !important;
              height: auto;
              text-align: center;
              align-self: center;
          }
      }
      .row2Col2{
          .subTitle{
              font-size: 16px;
          }
          .subContent{
              font-size: 12px;
          }
      }
    }
    .newRow{
      padding-top: 32px;
    }
    .newRow2{
      padding-top: 23px;
    }
  }
  .col2{
    padding-top: 25px;
    .pageView{
      max-width: 450px;
    }
  }

}
}
}
</style>
