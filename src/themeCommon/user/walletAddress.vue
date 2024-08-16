<template>
    <div class='layout'>
        <!-- 加载中组件 -->
        <Loading :show='loading' />
        <LayoutTop bottom-line />
        <div class='container'>
            <div v-if='addressList.length > 0' class='address-list'>
                <div v-for='(item,index) in addressList' :key='index' class='row'>
                    <SwipeCell :ref='setRefAction' :name='item.id' stop-propagation @close='onOpen' @open='onOpen'>
                        <div class='item' :style="checkObj.id==item.id?'background-color: var(--transferSuccessBg)':'background-color: var(--contentColor);'">
                            <img v-if='isWithDraw' :src="!chainList.find(k=>k.name==item.chainName)?require('../../themes/plans/images/assets/ban-select.svg'):checkObj.id!==item.id?require('../../themes/plans/images/assets/select.svg'):require('../../themes/plans/images/assets/activeSelect.svg')" @click='onCheck(item)' />
                            <div class='above' @click='onCheck(item)'>
                                <div class='address-info-box'>
                                    <Unsupported v-if='chainList.length&&!chainList.find(k=>k.name==item.chainName)'
                                                 :content="$t('headLineTrade.unsupported')"
                                    />

                                    <div class='address-title'>
                                        <span class='address-title-text'>
                                            {{ item.currency }}-{{ item.chainName }}
                                        </span>
                                        <span class='address-title-remark'>
                                            {{ item.remark }}
                                        </span>
                                    </div>
                                </div>
                                <p class='code'>
                                    {{ item.address }}
                                </p>
                            </div>
                            <div v-if='openID==item.id?false:true' @click='openSwiperCell(index)'>
                                <img alt='' src='../../themes/plans/images/assets/delate.png' />
                            </div>
                        </div>
                        <template #right>
                            <div class='below' :class="openID==item.id?'openBg':'hideBg'" @click='deleteWalletShow(item.id)'>
                                <img alt='' src='../../themes/plans/images/assets/widthDelate.png' />
                            </div>
                        </template>
                    </SwipeCell>
                </div>
            </div>
            <van-empty
                v-else
                :description="$t('walletAddress.none')"
                image='/images/empty.png'
            />
        </div>

        <div class='footer-Box'>
            <div v-if='isWithDraw' class='addBtn' @click='addWalletConfirm'>
                <van-icon :color='style.allColor' name='plus' />
                <span>&nbsp;{{ $t('walletAddress.addBtn') }}</span>
            </div>
            <div class='fp-prompt'>
                <span class='cirle'>
                    ·
                </span>
                <p>
                    {{ $t('headLineTrade.withdraw-support-1') }}
                    <span>{{ readChainsName() }}</span>
                    {{ $t('headLineTrade.withdraw-support-2') }}
                </p>
            </div>
            <!-- 底部按钮 -->
            <div class='footer'>
                <button class='footer-btn' @click='onClick'>
                    <span>{{ btnText }} </span>
                </button>
            </div>
        </div>
    </div>
    <!-- 删除提示弹窗 -->
    <van-popup v-model:show='delShow' :duration='0.2' position='center' round :style="{ width: '93%' }">
        <div class='successBox'>
            <div class='imgBox'>
                <img src='../../themes/plans/images/assets/close.svg' @click='delShow=false' />
            </div>
            <div class='content'>
                <img class='successImg' src='../../themes/plans/images/assets/addRemove.svg' />
                <div class='title'>
                    {{ $t('withdraw.removeAddress') }}
                </div>
                <div class='tipsText'>
                    {{ $t('walletAddress.addHint') }}
                </div>
                <div class='textContent'>
                    <span>{{ $t('withdrawNew.address') }}</span>
                    <div class='address'>
                        {{ modelData.currency }}-{{ modelData.chainName }}
                    </div>
                    <div class='name'>
                        {{ modelData.address }}
                    </div>
                </div>
            </div>
            <div class='btnBox'>
                <div class='calcel' @click='delShow=false'>
                    {{ $t('common.cancel') }}
                </div>
                <div class='confirm' @click='onConfirmDel'>
                    {{ $t('compLang.confirm') }}
                </div>
            </div>
        </div>
    </van-popup>
</template>

<script>
import { onMounted, reactive, toRefs, computed } from 'vue'
import { getWalletAddressList, deleteWalletAddress } from '@/api/user'
import { Toast, SwipeCell } from 'vant'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { debounce, localSetJSON } from '@/utils/util'
import { useRouter, useRoute } from 'vue-router'
import Unsupported from './withdraw/unsupported.vue'

export default {
    components: {
        SwipeCell,
        Unsupported
    },
    setup () {
        const store = useStore()
        const { t } = useI18n({ useScope: 'global' })
        const style = computed(() => store.state.style)
        const router = useRouter()
        const route = useRoute()
        // 如果没有传参数，说明是个人中心跳转过来的
        const { chainName, coin, id, tradeType, accountId, withdrawMethod, chainList } = route.query
        const formatChainList = chainList ? JSON.parse(chainList) : []
        const state = reactive({
            // 加载状态
            loading: true,
            delShow: false,
            // 钱包地址列表
            addressList: [],
            openID: '',
            refList: [],
            modelData: {},
            checkObj: {},
            coinAndChain: `${coin}-${chainName}`,
            // 如果没有传参数，说明是个人中心跳转过来,否则是从提现页面跳转过来的
            isWithDraw: !!(chainName && coin),
            chainList: formatChainList
        })

        // 点击选中提现地址
        const onCheck = (val) => {
            // 如果是不支持erc20的，不支持选择
            if (!state.chainList.find(k => k.name == val.chainName)) {
                return
            }
            // console.log('我选了这个', val)
            state.checkObj = val
        }

        const btnText = computed(() => {
            if (chainName && state.addressList.length) return t('compLang.confirm')
            else return t('walletAddress.addBtn')
        })

        // 删除钱包
        const deleteWalletShow = (id) => {
            state.modelData = state.addressList.find(v => v.id == id)
            state.delShow = true
        }
        const onConfirmDel = () => {
            deleteWalletAddress({
                id: state.modelData.id
            }).then(() => {
                Toast.success(t('withdraw.successHint'))
                state.addressList = state.addressList.filter(v => v.id !== state.modelData.id)
                state.delShow = false
            })
        }

        // 获取钱包地址列表
        const getWalletAddress = () => {
            getWalletAddressList({
                currency: coin
                // chainName: chainName
            }).then(res => {
                state.loading = false
                if (res.check()) {
                    const { data } = res
                    state.addressList = data
                    if (chainName && id) {
                        state.checkObj = state.addressList.find(v => v.id == id)
                    }
                }
            })
        }

        const onOpen = (v) => {
            const { name } = v
            if (state.openID == name)state.openID = ''
            else state.openID = name
        }
        const openSwiperCell = debounce((index) => {
            state.refList[index].open('right')
        }, 300)
        const setRefAction = (el) => {
            state.refList.push(el)
        }

        const onClick = () => {
            if (chainName && state.addressList.length) {
                localSetJSON('currentWallet', state.checkObj)
                router.go(-1)
            } else {
                addWalletConfirm()
            }
        }

        const addWalletConfirm = () => {
            router.push({ path: '/walletAdd', query: { tradeType, accountId, coin, withdrawMethod } })
        }

        onMounted(() => {
            // 获取钱包地址列表
            getWalletAddress()
        })

        const readChainsName = () => {
            if (state.chainList.length) {
                const strArr = []
                state.chainList.forEach(item => {
                    strArr.push(item.name)
                })
                return strArr.join(',')
            } else {
                return ''
            }
        }
        return {
            ...toRefs(state),
            deleteWalletShow,
            style,
            onOpen,
            openSwiperCell,
            setRefAction,
            onConfirmDel,
            onClick,
            onCheck,
            chainName,
            btnText,
            addWalletConfirm,
            readChainsName
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.layout {
    display: flex;
    flex-direction: column;
    height: 100vh;
    background-color: var(--bgColor);
}
.container {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    background-color: var(--contentColor);
    margin-top: rem(16px);
}
.address-list {
    padding-top:rem(42px);
    display: flex;
    flex-direction: column;
    align-items: center;
    .row{
        display: flex;
        align-items: center;
        margin-bottom: rem(48px);
        :deep(.van-swipe-cell){
            width: rem(750px) !important;
        }
        :deep(.van-swipe-cell__right){
            right: rem(16px);
        }
    }

    .checkItem{
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: auto;
        width: rem(690px);
        padding: rem(24px) rem(32px);
        background-color: var(--transferSuccessBg);
        border-radius: rem(16px);
    }
    .item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: auto;
        width: rem(690px);
        padding: rem(24px) rem(32px);
        background-color: var(--contentColor);
        border-radius: rem(16px);

        .above {
            width: rem(466px);
            display: flex;
            flex-direction: column;
            font-size: 14px;
            font-family: Inter;
            font-style: normal;
            font-weight: 600;
            line-height: normal;
            color: var(--mainColor);
            word-wrap: break-word;
            .address-info-box{
              display:flex;
              flex-direction:column;
              .address-title{
                margin-top:10px;
                display:flex;
                align-items:center;
                .address-title-text{

                }
                .address-title-remark{
                  margin-left:16px;
                  padding:2px 4px;
                  border-radius: 3px;
                  font-size:12px;
                  font-weight:400;
                  background: #D9D9D9;
                }
              }
            }
            .code {
                margin-top: rem(16px);
                font-size: rem(22px);
                font-weight: 400;
            }
        }

    }
    .below{
            flex-shrink: 0;
            width: rem(124px);
            height: 100%;
            border-radius: rem(16px);
            background: var(--primary);
            display: flex;
            align-items: center;
            justify-content: center;
    }
    .openBg{
        opacity: 1;
        transition: 0.5s;
    }
    .hideBg{
        opacity: 0;
        transition: 0.5s;
    }
}

.footer-Box{
  background-color: #fff;

  .addBtn{
        width: 100%;
        display: flex;
        font-size:14px;
        font-family: Inter;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
        color: var(--allColor);
        padding-left: 30px;
        margin-bottom:15px;
        padding-top:15px;
    }

.fp-prompt{
  padding:0 20px;
  min-height: 30px;
  padding-bottom:20px;
  display: flex;
  .cirle{
    font-size: 32px;
    line-height: 20px;

  }
  p{
    font-size:12px;
    text-indent:10px;
    margin-left: -6px;
    word-break: keep-all;
    line-height:20px;
    color:#999;
    span{
      font-weight: 600;
      color: var(--primaryText);
    }
  }

}
.footer{
    .footer-btn {
    width: rem(694px);
    height: rem(90px);
    margin: auto;
    margin-bottom: rem(32px);
    border-radius: rem(10px);
    background: var(--primary);
    border: none;
    display: flex;
    justify-content: center;
    align-items: center;
        span {
            color: var(--contentColor);
            font-size: rem(30px);
        }
    }
}
}

.successBox{
    padding: rem(30px);
    .imgBox{
      display: flex;
      justify-content: flex-end;
    }
    .content{
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: rem(48px);
      .successImg{
        width: rem(104px);
        height: rem(104px);
      }
      .title{
        color: var(--mainColor);
        margin-top:rem(32px);
        font-size: rem(32px);
        font-family: Inter;
        font-weight: 700;
        line-height: normal;
      }
      .tipsText{
        color: var(--mainColor);
        margin-top:rem(16px);
        font-size: rem(24px);
        font-family: Inter;
        font-weight: 400;
        line-height: normal;
      }
      .textContent{
        width: 100%;
        margin-top:rem(72px);
        padding:rem(48px) rem(40px);
        background: var(--transferSuccessBg);
        color: var(--mainColor);
        font-size: rem(32px);
        font-family: Inter;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
        .address{
            margin-top: rem(32px);
            font-size: rem(28px);
            font-weight: 600;
        }
        .name{
            margin-top: rem(16px);
            font-size: rem(22px);
            font-weight: 400;
        }

      }
    }
    .btnBox{
        margin-top: rem(64px);
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: rem(28px);
        font-family: Inter;
        font-style: normal;
        font-weight: 600;
        line-height: normal;
        .calcel{
            width: rem(300px);
            height: rem(96px);
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: rem(16px);
            border: 1px solid var(--primary);
            color: var(--primary);
        }
        .confirm{
            width: rem(300px);
            height: rem(96px);
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: rem(16px);
            background: var(--primary);
            color: var(--contentColor);

        }
    }

}
</style>
