<template>
    <div class='inFundManager'>
        <div class='banner'></div>
        <ul class='features'>
            <li class='item'>
                <p class='content'>
                    Metaverse Era Capital background has been audited
                </p>
                <span class='icon icon_dunpai'></span>
            </li>
            <li class='item'>
                <p class='content'>
                    Verified the V10 operational policies
                </p>
                <span class='icon icon_dunpai'></span>
            </li>
            <li class='item'>
                <p class='content'>
                    Verified the net value of V10
                </p>
                <span class='icon icon_dunpai'></span>
            </li>
            <li class='item'>
                <p class='content'>
                    Real-time publication of fund transaction records
                </p>
                <span class='icon icon_dunpai'></span>
            </li>
            <li class='item'>
                <p class='content'>
                    Real-time disclosure of V10 Fund asset holding addresses
                </p>
                <span class='icon icon_dunpai'></span>
            </li>
        </ul>
        <p class='say'>
            Are you interested in becoming a fund manager?
        </p>
        <p class='mark'>
            Immediately receive three benefits
        </p>
        <button class='btnBottom' @click="$router.push('/fundV10/join')">
            Get Started
        </button>
    </div>
</template>

<script>
import { reactive, ref, toRefs, computed, onMounted } from 'vue'

export default {
    name: 'V10InFundManager',
    setup () {
        const state = reactive({
        })

        return {
            ...toRefs(state),
        }
    }
}
</script>

<style lang="scss" scoped>
.inFundManager {
    min-height: calc(100vh - 444px);
    padding: 0 0 100px;
    margin: 0 auto;
    font-size: 14px;
    background: var(--bgColor);
    // 适配移动端
    @media screen and (max-width: 768px){
        padding: 0 0 100px;
    }

    .banner{
        width: 100%;
        height: 400px;
        background: url('/images/V10/pc/METAVERSE.jpg') no-repeat center;
        // 适配移动端
        @media screen and (max-width: 768px){
            height: 64vw;
            background-image: url('/images/V10/h5/METAVERSE.jpg');
            background-size: cover;
        }
    }
    .features {
        max-width: 590px;
        font-size: 20px;
        margin: 0 auto;
        padding-top: 64px;
        line-height: 48px;
        &::after{
            content: "";
            display: block;
            width: 500px;
            margin: 35px auto 0;
            @include bd();
        }
        .item{
            position: relative;
            padding-right: 50px;
        }
        .icon{
            position: absolute;
            color: var(--primary);
            right: 0;
            top: 2px;
        }

        // 适配移动端
        @media screen and (max-width: 768px) {
            font-size: 14px;
            line-height: 20px;
            padding: 0 20px;
            &::after{
                margin-top: 5px;
                width: 100%;
            }
            .item{
                padding: 12px 25px 12px 0;
            }
            .icon{
                font-size: 20px;
                top: 17px;
            }
        }
    }
    .say{
        margin-top: 68px;
        font-size: 30px;
        line-height: 36px;
        text-align: center;
        font-weight: bold;
        // 适配移动端
        @media screen and (max-width: 768px){
            padding: 0 20px;
            margin-top: 40px;
            font-size: 24px;
            line-height: 32px;
        }
    }
    .mark{
        margin-top: 27px;
        font-size: 20px;
        line-height: 24px;
        text-align: center;
        letter-spacing: 1px;
        font-weight: bold;
        color: var(--primary);
        // 适配移动端
        @media screen and (max-width: 768px){
            padding: 0 20px;
            margin-top: 16px;
            font-size: 16px;
            line-height: 24px;
        }
    }
    .btnBottom{
        display: block;
        margin: 24px auto 0;
        width: 304px;
        height: 50px;
        line-height: 1;
        text-align: center;
        font-size: 16px;
        color: #fff;
        border-radius: 6px;
        background: var(--primary);
        cursor: pointer;
        @include hover();
        // 适配移动端
        @media screen and (max-width: 768px){
            padding: 0 20px;
            margin-top: 20px;
            width: 295px;
        }
    }

}
</style>
