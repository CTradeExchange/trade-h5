<template>
    <div class="modelPage">
            <div class="title">{{ $t('model.NFP.title') }}</div>
            <div class="row">
                <div class="card" v-for="(item,index) in state.list" :key="index">
                    <div class="title">{{item.title}}</div>
                    <ul class="ul">
                        <li class="li" v-for="(v,i) in item.tipsList" :key="i">{{v}}</li>
                    </ul>
                    <div class="wideLine"></div>
                    <div class="fineLine"></div>
                    <div class="titleTwo">{{item.titleTwo}}</div>
                    <div class="tipsText">{{item.tipsText}}</div>
                </div>
            </div>
          <div class="footer">
                <div class="tips1">#Our Partners</div>
                <img src="../../../../../../assets/newUI/dft1.png" class="tips2">
                <img src="../../../../../../assets/newUI/dft2.png" class="tips3">
                <img src="../../../../../../assets/newUI/dft3.png" class="tips4">
          </div>
    </div>
</template>

<script setup>
import { reactive } from "vue";
import { useI18n } from 'vue-i18n'
const { t } = useI18n({ useScope: 'global' })
const state=reactive({
    list:[
        {
            title:t('model.NFP.cardTitle'),
            tipsList:[t('model.NFP.tips1'),t('model.NFP.tips2'),t('model.NFP.tips3')],
            titleTwo:t('model.NFP.titleTwo'),
            tipsText:t('model.NFP.tips4')
        },
        {
            title:t('model.NFP.cardTitle2'),
            tipsList:[t('model.NFP.tips5')],
            titleTwo:t('model.NFP.titleTwo'),
            tipsText:t('model.NFP.tips6')
        },
        {
            title:t('model.NFP.cardTitle3'),
            tipsList:[t('model.NFP.tips7')],
            titleTwo:t('model.NFP.titleTwo'),
            tipsText:t('model.NFP.tips8')
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
    background: url('../../../../../../assets/modelImg/modelBg-pc.png') no-repeat;
    background-size: 100% 913px;
    padding: 89px;
    font-family: Roboto;
    line-height: normal;
    font-style: normal;
   
    .title{
        font-size: 45px;
        font-weight: 700;
        color: var(--contentColor);
    }
    .row{
        margin-top: 60px;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-around;
        .card{
            width: 360px;
            height: 376px;
            padding: 24px 22px ;
            background: var(--contentColor);
            border-radius: 20px;
            box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.50);
            .title{
                font-size: 25px;
                font-weight: 700;
                color: var(--primary);
                text-align: center;
            }
            .ul{
            display: flex;
            flex-direction: column;
            margin-top:20px;
                .li{
                    margin-left: 20px;
                    color: #0B2F5B;
                    font-size: 19px;
                    font-weight: 600;
                    list-style: disc;
                }
            }
            .wideLine{
                margin-top: 54px;
                height:4px;
                background: var(--mainColor);
            }
            .fineLine{
                margin-top: 4px;
                height:1px;
                background: var(--mainColor);
            }
            .titleTwo{
                margin-top: 24px;
                font-size: 25px;
                font-weight: 700;
                color: var(--primary);
                text-align: center;
            }
            .tipsText{
                margin-top: 20px;
                font-size: 19px;
                font-weight: 600;
                color: #0B2F5B;
            }
        }
    }
    .footer{
        width: 100%;
        height: 164px;
        border-radius: 20px;
        margin-top: 40px;
        box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.50);
        background: var(--contentColor);
        display: flex;
        align-items: center;
        justify-content: space-around;
        .tips1{
            font-size: 25px;
            font-weight: 700;
            color: var(--primary);
        }
        .tips2{
            width: 210px;
        }
        .tips3{
            width: 184px;
        }
        .tips4{
            width: 184px;
        }
    }
}
</style>