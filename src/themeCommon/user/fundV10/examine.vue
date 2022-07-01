<template>
    <router-view />
    <div class='inFundManager' :class='{ isPC: isPC }'>
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
import { onMounted } from 'vue'

export default {
    name: 'V10InFundManager',
    setup () {
        onMounted(() => {
            document.documentElement.scrollTop = 0
        })

        return {
            isPC: process.env.VUE_APP_theme === 'plans_PCUI',
        }
    }
}
</script>

<style lang="scss" scoped>
.inFundManager {
    margin: 0 auto;
    padding: 0 0 100px;
    font-size: 14px;
    background: var(--bgColor);
    &.isPC {
        min-height: calc(100vh - 444px);
    }
    .banner {
        width: 100%;
        height: 400px;
        background: url('/images/V10/pc/METAVERSE.jpg') no-repeat center;
        // 适配移动端
        @media screen and (max-width: 768px) {
            height: 64vw;
            background-image: url('/images/V10/h5/METAVERSE.jpg');
            background-size: cover;
        }
    }
    .features {
        max-width: 590px;
        margin: 0 auto;
        padding-top: 64px;
        font-size: 20px;
        line-height: 48px;
        &::after {
            @include bd();
            display: block;
            width: 500px;
            margin: 35px auto 0;
            content: '';
        }
        .item {
            position: relative;
            padding-right: 50px;
        }
        .icon {
            position: absolute;
            top: 2px;
            right: 0;
            color: var(--primary);
        }

        // 适配移动端
        @media screen and (max-width: 768px) {
            padding: 0 20px;
            font-size: 14px;
            line-height: 20px;
            &::after {
                width: 100%;
                margin-top: 5px;
            }
            .item {
                padding: 12px 25px 12px 0;
            }
            .icon {
                top: 17px;
                font-size: 20px;
            }
        }
    }
    .say {
        margin-top: 68px;
        font-weight: bold;
        font-size: 30px;
        line-height: 36px;
        text-align: center;
        // 适配移动端
        @media screen and (max-width: 768px) {
            margin-top: 40px;
            padding: 0 20px;
            font-size: 24px;
            line-height: 32px;
        }
    }
    .mark {
        margin-top: 27px;
        color: var(--primary);
        font-weight: bold;
        font-size: 20px;
        line-height: 24px;
        letter-spacing: 1px;
        text-align: center;
        // 适配移动端
        @media screen and (max-width: 768px) {
            margin-top: 16px;
            padding: 0 20px;
            font-size: 16px;
            line-height: 24px;
        }
    }
    .btnBottom {
        @include hover();
        display: block;
        width: 304px;
        height: 50px;
        margin: 24px auto 0;
        color: #FFF;
        font-size: 16px;
        line-height: 1;
        text-align: center;
        background: var(--primary);
        border-radius: 6px;
        cursor: pointer;
        // 适配移动端
        @media screen and (max-width: 768px) {
            width: 295px;
            margin-top: 20px;
            padding: 0 20px;
        }
    }
    // 适配移动端
    @media screen and (max-width: 768px) {
        padding: 0 0 100px;
    }
}
</style>
