<template>
    <div v-if='showPrivacy' class='privacy-module'>
        <p class='tip'>
            <span>
                我们使用 cookie 来增强您的体验、分析我们的流量以及用于安全和营销。访问我们的网站即表示您同意我们使用 cookie。
            </span>
            <a class='link' href='javascript:;' @click='openPrivacy'>
                阅读有关 cookie 的更多信息
            </a>
        </p>
        <div class='buttons'>
            <button class='btn state-1' @click='onAgree'>
                同意
            </button>
            <button class='btn state-2' @click='onClose'>
                关闭
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { localGet, localSet } from '@/utils/util.js'

// 是否显示隐私协议
const showPrivacy = ref(false)
if (!localGet('agreePrivacy')) showPrivacy.value = true

// 同意隐私协议
const onAgree = () => {
    localSet('agreePrivacy', true)
    showPrivacy.value = false
}
// 关闭隐私协议
const onClose = () => {
    showPrivacy.value = false
}
// 打开隐私协议页面
const openPrivacy = () => {
    window.open('https://www.vitatoken.com/site/privacy-policy')
}
</script>

<style lang='scss' scoped>
@import '@/sass/mixin.scss';
.privacy-module {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100px;
    background: var(--contentColor);
    box-shadow: 0 -5px 10px rgba(0,0,0,.1);
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 103;
    .tip {
        width: 700px;
        margin-right: 30px;
        font-size: 14px;
        color: var(--color);
        .link {
            text-decoration: underline;
            color: #F9B72B;
        }
    }
    .buttons {
        display: flex;
        .btn {
            line-height: 1;
            padding: 8px 20px;
            font-size: 12px;
            margin-right: 13px;
            border-radius: 4px;
            cursor: pointer;
            &:last-child {
                margin-right: 0;
            }
            &.state-1 {
                color: #fff;
                background: var(--primary);
            }
            &.state-2 {
                color: var(--primary);
                border: 1px solid var(--primary);
                background: #fff;
            }
            &:hover {
                opacity: .7;
            }
        }
    }
}
</style>
