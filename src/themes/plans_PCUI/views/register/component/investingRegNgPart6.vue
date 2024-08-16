<template>
    <div class='container3'>
        <el-row class='row1' :gutter='20'>
            <el-col
                class='col1'
                :lg='22'
                :md='22'
                :sm='22'
                :xl='22'
                :xs='22'
            >
                <h1 class='title'>
                    {{ $t('investingPart6.title') }}
                </h1>
                <el-button class='button' @click='jumpPage(1)'>
                    {{ $t('investingPart6.button') }}
                </el-button>
            </el-col>
        </el-row>
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
@import url('https://fonts.googleapis.com/css2?family=Inter&family=Poppins&display=swap');

.container3{
font-family: 'Poppins', sans-serif;
background: url("../../.././images/investingCom/tradebg.png") no-repeat center top;
background-size: cover;
background-repeat: no-repeat;
.row1{
  justify-content: center;
  padding: 92px 0 111px;
  .col1{
    text-align: center;
    .title{
      font-size: 36px;
      font-weight: 700;
      align-content: center;
    }
    .button{
      background: #C80F0F;;
      border: unset;
      width: 360px;
      height: 44px;
      font-size: 14px;
      font-family: 'Inter', sans-serif;
      color: #FFF;
      margin-top: 40px;
    }
  }
}
}

@media screen and (max-width: 992px) {
.container3{
  background: linear-gradient(156deg, #FBFEFF 20.97%, #F6F6F6 38.57%, #FFEFEE 92.58%);
}
}
@media screen and (max-width: 768px) {
.container3{
.row1{
  padding: 70px 0 43px !important;
  .col1{
    .title{
      font-size: 24px !important;
    }
    .button{
      width: 345px !important;
      height: 44px !important;
      margin-top: 19px !important;
    }
  }
}
}
}
</style>
