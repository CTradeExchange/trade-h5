<template>
    <div class="modelPage">
        <div class="title">{{ $t('model.NFP.title') }}</div>
        <div class="card" v-for="(item,index) in state.list" :key="index">
            <div class="_title">{{item.title}}</div>
            <ul class="ul">
                <li class="li" v-for="(v,i) in item.tipsList" :key="i">{{v}}</li>
            </ul>
            <div class="wideLine"></div>
            <div class="fineLine"></div>
            <div class="_titleTwo">{{item.titleTwo}}</div>
            <div class="tipsText">{{item.tipsText}}</div>
        </div>
    </div>
    <div class="footer">
            <div class="tips1">#Our Partners</div>
            <img src="../../../../../../assets/newUI/dft1.png" class="tips2">
            <img src="../../../../../../assets/newUI/dft2.png" class="tips3">
            <img src="../../../../../../assets/newUI/dft3.png" class="tips4">
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
    margin:rem(40px) rem(-20px) 0 rem(-20px);
    background: url('../../../../../../assets/modelImg/modelBg.png') no-repeat;
    background-size: rem(750px) rem(2290px);
    padding: rem(80px) rem(34px);
    font-family: Roboto;
    line-height: normal;
    font-style: normal;

    .title{
        margin-bottom:rem(80px);
        font-size: rem(48px);
        font-weight: 700;
        text-align: center;
        color: var(--contentColor);
    }
    .card{
        margin-bottom: rem(40px);
        border-radius: rem(40px);
        background: #FFF;
        box-shadow: 0 rem(8px) rem(16px) 0 rgba(0, 0, 0, 0.50);
        padding:rem(48px) rem(32px);
        &:last-child{
            margin-bottom: 0;
        }
        ._title{
            color: var(--primary);
            text-align: center;
            font-size:rem(38px);
            font-weight: 700;
        }
        .ul{
            display: flex;
            flex-direction: column;
            margin-top:rem(40px) ;
            .li{
                color: #0B2F5B;
                font-size: rem(32px);
                font-weight: 600;
                line-height: rem(44px); 
                list-style: disc;
                margin-left: rem(64px);
            }
        }
        .wideLine{
            margin-top: rem(56px);
            height: rem(8px);
            background: var(--mainColor);
        }
        .fineLine{
            margin-top: rem(8px);
            height: rem(2px);
            background: var(--mainColor);
        }
        ._titleTwo{
            margin-top: rem(56px);
            color: var(--primary);
            text-align: center;
            font-size:rem(38px);
            font-weight: 700;
        }
        .tipsText{
            margin-top: rem(40px);
            color: #0B2F5B;
            font-size:rem(32px);
            font-style: normal;
            font-weight: 600;
            line-height: rem(44px); 
        }

    }
}
.footer{
    margin: rem(-20px);
    display: flex;
    flex-direction: column;
    align-items: center;
    line-height: normal;
    font-style: normal;
    font-family: Roboto;
    background-color: var(--contentColor);
    .tips1{
        margin-top:rem(80px);
        color: var(--primary);
        font-size: rem(50px);
        font-weight: 700;
    }
    .tips2{
        margin-top:rem(44px);
        width: rem(360px);
    }
     .tips3{
        margin-top:rem(66px);
        width: rem(288px);
    }
     .tips4{
        margin-top:rem(54px);
        margin-bottom:rem(114px);
        width: rem(368px);
    }
}
</style>