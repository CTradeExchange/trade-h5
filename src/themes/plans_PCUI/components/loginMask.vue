<template>
    <div v-if='!$store.state._user.customerInfo' class='loginMask'>
        <div>
            <router-link to='/register'>
                <van-button class='registerBtn' type='primary'>
                    {{ $t('c.register') }}
                </van-button>
            </router-link>
        </div>
        <p>or</p>
        <div>
            <router-link to='/login'>
                {{ $t('c.login') }}
            </router-link>
        </div>
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
.loginMask{
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 100%;
    background: rgb(7, 15, 21, .5);
    color: var(--contentColor);
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    line-height: 2;
    a{
        color: var(--contentColor);
    }
    .registerBtn{
        border-radius: 5px;
        height: 40px;
        width: 140px;
    }
}
</style>
