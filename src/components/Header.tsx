interface HeaderProps {
  languageCode?: string
  languageName?: string
  stats?: {
    total: number
    translated: number
    auto: number
  }
}

export default function Header({ languageCode, languageName, stats }: HeaderProps) {
  const percentage = stats ? Math.round((stats.translated / stats.total) * 100) : 0

  return (
    <header className="bg-bambu-dark-secondary border-b border-bambu-dark-tertiary">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <svg className="w-8 h-8 text-bambu-green" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
          <div>
            <h1 className="text-xl font-bold">Bambuddy Languages</h1>
            <p className="text-sm text-bambu-gray">Translation Contribution Tool</p>
          </div>
        </div>

        {languageCode && stats && (
          <div className="flex items-center gap-6">
            <div className="text-right">
              <div className="text-sm text-bambu-gray">Translating to</div>
              <div className="font-medium">{languageName} ({languageCode})</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-bambu-gray">Progress</div>
              <div className="font-medium">
                {stats.translated}/{stats.total} ({percentage}%)
              </div>
            </div>
            <div className="w-32 h-2 bg-bambu-dark-tertiary rounded-full overflow-hidden">
              <div
                className="h-full bg-bambu-green transition-all duration-300"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
