<template>
    <div class='layout1'>
        <h1 class='heading'>
            Success in Both Good and Bad CPI Reports
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
                                Evaluating Your Portfolio
                            </h1>
                            <p>It’s important to remember that the stock market is cyclical and will experience ups and downs over time. It's natural for investors to react to news of a rate hike by the Fed and for customers' sentiment toward banks to be impacted.</p>
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
                                Broad-Market Index Funds
                            </h1>
                            <p>The impact of banking system problem & higher interest rates is especially damaging for people in lower-income brackets, who are more likely to rely on credit cards or loans. Higher borrowing costs mean less money to spend on other necessities such as food and housing.</p>
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
                            <img alt='Silicon Valley Bank' class='layoutImg' src='../../../images/cpi1/Diversify.jpg' />
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
                                Diversify Your Portfolio
                            </h1>
                            <p>Recession could lead to a rise in unemployment as businesses lay off workers due to decreased demand In order to prevent this from happening.</p>
                        </el-col>
                    </el-row>
                    <div class='buttonContainer'>
                        <el-button class='readMore lp_btn' plain text @click='open2'>
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
                            <img alt='Silicon Valley Bank' class='layoutImg' src='../../../images/cpi1/metal.jpg' />
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
                                Invest in safe-haven assets
                            </h1>
                            <p>During times of financial instability, investors often flock to safe-haven assets such as gold, silver, and other precious metals, which can help protect against inflation and currency devaluation.</p>
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
                    h('span', null, 'We recommend evaluating your portfolio periodically and ensuring that it is diversified across different asset classes, such as stocks, bonds, and cash. This will help mitigate short-term volatility while still providing potential upside in the face of a rate hike. Additionally, staying informed on macroeconomic trends and market developments can help you identify potential risks or opportunities that may affect your portfolio.'),
                ]),
                confirmButtonClass: 'btnConfirm',
            })
        }
        const open1 = () => {
            ElMessageBox({
                title: 'Message',
                message: h('p', null, [
                    h('p', null, 'This is the most effective way to build wealth over time and will help you stay focused on your long-term goals. It is also important to remember that any investment involves risk, and it is important to consider your own risk tolerance and develop a plan that is tailored to your individual financial situation.'),
                    h('br', null,),
                    h('p', null, 'Once you have determined the best time to access the funds in each retirement account or plan, make sure to keep track of all withdrawals, contributions, and other transactions throughout the year. This will help you stay organized and ensure that everything is in order when it comes time to file your taxes.'),
                ]),
                confirmButtonClass: 'btnConfirm',
            })
        }
        const open2 = () => {
            ElMessageBox({
                title: 'Message',
                message: h('p', null, [
                    h('span', null, 'By diversifying your portfolio, you can reduce the overall risk of your investments and increase the chances of earning a more consistent return over the long term. It is important to note that diversification does not guarantee a profit or protect against loss, but it can help to minimize the impact of market volatility and unforeseen events on your investment portfolio.'),
                ]),
                confirmButtonClass: 'btnConfirm',
            })
        }
        const open3 = () => {
            ElMessageBox({
                title: 'Message',
                message: h('p', null, [
                    h('p', null, 'One of the most common safe-haven assets is gold, which has been valued as a store of wealth for thousands of years. Gold is viewed as a hedge against inflation and currency devaluation, as it tends to hold its value even when fiat currencies lose purchasing power. This is because gold is a physical asset that is not tied to any particular currency or country, and its value is determined by global supply and demand dynamics.'),
                    h('br', null,),
                    h('p', null, 'Other precious metals such as silver, platinum, and palladium are also often considered safe-haven assets, as they share many of the same properties as gold. These metals have industrial uses in addition to their value as a store of wealth, which can make them more volatile than gold but may also provide diversification benefits to a portfolio.'),
                    h('br', null,),
                    h('p', null, 'While safe-haven assets can provide a measure of protection during times of financial instability, it is important to note that they are not immune to market fluctuations and can experience significant volatility in certain circumstances. It is also important to consider the costs associated with investing in these assets, such as storage and transaction fees, as well as the potential tax implications of holding physical assets.'),
                ]),
                confirmButtonClass: 'btnConfirm',
            })
        }
        return {
            open,
            open1,
            open2,
            open3,
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
  background-color: #BB2423!important;
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
