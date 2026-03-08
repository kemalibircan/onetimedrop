---
title: "How to Share a File With a One-Time Code (Step-by-Step)"
slug: "share-file-one-time-code"
description: "A one-time code protects your files from unauthorized access. Here's how code-based file transfer works and how to use it."
date: "2026-03-08"
category: "How-To"
readingTime: "5 min read"
canonical: "https://onetimedrop.io/blog/share-file-one-time-code"
---

## What Is a One-Time Code for File Sharing?

A one-time code is a short code (often 6–10 digits) that grants temporary access to a resource. In file sharing, it means only someone with your code can join your session and receive your files.

Unlike a permanent link (which can be forwarded, bookmarked, and reused indefinitely), a one-time code:
- Expires after a set time (e.g., 10 minutes)
- Can't be guessed easily (random, 8-digit → 100 million combinations)
- Is invalidated once the session expires

## How OneTimeDrop Uses a One-Time Code

[OneTimeDrop](/) generates a fresh 8-digit code every time you create a session on the desktop:

1. Open [onetimedrop.io](/) — a new 8-digit code appears instantly
2. Share that code (verbally, by writing, or via the QR) with the file recipient
3. Recipient enters it at [onetimedrop.io/join](/join) within 10 minutes
4. Session connects → files transfer

After 10 minutes, the code is gone. Even if someone copies it down, it no longer works.

## Why Is This More Secure Than a Static Link?

| Feature | Static link | One-time code |
|---|---|---|
| Can be forwarded | ✅ Yes | Limited (short TTL) |
| Expires automatically | ❌ Rarely | ✅ After 10 min |
| Guessable by bot | Possible | Hard (8-digit, rate-limited) |
| Requires account | ❌ No | ❌ No |

## Step-by-Step: Sharing With a Code in Real Life

**Scenario:** You want to print a document at the library without typing your email address.

1. On the library computer, open OneTimeDrop — note the 8-digit code
2. On your phone (from your pocket), open [onetimedrop.io/join](/join)
3. Type the 8-digit code you saw on the screen
4. Tap Connect — your phone joins the session
5. Select the PDF you want to print
6. Upload it — it appears on the computer
7. Download and print

Total time: ~30 seconds. Zero passwords typed.

## What If Someone Gets the Code?

- If they enter it before you connect, your session is still protected by the session token
- Rate limiting prevents brute-force attempts (max 10 tries per minute per IP)
- After 10 minutes, the code is permanently invalid

> ⚠️ **Disclaimer:** Don't share your session code publicly or on social media. The code grants join access to your session for 10 minutes. Files are auto-deleted after session expiry.

## FAQ

**Q: Is the 8-digit code the same as a password?**  
A: It's a pairing mechanism, not a password. After pairing, file access requires a separate session token (handled automatically in the browser).

**Q: Can two phones join the same session?**  
A: Currently, OneTimeDrop pairs one phone per session. For multi-device sharing, a new session would be needed.

**Q: What's the difference between the code and the QR code?**  
A: They do the same thing. The QR is a convenient scan-to-join shortcut; the code is for manual entry.

## Related Posts

- [QR Code File Sharing: How It Works](/blog/qr-code-file-sharing-explained)
- [How to Transfer Files Over Wi-Fi Without Installing Anything](/blog/transfer-files-wifi-without-installing)
