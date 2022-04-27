<template>
    <router-view />
    <div class='rankingWrapper'>
        <div class='topTool'>
            <a class='back' href='javascript:;' @click='$router.back()'>
                <van-icon name='arrow-left' />
            </a>
            <h2 class='title'>
                排行榜
            </h2>
        </div>
        <div class='ranking'>
            <rankingModule :max='30' />
        </div>
    </div>
</template>

<script>
import rankingModule from '@planspc/modules/ranking/rankingModule'
export default {
    components: {
        rankingModule,
    },
    setup () {
        return {}
    }
}
</script>

<style lang="scss" scoped>
.rankingWrapper{
    width: 1200px;
    margin: 40px auto;
    min-height: calc(100vh - 300px);
    .topTool{
        position: relative;
        line-height: 56px;
        .title{
            margin-left: 30px;
            height: 56px;
            font-size: 24px;
        }
        .back{
            position: absolute;
            left: 0;
            top: 0;
            font-size: 24px;
            color: var(--color);
        }

    }
}
.ranking{
    position: relative;
    margin: 30px 0 60px;
    padding: 10px 20px 0;
    background: var(--contentColor);
    border-radius: 5px;
    font-size: 12px;

}
</style>
