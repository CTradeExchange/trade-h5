<template>
    <router-view />
    <div class='claim50'>
        <topNav />
        <div class='part2'>
            <img alt='promote image' class='claim' src='../../images/cpi1/promoteImg.jpg' />
            <img alt='promote image' class='bannerAPP' src='../../images/cpi1/landingPage/bannerApp.png' />
            <el-row class='claimMoney'>
                <el-col :offset='4' :span='14'>
                    <h1 class='money' style='font-size: 40px; padding-bottom: 10px;'>
                        Take $50 NOW
                    </h1>
                    <p class='info'>
                        "Join HEADLINE.NET as a new member, become our <span class='bold'>
                            Telegram member
                        </span>, and receive <span class='yellow'>
                            US$50
                        </span> to start your trading account. Don't miss this opportunity to turn your trading skills into big rewards! The cash prize of <span class='yellow'>
                            US$5,000
                        </span>, which is fully withdrawable, will be added to the winners' live account."
                    </p>
                    <div class='part2Button'>
                        <el-button class='startNow lp_btn_register lp_btn' plain @click='jumpPage(1)'>
                            <p class='startNow lp_btn_register lp_btn'>
                                Claim
                            </p>
                        </el-button>
                    </div>
                    <el-button
                        class='terms lp_btn'
                        link
                        @click='open'
                    >
                        <p class='lp_btn'>
                            *Terms and conditions apply
                        </p>
                    </el-button>
                </el-col>
            </el-row>
        </div>
        <el-row :gutter='20'>
            <el-col :offset='4' :span='16'>
                <div class='part3'>
                    <h1 class='heading'>
                        How Fed's Interest Rate Hikes Affect Markets and Trading Instruments
                    </h1>
                    <div>
                        <img alt='promote image' class='index' src='../../images/cpi1/hikeRate.jpg' />
                        <p>
                            Source: <a href='https://tradingeconomics.com/' style='color: #000' target='_blank'>
                                https://tradingeconomics.com
                            </a>
                        </p>
                    </div>
                    <div class='container'>
                        <h2 class='title'>
                            US Dollar
                        </h2>
                        <p class='text'>
                            When the FED hikes interest rates, it makes holding US dollars more attractive to investors seeking yield. Therefore, the US dollar tends to increase in value against other currencies.
                        </p>
                    </div>

                    <div class='container'>
                        <h2 class='title'>
                            US Treasury Bonds
                        </h2>
                        <p class='text'>
                            Higher interest rates also make US Treasury bonds more attractive to investors seeking yield. As a result, bond prices tend to fall when interest rates rise.
                        </p>
                    </div>

                    <div class='container'>
                        <h2 class='title'>
                            Stock Market
                        </h2>
                        <p class='text'>
                            The stock market can be impacted by interest rate hikes in multiple ways. Firstly, higher interest rates can lead to a decrease in consumer spending and business investment, which can negatively impact corporate earnings and stock prices. Secondly, higher interest rates can attract investors away from stocks and towards fixed-income investments like bonds.
                        </p>
                    </div>

                    <div class='container'>
                        <h2 class='title'>
                            Commodities
                        </h2>
                        <p class='text'>
                            Interest rate hikes can also impact commodity prices. When interest rates rise, the cost of borrowing increases, which can reduce demand for commodities such as oil and metals.
                        </p>
                        <p class='text'>
                            The impact of a FED interest rate hike on trading instruments will depend on various factors, including market expectations, economic conditions, and investor sentiment. It's important to understand the nuances of each instrument and how they might be impacted in the event of an interest rate hike.
                        </p>
                    </div>

                    <div class='container'>
                        <h2 class='title'>
                            Trading strategy during the high rate period
                        </h2>
                        <p class='text'>
                            If the interest rates are high, it may be a good idea to adopt a trading strategy that takes advantage of this situation. Here are some potential strategies you could consider:
                        </p>
                        <p class='text'>
                            1. Invest in fixed-income securities: When interest rates are high, fixed-income securities such as bonds tend to perform well. As interest rates rise, the value of existing bonds decreases, but new bonds issued will have higher yields. This can make them an attractive investment option.
                        </p>
                        <p class='text'>
                            2. Short stocks: High-interest rates can make borrowing money more expensive, which can be bad news for businesses that rely on debt to finance their operations. In such scenarios, short-selling stocks of those companies may result in profitable trades.
                        </p>
                        <p class='text'>
                            3. Look into dividend-paying stocks: Some companies will pay higher dividends when interest rates are high since they can earn more on their cash reserves. These types of stocks may offer a better return than other investments during times of high-interest rates.
                        </p>
                        <p class='text'>
                            3. Avoid investing in high-yield bonds: While it might seem counterintuitive, investing in high-yield or "junk" bonds may not be the best option when interest rates are high. This is because these bonds are often issued by companies with poor credit ratings, and higher rates make it more likely that these companies will default on their payments.
                        </p>
                        <p class='text'>
                            In conclusion, the best trading strategy will depend on your risk tolerance, investment goals, and market research. It's essential to conduct thorough research and seek professional advice before making any investment decisions.
                        </p>
                    </div>
                </div>
            </el-col>
        </el-row>
        <userLayoutFooter />
    </div>
</template>

<script>
import { h, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import topNav from '@planspc/layout/topNav'
import userLayoutFooter from '@planspc/modules/footer/footer'
export default {
    name: 'Cpi1',
    components: {
        ElMessage,
        ElMessageBox,
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

        const open = () => {
            ElMessageBox({
                title: 'Message',
                message: h('p', null, [
                    h('h2', null, 'Terms and Condition'),
                    h('br', null,),
                    h('p', null, "1. After opening a real account, use your personal Telegram to add Headline's Telegram account. You will receive 50 USDT bonus after confirming your identity with Headline Telegram admin."),
                    h('br', null,),
                    h('p', null, '2. The 50 USDT bonus is not to be withdrawn and to be used for trading purposes only.'),
                    h('br', null,),
                    h('p', null, '3. You can withdraw the profit made by using the 50 USDT bonus after making a deposit without any transaction volume restrictions. The 50 USDT bonus will be deducted after the promotion expires.'),
                    h('br', null,),
                    h('p', null, '4. Trading loses made by using the bonus are not to be borne. You can contact customer service to deduct the remaining bonus before making a deposit to make sure the system does not deduct your deposit amount after the promotion expires in the future.'),
                    h('br', null,),
                    h('p', null, '5. The promotion is valid for one month. If you do not make any transaction with the bonus or do not make any deposit until after the promotion expires, the 50 USDT bonus will be deducted.'),
                    h('br', null,),
                    h('p', null, '6. Headline reserves all rights regarding any dispute on this promotion.'),
                ]),
                confirmButtonClass: 'btnConfirm',
            })
        }
        return {
            jumpPage,
            open,
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';

  .claim50{
    overflow: hidden;
  }

  .claim {
    width: 100%;
  }

.part2{
  background-color: #7D1718;
  color: #fff;
  font-weight: 400;
  .money{
    font-weight: 800;
    font-size: 40px;
  }

  .claimMoney{
    padding: 100px 0;
  }

  .terms{
    color: #fff;
    font-size: 18px;
    text-decoration: underline;
    font-weight: 600;
    padding-top: 30px;
  }

  .terms:hover{
    color: #BB2423;
  }

  .info{
    font-size: 22px;
    padding-top: 10px;
    .bold{
      font-weight: bold;
    }

    .yellow{
      color: #FFF86B;
    }
  }
  .part2Button{
    padding-top: 50px;
  }
}

.part3{
  padding: 50px 0;
  .heading{
    font-size: 50px;
    font-weight: 600;
  }
  .container{
    .title{
      font-size: 28px;
      text-decoration: underline;
      padding-top: 40px;
    }
    .text{
      font-size: 18px;
      padding-top: 10px
    }
  }
}
.startNow{
  border: none;
  background-color: #000 !important;
  color: #fff !important;
  border-radius: unset !important;
  width: 200px;
  height: 50px;
  font-size: 20px;
}
.startNow:hover{
  color: #fff !important;
  background-color: #BB2423 !important;
}

.bannerAPP{
  display: none;
}

@media screen and (max-width: 1130px) {
  .part3{
    .heading{
      font-size: 40px;
    }
  }
}

@media screen and (max-width: 800px) {
  .bannerAPP{
    display: unset !important;
    width: 100%;
  }
  .claim{
    display: none !important;
  }
  .part2{
    .claimMoney{
      padding: 50px 0;
      .money{
        font-size: 30px !important;
      }
      .info{
        font-size: 18px;
      }
      .part2Button{
        padding-top: 30px;
        .startNow{
          width: 150px;
        }
      }
      .terms{
        font-size: 14px;
      }
    }
  }
  .part3{
    padding: 30px 0;
    .heading{
      font-size: 25px;
    }
    .index{
      width: 100%;
    }
    .container{
      .title{
        font-size: 20px;
      }
      .text{
        font-size: 14px;
      }
    }
  }
}

</style>
