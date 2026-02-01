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
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center">
          {/* Logo - left */}
          <a
            href="https://bambuddy.cool"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-80 transition-opacity"
          >
            <img
              src="/logo.png"
              alt="Bambuddy"
              className="h-16 w-auto"
            />
          </a>

          {/* Title - center */}
          <div className="flex-1 text-center">
            <h1 className="text-2xl font-bold">Bambuddy Languages</h1>
            <p className="text-sm text-bambu-gray">Translation Contribution Tool</p>
          </div>

          {/* Spacer to balance logo width */}
          <div className="w-16"></div>
        </div>

        {/* Stats bar - shown when translating */}
        {languageCode && stats && (
          <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-bambu-dark-tertiary">
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
