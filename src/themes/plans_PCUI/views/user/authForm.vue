<template>
    <centerViewDialog :id='id' class='bindMobilePage'>
        <LayoutTop />
        <auth-confirm :business-code='businessCode' platform='web' />
    </centerViewDialog>
</template>

<script>
import centerViewDialog from '@planspc/layout/centerViewDialog'
import { firebaseAnalytics } from '@/utils/firebase'
import { useRoute } from 'vue-router'
import { computed, onMounted } from 'vue'
import authConfirm from './authConfirm.vue'

export default {
    name: 'AuthForm',
    components: {
        centerViewDialog,
        authConfirm
    },
    data: function () {
        return {
            id: 'AuthFormId',
        }
    },
    setup (props) {
        const route = useRoute()
        const businessCode = computed(() => route.query.businessCode)

        onMounted(() => {
            // firebase
            firebaseAnalytics('kyc_write', {
                key: 'kyc_write_entrance',
                value: 'kyc_initiated',
            })
        })

        return {
            businessCode
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.bindMobilePage {
    line-height: 50px;
    .authentication {
        :deep {
            .page-wrap {
                padding-top: 10px;
            }
        }
    }
    .authForm{
        height: 100%;
    }
}
</style>
