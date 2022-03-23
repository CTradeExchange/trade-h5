<template>
    <el-popover
        placement='bottom'
        trigger='hover'
        :width='152'
    >
        <template #reference>
            <i class='icon icon_xiazai' :title="$t('header.download')"></i>
        </template>
        <div class='download-dialog'>
            <!-- <img src='@planspc/images/home/download-code.png' /> -->
            <div ref='qrCode' class='qrcode'></div>
            <p>{{ $t('header.downloadTip') }}</p>
        </div>
    </el-popover>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { localGet } from '@/utils/util.js'
import QRCode from 'qrcodejs2'

// 二维码对象
const qrCode = ref(null)

// 创建二维码
const creatQrCode = () => {
    setTimeout(() => {
        qrCode.value.innerHTML = ''
        new QRCode(qrCode.value, {
            text: 'https://play.google.com/store/apps/details?id=uni.UNI8B7D0E0',
            width: 88,
            height: 88,
            colorDark: localGet('invertColor') === 'light' ? '#000000' : '#ffffff',
            colorLight: localGet('invertColor') === 'light' ? '#ffffff' : '#000000',
            correctLevel: QRCode.CorrectLevel.H
        })
    }, 100)
}

onMounted(() => {
    // 创建二维码
    creatQrCode()
})
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.icon {
    font-size: 20px;
    color: #D6DAE1;
    cursor: pointer;
}
.download-dialog {
    display: flex;
    flex-direction: column;
    align-items: center;
    img, .qrcode {
        width: 88px;
        height: 88px;
        margin-top: 5px;
    }
    p {
        width: 92px;
        text-align: center;
        line-height: 20px;
        margin-top: 10px;
        font-size: 14px;
        color: var(--color);
        word-break: break-word;
        overflow-wrap: break-word;
    }
}
</style>
