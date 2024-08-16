<template>
    <Loading :show='loading' />
    <LayoutTop :title="$t('competition.tradingCompetition')" />
    <iframe class='iframe' scrolling='no' src='https://support.headline.net/raceRules' @load='load'></iframe>
</template>

<script>
import { ref } from 'vue'
export default {
    setup () {
        const loading = ref(true)
        const values = [
            'Total rewards * 50% * 40%',
            'Total rewards * 50% * 20%',
            'Total rewards * 50% * 10%',
            'Total rewards * 50% * 30% / 7 = 4.28%',
            'Total rewards * 50% * 30% / 7 = 4.28%',
            'Total rewards * 50% * 30% / 7 = 4.28%',
            'Total rewards * 50% * 30% / 7 = 4.28%',
            'Total rewards * 50% * 30% / 7 = 4.28%',
            'Total rewards * 50% * 30% / 7 = 4.28%',
            'Total rewards * 50% * 30% / 7 = 4.28%',
        ]

        const load = () => {
            loading.value = false
        }

        return { values, loading, load }
    }

}
</script>

<style lang="scss" scoped>
@import "@/sass/mixin.scss";
.container{
    height: calc(100vh - rem(110px));
    width: 100%;
    overflow: auto;
    &::-webkit-scrollbar{
        display: none;
    }
}
.iframe{
    min-height: calc(100vh - rem(110px));
    background: var(--contentColor);
    width: 100%;
    // @include scroll-bar-vertical;

}
.page-rules{
    background: var(--contentColor);
    padding-bottom: rem(80px);
    .top-box{
        background-image: url('../../images/competition/rules-bg.png');
        background-repeat: no-repeat;
        background-size: 100%;
        height: rem(200px);
        display: flex;
        align-items: center;
        padding: rem(40px);
        font-size: rem(40px);
        font-weight: 800;
        color:var(--contentColor);
        .cup-img{
            width:rem(80px);
            height: rem(80px);
        }
        .rules-title{
            padding-left:rem(15px);
            flex:1;

        }
    }
    .page-container{
        padding: rem(30px);
        &>section{
            font-size:rem(32px);
            line-height: rem(50px);
            color:#24262B;
            h4{
                font-size: rem(32px);
                font-weight: 700;
                line-height: rem(50px);

            }
            &>ul{
                padding-left: rem(40px);
                list-style-type:decimal ;
                list-style-position: outside;
                li{
                    font-size:rem(32px);

                    line-height: rem(50px)
                }
            }
            &>ol{
                padding-left: rem(40px);
                list-style-type:disc ;
                list-style-position: outside;
                li{
                    font-size:rem(32px);
                    color:#24262B;
                    line-height: rem(50px)
                }
            }
            .table-title{
                font-size: rem(32px);
                line-height: rem(50px)
            }
        }
        table{
            margin-bottom: rem(80px);
            background:var(--lineColor);
            font-size: rem(28px);
            tr{
                td{
                    padding:rem(20px) rem(10px) rem(20px) rem(20px);
                    background: var(--contentColor);
                    &:first-of-type{
                        width: rem(194px);
                        vertical-align:top;
                    }
                }
                th{
                    padding:rem(20px);
                    height: rem(72px);
                    text-align: left;
                    background: var(--colorf4);
                }
            }

        }
        .rank-item{
            display: flex;
            padding: rem(8px) 0;
            .label{
                width: rem(106px);
            }
            .value{
                flex:1;
                color:var(--primary)
            }
        }
    }
}
</style>
