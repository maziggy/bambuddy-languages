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
        <div className="flex items-center gap-4">
          <a
            href="https://bambuddy.cool"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <img
              src="/logo.png"
              alt="Bambuddy"
              className="w-10 h-10 rounded"
            />
            <div>
              <h1 className="text-xl font-bold">Bambuddy Languages</h1>
              <p className="text-sm text-bambu-gray">Translation Contribution Tool</p>
            </div>
          </a>
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
