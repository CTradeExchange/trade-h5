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
                                <el-select v-model='item.currency' clearable filterable :placeholder="$t('fundManager.ransom.tip1')">
                                    <el-option label='USDT' value='USDT' />
                                    <el-option label='USD' value='USD' />
                                    <el-option label='CNY' value='CNY' />
                                </el-select>
                            </div>
                            <div class='input'>
                                <el-input v-model='item.ratio' clearable :placeholder="$t('fundManager.ransom.tip2')">
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
                    <button v-if='list.length > 0' class='btn'>
                        {{ $t('compLang.confirm') }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'

// 下单执行标准数据
const list = ref([])

// 点击添加按钮
const onAdd = () => {
    list.value.push({
        currency: 'CNY',
        ratio: 20
    })
}
// 点击删除按钮
const onMinus = (index) => {
    list.value = list.value.filter((elem, i) => i !== index)
}
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
