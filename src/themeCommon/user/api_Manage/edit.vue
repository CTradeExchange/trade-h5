// api编辑详情
<template>
    <div class='page-wrap'>
        <LayoutTop :back='true' />
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

        <div class='bottom-btn'>
            <van-row gutter='10'>
                <van-col span='12'>
                    <van-button block plain type='primary' @click='handleDelete'>
                        {{ $t('compLang.delete') }}
                    </van-button>
                </van-col>
                <van-col span='12'>
                    <van-button block type='primary' @click='handleSave'>
                        {{ $t('save') }}
                    </van-button>
                </van-col>
            </van-row>
        </div>

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
                    {{ $t('api.editTitle2') }}
                </div>
                <i class='icon_guanbi' @click='helpPopupShow = false'></i>
            </div>
            <div class='page-wrap' v-html="$t('api.editHelpTxt')">
            </div>
        </van-popup>
    </div>
</template>

<script>
// import { computed } from 'vue'
import { computed, reactive, toRefs, onBeforeMount, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { isEmpty, localGet, localSet } from '@/utils/util'
import Clipboard from 'clipboard'
import { Toast, Dialog } from 'vant'
import { createCustomerApiDetail, delCustomerApi, editCustomerApiSave } from '@/api/user'

export default {
    // components: { },
    setup (props, context) {
        const router = useRouter()
        const route = useRoute()
        const { t } = useI18n({ useScope: 'global' })
        const store = useStore()
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

        const handleCreate = () => {
            state.verifyShow = true
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

        const handleDelete = () => {
            console.log('handleDelete')
            const id = state.query.id
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
                            router.back()
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

        const showHelper = () => {
            state.helpPopupShow = true
        }

        const back = () => {
            return router.replace('/mine')
        }

        onMounted(() => {
            initData()
        })

        return {
            initData,
            handleCreate,
            handleSave,
            handleDelete,
            showHelper,
            back,
            inviteVis,
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
    background-color: var(--contentColor);
    overflow: auto;

    :deep(.topNav .main) {
        max-width: 100%;
    }
    .bigIcon {
        padding-top: rem(30px);
    }
    .descEditTxt {
        padding: rem(20px);
        color: var(--warn);
        font-size: rem(28px);
        text-align: left;
    }
    .sub-title {
        font-size: rem(32px);
        padding: 0 rem(28px) rem(15px) rem(28px);
        color: var(--color);
    }
    .sub-title-minor{
        font-size: rem(24px);
        color: var(--minorColor);
    }

    .bottom-btn{
        padding: rem(20px);
    }
    .api-input{
        margin: rem(20px);
        .van-field{
            border: rem(1px) solid #dedede;
            border-radius: rem(8px);
        }
    }
    .purview-set{
        margin: rem(20px);
    }
    .van-checkbox{
        border: rem(1px) solid var(--minorColor);
        padding: rem(10px) rem(30px);
        border-radius: rem(6px);
        margin-bottom: rem(30px);

        :deep(.van-checkbox__label){
            display:inline-block;
            min-width: rem(140px);
            text-align: center;
            font-size: rem(24px);
        }

        :deep(.van-icon) {
            display: none;
        }
        :deep(.van-checkbox__label){margin-left:0}

        &[aria-checked="true"]{
            border: rem(1px) solid var(--primary);
            :deep(.van-checkbox__label){
                color: var(--primary);
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
