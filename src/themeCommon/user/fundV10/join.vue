<template>
    <div class='joinWrapper'>
        <div class='banner'></div>
        联系TG
    </div>
</template>

<script>
export default {
    setup () {
        return {}
    }
}
</script>

<style lang="scss" scoped>
.joinWrapper{
    min-height: calc(100vh - 444px);
}
.banner{
    width: 100%;
    height: 400px;
    background: url('/images/V10/pc/Why-VITATOKEN.jpg') no-repeat center;
    // 适配移动端
    @media screen and (max-width: 768px){
        height: 64vw;
        background-image: url('/images/V10/h5/Why-VITATOKEN.jpg');
        background-size: cover;
    }
}
</style>
