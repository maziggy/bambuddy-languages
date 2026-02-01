import { useState, useMemo } from 'react'
import type { TranslationEntry } from '../App'

interface TranslationEditorProps {
  translations: TranslationEntry[]
  targetLanguage: string
  onUpdate: (key: string, value: string, isAuto?: boolean) => void
  onAutoTranslateAll: (fn: (texts: string[]) => Promise<string[]>) => Promise<void>
}

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
  const [apiKey, setApiKey] = useState('')
  const [showApiKeyInput, setShowApiKeyInput] = useState(false)

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
    if (!apiKey) {
      setShowApiKeyInput(true)
      return
    }

    setIsAutoTranslating(true)
    try {
      await onAutoTranslateAll(async (texts) => {
        // Using DeepL API
        const response = await fetch('https://api-free.deepl.com/v2/translate', {
          method: 'POST',
          headers: {
            'Authorization': `DeepL-Auth-Key ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: texts,
            target_lang: targetLanguage.toUpperCase().split('-')[0],
          }),
        })

        if (!response.ok) {
          throw new Error('Translation API error')
        }

        const data = await response.json()
        return data.translations.map((t: { text: string }) => t.text)
      })
    } catch (error) {
      console.error('Auto-translate failed:', error)
      alert('Auto-translation failed. Please check your API key and try again.')
    } finally {
      setIsAutoTranslating(false)
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
            {isAutoTranslating ? 'Translating...' : 'Auto-translate All Pending'}
          </button>

          {showApiKeyInput && (
            <input
              type="password"
              placeholder="DeepL API Key"
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              className="flex-1 bg-bambu-dark-tertiary rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-bambu-green"
            />
          )}

          <span className="text-sm text-bambu-gray ml-auto">
            Showing {filteredTranslations.length} of {translations.length} strings
          </span>
        </div>
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
