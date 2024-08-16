<template>
    <div class='promotion'>
        <!--Part1-->
        <section id='Part1'>
            <div className='Bholder'>
                <div className='HB'>
                    <el-row :gutter='10'>
                        <el-col
                            :lg='10'
                            :md='24'
                            :sm='24'
                            style='align-self: center'
                            :xl='10'
                            :xs='24'
                        >
                            <h2 class='Part1h2'>
                                Get started with Headline.net
                            </h2>
                            <h1 class='Part1h1'>
                                All In One Trading Platform
                            </h1>
                            <h2 class='Part1h2'>
                                With unique market insight
                            </h2>
                            <p class='Part1Text1'>
                                A Platform where users could receive the<br />
                                latest valuable news and professional comments,<br />
                                then do the trading and own profit
                            </p>
                            <div class='Part1Btn'>
                                <router-link to='/register'>
                                    <el-button class='Btn1 lp_btn lp_btn_register' round>
                                        <p class='Btn1 lp_btn lp_btn_register'>
                                            Try it Now
                                        </p>
                                    </el-button>
                                </router-link>

                                <router-link to='/home'>
                                    <el-button class='Btn2 lp_btn lp_btn_home' round>
                                        <img alt='Brands.list1Title' class='Part2Down' src='../../images/content/Shape.png' />
                                        <p class='Btn2 lp_btn lp_btn_home'>
                                            Video intro
                                        </p>
                                    </el-button>
                                </router-link>
                            </div>
                        </el-col>

                        <el-col :lg='14' :md='24' :sm='24' :xl='14' :xs='24'>
                            <div>
                                <img alt='Brands.list1Title' class='cryptoConcept' src='../../images/content/GroupHand.png' />
                            </div>
                        </el-col>
                    </el-row>
                </div>
            </div>
        </section>

        <!--Part2-->
        <section id='core' className='featured featured-4 featured-left'>
            <div className='Part2Container'>
                <h1 class='Part2H'>
                    About HEADLINE
                </h1>
                <p class='Part2Text'>
                    A top global broker, a brand you can trustBroker of choice for 70,000+ clients in<br />
                    10+ countries Multiple Countries' Financial licenses A world of opportunities<br />
                    Use the HEADLINE Trading Platform to access a huge range of trading markets,<br /><br />

                    including:<br />
                    - The world's most widely traded FX currency pairs<br />
                    - Highly valued commodities including Gold, Silver and Oil<br />
                    - Leading indices across the world's most important sectors-Top digital currency
                </p><br />

                <h1 class='Part2H'>
                    Award-winning service
                </h1>
                <p class='Part2Text'>
                    At HEADLINE, we're with you for every trade. Enjoy the benefits of award-winning service,<br />
                    24/5 customer support and all the features top traders need. Flexible leverage on a wide range of trading products. The potential to profit whether prices are going up or down-Enjoy $0 setup fees, 0% commission, low spread<br />
                    -Best Broker UK - 2016<br />
                    -Best overall Broker - 2018<br />
                    -Best educational broker UK - 2021<br />
                    -Most innovative CFD broker UK - 2022<br />
                    -Most trusted trading platform Europe - 2019
                </p><br />

                <h1 class='Part2H'>
                    Highlight Feature
                </h1>
                <p class='Part2Text' style='padding-bottom: 30px;'>
                    Real-time updates and cellphone push of valuable "Headline" for trader to take advantage, HEADLINE provides traders with a large number of intelligent news<br />
                    insights, allowing traders to grasp the latest financial news and be able to seize every trading opportunity in time. Combine<br />
                    with our Trading Campus and the guide of our professional trading instructors, even new investors is easy to seize opportunities from Headline<br />
                    after learn and practice.
                </p>

                <el-card id='Part2Card' class='box-card'>
                    <div class='Part2CardText'>
                        <div>
                            <img alt='Brands.list1Title' class='Part2Image' src='../../images/content/Register.png' />
                            <p class='circle'>
                                1
                            </p>
                            <p class='box-cardText'>
                                Register
                            </p>
                        </div>

                        <div class='Part2Group'>
                            <img alt='Brands.list1Title' class='Part2Image' src='../../images/content/GroupImage.png' />
                        </div>

                        <div>
                            <img alt='Brands.list1Title' class='Part2Image' src='../../images/content/Bonus.png' />
                            <p class='circle'>
                                2
                            </p>
                            <p class='box-cardText'>
                                Collect Bonus
                            </p>
                        </div>

                        <div class='Part2Group'>
                            <img alt='Brands.list1Title' class='Part2Image' src='../../images/content/GroupImage.png' />
                        </div>

                        <div>
                            <img alt='Brands.list1Title' class='Part2Image' src='../../images/content/Asset.png' />
                            <p class='circle'>
                                3
                            </p>
                            <p class='box-cardText'>
                                Choose your Favorite Assets
                            </p>
                        </div>

                        <div class='Part2Group'>
                            <img alt='Brands.list1Title' class='Part2Image' src='../../images/content/GroupImage.png' />
                        </div>

                        <div>
                            <img alt='Brands.list1Title' class='Part2Image' src='../../images/content/Bid.png' />
                            <p class='circle'>
                                4
                            </p>
                            <p class='box-cardText'>
                                Place a bid
                            </p>
                        </div>
                    </div>
                </el-card>

                <div class='wrap'>
                    <div class='ball'></div>
                </div>
            </div>
        </section>

        <!--Part3-->
        <section id='part3'>
            <div className='part3container'>
                <el-row>
                    <el-col :lg='14' :md='24' :sm='24' :xl='14' :xs='24'>
                        <div>
                            <img alt='Brands.list1Title' class='cryptoConcept' src='../../images/content/HeadlineWeb.png' />
                        </div>
                    </el-col>
                    <el-col

                        :lg='10'
                        :md='24'
                        :sm='24'
                        style='padding: 0 20px'
                        :xl='10'
                        :xs='24'
                    >
                        <div class='part3Text'>
                            <h2>ABOUT WEB APP</h2>
                            <h1 class='part3TextH1'>
                                Just focus on<br /> Headline News
                            </h1>
                            <p class='part3Text1'>
                                We will take care of everything else
                            </p>

                            <div class='rectangle'>
                                <span>
                                    <img alt='Line' class='tick' src='../../images/content/check.png' />
                                    <h1 class='rectangleH'>
                                        Verified profile
                                    </h1>
                                </span>
                                <p class='rectangleT'>
                                    HEADLINE is a platform that aims to build a new creative economy
                                </p>
                            </div>

                            <div class='rectangle1'>
                                <img alt='Line' class='part3Line' src='../../images/content/Line.png' />
                                <h3>Place a bid</h3>
                            </div>

                            <div class='rectangle1'>
                                <img alt='Line' class='part3Line' src='../../images/content/Line2.png' />
                                <h3>Multiple Assets</h3>
                            </div>
                        </div>
                    </el-col>
                </el-row>
            </div>
        </section>

        <!--Part4-->
        <section id='part4'>
            <div class='part4container'>
                <el-row>
                    <el-col
                        :lg='12'
                        :md='24'
                        :sm='24'
                        style='display: flex'
                        :xl='12'
                        :xs='24'
                    >
                        <div class='part4HT'>
                            <h1 class='part4Head'>
                                Manage your portfolio
                            </h1>
                            <p class='part4Text'>
                                Fully control your investments assets and the potential risks by tracking ongoing performance
                            </p>
                        </div>
                        <img alt='Line' class='part4Image' src='../../images/content/Asset.svg' />
                    </el-col>
                    <el-col
                        :lg='12'
                        :md='24'
                        :sm='24'
                        style='display: flex'
                        :xl='12'
                        :xs='24'
                    >
                        <div class='part4HT'>
                            <h1 class='part4Head'>
                                Keep eyes on HEADLINE
                            </h1>
                            <p class='part4Text'>
                                Check the latest valuable news and do the trading based the information in the one place.
                            </p>
                        </div>
                        <img alt='Line' class='part4Image' src='../../images/content/place.svg' />
                    </el-col>
                </el-row>
                <el-row>
                    <el-col
                        :lg='12'
                        :md='24'
                        :sm='24'
                        style='display: flex'
                        :xl='12'
                        :xs='24'
                    >
                        <div class='part4HT'>
                            <h1 class='part4Head'>
                                Secure storage
                            </h1>
                            <p class='part4Text'>
                                Multiple security measures, and complete financial supervision in the one place.
                            </p>
                        </div>
                        <img alt='Line' class='part4Image' src='../../images/content/Bid.svg' />
                    </el-col>
                    <el-col
                        :lg='12'
                        :md='24'
                        :sm='24'
                        style='display: flex'
                        :xl='12'
                        :xs='24'
                    >
                        <div class='part4HT'>
                            <h1 class='part4Head'>
                                Support for 100+ Assets
                            </h1>
                            <p class='part4Text'>
                                invest in Indices, Foreign Exchange Market, Commodities and Digital Currency all from the same place.
                            </p>
                        </div>
                        <img alt='Line' class='part4Image' src='../../images/content/Bonus.svg' />
                    </el-col>
                </el-row>
            </div>
        </section>

        <!--Part5-->
        <section id='part5'>
            <div>
                <h3>popular on app store</h3>
                <h1>One Stop Trading Platform</h1>
                <p>Over 70,000 traders use HEADLINE everyday</p>
                <img alt='Line' class='part3Line' src='../../images/content/GroupPhone.png' />
            </div>
            <span class='download'>
                <el-row :gutter='40' style='max-width: 1350px'>
                    <el-col :lg='8' :md='24' :sm='24' :xl='8' :xs='24'>
                        <a href='https://t.me/Headline_OfficialBot'>
                            <!-- <a href='https://t.me/headline_official'> -->
                            <img alt='' class='telegram' src='../../images/craigIndexImg/TG@2x.png' />
                        </a>
                    </el-col>
                    <el-col :lg='8' :md='24' :sm='24' :xl='8' :xs='24'>
                        <a href='https://apps.apple.com/app/id1639509598'>
                            <img alt='' class='ios' src='../../images/craigIndexImg/IOS@2x.png' />
                        </a>
                    </el-col>
                    <el-col :lg='8' :md='24' :sm='24' :xl='8' :xs='24'>
                        <a href='https://play.google.com/store/apps/details?id=com.mc900.mc900&pli=1'>
                            <img alt='' class='googlePlay' src='../../images/craigIndexImg/GP@2x.png' />
                        </a>
                    </el-col>
                </el-row>
            </span>
        </section>

        <!--Part6-->
        <section id='part6'>
            <div class='part6container'>
                <el-card id='Part2Card' class='box-card'>
                    <el-row id='part6row1'>
                        <el-col
                            :lg='12'
                            :md='24'
                            :sm='24'
                            style='align-self: center; padding: 20px 0;'
                            :xl='12'
                            :xs='24'
                        >
                            <h3>testimonial</h3>
                            <h1>70,000+ users<br />around the world</h1>
                            <p>We will take care of everything else</p>
                        </el-col>
                        <el-col :lg='12' :md='12' :sm='12' :xl='12' :xs='12'>
                            <img alt='Line' class='part6Img' src='../../images/content/Users.png' />
                        </el-col>
                    </el-row>
                </el-card>
                <el-row id='part6row2'>
                    <el-col
                        id='part6Card1'
                        :lg='8'
                        :md='24'
                        :sm='24'
                        :xl='8'
                        :xs='24'
                    >
                        <el-card :body-style="{ padding: '0px' }" class='part6Cards'>
                            <img
                                class='image'
                                src='../../images/content/klay.svg'
                            />
                            <div class='part6CardsText'>
                                <span>With headline.net, I'm able to access all the information I need to stay informed and make better trading decisions. It is the perfect complement to my other tools – like Magic Compass services – that have made my trading successful over the past 5 years.</span>
                                <h1 class='part6Cardsh1'>
                                    Klay Huang
                                </h1>
                                <p class='part6Cardsp1'>
                                    Wall street broker
                                </p>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col
                        id='part6Card2'
                        :lg='8'
                        :md='24'
                        :sm='24'
                        :xl='8'
                        :xs='24'
                    >
                        <el-card class='part6Cards'>
                            <img
                                class='image'
                                src='../../images/content/diana.svg'
                            />
                            <div class='part6CardsText'>
                                <span>Headline.net is an online platform that makes it easy to understand market trends quickly and accurately. You can get a clear picture of the current market conditions and make informed decisions on your investments.</span>
                                <h1 class='part6Cardsh2'>
                                    Diana Fischer
                                </h1>
                                <p class='part6Cardsp2'>
                                    Hedge fund manager
                                </p>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col
                        id='part6Card3'
                        :lg='8'
                        :md='24'
                        :sm='24'
                        :xl='8'
                        :xs='24'
                    >
                        <el-card :body-style="{ padding: '0px' }" class='part6Cards'>
                            <img
                                class='image'
                                src='../../images/content/Paula.svg'
                            />
                            <div class='part6CardsText'>
                                <span>Headline Informing is the perfect platform for modern traders who want to make quick decisions and maximize their profits.</span>
                                <h1 class='part6Cardsh3'>
                                    Paula D. Macht
                                </h1>
                                <p class='part6Cardsp3'>
                                    Security analyst
                                </p>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>
            </div>
        </section>

        <!--Part7-->
        <section id='part7'>
            <div class='part7Container'>
                <h3>Stay with Headline</h3>
                <h1>Discover the reviews of HEADLINE</h1>
                <p>We will take care of everything else</p>
                <img alt='Line' class='part7Video' src='../../images/content/video.png' />
            </div>
            <router-link to='/register'>
                <el-button id='part7Btn' class='lp_btn lp_btn_register' round>
                    <p class='lp_btn lp_btn_register'>
                        Join us now
                    </p>
                </el-button>
            </router-link>
        </section>

        <!--Part8-->
        <section id='part8'>
            <div class='part8Container'>
                <h3>Success with Headline.net</h3>
                <h1>The updatest economic index</h1>
                <img alt='Line' class='part8Line' src='../../images/content/EconomicCalendar.svg' />
            </div>
            <h1 class='part8H1'>
                Latest Economic News & Analysis
            </h1>
            <img alt='Line' class='part8Line' src='../../images/content/News.svg' />
            <h1 class='part8H2'>
                The Clarity & Insight You Need
            </h1>
            <div class='part8Group'>
                <img alt='Line' class='part8Img' src='../../images/content/News3.svg' />
                <img alt='Line' class='part8Img' src='../../images/content/News1.svg' />
            </div>
            <div class='part8Group'>
                <img alt='Line' class='part8Img' src='../../images/content/News4.svg' />
                <img alt='Line' class='part8Img' src='../../images/content/News2.svg' />
            </div>
            <router-link to='/register'>
                <el-button class='part8Botton lp_btn_register lp_btn' round>
                    <p class='part8Botton lp_btn_register lp_btn'>
                        Join Now for Freev
                    </p>
                </el-button>
            </router-link>
        </section>
    </div>
</template>

<script>
import { useRoute, useRouter } from 'vue-router'
export default {
    name: 'Download',
    components: {
    },
    setup () {
        const route = useRoute()
        const router = useRouter()
        const state = reactive({
            // 控制聊天框显示和隐藏
            controlLive: true,
        })
        const store = useStore()
        const { toOrderPriority } = useMethods()
        const { t } = useI18n({ useScope: 'global' })
        const logoUrl = computed(() => {
            // return store.state.businessConfig?.pcuiLogo || logoImg;
            return logoImg
        })
        const jumpUrl = (index) => {
            const lang = getCookie('lang') || 'zh-CN'
            let linkList = {}
            if (lang === 'zh-CN') {
                linkList = {
                    trading: 'https://www.vitatoken.com/zh-CN/order?symbolId=364&tradeType=5',
                    fund: 'https://www.vitatoken.com/zh-CN/fund',
                    program: 'https://www.vitatoken.com/zh-CN/new1',
                    vip: 'https://www.vitatoken.com/zh-CN/vip',
                    customer: 'https://cs.vitatoken.io:443/im/text/1cayxu.html?lang=en',
                    faqs: 'https://www.vitatoken.io/site/faqs',
                    terms: 'https://www.vitatoken.io/site/terms-conditions',
                    policy: 'https://www.vitatoken.io/site/privacy-policy',
                }
            } else {
                linkList = {
                    trading: 'https://www.vitatoken.com/en-US/order?symbolId=364&tradeType=5',
                    fund: 'https://www.vitatoken.com/en-US/fund',
                    program: 'https://www.vitatoken.com/en-US/new1',
                    vip: 'https://www.vitatoken.com/en-US/vip',
                    customer: 'https://cs.vitatoken.io:443/im/text/1cayxu.html?lang=en',
                    faqs: 'https://www.vitatoken.io/site/faqs',
                    terms: 'https://www.vitatoken.io/site/terms-conditions',
                    policy: 'https://www.vitatoken.io/site/privacy-policy'
                }
            }
            const community = {
                fb: 'https://www.facebook.com/Vitatoken-100578379186941',
                ig: 'https://www.instagram.com/vitatoken_official/',
                twitter: 'https://twitter.com/Vitatoken_',
                telegram: 'https://t.me/vitatoke',
                yt: 'https://www.youtube.com/channel/UCWrIoUETskxOU9zIVpba6Hg'
            }
            const newLinkList = { ...linkList, ...community }
            window.open(newLinkList[index])
        }

        const jumpdownload = (attr) => {
            switch (attr) {
                case 9 :
                    // window.open('https://t.me/headline_official')
                    window.open('https://t.me/Headline_OfficialBot')
                    break
                case 10 :
                    window.open('https://apps.apple.com/app/id1639509598')
                    break
                case 11 :
                    window.open('https://play.google.com/store/apps/details?id=com.mc900.mc900&pli=1')
                    break
            }
        }
        return {
        ...toRefs(state),
        jumpUrl,
        jumpdownload,
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';

/*------------------------------------*\
#Part1
\*------------------------------------*/
.promotion{
background: #23262F;
padding-top: 100px;
overflow: hidden;
font-family: "DM Sans", "Poppins", sans-serif;
}

.gradient{
position: relative;
left: 57%;
top: 55px;
}

.cryptoConcept{
width: 100%;
min-width: 500px;
}

.Part1h1{
font-size: 48px;
line-height: 56px;
text-align: left;
font-family: DM Sans;
font-weight: 700;
color: #FFD166;
white-space: nowrap;
}
.Part1h2{
font-size: 32px;
line-height: 40px;
font-weight: 700;
color: #FCFCFD;
font-family: DM Sans;
text-align: left;
white-space: nowrap;
}
.Part1Text1{
padding-top: 32px;
font-size: 16px;
line-height: 24px;
font-weight: 400;
font-family: Poppins;
text-align: left;
white-space: nowrap;
}

.HB{
color: #fff;
}

@media screen and (max-width: 1350px) {
.HB{
    padding-bottom: 40px;
}
}

#Part1{
text-align: -webkit-center;
}
.Bholder{
max-width: 70%;
}

.Part1Btn{
text-align: left;
padding-top: 40px;
.Btn1{
background:#3772FF;
border: unset;
color: #FCFCFD;
width: 125px;
height: 48px;
font-weight: 700;
font-size: 16px;
line-height: 16px;
}
.Btn2{
background: #17191F;
border: 2px solid #353945;
color: #FCFCFD;
width: 162px;
height: 48px;
font-weight: 700;
font-size: 16px;
line-height: 16px;
margin-left: 16px;
}
}

@media screen and (max-width: 1530px) {
.Part1h1{
white-space: unset;
}
.Part1h2{
white-space: unset;
}
.Part1Text1{
white-space: unset;
}
}

/*------------------------------------*\
#Part2
\*------------------------------------*/
.Part2Container{
max-width: 70%;
}

#core{
text-align: -webkit-center;
}
.box-cardText{
padding: 20px 0px;
}

@media screen and (max-width: 1400px) {
.Part2CardText{
    display: unset !important;
}
.Part2Group{
    display: none;
}
}

#Part2CardBody{
display: flex;
justify-content: space-around;
text-align: center;
}

.Part2CardText{
display: flex;
justify-content: space-around;
color: white;
}

.Part2Down{
height: 14px;
padding-right: 10px;
}

#Part2Card{
background: linear-gradient(216.81deg, rgba(27, 29, 35, 0.7) 0%, rgba(27, 29, 35, 0.5) 100%);
border: 1px solid rgba(255, 255, 255, 0.1);
box-shadow: 0px 24px 16px -16px rgba(0, 0, 0, 0.05);
backdrop-filter: blur(20px);
border-radius: 48px;
}

.Part2Group{
position: relative;
top: 60px;
}

.Part2Text{
text-align: left;
font-family: 'Poppins', sans-serif;
font-size: 14px;
line-height: 24px;
color: #fff;
}
.Part2H{
text-align: left;
font-family: 'Poppins', sans-serif;
font-weight: 700;
text-transform: uppercase;
font-size: 16px;
line-height: 16px;
color: #fff;
}

.ball {
position: relative;
bottom: 235px;
left: 650px;
width: 235px;
height: 235px;
border-radius: 100%;
filter: blur(177.464px);
background: #B5B4FF;
}
.wrap{
height: 10px;
}

.circle {
    border-radius: 50%;
    width: 36px;
    height: 36px;
    padding: 10px;
    background: #141416;
    color: #fff;
    text-align: center;
    font: 12px Arial, sans-serif;
  }

/*------------------------------------*\
#Part3
\*------------------------------------*/
#part3{
background: #23262F;
padding: 83px 0;
}

.part3Text{
color: #fff;
text-align: left;
h2{
font-family: Poppins;
font-weight: 700;
font-size: 16px;
line-height: 16px;
color: #E4D7CF;

}
.part3TextH1{
font-size: 48px;
color: #FCFCFD;
line-height: 56px;
font-family: DM Sans;
font-weight: 700;
padding: 14px 0 24px;
}

.part3Text1{
color: #E6E8EC;
font-weight: 400;
font-size: 16px;
line-height: 24px;
font-family: Poppins;
padding: 0 0 41px;
}
}
.rectangle {
font-family: 'Poppins';
width: 352px;
height: 132px;
background: #E4D7CF;
border-radius: 16px;
padding: 24px;
color: #23262F;
.rectangleH{
font-family: 'Poppins';
font-weight: 600;
font-size: 18px;
line-height: 24px;
color: #23262F;
}
.rectangleT{
font-family: 'Poppins';
color: #23262F;
font-size: 14px;
line-height: 24px;
margin-left: 51px;
font-weight: 400;
padding-top: 12px;
}
.tick{
width: auto;
height: 12px;
margin-top: 5px;
padding-right: 33px;
}
span{
display: flex;
}
}
.rectangle1{
display: flex;
font-family: 'Poppins';
width: 352px;
height: 72px;
background: #141416;
border-radius: 16px;
padding: 24px;
margin: 20px 0px;
color: #FCFCFD;
}

.part3container{
max-width: 70%;
}
#part3{
text-align: -webkit-center;
}

/*------------------------------------*\
#Part4
\*------------------------------------*/
#part4{
text-align: -webkit-center;
}

.part4container{
width: 70%;
color: #fff;
}
.part4Image{
width: 256px;
}

.part4HT{
align-self: center;
text-align: left;
max-width: 225px;
}
.part4Head{
font-size: 32px;
line-height: 40px;
font-family: DM Sans;
font-weight: 700;
color:#FCFCFD;
}
.part4Text{
color: #B1B5C3;
font-weight: 400;
font-size: 14px;
line-height: 24px;
font-family:  Poppins;
}

/*------------------------------------*\
#Part5
\*------------------------------------*/
#part5{
text-align: center;
padding-top: 113px;
h3{
color: #9757D7;
font-family: Poppins;
font-weight: 700;
font-size: 16px;
line-height: 16px;
}

.download{
text-align: -webkit-center;
}
.telegram{
            width: 180px;
            cursor: pointer;
        }
.ios{
  width: 180px;
  cursor: pointer;
}
.googlePlay{
  width: 180px;
  height: 54px;
  cursor: pointer;
}

h1{
font-family: DM Sans;
font-weight: 700;
font-size: 48px;
line-height: 56px;
color: #FCFCFD;
padding-top: 14px;
}

p{
color: #B1B5C3;
font-family: Poppins;
font-weight: 400;
font-size: 16px;
line-height: 24px;
padding: 24px 0 80px;
}
}

/*------------------------------------*\
#Part6
\*------------------------------------*/
.el-card{
--el-card-padding: unset;
}

.part6Img{
width: 100%;
min-width: 250px;
}
#part6{
text-align: -webkit-center;
padding-top: 50px;
.part6container{
width: 70%;
}

#part6Card1{
padding: 20px 10px;
img{
  width: 100%
}
}
#part6Card2{
padding: 20px 10px;
img{
  width: 100%
}
}
#part6Card3{
padding: 20px 10px;
img{
  width: 100%
}
}

.part6CardsText{
padding: 10px;
text-align: left;
.part6Cardsp1{
  color:#616161;
}
.part6Cardsh2{
  padding-top:35px;
}
.part6Cardsp2{
  color:#616161;
}
.part6Cardsh3{
  padding-top: 80px;
}
.part6Cardsp2{
  color:#616161;
}
}

#part6row1{
align-self: center;
text-align: left;
margin: 0 80px;
h3{
  color: #45B26B;
  font-size: 16px;
  line-height: 16px;
  font-weight: 700;
  font-family: Poppins;
}
h1{
  color: #FCFCFD;
  font-family: DM Sans;
  font-weight: 700;
  font-size: 48px;
  line-height: 56px
}
p{
  color: #B1B5C3;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  font-family: Poppins;
}
}
#part6row2{
position: relative;
width: 70%;
bottom: 80px;
}
}

@media screen and (max-width: 1000px) {
#part6Card1{
padding: 20px 10px;
}

#part6Card2{
padding: 20px 10px;
}

#part6Card3{
padding: 20px 10px;
}
#part6row2{
position: unset;
bottom: unset;
}
}
/*------------------------------------*\
#Part7
\*------------------------------------*/
#part7{
text-align: -webkit-center;
.part7Container{
width: 70%;
}

h3{
color: #45B26B;
font-family: 'Poppins';
font-weight: 700;
font-size: 16px;
line-height: 16px;
}

h1{
font-family: 'DM Sans';
font-weight: 700;
font-size: 48px;
line-height: 56px;
color: #FCFCFD;
padding: 14px 0 24px;
}

p{
color: #B1B5C4;
font-weight: 400;
font-size: 16px;
line-height: 24px;
font-family: 'Poppins';
padding-bottom: 64px;
}
.part7Video{
padding: 64px 0;
width: 100%;
max-width: 600px;
}

#part7Btn{
background: #3772FF;
width: 138px;
height: 48px;
border: none;
font-size: 16px;
line-height: 16px;
font-weight: 700;
color: #FCFCFD;
}
}
/*------------------------------------*\
#Part8
\*------------------------------------*/
#part8{
text-align: -webkit-center;
.part8Container{
width: 70%;
h3{
  color: #FCFCFD;
  font-weight: 700;
  font-size: 64px;
  line-height: 64px;
  font-family: DM Sans;
  padding-top: 113px;
}
h1{
  font-weight: 700;
  font-size: 64px;
  line-height: 64px;
  color: #FCFCFD;
  font-family: 'DM Sans';
  padding: 130px 0 41px;
}
p{
  font-weight: 400;
  font-family: 'Poppins';
  font-size: 16px;
  line-height: 24px;
  color: #E6E8EC;
}
}
.part8H1{
  font-size: 64px;
  line-height: 64px;
  font-weight: 700px;
  font-family: DM Sans;
  padding: 194px 0 113px;
  color: #FFFFFF;
}
.part8H2{
  font-size: 64px;
  line-height: 64px;
  font-weight: 700px;
  font-family: DM Sans;
  color: #FFFFFF;
  padding: 104px 0 58px;
}
.part8Group{
  .part8Img{
    padding:0px 30px 80px;
    max-width: 535px;
    width: 100%;
  }
}
}
.part8Line{
width: 100%;
max-width: 1200px;
}

.part8Botton{
width: 30%;
min-width: 280px;
background-image: linear-gradient(#ec0405, #960001);
margin-bottom: 40px;
font-size: 24px;
color: white;
border: none;
}

@media screen and (max-width: 1000px) {
#part8{
.part8Container{
h3{
  font-size: 40px;
}
h1{
  font-size: 40px;
}
}
}
}
</style>
