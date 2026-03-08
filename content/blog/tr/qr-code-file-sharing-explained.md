---
title: 'QR Kod Dosya Paylaşımı: Nasıl Çalışır (Ve Neden Hızlıdır)'
slug: qr-code-file-sharing-explained
description: >-
  QR kodlu dosya paylaşımı USB'den daha hızlıdır ve hesap gerektirmez. Kaputun
  altında tam olarak nasıl çalıştığını öğrenin.
date: '2026-03-08'
category: Nasıl Yapılır
readingTime: 6 min read
canonical: 'https://onetimedrop.io/tr/blog/qr-code-file-sharing-explained'
---
## QR Kod Dosya Paylaşımı Nedir?

QR kodu, bir URL'yi (web adresini) taranabilir bir görüntü olarak kodlamanın bir yoludur. Telefonunuzun kamerasıyla bir QR kodunu taradığınızda, o URL tarayıcınızda açılır.

Dosya paylaşımı bağlamında, [OneTimeDrop](/) gibi araçlar bunu telefonunuzda otomatik olarak oturum kodunuzla önceden doldurulmuş bir "katılma" sayfası açmak için kullanır. Onu tararsınız, bağlanırsınız.

## Nasıl Çalışır: Adım Adım

OneTimeDrop'un QR kodunu kullandığınızda perde arkasında şunlar oluyor:

### 1. Masaüstü bir oturum oluşturur

OneTimeDrop'u bir bilgisayarda açtığınızda sunucu şunları oluşturur:
- Benzersiz bir **oturum kimliği** (rastgele bir dize)
- **8 haneli eşleştirme kodu**
- İki **oturum jetonu** — her cihaz için bir tane

### 2. Bir QR kodu oluşturulur

Ekranda aşağıdaki gibi bir URL'yi kodlayan bir QR kodu görüntülenir:
''''
https://onetimedrop.io/join?code=12345678
''''

### 3. Telefon tarar ve katılır

Telefonunuz QR'yi taradığında bu URL'yi açar. Katıl sayfası, URL'deki kodu okur ve telefonunuzu otomatik olarak oturuma bağlar. Saniyeler içinde eşleştiriliyorsunuz.

### 4. Dosyalar yüklendi ve alındı

Dosyalar telefonunuzdan gider → OneTimeDrop'un sunucusu → masaüstünden indirilebilir. Sunucu, dosyalar ulaştığı anda WebSockets aracılığıyla masaüstünü gerçek zamanlı olarak bilgilendirir.

## Neden Hızlı?

| Faktör | Hız etkisi |
|---|---|
| Hesap girişi yok | 30–60 saniye kurtarır |
| Önceden doldurulmuş kod | Yazmayı kaydeder |
| Gerçek zamanlı WebSocket senkronizasyonu | Anında masaüstü güncellemesi |
| Küçük oturum yükü | Sıfıra yakın gecikme |

QR kodu, en çok zaman alan adımı ortadan kaldırır: URL'yi veya kodu manuel olarak girme.

## QR Kodu Sizi Nasıl Korur?

QR kodu yalnızca katılma URL'sini ve 8 haneli oturum kodunuzu içerir. Aşağıdakileri **içermez**:
- Adınız veya e-posta adresiniz
- Cihaz bilgisi
- Dosya adları veya içeriği
- Kişisel olarak tanımlanabilir herhangi bir veri

Oturum jetonu (aslında dosya erişimine izin verir), QR kodunun kendisinde değil, yalnızca başarılı bir birleştirme sonrasında paylaşılır.

## QR'yi Tarayamazsam Ne Olur?

8 haneli kodu istediğiniz zaman [onetimedrop.io/join](/join) adresinden manuel olarak yazabilirsiniz. Kod aynı şekilde çalışır; kolaylık olması açısından her iki seçeneği de gösteriyoruz.

## Gizlilik ve Güvenlik İpucu

> ⚠️ **Sorumluluk reddi beyanı:** QR kodunuzun ekran görüntülerini herkese açık olarak paylaşmayın; kodu bilen herkes 10 dakikalık süre içinde oturumunuza katılabilir. Oturum sona erdikten sonra dosyalar otomatik olarak silinir.

## İlgili Gönderiler

- [QR vs Link vs Bluetooth: Hangi Dosya Aktarım Yöntemi Kazanır?](/blog/qr-vs-link-vs-bluetooth)
- [Tek Kullanımlık Kodla Dosya Nasıl Paylaşılır](/blog/share-file-one-time-code)
