<template>
    <div v-infinite-scroll='load' class='news-list'>
        <div v-for='(item, index) in 5' :key='index' class='item'>
            <div class='item-left'>
                <p class='title'>
                    德赛西威：申万宏源、泰康资产等2家机构于9月23日调研我司
                </p>
                <p class='row'>
                    <span>证券之星原创</span>
                    <span>10分钟前</span>
                </p>
            </div>
            <div class='item-right'>
                <img src='@planspc/images/home/guide-1.png' />
            </div>
        </div>
    </div>
</template>

<script>
export default {
    setup () {
        // 加载更多
        const load = () => {
            console.log(111)
        }

        return {
            load
        }
    }
}
</script>

<style lang="scss" scoped>
@import '~@/sass/mixin.scss';
.news-list {
    height: 100%;
    overflow-y: auto;
    .item {
        display: flex;
        height: 120px;
        margin-bottom: 40px;
        cursor: pointer;
        &:last-of-type {
            margin-bottom: 0;
        }
        .item-left {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            width: 332px;
            height: 100%;
            margin-right: 25px;
            .title {
                @include ellipsisLn(3);
                line-height: 22px;
                font-size: 16px;
                color: var(--color);
            }
            .row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: 14px;
                color: var(--minorColor);
            }
        }
        .item-right {
            width: 200px;
            height: 120px;
            img {
                display: block;
                width: 200px;
                height: 120px;
            }
        }
    }
}
</style>
