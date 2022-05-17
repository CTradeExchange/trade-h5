// API管理列表页
<template>
    <div class='page-wrap'>
        <LayoutTop :back='true' />
        <Loading :show='loading' />
        <div class='descTxt'>
            {{ $t("api.text1") }}
            <!-- <span>
                <a class='a-link' href='https://www.baidu.com' target='_blank'>
                    {{ $t("api.linkTxt") }}
                </a>
            </span> -->
        </div>
        <div class='sub-title'>
            {{ $t("api.subtitle") }}
            <!-- <span class='reloadList' @click='getAPIList'>
                <van-icon name='replay' />
            </span> -->
        </div>
        <div class='list'>
            <div class='listScroll'>
                <van-collapse v-if='apiList.length > 0' v-model='activeIndex' accordion @change='collapseChange'>
                    <van-collapse-item v-for='(item, i) in apiList' :key='i' class='item' :name='item.id'>
                        <template #title>
                            <van-row gutter='10'>
                                <van-col span='18'>
                                    <h6>{{ item.tag }}</h6>
                                    <p>{{ item.timeleft }}</p>
                                </van-col>
                                <van-col align='right' class='operaRight' span='6'>
                                    <van-icon name='edit' @click='goDetails(item.id)' />
                                </van-col>
                            </van-row>
                        </template>

                        <div class='itemBox'>
                            <van-row>
                                <van-col class='item-left' span='12'>
                                    {{ $t('api.createSubTit1') }}
                                </van-col>
                                <van-col class='item-right' span='12'>
                                    {{ $t('api.createSubTit6') }}
                                </van-col>
                            </van-row>
                            <van-row>
                                <van-col class='item-left' span='18'>
                                    <div class='txtWrap'>
                                        {{ item.apiKey }}
                                    </div>
                                    <i class='icon_fuzhi copy-btn' :data-clipboard-text='item.apiKey' @click='copyCustomerNo'></i>
                                </van-col>
                                <van-col class='item-right' span='6'>
                                    {{ item.createTime }}
                                </van-col>
                            </van-row>
                            <van-row>
                                <van-col class='item-left' span='12'>
                                    {{ $t('api.createSubTit3') }}
                                </van-col>
                                <van-col class='item-right' span='12'>
                                    {{ $t('api.createSubTit4') }}
                                </van-col>
                            </van-row>
                            <van-row>
                                <van-col class='item-left tags' span='12'>
                                    <span v-for='(it,a) in item.permissionDTOList' :key='a' class='perItem'>
                                        <span v-if='it.status === 1'>
                                            {{ it.name }}
                                        </span>
                                    </span>
                                </van-col>
                                <van-col class='item-right' span='12'>
                                    <div class='whiteIps'>
                                        {{ item.whiteIps }}
                                    </div>
                                </van-col>
                            </van-row>
                        </div>
                    </van-collapse-item>
                </van-collapse>
            </div>
            <van-empty
                v-if='apiList.length === 0'
                :description="$t('api.listnone')"
                image='/images/empty.png'
            />
        </div>

        <van-button block class='confirm-btn' type='primary' @click='handleCreate'>
            <span>{{ $t('api.createBtn') }}</span>
        </van-button>

        <van-dialog v-model:show='toastShow'>
            {{ toastMsg }}
        </van-dialog>

        <van-popup
            v-model:show='helpPopupShow'
            class='custom-dialog'
            :duration='0.2'
            position='bottom'
            round
            :transition-appear='true'
        >
            <div class='header'>
                <div class='header-title'>
                    {{ $t('api.linkTxt') }}
                </div>
                <i class='icon_guanbi' @click='helpPopupShow = false'></i>
            </div>
            <div class='page-wrap' v-html="$t('api.listApiHelp')">
            </div>
        </van-popup>
    </div>
</template>

<script>
import { computed, reactive, toRefs, onBeforeMount, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import Clipboard from 'clipboard'
import { Toast, Dialog } from 'vant'
import { getCustomerApiList, checkKycApply, createCustomerApiDetail } from '@/api/user'
import { isEmpty, priceFormat } from '@/utils/util'

export default {
    components: {

    },
    setup (props, context) {
        const router = useRouter()
        const { t } = useI18n({ useScope: 'global' })
        const store = useStore()
        const state = reactive({
            helpPopupShow: false,
            verifyShow: false,
            apiList: [],
            loading: false,
            colorShow: false,
            toastShow: false,
            toastMsg: ''
        })
        const activeIndex = ref()
        // console.log(store.state)
        // 获取账户信息
        const customInfo = computed(() => store.state._user.customerInfo)
        const companyId = computed(() => customInfo.value.companyId)
        const inviteVis = computed(() => {
            return (location.href.includes('uat') && companyId.value === 1) || (location.href.includes('pre') && companyId.value === 360) || (companyId.value === 11)
        })

        const getAPIList = () => {
            state.loading = true
            const params = {
                size: 30,
                current: 1
            }
            // console.log(window.dayjs(new Date(1652258165624)).format('YYYY-MM-DD'))
            getCustomerApiList(params).then(res => {
                state.loading = false
                console.log(res)
                if (Number(res.code) === 0) {
                    const tempArr = []
                    res.data.records.filter(item => {
                        const _timeLeft = window.dayjs(new Date(item.expiredTime)).diff(new Date(item.createTime), 'day')
                        var whiteIpsStr = ''
                        if (item.whiteIps === null) {
                            whiteIpsStr = '--'
                        } else {
                            const whiteIpsArr = item.whiteIps.split(',')
                            if (whiteIpsArr.length > 3) {
                                whiteIpsStr = item.whiteIps.split(',')[0] + ',' + item.whiteIps.split(',')[1] + ',' + item.whiteIps.split(',')[2] + '...'
                            } else {
                                whiteIpsStr = item.whiteIps
                            }
                        }

                        tempArr.push({
                            id: item.id,
                            apiKey: item.apiKey,
                            pubKey: item.pubKey,
                            permissionDTOList: item.permissionDTOList,
                            whiteIps: whiteIpsStr,
                            createTime: window.dayjs(new Date(item.createTime)).format('YYYY-MM-DD HH:mm:ss'),
                            tag: item.tag,
                            timeleft: _timeLeft > 0 ? t('api.timeleft') + _timeLeft + t('api.timeleftCell') : t('api.timeleftCell2')
                        })
                    })
                    state.apiList = tempArr
                } else {
                    Toast(res.msg)
                }
            }).catch(err => {
                state.loading = false
            })
        }

        // 查询KYC验证
        const checkKycApplyFn = () => {
            state.loading = true
            checkKycApply({ businessCode: 'API', openAccountType: customInfo.value.openAccountType }).then(res => {
                state.loading = false
                const status = Number(res.data)
                if (status === 2) {
                    router.push({
                        path: '/apiManage/create'
                    })
                } else {
                    Dialog.alert({
                        title: t('common.tip'),
                        showCancelButton: true,
                        confirmButtonText: status === 1 ? t('common.goLook') : t('login.goAuthenticate'),
                        message: status === 1 ? t('deposit.KYCReviewing') : t('deposit.needKYC'),
                    }).then(() => {
                        router.replace({
                            name: 'Authentication'
                        })
                    })
                }
            }).catch(err => {
                state.loading = false
            })
        }

        // 跳转到编辑页
        const goDetails = (id) => {
            console.log(id)
            router.push({
                path: '/apiManage/edit',
                query: {
                    id: id
                }
            })
        }

        const showApiHelp = () => {
            state.helpPopupShow = true
        }

        const handleCreate = (id) => {
            // console.log(customInfo)
            if (Number(customInfo.value.googleId) > 0) {
                checkKycApplyFn()
            } else {
                Dialog.alert({
                    title: t('common.tip'),
                    showCancelButton: true,
                    confirmButtonText: t('api.mfaGoset'),
                    message: t('api.mfaTips'),
                }).then(() => {
                    router.replace({
                        name: 'MFA_status'
                    })
                })
            }
        }

        // 复制
        const copyCustomerNo = (value) => {
            var clipboard = new Clipboard('.copy-btn')
            clipboard.on('success', e => {
                Toast(t('common.copySuccess'))
                // 释放内存
                clipboard.destroy()
            })
        }

        const collapseChange = (index) => {
            if (!index) {
                return false
            }
            state.loading = true
            const params = {
                id: index
            }
            state.apiList.map((item, index) => {
                if (Number(item.id) === params.id) {
                    if (item.permissionDTOList === null) {
                        createCustomerApiDetail(params).then(res => {
                            state.loading = false
                            if (Number(res.code) === 0) {
                                // console.log(res)
                                var apiArr = []
                                state.apiList.map((item, index) => {
                                    if (Number(item.id) === params.id) {
                                        apiArr.push({
                                        ...item,
                                        permissionDTOList: res.data.permissionDTOList
                                        })
                                    } else {
                                        apiArr.push({
                                        ...item
                                        })
                                    }
                                })
                                state.apiList = apiArr
                                // console.log(apiArr)
                            } else {
                                Toast(res.msg)
                            }
                        }).catch(err => {
                            state.loading = false
                        })
                    }
                } else {
                    state.loading = false
                }
            })
        }

        const back = () => {
            return router.replace('/mine')
        }

        onBeforeMount(() => {
            getAPIList()
        })

        return {
            collapseChange,
            showApiHelp,
            activeIndex,
            handleCreate,
            goDetails,
            checkKycApplyFn,
            back,
            getAPIList,
            inviteVis,
            copyCustomerNo,
            ...toRefs(state)
        }
    },
}
</script>

<style lang="scss" scoped>
.page-wrap {
    width: 100%;
    height: 100%;
    margin-top: rem(110px);
    overflow: auto;
    background: var(--contentColor);

    :deep(.topNav .main) {
        max-width: 100%;
    }
    .bigIcon {
        padding-top: rem(30px);
    }
    .descTxt {
        padding: rem(20px);
        color: var(--minorColor);
        font-size: rem(28px);
        text-align: left;
    }
    .a-link{
        color: var(--primary);
    }
    .sub-title {
        font-size: rem(42px);
        padding: rem(28px);
    }

    .confirm-btn {
        position: fixed;
        bottom: rem(0px);
        height: rem(90px);
        background: var(--primary);
        border-color: var(--primary);
        span {
            color: var(--contentColor);
            font-size: rem(32px);
        }
    }
    .reloadList{
        font-size: rem(24px);
        color: var(--primary);
        margin-left: rem(20px);
    }
    .list{
        padding:0 rem(0px) rem(140px)rem(0px);

        :deep(.van-cell__right-icon){
            font-size: rem(50px);
            margin-top: rem(25px);
        }

        .operaRight{
            .van-icon{
                font-size: rem(50px);
                margin: rem(12px) rem(15px) 0 rem(15px);
            }
        }
        .item{
            font-size: rem(28px);
            color: var(--minorColor);
            margin-bottom: rem(0px);

            .van-row{
                padding:rem(10px) 0;
            }
            h6{
                font-size: rem(32px);
                font-weight: normal;
                margin-bottom: rem(0px);
                color: var(--color);
            }
            p{
                color: var(--minorColor);
            }
            .tags{
                span{
                    padding: 0 rem(5px);
                    display: inline-block;
                    background-color: var(--quoteFallBg);
                    margin-right: rem(10px);
                    margin-bottom: rem(8px);
                    font-size: rem(24px);
                }
            }

            .txtWrap{
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                width: auto;
                max-width: 70%;
                display: inline-block;
                vertical-align: middle;
            }
            .item-right{
                text-align:right;
            }
            .whiteIps{
                white-space: normal;
                word-break: break-all;
                word-wrap: break-word;
            }
        }
    }
}
</style>

<style lang="scss">
@import '@/sass/mixin.scss';
.custom-dialog{
    display: flex;
    flex-direction: column;
    max-height: 85%;
    overflow: hidden;
    background: var(--bgColor);
    .header{
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: rem(37px) rem(30px) rem(50px);
        .header-title{
            font-size: rem(48px);
            font-weight: bold;
            color: var(--color);
        }
        .icon_guanbi{
            font-size: rem(30px);
            font-weight: bold;
        }
    }
    .page-wrap {
        margin-top:0;
        padding-top: 0;
        padding: rem(20px);
        font-size: rem(28px);
        color: var(--normalColor);
        line-height: rem(42px);
        overflow: auto;
    }
}
</style>
