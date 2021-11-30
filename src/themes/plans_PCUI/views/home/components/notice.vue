<template>
    <div class='notice-module'>
        <ul>
            <li>
                <a href='https://tradeswitcher.com/' target='_blank'>
                    关于CATS2支持HUSD进行主网升级的公告
                </a>
            </li>
            <li>
                <a href='https://tradeswitcher.com/' target='_blank'>
                    CATS2将于9月23日20:00开放GAL币币交易
                </a>
            </li>
            <li>
                <a href='https://tradeswitcher.com/' target='_blank'>
                    关于CATS2支持HUSD进行主网升级的公告
                </a>
            </li>
            <li>
                <a href='https://tradeswitcher.com/' target='_blank'>
                    关于CATS2支持HUSD进行主网升级的公告
                </a>
            </li>
        </ul>
    </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
.notice-module {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 40px;
    background-color: var(--bgColor);
    ul {
        display: flex;
        align-items: center;
        height: 100%;
        li {
            font-size: 13px;
            a{
                color: var(--color);
            }
            &::after {
                content: '/';
                margin: 0 15px;
            }
            &:last-of-type::after {
                content: '';
            }
        }
    }
}
</style>
