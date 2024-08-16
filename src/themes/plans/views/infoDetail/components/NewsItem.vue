<template>
    <div
        class='cardItem'
        :class="index === 0 && 'first'"
        @click='goToSourceURL(detail.SourceURL)'
    >
        <div class='itemContent'>
            <div class='itemTitle'>
                {{ detail.Title }}
            </div>
            <div class='itemTime'>
                {{ formatTime(detail.PublishTime) }}
            </div>
        </div>
        <CImage class='itemImg' mode='cover' :src='item.CoverURL' />
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
            const { PublishTime, Title, SourceURL } = currentItem || {}
            return { TotalLikeCount, Title, PublishTime, SourceURL }
        })

        const formatTime = (time) => {
            return dayjs(time * 1000).format('YYYY-MM-DD HH:mm:ss')
        }

        const goToSourceURL = (url) => {
            console.log({ url })
            if (url) {
                window.open(url)
            }
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
    padding: rem(30px) rem(10px);
    background: var(--contentColor);
    border-top: 1px solid var(--cardBg);
    &.first {
        border-top: none;
    }
    .itemContent {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        flex: 1;
        padding-right: rem(45px);
        .itemTitle {
            @include ellipsisLn(2);
            font-size: rem(28px);
            font-weight: 400;
            color: var(--primaryText);
            line-height: rem(41px);
        }
        .itemTime {
            font-size: rem(24px);
            font-weight: 400;
            color: var(--color80);
        }
    }
    & > .itemImg {
        width: rem(221px);
        height: rem(150px);
        border-radius: rem(10px);
        overflow: hidden;
    }
}
</style>
