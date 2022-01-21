<template>
    <div class='module-content'>
        <div class='body-case'>
            <div class='standard-config'>
                <div v-if='list.length === 0' class='empty'>
                    <img src='/images/empty.png' />
                    <p class='tip'>
                        {{ $t('fundManager.ransom.tip3') }}
                    </p>
                </div>
                <template v-else>
                    <div class='header'>
                        <span class='title-1'>
                            {{ $t('fundManager.ransom.title3') }}：
                        </span>
                        <span class='title-2'>
                            {{ $t('fundManager.ransom.title4') }}：
                        </span>
                    </div>
                    <div class='list'>
                        <div v-for='(item, index) in list' :key='index' class='item'>
                            <div class='select'>
                                <el-select v-model='item.currency' clearable filterable :placeholder="$t('fundManager.ransom.tip1')" @change='changeProduct($event, item)'>
                                    <el-option
                                        v-for='product in productList'
                                        :key='product.symbolId'
                                        :disabled='selectIds.includes(Number(product.symbolId))'
                                        :label='product.symbolName'
                                        :value='product.symbolId'
                                    />
                                </el-select>
                            </div>
                            <div class='input'>
                                <el-input v-model='item.ratio' clearable :placeholder="$t('fundManager.ransom.tip2')" type='number' @input='inputRatio(item)'>
                                    <template #suffix>
                                        <span>%</span>
                                    </template>
                                </el-input>
                            </div>
                            <div class='minus' @click='onMinus(index)'>
                                <van-icon name='minus' />
                            </div>
                        </div>
                    </div>
                </template>
                <div class='handle'>
                    <button class='btn' @click='onAdd'>
                        {{ $t('compLang.add') }}
                    </button>
                    <button v-if='list.length > 0' v-loading='isSubmit' class='btn' @click='onConfirm'>
                        {{ $t('compLang.confirm') }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
// api
import { getOrderStandard, saveOrderStandard } from '@/api/fund'
import { Toast } from 'vant'
import { onMounted, ref, unref, computed } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { isEmpty } from '@/utils/util'
import { getDecimalNum, retainDecimal } from '@/utils/calculation'

const store = useStore()
const { t } = useI18n({ useScope: 'global' })

// 用户信息
const customerInfo = unref(computed(() => store.state._user.customerInfo))
// 是否提交中
const isSubmit = ref(false)
// 玩货玩法产品列表数据
const productList = ref([])
// 当前选择的产品id集合
const selectIds = ref([])
// 下单执行标准数据
const list = ref([])

// 获取现货玩法产品列表数据
const getProductList = () => {
    const arr = []
    const list = store.state._quote.productList
    list.map(elem => {
        if (Number(elem.tradeType) === 5) {
            arr.push(elem)
        }
    })
    productList.value = arr
}
// 获取下单执行标准
const queryOrderStandard = () => {
    getOrderStandard({
        companyId: customerInfo.companyId,
        customerNo: customerInfo.customerNo,
        customerGroupId: customerInfo.customerGroupId
    }).then(res => {

    })
}
// 修改选择的产品
const changeProduct = (value, item) => {
    selectIds.value = selectIds.value.filter(id => id !== Number(item.symbolId))
    if (value) {
        item.symbolId = Number(value)
        selectIds.value.push(Number(value))
    } else {
        item.symbolId = ''
    }
}
// 输入下单比例
const inputRatio = (item) => {
    if (getDecimalNum(item.ratio) > 4) {
        item.ratio = retainDecimal(item.ratio, 4)
    }
}
// 点击添加按钮
const onAdd = () => {
    list.value.push({
        currency: '',
        ratio: ''
    })
}
// 点击删除按钮
const onMinus = (index) => {
    list.value = list.value.filter((elem, i) => i !== index)
}
// 点击确定按钮
const onConfirm = () => {
    let totalRatio = 0
    for (let i = 0; i < list.value.length; i++) {
        const item = list.value[i]
        totalRatio += Number(item.ratio)
        if (isEmpty(item.currency)) {
            return Toast(t('fundManager.ransom.tip1'))
        }
        if (isEmpty(item.ratio)) {
            return Toast(t('fundManager.ransom.tip2'))
        }
    }
    if (totalRatio > 100) {
        return Toast(t('fundManager.ransom.tip5'))
    }

    isSubmit.value = true
    saveOrderStandard({
        configDtoList: []
    }).then(res => {
        isSubmit.value = false
        if (res.check()) {
            Toast(t('handle.handleSuccess'))
        }
    })
}

onMounted(() => {
    // 获取下单执行标准
    queryOrderStandard()
    // 获取现货玩法产品列表数据
    getProductList()
})
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
@import '../index.scss';
.module-content {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: hidden;
    position: relative;
}
.body-case {
    flex: 1;
    padding: 30px;
    background: var(--contentColor);
    border-radius: 10px;
}
.standard-config {
    display: inline-block;
    margin-left: 50px;
    .empty {
        display: flex;
        flex-direction: column;
        align-items: center;
        img {
            width: 160px;
            height: 160px;
        }
    }
    .header {
        display: flex;
        .title-1 {
            width: 200px;
            margin-right: 15px;
        }
        .title-2 {
            width: 160px;
        }
    }
    .list {
        .item {
            display: flex;
            align-items: center;
            margin-bottom: 10px;
            .select {
                width: 200px;
                margin-right: 15px;
            }
            .input {
                width: 160px;
                margin-right: 15px;
            }
            .minus {
                display: inline-flex;
                justify-content: center;
                align-items: center;
                width: 22px;
                height: 22px;
                background: var(--primary);
                border-radius: 50%;
                cursor: pointer;
                &:deep(.van-icon) {
                    margin-top: -3px;
                    color: #fff;
                }
                &:hover {
                    opacity: .9;
                }
            }
        }
    }
    .handle {
        display: flex;
        justify-content: center;
        margin-top: 20px;
        .btn {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 160px;
            height: 40px;
            margin: 0 10px;
            color: #fff;
            background: var(--primary);
            border-radius: 20px;
            cursor: pointer;
            &:hover {
                opacity: .9;
            }
        }
    }
}
</style>
