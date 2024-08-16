<template>
    <div class='banner'>
        <div class='center'>
            <h1 class='theory'>
                In Theory...
            </h1>
            <el-row :gutter='20'>
                <el-col :offset='6' :span='12'>
                    <p class='cpiInfo'>
                        CPI is a measure of the average change over time in the prices paid by urban consumers for a basket of goods and services. It's published monthly and is widely used to track inflation and the purchasing power of the US dollar.
                    </p>
                </el-col>
            </el-row>
            <el-row class='row'>
                <el-col
                    class='leftCol'
                    :lg='8'
                    :md='8'
                    :sm='8'
                    :xl='8'
                    :xs='8'
                >
                    <p class='text1'>
                        US CPI ↑
                    </p>
                    <p class='text2'>
                        Inflation ↑
                    </p>
                    <p class='text3'>
                        Gold ↑ & USD ↓
                    </p>
                </el-col>
                <el-divider class='vertical' direction='vertical' />
                <el-col
                    class='rightCol'
                    :lg='8'
                    :md='8'
                    :sm='8'
                    :xl='8'
                    :xs='8'
                >
                    <p class='text1'>
                        ↓ US CPI
                    </p>
                    <p class='text2'>
                        ↑ Inflation
                    </p>
                    <p class='text3'>
                        ↑ USD & ↓ GOLD
                    </p>
                </el-col>
            </el-row>
            <div class='bannerButton'>
                <el-button class='lp_btn lp_btn_register' plain size='large' @click='jumpPage(1)'>
                    Get Started
                </el-button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Banner',
    components: {
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
.banner {
  background-image: url("../../../images/cpi1/fullBanner.jpg");
  width: 100%;
  text-align: center;
  background-repeat:no-repeat;
  background-position: center center;
  margin: 30px 0 50px;
  background-size: cover;
  .center {
  color: #fff;
  padding: 50px 0;
    .theory{
      font-size: 54px;
    }
    .cpiInfo{
      padding: 20px 0;
      font-size: 20px;
      text-align: left;
    }
    .row{
      justify-content: center;
      padding: 20px 0;
      .leftCol{
        text-align: right;
        padding-right: 30px;
      }
      .rightCol{
        text-align: left;
        padding-left: 30px;
      }
      .text1{
        font-size: 30px;
      }
      .text2{
        padding-top: 30px;
        font-size: 30px;
      }
      .text3{
        padding-top: 30px;
        font-size: 30px;
      }
    }
    .vertical{
      height: 205px;
      border-left: 2px var(--el-border-color) var(--el-border-style);
    }
    .bannerButton{
      padding-top: 40px;
    }
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

@media screen and (max-width: 995px) {
  .theory{
      font-size: 46px !important;
    }
  .center {
    .cpiInfo{
      font-size: 18px !important;
    }
    .row{
      .text1{
        font-size: 20px !important;
      }
      .text2{
        padding-top: 20px !important;
        font-size: 20px !important;
      }
      .text3{
        padding-top: 20px !important;
        font-size: 20px !important;
      }
    }
    .vertical{
      height: 140px !important;
    }
  }
  .leftCol{
        padding-right: 0px !important;
  }
  .rightCol{
    padding-left: 0px !important;
  }
}
@media screen and (max-width: 564px) {
  .center {
    .row{
      .text1{
        font-size: 16px !important;
      }
      .text2{
        padding-top: 20px !important;
        font-size: 16px !important;
      }
      .text3{
        padding-top: 20px !important;
        font-size: 16px !important;
      }
    }
    .vertical{
      height: 120px !important;
    }
  }
}
</style>
