<template>
    <router-view />

    <div class='wrapper'>
        <div class='page-title'>
            {{ $t('api.title') }}
        </div>
        <div class='api-create'>
            <div class='desc'>
                {{ $t('api.text1') }}
                <!-- <span>
                    <a class='a-link' @click='showApiHelp'>
                        {{ $t("api.linkTxt") }}
                    </a>
                </span> -->
            </div>
            <div class='min-tit'>
                {{ $t('api.editTitle4') }}
            </div>
            <div class='api-input'>
                <van-field v-model='query.tag' maxlength='20' :placeholder="$t('api.keyplaceholder')" />
            </div>
            <van-button block class='confirm-btn' type='primary' @click='handleCreate'>
                <span>{{ $t('compLang.confirm') }}</span>
            </van-button>
        </div>

        <div class='sub-title'>
            {{ $t('api.listTitle') }}
            <!-- <van-icon name='replay' @click='getAPIList' /> -->
        </div>

        <div class='list'>
            <Loading :show='loading' />
            <div class='listScroll'>
                <van-collapse v-if='apiList.length > 0' v-model='activeIndex' accordion @change='collapseChange'>
                    <van-collapse-item v-for='(item, i) in apiList' :key='i' class='item' :name='item.id'>
                        <template #title>
                            <van-row gutter='10'>
                                <van-col span='8'>
                                    <h6>{{ item.tag }}</h6>
                                </van-col>
                                <van-col span='12'>
                                    <p>{{ item.timeleft }}</p>
                                </van-col>
                                <van-col align='right' class='operaRight' span='4'>
                                    <span @click='goDetails(item.id)'>
                                        {{ $t('compLang.edit') }}
                                    </span>
                                    <span @click='handleDelete(item.id)'>
                                        {{ $t('compLang.delete') }}
                                    </span>
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
                                <van-col class='item-left' span='12'>
                                    <div class='txtWrap'>
                                        {{ item.apiKey }}
                                    </div>
                                    <van-icon class='copy-btn' :data-clipboard-text='item.apiKey' name='description' :title="$t('compLang.copy')" @click='copyCustomerNo' />
                                    <!-- <i class='icon_fuzhi copy-btn' :data-clipboard-text='item.apiKey' @click='copyCustomerNo'></i> -->
                                </van-col>
                                <van-col class='item-right' span='12'>
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
                                        {{ it.name }}
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
    </div>
</template>

<script>
import { computed, toRefs, reactive, onMounted, ref, provide } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Toast, Dialog } from 'vant'
import { getCustomerApiList, checkKycApply, delCustomerApi, createCustomerApiDetail } from '@/api/user'
import Clipboard from 'clipboard'

export default {
    components: {

    },

    setup () {
        const router = useRouter()
        const route = useRoute()
        const store = useStore()
        const { t } = useI18n({ useScope: 'global' })
        const { type } = route.query
        const state = reactive({
            loading: false,
            showApiHelp: false,
            query: {
                tag: ''
            },
            apiList: [],
            isReLoad: false
        })

        provide('isReLoad', (value) => {
            state.isReLoad = value
            if (value === true) {
                getAPIList()
            }
        })

        const routeName = computed(() => {
            if (Number(type) === 1) {
                return 'loan'
            } else if (Number(type) === 3) {
                return 'returnMoney'
            } else {
                return 'deposit'
            }
        })

        const accountList = computed(() => store.state._user.customerInfo.accountList.filter(el => Number(el.tradeType) === Number(state.tradeType)))
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

        // 跳转到编辑页
        const goDetails = (id) => {
            console.log(id)
            router.push({
                path: '/apiEdit',
                query: {
                    id: id
                }
            })
        }

        const showApiHelp = () => {
            state.helpPopupShow = true
        }

        const isReLoad = () => {
            console.log('isReLoad()')
            getAPIList()
        }

        const handleCreate = (id) => {
            if (state.query.tag) {
                // updatePopupVis(true)
                const regEn = /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im
                const regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im
                if (regEn.test(state.query.tag) || regCn.test(state.query.tag)) {
                    Toast(t('api.notSpecial'))
                    return false
                }
            } else {
                Toast(t('api.keyplaceholder'))
                return false
            }

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

        // 查询KYC验证
        const checkKycApplyFn = () => {
            state.loading = true
            checkKycApply({ businessCode: 'API', openAccountType: customInfo.value.openAccountType }).then(res => {
                state.loading = false
                const status = Number(res.data)
                if (status === 2) {
                    console.log(state.query)
                    handRoutTo('/googleSecurityCheck/index', state.query.tag)
                } else {
                    Dialog.alert({
                        title: t('common.tip'),
                        showCancelButton: true,
                        confirmButtonText: status === 1 ? t('common.goLook') : t('login.goAuthenticate'),
                        message: status === 1 ? t('deposit.KYCReviewing') : t('deposit.needKYC'),
                    }).then(() => {
                        handRoutTo('/authentication')
                    })
                }
            }).catch(err => {
                state.loading = false
            })
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

        const handleDelete = (id) => {
            Dialog.confirm({
                title: t('tip'),
                message:
                    t('api.deleteConfirm'),
            }).then(() => {
                delCustomerApi({ id }).then(res => {
                    state.loading = false
                    if (Number(res.code) === 0) {
                        Toast(t('api.deleteSuccess'))
                        setTimeout(() => {
                            getAPIList()
                        }, 1500)
                    } else {
                        Toast(res.msg)
                    }
                }).catch(err => {
                    state.loading = false
                })
            }).catch(() => {
            // on cancel
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

        const handRoutTo = (path, tag) => router.push({
            path: route.path + path,
            query: {
                tag: tag || '',
                originPage: 'apiList'
            }
        })

        onMounted(() => {
            getAPIList()
        })

        return {
            handRoutTo,
            collapseChange,
            showApiHelp,
            activeIndex,
            handleCreate,
            handleDelete,
            goDetails,
            checkKycApplyFn,
            getAPIList,
            isReLoad,
            inviteVis,
            copyCustomerNo,
            accountList,
            type,
            routeName,
            ...toRefs(state)
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.wrapper{
    width: 1200px;
    margin: 20px auto;
    .page-title{
        font-size: 32px;
        font-weight: bold;
    }
    .api-create{
        width: 460px;
        margin: 40px auto;
        .desc{
            color: var(--minorColor);
            font-size: 14px;
            line-height: 24px;
            margin-bottom: 20px;
            a{
                color: var(--riseColor);
            }
        }
        .min-tit{
            font-size: 18px;
        }
        .api-input{
            margin: 20px 0;
        }
    }

    .sub-title{
        font-size: 24px;
    }

    .list{
        background-color: var(--contentColor);
        border: 1px solid #dedede;
        margin-top: 15px;

        :deep(.van-cell__right-icon){
            font-size: rem(50px);
            margin-top: 5px;
        }

        .operaRight{
            span{
                display: inline-block;
                margin: 0px 15px 0 15px;
                font-size: 14px;
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
            .copy-btn{
                font-size: 18px;
                margin-left: 10px;
                cursor: pointer;
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
            .whiteIps{
                white-space: normal;
                word-break: break-all;
                word-wrap: break-word;
            }
        }
    }
}
</style>
