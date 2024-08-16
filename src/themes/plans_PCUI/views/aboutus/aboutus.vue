<template>
    <div class='aboutus'>
        <div class='part1'>
            <el-row :gutter='60' style='max-width: 1200px; align-items: center;'>
                <el-col
                    class='aboutPart1'
                    :lg='14'
                    :md='14'
                    :sm='24'
                    :xl='14'
                    :xs='24'
                >
                    <div class='part1Container'>
                        <h1>About Headline</h1>
                        <p>
                            Founded in 2016, Headline is a financial service platform based on the financial event. We provide services to investors by analyzing hot topics in finance and helping you to improve your trading efficiency, build up “the top trading opportunities and trade in accordance with financial essence” investing value conception. Reduce investor's difficulty of obtaining information at the bottom level of capital movement.
                        </p>
                    </div>
                </el-col>
                <el-col :lg='10' :md='10' :sm='24' :xl='10' :xs='24'>
                    <img alt='brand' class='brandHeadline' src='../../images/craigIndexImg/brand.png' />
                </el-col>
            </el-row>
        </div>
        <div class='part2-1'>
            <el-row style='max-width: 1200px; align-items: center;margin: 0 auto;'>
                <el-col
                    :lg='8'
                    :md='8'
                    :sm='8'
                    :xl='8'
                    :xs='24'
                >
                    <div class='part2-1-item'>
                        <div>7<span>Years</span></div>
                        <p>Safety Operation</p>
                    </div>
                </el-col>
                <el-col
                    :lg='8'
                    :md='8'
                    :sm='8'
                    :xl='8'
                    :xs='24'
                >
                    <div class='part2-1-item center-item'>
                        <div>160,000+</div>
                        <p>Registered Accounts</p>
                    </div>
                </el-col>

                <el-col
                    :lg='8'
                    :md='8'
                    :sm='8'
                    :xl='8'
                    :xs='24'
                >
                    <div class='part2-1-item'>
                        <div>110+<span>Million</span></div>
                        <p>Trades Executed</p>
                    </div>
                </el-col>
            </el-row>
        </div>
        <!-- <div class='part3'>
            <div class='part3Box'>
                <h1>Regulation and License</h1>
                <p>Headline is a trademark of Magic Compass Ltd. We have multiple Financial Licenses in worldwide. You can click each License below to check the details:</p>
                <span class='aboutUsCards'>
                    <el-row :gutter='20' style='justify-content: space-between;'>
                        <el-col :lg='12' :md='24' :sm='24' :xl='12' :xs='24'>
                            <el-card class='box-card card1'>
                                <div>
                                    <img alt='' src='../../images/craigAbout/image1.png' style='width: 161px; margin-left: 50px' />
                                    <p style='margin-left: 20px'>
                                        <span>
                                            Magic Compass Ltd. Holds U.S Money service Business certificate regulated by the
                                        </span>
                                        <span style='color: #BE1E2D;' @click='Alabel(0)'>
                                            U.S FinCEN (Registration Number: 31000223587105)
                                        </span>
                                    </p>
                                </div>
                            </el-card>
                        </el-col>
                        <el-col :lg='12' :md='24' :sm='24' :xl='12' :xs='24'>
                            <el-card class='box-card card1'>
                                <div>
                                    <img alt='' src='../../images/craigAbout/image2.png' style='width: 161px' />
                                    <p>
                                        <span>
                                            Magic Compass Ltd. is a European investment firm regulated by the
                                        </span>
                                        <span style='color: #BE1E2D;' @click='Alabel(1)'>
                                            Cyprus Securities and Exchange Commission (CySEC) (license number 299/16).
                                        </span>
                                    </p>
                                </div>
                            </el-card>
                        </el-col>
                    </el-row>
                    <el-row :gutter='20' style='justify-content: space-between;'>
                        <el-col :lg='12' :md='24' :sm='24' :xl='12' :xs='24'>
                            <el-card class='box-card card2'>
                                <div>
                                    <img alt='' src='../../images/craigAbout/image3.png' style='width: 161px' />
                                    <p>
                                        <span>Magic Compass Ltd. holds</span>
                                        <span style='color: #BE1E2D;' @click='Alabel(2)'>
                                            Hong Kong's Securities and Futures Commission (SFC) license ATX242
                                        </span>
                                        <span>
                                            including the Type 1 License for dealing in securities, Type 2 License for dealing in futures contracts, Type 3 License for Leveraged Foreign Exchange Trading, Type 4 License for advising on securities and Type 9 License for asset management.
                                        </span>
                                    </p>
                                </div>
                            </el-card>
                        </el-col>
                        <el-col :lg='12' :md='24' :sm='24' :xl='12' :xs='24'>
                            <el-card class='box-card card2'>
                                <div>
                                    <img alt='' src='../../images/craigAbout/image6.png' style='width: 161px' />
                                    <p>
                                        <span>
                                            Estonia MTR license is regulated by  Estonian law Money Laundering and Terrorist Financing Prevention Act, give us authority to offer cryptocurrency exchange and crypto wallet services  to Estonia and EU region.
                                        </span>
                                        <span style='color: #BE1E2D;' @click='Alabel(5)'>
                                            Magic Compass Ltd, MTR ID: 14767165
                                        </span>
                                    </p>
                                </div>
                            </el-card>
                        </el-col>
                        <el-col :lg='12' :md='24' :sm='24' :xl='12' :xs='24'>
                            <el-card class='box-card card2'>
                                <div>
                                    <img alt='' src='../../images/craigAbout/image4.png' style='width: 161px' />
                                    <p>
                                        <span>
                                            NFA is the industry wide, self-regulatory organization for the U.S. derivatives industry. Designated by the CFTC as a registered futures association, NFA strives every day to safeguard the integrity of the derivatives markets, protect investors and ensure Members meet their regulatory responsibilities.
                                        </span>
                                        <span style='color: #BE1E2D;' @click='Alabel(3)'>
                                            MAGIC COMPASS LTD NFA ID: 0547474.
                                        </span>
                                    </p>
                                </div>
                            </el-card>
                        </el-col>
                    </el-row>
                    <div>
                        <img alt='' src='../../images/craigAbout/image5.png' />
                        <p>
                            <span>
                                FCA is the conduct regulator for around 51,000 financial services firms and financial markets in the UK.
                            </span>
                            <span @click='Alabel(4)'>
                                MAGIC COMPASS LTD FCA reference number: 771683.
                            </span>
                        </p>
                    </div>
                    <el-row :gutter='20' style='justify-content: space-between;'>
                        <el-col :lg='12' :md='24' :sm='24' :xl='12' :xs='24'>
                            <el-card class='box-card card1'>
                                <div>
                                    <img alt='' src='../../images/craigAbout/image6.png' style='width: 161px' />
                                    <p>
                                        <span>
                                            Estonia MTR license is regulated by  Estonian law Money Laundering and Terrorist Financing Prevention Act, give us authority to offer cryptocurrency exchange and crypto wallet services  to Estonia and EU region.
                                        </span>
                                        <span style='color: #BE1E2D;' @click='Alabel(5)'>
                                            Magic Compass Ltd, MTR ID: 14767165
                                        </span>
                                    </p>
                                </div>
                            </el-card>
                        </el-col>
                        <el-col :lg='12' :md='24' :sm='24' :xl='12' :xs='24' />
                    </el-row>
                </span>
            </div>
        </div> -->
        <div class='part4'>
            <div class='part4Box'>
                <h1>Vision and Goal</h1>
                <h2>Our Vision</h2>
                <p>
                    Our Vision is to be a multi-asset fintech group. We will expand our core product offering to new and existing markets, launch new trading and financial products, and deepen our engagement with customers. Headline enables you to trade a variety of simple, transparent contracts for difference (CFDs), equities and foreign exchange around the clock in multiple marketplaces.
                </p>
                <h2>
                    Our Goal
                </h2>
                <p>
                    Our goal is providing you with reliable and intuitive access to financial opportunities.
                </p>
            </div>
        </div>
        <div class='part5'>
            <div class='part5Box'>
                <h1>Invest Globally</h1>
                <p>
                    Headline is our new integrated trading platform that combines all securities, futures, currencies and commodities trading under one roof. Through Headline you can invest in more than 100 financial products with just one integrated account. Indulge in trading over 6 major markets, seize every global opportunity and make money of the market trends.
                </p>
                <img alt='map' src='../../images/craigIndexImg/map.png' style='width: 700px; align-self: center;' />
            </div>
        </div>
        <div class='part6'>
            <el-row :gutter='60'>
                <el-col
                    :lg='12'
                    :md='12'
                    :sm='24'
                    :xl='12'
                    :xs='24'
                >
                    <!-- <h1>Award-winning service</h1>
                    <p>
                        At HEADLINE, we’re with you for every trade. Enjoy the benefits of award-winning service, 24/5 customer support and all the features top traders need.-Flexible leverage on a wide range of trading products-The potential to profit whether prices are going up or down-Enjoy $0 setup fees, 0% commission, low spread
                    </p>
                    <p>
                        -Best Broker UK – 2016<br />
                        -Best overall Broker – 2018<br />
                        -Best educational broker UK – 2021<br />
                        -Most innovative CFD broker UK – 2022<br />
                        -Most trusted trading platform Europe – 2019
                    </p> -->
                    <h1 class='part6Heading2'>
                        Highlight Feature
                    </h1>
                    <p>
                        Real-time updates and cellphone push of valuable “Headline” for trader to take advantage,
                        HEADLINE provides traders with a large number of intelligent news insights, allowing traders to grasp the latest financial news and be able to seize every trading opportunity in time.
                        Combine with our Trading Campus and the guide of our professional trading instructors, even new investors is easy to seize opportunities from Headline after learn and practice.
                    </p>
                    <img alt='' class='aboutLogoImg' src='../../images/aboutus/about_logo.png' />
                    <p>Headline is a trademark of Magic Compass Ltd.</p>
                </el-col>
                <el-col
                    :lg='12'
                    :md='12'
                    :sm='24'
                    style='align-self: center;'
                    :xl='12'
                    :xs='24'
                >
                    <img alt='' class='companyImg' src='../../images/aboutus/about-part6.png' />
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Aboutus',
    methods: {
        Alabel (key) {
            switch (key) {
                case 0:
                    window.open('https://www.fincen.gov/msb-registrant-search')
                    break
                case 1:
                    window.open('https://www.cysec.gov.cy/en-GB/entities/investment-firms/cypriot/79045/')
                    break
                case 2:
                    window.open('https://apps.sfc.hk/publicregWeb/corp/AXT242/details')
                    break
                case 3:
                    window.open('https://www.nfa.futures.org/BasicNet/basic-profile.aspx?nfaid=QhseGnuwVzA%3D')
                    break
                case 4:
                    window.open('https://register.fca.org.uk/s/firm?id=001b000003gBG6OAAW')
                    break
                case 5:
                    window.open('https://ariregister.rik.ee/eng?')
                    break
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.aboutLogoImg {
    width: 180px !important;
    height: auto;
    margin: 24px 0;
}

.box-card{
    width: 540px;
}

.card1{
    min-height: 205px
}

.card2{
    min-height: 367px;
}
.aboutApart1{
    align-self: center;
    width: 60%;
    justify-self: center;
    padding: 50px 0;
}
.aboutus{
//   padding-top: 70px;
//   margin-left: 65px;
    padding:0 0 20px 0;
    overflow: hidden;
    img{
        width: 100%;
        height: auto;
        vertical-align: middle;
    }
    .part1{
        background: radial-gradient(50% 50% at 50% 50%, #002764 0%, #001C4D 100%);
        height: auto;
        min-height: 400px;
        text-align-last: center;
        display: grid;
        align-content: center;
        justify-content: center;
        .part1Container{
            padding: 30px 30px;
        }
        h1{
            background: -webkit-linear-gradient(270deg, #B38731 0%, #DEC38F 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            font-size: 40px;
            font-weight: 800;
            font-family: 'roboto';
            text-align-last: left;
        }
        p{
            color: #EAF0FD;
            font-size: 16px;
            text-align-last: left;
        }
        .brandHeadline{
            width: 100%;
            height: 100%;
            object-fit: contain;
        }
    }
    .part2-1{
        background-color: #26A6E5;
        color: var(--contentColor);
        font-family: 'Inter';
        font-style: normal;
        font-size: 18px;
        .part2-1-item{
            position: relative;
            height: 133px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            &>div{
                font-size: 44px;
                font-weight: bold;
                line-height: 44px;
                &>span{
                    font-weight: 400;
                    font-size: 20px;
                    line-height:20px;
                }
            }
            &.center-item{
                &::before{
                    content:'';
                    position: absolute;
                    height: 60px;
                    width: 3px;
                    background: var(--contentColor);
                    left:0;
                    top:50%;
                    transform: translateY(-50%);
                }
                &::after{
                    content:'';
                    position: absolute;
                    height: 60px;
                    width: 3px;
                    background: var(--contentColor);
                    right:0;
                    top:50%;
                    transform: translateY(-50%);
                }
            }

        }
    }
    .part2{
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #26A6E5;
        box-sizing: border-box;
        height: 133px;
        color:var(--contentColor);
        div{
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            p{
                font-family: 'DIN Pro-Bold';
                height: 80px;
                span:nth-child(1){
                    font-size: 65px;
                    color: #EAF0FD;
                    font-weight: 600;
                }
                span:nth-child(2){
                    font-size: 28px;
                    color: #EAF0FD;
                    font-weight: 550;
                }
            }
            li{
                list-style: none;
                font-family: 'Montserrat-Regular';
                font-size: 24px;
                color: #EAF0FD;
            }
        }
        div:nth-child(2){
            margin: 0 80px;
        }
    }
    .part3{
        width: 100%;
        background-color: #fff;
        .part3Box{
            max-width: 1200px;
            margin: 0 auto;
            box-sizing: border-box;
            padding: 40px 0 40px;
            h1{
                font-family: "roboto";
                color: #000;
                font-size: 40px;
            }
            p{
            font-family: "roboto";
            font-size: 20px;
            padding-bottom: 40px;
            }
            div{
                display: flex;
                justify-content: center;
                align-items: flex-start;
                margin-bottom: 10px;
                img{
                    width: 290px;
                    height: auto;
                    margin-right: 50px;
                }
                p{
                    color: #000;
                    font-family: 'roboto';
                    font-size: 16px;
                    span:nth-child(2){
                        text-decoration: underline;
                        cursor: pointer;
                    }
                }
            }
        }
    }
    .part4{
        width: 100%;
        height: 600px;
        background: url('../../images/craigAbout/part5Banner.png') no-repeat;
        background-size: cover;
        .part4Box{
            max-width: 1260px;
            margin: 0 auto;
            box-sizing: border-box;
            padding: 80px 30px 70px;
            display: flex;
            flex-direction: column;
            justify-content: left;
            h1{
                font-family: 'roboto',;
                color: #FFF;
                font-size: 40px;
                font-weight: 800;
            }
            h2{
                font-family: 'roboto';
                color: #FFF;
                font-size:  30px;
                line-height: 50px;
                padding: 12px 0;
                font-weight: normal;
            }
            p{
                font-family: 'roboto',;
                color: #FFF;
                font-size: 20px;
                line-height: 26px;
                padding-bottom: 30px;
            }
        }
    }

    .part5{
        width: 100%;
        height: 600px;
        background: #FFF;
        .part5Box{
            max-width: 1260px;
            margin: 0 auto;
            box-sizing: border-box;
            padding: 60px 30px 60px;
            display: flex;
            flex-direction: column;
            justify-content: left;
            h1{
                font-family: 'roboto',;
                color: #24262B;
                font-size: 40px;
                font-weight: 800;
                line-height: 50px;
            }
            p{
            font-family: 'roboto',;
            color: #24262B;
            font-size: 20px;
            line-height: 26px;
            padding: 12px 0 40px;
            }
        }
    }

    .part6{
        max-width: 1200px;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-sizing: border-box;
        padding: 60px 0;
        div{
            h1{
                font-family: 'Roboto';
                color: #24262B;
                font-size: 40px;
                margin-bottom: 12px;
                font-weight: 800;
                line-height: 50px;
            }
            .part6Heading2{
            padding-top: 40px;
            }
            p{
                color: #24262B;
                font-family: 'Roboto';
                font-weight: 100;
                text-align: justify;
                font-size: 20px;
                line-height: 26px;
                margin-bottom: 15px;
                font-weight: 400;
            }
        }
        img{
            max-width: 550px;
            height: auto;
        }
    }
}
  @media (max-width:1199px) {
    .aboutUsCards{
      justify-content: center;
    }
  }

  @media (max-width:1100px) {
    .aboutus{
      margin-left: unset;
    }
    .part3Box{
      padding: 40px 30px !important;
    }
    .part6{
      padding: 60px 30px !important;
    }
  }
  @media (max-width:991px) {
    .part6{
      .companyImg{
        text-align: center;
      }
    }
  }
  @media (max-width:768px) {
    .aboutus{
        .part2-1{
            .part2-1-item{
                height: 100px;
                &.center-item{
                    &::before{
                        content:'';
                        position: absolute;
                        height: 1px;
                        width:100%;
                        background: var(--contentColor);
                        left:0;
                        top:0;
                        transform: translateY(0);
                    }
                    &::after{
                        content:'';
                        position: absolute;
                        height: 1px;
                        width:100%;
                        background: var(--contentColor);
                        left:0;
                        bottom:0;
                        top:unset;
                        transform: translateY(0);
                    }
                }
            }
        }
    }

  }
</style>
