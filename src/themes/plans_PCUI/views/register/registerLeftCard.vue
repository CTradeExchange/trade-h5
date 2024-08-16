<template>
    <div class='leftBox '>
        <div class='rightIconBox'>
            <div class='bgWidth'></div>
            <div class='borderBg'></div>
        </div>
        <div class='leftIconBox'>
            <div class='bgWidth'></div>
            <div class='borderBg'></div>
        </div>
        <div class='leftTitle'>
            Headline.net
        </div>
        <div class='tipsBox' v-html="$t('login.loginTitle')"></div>
        <div class='cardPlatform'>
            <img src='../../../plans_PCUI/images/transmitsqaure2.svg' />
            <div class='title'>
                {{ $t('login.cdf') }}
            </div>
            <div class='text'>
                {{ $t('login.Commodities') }}
            </div>
            <div class='text'>
                {{ $t('login.Forex') }}
            </div>
            <!-- <div class="text">{{$t('login.Crypto')}}</div> -->
        </div>
        <div class='cardCrypto'>
            <img src='../../../plans_PCUI/images/outline-buy-crypto.svg' />
            <div class='title'>
                {{ $t('login.tradeCFD') }}
            </div>
            <div class='text'>
                {{ $t('login.KYCFree') }}
            </div>
        </div>
        <div class='loginImg'>
            <img src='../../../plans_PCUI/images/loginImage.jpg' />
        </div>
    </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>

.leftBox{
    padding-left: 60px;
    background-color:#F6F7F9;
    position: relative;
    overflow: hidden;
    font-family: Poppins;
    line-height: normal;
    font-style: normal;
    color: var(--mainColor);

    .rightIconBox{
        position: absolute;
        top: 50px;
        right: -7px;
        .bgWidth{
            width: 132px;
            height: 84px;
            background: #FAFAFA;
            position: absolute;
            top: 0;
            right: 0;
        }
        .borderBg{
            width: 209px;
            height: 84px;
            border: 1px solid #D4D8E0;
            border-radius: 8px;
            z-index: 1;
            position: absolute;
            top: 25px;
            right: 0;
        }

    }
    .leftIconBox{
        position: absolute;
        top: 787px;
        left: 0;
        .bgWidth{
            width: 249px;
            height: 84px;
            background: #FAFAFA;
            position: absolute;
            top: 42px;
            left: 0;
        }
        .borderBg{
            width: 192px;
            height: 84px;
            border: 1px solid #D4D8E0;
            border-radius: 8px;
            z-index: 1;
            position: absolute;
            top: 0;
            left: 0;
        }
    }
    .leftTitle{
        width: 100%;
        padding-top: 121px;
        text-align: center;
        font-size: 36px;
        font-weight: 700;
        text-align: left;
    }
    .tipsBox{
        max-width: 642px;
        margin-top: 16px;
        text-align: left;
        font-size: 20px;
        font-weight: 400;
        :deep(span){
            font-weight: 700 !important;
        }
    }
    .cardPlatform{
        margin-top: 177px;
        margin-left: 84px;
        display: flex;
        width: min-content;
        min-width: 180px;
        padding: 16px;
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
        border-radius: 8px;
        background: var(--contentColor);
        box-shadow: 0px 4px 4px 0px #ECEEF2;
        .title{
            font-family: Inter;
            font-size: 16px;
            font-weight: 700;
        }
        .text{
            font-family: Inter;
            font-size: 12px;
            font-weight: 400;
        }
    }
    .cardCrypto{
        margin-top: 28px;
        margin-left: 40px;
        display: flex;
        width: min-content;
        min-width: 300px;
        padding: 16px;
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
        border-radius: 8px;
        background: var(--contentColor);
        box-shadow: 0px 4px 4px 0px #ECEEF2;
        .title{
            font-family: Inter;
            font-size: 16px;
            font-weight: 700;
        }
        .text{
            font-family: Inter;
            font-size: 12px;
            font-weight: 400;
        }
    }
    .loginImg{
        position: absolute;
        top: 315px;
        left:327px;
        max-width: 314px;
        max-height: 360px;
        img{
            width: 100%;
            height: 100%;
            object-fit: contain;
        }
    }
}
</style>
