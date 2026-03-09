---
title: Tek Kullanımlık Kodla Dosya Nasıl Paylaşılır (Adım Adım)
slug: tek-kullanimlik-kodla-dosya-nasil-paylasilir-adim-adim
description: >-
  Tek kullanımlık kod, dosyalarınızı yetkisiz erişime karşı korur. Kod tabanlı
  dosya aktarımının nasıl çalıştığını ve nasıl kullanılacağını burada
  bulabilirsiniz.
date: '2026-03-08'
category: Nasıl Yapılır
readingTime: 5 min read
translationKey: share-file-one-time-code
---
## Dosya Paylaşımı için Tek Kullanımlık Kod Nedir?

Tek kullanımlık kod, bir kaynağa geçici erişim sağlayan kısa bir koddur (genellikle 6-10 basamaklı). Dosya paylaşımında bu, yalnızca sizin kodunuza sahip birinin oturumunuza katılıp dosyalarınızı alabileceği anlamına gelir.

Kalıcı bir bağlantının (iletilebilen, yer imlerine eklenebilen ve süresiz olarak yeniden kullanılabilen) aksine, tek seferlik bir kod:
- Belirlenen sürenin sonunda sona erer (örn. 10 dakika)
- Kolayca tahmin edilemez (rastgele, 8 basamaklı → 100 milyon kombinasyon)
- Oturum sona erdiğinde geçersiz kılınır

## OneTimeDrop Tek Kullanımlık Kodu Nasıl Kullanır?

[OneTimeDrop](/), masaüstünde her oturum oluşturduğunuzda 8 basamaklı yeni bir kod oluşturur:

1. [onetimedrop.io](/)'yu açın — anında 8 haneli yeni bir kod belirir
2. Bu kodu (sözlü olarak, yazarak veya QR aracılığıyla) dosya alıcısıyla paylaşın
3. Alıcı bunu 10 dakika içinde [onetimedrop.io/join](/join) adresinden girer.
4. Oturum bağlanır → dosya aktarımı

10 dakika sonra kod kaybolur. Birisi onu kopyalasa bile artık işe yaramaz.

## Bu Neden Statik Bağlantıdan Daha Güvenli?

| Özellik | Statik bağlantı | Tek kullanımlık kod |
|---|---|---|
| İletilebilir | ✅ Evet | Sınırlı (kısa TTL) |
| Otomatik olarak sona erer | ❌ Nadiren | ✅ 10 dakika sonra |
| Bot tarafından tahmin edilebilir | mümkün | Sert (8 basamaklı, hız sınırlı) |
| Hesap gerektirir | ❌ Hayır | ❌ Hayır |

## Adım Adım: Gerçek Hayatta Bir Kodla Paylaşma

**Senaryo:** Kütüphanedeki bir belgeyi e-posta adresinizi yazmadan yazdırmak istiyorsunuz.

1. Kütüphane bilgisayarında OneTimeDrop'u açın; 8 haneli kodu not edin
2. Telefonunuzda (cebinizden) [onetimedrop.io/join](/join) dosyasını açın
3. Ekranda gördüğünüz 8 haneli kodu yazın
4. Bağlan'a dokunun; telefonunuz oturuma katılır
5. Yazdırmak istediğiniz PDF'yi seçin
6. Yükleyin — bilgisayarda görünür
7. İndirin ve yazdırın

Toplam süre: ~30 saniye. Sıfır şifreler yazıldı.

## Ya Birisi Kodu Alırsa?

- Bağlanmadan önce girerlerse oturumunuz hâlâ oturum belirteci tarafından korunuyor
- Hız sınırlaması kaba kuvvet girişimlerini önler (IP başına dakikada maksimum 10 deneme)
- 10 dakika sonra kod kalıcı olarak geçersiz olur

> ⚠️ **Sorumluluk reddi beyanı:** Oturum kodunuzu herkese açık olarak veya sosyal medyada paylaşmayın. Kod, oturumunuza 10 dakika boyunca katılma erişimi sağlar. Oturum sona erdikten sonra dosyalar otomatik olarak silinir.

## SSS

**S: 8 haneli kod şifreyle aynı mı?**  
C: Bu bir eşleştirme mekanizmasıdır, şifre değil. Eşleştirmeden sonra dosya erişimi ayrı bir oturum belirteci gerektirir (tarayıcıda otomatik olarak işlenir).

**S: İki telefon aynı oturuma katılabilir mi?**  
C: Şu anda OneTimeDrop oturum başına bir telefonu eşleştiriyor. Çoklu cihaz paylaşımı için yeni bir oturuma ihtiyaç duyulacaktır.

**S: Kod ile QR kodu arasındaki fark nedir?**  
C: Aynı şeyi yapıyorlar. QR, katılmak için uygun bir tarama kısayoludur; Kod manuel giriş içindir.

## İlgili Gönderiler

- [QR Kod Dosya Paylaşımı: Nasıl Çalışır](/blog/qr-code-file-sharing-explained)
- [Hiçbir Şey Yüklemeden Wi-Fi Üzerinden Dosya Aktarımı](/blog/transfer-files-wifi-without-installing)
