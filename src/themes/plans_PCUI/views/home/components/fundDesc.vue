<template>
    <div class='full'>
        <div class='fundDesc'>
            <div class='column rightLine'>
                <p class='title'>
                    探索V10指数
                </p>
                <p class='desc'>
                    投资者可以利用V10指数轻松跟踪加密资产的整体市场表现，并且在超过70%的时间中保持领先
                </p>
                <!-- <ul class='fundList'>
                    <li v-for='item in fundList' :key='item.ratio' class='item'>
                        <p class='ratio'>
                            {{ item.ratio }}
                        </p>
                        <img alt='' :src='"/images/homeFundIcons/"+item.name.toLowerCase()+".png"' />
                    </li>
                </ul> -->
                <div class='btnBox'>
                    <button class='btn'>
                        阅读V10指数白皮书（PDF）
                    </button>
                </div>
            </div>
            <div class='column'>
                <p class='title'>
                    V10 ETF基金
                </p>
                <p class='desc'>
                    降低门槛、分散投资、优化配置、动态调整...... <br />
                    您所需要的一切均由专业的基金经理打理，而您只需要坐享其成
                </p>
                <!-- <img alt='' class='jingzhiImg' src='../../../images/home/jingzhi.png' /> -->
                <div class='btnBox'>
                    <button class='btn'>
                        阅读V10 ETF基金白皮书（PDF）
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref } from 'vue-demi'
export default {
    setup () {
        const fundList = ref([
            {
                name: 'BTC',
                ratio: '40.00%'
            },
            {
                name: 'ETH',
                ratio: '34.43%'
            },
            {
                name: 'BNB',
                ratio: '6.68%'
            },
            {
                name: 'SOL',
                ratio: '3.05%'
            },
            {
                name: 'ADA',
                ratio: '3.22%'
            },
            {
                name: 'XRP',
                ratio: '3.65%'
            },
            {
                name: 'LUNA',
                ratio: '3.30%'
            },
            {
                name: 'DOT',
                ratio: '1.83%'
            },
            {
                name: 'AVAX',
                ratio: '2.10%'
            },
            {
                name: 'DOGE',
                ratio: '1.74%'
            },
        ])
        return {
            fundList,
        }
    }
}
</script>

<style lang="scss" scoped>
.full{
    background: #fff;
}
.fundDesc{
    width: 1200px;
    margin: 0 auto;
    display: flex;
    margin-top: 45px;
    margin-bottom: 40px;
    .column{
        flex: 1;
        padding-right: 50px;
        line-height: 1.4;
        .title{
            font-weight: 700;
            padding-bottom: 0.5em;
            font-size: 20px;
        }
    }
    .rightLine{
        position: relative;
        margin-right: 40px;
        &::after{
            content: "";
            height: 80%;
            width: 1px;
            background: var(--placeholdColor);
            position: absolute;
            right:0;
            top: 0;
        }
    }
    .fundList{
        margin-top: 15px;
        display: flex;
        justify-content: space-between;
        background: #eee;
        padding: 10px;
        border-radius: 4px;
        .ratio{
            font-size: 12px;
            padding-bottom: 5px;
        }
        img{
            width: 32px;
        }
    }
    .jingzhiImg{
        display: block;
        margin-top: 15px;
    }
    .btnBox{
        margin-top: 20px;
        .btn{
           height: 48px;
           padding: 0 15px;
           font-size: 16px;
           color: #181A20;
           background-color: #FCD535;
           border-radius: 4px;
        }
    }

}
</style>
