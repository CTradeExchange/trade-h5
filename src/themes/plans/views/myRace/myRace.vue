<template>
    <LayoutTop
        bottomLine
        :title="$t('competition.myRace')"
    />
    <div class='page-my-race'>
        <van-tabs v-model:active='active' class='tabs' @change='changeTab'>
            <van-tab :name='20' :title="$t('competition.inProgress')">
                <RaceList :status='20' />
            </van-tab>
            <van-tab :name='30' :title="$t('competition.finished')">
                <RaceList :status='30' />
            </van-tab>
        </van-tabs>
    </div>
</template>

<script>
import { reactive, toRefs } from 'vue'
import { isEmpty } from '@/utils/util'
import RaceList from './components/RaceList'
export default {
    components: { RaceList },
    setup () {
        const state = reactive({
            active: 20,
            status: 20,
        })

        const changeTab = (e) => {
            window.scrollTo(0, 0)
        }

        return {
            changeTab,
            isEmpty,
            ...toRefs(state)
        }
    }

}
</script>

<style lang="scss" scoped>
@import "@/sass/mixin.scss";
.page-my-race{
    .tabs{
        :deep{
            .van-tabs__wrap{
                position: fixed;
                left:0;
                top:rem(110px);
                width: 100%;
                z-index: 99;
                border-top: 1px solid #f5f5f5;
            }
            .van-tab__text{
                font-size: rem(36px);
                font-weight: 400;
                color:var(--mainColor);
            }
            .van-tab--active{
                .van-tab__text{
                    color:var(--primary)
                }
            }
            .van-tabs__line{
                background:var(--primary)
            }
        }
    }
    .list-box{
        position: relative;
        margin-top:rem(110px);
        padding: 0 rem(30px);
        .item-card{
            height: rem(236px);
            width: 100%;
            position: relative;
            background: url('../../images/competition/card-bg.png');
            margin-top:rem(80px);
            background-repeat: no-repeat;
            background-size: 100%;
            padding:rem(25px) rem(20px);
            .status-bar{
                height: rem(60px);
                padding:0 rem(20px);
                border-radius: rem(20px) rem(20px) 0 0;
                color:var(--contentColor);
                font-size: rem(28px);
                position: absolute;
                left:0;
                top:rem(-40px);
                display: flex;
                align-items: center;
                &::after{
                    position: absolute;
                    content: '';
                    width:rem(15px);
                    height: rem(6px);
                    border-radius: 0 rem(3px) rem(3px) 0;
                    background: var(--mainColor);
                    opacity: 0.5;
                    bottom:0;
                    right:0;
                    transform: translateX(100%);
                }
                &.inProgress{
                    background: linear-gradient(270deg, #4640BC 0%, #5F8DF8 100%);
                }
                &.finished{
                    background: linear-gradient(270deg, #7B7C7C 0%, #AEAFB1 100%);
                }
            }
            .item-top{
                display: flex;
                //align-items: center;
                .cup{
                    width: rem(80px);
                    height: rem(80px);
                }
                .race-name{
                    flex:1;
                    color:var(--contentColor);
                    padding-left:rem(15px);
                    font-size: rem(32px);
                    @include ellipsisLn(2);
                    word-break: unset;
                }
            }
        }
    }

}
</style>
