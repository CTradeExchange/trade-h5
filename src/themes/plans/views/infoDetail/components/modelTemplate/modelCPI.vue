<template>
    <div class="modelPage">
        <div class="title">{{ $t('model.CPI.title') }}</div>
        <div class="textBox">
            {{$t("model.CPI.tips1")}}<span>{{$t("model.CPI.tips2")}}</span> 
        </div>
        <img src="../../../../../../assets/modelImg/cpiImg2.png" >
        <img src="../../../../../../assets/modelImg/cpiImg1.png" >
        <div class="footer">
                <div class="footerTextBox">
                    <span v-html="$t('model.CPI.tips3')"></span>
                </div>
                <span class="icon"></span>
                <div class="footerTextBox">
                    <span v-html="$t('model.CPI.tips4')"></span>
                </div>
                <span class="icon"></span>
                <div class="footerTextBox">
                    <span v-html="$t('model.CPI.tips5')"></span>
                </div>
                <span class="icon"></span>
                <div class="footerTextBox">
                    <span v-html="$t('model.CPI.tips6')"></span>
                </div>
        </div>
    </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
.modelPage{
    display: flex;
    flex-direction: column;
    align-items: center;
    padding:0 rem(14px);
    text-align: center;
    font-family: Roboto;
    font-style: normal;
    line-height: normal;
    .title{
        margin-top: rem(120px);
        color: var(--primary);
        font-size: rem(48px);
        font-weight: 700;
    }
    .textBox{
        margin-top: rem(44px);
        margin-bottom: rem(16px);
        font-size: rem(32px);
        font-weight: 700;
        color: var(--mainColor);
        span{
            color: var(--primary);
        }
    }
    img{
        margin-top: rem(44px);
        width: rem(682px);
        object-fit: contain;
        border-radius: rem(24px);
        box-shadow: 0px 0px 0px  0px rgba(0, 0, 0, 0.15);
    }
    .footer{
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: rem(80px);
        margin-bottom: rem(290px);
        .footerTextBox{
            display: flex;
            flex-direction: column;
            text-align: center;
            font-family: Roboto;
            font-size: rem(40px);
            font-style: normal;
            font-weight: 700;
            line-height: rem(70px);
            span{
                color: var(--mainColor);
            }
        }
        .icon{
            margin: rem(30px) 0;
            width: rem(10px);
            height: rem(10px);
            border-radius: 50%;
            background: var(--mainColor);
        }
    }
}

</style>