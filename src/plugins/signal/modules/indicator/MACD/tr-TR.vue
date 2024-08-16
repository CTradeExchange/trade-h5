<template>
    <div class='indicator'>
        <section>
            <h4>MACD nedir?</h4>
            <p>MACD (İngilizce: Moving Average Convergence / Divergence, kısaltma: MACD), üstel hareketli ortalama, 1979'da Geral Appel tarafından önerilen, trend izleyen bir momentum göstergesidir.</p>
            <p>MACD genellikle üç bileşenden oluşur. MACD çizgisi, genellikle fark (DIF) olarak adlandırılan hızlı üstel hareketli ortalamadan (genellikle 12 gün) eksi yavaş üstel hareketli ortalamadan (genellikle 26 gün) oluşur. İkinci çizgi, genellikle DEA olarak adlandırılan DIF'nin (genellikle 9 gün) üstel hareketli ortalaması olan sinyal çizgisidir. Son bileşen MACD histogramıdır, değeri DIF ve DEA arasındaki farktır. Ancak MACD göstergesinin zaman değeri, tacirin tercihine ve işlem kategorisine göre de ayarlanabilir.</p>
            <img src='/images/signal/indicator/macd1.png' />
        </section>
        <section>
            <h4>Gösterge Özellikleri</h4>
            <p>• Ana özelliği sağlamlık olan trend göstergesi</p>
            <p>• İleriye dönük iyi, göstergelerin çoğu hisse senedi fiyatı veya endeksi ile senkronize çalışıyor ve hatta bazıları hisse senedi fiyatının işleyişinin gerisinde kalıyor ve MACD, çeşitli teknik göstergeler arasında en ileriye dönük ve öngörülü göstergelerden biridir.</p>
            <p>• Yüksek doğruluk oranı: Gösterge tasarımı nispeten hassastır, hesaplama nispeten karmaşıktır ve ana kuvvetin manipüle edilmesi ve hile yapılması nispeten zordur, bu nedenle doğruluk oranı nispeten yüksektir</p>
        </section>
        <section>
            <h4>MACD'nin kullanımı</h4>
            <h5>altın çatal</h5>
            <p>MACD analizinde, DIF çizgisi DEA çizgisinin altından yukarısına doğru kesiştiğinde buna altın haç denir ve bu bir yükseliş sinyali olabilir.</p>
            <img src='/images/signal/indicator/macd2.png' />
            <h5>ölü çatal</h5>
            <p>MACD analizinde, DIF çizgisi DEA çizgisinin üstünden altına geçtiğinde düşüş sinyali olabilir.</p>
            <img src='/images/signal/indicator/macd3.png' />
        </section>
    </div>
</template>

<style lang="scss" scoped>
@import '@/plugins/signal/style/indicator.scss';
</style>
