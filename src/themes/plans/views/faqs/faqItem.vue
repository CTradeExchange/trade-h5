<template>
    <div class='faqs-box'>
        <LayoutTop :menu='false' :title='title' />
        <div class='faqList-box'>
            <iframe
                v-if='url'
                allowfullscreen
                class='cont'
                frameborder='0'
                height='100%'
                :src='url'
                width='100%'
            ></iframe>
        </div>
    </div>
</template>

<script setup>
import FaqList from '@/themeCommon/components/faqsList/faqsList.vue'
import { useRouter, useRoute } from 'vue-router'
const route = useRoute()
const { title, url } = route.query

</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.faqs-box{
  height:100%;
:deep {
      .main {
          text-align: left;
          margin: 0;
          margin-left: 50px;
          width:70%;
          max-width:70%;
          & > .title {
            width:100%;

              color: var(--mainColor);
              font-family: 'Roboto';
              font-size: 18px;
              font-weight: 700;
              line-height:18px;
              white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
              // margin-left: -100px;
          }
      }
      .right{
        max-width:2%;
      }
  }
  .right-icon-box{
    &>img{
      max-width:36px
    }
  }
  .faqList-box{
    height:100%;
    margin-top:6px;
  }
}
</style>
