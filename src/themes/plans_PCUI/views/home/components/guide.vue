<template>
    <div class='guide-module auto-width'>
        <h3 class='title'>
            {{ $t('home.guide.title') }}
        </h3>
        <p class='subhead'>
            {{ $t('home.guide.describe') }}
        </p>
        <ul class='guide-ul'>
            <li>
                <img src='@planspc/images/home/guide-1.png' />
                <p>{{ $t('home.guide.text1') }}</p>
            </li>
            <li>
                <img src='@planspc/images/home/guide-2.png' />
                <p>{{ $t('home.guide.text2') }}</p>
            </li>
            <li>
                <img src='@planspc/images/home/guide-3.png' />
                <p>{{ $t('home.guide.text3') }}</p>
            </li>
        </ul>
    </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.guide-module {
    margin-top: 90px;
    color: var(--color);
    .title {
        @include font();
        font-size: 32px;
        font-weight: bold;
    }
    .subhead {
        margin-top: 5px;
        font-size: 16px;
    }
    .guide-ul {
        display: flex;
        margin-top: 46px;
        li {
            width: 390px;
            margin-right: 16px;
            cursor: pointer;
            &:last-of-type {
                margin-right: 0;
            }
            img {
                display: block;
                width: 100%;
                height: 192px;
            }
            p {
                margin-top: 20px;
                font-size: 16px;
            }
        }
    }
}
</style>
