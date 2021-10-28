<template>
    <div class='product-module'>
        <ul>
            <li v-for='(item, index) in 5' :key='index'>
                <p class='row_1'>
                    <span>加元日元</span>
                    <strong>-0.15%</strong>
                </p>
                <p class='row_2'>
                    <span>2.2264</span>
                </p>
                <p class='row_3'>
                    <span>-0.592</span>
                </p>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    setup () {
        return {

        }
    }
}
</script>

<style lang="scss" scoped>
.product-module {
    height: 120px;
    background: #000730;
    ul {
        display: flex;
        height: 100%;
    }
    li {
        display: flex;
        flex-direction: column;
        justify-content: center;
        flex: 1;
        height: 100%;
        padding: 0 24px;
        position: relative;
        cursor: pointer;
        &::after {
            content: '';
            width: 1px;
            height: 72px;
            background-color: rgba(255,255,255,.2);
            position: absolute;
            top: 50%;
            right: 0;
            transform: translateY(-50%);
        }
        &:last-of-type::after {
            background-color: transparent;
        }
        .row_1 {
            display: flex;
            justify-content: space-between;
            align-items: center;
            span {
                font-size: 16px;
                color: #B7C0E7;
            }
            strong {
                font-size: 16px;
                font-weight: normal;
                color: #EF5350;
            }
        }
        .row_2 {
            margin-top: 3px;
            span {
                font-size: 24px;
                color: #B7C0E7;
            }
        }
        .row_3 {
            margin-top: 3px;
            span {
                font-size: 16px;
                color: #5B658E;
            }
        }
    }
}
</style>
