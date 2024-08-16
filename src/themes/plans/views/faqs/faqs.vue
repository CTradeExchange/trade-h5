<template>
    <div class='faqs-box'>
        <LayoutTop :back='true' :menu='false' :title="$t('headLineDeposit.faqs')">
            <template #right>
                <div class='right-icon-box' @click='visitHelp'>
                    <img alt='' src='@/themeCommon/image/connect.png' />
                </div>
            </template>
        </LayoutTop>
        <div class='faqList-box'>
            <FaqList />
        </div>
    </div>
</template>

<script setup>
import FaqList from '@/themeCommon/components/faqsList/faqsList.vue'
import { getCurrentInstance } from 'vue'

const { proxy } = getCurrentInstance()

const visitHelp = () => {
    proxy.openPasstoAIChat()
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.faqs-box{
  .right-icon-box{
    &>img{
      max-width:36px
    }
  }
  .faqList-box{
    margin-top:6px;
  }
}
</style>
