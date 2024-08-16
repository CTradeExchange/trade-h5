<template>
    <div class='competitionDetails'>
        <div class='container'>
            <p class='date'>
                May 03, 2023 <span>19:00(GMT +1:00)</span>
            </p>
            <h1 class='heading'>
                Federal Interest Rate Decision
            </h1>
            <p class='text'>
                During <span class='underline'>
                    May 03 to May 16, Headline.net
                </span> will launch the <span class='underline'>
                    FED trading competition
                </span>,<br />and the eligible trading pair is <span class='underline'>
                    EUR/USD. $5,000
                </span> will be the reward for the trader with most profits.
            </p>
            <el-button
                class='terms lp_btn'
                link
                @click='open'
            >
                *Terms and conditions apply
            </el-button>
            <el-row class='regButton' :gutter='20'>
                <el-col
                    :lg='4'
                    :md='4'
                    :sm='24'
                    :xl='4'
                    :xs='24'
                >
                    <el-button class='webButton lp_btn lp_btn_home' round @click='jumpPage(1)'>
                        Ofiicial Website
                    </el-button>
                </el-col>
                <el-col
                    class='appContainer'
                    :lg='4'
                    :md='4'
                    :sm='24'
                    :xl='4'
                    :xs='24'
                >
                    <el-button class='appButton lp_btn lp_btn_appDownload' round @click='jumpPage(2)'>
                        Download APP
                    </el-button>
                </el-col>
                <el-col
                    :lg='4'
                    :md='4'
                    :sm='24'
                    :xl='4'
                    :xs='24'
                >
                    <el-button class='tgButton lp_btn_tgBot lp_btn' round @click='jumpPage(3)'>
                        Telegram Bot
                    </el-button>
                </el-col>
            </el-row>
        </div>
        <div>
            <img alt='promote image' class='index' src='../../../images/cpi1/fullPageBanner.jpg' />
        </div>
        <el-row class='part4Container'>
            <el-col
                class='col1'
                :lg='6'
                :md='6'
                :sm='12'
                :xl='6'
                :xs='12'
            >
                <div class='redBox'>
                    <img alt='promote image' class='icon' src='../../../images/cpi1/icon/security.png' />
                    <h2>Protected & Secure</h2>
                    <p>Your data is safe and your funds are kept in segregated bank accounts, in accordance with regulatory requirements.</p>
                </div>
            </el-col>
            <el-col
                class='col2'
                :lg='6'
                :md='6'
                :sm='12'
                :xl='6'
                :xs='12'
            >
                <div class='redBox'>
                    <img alt='promote image' class='icon' src='../../../images/cpi1/icon/telephone.png' />
                    <h2>Professional support</h2>
                    <p>Get around-the-clock dedicated customer service in multiple languages.</p>
                </div>
            </el-col>
            <el-col
                class='col1'
                :lg='6'
                :md='6'
                :sm='12'
                :xl='6'
                :xs='12'
            >
                <div class='redBox'>
                    <img alt='promote image' class='icon' src='../../../images/cpi1/icon/blank-page.png' />
                    <h2>Reliable</h2>
                    <p>Licensed and regulated by a variety of global leading regulators. </p>
                </div>
            </el-col>
            <el-col
                class='col2'
                :lg='6'
                :md='6'
                :sm='12'
                :xl='6'
                :xs='12'
            >
                <div class='redBox'>
                    <img alt='promote image' class='icon' src='../../../images/cpi1/icon/like.png' />
                    <h2>Connect</h2>
                    <el-row class='buttonContainer' :gutter='20'>
                        <el-col
                            :lg='6'
                            :md='12'
                            :sm='12'
                            :xl='6'
                            :xs='12'
                        >
                            <img alt='promote image' class='socialMedia' src='../../../images/cpi1/icon/facebook.png' @click='jumpPage(4)' />
                        </el-col>
                        <el-col
                            :lg='6'
                            :md='12'
                            :sm='12'
                            :xl='6'
                            :xs='12'
                        >
                            <img alt='promote image' class='socialMedia' src='../../../images/cpi1/icon/twitter.png' @click='jumpPage(5)' />
                        </el-col>
                        <el-col
                            :lg='6'
                            :md='12'
                            :sm='12'
                            :xl='6'
                            :xs='12'
                        >
                            <img alt='promote image' class='socialMedia' src='../../../images/cpi1/icon/linkedin.png' @click='jumpPage(6)' />
                        </el-col>
                        <el-col
                            :lg='6'
                            :md='12'
                            :sm='12'
                            :xl='6'
                            :xs='12'
                        >
                            <img alt='promote image' class='socialMedia' src='../../../images/cpi1/icon/instagram.png' @click='jumpPage(7)' />
                        </el-col>
                    </el-row>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import { h, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
export default {
    name: 'Cpi1',
    components: {
        ElMessage,
        ElMessageBox,
    },
    setup (props) {
        const jumpPage = (attr) => {
            switch (attr) {
                case 1 :
                    window.open('https://www.headline.net/en-US/home')
                    break
                case 2 :
                    window.open('https://www.headline.net/en-US/download')
                    break
                case 3 :
                    window.open('https://t.me/Headline_OfficialBot')
                    break
                case 4 :
                    window.open('https://www.facebook.com/HeadlineTrade')
                    break
                case 5 :
                    window.open('https://twitter.com/headline_trade')
                    break
                case 6 :
                    window.open('https://www.linkedin.com/company/headline-net')
                    break
                case 7 :
                    window.open('https://www.instagram.com/headlinenet/')
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
.competitionDetails{
  .container{
    text-align: center;

    .regButton{
      padding: 30px 0;
      justify-content: center;
    .webButton{
      background-color: unset;
      color: #BB2423;
      border-radius: 20px;
      border: 1px solid #BB2423;
      width: 140px;
      font-size: 16px;
    }
    .webButton:hover{
      background-color: #BB2423;
      color:#fff;
    }
    .appButton{
      background-color: #000;
      color: #fff;
      border-radius: 20px;
      border: unset;
      width: 140px;
      font-size: 16px;
    }
    .appButton:hover{
      background-color: #BB2423;
    }
    .tgButton{
      background-color: #3D9BE9;
      color: #fff;
      border-radius: 20px;
      border: unset;
      width: 140px;
      font-size: 16px;
    }
    .tgButton:hover{
      background-color: #BB2423;
    }
  }

    .date{
      font-size: 33px;
    }

    .terms{
      padding-top: 20px;
      font-size: 14px;
    }

    .text{
      font-size: 20px;
      padding-top: 30px;
      .underline{
        text-decoration: underline;
        font-weight: bold;
      }
    }
    .heading{
      font-weight: bold;
      font-size: 41px;
      color: rgb(187,36,35);
    }
  }
  .col1{
    border: 1px solid red;
    border-width: 1px 1px;
    text-align: center;
  }
  .col2{
    border: 1px solid red;
    border-width: 1px 0px;
    text-align: center;
  }
  .icon{
    width: 25px;
    filter: invert(16%) sepia(72%) saturate(2755%) hue-rotate(345deg) brightness(113%) contrast(96%);
  }
  .socialMedia{
    width: 35px;
    cursor: pointer;
  }
}

.part4Container{
  padding-top: 50px;
  .redBox{
    padding: 90px 15px;
    .buttonContainer{
      justify-content: space-evenly;
    }
    h2{
      color: #D00B22;
      font-weight: bold;
      font-size: 20px;
      line-height: 1.8em;
    }
    P{
      font-size: 16px;
      line-height: 1.8em;
    }
  }
}

@media screen and (max-width: 991px) {
  .appContainer{
    padding: 20px 0;
  }
}
</style>
