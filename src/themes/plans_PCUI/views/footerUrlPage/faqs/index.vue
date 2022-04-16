<template>
    <div class='faqs'>
        <div class='content'>
            <div v-for='(item,index) in contentList' :key='index' class='item'>
                <p class='title'>
                    {{ item.title }}
                </p>
                <p class='reply'>
                    {{ item.reply }}
                </p>
                <ul v-if='item.list' class='itemList'>
                    <li v-for='(item,index) in item.list' :key='index' class='li'>
                        {{ item }}
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    setup () {
        const contentList= [
            {
                title: 'Where was Vitatoken founded?',
                reply: 'Vitatoken was in Cagayan Economic Zone Authority (CEZA), under the name of Dragon Empire Developments Limited, on 6th September, 2021. We provide Fintech solution, with cryptocurrency trading license.'
            },
            {
                title: 'How to complete my account verification?',
                reply: 'You may verify your account by uploading your identifications.'
            },
            {
                title: 'What is the transaction fee?',
                reply: 'For Spot Trading, we charge 0.15%; For Fund Trading, we charge 0.5%.'
            },
            {
                title: 'How to contact Vitatoken customer service team?',
                reply: 'You may contact our customer service team through our website or app. Please note that our team WILL NOT ask you for your account password or pin. Never trust any call from someone claimed to be an employee from Vitatoken.'
            },
            {
                title: 'What is V10?',
                reply: 'V10 is an Index Fund of Cryptocurrency with the characteristics of autonomy, high performance and low cost. Lower the passing standard of cryptocurrency trading and increase the probability of profit by investing on V10 .'
            },
            {
                title: 'Why is V10 on blockchain?',
                reply: 'It is because of',
                list: [
                    'Transparent Funds',
                    'No traditional bank fees are charged, which mean relatively low handling fee',
                    'Can be marketed and apply p-to-p transaction on trading platform easily',
                    'V10 only hold cryptocurrency assets',
                ]
            },
            {
                title: 'What will have happened if V10 holds a token that is “hard forked” (e.g. ETH and BTC)?',
                reply: 'Vitatoken will integrate the related token(s) in V10, then activate the rebalancing frequency. Since the value of the fund may increase, it will pass on to the V10 holders.'
            },
            {
                title: 'Why should you buy V10?',
                reply: 'According to relative data, 80% of fund managers are unable to achieve returns on benchmark index, neither for individual investors. V10 is a cryptocurreny index fund, it uses machine learning & testing, in order to reduce human biases in trading, and to optimize returns.'
            }
        ]
        return {
            contentList
        }
    }
}
</script>

<style lang="scss" scoped>
.faqs{
    width: 100%;
    color:#333;
    background: #fff;
    padding: 50px 0 24px;
    .content{
        width: 745px;
        text-align: left;
        font-size: 14px;
        line-height: 21px;
        margin: 0px auto;
        .item{ margin-bottom: 20px;}
        .li {
            position: relative;
            padding-left: 14px;
            &::before {
                position: absolute;
                display: inline-block;
                margin-left: -14px;
                color: #333;
                font-size: 16px;
                font-family: Arial, sans-serif;
                content: '\2022';
            }
        }
    }
    .title{ color:#ebb650; }
}

</style>
