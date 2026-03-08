import 'server-only'

const dictionaries = {
  en: () => import('@/dictionaries/en.json').then((module) => module.default),
  de: () => import('@/dictionaries/de.json').then((module) => module.default).catch(() => import('@/dictionaries/en.json').then(m => m.default)),
  tr: () => import('@/dictionaries/tr.json').then((module) => module.default).catch(() => import('@/dictionaries/en.json').then(m => m.default)),
  fr: () => import('@/dictionaries/fr.json').then((module) => module.default).catch(() => import('@/dictionaries/en.json').then(m => m.default)),
  es: () => import('@/dictionaries/es.json').then((module) => module.default).catch(() => import('@/dictionaries/en.json').then(m => m.default)),
  ar: () => import('@/dictionaries/ar.json').then((module) => module.default).catch(() => import('@/dictionaries/en.json').then(m => m.default)),
}

export const getDictionary = async (locale: string) => {
  const load = dictionaries[locale as keyof typeof dictionaries]
  if (!load) return dictionaries.en()
  return load()
}
