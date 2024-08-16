<template>
    <div class='block-atm-faq'>
        <div v-for='(item,index) in state.list' :key='index' :class="['block-atm-faq-item',item.url?'cur':'']" @click='visitThisFaq(item)'>
            <span class='title'>
                {{ item.title }}
            </span>
            <img v-if='item.url' alt='' src='@/themeCommon/image/arrowRight.png' />
        </div>
    </div>
</template>

<script setup>
import { reactive, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const { t, locale } = useI18n({ useScope: 'global' })

const state = reactive({
    list: [
        {
            title: t('headLineFaqs.faq1'),
            url: locale.value == 'zh-CN' ? 'https://help.headline.net/zh-cn/deposit-and-withdraw/what-is-blockatm' : 'https://help.headline.net/en-us/deposit-and-withdraw/what-is-blockatm'
        },
        {
            title: t('headLineFaqs.faq2'),
            url: locale.value == 'zh-CN' ? 'https://help.headline.net/zh-cn/deposit-and-withdraw/how-to-make-a-deposit-on-headline' : 'https://help.headline.net/en-us/deposit-and-withdraw/how-to-make-a-deposit-on-headline'
        },

        {
            title: t('headLineFaqs.faq3'),
            url: locale.value == 'zh-CN' ? 'https://help.headline.net/zh-cn/deposit-and-withdraw/what-is-gas-fee' : 'https://help.headline.net/en-us/deposit-and-withdraw/what-is-gas-fee'
        },

        {
            title: t('headLineFaqs.faq5'),
            url: locale.value == 'zh-CN' ? 'https://help.headline.net/zh-cn/deposit-and-withdraw/what-if-i-dont-have-a-wallet' : 'https://help.headline.net/en-us/deposit-and-withdraw/what-if-i-dont-have-a-wallet'
        },
        {
            title: t('headLineFaqs.faq6'),
            url: locale.value == 'zh-CN' ? 'https://help.headline.net/zh-cn/deposit-and-withdraw/how-to-check-my-deposit-progress' : 'https://help.headline.net/en-us/deposit-and-withdraw/how-to-check-my-deposit-progress'
        },
    ],
})
const visitThisFaq = (item) => {
    // item?.url && window.open(item.url, '_blank')

    if (window?.isPC) {
        item?.url && window.open(item.url, '_blank')
    } else {
        router.push({
            path: '/faqItem',
            query: item,
        })
    }
}
</script>

<style lang="scss" scoped>
.block-atm-faq{
  display: flex;
  flex-direction: column;
  .block-atm-faq-item{
    background-color:#fff;
    margin-bottom:8px;
    padding:0 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 56px;
    &.cur{
      cursor:pointer;
    }
    &>.title{
      color: #000;
      font-family: Inter;
      font-size: 14px;
      font-weight: 500;
    }
    &>img{
      max-width:24px
    }
  }
}
</style>
