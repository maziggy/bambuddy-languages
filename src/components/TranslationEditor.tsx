import { useState, useMemo } from 'react'
import type { TranslationEntry } from '../App'

interface TranslationEditorProps {
  translations: TranslationEntry[]
  targetLanguage: string
  onUpdate: (key: string, value: string, isAuto?: boolean) => void
  onAutoTranslateAll: (fn: (texts: string[]) => Promise<string[]>) => Promise<void>
}

// Default LibreTranslate instance - can be changed
const DEFAULT_LIBRETRANSLATE_URL = 'https://translate.bambuddy.cool'

export default function TranslationEditor({
  translations,
  targetLanguage,
  onUpdate,
  onAutoTranslateAll,
}: TranslationEditorProps) {
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'translated' | 'auto'>('all')
  const [isAutoTranslating, setIsAutoTranslating] = useState(false)
  const [translateUrl, setTranslateUrl] = useState(DEFAULT_LIBRETRANSLATE_URL)
  const [showSettings, setShowSettings] = useState(false)
  const [progress, setProgress] = useState({ current: 0, total: 0 })

  const categories = useMemo(() => {
    const cats = new Set(translations.map(t => t.category))
    return ['all', ...Array.from(cats).sort()]
  }, [translations])

  const filteredTranslations = useMemo(() => {
    return translations.filter(t => {
      if (search && !t.key.toLowerCase().includes(search.toLowerCase()) &&
          !t.english.toLowerCase().includes(search.toLowerCase())) {
        return false
      }
      if (categoryFilter !== 'all' && t.category !== categoryFilter) {
        return false
      }
      if (statusFilter === 'pending' && t.translated) return false
      if (statusFilter === 'translated' && !t.translated) return false
      if (statusFilter === 'auto' && !t.isAuto) return false
      return true
    })
  }, [translations, search, categoryFilter, statusFilter])

  const handleAutoTranslate = async () => {
    setIsAutoTranslating(true)
    setProgress({ current: 0, total: 0 })

    try {
      await onAutoTranslateAll(async (texts) => {
        setProgress({ current: 0, total: texts.length })
        const results: string[] = []

        // Map language codes to LibreTranslate format
        const targetLang = targetLanguage.toLowerCase().split('-')[0]

        // Translate in batches of 10 to avoid overwhelming the server
        const batchSize = 10
        for (let i = 0; i < texts.length; i += batchSize) {
          const batch = texts.slice(i, i + batchSize)

          const batchResults = await Promise.all(
            batch.map(async (text) => {
              try {
                const response = await fetch(`${translateUrl}/translate`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    q: text,
                    source: 'en',
                    target: targetLang,
                  }),
                })

                if (!response.ok) {
                  console.error('Translation failed for:', text)
                  return ''
                }

                const data = await response.json()
                return data.translatedText || ''
              } catch (err) {
                console.error('Translation error:', err)
                return ''
              }
            })
          )

          results.push(...batchResults)
          setProgress({ current: results.length, total: texts.length })
        }

        return results
      })
    } catch (error) {
      console.error('Auto-translate failed:', error)
      alert('Auto-translation failed. Please check the LibreTranslate URL and try again.')
    } finally {
      setIsAutoTranslating(false)
      setProgress({ current: 0, total: 0 })
    }
  }

  return (
    <div className="bg-bambu-dark-secondary rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="p-4 border-b border-bambu-dark-tertiary space-y-3">
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Search strings..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 bg-bambu-dark-tertiary rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-bambu-green"
          />
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="bg-bambu-dark-tertiary rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-bambu-green"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat === 'all' ? 'All Categories' : cat}
              </option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as typeof statusFilter)}
            className="bg-bambu-dark-tertiary rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-bambu-green"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="translated">Translated</option>
            <option value="auto">Auto-translated</option>
          </select>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleAutoTranslate}
            disabled={isAutoTranslating}
            className="px-4 py-2 bg-bambu-green hover:bg-bambu-green-dark text-white rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {isAutoTranslating
              ? `Translating... ${progress.current}/${progress.total}`
              : 'Auto-translate All Pending'}
          </button>

          <button
            onClick={() => setShowSettings(!showSettings)}
            className="px-3 py-2 bg-bambu-dark-tertiary hover:bg-bambu-dark-tertiary/70 rounded-lg transition-colors"
            title="Translation settings"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>

          <span className="text-sm text-bambu-gray ml-auto">
            Showing {filteredTranslations.length} of {translations.length} strings
          </span>
        </div>

        {showSettings && (
          <div className="p-3 bg-bambu-dark-tertiary rounded-lg">
            <label className="block text-sm text-bambu-gray mb-1">
              LibreTranslate URL
            </label>
            <input
              type="text"
              value={translateUrl}
              onChange={e => setTranslateUrl(e.target.value)}
              placeholder="https://translate.bambuddy.cool"
              className="w-full bg-bambu-dark-primary rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-bambu-green"
            />
            <p className="text-xs text-bambu-gray mt-1">
              Enter your LibreTranslate instance URL or use the default
            </p>
          </div>
        )}
      </div>

      {/* Translation list */}
      <div className="max-h-[calc(100vh-320px)] overflow-y-auto">
        {filteredTranslations.map(entry => (
          <div
            key={entry.key}
            className="p-4 border-b border-bambu-dark-tertiary hover:bg-bambu-dark-primary/30"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs px-2 py-0.5 rounded bg-bambu-dark-tertiary text-bambu-gray">
                {entry.category}
              </span>
              <span className="text-sm text-bambu-gray font-mono">{entry.key}</span>
              {entry.isAuto && entry.translated && (
                <span className="text-xs px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-500">
                  Auto
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-bambu-gray mb-1">English</div>
                <div className="bg-bambu-dark-tertiary rounded-lg px-3 py-2 text-white/80">
                  {entry.english}
                </div>
              </div>
              <div>
                <div className="text-xs text-bambu-gray mb-1">Translation</div>
                <input
                  type="text"
                  value={entry.translated}
                  onChange={e => onUpdate(entry.key, e.target.value, false)}
                  placeholder="Enter translation..."
                  className="w-full bg-bambu-dark-tertiary rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-bambu-green"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
