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
            <img src='@planspc/images/home/download-code.png' />
            <p>{{ $t('header.downloadTip') }}</p>
        </div>
    </el-popover>
</template>

<script>
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
    img {
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
    }
}
</style>
