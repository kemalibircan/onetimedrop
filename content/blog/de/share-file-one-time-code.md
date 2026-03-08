---
title: So teilen Sie eine Datei mit einem Einmalcode (Schritt für Schritt)
slug: share-file-one-time-code
description: >-
  Ein Einmalcode schützt Ihre Dateien vor unbefugtem Zugriff. Hier erfahren Sie,
  wie die codebasierte Dateiübertragung funktioniert und wie Sie sie verwenden.
date: '2026-03-08'
category: Anleitung
readingTime: 5 min read
canonical: 'https://onetimedrop.io/de/blog/share-file-one-time-code'
---
## Was ist ein Einmalcode für die Dateifreigabe?

Ein Einmalcode ist ein kurzer Code (häufig 6–10 Ziffern), der vorübergehenden Zugriff auf eine Ressource gewährt. Bei der Dateifreigabe bedeutet dies, dass nur jemand mit Ihrem Code an Ihrer Sitzung teilnehmen und Ihre Dateien empfangen kann.

Im Gegensatz zu einem permanenten Link (der weitergeleitet, mit Lesezeichen versehen und auf unbestimmte Zeit wiederverwendet werden kann) ist ein Einmalcode:
- Läuft nach einer festgelegten Zeit ab (z. B. 10 Minuten)
- Nicht leicht zu erraten (zufällig, 8-stellig → 100 Millionen Kombinationen)
– Wird ungültig, sobald die Sitzung abläuft

## Wie OneTimeDrop einen Einmalcode verwendet

[OneTimeDrop](/) generiert jedes Mal, wenn Sie eine Sitzung auf dem Desktop erstellen, einen neuen 8-stelligen Code:

1. Öffnen Sie [onetimedrop.io](/) – sofort erscheint ein neuer 8-stelliger Code
2. Teilen Sie diesen Code (mündlich, schriftlich oder über den QR) mit dem Dateiempfänger
3. Der Empfänger gibt es innerhalb von 10 Minuten unter [onetimedrop.io/join](/join) ein
4. Sitzung verbindet sich → Dateiübertragung

Nach 10 Minuten ist der Code verschwunden. Selbst wenn jemand es kopiert, funktioniert es nicht mehr.

## Warum ist dies sicherer als ein statischer Link?

| Funktion | Statischer Link | Einmalcode |
|---|---|---|
| Kann weitergeleitet werden | ✅ Ja | Limited (kurz TTL) |
| Läuft automatisch ab | ❌ Selten | ✅ Nach 10 Min. |
| Vom Bot errätbar | Möglich | Hart (8-stellig, ratenbegrenzt) |
| Erfordert Konto | ❌ Nein | ❌ Nein |

## Schritt-für-Schritt: Teilen mit einem Code im wirklichen Leben

**Szenario:** Sie möchten ein Dokument in der Bibliothek ausdrucken, ohne Ihre E-Mail-Adresse einzugeben.

1. Öffnen Sie auf dem Bibliothekscomputer OneTimeDrop – notieren Sie sich den 8-stelligen Code
2. Öffnen Sie auf Ihrem Telefon (aus Ihrer Tasche) [onetimedrop.io/join](/join)
3. Geben Sie den 8-stelligen Code ein, den Sie auf dem Bildschirm gesehen haben
4. Tippen Sie auf „Verbinden“ – Ihr Telefon nimmt an der Sitzung teil
5. Wählen Sie die PDF-Datei aus, die Sie drucken möchten
6. Laden Sie es hoch – es erscheint auf dem Computer
7. Herunterladen und ausdrucken

Gesamtzeit: ~30 Sekunden. Keine Passwörter eingegeben.

## Was passiert, wenn jemand den Code erhält?

- Wenn sie es eingeben, bevor Sie eine Verbindung herstellen, ist Ihre Sitzung weiterhin durch das Sitzungstoken geschützt
- Ratenbegrenzung verhindert Brute-Force-Versuche (maximal 10 Versuche pro Minute und IP)
- Nach 10 Minuten ist der Code dauerhaft ungültig

> ⚠️ **Haftungsausschluss:** Teilen Sie Ihren Sitzungscode nicht öffentlich oder in sozialen Medien. Der Code gewährt 10 Minuten lang Beitrittszugriff auf Ihre Sitzung. Dateien werden nach Ablauf der Sitzung automatisch gelöscht.

## FAQ

**F: Ist der 8-stellige Code dasselbe wie ein Passwort?**  
A: Es handelt sich um einen Kopplungsmechanismus, nicht um ein Passwort. Nach der Kopplung ist für den Dateizugriff ein separates Sitzungstoken erforderlich (wird automatisch im Browser verarbeitet).

**F: Können zwei Telefone an derselben Sitzung teilnehmen?**  
A: Derzeit koppelt OneTimeDrop ein Telefon pro Sitzung. Für die gemeinsame Nutzung mehrerer Geräte wäre eine neue Sitzung erforderlich.

**F: Was ist der Unterschied zwischen dem Code und dem QR-Code?**  
A: Sie machen das Gleiche. Der QR ist eine praktische Verknüpfung zum Scannen und Verbinden. Der Code dient der manuellen Eingabe.

## Verwandte Beiträge

- [QR-Code-Dateifreigabe: So funktioniert es](/blog/qr-code-file-sharing-explained)
- [So übertragen Sie Dateien über WLAN, ohne etwas zu installieren](/blog/transfer-files-wifi-without-installing)
