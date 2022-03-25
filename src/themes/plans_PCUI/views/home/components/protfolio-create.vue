<template>
    <div class='portfolio auto-width'>
        <div class='case'>
            <p class='t1'>
                只需三步，开始加密货币投资
            </p>
            <!-- <p class='t2'>
                Start your first trade with these easy steps.
            </p> -->
            <ul class='pro-list'>
                <li class='pro-item'>
                    <img alt='' class='icon-img' src='/images/user.svg' srcset='' />
                    <div class='text'>
                        <p class='t3'>
                            开户并完成身份认证
                        </p>
                        <p class='t4'>
                            完成身份验证流程以保护您的帐户和交易
                        </p>
                    </div>
                </li>
                <li class='pro-item'>
                    <img alt='' class='icon-img' src='/images/kyc.svg' srcset='' />
                    <div class='text'>
                        <p class='t3'>
                            新增资金至你的帐户
                        </p>
                        <p class='t4'>
                            将资金添加到您的加密货币帐户以开始交易加密货币。
                        </p>
                    </div>
                </li>
                <li class='pro-item'>
                    <img alt='' class='icon-img' src='/images/spot.svg' srcset='' />
                    <div class='text'>
                        <p class='t3'>
                            开始交易
                        </p>
                        <p class='t4'>
                            买卖基金或加密货币，并了解Vitatoken提供的服务。
                        </p>
                    </div>
                </li>
            </ul>
            <router-link class='start-btn' to='/register'>
                开始使用
            </router-link>
        </div>
        <div class='case img-wrap'>
            <img alt='' class='pro-img' src='/images/portfolio-section.png' srcset='' />
        </div>
    </div>

    <!-- 只需三步，开始加密货币投资
    Start Trading in three steps

    开户并完成身份认证
    完成身份验证流程以保护您的帐户和交易
    Register & Complete Identity Verification
    Complete Identity Verification to Secure Your Account & Transactions

    新增资金至你的帐户
    将资金添加到您的加密货币帐户以开始交易加密货币。
    Deposit
    Deposit Funds to Start Cryptocurrency Trading

    开始交易
    买卖基金或加密货币，并了解Vitatoken提供的服务。
    Start Trading
    Buy and Sell Funds and Cryptocurrency, Find out More Vitatoken Service -->
</template>

<script setup>
</script>

<style lang='scss' scoped>
@import '@/sass/mixin.scss';
.portfolio {
    display: flex;
    margin-top: 80px;
    .case {
        flex: 1;
    }
    .t1 {
        line-height: 1;
        color: #1E2329;
        font-weight: 600;
        font-size: 40px;
    }
    .t2 {
        margin-top: 6px;
        color: #474D57;
        font-weight: 400;
        font-size: 20px;
    }
    .img-wrap {
        .pro-img {
            margin-left: 150px;
            width: 335px;
        }
    }
    .pro-list {
        margin-top: 80px;
        .pro-item {
            display: flex;
            margin-bottom: 64px;
            .icon-img {
                width: 80px;
                height: 80px;
            }
            .text {
                margin-left: 40px;
            }
            .t3 {
                margin-bottom: 12px;
                color: #1E2329;
                font-weight: 600;
                font-size: 24px;
                line-height: 28px;
            }
            .t4 {
                color: #474D57;
                font-weight: 400;
                font-size: 16px;
                line-height: 20px;
            }
        }
    }
    .start-btn {
        display: inline-block;
        width: 180px;
        color: #181A20;
        font-weight: bold;
        line-height: 40px;
        text-align: center;
        background-color: #FCD535;
        border-radius: 5px;
        cursor: pointer;
    }
}
</style>
