<template>
    <router-view />
    <div class='page-wrap'>
        <h3>企业认证</h3>
        <div v-if='kycList.length === 0' class='empty-data'>
            <van-empty :description='$t("auth.noRequired")' image='/images/empty.png' />
        </div>
        <div v-for='(item,index) in kycList' v-else :key='index' class='kyc-list'>
            <p>{{ kycMap[item.levelCode] }}</p>
            <el-button
                :disabled='[1,2].includes(item.status)'
                size='default'
                type='primary'
                @click='handleNext(item)'
            >
                {{ kycAuditStatus[item.status] }}
            </el-button>
        </div>
    </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { upload, getListByParentCode } from '@/api/base'
import { useI18n } from 'vue-i18n'
import { findAllLevelKyc, kycLevelApply, kycApply, findAllBizKycList } from '@/api/user'

const router = useRouter()
const store = useStore()
const { t, tm } = useI18n({ useScope: 'global' })
const kycList = ref([])

const kycMap = {
    level_1: t('common.kycLevel1'),
    level_2: t('common.kycLevel2'),
    level_3: t('common.kycLevel3'),
}
const kycAuditStatus = tm('kycAuditStatus')

const handleNext = (item) => {
    if (Number(item.status) === 0 || Number(item.status) === 3) {
        router.push({
            path: '/businessKYC/index',
            query: {
                levelCode: item.levelCode
            }
        })
    }
}

// 获取需要认证的kyc列表
store.dispatch('_user/findAllBizKycList', { openAccountType: 1 }).then(res => {
    if (res.check()) {
        kycList.value = res.data
    }
})

</script>

<style lang="scss" scoped>
.page-wrap {
    width: 1200px;
    height: 100%;
    margin: rem(100px) auto;
    padding: rem(100px);
    background: var(--contentColor);
    border-radius: rem(10px);
    h3 {
        margin-bottom: rem(100px);
        line-height: rem(100px);
        //background: var(--bgColor);
    }
    .kyc-list {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-bottom: rem(20px);
        border-bottom: solid 1px var(--lineColor);
    }
}
</style>
