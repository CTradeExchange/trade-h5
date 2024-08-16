<template>
    <div class='container3'>
        <div style='max-width: 1350px'>
            <el-row class='row1' :gutter='20'>
                <el-col
                    class='col1'
                    :lg='12'
                    :md='12'
                    :sm='12'
                    :xl='12'
                    :xs='22'
                >
                    <img alt='' class='phone' src='../../../images/investingCom/headlinePhone.png' />
                    <el-button class='button' @click='jumpPage(1)'>
                        {{ $t('investingPart4.button') }}
                    </el-button>
                </el-col>
                <el-col
                    class='col2'
                    :lg='12'
                    :md='12'
                    :sm='12'
                    :xl='12'
                    :xs='22'
                >
                    <h1 class='title'>
                        {{ $t('investingPart4.title') }}
                    </h1>
                    <el-row class='row2' :gutter='10'>
                        <el-col
                            :lg='1'
                            :md='1'
                            :sm='1'
                            style='text-align: center; align-items: center; display: flex;'
                            :xl='1'
                            :xs='1'
                        >
                            <img alt='' class='point' src='../../../images/investingCom/Union.png' />
                        </el-col>
                        <el-col
                            class='row2col2'
                            :lg='22'
                            :md='22'
                            :sm='22'
                            :xl='22'
                            :xs='22'
                        >
                            <p class='content'>
                                {{ $t('investingPart4.content1') }}
                            </p>
                        </el-col>
                    </el-row>
                    <el-row class='row2 newRow' :gutter='10'>
                        <el-col
                            :lg='1'
                            :md='1'
                            :sm='1'
                            style='text-align: center; align-items: center; display: flex;'
                            :xl='1'
                            :xs='1'
                        >
                            <img alt='' class='point' src='../../../images/investingCom/Union.png' />
                        </el-col>
                        <el-col
                            class='row2col2'
                            :lg='22'
                            :md='22'
                            :sm='22'
                            :xl='22'
                            :xs='22'
                        >
                            <p class='content'>
                                {{ $t('investingPart4.content2') }}
                            </p>
                        </el-col>
                    </el-row>
                    <el-row class='row2 newRow' :gutter='10'>
                        <el-col
                            :lg='1'
                            :md='1'
                            :sm='1'
                            style='text-align: center; align-items: center; display: flex;'
                            :xl='1'
                            :xs='1'
                        >
                            <img alt='' class='point' src='../../../images/investingCom/Union.png' />
                        </el-col>
                        <el-col
                            class='row2col2'
                            :lg='22'
                            :md='22'
                            :sm='22'
                            :xl='22'
                            :xs='22'
                        >
                            <p class='content'>
                                {{ $t('investingPart4.content3') }}
                            </p>
                        </el-col>
                    </el-row>
                    <el-row class='row2 newRow' :gutter='10'>
                        <el-col
                            :lg='1'
                            :md='1'
                            :sm='1'
                            style='text-align: center; align-items: center; display: flex;'
                            :xl='1'
                            :xs='1'
                        >
                            <img alt='' class='point' src='../../../images/investingCom/Union.png' />
                        </el-col>
                        <el-col
                            class='row2col2'
                            :lg='22'
                            :md='22'
                            :sm='22'
                            :xl='22'
                            :xs='22'
                        >
                            <p class='content'>
                                {{ $t('investingPart4.content4') }}
                            </p>
                        </el-col>
                    </el-row>
                    <el-row class='row3' :gutter='10'>
                        <el-col
                            class='row3col'
                            :lg='16'
                            :md='16'
                            :sm='22'
                            :xl='16'
                            :xs='22'
                        >
                            <p class='qrContent'>
                                {{ $t('investingPart4.content5') }}
                            </p>
                            <img alt='' class='qrCode' src='../../../images/investingCom/qrcode.png' />
                        </el-col>
                    </el-row>
                    <el-row class='row4' :gutter='10'>
                        <el-col
                            class='row4Col1'
                            :lg='24'
                            :md='24'
                            :sm='24'
                            :xl='24'
                            :xs='24'
                        >
                            <img alt='' class='download' src='../../../images/investingCom/blackGoogle.png' @click='jumpPage(2)' />
                            <img alt='' class='download download2' src='../../../images/investingCom/blackApple.png' @click='jumpPage(3)' />
                        </el-col>
                    </el-row>
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
                case 2 :
                    window.open('https://play.google.com/store/apps/details?id=com.mc900.mc900&pli=1')
                    break
                case 3 :
                    window.open('https://apps.apple.com/us/app/headline-net-finance-invest/id1639509598')
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
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display&family=Poppins&display=swap');
.container3{
font-family: 'Poppins', sans-serif;
background-color: #FFFFFF;
text-align: -webkit-center;
.row1{
  justify-content: space-around;
  .col1{
      text-align: -webkit-center;
    align-self: center;
    .phone{
      width: 100%;
      max-width: 458px;
    }
    .button{
      display: none;
    }
  }
  .col2{
    padding: 88px 0 85px;
    text-align: start;
    .row2{
      align-items: center;
      .point{
        align-self: center;
        text-align: center;
        width: 10px;
      }
      .row2col2{
        .content{
          font-size: 20px;
          line-height: 30px;
          color: #1C1C1C;
        }
      }
    }

    .newRow{
      padding-top: 16px;
    }
    .row3{
      padding-top: 43px;
      .row3col{
        .qrContent{
          font-size: 14px;
          color: #000;
        }
        .qrCode{
            max-width: 120px;
          }
      }
    }
    .title{
      font-weight: 700;
      font-size: 48px;
      padding-bottom: 32px;
    }
  }
}
}
.row4{
display: none;
}
@media screen and (max-width: 1400px) {
.container3{
  padding: 0 20px;
}
}
@media screen and (max-width: 1200px) {
.container3{
.row1{
  .col2{
    .row2{
      .row2col2{
        .content{
          font-size: 18px;
        }
      }
    }
    .title{
      font-size: 40px;
    }
  }
}
}
}
@media screen and (max-width: 900px) {
.container3{
.row1{
  .col2{
    .row2{
      .row2col2{
        .content{
          font-size: 16px;
        }
      }
    }
    .title{
      font-size: 34px;
    }
  }
}
}
}
@media screen and (max-width: 767px) {
.container3{
padding: unset !important;
.row1{
  flex-flow: wrap-reverse;
  .col1{
    .button{
      display: unset !important;
      background: #C80F0F;;
      border: unset;
      width: 345px;
      height: 44px;
      font-size: 14px;
      font-family: 'Inter', sans-serif;
      color: #FFF;
      margin-top: 40px;
    }
    .phone{
      max-width: 380px !important;
    }
  }
  .col2{
    padding: 32px 14px 27px !important;
    .row2{
      .point{
          width: 7px;
      }
      .row2col2{
        .content{
          color: #666;
          font-size: 14px;
          line-height: normal;
        }
      }
    }

    .newRow{
      padding-top: 16px;
    }
    .row3{
      display: none;
    }
    .title{
      font-size: 24px;
      padding-bottom: 32px;
    }
  }
}
}
.row4{
display: unset !important;
margin-top: 10px;
.row4Col1{
  text-align: center;
  margin-top: 10px;
  .download{
    width: 136px;
  }
  .download2{
   margin-left: 24px;
  }
}
}
}
</style>
