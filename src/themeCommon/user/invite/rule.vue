<template>
    <div class='page-wrap'>
        <LayoutTop :back='true' title='邀请活动规则' />
        <div class='content'>
            <p class='t3'>
                活动规则：推荐人每成功推荐一位新用户给vitatoken，
                就能在新推荐用户在任何现货或基金交易时从交易费中收到佣金。
                这表示您可以立即透过推荐链接自由邀请用户，两者皆能提供佣金。
                朋友使用您的推荐链接注册时亦可享有您设置的交易手续费折扣。
            </p>
            <p class='t2'>
                现货：
            </p>
            <table border='1' class='table'>
                <tr>
                    <th>邀请人净入金</th>
                    <th>邀请人返佣比例</th>
                    <th>邀请人收到的返佣比例</th>
                    <th>被邀请人的返现比例</th>
                </tr>
                <tr>
                    <td rowspan='3'>
                        &lt;5000u
                    </td>
                    <td rowspan='3'>
                        20%
                    </td>
                    <td>20%</td>
                    <td>0%</td>
                </tr>
                <tr>
                    <td>15%</td>
                    <td>5%</td>
                </tr>
                <tr>
                    <td>10%</td>
                    <td>10%</td>
                </tr>

                <tr>
                    <td rowspan='5'>
                        ≥5000u
                    </td>
                    <td rowspan='5'>
                        40%
                    </td>
                    <td>40%</td>
                    <td>0%</td>
                </tr>
                <tr>
                    <td>35%</td>
                    <td>5%</td>
                </tr>
                <tr>
                    <td>30%</td>
                    <td>10%</td>
                </tr>
                <tr>
                    <td>25%</td>
                    <td>15%</td>
                </tr>
                <tr>
                    <td>20%</td>
                    <td>20%</td>
                </tr>
            </table>

            <p class='t1'>
                若邀请人淨入金&lt;5000 U，返佣比例为 20%，邀请人可以设置 0%、5%、10% 三档被邀请人返现比例。
            </p>
            <p class='t1'>
                若邀请人净入金≥5000 U，返佣比例增加为 40%，邀请人可以自行设置 0%、5%、10%、15%、20% 五档被邀请人返现比例。
            </p>
            <br />
            <p class='t2'>
                基金：
            </p>
            <table border='1' class='table'>
                <tr>
                    <th>邀请人净入金</th>
                    <th>邀请人返佣比例</th>
                    <th>邀请人收到的返佣比例</th>
                    <th>被邀请人的返现比例</th>
                </tr>
                <tr>
                    <td rowspan='2'>
                        &lt;5000u
                    </td>
                    <td rowspan='2'>
                        10%
                    </td>
                    <td>10%</td>
                    <td>0%</td>
                </tr>
                <tr>
                    <td>5%</td>
                    <td>5%</td>
                </tr>

                <tr>
                    <td rowspan='3'>
                        ≥5000u
                    </td>
                    <td rowspan='3'>
                        20%
                    </td>
                    <td>20%</td>
                    <td>0%</td>
                </tr>
                <tr>
                    <td>15%</td>
                    <td>5%</td>
                </tr>
                <tr>
                    <td>10%</td>
                    <td>10%</td>
                </tr>
            </table>
            <p class='t1'>
                若邀请人淨入金&lt;5000 U，返佣比例為10%，邀请人可以设置 0%、5% 二文件被邀请人返现比例。
            </p>
            <p class='t1'>
                若邀请人净入金≥5000 U，返佣比例增加为 20%，邀请人可以自行设置 0%、5%、10%、三档被邀请人返现比例。
            </p>
            <br />

            <p class='t2'>
                佣金放送：
            </p>
            <p class='t1'>
                1. 数据更新时间以UTC+0时间为准。 今日佣金的计算以前日资产为基准，每天24：00：00结算当天的佣金。
            </p>
            <p class='t1'>
                2. 您的推荐佣金将于未来 72 小时内入账至您的资产V10 ETF。 如果您于未来 72 小时未收到您的佣金，请联系我们的在线客服中心以获得进一步的协助。
            </p>
            <br />

            <p class='t2'>
                注意事项：
            </p>
            <p class='t1'>
                1. 活动期间如发现客户不正规交易，vitatoken有权停止客户交易并取消奖励资格
            </p>
            <p class='t1'>
                2.ETF贖回，赠金取款的过程所发生的费用,银行手续费或汇率引致的差额都由客户所承担
            </p>
            <p class='t1'>
                3.对活动有疑问的地方可以随时联系在线客服
            </p>
            <p class='t1'>
                4. vitatoken保留随时全权酌情因任何理由修改、变更或取消此公告的权利，无需事先通知。
            </p>
            <p class='t1'>
                5.风险提示：加密货币交易存在风险，请您谨慎购买，并注意交易风险。 请注意，vitatoken不对您的任何交易行为承担担保、赔偿等责任
            </p>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.page-wrap {
    width: 100%;
    height: 100%;
    margin-top: rem(110px);
    overflow: auto;
    background: var(--contentColor);
    .content {
        padding: rem(30px);
        .table {
            margin: rem(20px);
            text-align: center;
            background-color: var(--bgColor);
            border: 1px solid #DDD;
            border-collapse: collapse;
            td,
            th {
                padding: rem(10px);
                border-right: solid 1px #DDD;
                border-bottom: solid 1px #DDD;
            }
            th {
                padding: rem(20px);
                color: #999;
                font-weight: bold;
            }
        }
        .t1 {
            margin: rem(20px) 0;
            padding-left: rem(20px);
            color: #666;
        }
        .t2 {
            margin: rem(20px) 0;
            font-weight: bold;
            font-size: rem(30px);
        }
        .t3 {
            margin: rem(20px) 0;
            color: #666;
            line-height: rem(50px);
        }
    }
}
</style>
