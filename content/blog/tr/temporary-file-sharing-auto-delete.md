---
title: >-
  Geçici Dosya Paylaşımının Açıklaması: 'Otomatik Silme' Gerçekte Ne Anlama
  Geliyor?
slug: temporary-file-sharing-auto-delete
description: >-
  Dosya paylaşımında otomatik silme, dosyalarınızın belirli bir süre sonra
  kaybolması anlamına gelir. Peki gerçekte nasıl çalışıyor ve gerçekten özel mi?
date: '2026-03-08'
category: Güvenlik
readingTime: 6 min read
canonical: 'https://onetimedrop.io/tr/blog/temporary-file-sharing-auto-delete'
---
## Geçici Dosya Paylaşımı Nedir?

Geçici dosya paylaşımı, yüklenen dosyaların, indirilip indirilmediğine bakılmaksızın belirli bir süre sonunda otomatik olarak silindiği hizmetleri ifade eder. Bulut depolamanın (Google Drive, Dropbox) aksine, geçici hizmetler dosyalarınızı süresiz olarak saklamaz.

Örneğin OneTimeDrop, **10 dakika** sonra tüm dosyaları ve oturum verilerini siler.

## Otomatik Silme Aslında Nasıl Çalışır?

İşte teknik gerçek:

### 1. Dosyalar Sunucuda Saklanır (Geçici Olarak)

Bir dosyayı yüklediğinizde, bu dosya hizmetin sunucusuna gider ve geçici bir dizinde saklanır (ör. `/tmp`). Bu sizin cihazınız değil; bu bir bulut sunucusudur.

### 2. Bir Zamanlayıcı Ayarlandı

Oturum oluşturulduğunda bir oturum zamanlayıcısı başlar. Süresi dolduğunda bir temizleme işlemi:
- Yüklenen tüm dosyaları diskten siler
- Oturum meta verilerini bellekten kaldırır
- Tüm erişim belirteçlerini geçersiz kılar

### 3. Dosya Erişilemez Hale Geliyor

Silme işleminden sonra indirme bağlantıları 404 hatası döndürüyor. Dosya en azından uygulama katmanından gitti.

## "Silinmiş" Her Zaman Ne Anlama Gelmez

> **Önemli:** Uygulama katmanından silme işlemi adli imkansızlığı garanti etmez. Sunucu sabit diskleri, üzerine yazılana kadar ayrılmamış sektörlerdeki verileri tutabilir. Ancak, tüm pratik amaçlar doğrultusunda, silinen geçici dosyalara fiziksel sunucu erişimi olmadan erişilemez ve kurtarılamaz.

Günlük kullanım durumlarının büyük çoğunluğu için (belge yazdırma, fotoğraf paylaşma, sunum aktarma) bu düzeyde bir silme işlemi fazlasıyla yeterlidir.

## OneTimeDrop Dosyaları Nerede Saklar (Ve Ne Kadar Süre)

| Veri | Konum | TTL |
|---|---|---|
| Yüklenen dosyalar | Sunucu /tmp diski | 10 dakika |
| Oturum Kimliği + belirteçler | Sunucu belleği | 10 dakika |
| Eşleştirme kodu | Sunucu belleği | 10 dakika |
| Sunucu günlükleri (IP'ler) | Günlük sistemi | 7 güne kadar |

## Kalıcı Paylaşımla Karşılaştırma

| Hizmet | Şu tarihten sonra silinen dosyalar | Hesap gerekli |
|---|---|---|
| OneTimeDrop | **10 dakika** | Hayır |
| WeTransfer (ücretsiz) | 7 gün | Hayır |
| Google Drive | Asla (silmediğiniz sürece) | Evet |
| WhatsApp | Asla | Evet |

## Geçici Paylaşım için En İyi Uygulamalar

1. Kimsenin görmesini istemeyeceğiniz dosyaları aktarmayın
2. Hassas belgeler için güvenli ağlar kullanın (halka açık Wi-Fi değil)
3. Otomatik silme işlemini beklemek istemiyorsanız, indirme işleminden sonra oturumu manuel olarak temizleyin.
4. Oturumunuzun QR kodunun ekran görüntüsünü almayın veya herkese açık olarak paylaşmayın

## Gizlilik ve Güvenlik İpucu

> ⚠️ **Sorumluluk reddi beyanı:** OneTimeDrop sıradan, hassas olmayan dosya aktarımları için tasarlanmıştır. Dosyalar 10 dakika sonra otomatik olarak silinir. Gizli iş belgelerini, tıbbi kayıtları veya mali bilgileri paylaşılan veya halka açık bilgisayarlara yüklemeyin.

## SSS

**S: OneTimeDrop ekibi yüklediğim dosyaları görebilir mi?**  
C: Dosyalar sunucuda geçici olarak saklanır, dolayısıyla teknik olarak sunucu yöneticilerinin erişimi vardır. OneTimeDrop dosya içeriğini incelemez veya üçüncü taraflarla paylaşmaz.

**S: Dosyayı indirmeden oturumun süresi dolarsa ne olur?**  
C: Dosya silinir ve indirme bağlantısı geçersiz hale gelir. Yeni bir oturum başlatmanız gerekir.

**S: Otomatik silme, uçtan uca şifrelemeyle aynı şey midir?**  
C: Hayır. Otomatik silme, depolama ömrüyle ilgilidir; uçtan uca şifreleme, aktarım sırasında dosyayı kimin okuyabileceği ile ilgilidir. Bunlar farklı korumalardır.

## İlgili Gönderiler

- [Genel Bilgisayarlarda Güvenli Dosya Paylaşımı: Pratik Bir Kontrol Listesi](/blog/secure-file-sharing-public-computers)
- [Özel Dosya Paylaşımı: Paylaşılan Ağlarda Nelerden Kaçınılmalıdır](/blog/private-file-sharing-shared-networks)
