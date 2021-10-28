<template>
    <div class='download-module'>
        <div class='download-case auto-width'>
            <h3 class='title'>
                交易随时随地
            </h3>
            <p class='describe'>
                多终端，多设备，随时随地开启交易
            </p>
            <div class='case'>
                <div class='case-left'>
                    <img src='@planspc/images/home/download-device.png' />
                </div>
                <div class='case-right'>
                    <div class='block-1'>
                        <img src='@planspc/images/home/download-code.png' />
                        <div class='text'>
                            <h4>iOS & Android 扫码下载APP</h4>
                            <p>开启移动交易</p>
                        </div>
                    </div>
                    <ul class='block-2'>
                        <li>
                            <i class='icon el-icon-mobile-phone'></i>
                            <span>App Store</span>
                        </li>
                        <li>
                            <i class='icon el-icon-mobile-phone'></i>
                            <span>Android</span>
                        </li>
                        <li>
                            <i class='icon el-icon-mobile-phone'></i>
                            <span>Google Play</span>
                        </li>
                        <li>
                            <i class='icon el-icon-mobile-phone'></i>
                            <span>Mac OS</span>
                        </li>
                        <li>
                            <i class='icon el-icon-mobile-phone'></i>
                            <span>Windows</span>
                        </li>
                        <li>
                            <i class='icon el-icon-mobile-phone'></i>
                            <span>API</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
.download-module {
    height: 782px;
    margin-top: 90px;
    background: url('~@planspc/images/home/download-bg.png');
    background-size: cover;
    .download-case {
        padding-top: 90px;
        color: #fff;
        .title {
            font-size: 32px;
            font-weight: bold;
        }
        .describe {
            margin-top: 10px;
            font-size: 16px;
            color: #B7C0E7;
        }
        .case {
            display: flex;
            margin-top: 58px;
            .case-left {
                margin-right: 112px;
                img {
                    width: 625px;
                    height: 469px;
                }
            }
            .case-right {
                width: 380px;
                padding-top: 49px;
                .block-1 {
                    display: flex;
                    align-items: center;
                    height: 112px;
                    background: rgba(71, 127, 211, 0.15);
                    border: 1px solid #485AAE;
                    border-radius: 10px;
                    img {
                        width: 88px;
                        height: 88px;
                        margin-left: 12px;
                    }
                    .text {
                        padding: 0 25px;
                        h4 {
                            font-size: 16px;
                            font-weight: normal;
                            color: #fff;
                        }
                        p {
                            margin-top: 5px;
                            font-size: 14px;
                            color: #B7C0E7;
                        }
                    }
                }
                .block-2 {
                    display: flex;
                    justify-content: center;
                    flex-wrap: wrap;
                    li {
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                        width: 80px;
                        margin-right: 60px;
                        margin-top: 54px;
                        &:nth-of-type(3n) {
                            margin-right: 0;
                        }
                        .icon {
                            font-size: 36px;
                        }
                        span {
                            margin-top: 18px;
                            font-size: 14px;
                            color: #fff;
                        }
                    }
                }
            }
        }
    }
}
</style>
