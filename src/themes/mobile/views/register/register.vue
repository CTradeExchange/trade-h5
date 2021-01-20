<template>
    <div class='register'>
        <top back :menu='false' />
        <a class='loginBtn' href='javascript:;' @click="$router.replace('/login')">已有账号</a>
        <div class='banner'>
            <img alt='' src='https://www.blazaintl.com/platformimages/mainpage_banner11a.png' srcset='' />
        </div>
        <form class='form'>
            <div class='cell accountCell'>
                <div class='field'>
                    <VueSelect v-model='accountType' :actions='accountTypeList' label='账户类型' value='name' />
                </div>
                <div class='field'>
                    <VueSelect v-model='currency' :actions='currencyList' label='账户币种' value='name' />
                </div>
            </div>
            <!-- <div class='cell'>
                <van-tabs
                    v-model:active='openType'
                    class='openTypeWrapper'
                    :color='$store.state.style.primary'
                    title-active-color='#fff'
                    title-inactive-color='#333'
                    type='card'
                >
                    <van-tab name='mobile' title='手机号' />
                    <van-tab name='email' title='邮箱' />
                </van-tabs>
            </div> -->
            <div class='cell openType'>
                <div :class="{ 'openTypeAcitve':openType==='mobile' }"><a href='javascript:;' @click="openType='mobile'">手机号</a></div>
                <div :class="{ 'openTypeAcitve':openType==='email' }"><a href='javascript:;' @click="openType='email'">邮箱</a></div>
            </div>
            <div v-if="openType==='mobile'" class='cell'>
                <mobileInput v-model='mobile' v-model:zone='zone' placeholder='手机号' />
            </div>
            <div v-else class='cell'>
                <div>
                    <input class='input' placeholder='邮箱' type='text' />
                </div>
            </div>
            <div class='cell'>
                <checkCode v-model='checkCode' />
            </div>
            <div class='cell'>
                <van-checkbox v-model='protocol' shape='square'>开户注意事项</van-checkbox>
            </div>
        </form>
        <div class='footerBtn'>
            <van-button block :color='$store.state.style.primary' type='primary' @click="$router.push('/register/success')">提交</van-button>
        </div>
    </div>
</template>

<script>
import top from '@m/layout/top'
import VueSelect from '@m/components/select'
import checkCode from '@m/components/form/checkCode'
import mobileInput from '@m/components/form/mobileInput'
import { mapState } from 'vuex'
export default {
    components: {
        top,
        mobileInput,
        checkCode,
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
            currency: '选项一',
            currencyList: [
                { name: '选项一' },
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
    margin: rem(30px) rem(30px);
    &.accountCell .field{
        width: rem(336px);
        flex: none;
    }
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
.footerBtn{
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
}
</style>
