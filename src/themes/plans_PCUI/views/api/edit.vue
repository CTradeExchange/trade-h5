<template>
    <router-view />
    <div class='wrapper'>
        <div class='page-title'>
            {{ $t('api.title') }}
        </div>
        <div class='api-create'>
            <!-- <div class='desc'>
                {{ $t('api.text1') }}
                <span>
                    <a class='a-link' @click='showApiHelp'>
                        {{ $t("api.linkTxt") }}
                    </a>
                </span>
            </div>
            <div class='min-tit'>
                {{ $t('api.editTitle4') }}
            </div>
            <div class='api-input'>
                <van-field v-model='query.tag' maxlength='20' :placeholder="$t('api.keyplaceholder')" />
            </div> -->
            <Loading :show='loading' />
            <div class='descEditTxt'>
                {{ $t("api.descEditTxt") }}
            </div>
            <div class='sub-title'>
                {{ $t("api.editTitle1") }}
            </div>
            <div class='api-input'>
                <van-field v-model='detailData.tag' max='20' :placeholder="$t('api.keyplaceholder')" />
            </div>
            <div class='sub-title'>
                {{ $t("api.editTitle2") }} <van-icon name='question-o' @click='showHelper' />
            </div>
            <van-checkbox-group v-model='query.purview' class='purview-set' direction='horizontal' inset>
                <van-checkbox v-for='(item,index) in detailData.permissionDTOList' :key='index' :disabled='item.canEdit != true' :name='item.code'>
                    {{ item.name }}
                </van-checkbox>
            </van-checkbox-group>

            <div class='sub-title'>
                {{ $t("api.editTitle3") }}
                <p class='sub-title-minor'>
                    {{ $t("api.editSubTit1") }}
                </p>
            </div>

            <div class='api-input'>
                <van-field
                    v-model='query.whiteIps'
                    autosize
                    :placeholder="$t('api.keyplaceholder2')"
                    rows='2'
                    type='textarea'
                />
            </div>

            <van-button block class='confirm-btn' type='primary' @click='handleSave'>
                <span>{{ $t('compLang.confirm') }}</span>
            </van-button>
        </div>
    </div>
</template>

<script>
import { computed, toRefs, reactive, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Toast, Dialog } from 'vant'
import { createCustomerApiDetail, editCustomerApiSave, checkKycApply } from '@/api/user'

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
            query: {
                purview: [],
                tag: '',
                id: '',
                whiteIps: ''
            },
            detailData: {},
            oldDetailData: {},
            helpPopupShow: false
        })

        // console.log(store.state)
        // 获取账户信息
        const customInfo = computed(() => store.state._user.customerInfo)
        const companyId = computed(() => customInfo.value.companyId)
        const inviteVis = computed(() => {
            return (location.href.includes('uat') && companyId.value === 1) || (location.href.includes('pre') && companyId.value === 360) || (companyId.value === 11)
        })

        // 初始获取详情
        const initData = () => {
            const id = route.query.id
            state.query.id = id
            state.loading = true
            createCustomerApiDetail({ id }).then(res => {
                state.loading = false
                if (Number(res.code) === 0) {
                    console.log(res)
                    state.detailData = res.data
                    state.oldDetailData = res.data
                    const perArr = []
                    res.data.permissionDTOList.map((item, index) => {
                        if (Number(item.status) === 1) {
                            perArr.push(item.code)
                        }
                        state.query.purview = perArr
                    })
                    state.query.whiteIps = res.data.whiteIps
                } else {
                    Toast(res.msg)
                }
            }).catch(err => {
                state.loading = false
            })
        }

        // 保存编辑
        const handleSave = () => {
            // state.loading = true
            const { id, whiteIps, purview } = state.query
            const { tag } = state.detailData
            const _premArr = []

            state.detailData.permissionDTOList.map((item, index) => {
                _premArr.push({
                    ...item,
                    status: purview.includes(item.code) ? 1 : 2
                })
            })

            var permArr = [] // 比对旧数据权限列表，只把变更的提交
            state.oldDetailData.permissionDTOList.map((it, i) => {
                _premArr.map((item, index) => {
                    if (item.code !== 'ready_only') {
                        if (it.code === item.code) {
                            if (it.status !== item.status) {
                                permArr.push({
                                    code: item.code,
                                    status: item.status
                                })
                            }
                        }
                    }
                })
            })

            const params = {
                id: id,
                tag: tag,
                whiteIps: whiteIps,
                permissionList: permArr
            }
            console.log(params)

            editCustomerApiSave(params).then(res => {
                state.loading = false
                if (Number(res.code) === 0) {
                    console.log(res)
                    Toast(t('api.editSuccess'))
                    setTimeout(() => {
                        router.back()
                    }, 1500)
                } else {
                    Toast(res.msg)
                }
            }).catch(err => {
                state.loading = false
            })
        }

        const showHelper = () => {
            state.helpPopupShow = true
        }

        // 查询KYC验证
        const checkKycApplyFn = () => {
            state.loading = true
            checkKycApply({ businessCode: 'API', openAccountType: customInfo.value.openAccountType }).then(res => {
                state.loading = false
                const status = Number(res.data)
                if (status === 2) {
                    // router.push({
                    //     path: '/apiManage/create'
                    // })
                    console.log('KYC验证OK')
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
        const goBack = (id) => {
            console.log(id)
            router.back()
        }

        const showApiHelp = () => {
            state.helpPopupShow = true
        }

        onMounted(() => {
            initData()
        })

        return {
            initData,
            handleSave,
            showHelper,
            checkKycApplyFn,
            showApiHelp,
            goBack,
            inviteVis,
            ...toRefs(state)
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.wrapper{
    width: 1200px;
    margin: 40px auto;
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
            .item-right{

            }
        }
    }
}
</style>
