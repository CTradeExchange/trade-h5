<template>
    <div
        class='cardItem'
        :class="index === 0 && 'first'"
        @click='goToSourceURL(detail.SourceURL)'
    >
        <CImage class='itemImg' mode='cover' :src='item.CoverURL' />
        <div class='itemContent'>
            <div class='contentText'>
                {{ detail.Title }}
            </div>

            <div class='itemTime'>
                {{ formatTime(detail.PublishTime) }}
            </div>
        </div>
    </div>
</template>

<script>
import { computed } from 'vue'
import { isEmpty, getCookie } from '@/utils/util'
import dayjs from 'dayjs'
import CImage from './Image'
export default {
    components: { CImage },
    props: {
        item: {
            type: Object,
            default: () => {
                return {}
            }
        },
        index: Number
    },
    setup (props) {
        const detail = computed(() => {
            const language = getCookie('lang') || 'en-US'
            const { TotalLikeCount, ItemLanguages } = props.item
            const currentItem = !isEmpty(ItemLanguages) ? ItemLanguages.find(i => i.Language === language) ? ItemLanguages.find(i => i.Language === language) : ItemLanguages[0] : {}
            const { PublishTime, Title, Content, SourceURL, Description } = currentItem || {}
            return { TotalLikeCount, Title, PublishTime, Content, SourceURL, Description }
        })

        const formatTime = (time) => {
            return dayjs(time * 1000).format('YYYY-MM-DD HH:mm:ss')
        }

        const goToSourceURL = (url) => {
            if (!url) return
            window.open(url)
        }

        return {
            goToSourceURL,
            formatTime,
            detail,

        }
    }

}
</script>

<style lang="scss" scoped>
@import "@/sass/mixin.scss";
.cardItem {
    display: flex;
    justify-content: space-between;
    padding: 20px 0;
    background: var(--contentColor);
    border-bottom: 1px solid var(--cardBg);
    cursor: pointer;
    .itemContent {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        flex: 1;
        margin-left: 25px;
        font-size: 14px;
        margin-right:15px;
        color: var(--mainColor);
        .contentText{
            @include ellipsisLn(4);
        }
        .itemTime {
            font-size: 14px;
            font-weight: 400;
            color: var(--color80);
            text-align: left;
        }
    }
    & > .itemImg {
        width: 254px;
        height: 150px;
        border-radius: 5px;
        overflow: hidden;
    }
}
</style>
