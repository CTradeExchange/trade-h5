<template>
    <div class='quick-module auto-width'>
        <h3 class='title'>
            让财富更自由
        </h3>
        <p class='describe'>
            全球顶级交易平台，一键投资数字货币、外汇、贵金属、指数等多种交易产品
        </p>
        <div class='register-box'>
            <input placeholder='输入您的邮箱或手机号' />
            <button>注册</button>
        </div>
    </div>
</template>

<script>
</script>

<style lang="scss" scoped>
.quick-module {
    display: flex;
    flex-direction: column;
    align-items: center;
    .title {
        font-size: 32px;
        color: var(--color);
    }
    .describe {
        margin-top: 10px;
        font-size: 16px;
        color: var(--color);
    }
    .register-box {
        display: flex;
        align-items: center;
        margin-top: 30px;
        input {
            width: 400px;
            height: 48px;
            padding: 0 19px;
            margin-right: 8px;
            font-size: 16px;
            background: var(--bgColor);
            border-radius: 4px;
        }
        button {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 104px;
            height: 48px;
            font-size: 20px;
            color: #fff;
            background: var(--primary);
            border-radius: 4px;
            cursor: pointer;
        }
    }
}
</style>
