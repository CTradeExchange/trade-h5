<template>
    <div class='indicator'>
        <section>
            <h4>MA nedir</h4>
            <p>MA göstergesi, 20. yüzyılın ortalarında ünlü Amerikalı yatırım uzmanı Joseph E. Granville (Granville, Granville olarak da tercüme edilir) tarafından önerilen, hareketli ortalama göstergesi olarak adlandırılan İngilizce'nin kısaltmasıdır (Hareketli ortalama). Hareketli ortalama, ortalama bir değer elde etmek için belirli bir süre içindeki hisse senedi fiyatlarını toplamak ve ortalamasını almak ve ardından bunu hareketli ortalama olan elde edilen ortalama çizgisine bağlamak için istatistiksel hareketli ortalama ilkesini kullanır.</p>
        </section>
        <section>
            <h4>Gösterge Özellikleri</h4>
            <p>• Sabit: Günlük çizgi gibi dalgalanmayacak, genellikle yavaş bir yükseliş ve düşüş olacak.</p>
            <p>• İstikrar: Yükselen trend belirgin hale geldikten sonra MA genellikle yukarı doğru genişler; bariz düşüşten sonra hisse senedi fiyatı yokuş aşağı gitmeye başlar. Bununla birlikte, kararlılık ne kadar güçlüyse tepki o kadar yavaş olur.</p>
            <p>• Trend: Hisse senedi fiyat trendini yansıtabilir ve trend niteliğindedir.</p>
            <p>• Yükselme ve düşme: Hisse senedi fiyatı MA'yı aşağıdan yukarıya doğru kırdığında, MA kısa vadeli bir destek hattı haline gelir ve hisse senedi fiyatı MA civarına düştüğünde, bu bir satın alma fırsatıdır. MA artırmanın rolü budur. Aksine bozulursa MA düşüşe yardımcı olur.</p>
        </section>
        <section>
            <h4>MA kullanımı</h4>
            <h5>altın çatal</h5>
            <p>Genel olarak konuşursak, hareketli ortalama 20MA, 60MA'yı yukarı doğru kırdığında, kısa vadede salınımlı bir artışla yükselebileceğini ve uzun emirler veya kısa emirler için uygun olduğunu belirten bir golden cross olarak adlandırılır.</p>
            <h5>ölü çatal</h5>
            <p>Hareketli ortalama 20MA, 60MA'nın altına düştüğünde, kısa vadede düşebileceğini belirten bir ölüm kesişimi olarak kabul edilir ve piyasaya boş emirlerle girmek veya uzun emirlerle çıkmak için uygun olan bir salınım düşüşü olacaktır. .</p>
            <img src='/images/signal/indicator/MA.png' />
        </section>
    </div>
</template>

<style lang="scss" scoped>
@import '@/plugins/signal/style/indicator.scss';
</style>
