<template>
    <div class='banner'>
        <div class='center'>
            <h1 class='competition'>
                Trading Competition
            </h1>
            <h1 class='money'>
                $ 5,000
            </h1>
            <h1 class='sub-title'>
                Total Prize Pool
            </h1>
            <h1 class='sub-title'>
                The top winner win cash prize of a $5,000 pool in total
            </h1>
            <div class='bannerButton'>
                <el-button class='joinNow lp_btn_register lp_btn' plain size='large' @click='jumpPage(1)'>
                    <p class='joinNow lp_btn_register lp_btn'>
                        Join Now
                    </p>
                </el-button>
            </div>
            <p class='terms'>
                <a href='https://www.headline.net/html/headline_agreement.html?v=1' target='_blank'>
                    Terms & Conditions
                </a>Apply
            </p>
        </div>
    </div>
</template>

<script>
export default {
    name: 'TradingCompetition',
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
.banner{
  background-image: linear-gradient(rgba(255,255,255,0.4), rgba(255,255,255,0.4)), url("../../../images/cpi1/competition.jpg");
  width: 100%;
  text-align: center;
  background-position: center center;
  background-size: cover;
}

.center{
  padding: 150px 0;
  position:relative;
  color: #000000;;
}

.competition{
  font-size: 40px;
  font-weight: 800;
}

.money{
  font-size: 65px;
  opacity: 1 !important;
}

.terms{
  color: #000000;;
  padding-top: 20px;
  font-size: 15px;
}
.sub-title{
  font-size: 35px;
  font-weight: 400;
}

.joinNow{
  background-color: #BB2423;
  color: #fff;
  border-radius: unset !important;
  border: unset;
  width: 140px;
  font-size: 20px;
}
.joinNow:hover{
  background-color: #fff;
  color:#BB2423;
}

.bannerButton{
  padding-top: 20px;
}
</style>
