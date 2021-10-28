<template>
    <div class='why-module auto-width'>
        <h3 class='title'>
            为什么选择我们？
        </h3>
        <p class='subhead'>
            选择CATS作为交易加密数字货币的原因
        </p>
        <ul class='why-ul'>
            <li>
                <i class='icon el-icon-mobile-phone'></i>
                <p class='name'>
                    0手续费买卖数字货币
                </p>
                <p class='describe'>
                    使用多种支付方式交易数字货币，0手续费，安全快捷
                </p>
            </li>
            <li>
                <i class='icon el-icon-mobile-phone'></i>
                <p class='name'>
                    最优的交易费率
                </p>
                <p class='describe'>
                    优惠的交易费率，富有竞争力的VIP权益，享受最优品质的服务
                </p>
            </li>
            <li>
                <i class='icon el-icon-mobile-phone'></i>
                <p class='name'>
                    可信赖的安全保障
                </p>
                <p class='describe'>
                    我们全面的安全措施保护您的数字资产免受所有风险。
                </p>
            </li>
            <li>
                <i class='icon el-icon-mobile-phone'></i>
                <p class='name'>
                    24*7小时客服支持
                </p>
                <p class='describe'>
                    24*7小时全天候、全日制运营模式，第一时间为您解答相关咨询。
                </p>
            </li>
        </ul>
    </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
.why-module {
    margin-top: 90px;
    color: var(--color);
    .title {
        font-size: 32px;
        font-weight: bold;
    }
    .subhead {
        margin-top: 5px;
        font-size: 16px;
    }
    .why-ul {
        display: flex;
        margin-top: 55px;
        li {
            display: flex;
            flex-direction: column;
            width: 245px;
            margin-right: 64px;
            &:last-of-type {
                margin-right: 0;
            }
            .icon {
                font-size: 50px;
                color: var(--normalColor);
            }
            .name {
                margin-top: 25px;
                font-size: 16px;
            }
            .describe {
                margin-top: 18px;
                line-height: 22px;
                font-size: 14px;
                color: var(--normalColor);
            }
        }
    }
}
</style>
