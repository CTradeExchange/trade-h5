<template>
    <el-dialog v-model='addressOpen' align-center class='ma-dialog' :modal='false' :show-close='false' :width='520'>
        <template #header>
            <LayoutTop :custom-back='true' @back='handleBack' />
        </template>
        <div class='fp-body'>
            <div class='fp-content'>
                <div class='fp-list'>
                    <div v-if='addressList.length > 0' class='fp-list-box'>
                        <div
                            v-for='item in addressList'
                            :key='item.id'
                            :class="item.id === checkWalletId ? 'checked' : 'noChecked'"
                            @click='selectWallet(item)'
                        >
                            <div :class="['list-address-item', `${item.currency}-${item.chainName}` !== coinAndChain ? 'not-erc20' : '']">
                                <img
                                    v-if='`${item.currency}-${item.chainName}` !== coinAndChain'
                                    src='../../../../../assets/newPCUI/ban-check.png'
                                />
                                <img v-else-if='item.id === checkWalletId' src='../../../../../assets/newPCUI/checked.png' />
                                <img v-else src='../../../../../assets/newPCUI/check.png' />
                                <div class='list-address-info'>
                                    <Unsupported
                                        v-if='`${item.currency}-${item.chainName}` !== coinAndChain'
                                        :content="$t('headLineTrade.unsupported')"
                                        style='margin-bottom: 6px'
                                    />

                                    <p class='chain-type-name'>
                                        {{ `${item.currency}-${item.chainName}` }}
                                        <span v-if='item.remark'>
                                            {{ item.remark }}
                                        </span>
                                    </p>
                                    <p class='curtom-name'>
                                        {{ item.address }}
                                    </p>
                                </div>
                                <el-icon v-if='item.id === checkWalletId' class='icon-disable'>
                                    <Delete />
                                </el-icon>
                                <el-icon v-else @click.stop='deleteWallet(item.id)'>
                                    <Delete />
                                </el-icon>
                            </div>
                        </div>
                    </div>
                    <div v-else class='empty-box'>
                        <img alt='' src='../../../../../assets/newPCUI/empty.png' />
                        <p>{{ $t('c.noData') }}</p>
                    </div>
                </div>
            </div>
            <div>
                <div class='fp-add' @click='handleAdd'>
                    <el-icon><Plus /></el-icon>
                    <span>{{ $t('withdrawCoin.walletAdd') }}</span>
                </div>

                <div class='fp-prompt'>
                    <span class='cirle'>
                        ·
                    </span>
                    <p>
                        {{ $t('headLineTrade.withdraw-support-1') }}
                        <!-- <span>{{ 'Ethereum ERC20 ' }}</span> -->
                        {{ $t('headLineTrade.withdraw-support-2') }}
                    </p>
                </div>
                <div class='fp-btn' @click='handleSubmit'>
                    {{ $t('withdraw.confirm') }}
                </div>
            </div>
        </div>
        <!-- 二次确认删除操作弹窗 -->
        <van-dialog v-model:show='deleteShow' :height='521' :show-cancel-button='false' :show-confirm-button='false' :width='496'>
            <div class='content-ma'>
                <div class='delete-title-box'>
                    <h4>{{ $t('withdraw.removeAddress') }}</h4>
                    <el-icon class='close-icon'>
                        <Close @click='handleCancel' />
                    </el-icon>
                </div>

                <div class='delete-content-box'>
                    <div class='delete-content-box-top'>
                        <img alt='' src='../../../images/delete-prompt.png' />
                        <h4>
                            {{ $t('withdraw.removeAddress') }}
                        </h4>
                        <span>{{ $t('walletAddress.addHint') }}</span>
                    </div>
                    <div class='delete-content-box-bottom'>
                        <span>{{ $t('withdrawNew.address') }}</span>
                        <div class='address-info'>
                            <h4>{{ seleteDeleteWallet?.chainName }}</h4>
                            <span>{{ seleteDeleteWallet?.address }}</span>
                        </div>
                    </div>
                </div>

                <div class='delete-action-box'>
                    <div class='delete-action-center' @click='handleCancel'>
                        <span>{{ $t('wallet.cancel') }}</span>
                    </div>
                    <div class='delete-action-confirm' @click='handleDelete'>
                        <span>{{ $t('news.confirm') }}</span>
                    </div>
                </div>
            </div>
        </van-dialog>
    </el-dialog>
</template>

<script>
import { reactive, toRefs, watch, computed } from 'vue'
import { deleteWalletAddress } from '@/api/user'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Toast } from 'vant'
import Unsupported from '@/themes/plans_PCUI/components/unsupported.vue'

export default {
    components: {
        Unsupported,
    },
    props: {
        addressList: {
            type: Array,
            default: () => [],
        },
        walletId: {},
        walletSelectVisible: {
            type: Boolean,
            default: false,
        },
        chainNameList: {
            type: Array,
            default: () => [],
        },
        coin: {
            type: String,
            default: '',
        },
        chain: {
            type: String,
            default: '',
        },
        accountId: {
            type: String,
            default: '',
        },
        tradeType: {
            type: String,
            default: '',
        },
        withdrawMethod: {
            type: String,
            default: '',
        },
    },
    setup (props, { emit }) {
        const route = useRoute()
        const router = useRouter()
        const { t } = useI18n({ useScope: 'global' })
        // const { coin, chain, accountId, tradeType, withdrawMethod } = props
        const state = reactive({
            addressOpen: false,
            currentWallet: '',
            checkWalletId: '',
            deleteShow: false,
            checkID: null,
            seleteDeleteWallet: null,
            // ethereum_20: 'USDT-Ethereum(ERC20)', // 目前暂时写死仅支持erc20的
        })

        const coinAndChain = computed(() => {
            return `${props.coin}-${props.chain}`
        })

        watch(
            () => props.walletSelectVisible,
            (val) => {
                state.addressOpen = val
            },
        )

        watch(
            () => props.walletId,
            (val) => {
                state.checkWalletId = val
            },
            {
                immediate: true,
            },
        )

        // 删除钱包
        const deleteWallet = (id) => {
            state.deleteShow = true
            state.checkID = id
            state.seleteDeleteWallet = props.addressList.find((item) => item.id == id)
        }
        // 取消关闭弹窗
        const handleCancel = () => {
            state.checkID = ''
            state.currentWallet = null
            state.deleteShow = false
        }

        // 确认删除
        const handleDelete = () => {
            state.deleteShow = false
            // 发起api请示
            deleteWalletAddress({
                id: state.checkID,
            }).then(() => {
                Toast.success(t('withdraw.successHint'))
                const arr = props.addressList.filter((v) => v.id !== state.checkID)
                state.checkID = null
                emit('change', arr)
            })
        }

        const handleSubmit = () => {
            state.addressOpen = false
            emit('submit', {
                walletId: state.checkWalletId,
                currentWallet: state.currentWallet,
            })
        }

        // 选择钱包
        const selectWallet = (item) => {
            // 目前仅支持erc20,其他的禁止选择
            if (`${item?.currency}-${item?.chainName}` !== coinAndChain.value) {
                return
            }
            state.checkWalletId = item.id
            state.currentWallet = props.addressList.find((v) => v.id === item.id)
        }

        const handleBack = () => {
            const flag = props.addressList.find((v) => v.id === props.walletId)
            if (!flag) {
                handleSubmit()
            } else {
                emit('submit')
            }
        }

        const handleAdd = () => {
            router.replace({
                path: route.path.replace('withdraw', 'walletAdd'),
                query: {
                    chainName: props.chain,
                    coin: props.coin,
                    tradeType: props.tradeType,
                    accountId: props.accountId,
                    withdrawMethod: props.withdrawMethod,
                },
            })
            // router.push(`${route.path.replace('withdraw', 'walletAdd')}?n=${str}`)
        }
        return {
            handleSubmit,
            selectWallet,
            deleteWallet,
            handleDelete,
            handleBack,
            handleAdd,
            handleCancel,
            coinAndChain,
          ...toRefs(state),
        }
    },
}
</script>

<style lang="scss" scope>

.empty-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  user-select: none;
  & > img {
      width: 80px !important;
      height: 80px !important;
  }
  & > p {
      font-size: 20px;
      font-weight: 500;
      line-height: 1.5;
      margin-bottom: 24px;
      color: #999999;
  }
}
.icon-disable {
  cursor: not-allowed;
  color: #999;
}

.ma-dialog {
  height: 676px;
  display: flex;
  flex-direction: column;
  .content-ma {
      padding: 24px;
      display: flex;
      flex-direction: column;

      .delete-title-box {
          font-size: 16px;
          line-height: 2;
          color: var(--primaryText);
          width: 100%;
          display: flex;
          align-items: center;
          margin-bottom: 60px;
          justify-content: space-between;
          & > h4 {
              color: var(--primaryText);
          }
          .close-icon {
              width: 24px;
              height: 24px;
              font-size: 24px;
          }
      }
      .delete-content-box {
          display: flex;
          flex-direction: column;
          .delete-content-box-top {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              & > img {
                  margin-bottom: 24px;
              }
              & > h4 {
                  font-size: 16px;
                  color: var(--primaryText);
                  margin-bottom: 4px;
              }
              & > span {
                  font-size: 14px;
                  color: var(--primaryText);
              }
          }
          .delete-content-box-bottom {
              margin-top: 20px;
              display: flex;
              align-items: center;
              justify-content: space-between;
              background-color: var(--primaryAssistColor);
              padding: 20px;
              border-radius: 6px;
              & > span {
                  min-width: 16%;
                  display: flex;
                  flex-direction: column;
                  color: var(--primaryText);
              }
              .address-info {
                  display: flex;
                  flex-direction: column;
                  justify-content: flex-end;
                  align-items: flex-end;
                  & > h4 {
                      font-size: 14px;
                      color: var(--primaryText);
                      margin-bottom: 4px;
                  }
                  & > span {
                      font-size: 14px;
                      color: var(--primaryText);
                  }
              }
          }
      }

      .delete-action-box {
          margin-top: 50px;
          display: flex;
          justify-content: space-between;
          .delete-action-center {
              flex: 0.47;
              height: 48px;
              border: 1px solid var(--primary);
              color: var(--primary);
              font-size: 16px;
              display: flex;
              justify-content: center;
              align-items: center;
              cursor: pointer;
              border-radius: 4px;
              &:active {
                  opacity: 0.85;
              }
          }
          .delete-action-confirm {
              flex: 0.47;
              height: 48px;
              background: var(--primary);
              color: var(--contentColor);
              font-size: 16px;
              display: flex;
              justify-content: center;
              align-items: center;
              cursor: pointer;
              border-radius: 4px;
              &:active {
                  opacity: 0.85;
              }
          }
      }
  }
  .el-dialog__body {
      // flex: 1;
      height:calc(100% - 56px);
  }
  .el-dialog__header {
      padding: 0;
      padding-bottom: 0;
      margin-right: 0;
      flex-shrink: 0;
  }
  .fp-body {
      width: 448px;
      height: 100%;
      display: flex;
      flex-direction: column;
      margin: 0 auto;
      .fp-content {
          height: calc(100% - 141px);
          overflow: auto;
          @include scroll();
          .fp-list {
              min-height: 100%;
              display: flex;
              flex-direction: column;
              .fp-list-box {
                  flex: 1;
                  width: 100%;
                  margin-bottom: 16px;
                  overflow-y: auto;

                  .checked {
                      background: #faf9f9;
                      &:not(:last-child) {
                          margin-bottom: 16px;
                      }
                  }
                  .noChecked {
                      &:not(:last-child) {
                          margin-bottom: 16px;
                      }
                  }

                  .list-address-item {
                      width: 100%;
                      min-height: 64px;
                      display: flex;
                      align-items: center;
                      border-radius: 8px;
                      padding: 8px 16px;
                      font-size: 14px;
                      font-weight: 600;
                      color: var(--primaryText);
                      cursor: pointer;
                      &.not-erc20 {
                          cursor: not-allowed;
                      }
                      & > img {
                          width: 24px;
                          height: 24px;
                      }
                      & > div {
                          flex: 1;
                          display: flex;
                          flex-direction: column;
                          justify-content: space-between;
                          padding: 0 8px;
                          .chain-type-name {
                              margin-top: 6px;
                              & > span {
                                  background: #d9d9d9;
                                  font-size: 12px;
                                  margin-left: 8px;
                                  border-radius: 4px;
                                  padding: 3px 8px;
                                  line-height: 1;
                              }
                          }
                          .curtom-name {
                              font-weight: 400;
                              font-size: 12px;
                          }
                      }
                      & > i {
                          font-size: 16px;
                          cursor: pointer;
                      }
                  }
              }
          }
      }
  }

  .fp-add {
      margin-top:20px;
      margin-bottom:10px;
      display: flex;
      font-size: 14px;
      align-items: center;
      color: #4069f2;
      cursor: pointer;
      & > i {
          color: #4069f2;
          margin-right: 8px;
      }
  }
  .fp-prompt {
      min-height: 30px;
      display: flex;
      .cirle {
          font-size: 32px;
          line-height: 20px;
      }
      p {
          text-indent: 10px;
          margin-left: -6px;
          word-break: keep-all;
          span {
              font-weight: 600;
              color: var(--primaryText);
          }
      }
  }
  .fp-btn {
      width: 100%;
      height: 48px;
      background: var(--primary);
      color: var(--contentColor);
      font-size: 17px;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      border-radius: 4px;
      margin-top: 12px;
      &:active {
          opacity: 0.85;
      }
  }
}
</style>
