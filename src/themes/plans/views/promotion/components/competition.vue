<template>
    <div class='competition'>
        <el-row class='row' :gutter='30'>
            <el-col
                class='cardComp1'
                :lg='12'
                :md='12'
                :sm='24'
                :xl='12'
            >
                <el-row :gutter='20'>
                    <el-col class='winner' :offset='6' :span='18'>
                        <h1 class='competitionRow1'>
                            CPI Trading Competition
                        </h1>
                        <h1 class='competitionRow2'>
                            with <p style='font-weight: 800; font-size: 70px; display: contents;'>
                                $5000
                            </p>
                        </h1>
                        <h1 class='competitionRow3'>
                            winner prize
                        </h1>
                        <div class='compButton'>
                            <el-button class='readMore lp_btn' size='large' @click='jumpPage(1)'>
                                Read More
                            </el-button>
                        </div>
                    </el-col>
                </el-row>
            </el-col>
            <el-col
                class='cardComp2'
                :lg='12'
                :md='12'
                :sm='24'
                :xl='12'
            >
                <el-row :gutter='20'>
                    <el-col class='rules' :offset='2' :span='18'>
                        <h1 class='rulesTitle'>
                            Rules
                        </h1>
                        <el-row>
                            <el-col :span='17'>
                                <p class='info'>
                                    After the release of CPI, you can trade Headline-selected instruments during the following 7 days. The trader who earn the most profits will win the $5000 prize...
                                </p>
                            </el-col>
                        </el-row>
                        <h1 class='rulesTitle cpi'>
                            CPI
                        </h1>
                        <p class='info'>
                            Release Date: Apr 12, 2023
                        </p>
                        <p class='info'>
                            Competition Date: 12th to 26th April, 2023
                        </p>
                        <p class='info'>
                            Actual: 5.0%
                        </p>
                        <p class='info'>
                            Forecast: 5.2%
                        </p>
                        <p class='info'>
                            Previous: 6.0%
                        </p>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
    </div>
</template>

<script>
export default {
    name: 'Competition',
    components: {
    },
    setup (props) {
        const jumpPage = (attr) => {
            switch (attr) {
                case 1 :
                    window.open('https://www.headline.net/en-US/infoDetail?id=11086')
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
.competition{
  padding: 50px 0;
}
.cardComp1{
  background: #7D1718;
  color: #fff;
  .winner{
    padding: 80px 0;

    .competitionRow1{
      font-size: 50px;
    }
    .competitionRow2{
      font-size: 50px;
    }
    .competitionRow3{
      font-size: 50px;
    }
  }
}
.compButton{
  padding-top: 30px;
.readMore{
  border-radius: unset !important;
  color: #000;
  background-color: #fff;
}
.readMore:hover{
  color: #BB2323;
  border-radius: #BB2323 !important;
}
}
.cardComp2{
  padding: 80px 0;
  .rulesTitle{
    text-decoration: underline;
    font-size: 24px;
  }
  .cpi{
    text-align: center;
    padding-top: 50px;
  }
  .info{
    font-size: 18px;
    padding-top: 10px;
  }
}
@media screen and (max-width: 991px) {
  .el-col-offset-6{
    margin-left: 9% !important;
  }
}
</style>
