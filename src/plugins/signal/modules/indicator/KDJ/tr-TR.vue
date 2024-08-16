<template>
    <div class='indicator'>
        <section>
            <h4>nedirKDJ</h4>
            <p>KStokastik gösterge olarak da bilinen KDJ, ilk olarak George Lane'in (George Lane) öncülük ettiği vadeli işlem piyasasının analizinde kullanıldı ve şimdi borsanın kısa vadeli trend analizinde yaygın olarak kullanılıyor. Stokastik gösterge (KDJ), en yüksek fiyat, en düşük fiyat ve kapanış fiyatı baz alınarak hesaplanır ve elde edilen K değeri, D değeri ve J değeri, göstergenin koordinatlarında bir nokta oluşturarak bu gibi sayısız noktayı birleştirerek tam bir KDJ göstergesi oluşturur. fiyat dalgalanma eğilimini yansıtabilir.</p>
            <img src='/images/signal/indicator/kdj.png' />
        </section>
        <section>
            <h4>Gösterge Özellikleri</h4>
            <p>• KDJ göstergesi mükemmel hassasiyete sahiptir.Fiyat trendinde hafif bir değişiklik olduğunda, KDJ göstergesi her zaman ilk seferde bir ticaret talimatı sinyali verebilir.</p>
            <p>• KDJ göstergesinin erken uyarı işlevi vardır. Fiyat güçlü bir yükselen veya düşen piyasaya girdiğinde, KDJ göstergesindeki üç eğri sırayla ultra düşük veya ultra yüksek alana girer. Değer ne kadar yüksek veya düşük olursa, o kadar büyük olur dönüş olasılığı</p>
            <p>• KDJ göstergeleri diğer teknik göstergelerle oldukça uyumludur</p>
        </section>
        <section>
            <h4>KDJ'nin Kullanımı</h4>
            <h5>altın çatal</h5>
            <p>K çizgisi, genellikle altın haç olarak bilinen grafikteki D çizgisini kestiğinde, bu bir satın alma sinyalidir. Ayrıca K çizgisi ile D çizgisi 20'nin altına yukarı doğru kesiştiğinde, bu andaki kısa vadeli alım sinyali daha doğrudur; K değeri 50'nin altındaysa, D değerini iki kez geçerek daha yüksek bir golden cross "W" oluşturur. " Herhangi bir form yoksa, hisse senedi fiyatı önemli bir artış gösterebilir ve piyasa beklentisi umut vericidir.</p>
            <h5>ölü çatal</h5>
            <p>K değeri gittikçe küçülür ve ardından yukarıdan D çizgisinin altına düşerse buna genellikle ölü kesişme denir ve satış sinyali olarak kabul edilir. Ayrıca, K çizgisi ve D çizgisi 80 işaretinde kesiştiğinde, bu noktada kısa vadeli satış sinyali daha doğrudur. K değeri 50'nin üzerindeyse, trendde D çizgisinin altından iki kez geçerse ve düşük "M" şeklinden ölürse, piyasa beklentisi önemli bir hisse senedi fiyatı düşüşüne sahip olabilir.</p>
            <h5>aşırı alım</h5>
            <p>KDJ'nin değeri 0 ile 100 arasında değişmektedir (J değeri bazen aşmaktadır), K değeri 80'in üzerindedir, D değeri 70'in üzerindedir ve J değeri 90'dan büyük olduğunda aşırı alım söz konusudur. Normal şartlar altında hisse senedi fiyatı düşebilir. Yatırımcılar temkinli davranmalı, dışarıdakiler yükselişi takip etmemeli ve içerdekiler zamanı geldiğinde satmalı.</p>
            <h5>aşırı satış</h5>
            <p>KDJ'nin değeri 0 ile 100 arasında değişmektedir (J değeri bazen aşmaktadır), K değeri 20'nin altında, D değeri 30'un altında aşırı satım bölgesidir. Normal şartlar altında, hisse senedi fiyatının yükselmesi muhtemeldir ve bir toparlanma olasılığı artar. İçeridekiler kolayca atmamalı ve dışarıdakiler pazara girmek için fırsatlar bulabilir.</p>
        </section>
    </div>
</template>

<style lang="scss" scoped>
@import '@/plugins/signal/style/indicator.scss';
</style>
