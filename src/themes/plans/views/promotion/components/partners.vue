<template>
    <div class='partners'>
        <h1 class='partnersTitle'>
            Our Partners
        </h1>
        <el-row class='row partnersRow' :gutter='20'>
            <el-col
                class='col-logo'
                :lg='5'
                :md='6'
                :sm='8'
                :xl='4'
                :xs='24'
            >
                <img alt='Trading View' class='partnersLogo' src='../../../images/cpi1/TradingView.jpg' />
            </el-col>
            <el-col
                class='col-logo'
                :lg='5'
                :md='6'
                :sm='8'
                :xl='4'
                :xs='24'
            >
                <img alt='Magic Compass' class='partnersLogo' src='../../../images/cpi1/MagicCompass.jpg' />
            </el-col>
            <el-col
                class='col-logo'
                :lg='5'
                :md='6'
                :sm='8'
                :xl='4'
                :xs='24'
            >
                <img alt='Investing.com' class='partnersLogo' src='../../../images/cpi1/investing.jpg' />
            </el-col>
        </el-row>
    </div>
</template>

<script>
export default {
    name: 'PA',
    components: {
    },
    setup () {
        const jumpPage = (attr) => {
            switch (attr) {
                case 1 :
                    window.open('https://www.headline.net/en-US/order?name=EUR/USD&symbolId=1437&tradeType=2')
                    break
                case 2 :
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
.advice{
  text-align: center;
  margin: 30px 0;
  background: #E8E6E6;
}
.proImg{
  width: 100%;
}
.proAdvice{
    font-size: 36px;
    font-weight: 800;
    padding: 30px 0;
}
.adviceRow{
  padding-bottom: 50px;
}
.proTitle{
  padding-top: 10px;
}
.adviceContent{
  padding-top: 20px
}
.row{
  justify-content: center;
}
.partners{
  text-align: center;
  padding: 50px 0;
  .partnersTitle{
    font-size: 56px;
    font-weight: bold;
    color: #D00B22;
  }
  .partnersLogo{
    width: 100%;
    padding-top: 30px;
  }
  .col-logo{
  align-self: center;
  }
}

.el-button{
  background-color: #BB2423;
  color: #fff;
  border-radius: unset !important;
  border: unset;
  width: 140px;
}
.el-button:hover{
  background-color: #fff;
  color:#BB2423;
  border: 1px solid #BB2423;
}

@media screen and (max-width: 767px) {
  .cardAdv{
    padding: 0 30px !important;
  }
  .cardAdv2{
    margin-top: 20px;
  }
  .money{
    font-size: 60px !important;
  }
  .partnersRow{
    padding-top: 50px;
    .partnersLogo{
      width: 250px !important;
    }
  }

}
</style>
