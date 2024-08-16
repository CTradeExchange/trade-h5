<template>
    <div class="modelPage">
            <div class="title">{{ $t('model.CPI.title') }}</div>
            <div class="tipsBox">
                {{$t("model.CPI.tips1")}}<span>{{$t("model.CPI.tips2")}}</span> 
            </div>
           <div class="imgBox">
                <img src="../../../../../../assets/modelImg/cpiImg2.png" >
                <img src="../../../../../../assets/modelImg/cpiImg1.png" >
           </div>
          <div class="footer">
                <div class="textBox">
                    <span v-html="$t('model.CPI.tips3')"></span>
                </div>
                <span class="icon"></span>
                <div class="textBox">
                    <span v-html="$t('model.CPI.tips4')"></span>
                </div>
                <span class="icon"></span>
                <div class="textBox">
                    <span v-html="$t('model.CPI.tips5')"></span>
                </div>
                <span class="icon"></span>
                <div class="textBox">
                    <span v-html="$t('model.CPI.tips6')"></span>
                </div>
          </div>
    </div>
</template>

<script setup>
import { reactive } from "vue";
const state=reactive({
    list:[
        {
            title:'Higher Payroll Value',
            tipsList:['More Job Additions','Robust Economic Growth','​Increased Spending Power'],
            titleTwo:'Market Trend',
            tipsText:'A release above figures would help to fuel U.S. dollar gains'
        },
        {
            title:'Forecasted Payroll Value',
            tipsList:['Mixed Reaction in the Forex Market','Will Shift to Other Indicators'],
            titleTwo:'Market Trend',
            tipsText:'Drop U.S. dollar for other currencies.'
        },
        {
            title:'Lower Payroll Value',
            tipsList:["Lower Employment is A Negative Sign for the World's Largest Economy & for the Dollar"],
            titleTwo:'Market Trend',
            tipsText:'Opt for higher yielding currencies against the U.S. dollar'
        },
        
    ]
})
</script>

<style lang="scss" scoped>
.modelPage{
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    padding: 89px;
    font-family: Roboto;
    line-height: normal;
    font-style: normal;
   
    .title{
        margin-top: -19px;
        font-size: 45px;
        font-weight: 700;
        color: var(--primary);
    }
    .tipsBox{
        margin-top: 60px;
        width: 933px;
        font-size: 25px;
        font-weight: 700;
        span{
            color: var(--primary);
        }
    }
    .imgBox{
        margin-top: 60px;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-around;
        img{
            width: 539px;
            height: 265px;
            border-radius: 12px;
            box-shadow: 0px 0px 0px 0px rgba(0, 0, 0, 0.15);
            }
    }
   
    .footer{
        margin-top:78px ;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-around;
        .textBox{
           display: flex;
           flex-direction: column;
           align-items: center;
           color: var(--mainColor);
            text-align: center;
            font-family: Roboto;
            font-size: 25px;
            font-style: normal;
            font-weight: 700;
            line-height: 40px;

        }
        .icon{
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background-color: var(--mainColor);
        }
       
    }
}
</style>