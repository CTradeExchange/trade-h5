<template>
    <div class='register'>
        <Top back :menu='false' />
        <a class='loginBtn' href='javascript:;' @click="$router.replace('/login')">已有账号</a>
        <div class='banner'>
            <img alt='' src='https://www.blazaintl.com/platformimages/mainpage_banner11a.png' srcset='' />
        </div>
        <form class='form'>
            <div class='cell of-1px-bottom'>
                <VueSelect v-model='currency' :actions='currencyList' value='name' />
            </div>
            <!-- <div class='cell openType'>
                <div :class="{ 'openTypeAcitve':openType==='mobile' }"><a href='javascript:;' @click="openType='mobile'">手机号</a></div>
                <div :class="{ 'openTypeAcitve':openType==='email' }"><a href='javascript:;' @click="openType='email'">邮箱</a></div>
            </div> -->
            <div v-if="openType==='mobile'" class='cell'>
                <MobileInput v-model='mobile' v-model:zone='zone' placeholder='手机号' />
            </div>
            <div v-else class='cell'>
                <InputComp v-model='email' clear label='邮箱' />
            </div>
            <div class='cell'>
                <CheckCode v-model='checkCode' clear label='验证码' />
            </div>
            <div class='cell'>
                <van-checkbox v-model='protocol' shape='square'>开户注意事项</van-checkbox>
            </div>
            <div class='cell'>
                <van-button block class='registerBtn' :color='$store.state.style.primary' type='primary' @click="$router.push('/register/success')">提交</van-button>
            </div>
        </form>
        <div class='switchType'>
            <a v-if="openType==='email'" href='javascript:;' @click="openType='mobile'">手机号注册</a>
            <a v-else href='javascript:;' @click="openType='email'">邮箱注册</a>
        </div>
    </div>
</template>

<script>
import Top from '@ct/layout/top'
import VueSelect from '@ct/components/select'
import CheckCode from '@ct/components/form/checkCode'
import InputComp from '@ct/components/form/input'
import MobileInput from '@ct/components/form/mobileInput'
import { mapState } from 'vuex'
export default {
    components: {
        Top,
        MobileInput,
        InputComp,
        CheckCode,
        VueSelect,
    },
    data () {
        return {
            options: [{ country: 'Canada', code: 'CA' }],
            zone: 86,
            checkCode: '',
            mobile: '',
            openType: 'mobile',
            accountType: 'CFD账户',
            accountTypeList: [
                { name: 'CFD账户' }
            ],
            currency: '美元账户',
            currencyList: [
                { name: '美元账户' },
                { name: '选项二' },
                { name: '选项三' },
            ],
            protocol: true
        }
    },
    computed: {
        ...mapState(['zoneList'])
    },
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.register{
    position: relative;
    height: 100%;
}
.loginBtn{
    position: absolute;
    right: rem(30px);
    top: 0;
    height: rem(90px);
    line-height: rem(90px);
    color: var(--white);
}
.banner{
    padding: 0 rem(30px);
    margin-top: rem(20px);
    img{
        display: block;
        width: 100%;
    }
}
.cell{
    display: flex;
    justify-content: space-between;
    margin: rem(40px) rem(30px);
    div{
        flex: 1;
    }
    .zone{
        width: rem(200px);
        flex: none;
        margin-right: rem(20px);
    }
    &.openType{
        justify-content: center;
        &>div{
            flex: none;
            margin: 0 1em;
        }
        a{
            color: var(--color);
        }
    }
    .openTypeAcitve{
        a{
            color: var(--primary);
        }
    }
}
.openTypeWrapper{
    :deep(.van-tabs__nav--card){
        margin: 0;
        border-radius: rem(10px);
        overflow: hidden;
    }
}
.input{
    display: block;
    width: 100%;
    height: rem(75px);
    line-height: 1;
    font-size: rem(30px);
    padding: 0 5px;
    border: 1px solid var(--bdColor);
    border-radius: rem(10px);
}
.registerBtn{
    margin-top: rem(80px);
    border-radius: rem(50px);
}
.switchType{
    text-align: center;
    margin-top: rem(30px);
    a{
        color: var(--primary);
    }
}
</style>
