---
title: 'Özel Dosya Paylaşımı: Paylaşılan Ağlarda Nelerden Kaçınılmalı?'
slug: private-file-sharing-shared-networks
description: >-
  Otellerde, kafelerde veya okullarda paylaşılan Wi-Fi, dosya aktarımlarınızı
  riske atar. Nelerden kaçınmanız gerektiğini ve nasıl gizli kalacağınızı bilin.
date: '2026-03-08'
category: Güvenlik
readingTime: 6 min read
canonical: 'https://onetimedrop.io/tr/blog/private-file-sharing-shared-networks'
---
## Herkese Açık Wi-Fi Üzerinde Dosya Aktarımı Güvenli mi?

Paylaşılan bir Wi-Fi ağına (otel, havaalanı, kafe) bağlandığınızda, ağ trafiğiniz potansiyel olarak aynı ağdaki diğer kullanıcılar tarafından ele geçirilebilir; bu teknik "ortadaki adam" saldırısı olarak adlandırılır.

Ancak HTTPS şifrelemesi sayesinde bu risk eskisine göre çok daha az rahatsız edici.

## HTTPS: İlk Koruma Katmanınız

Modern dosya aktarım hizmetleri (OneTimeDrop dahil), cihazınız ile sunucu arasındaki bağlantınızı uçtan uca şifreleyen HTTPS'yi kullanır. Birisi Wi-Fi ağını koklasa bile HTTPS trafiğinizin içeriğini göremez.

**Kural 1:** Herhangi bir dosyayı yüklemeden önce daima adres çubuğunda "https://" olup olmadığını kontrol edin.

## Herkese Açık Wi-Fi Hala Neleri Ortaya Çıkarabilir?

HTTPS ile bile halka açık Wi-Fi şunları ortaya çıkarabilir:
- Hangi web sitelerini ziyaret ettiğiniz (alan adları, URL'ler değil)
- Bağlandığınızda ve bağlantınız kesildiğinde
- Ne kadar veri aktardığınız (ne olduğu değil)

Bu, tipik dosya aktarımları için minimum düzeyde maruz kalmadır.

## Paylaşılan Ağlarda Nelerden Kaçınılmalı

### 1. Şifrelenmemiş aktarım uygulamaları
FTP veya HTTP (HTTPS değil) kullanan eski masaüstü uygulamalarından kaçının. Bunlar dosya adlarını ve içeriği düz metin olarak gösterir.

### 2. Zayıf keşif özelliğine sahip eşler arası araçlar
Bazı "yerel ağ" araçları (Snapdrop'un eski sürümleri veya yerel Bonjour hizmetleri gibi) aynı ağdaki başkaları tarafından keşfedilebilir. Bunun yerine internet tabanlı hizmetleri kullanın.

### 3. Oturumları açık bırakmak
Dosyaları paylaşılan bir ağ üzerinden aktarırsanız ve oturumu açık bırakırsanız, oturum kimliğinizi bilen biri bu oturumu izleyebilir (yine de gizli belirtece ihtiyaç duyacaktır).

**Kural 2:** Aktarımdan hemen sonra oturumunuzu daima kapatın veya temizleyin.

### 4. Riskli ağlara son derece hassas dosyalar yüklemek
Banka bilgileri, yasal belgeler, tıbbi kayıtlar; bunları HTTPS olsa bile bir kafenin Wi-Fi ağına yüklemeyin. Güvenilir bir ağa bağlanana kadar bekleyin.

## Paylaşılan Ağlar için Güvenli Dosya Aktarımı Kontrol Listesi

- [ ] URL `https://` ile başlar
- [ ] Dosya hassas finansal/tıbbi veriler içermiyor
- [ ] Transferden sonra oturum kapatılır veya temizlenir
- [ ] Wi-Fi yetersiz görünüyorsa mobil veriler kullanılır (ör. şifresiz "FREE_AIRPORT_WIFI")

## Herkese açık Wi-Fi'de OneTimeDrop: Değerlendirmemiz

[OneTimeDrop](/) baştan sona HTTPS kullanır. Oturumların süresi sınırlıdır (10 dakika) ve dosya erişimi gizli bir oturum belirteci gerektirir. Tipik günlük dosyalar (fotoğraflar, sunumlar, PDF'ler) için OneTimeDrop'un halka açık Wi-Fi üzerinden kullanılması yukarıdaki önlemlerle güvenlidir.

> ⚠️ **Sorumluluk reddi beyanı:** OneTimeDrop dosyaları 10 dakika sonra otomatik olarak silinir. Hassas kişisel belgeleri (pasaportlar, banka ekstreleri, gizli iş belgeleri) asla halka açık bilgisayarlara veya riskli ağlara yüklemeyin.

## SSS

**S: Mobil veri kullanmak, herkese açık Wi-Fi kullanmaktan daha mı güvenli?**  
C: Genel olarak evet; mobil veriler doğrudan operatörünüzün ağına gider ve yakındaki diğer kullanıcılarla paylaşılmaz.

**S: Ekstra koruma için VPN kullanabilir miyim?**  
C: VPN başka bir şifreleme katmanı ekler ve ziyaret ettiğiniz sitelerin alan adlarını bile gizler. Hassas ağ ortamları için iyi bir seçenek.

**S: OneTimeDrop otel portalının Wi-Fi bağlantısında çalışıyor mu?**  
C: Otelin sabit portalı (oda numarası/şifre gerektiren sayfa) üzerinden kimlik doğrulaması yaptığınızda çalışmalıdır.

## İlgili Gönderiler

- [Genel Bilgisayarlarda Güvenli Dosya Paylaşımı: Pratik Bir Kontrol Listesi](/blog/secure-file-sharing-public-computers)
- [Geçici Dosya Paylaşımı Açıklaması: Otomatik Silme Gerçekte Ne Anlama Gelir](/blog/temporary-file-sharing-auto-delete)
