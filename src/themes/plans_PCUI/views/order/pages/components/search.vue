<template>
    <section class='search-component'>
        <div class='search-bar mt-4'>
            <el-input v-model='searchValue' class='search-input' clearable :placeholder='$t("common.searchPlaceholder")' @input='onSearch'>
                <template #prefix>
                    <el-icon class='el-input__icon'>
                        <Search />
                    </el-icon>
                </template>
            </el-input>
            <!-- <van-icon class='quoteListTypeIcon' name='apps-o' @click='confirmChangeQuoteListType' /> -->
        </div>

        <slot></slot>
        <!--
        <van-popup v-model:show='quoteListTypePopupShow' closeable position='left' :style="{ height: '100%', width: '320px' }">
            <section class='quoteListTypePopup'>
                <div class='popupTitle'>
                    <span>切换样式</span>
                </div>
                <div class='container'>
                    <div class='item' @click="quoteListTypeChecked='normal'">
                        <img alt='' src='/images/quoteListType1.png' />
                        <van-icon v-if="quoteListTypeChecked==='normal'" name='checked' :size='18' />
                        <van-icon v-if="quoteListTypeChecked==='block'" name='circle' :size='18' />
                    </div>
                    <div class='item' @click="quoteListTypeChecked='block'">
                        <img alt='' src='/images/quoteListType2.png' />
                        <van-icon v-if="quoteListTypeChecked==='normal'" name='circle' :size='18' />
                        <van-icon v-if="quoteListTypeChecked==='block'" name='checked' :size='18' />
                    </div>
                </div>
                <div class='actions'>
                    <van-button block type='primary' @click='handlerQuoteListType'>
                        {{ $t('signal.common.apply') }}
                    </van-button>
                </div>
            </section>
        </van-popup> -->
    </section>
</template>

<script>
import { ref, watch } from 'vue'
import { useStore } from 'vuex'
import { ElInput, ElIcon } from 'element-plus'
import { Search } from '@element-plus/icons'
import { getSymbolList } from '@/api/trade'
import { debounce } from '@/utils/util'

export default {
    components: {
        [ElInput.name]: ElInput,
        [ElIcon.name]: ElIcon,
        Search
    },
    props: {
        tradeType: {
            type: [String, Number],
            default: ''
        }
    },
    emits: ['onSelect', 'onSearch', 'onChangeQuoteListType'],
    setup (props, context) {
        const store = useStore()
        const searchValue = ref('')

        const quoteListTypePopupShow = ref(false)
        const quoteListTypeChecked = ref(store.state._quote.quoteListType)

        const onClick = product => {
            context.emit('onSelect', product)
        }

        // 搜索
        const onSearch = debounce((key) => {
            context.emit('onInput', key)
            if (key) {
                getSymbolList({ name: key, customerGroupId: store.getters.customerGroupId, tradeType: props.tradeType }).then(res => {
                    if (res.check()) {
                        context.emit('onSearch', res.data || [])
                    }
                })
            } else {
                context.emit('onSearch', [])
            }
        })

        watch(() => props.tradeType, () => {
            // 玩法更新，重置搜索
            searchValue.value = ''
            onSearch()
        })

        const confirmChangeQuoteListType = () => {
            quoteListTypePopupShow.value = true
        }

        // 切换产品列表的样式， block 块列表， normal 普通列表
        const handlerQuoteListType = () => {
            // const curType = store.state._quote.quoteListType
            // const changeType = curType === 'block' ? 'normal' : 'block'
            const changeType = quoteListTypeChecked.value
            quoteListTypePopupShow.value = false
            store.commit('_quote/Update_quoteListType', changeType)
            context.emit('onChangeQuoteListType', changeType)
        }

        return {
            searchValue,
            quoteListTypePopupShow,
            quoteListTypeChecked,
            onClick,
            confirmChangeQuoteListType,
            handlerQuoteListType,
            onSearch
        }
    },
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.search-component {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  align-items: center;
  flex: 1;
  width: 100%;
  overflow: hidden;
  .search-bar{
      width: 100%;
      padding-right: 5px;
      display: flex;
      align-items: center;
      justify-content: space-between;
  }
  .quoteListTypeIcon{
      font-size: 20px;
      color: var(--normalColor);
      margin-top: -5px;
      cursor: pointer;
      &:hover{
          color: var(--primary);
      }
  }
  .search-input {
      flex: 1;
      width: 100%;
      height: 40px;
      padding: 0 6px 0 10px;
      font-size: 12px;
      :deep {
          .el-input__inner {
              border-color: transparent;
              //background: var(--assistColor);
              &:focus {
                  border-color: var(--primary);
              }
          }
      }
  }
  .content {
      box-sizing: border-box;
      width: 100%;
      padding: 0;
      overflow-y: auto;
      .loading {
          margin-top: rem(50px);
      }
      .listWrap {
          display: flex;
          flex: 1;
          flex-direction: column;
          align-items: flex-start;
          justify-content: flex-start;
          box-sizing: border-box;
          width: 100%;
          overflow-y: auto;
          color: var(--color);
          font-weight: 500;
          font-size: rem(30px);
          .li {
              width: 100%;
              height: rem(112px);
              padding: 0 rem(20px);
              line-height: rem(112px);
              text-indent: rem(30px);
              border-bottom: 1px solid var(--bgColor);
              &:last-child {
                  border-color: transparent;
              }
          }
      }
      .empty {
          padding: rem(50px) 0;
          text-align: center;
      }
  }
}

.quoteListTypePopup{
  display: flex;
  flex-direction: column;
  height: 100%;
  .popupTitle{
      text-align: center;
      padding: rem(38px) 0 rem(32px) 0;
      font-size: rem(32px);
      line-height: rem(48px);
      font-weight: bold;
      color: var(--color);
      position: relative;
  }
  .container{
      flex: 1;
      align-items: center;
      display: flex;
      .item{
          margin: 0 10px;
          text-align: center;
          cursor: pointer;
      }
      img{
          display: block;
          border: 4px solid var(--bgColor);
          border-radius: 5px;
          width: 100%;
          margin-bottom: 6px;
      }
      .van-icon-checked{
          color: var(--primary);
      }
  }
  .actions{
      padding: 0 8px 8px;
  }
}
</style>
