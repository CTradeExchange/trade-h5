<template>
    <router-view />
    <div class='secret_formula'>
        <topNav />
        <div class='background'>
            <el-row class='row1' :offset='20'>
                <el-col
                    class='col1'
                    :lg='12'
                    :md='12'
                    :sm='24'
                    :xl='12'
                    :xs='24'
                >
                    <p class='guide'>
                        FREE GUIDE
                    </p>
                    <h1 class='title'>
                        Secret format to earn in <span class='yellow'>
                            CFD
                        </span> trading with <span class='yellow'>
                            CRYPTO
                        </span> currency
                    </h1>
                    <p class='content'>
                        Stuck on page 7 of New Trading ERA? Find out how to boost your profit, check my trade record on the right <span class='underline'>
                            (they are just two of my trading account)
                        </span>
                    </p>
                </el-col>
                <el-col
                    :lg='12'
                    :md='12'
                    :sm='24'
                    :xl='12'
                    :xs='24'
                >
                    <img alt='trade record' class='tradeRecord' src='../../images/eventMay/secretFormula/Trade-record.jpg' />
                    <img alt='trade record' class='record' src='../../images/eventMay/secretFormula/record-3.jpg' />
                </el-col>
            </el-row>
        </div>
        <div class='background2'>
            <h1>
                <span class='yellow'>
                    $50
                </span> FOR JOINING
            </h1>
            <p>
                Simply leave your name and email, <span class='yellow'>
                    No Credit Card Need !!
                </span>
            </p>
        </div>
        <userLayoutFooter />
    </div>
</template>

<script>
import topNav from '@planspc/layout/topNav'
import userLayoutFooter from '@planspc/modules/footer/footer'
export default {
    name: 'SecretFormula',
    components: {
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

.background{
  background-image: url("../../images/eventMay/secretFormula/secretCrypto.jpg");
  background-repeat:  no-repeat;
  background-position:  center center;
  background-size:  cover;
  .row1{
    color: #fff;
    .col1{
      align-self: center;
    }
    .guide{
      font-weight: bold;
      font-size: 20px;
    }
    .title{
      font-weight: bold;
      font-size: 68px;
      .yellow{
        color: #FFF86B;
      }
    }
    .content{
      font-size: 19px;
      .underline{
        text-decoration: underline;
      }
    }
    .tradeRecord{
      padding-top: 40px;
    }
    .record{
      padding: 40px 0;
    }
  }
}
.background2{
  background-image: url("../../images/eventMay/secretFormula/background2.jpg");
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
}
</style>
