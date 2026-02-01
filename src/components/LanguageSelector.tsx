import { useState } from 'react'

interface LanguageSelectorProps {
  onStart: (code: string, name: string) => void
}

const COMMON_LANGUAGES = [
  { code: 'zh-CN', name: 'Chinese (Simplified)', native: '简体中文' },
  { code: 'zh-TW', name: 'Chinese (Traditional)', native: '繁體中文' },
  { code: 'ja', name: 'Japanese', native: '日本語' },
  { code: 'ko', name: 'Korean', native: '한국어' },
  { code: 'de', name: 'German', native: 'Deutsch' },
  { code: 'fr', name: 'French', native: 'Français' },
  { code: 'es', name: 'Spanish', native: 'Español' },
  { code: 'pt', name: 'Portuguese', native: 'Português' },
  { code: 'it', name: 'Italian', native: 'Italiano' },
  { code: 'nl', name: 'Dutch', native: 'Nederlands' },
  { code: 'pl', name: 'Polish', native: 'Polski' },
  { code: 'ru', name: 'Russian', native: 'Русский' },
  { code: 'tr', name: 'Turkish', native: 'Türkçe' },
  { code: 'ar', name: 'Arabic', native: 'العربية' },
  { code: 'th', name: 'Thai', native: 'ไทย' },
  { code: 'vi', name: 'Vietnamese', native: 'Tiếng Việt' },
]

export default function LanguageSelector({ onStart }: LanguageSelectorProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<typeof COMMON_LANGUAGES[0] | null>(null)
  const [customCode, setCustomCode] = useState('')
  const [customName, setCustomName] = useState('')
  const [useCustom, setUseCustom] = useState(false)

  const handleStart = () => {
    if (useCustom) {
      if (customCode && customName) {
        onStart(customCode, customName)
      }
    } else if (selectedLanguage) {
      onStart(selectedLanguage.code, selectedLanguage.name)
    }
  }

  const canStart = useCustom
    ? (customCode.length >= 2 && customName.length >= 2)
    : selectedLanguage !== null

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Start a New Translation</h2>
        <p className="text-bambu-gray">
          Select a language to translate Bambuddy into. Your contribution will help
          users around the world!
        </p>
      </div>

      <div className="bg-bambu-dark-secondary rounded-lg p-6">
        <h3 className="font-medium mb-4">Select Language</h3>

        <div className="grid grid-cols-2 gap-2 mb-6">
          {COMMON_LANGUAGES.map(lang => (
            <button
              key={lang.code}
              onClick={() => {
                setSelectedLanguage(lang)
                setUseCustom(false)
              }}
              className={`p-3 rounded-lg text-left transition-colors ${
                selectedLanguage?.code === lang.code && !useCustom
                  ? 'bg-bambu-green text-white'
                  : 'bg-bambu-dark-tertiary hover:bg-bambu-dark-tertiary/70'
              }`}
            >
              <div className="font-medium">{lang.name}</div>
              <div className="text-sm opacity-70">{lang.native}</div>
            </button>
          ))}
        </div>

        <div className="border-t border-bambu-dark-tertiary pt-4">
          <label className="flex items-center gap-2 mb-4 cursor-pointer">
            <input
              type="checkbox"
              checked={useCustom}
              onChange={e => setUseCustom(e.target.checked)}
              className="w-4 h-4 rounded"
            />
            <span>Other language (not listed above)</span>
          </label>

          {useCustom && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-bambu-gray mb-1">
                  Language Code (e.g., "sv", "fi")
                </label>
                <input
                  type="text"
                  value={customCode}
                  onChange={e => setCustomCode(e.target.value.toLowerCase())}
                  placeholder="xx"
                  maxLength={5}
                  className="w-full bg-bambu-dark-tertiary rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-bambu-green"
                />
              </div>
              <div>
                <label className="block text-sm text-bambu-gray mb-1">
                  Language Name
                </label>
                <input
                  type="text"
                  value={customName}
                  onChange={e => setCustomName(e.target.value)}
                  placeholder="Swedish"
                  className="w-full bg-bambu-dark-tertiary rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-bambu-green"
                />
              </div>
            </div>
          )}
        </div>

        <button
          onClick={handleStart}
          disabled={!canStart}
          className={`w-full mt-6 py-3 rounded-lg font-medium transition-colors ${
            canStart
              ? 'bg-bambu-green hover:bg-bambu-green-dark text-white'
              : 'bg-bambu-dark-tertiary text-bambu-gray cursor-not-allowed'
          }`}
        >
          Start Translating
        </button>
      </div>
    </div>
  )
}
