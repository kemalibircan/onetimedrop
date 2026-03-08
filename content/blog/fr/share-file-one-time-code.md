---
title: Comment partager un fichier avec un code à usage unique (étape par étape)
slug: share-file-one-time-code
description: >-
  Un code à usage unique protège vos fichiers contre tout accès non autorisé.
  Voici comment fonctionne le transfert de fichiers basé sur du code et comment
  l'utiliser.
date: '2026-03-08'
category: Comment faire
readingTime: 5 min read
canonical: 'https://onetimedrop.io/fr/blog/share-file-one-time-code'
---
## Qu'est-ce qu'un code à usage unique pour le partage de fichiers ?

Un code à usage unique est un code court (souvent composé de 6 à 10 chiffres) qui accorde un accès temporaire à une ressource. Dans le partage de fichiers, cela signifie que seule une personne possédant votre code peut rejoindre votre session et recevoir vos fichiers.

Contrairement à un lien permanent (qui peut être transféré, ajouté à vos favoris et réutilisé indéfiniment), un code à usage unique :
- Expire après une durée définie (par exemple, 10 minutes)
- Ne peut pas être deviné facilement (aléatoire, 8 chiffres → 100 millions de combinaisons)
- Est invalidé une fois la session expirée

## Comment OneTimeDrop utilise un code à usage unique

[OneTimeDrop](/) génère un nouveau code à 8 chiffres chaque fois que vous créez une session sur le bureau :

1. Ouvrez [onetimedrop.io](/) — un nouveau code à 8 chiffres apparaît instantanément
2. Partagez ce code (verbalement, par écrit ou via le QR) avec le destinataire du fichier
3. Le destinataire le saisit sur [onetimedrop.io/join](/join) dans les 10 minutes
4. Connexions de session → transfert de fichiers

Au bout de 10 minutes, le code a disparu. Même si quelqu’un le copie, cela ne fonctionne plus.

## Pourquoi est-ce plus sécurisé qu'un lien statique ?

| Fonctionnalité | Lien statique | Code à usage unique |
|---|---|---|
| Peut être transmis | ✅ Oui | Limité (TTL court) |
| Expire automatiquement | ❌ Rarement | ✅ Après 10 minutes |
| Devinable par bot | Possible | Dur (8 chiffres, débit limité) |
| Nécessite un compte | ❌ Non | ❌ Non |

## Étape par étape : partager avec un code dans la vraie vie

**Scénario :** Vous souhaitez imprimer un document à la bibliothèque sans saisir votre adresse e-mail.

1. Sur l'ordinateur de la bibliothèque, ouvrez OneTimeDrop — notez le code à 8 chiffres
2. Sur votre téléphone (depuis votre poche), ouvrez [onetimedrop.io/join](/join)
3. Tapez le code à 8 chiffres que vous avez vu à l'écran
4. Appuyez sur Connecter : votre téléphone rejoint la session
5. Sélectionnez le PDF que vous souhaitez imprimer
6. Téléchargez-le — il apparaît sur l'ordinateur
7. Téléchargez et imprimez

Durée totale : ~30 secondes. Aucun mot de passe saisi.

## Et si quelqu'un obtient le code ?

- S'ils le saisissent avant votre connexion, votre session est toujours protégée par le jeton de session
- La limitation du débit empêche les tentatives de force brute (maximum 10 essais par minute et par IP)
- Au bout de 10 minutes, le code est définitivement invalide

> ⚠️ **Avertissement :** Ne partagez pas votre code de session publiquement ou sur les réseaux sociaux. Le code accorde l’accès à votre session pendant 10 minutes. Les fichiers sont automatiquement supprimés après l'expiration de la session.

##FAQ

**Q : Le code à 8 chiffres est-il identique à un mot de passe ?**  
R : Il s’agit d’un mécanisme de couplage, pas d’un mot de passe. Après le couplage, l'accès aux fichiers nécessite un jeton de session distinct (géré automatiquement dans le navigateur).

**Q : Deux téléphones peuvent-ils rejoindre la même session ?**  
R : Actuellement, OneTimeDrop associe un téléphone par session. Pour le partage multi-appareils, une nouvelle session serait nécessaire.

**Q : Quelle est la différence entre le code et le code QR ?**  
R : Ils font la même chose. Le QR est un raccourci pratique pour numériser pour rejoindre ; le code est destiné à la saisie manuelle.

## Articles connexes

- [Partage de fichiers QR Code : comment ça marche](/blog/qr-code-file-sharing-explained)
- [Comment transférer des fichiers via Wi-Fi sans rien installer](/blog/transfer-files-wifi-without-installing)
