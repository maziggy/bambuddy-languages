import { useState } from 'react'

interface LanguageSelectorProps {
  onStart: (code: string, name: string) => void
  availableLanguages: { code: string; name: string; native: string; completion: number }[]
}

const ALL_LANGUAGES = [
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

export default function LanguageSelector({ onStart, availableLanguages }: LanguageSelectorProps) {
  const [customCode, setCustomCode] = useState('')
  const [customName, setCustomName] = useState('')
  const [selectedSuggestion, setSelectedSuggestion] = useState<typeof ALL_LANGUAGES[0] | null>(null)

  // Languages that don't have translations yet
  const unavailableLanguages = ALL_LANGUAGES.filter(
    lang => !availableLanguages.some(a => a.code === lang.code)
  )

  const handleStart = () => {
    if (selectedSuggestion) {
      onStart(selectedSuggestion.code, selectedSuggestion.name)
    } else if (customCode && customName) {
      onStart(customCode, customName)
    }
  }

  const canStart = selectedSuggestion || (customCode.length >= 2 && customName.length >= 2)

  return (
    <div className="max-w-4xl mx-auto">
      {/* Available Languages Section */}
      {availableLanguages.length > 0 && (
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-2">Available Languages</h2>
          <p className="text-bambu-gray mb-6">
            These translations are already included in Bambuddy.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {availableLanguages.map(lang => (
              <div
                key={lang.code}
                className="p-4 rounded-lg bg-bambu-dark-secondary border border-bambu-dark-tertiary"
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="font-medium">{lang.name}</div>
                    <div className="text-sm text-bambu-gray">{lang.native}</div>
                  </div>
                  <span className="text-xs px-2 py-1 rounded bg-bambu-green/20 text-bambu-green">
                    {lang.completion}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-bambu-dark-tertiary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-bambu-green"
                    style={{ width: `${lang.completion}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add New Language Section */}
      <div className="bg-bambu-dark-secondary rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-2">Add a New Language</h2>
        <p className="text-bambu-gray mb-6">
          Help translate Bambuddy into a new language. Your contribution will help users around the world!
        </p>

        {/* Suggested languages (not yet available) */}
        {unavailableLanguages.length > 0 && (
          <div className="mb-6">
            <h3 className="font-medium mb-3 text-bambu-gray">Suggested languages</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {unavailableLanguages.map(lang => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setSelectedSuggestion(lang)
                    setCustomCode('')
                    setCustomName('')
                  }}
                  className={`p-3 rounded-lg text-left transition-colors ${
                    selectedSuggestion?.code === lang.code
                      ? 'bg-bambu-green text-white'
                      : 'bg-bambu-dark-tertiary hover:bg-bambu-dark-tertiary/70'
                  }`}
                >
                  <div className="font-medium text-sm">{lang.name}</div>
                  <div className="text-xs opacity-70">{lang.native}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Custom language input */}
        <div className="border-t border-bambu-dark-tertiary pt-4">
          <h3 className="font-medium mb-3 text-bambu-gray">Or enter a custom language</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-bambu-gray mb-1">
                Language Code (e.g., "sv", "fi")
              </label>
              <input
                type="text"
                value={customCode}
                onChange={e => {
                  setCustomCode(e.target.value.toLowerCase())
                  setSelectedSuggestion(null)
                }}
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
                onChange={e => {
                  setCustomName(e.target.value)
                  setSelectedSuggestion(null)
                }}
                placeholder="Swedish"
                className="w-full bg-bambu-dark-tertiary rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-bambu-green"
              />
            </div>
          </div>
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
