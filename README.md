# Meydan · Gömeç Belediyesi demo uygulaması

Mağazaya yüklemeden Android telefonda çalışan, mock verili demo. Tüm kişi, işletme ve tutarlar örnektir.

**Modüller:** Beyaz Masa · Sosyal Yardım · Belediye Duyuruları · Esnaf Tanıtımları · İlanlar · Yaklaşan Ödemeler · İşyeri Açma (adımlar ve evraklar)

Altyapı: Expo SDK 58 (React Native). Ek bir sunucu yoktur; tüm veriler `src/data.js` dosyasındadır.

---

## Yöntem A: Expo Go ile çalıştırma (en hızlısı, yaklaşık 10 dakika)

Bilgisayar ve telefon aynı Wi‑Fi ağında olmalıdır. Demo süresince bilgisayar açık kalmalıdır.

1. Bilgisayara **Node.js LTS** (20 veya üzeri) kurun: https://nodejs.org
2. Zip dosyasını açın, terminalde klasöre girin ve bağımlılıkları yükleyin:
   ```bash
   cd meydan-demo
   npm install
   ```
3. Android telefona Play Store’dan **Expo Go** uygulamasını kurun.
4. Geliştirme sunucusunu başlatın:
   ```bash
   npx expo start
   ```
5. Terminalde çıkan QR kodu Expo Go içindeki **Scan QR code** ile okutun. Uygulama birkaç saniyede açılır.

**Sorun çıkarsa:**
- Telefon bağlanamıyorsa (farklı ağ, kurumsal Wi‑Fi vb.): `npx expo start --tunnel`
- Expo Go “SDK uyumsuz” derse önce Expo Go’yu Play Store’dan güncelleyin. Yine olmazsa projeyi telefondaki sürüme uyarlayın:
  ```bash
  npx expo install expo@latest --fix
  ```

## Yöntem B: Telefona kurulan APK (sunum günü için önerilir)

Bilgisayardan bağımsız çalışır; uygulama telefonda normal bir uygulama gibi durur. Derleme Expo’nun bulut sunucusunda yapılır, Android Studio gerekmez.

1. https://expo.dev adresinden ücretsiz hesap açın.
2. Klasörde:
   ```bash
   npm install
   npx eas-cli@latest login
   npx eas-cli@latest build -p android --profile preview
   ```
   İlk derlemede “EAS projesi oluşturulsun mu?” ve “Android keystore üretilsin mi?” sorularına **Yes** deyin.
3. Derleme 10–20 dakika sürer. Sonunda bir bağlantı ve QR kod verilir.
4. Bağlantıyı telefonda açın, APK’yı indirin ve kurun. Android “bilinmeyen kaynak” uyarısı verirse bu kaynağa izin verin.

## Demo ipuçları

- Giriş ekranında **Demo hesabıyla hızlı giriş** kimlik bilgisi istemez.
- Ana sayfadaki **⇄ simgesi** bireysel hesap (Ayşe Demir) ile kurumsal hesap (Liman Kahvecisi) arasında geçiş yapar. Kurumsal hesapta esnaf paylaşımı yapılabilir, ödemeler işletmeye göre değişir.
- **Beyaz Masa → Yeni talep:**
  - “Sesli anlat” sesli mesajın yazıya çevrilmesini canlandırır.
  - “Fotoğraf ekle” yüz bulanıklaştırmayı canlandırır.
  - Metne bir IBAN veya 11 haneli T.C. kimlik numarası yazarsanız KVKK uyarısı ve maskelenmiş metin görünür.
  - Yapay zekâ birim önerisi yazdıkça güncellenir.
- Talep, sosyal yardım ve ilan detaylarındaki **“Demo: belediye …”** düğmeleri belediye tarafındaki adımı canlandırır. Süre takibi ve bildirim gerçek zamanlı ilerler.
- **Ödemeler → Ödeme sayfasına git** gerçek uygulamada belediyenin mevcut ödeme sayfasını açar. Demoda “Ödendi say” seçeneği sunulur.
- Veriler uygulama yeniden başlatıldığında ilk hâline döner.

## Özelleştirme

- Mock veriler: `src/data.js` (mahalleler, talepler, duyurular, işletmeler, ilanlar, ödemeler, evrak listeleri)
- Renkler: `src/theme.js`
- Ekranlar: `src/screens/`
