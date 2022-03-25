<template>
    <div class='why-module auto-width'>
        <!-- <h3 class='title'>
            {{ $t('home.why.title') }}
        </h3>
        <p class='subhead'>
            {{ $t('home.why.describe') }}
        </p>
        <ul class='why-ul'>
            <li>
                <img src='@planspc/images/home/why-icon1.png' />
                <p class='name'>
                    {{ $t('home.why.title1') }}
                </p>
                <p class='describe' v-html="$t('home.why.text1')"></p>
            </li>
            <li>
                <img src='@planspc/images/home/why-icon2.png' />
                <p class='name'>
                    {{ $t('home.why.title2') }}
                </p>
                <p class='describe' v-html="$t('home.why.text2')"></p>
            </li>
            <li>
                <img src='@planspc/images/home/why-icon3.png' />
                <p class='name'>
                    {{ $t('home.why.title3') }}
                </p>
                <p class='describe' v-html="$t('home.why.text3')"></p>
            </li>
            <li>
                <img src='@planspc/images/home/why-icon4.png' />
                <p class='name'>
                    {{ $t('home.why.title4') }}
                </p>
                <p class='describe' v-html="$t('home.why.text4')"></p>
            </li>
        </ul> -->

        <p class='descTitle'>
            安全始终是我们的优先考虑
        </p>
        <div class='descList'>
            <div class='row'>
                <img alt='' class='icon' src='~@planspc/images/home/moneyBox.png' />
                <p class='descTitle'>
                    用户安全资产基金(SAFU)
                </p>
                <p class='descContent'>
                    我们将所有交易费用的10%存储于安全资产基金，为用户资金提供部分保障。
                </p>
            </div>
            <div class='row'>
                <img alt='' class='icon' src='~@planspc/images/home/trafficLight.png' />
                <p class='descTitle'>
                    个性化访问控制
                </p>
                <p class='descContent'>
                    高级访问控制限制访问个人账户的设备和地址，让用户无后顾之忧。
                </p>
            </div>
            <div class='row'>
                <img alt='' class='icon' src='~@planspc/images/home/lock.png' />
                <p class='descTitle'>
                    先进数据加密
                </p>
                <p class='descContent'>
                    个人交易数据通过端到端加密获得保障，仅限本人访问个人信息。
                </p>
            </div>
            <div class='row last'>
                <img alt='' class='icon' src='~@planspc/images/home/check.png' />
                <p class='descTitle'>
                    账户异常实时监控
                </p>
                <p class='descContent'>
                    我们的风险管理系统会分析每次提款尝试、密码重置、双重身份验证重置和电子邮件地址更改。异常活动会触发至少 24-48 小时的暂停提款。
                </p>
            </div>
        </div>
    </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.why-module {
    margin-top: 45px;
    color: var(--color);
    .title {
        @include font();
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
            align-items: center;
            width: 245px;
            text-align: center;
            margin-right: 64px;
            &:last-of-type {
                margin-right: 0;
            }
            img {
                width: 140px;
                height: 140px;
            }
            .name {
                margin-top: 25px;
                font-size: 16px;
                font-weight: bold;
            }
            .describe {
                 padding: 0 30px;
                margin-top: 18px;
                line-height: 22px;
                font-size: 14px;
                color: var(--normalColor);
            }
        }
    }
}
.descTitle{
    font-family: "Microsoft Yahei";
    font-size: 32px;
    font-weight: bold;
    text-align: center;
    padding-bottom: 20px;
}
.descList{
    padding-top: 40px;
    padding-left: 16px;
    padding-right: 16px;
    padding-bottom: 16px;
    background: var(--contentColor);
    text-align: center;
    display: flex;
    justify-content: space-between;
    .row{
        margin-right: 64px;
        margin-bottom: 40px;
        width: 245px;
        &.last{
            margin-right: 0;
        }
    }
    .icon{
        width: 56px;
    }
    .descTitle{
        padding-top: 10px;
        color: #1E2329;
        font-weight: 500;
        font-size: 20px;
        line-height: 28px;
        margin-bottom: 8px;
    }
    .descContent{
        color: #474D57;
        font-weight: 400;
        font-size: 14px;
        line-height: 20px;
        min-height: 1.2em;
    }
}
</style>
