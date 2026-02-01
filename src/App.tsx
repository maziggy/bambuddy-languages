import { useState } from 'react'
import Header from './components/Header'
import LanguageSelector from './components/LanguageSelector'
import TranslationEditor from './components/TranslationEditor'
import ExportPanel from './components/ExportPanel'
import sourceStrings from './strings/en.json'

export interface TranslationEntry {
  key: string
  category: string
  english: string
  translated: string
  isAuto: boolean
}

// Languages already available in Bambuddy
// This will be updated as translations are added
const AVAILABLE_LANGUAGES: { code: string; name: string; native: string; completion: number }[] = [
  // Example: { code: 'de', name: 'German', native: 'Deutsch', completion: 100 },
]

function App() {
  const [targetLanguage, setTargetLanguage] = useState('')
  const [languageName, setLanguageName] = useState('')
  const [translations, setTranslations] = useState<TranslationEntry[]>([])
  const [started, setStarted] = useState(false)

  const handleStartTranslation = (langCode: string, langName: string) => {
    setTargetLanguage(langCode)
    setLanguageName(langName)

    // Initialize translations from source strings
    const entries: TranslationEntry[] = Object.entries(sourceStrings).map(([key, value]) => ({
      key,
      category: key.split('.')[0],
      english: value as string,
      translated: '',
      isAuto: false,
    }))

    setTranslations(entries)
    setStarted(true)
  }

  const handleUpdateTranslation = (key: string, value: string, isAuto: boolean = false) => {
    setTranslations(prev =>
      prev.map(t => t.key === key ? { ...t, translated: value, isAuto } : t)
    )
  }

  const handleAutoTranslateAll = async (translateFn: (texts: string[]) => Promise<string[]>) => {
    const untranslated = translations.filter(t => !t.translated)
    if (untranslated.length === 0) return

    const texts = untranslated.map(t => t.english)
    const results = await translateFn(texts)

    setTranslations(prev => {
      const updated = [...prev]
      untranslated.forEach((t, i) => {
        const idx = updated.findIndex(u => u.key === t.key)
        if (idx !== -1 && results[i]) {
          updated[idx] = { ...updated[idx], translated: results[i], isAuto: true }
        }
      })
      return updated
    })
  }

  const getExportData = () => {
    const result: Record<string, string> = {}
    translations.forEach(t => {
      if (t.translated) {
        result[t.key] = t.translated
      }
    })
    return result
  }

  const completionStats = {
    total: translations.length,
    translated: translations.filter(t => t.translated).length,
    auto: translations.filter(t => t.isAuto && t.translated).length,
  }

  if (!started) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <LanguageSelector
            onStart={handleStartTranslation}
            availableLanguages={AVAILABLE_LANGUAGES}
          />
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        languageCode={targetLanguage}
        languageName={languageName}
        stats={completionStats}
      />
      <main className="flex-1 container mx-auto px-4 py-8 flex gap-6">
        <div className="flex-1">
          <TranslationEditor
            translations={translations}
            targetLanguage={targetLanguage}
            onUpdate={handleUpdateTranslation}
            onAutoTranslateAll={handleAutoTranslateAll}
          />
        </div>
        <div className="w-80">
          <ExportPanel
            languageCode={targetLanguage}
            languageName={languageName}
            data={getExportData()}
            stats={completionStats}
          />
        </div>
      </main>
    </div>
  )
}

export default App
