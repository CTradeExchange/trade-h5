<template>
    <div class='container3'>
        <el-row class='row1' :gutter='20'>
            <el-col
                :lg='22'
                :md='22'
                :sm='22'
                :xl='22'
                :xs='22'
            >
                <p class='title'>
                    {{ $t('investingPart5.title') }} <span>{{ $t('investingPart5.title2') }}</span>
                </p>
            </el-col>
        </el-row>
        <el-row class='row2' :gutter='10'>
            <el-col
                class='row2Col'
                :lg='6'
                :md='7'
                :sm='7'
                :xl='5'
                :xs='22'
            >
                <div class='card-wrapper'>
                    <el-card class='card'>
                        <img
                            class='image'
                            src='../../../images/investingCom/cryptoImg.png'
                        />
                        <div style='padding: 14px'>
                            <span class='title'>
                                {{ $t('investingPart5.subTitle1') }}
                            </span>
                            <p class='content'>
                                {{ $t('investingPart5.content1') }}
                            </p>
                        </div>
                    </el-card>
                </div>
            </el-col>
            <el-col
                class='row2Col newCol'
                :lg='6'
                :md='7'
                :sm='7'
                :xl='5'
                :xs='22'
            >
                <div class='card-wrapper'>
                    <el-card class='card'>
                        <img
                            class='image'
                            src='../../../images/investingCom/kyc.png'
                        />
                        <div style='padding: 14px'>
                            <span class='title'>
                                {{ $t('investingPart5.subTitle2') }}
                            </span>
                            <p class='content'>
                                {{ $t('investingPart5.content2') }}
                            </p>
                        </div>
                    </el-card>
                </div>
            </el-col>
            <el-col
                class='row2Col newCol'
                :lg='6'
                :md='7'
                :sm='7'
                :xl='5'
                :xs='22'
            >
                <div class='card-wrapper'>
                    <el-card class='card'>
                        <img
                            class='image'
                            src='../../../images/investingCom/europe.png'
                        />
                        <div style='padding: 14px'>
                            <span class='title'>
                                {{ $t('investingPart5.subTitle3') }}
                            </span>
                            <p class='content'>
                                {{ $t('investingPart5.content3') }}
                            </p>
                        </div>
                    </el-card>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
</script>

<style lang="scss" scoped>
@import "@/sass/mixin.scss";
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz@9..40&family=Inter&family=Poppins&display=swap');
.container3{
font-family: 'Poppins', sans-serif;
padding: 102px 0 57px;
.row1{
  justify-content: center;
  text-align: center;
  .title{
    font-size: 36px;
    color: #000;
    font-weight: 700;
    span{
      font-weight: 400;
    }
  }
}
.row2{
  justify-content: center;
  padding-top: 64px;
  .row2Col{
    text-align: -webkit-center;
  }
  .card{
    text-align: center;
    .image{
      width: 100%;
      max-height: 167px;
      background-position: center center;
      transition: .3s ease-in-out;
    }
    .title{
      font-weight: 700;
      font-size: 18px;
      color: #000;
    }
    .content{
      font-size: 14px;
      padding: 10px 68px 30px;
      color: #000;
      font-family: 'DM Sans', sans-serif;
    }
  }
}
}
::v-deep .el-card{
max-width: 392px;
height: 354px;
}
.el-card ::v-deep .el-card__body{
  padding: unset !important;
}
.el-card ::v-deep.is-always-shadow {
  box-shadow: unset;
}
.row2{
.card:hover{
    box-shadow: 0px 5px 20px rgba(180, 180, 180,.25) !important;
    .image{
      transform: scale(1.1);
      height: 100%;
    }
}
}
@media screen and (max-width: 1500px) {
.row2{
  .card{
    .content{
      padding: 10px 40px 30px !important;
    }
  }
}
}
@media screen and (max-width: 1300px) {
.container3{
  .row1{
    .title{
      font-size: 28px !important;
    }
  }
}
}
@media screen and (max-width: 1100px) {
.row2{
  .card{
    .content{
      padding: 10px 30px 30px !important;
    }
  }
}
}
@media screen and (max-width: 1000px) {
.container3{
  padding: 60px 0 30px !important;
  .row1{
    .title{
      font-size: 24px !important;
    }
  }
}
}
@media screen and (max-width: 768px) {
.container3{
font-family: 'Poppins', sans-serif;
padding: 43px 0 10px !important;
.row1{
  justify-content: start !important;
  text-align: start !important;
  .title{
    font-size: 26px !important;
    color: #000;
    padding-left: 15px;
    span{
      font-size: 16px !important;
      line-height: 20px;
      display: block;
    }
  }
}
.row2{
  padding-top: 47px;
  .newCol{
    margin-top: 15px;
  }
  .card{
    .content{
      padding: 24px 44px 32px;
    }
  }
}
}
}
@media screen and (max-width: 600px) {
.container3{
.row1{
  .title{
    font-size: 24px !important;
    color: #000;
    padding-left: 15px;
    span{
      font-size: 13px !important;
      line-height: 20px;
      display: block;
    }
  }
}
}
}
</style>
