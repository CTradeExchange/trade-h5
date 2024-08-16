<template>
    <footer class='page-footer'>
        <section class='introduce'>
            <h5>Risk Warning</h5>
            <p>CFDs are complex financial products traded on margin.Trading CFDs is risky and may not be suitable for all investors. Ensure you understand the risks involved as you may lose all your invested capital. Please consider our Privacy Policy, Rick And Warning Disclosure, and Trading Terms And Conditions, before using our services. CFD traders do not own or have any rights to the underlying assets.</p>
        </section>
        <section class='media'>
            <h4>Follow Us On:</h4>
            <div class='media-group'>
                <a href='' target='_blank'>
                    <img class='facebook-icon' src='../images/media/facebook.png' />
                </a>
                <a href='' target='_blank'>
                    <img class='telegram-icon' src='../images/media/telegram.png' />
                </a>
                <a href='' target='_blank'>
                    <img class='youtube-icon' src='../images/media/youtube.png' />
                </a>
                <a href='' target='_blank'>
                    <img class='twitter-icon' src='../images/media/twitter.png' />
                </a>
                <a href='' target='_blank'>
                    <img class='media-icon' src='../images/media/media-1.png' />
                </a>
                <a href='' target='_blank'>
                    <img class='instagram-icon' src='../images/media/instagram.png' />
                </a>
            </div>
        </section>
        <section class='platforms'>
            <div>
                <a href=''>
                    <img src='../images/media/telegram-img.png' />
                </a>
            </div>
            <div>
                <a href=''>
                    <img src='../images/media/google-play.png' />
                </a>
            </div>
        </section>
    </footer>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
.page-footer{
    background: #46484F;
    padding: rem(60px) rem(30px) rem(120px) rem(30px);
    color:var(--contentColor);
    font-family: 'Roboto';
    .introduce{
        font-size: rem(24px);
        line-height: rem(28px);
        h5{
            margin-block: rem(10px);
            font-weight: 600;
        }
        p{
            font-weight: 400;
        }
    }

    .media{
        padding-top: rem(80px);
        h4{
            font-weight: 600;
            font-size: rem(28px);
            line-height: rem(32px);
            text-align: center;
        }
        .media-group{
            text-align: center;
            padding-top:rem(40px);
            &>a{
                margin: 0 rem(28px);
            }
        }

    }
    .platforms{
        padding-top:rem(70px);
        &>div{
            text-align: center;
            margin-bottom: rem(60px);
            &:last-of-type{
                margin-bottom:0
            }
        }
        img{
            width: rem(360px);
            height:auto
        }
    }
}

</style>
