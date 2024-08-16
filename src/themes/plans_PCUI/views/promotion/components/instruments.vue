<template>
    <div class='instruments'>
        <el-row class='row' :gutter='30' style='justify-content: center;'>
            <el-col
                class='cardComp1'
                :lg='10'
                :md='10'
                :sm='24'
                :xl='10'
            >
                <h1 class='insTitle'>
                    Related Trading
                </h1>
                <h1 class='insTitle'>
                    Instruments
                </h1>
                <div class='container'>
                    <li class='trading'>
                        Gold
                    </li>
                    <li class='trading'>
                        USD/EUR
                    </li>
                </div>
            </el-col>
            <el-col
                class='cardComp1 cpi'
                :lg='10'
                :md='10'
                :sm='24'
                :xl='10'
            >
                <h1 class='insTitle'>
                    CPI
                </h1>
                <p class='cpiInfo'>
                    Actual: 5.0%
                </p>
                <p class='cpiInfo'>
                    Forecast: 5.2%
                </p>
                <p class='cpiInfo'>
                    Previous: 6.0%
                </p>
                <p class='cpiInfo'>
                    Historical Data: Apr 12, 2023
                </p>
            </el-col>
        </el-row>
    </div>
</template>

<script>
</script>

<style lang="scss" scoped>

.instruments{
  background-image: url("../../../images/cpi1/fullBanner.jpg");
  width: 100%;
  background-repeat:no-repeat;
  background-position: center center;
  margin: 50px 0 50px;
  background-size: cover;
  color: #fff;
}
.row{
  padding: 100px 0;
}
.cardComp1{
  padding-left: 250px !important;
  .insTitle{
    font-size: 38px;
    font-weight: 400;
    line-height: 50px;
  }
  .container{
    padding-top: 30px;
  }
  .trading{
    font-size: 27px;
  }
  .cpiInfo{
    font-size: 18px;
    padding-top: 20px;
  }
}

@media screen and (max-width: 991px) {
  .cardComp1{
    padding-left: 50px !important;
  }
  .cpi{
    padding-top: 70px !important;
  }
}
</style>
