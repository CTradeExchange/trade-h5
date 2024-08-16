<template>
    <div v-if='isShow' class='vote-card'>
        <div class='vote-list' :class="[info.ViewpointID>0 && 'disable']">
            <div v-for='item in info.Viewpoints' :key='item.ID' class='vote-item'>
                <div class='vote-btn' :class="[info.ViewpointID>0 && info.ViewpointID!==item.ID && 'disable',info.ViewpointID===item.ID && 'selected']" :style="{ '--voteColor':item.Color }" @click='changeRadio(item.ID)'>
                    <div class='vote-circle'>
                        <span v-show='checked===item.ID'></span>
                    </div>
                    <div class='vote-title'>
                        {{ getViewpointsItem(item).Title }}
                    </div>
                </div>
                <el-progress :color='item.Color' :format='formatPercentage' :percentage='calcPercentage(item.LikeCount)' />
            </div>
        </div>
        <div class='vote-bottom'>
            <div class='vote-confirm' :class="[info.ViewpointID>0 && 'disable']" @click='handleVote'>
                <span>
                    {{
                        info.ViewpointID > 0
                            ? $t("news.voted")
                            : $t("news.confirmVotes")
                    }}
                </span>
            </div>
        </div>
    </div>
</template>

<script>
import { computed, reactive, toRefs, watch } from 'vue'
import { getCookie, isEmpty } from '@/utils/util'
export default {
    props: {
        info: {
            type: Object,
            default: () => {
                return {}
            }
        }
    },
    setup (props, { emit }) {
        const state = reactive({
            type: 1,
            checked: 0,
            isShow: computed(() => !isEmpty(props.info.Viewpoints))
        })

        const getViewpointsItem = (item) => {
            const language = getCookie('lang') || 'en-US'
            const { ViewpointLanguages = [] } = item || {}
            const currentViewpointItem = (ViewpointLanguages || []).find(i => i.Language === language) || ViewpointLanguages[0]
            return currentViewpointItem
        }

        const changeRadio = (e) => {
            if (props.info.ViewpointID > 0) return
            state.checked = e
        }

        const handleVote = () => {
            if (props.info.ViewpointID > 0) return
            emit('confirm', state.checked)
        }

        const calcPercent = (i) => {
            const { TotalLikeCount } = props.info
            if (!TotalLikeCount) {
                return
            }
            const percent = ((i * 100) / TotalLikeCount).toFixed(2)

            return `${percent}%`
        }

        const calcPercentage = (e) => {
            const { TotalLikeCount } = props.info
            if (!TotalLikeCount) {
                return 0
            }
            const percent = ((e * 100) / TotalLikeCount).toFixed(2)
            return percent
        }

        const formatPercentage = (e) => {
            return `${e}%`
        }

        watch(
            () => props.info,
            (news) => {
                const { Viewpoints = [], ViewpointID } = news || {}
                const { ID } = (Viewpoints && Viewpoints[0]) || {}
                state.checked = ViewpointID || ID
            }, {
                immediate: true
            }
        )

        return {
            calcPercentage,
            formatPercentage,
            getViewpointsItem,
            calcPercent,
            handleVote,
            changeRadio,
          ...toRefs(state)
        }
    }
}
</script>

<style scoped lang="scss">
.vote-card{
    background: var(--f8Color);
    padding: 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 250px;
    margin-bottom: 30px;
    .vote-list{
        display: flex;
        margin:-8px -10px;
        .vote-item{
            padding: 8px 10px;
            width:50%;
            .vote-btn{
                min-height: 34px;
                background: var(--contentColor);
                border: 1px solid var(--voteColor);
                border-radius: 5px;
                display: flex;
                align-items: center;
                padding: 0 10px;
                margin-bottom:12px;
                color:var(--voteColor);
                &.disable{
                    border: 1px solid var(--colord6);
                    color:var(--colord6);
                    background: unset;
                    .vote-circle{
                        border:1px solid var(--colord6);
                        cursor: auto;
                    }
                }
                &.selected{
                    background: unset;
                    .vote-circle{
                        cursor: auto;
                    }
                }
                .vote-circle{
                    width: 18px;
                    height: 18px;
                    border-radius: 18px;
                    border:1px solid var(--voteColor);
                    margin-right: 5px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    &>span{
                        height: 10px;
                        width: 10px;
                        background: var(--voteColor);
                        border-radius: 10px;
                    }
                }
                .vote-title{
                    font-size: 14px;

                }
            }
        }
    }
    .vote-bottom{
        padding:30px 0 10px 0;
        display: flex;
        justify-content: center;
        .vote-confirm{
            width: 80%;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 5px;
            background: var(--primary);
            color:var(--contentColor);
            font-size: 14px;
            cursor: pointer;
            height: 35px;
            &.disable{
                background: var(--primary);
                opacity: 0.2;
                cursor: not-allowed;
            }
        }
    }

}
</style>
