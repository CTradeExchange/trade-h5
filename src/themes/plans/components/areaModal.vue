<template>
    <div class='area-modal'>
        <van-dialog v-model:show='show' :show-confirm-button='false'>
            <div class='page-wrapper'>
                <div class='page-header'>
                    <a class='backIcon' href='javascript:void(0);' @click='back'>
                        <i class='icon_icon_back1'></i>
                    </a>
                    <div class='title'>
                        {{ title }}
                    </div>
                </div>
                <div class='top-search'>
                </div>
                <div class='check-group'>
                    <div v-for='(item,i) in list' :key='item.code' class='check-item'>
                        <div v-if='isShowTag(i)' class='char'>
                            <span>{{ item.nameEn.slice(0,1) }}</span>
                        </div>
                        <div :class="['item-content',isShowTag(i) && 'first']" @click='handleConfirmCountry(item)'>
                            <span>{{ item.nameEn }}</span>
                            <img class='check-icon' :src='item.code===curCountry.code?checkedIcon:unCheckedIcon' />
                        </div>
                    </div>
                </div>
            </div>
        </van-dialog>
    </div>
</template>

<script>
import { onMounted, reactive, toRefs, computed } from 'vue'
import checkedIcon from '@plans/images/checked.png'
import unCheckedIcon from '@plans/images/unChecked.png'
import { useStore } from 'vuex'
import { getCountryListByParentCode } from '@/api/base'
export default {
    props: {
        show: {
            type: Boolean,
            default: false
        },
        title: {
            type: String,
            default: ''
        }
    },
    setup () {
        const store = useStore()
        const state = reactive({
            list: null,
            curCountry: {},
        })

        const getCountryList = () => {
            getCountryListByParentCode({ parentCode: -1 }).then((res) => {
                if (res.check()) {
                    if (res.data.length > 0) {
                        state.list = res.data.sort(srotArray)
                    }
                }
            })
        }

        const srotArray = (x, y) => {
            const collator = new Intl.Collator('en')
            return collator.compare(x.nameEn, y.nameEn)
        }

        const isShowTag = (i) => {
            if (i === 0) return true
            return state.list[i]?.nameEn.slice(0, 1).toLowerCase() !== state.list[i - 1]?.nameEn.slice(0, 1).toLowerCase()
        }

        const handleConfirmCountry = (item) => {
            state.curCountry = item
        }

        onMounted(() => {
            getCountryList()
        })
        return {

            handleConfirmCountry,
            isShowTag,
            checkedIcon,
            unCheckedIcon,
            ...toRefs(state)
        }
    }

}
</script>

<style lang="scss" scoped>
.area-modal{
    :deep{
        .van-dialog{
            width:100%;
            flex:1;
            top:50%;
            border-radius: 0;
            overflow-y: auto;

        }
    }
}
.page-header{
    height: rem(100px);
    position: fixed;
    display: flex;
    width: 100%;
    top:0;
    left:0;
}
.top-search{
    padding-top: rem(100px);

}
.check-group{

    .check-item{
        color:var(--color50);
        .char{
            height: rem(60px);
            display: flex;
            align-items: center;
            padding: 0 rem(20px);
            font-size:rem(28px)
        }

        .item-content{
            background: var(--contentColor);
            border-top:1px solid var(--lineColor);
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: rem(84px);
            padding: 0 rem(20px);
            font-size: rem(32px);
            &.first{
                border-top:none;
            }
            .check-icon{
                width:rem(36px);
                height: rem(36px);
            }
        }
    }
}
</style>
