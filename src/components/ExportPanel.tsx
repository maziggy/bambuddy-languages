interface ExportPanelProps {
  languageCode: string
  languageName: string
  data: Record<string, string>
  stats: {
    total: number
    translated: number
    auto: number
  }
}

export default function ExportPanel({ languageCode, languageName, data, stats }: ExportPanelProps) {
  const handleExportJSON = () => {
    const json = JSON.stringify(data, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${languageCode}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleExportCSV = () => {
    const rows = [['Key', 'Translation']]
    Object.entries(data).forEach(([key, value]) => {
      rows.push([key, value])
    })
    const csv = rows.map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${languageCode}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleCopyJSON = async () => {
    const json = JSON.stringify(data, null, 2)
    await navigator.clipboard.writeText(json)
    alert('JSON copied to clipboard!')
  }

  const percentage = Math.round((stats.translated / stats.total) * 100)
  const manualCount = stats.translated - stats.auto

  return (
    <div className="bg-bambu-dark-secondary rounded-lg p-4 sticky top-4">
      <h3 className="font-medium mb-4">Export Translation</h3>

      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-bambu-gray">Language</span>
          <span>{languageName}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-bambu-gray">Code</span>
          <span className="font-mono">{languageCode}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-bambu-gray">Completion</span>
          <span>{percentage}%</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-bambu-gray">Manual translations</span>
          <span>{manualCount}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-bambu-gray">Auto-translated</span>
          <span className="text-yellow-500">{stats.auto}</span>
        </div>

        <div className="w-full h-2 bg-bambu-dark-tertiary rounded-full overflow-hidden">
          <div className="h-full flex">
            <div
              className="bg-bambu-green"
              style={{ width: `${(manualCount / stats.total) * 100}%` }}
            />
            <div
              className="bg-yellow-500"
              style={{ width: `${(stats.auto / stats.total) * 100}%` }}
            />
          </div>
        </div>
        <div className="flex gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-bambu-green" />
            <span className="text-bambu-gray">Manual</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-yellow-500" />
            <span className="text-bambu-gray">Auto</span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <button
          onClick={handleExportJSON}
          className="w-full py-2 bg-bambu-green hover:bg-bambu-green-dark text-white rounded-lg font-medium transition-colors"
        >
          Download JSON
        </button>
        <button
          onClick={handleExportCSV}
          className="w-full py-2 bg-bambu-dark-tertiary hover:bg-bambu-dark-tertiary/70 rounded-lg font-medium transition-colors"
        >
          Download CSV
        </button>
        <button
          onClick={handleCopyJSON}
          className="w-full py-2 bg-bambu-dark-tertiary hover:bg-bambu-dark-tertiary/70 rounded-lg font-medium transition-colors"
        >
          Copy JSON to Clipboard
        </button>
      </div>

      <div className="mt-6 pt-4 border-t border-bambu-dark-tertiary">
        <h4 className="font-medium mb-2">Submit Your Translation</h4>
        <p className="text-sm text-bambu-gray mb-3">
          Once you're happy with your translation, submit it to be included in Bambuddy!
        </p>
        <a
          href="https://github.com/maziggy/bambuddy-languages/issues/new"
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full py-2 text-center bg-bambu-dark-tertiary hover:bg-bambu-dark-tertiary/70 rounded-lg font-medium transition-colors"
        >
          Open GitHub Issue
        </a>
      </div>
    </div>
  )
}
