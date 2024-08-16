<template>
    <div class='layout1'>
        <h1 class='heading'>
            A Great Chance to Win More!
        </h1>
        <el-row class='row' :gutter='30'>
            <el-col
                :lg='10'
                :md='12'
                :sm='24'
                :xl='8'
                :xs='24'
            >
                <div class='col'>
                    <el-row :gutter='10'>
                        <el-col
                            :lg='10'
                            :md='12'
                            :sm='12'
                            :xl='10'
                            :xs='12'
                        >
                            <img alt='Silicon Valley Bank' class='layoutImg' src='../../../images/cpi1/Portfolio.jpg' />
                        </el-col>
                        <el-col
                            class='reportTexting'
                            :lg='14'
                            :md='12'
                            :sm='12'
                            :xl='14'
                            :xs='12'
                        >
                            <h1 class='reportTitle'>
                                The Release of CPI
                            </h1>
                            <p>CPI is an important economic indicator that will significantly affect the forex and gold markets. A higher CPI indicates a greater inflation, which may lead to the devaluation of a country's currency and an increase of gold price. Usually, your trading is more possibly to succeed based on this fundamental phenomenon.</p>
                        </el-col>
                    </el-row>
                    <div class='buttonContainer'>
                        <el-button class='readMore lp_btn' plain text @click='open'>
                            <p class='readMore lp_btn'>
                                Read More
                            </p>
                        </el-button>
                    </div>
                </div>
            </el-col>
            <el-col
                :lg='10'
                :md='12'
                :sm='24'
                :xl='8'
                :xs='24'
            >
                <div class='col col2'>
                    <el-row :gutter='10'>
                        <el-col
                            :lg='10'
                            :md='12'
                            :sm='12'
                            :xl='10'
                            :xs='12'
                        >
                            <img alt='Silicon Valley Bank' class='layoutImg' src='../../../images/cpi1/Index.jpg' />
                        </el-col>
                        <el-col
                            class='reportTexting'
                            :lg='14'
                            :md='12'
                            :sm='12'
                            :xl='14'
                            :xs='12'
                        >
                            <h1 class='reportTitle'>
                                Headline Chosen Products
                            </h1>
                            <p>As an event-driven trading platform, Headline will follow the latest events in the world, and select those have the greatest impact on the global market. Furthermore, Headline will choose financial instruments whose price is closely related to the event for traders to make an easy choice thus an easy success. </p>
                        </el-col>
                    </el-row>
                    <div class='buttonContainer'>
                        <el-button class='readMore lp_btn' plain text @click='open1'>
                            <p class='readMore lp_btn'>
                                Read More
                            </p>
                        </el-button>
                    </div>
                </div>
            </el-col>
        </el-row>
        <el-row class='row' :gutter='30'>
            <el-col
                :lg='10'
                :md='12'
                :sm='24'
                :xl='8'
                :xs='24'
            >
                <div class='col'>
                    <el-row :gutter='10'>
                        <el-col
                            :lg='10'
                            :md='12'
                            :sm='12'
                            :xl='10'
                            :xs='12'
                        >
                            <img alt='Silicon Valley Bank' class='layoutImg' src='../../../images/cpi1/prize.jpg' />
                        </el-col>
                        <el-col
                            class='reportTexting'
                            :lg='14'
                            :md='12'
                            :sm='12'
                            :xl='14'
                            :xs='12'
                        >
                            <h1 class='reportTitle'>
                                $5000 Winner Prize
                            </h1>
                            <p>The $5000 winning prize for the CPI release trading competition will not only be provided this time, but also in future trading competitions related to other major events. With more participants joining, Headline may introduce an unlimited prize pool in the future.</p>
                        </el-col>
                    </el-row>
                    <div class='buttonContainer'>
                        <el-button class='readMore lp_btn' plain text @click='jumpPage(1)'>
                            <p class='readMore lp_btn'>
                                Read More
                            </p>
                        </el-button>
                    </div>
                </div>
            </el-col>
            <el-col
                :lg='10'
                :md='12'
                :sm='24'
                :xl='8'
                :xs='24'
            >
                <div class='col col2'>
                    <el-row :gutter='10'>
                        <el-col
                            :lg='10'
                            :md='12'
                            :sm='12'
                            :xl='10'
                            :xs='12'
                        >
                            <img alt='Silicon Valley Bank' class='layoutImg' src='../../../images/cpi1/Trading.jpg' />
                        </el-col>
                        <el-col
                            class='reportTexting'
                            :lg='14'
                            :md='12'
                            :sm='12'
                            :xl='14'
                            :xs='12'
                        >
                            <h1 class='reportTitle'>
                                Learn More in Trading
                            </h1>
                            <p>Headline hopes that participants in the transaction can learn the investment concept of "big event investment", seize important and large opportunities, and focus their limited time and energy on timing that is relatively easy to grasp and more likely to succeed.</p>
                        </el-col>
                    </el-row>
                    <div class='buttonContainer'>
                        <el-button class='readMore lp_btn' plain text @click='open3'>
                            <p class='readMore lp_btn'>
                                Read More
                            </p>
                        </el-button>
                    </div>
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
    setup () {
        const open = () => {
            ElMessageBox({
                title: 'Message',
                message: h('p', null, [
                    h('span', null, 'Central banks use inflation to determine their monetary policies and may raise interest rates to control inflationary pressures. Therefore, traders closely monitor CPI as it can provide signals about future monetary policy decisions and ultimately affect investments. When CPI data is released, it can cause fluctuations in the forex and gold markets, requiring a deeper understanding to make informed investment decisions. Headline.net will provide comprehensive information on the importance of CPI data, how to analyze it, its impact on markets, and how to use it for trading strategies.'),
                ]),
                confirmButtonClass: 'btnConfirm',
            })
        }
        const open1 = () => {
            ElMessageBox({
                title: 'Message',
                message: h('p', null, [
                    h('p', null, 'Headline offers traders a three-step process to win big in global markets. '),
                    h('br', null,),
                    h('p', null, '1.	Headline provides faster information on key financial events, making it easier for traders to find the events that interest them.'),
                    h('br', null,),
                    h('p', null, '2.	Headline lists the assets related to these events, simplifying the filter and analysis process for traders.'),
                    h('br', null,),
                    h('p', null, '3.	Traders can take a position for trading by entering the market at a price they believe represents the likelihood the event will happen.'),
                    h('br', null,),
                    h('p', null, 'With Headline, traders can simplify their trading process and increase their chances of success in global markets.'),
                ]),
                confirmButtonClass: 'btnConfirm',
            })
        }
        const open3 = () => {
            ElMessageBox({
                title: 'Message',
                message: h('p', null, [
                    h('p', null, "In addition to providing timely information on key financial events, Headline also offers tools and resources to help traders make informed investment decisions. With access to up-to-date market data and customizable watchlists, traders can analyze market trends and identify potential trading opportunities more effectively. By combining Headline's information and tools with a solid understanding of market fundamentals, traders can increase their chances of success and achieve their investment goals. With Headline, traders can stay ahead of the curve and capitalize on big events in the global markets."),
                ]),
                confirmButtonClass: 'btnConfirm',
            })
        }
        const jumpPage = (attr) => {
            switch (attr) {
                case 1 :
                    window.open('https://www.headline.net/en-US/infoDetail?id=11086')
                    break
            }
        }
        return {
            open,
            open1,
            open3,
            jumpPage,
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.layout1{
  text-align: center;
  padding-top: 30px;
}
.heading{
  font-size: 36px;
}
.row{
  justify-content: center;
  padding-top: 30px;
}

.col{
  background: #E8E6E6;
  text-align: center;
  min-height: 353px !important;
}
.layoutImg{
  width: 100%;
}

.buttonContainer{
  padding: 30px 0;
}
.readMore{
  background-color: #BB2423 !important;
  color: #fff;
  border-radius: unset !important;
}
.readMore:hover{
  background-color: #fff !important;
  border: 1px solid #BB2423;
  color:#BB2423
}
.reportTexting{
  align-self: center;
}
.reportTitle{
  font-size: 24px;
}

@media screen and (max-width: 991px) {
  .row{
    padding-top: unset;
  }
  .col{
    margin-top: 50px;
  }
}
</style>
