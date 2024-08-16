<template>
    <div class='asstets-top'>
        <div class='top-search'>
            <span>{{ $t('compLang.search') }}</span>
            <input class='search-input' />
            <div class='search-btn'>
                <img class='search-img' src='../images/search.png' />
            </div>
        </div>
        <div class='top-right'>
            <img class='hide-img' src='../images/hide.png' />
        </div>
    </div>
</template>

<script>
export default {

}
</script>

<style scoped lang="scss">
.asstets-top{
    margin-top: 87px !important;
    height: 54px;
    background: var(--color5);
    padding: 0 26px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .top-search{
        display: flex;
        border-bottom: 1px solid var(--White);
        align-items: center;
        width: 400px;
        height: 33px;
        color: var(--White);
        font-size: 12px;
        padding-left:15px;
        margin-bottom: 8px;
        .search-btn{
            padding: 0 15px;
            cursor:pointer
        }
        .search-img{
            width: 11px;
            height: 11px;
        }
        .search-input{
            flex:1;
            padding:0 15px;
            color: var(--White);
        font-size: 12px;
        }
    }
}
</style>
