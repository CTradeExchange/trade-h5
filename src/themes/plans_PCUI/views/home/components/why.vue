<template>
    <div class='why-module auto-width'>
        <h3 class='title'>
            {{ $t('home.why.title') }}
        </h3>
        <p class='subhead'>
            {{ $t('home.why.describe') }}
        </p>
        <ul class='why-ul'>
            <li>
                <img src='@planspc/images/home/why-icon1.png' />
                <p class='name'>
                    {{ $t('home.why.title1') }}
                </p>
                <p class='describe'>
                    {{ $t('home.why.text1') }}
                </p>
            </li>
            <li>
                <img src='@planspc/images/home/why-icon2.png' />
                <p class='name'>
                    {{ $t('home.why.title2') }}
                </p>
                <p class='describe'>
                    {{ $t('home.why.text2') }}
                </p>
            </li>
            <li>
                <img src='@planspc/images/home/why-icon3.png' />
                <p class='name'>
                    {{ $t('home.why.title3') }}
                </p>
                <p class='describe'>
                    {{ $t('home.why.text3') }}
                </p>
            </li>
            <li>
                <img src='@planspc/images/home/why-icon4.png' />
                <p class='name'>
                    {{ $t('home.why.title4') }}
                </p>
                <p class='describe'>
                    {{ $t('home.why.text4') }}
                </p>
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
.why-module {
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
    .why-ul {
        display: flex;
        margin-top: 55px;
        li {
            display: flex;
            flex-direction: column;
            width: 245px;
            margin-right: 64px;
            &:last-of-type {
                margin-right: 0;
            }
            img {
                width: 68px;
                height: 68px;
            }
            .name {
                margin-top: 25px;
                font-size: 16px;
            }
            .describe {
                margin-top: 18px;
                line-height: 22px;
                font-size: 14px;
                color: var(--normalColor);
            }
        }
    }
}
</style>
