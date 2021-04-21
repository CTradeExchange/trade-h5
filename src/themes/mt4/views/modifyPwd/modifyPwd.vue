<template>
    <div class='modifyPwd'>
        <top
            back
            :menu='false'
            sub-title='84951705, Cats 2.0 Android Demo'
        />
        <form action='javascript:;' class='form'>
            <div class='input'>
                <input v-model='pwd' placeholder='当前密码' type='text' />
            </div>
            <div class='input'><input v-model='newPwd' placeholder='新密码' type='text' /></div>
            <PwdStrong :level-num='passWordLevel' />
            <div class='input'>
                <input v-model='surePwd' placeholder='密码确认' type='text' />
            </div>
        </form>
        <p class='tips'>
            <i class='icon_tishi'></i>
            密码必现足够复杂，至少6个符号长度并且至少3种当前字符类型中的2种-小写字母，大写字母，数字
        </p>
        <div class='footerBtn'><van-button block :color='$store.state.style.primary' type='primary'>提交</van-button></div>
    </div>
</template>

<script>
import top from '@m/layout/top'
import PwdStrong from '@m/components/pwdStrong'
export default {
    components: {
        top,
        PwdStrong,
    },
    data () {
        return {
            pwd: '',
            newPwd: '',
            surePwd: '',
        }
    },
    computed: {
        // 校验密码强度
        passWordLevel () {
            // 0： 表示第一个级别 1：表示第二个级别 2：表示第三个级别
            // 3： 表示第四个级别 4：表示第五个级别
            var modes = 0
            const newPwd = this.newPwd
            if (newPwd.length < 6) { // 最初级别
                return modes
            }
            if (/\d/.test(newPwd)) { // 如果用户输入的密码 包含了数字
                modes++
            }
            if (/[a-z]/.test(newPwd)) { // 如果用户输入的密码 包含了小写的a到z
                modes++
            }
            if (/[A-Z]/.test(newPwd)) { // 如果用户输入的密码 包含了大写的A到Z
                modes++
            }
            if (/\W/.test(newPwd)) { // 如果是非数字 字母 下划线
                modes++
            }
            return modes
        }
    },
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.modifyPwd {
    position: relative;
    height: 100%;
}
.form {
    padding: rem(30px);
    .input {
        position: relative;
        display: block;
        &:not(:first-of-type) {
            margin-top: rem(20px);
        }
        &::before {
            position: absolute;
            top: 0;
            right: 1px;
            bottom: 0;
            left: 1px;
            border: 1px solid var(--bdColor);
            content: '';
            clip: rect(rem(58px) auto auto auto);
        }
        input {
            display: block;
            width: 100%;
            height: rem(70px);
            padding: 0 rem(20px);
            line-height: 1;
            background-color: var(--white);
        }
    }
}
.tips {
    position: relative;
    padding: rem(10px) 0 0 rem(90px);
    color: var(--mutedColor);
    font-size: rem(24px);
    line-height: 1.4;
    .icon_tishi {
        position: absolute;
        top: rem(10px);
        left: rem(30px);
        font-size: rem(40px);
    }
}
.footerBtn {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
}
</style>
