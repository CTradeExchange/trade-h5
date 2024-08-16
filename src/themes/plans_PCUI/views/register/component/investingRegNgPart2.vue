<template>
    <div class='container2'>
        <div style='max-width: 1350px'>
            <el-row class='row1' :gutter='20'>
                <el-col
                    class='col1'
                    :lg='24'
                    :md='24'
                    :sm='24'
                    :xl='24'
                    :xs='24'
                >
                    <p class='content'>
                        <span>{{ $t('investingPart2.title1') }}</span> {{ $t('investingPart2.title2') }}
                    </p>
                </el-col>
            </el-row>
            <el-row class='row2' :gutter='10'>
                <el-col
                    class='col1'
                    :lg='6'
                    :md='6'
                    :sm='6'
                    :xl='6'
                    :xs='6'
                >
                    <el-card class='box-card' style='background: #FBFBFB;'>
                        <div class='card'>
                            <img alt='platform' class='img1' src='../../../images/investingCom/platform.png' />
                            <p class='title'>
                                {{ $t('investingPart2.subTitle1') }}
                            </p>
                            <p class='content'>
                                {{ $t('investingPart2.content1') }}
                            </p>
                        </div>
                    </el-card>
                </el-col>
                <el-col
                    class='col1'
                    :lg='6'
                    :md='6'
                    :sm='6'
                    :xl='6'
                    :xs='6'
                >
                    <el-card class='box-card' style='background: #FBFBFB;'>
                        <div class='card'>
                            <img alt='asset' class='img1' src='../../../images/investingCom/asset.png' />
                            <p class='title'>
                                {{ $t('investingPart2.subTitle2') }}
                            </p>
                            <p class='content'>
                                {{ $t('investingPart2.content2') }}
                            </p>
                        </div>
                    </el-card>
                </el-col>
                <el-col
                    class='col1'
                    :lg='6'
                    :md='6'
                    :sm='6'
                    :xl='6'
                    :xs='6'
                >
                    <el-card class='box-card' style='background: #FBFBFB;'>
                        <div class='card'>
                            <img alt='cost ' class='img1' src='../../../images/investingCom/lowCost.png' />
                            <p class='title'>
                                {{ $t('investingPart2.subTitle3') }}
                            </p>
                            <p class='content'>
                                {{ $t('investingPart2.content3') }}
                            </p>
                        </div>
                    </el-card>
                </el-col>
                <el-col
                    class='col1'
                    :lg='6'
                    :md='6'
                    :sm='6'
                    :xl='6'
                    :xs='6'
                >
                    <el-card class='box-card' style='background: #FBFBFB;'>
                        <div class='card'>
                            <img alt='support' class='img1' src='../../../images/investingCom/support.png' />
                            <p class='title'>
                                {{ $t('investingPart2.subTitle4') }}
                            </p>
                            <p class='content'>
                                {{ $t('investingPart2.content4') }}
                            </p>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
            <el-row class='row3' :gutter='10'>
                <el-col
                    class='row3col'
                    :lg='16'
                    :md='16'
                    :sm='16'
                    :xl='16'
                    :xs='16'
                >
                    <el-button class='register' @click='jumpPage(1)'>
                        {{ $t('investingPart2.button') }}
                    </el-button>
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
.container2{
font-family: "poppins";
text-align: center;
padding: 125px 0 80px;
background: #FFF;
background-image: url("../../../images/investingCom/background2.svg");
background-repeat: no-repeat;
background-position: right 0% bottom 50%;
text-align: -webkit-center;
.row1{
  justify-content: center;
  .col1{
    .content{
      font-size: 36px;
      line-height: 54px;
      color: #000;
      span{
        font-weight: 700;
      }
    }
  }
}
.row2{
  justify-content: center;
  padding-top: 64px;
  align-items: stretch;
  .col1{
    text-align: -webkit-center;
    max-width: 350px;
    .box-card{
      width: 100%;
      max-width: 288px;
      flex-shrink: 0;
      .card{
        padding: 84px 16px 30px;

        .img1{
          width: 100%;
          max-width: 56px;
        }
        .title{
          font-weight: 700;
          font-size: 18px;
          padding-top: 52px;
        }
        .content{
          padding-top: 17px;
          color: #000;
          text-align: center;
          font-family: 'DM Sans';
          font-size: 14px;
          font-style: normal;
          font-weight: 400;
          line-height: normal;
        }
      }
    }
  }
}
.row3{
  justify-content: center;
  padding-top: 72px;
  .row3col{
    text-align: -webkit-center;
    .register{
      display: flex;
      width: 360px;
      height: 44px;
      padding: 10px;
      justify-content: center;
      align-items: center;
      gap: 10px;
      flex-shrink: 0;
      border-radius: 4px;
      background: #C80F0F;
      color: #FFF;
      text-align: center;
      font-family: Inter;
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
    }

  }
}
}
.el-card {
background: #FBFBFB;
box-shadow: unset !important;
height: 360px !important;
border: #FBFBFB;
}
::v-deep.el-card:hover{
      background: #FFF !important;
      border: 1px solid rgb(241,241,241);
    }
.el-card ::v-deep .el-card__body{
      padding: unset !important;
    }
@media screen and (max-width: 1400px) {
.el-card {
height: 390px !important;
}
  .container2{
    padding: 80px 20px 60px;
  }
  .row2{
  .col1{
    .box-card{
      .card{
        .title{
          height: 100px;
        }
      }
    }
  }
}
}
@media screen and (max-width: 992px) {
.container2{
  display: none;
}
}
</style>
