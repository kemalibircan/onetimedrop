---
title: Cómo compartir un archivo con un código de un solo uso (paso a paso)
slug: share-file-one-time-code
description: >-
  Un código de un solo uso protege sus archivos del acceso no autorizado. Así es
  como funciona la transferencia de archivos basada en código y cómo utilizarla.
date: '2026-03-08'
category: Cómo hacerlo
readingTime: 5 min read
canonical: 'https://onetimedrop.io/es/blog/share-file-one-time-code'
---
## ¿Qué es un código de un solo uso para compartir archivos?

Un código de un solo uso es un código corto (a menudo de 6 a 10 dígitos) que otorga acceso temporal a un recurso. Al compartir archivos, significa que solo alguien con su código puede unirse a su sesión y recibir sus archivos.

A diferencia de un enlace permanente (que se puede reenviar, marcar y reutilizar indefinidamente), un código de un solo uso:
- Caduca después de un tiempo determinado (por ejemplo, 10 minutos)
- No se puede adivinar fácilmente (aleatorio, 8 dígitos → 100 millones de combinaciones)
- Se invalida una vez expira la sesión.

## Cómo OneTimeDrop utiliza un código de un solo uso

[OneTimeDrop](/) genera un código nuevo de 8 dígitos cada vez que creas una sesión en el escritorio:

1. Abra [onetimedrop.io](/): aparecerá instantáneamente un nuevo código de 8 dígitos
2. Comparta ese código (verbalmente, por escrito o mediante QR) con el destinatario del archivo.
3. El destinatario lo ingresa en [onetimedrop.io/join](/join) dentro de los 10 minutos
4. La sesión se conecta → transferencia de archivos

Después de 10 minutos, el código desaparece. Incluso si alguien lo copia, ya no funciona.

## ¿Por qué es más seguro que un enlace estático?

| Característica | Enlace estático | Código de un solo uso |
|---|---|---|
| Se puede reenviar | ✅ Sí | Limitado (TTL corto) |
| Caduca automáticamente | ❌ Rara vez | ✅ Después de 10 min |
| Adivinable por bot | Posible | Duro (8 dígitos, tasa limitada) |
| Requiere cuenta | ❌ No | ❌ No |

## Paso a paso: compartir con un código en la vida real

**Escenario:** Quiere imprimir un documento en la biblioteca sin escribir su dirección de correo electrónico.

1. En la computadora de la biblioteca, abra OneTimeDrop; anote el código de 8 dígitos
2. En tu teléfono (desde tu bolsillo), abre [onetimedrop.io/join](/join)
3. Escribe el código de 8 dígitos que viste en la pantalla.
4. Toca Conectar: tu teléfono se une a la sesión.
5. Seleccione el PDF que desea imprimir
6. Cárgalo: aparece en la computadora.
7. Descargar e imprimir

Tiempo total: ~30 segundos. Cero contraseñas escritas.

## ¿Qué pasa si alguien obtiene el código?

- Si lo ingresan antes de que te conectes, tu sesión aún está protegida por el token de sesión
- La limitación de velocidad evita los intentos de fuerza bruta (máximo 10 intentos por minuto por IP)
- Después de 10 minutos, el código deja de ser válido permanentemente.

> ⚠️ **Descargo de responsabilidad:** No compartas tu código de sesión públicamente ni en las redes sociales. El código otorga acceso a su sesión durante 10 minutos. Los archivos se eliminan automáticamente después de que expira la sesión.

## Preguntas frecuentes

**P: ¿El código de 8 dígitos es lo mismo que una contraseña?**  
R: Es un mecanismo de emparejamiento, no una contraseña. Después del emparejamiento, el acceso a los archivos requiere un token de sesión independiente (que se gestiona automáticamente en el navegador).

**P: ¿Pueden dos teléfonos unirse a la misma sesión?**  
R: Actualmente, OneTimeDrop empareja un teléfono por sesión. Para compartir varios dispositivos, se necesitaría una nueva sesión.

**P: ¿Cuál es la diferencia entre el código y el código QR?**  
R: Hacen lo mismo. El QR es un atajo conveniente para escanear y unirse; el código es para entrada manual.

## Publicaciones relacionadas

- [Compartir archivos con código QR: cómo funciona](/blog/qr-code-file-sharing-explained)
- [Cómo transferir archivos a través de Wi-Fi sin instalar nada](/blog/transfer-files-wifi-sin-instalar)
