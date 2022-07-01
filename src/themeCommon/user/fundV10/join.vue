<template>
    <router-view />
    <div class='joinWrapper' :class='{ isPC:isPC }'>
        <div class='banner'></div>
        <ul class='features'>
            <li class='item'>
                <img class='img' :src="bodyWidth > 768 ? '/images/V10/pc/acquisition.png' : '/images/V10/h5/acquisition.png'" />
                <div class='rightColumn'>
                    <p class='title'>
                        Customer Acquisition
                    </p>
                    <p class='desc'>
                        Through the Vitatoken platform, you can showcase your funds to customers around the world, enabling your fund to generate a great deal of customer traffic and to increase its performance.
                    </p>
                </div>
            </li>
            <li class='item'>
                <img class='img' :src="bodyWidth > 768 ? '/images/V10/pc/enhancement.png' : '/images/V10/h5/enhancement.png'" />
                <div class='rightColumn'>
                    <p class='title'>
                        Credit Enhancement
                    </p>
                    <p class='desc'>
                        CAGAYAN ECONOMIC ZONE AUTHORITY (CEZA) has licensed Vitatoken to operate as a platform for cryptocurrency fund exchange. VITATOKEN is a reliable platform to trade cryptocurrency funds and it provide trust to the registered
                        funds.
                    </p>
                </div>
            </li>
            <li class='item'>
                <img class='img' :src="bodyWidth > 768 ? '/images/V10/pc/convenience.png' : '/images/V10/h5/convenience.png'" />
                <div class='rightColumn'>
                    <p class='title'>
                        Convenience
                    </p>
                    <p class='desc'>
                        We provide convenient tools for registered funds, supporting not only fund transaction functions such as fund buy in, sell out and fixed investment, but also a full range of financial services.
                    </p>
                </div>
            </li>
        </ul>
        <div class='contact'>
            <span class='text'>
                Contact us for register funds
            </span>
            <a class='link' href='https://wa.me/message/UM2XQ3FMLRFOK1' target='_blank'>
                <img class='img' src='/images/V10/pc/whatapp.png' />
            </a>
            <a class='link' href='https://t.me/Vitatokenio' target='_blank'>
                <img class='img' src='/images/V10/pc/twitter.png' />
            </a>
        </div>
    </div>
</template>

<script>
import { useViewport } from '@/utils/hooks/useViewport'
export default {
    setup () {
        const { bodyWidth } = useViewport()
        return {
            isPC: process.env.VUE_APP_theme === 'plans_PCUI',
            bodyWidth
        }
    }
}
</script>

<style lang="scss" scoped>
.joinWrapper {
    padding-bottom: 150px;
    &.isPC {
        min-height: calc(100vh - 444px);
    }
}
.banner {
    width: 100%;
    height: 400px;
    background: url('/images/V10/pc/Why-VITATOKEN.jpg') no-repeat center;
    // 适配移动端
    @media screen and (max-width: 768px) {
        height: 64vw;
        background-image: url('/images/V10/h5/Why-VITATOKEN.jpg');
        background-size: cover;
    }
}
.features {
    max-width: 1200px;
    margin: 60px auto 0;
    .item {
        display: flex;
        margin-bottom: 20px;
        padding: 20px;
        background: var(--contentColor);
        border-radius: 20px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
        .img {
            width: 316px;
        }
        .rightColumn {
            flex: 1;
            padding: 0 60px;
        }
        .title {
            padding-top: 34px;
            color: var(--color);
            font-weight: 700;
            font-size: 20px;
        }
        .desc {
            padding-top: 15px;
            color: var(--minorColor);
            font-size: 16px;
            line-height: 24px;
        }
        // 适配移动端
        @media screen and (max-width: 768px) {
            display: block;
            margin-bottom: 40px;
            padding-bottom: 38px;
            .img {
                width: 100%;
            }
            .rightColumn {
                padding: 0;
            }
            .title {
                padding-top: 4px;
            }
            .desc {
                padding-top: 13px;
                font-size: 14px;
                line-height: 20px;
            }
        }
    }
    // 适配移动端
    @media screen and (max-width: 768px) {
        margin: 40px 20px;
    }
}
.contact {
    padding-top: 37px;
    text-align: center;
    .text {
        font-weight: 700;
        font-size: 20px;
    }
    .text,
    .link {
        margin: 0 10px;
        vertical-align: middle;
    }
    @media screen and (max-width: 768px) {
        padding-top: 0;
        .text {
            display: block;
            margin-bottom: 30px;
        }
    }
}
</style>
