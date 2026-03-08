import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const locales = ['en', 'de', 'tr', 'fr', 'es', 'ar']
const defaultLocale = 'en'

function getLocale(request: NextRequest): string {
  const acceptLanguage = request.headers.get('accept-language')
  if (!acceptLanguage) return defaultLocale
  
  const parsed = acceptLanguage.split(',').map(lang => {
    const parts = lang.split(';')
    return {
      code: parts[0].split('-')[0].trim().toLowerCase(),
      q: parts[1] ? parseFloat(parts[1].split('=')[1]) : 1
    }
  }).sort((a, b) => b.q - a.q)

  for (const lang of parsed) {
    if (locales.includes(lang.code)) {
      return lang.code
    }
  }
  
  return defaultLocale
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  if (
    pathname.includes('.') || 
    pathname.startsWith('/api') || 
    pathname.startsWith('/_next')
  ) {
    return NextResponse.next()
  }

  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) return NextResponse.next()

  const locale = getLocale(request)
  request.nextUrl.pathname = `/${locale}${pathname}`
  return NextResponse.redirect(request.nextUrl)
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|apple-touch-icon.png|og-image.png|robots.txt|sitemap.xml).*)',
  ],
}
