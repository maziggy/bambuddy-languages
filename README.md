# Bambuddy Languages

Translation contribution tool for [Bambuddy](https://github.com/bambulab/bambuddy).

## Overview

This is a standalone web application that helps community members contribute translations for Bambuddy. It provides:

- Language selection for starting a new translation
- Side-by-side view of English source strings and translation input
- Auto-translation feature (via DeepL API) to get a head start
- Export to JSON for submission to the Bambuddy project

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Contributing a Translation

1. Visit the hosted version at https://bambulab.github.io/bambuddy-languages/
2. Select your target language (or enter a custom language code)
3. Optionally use "Auto-translate All Pending" for a starting point (requires DeepL API key)
4. Review and refine each translation
5. Export as JSON
6. Submit via GitHub Issue or Pull Request

## Submitting Your Translation

After exporting your translation JSON:

1. **Via GitHub Issue**: Open an issue with the "translation" label and attach your JSON file
2. **Via Pull Request**: Add your JSON file to `bambuddy/frontend/src/locales/{lang-code}.json`

## Adding to Bambuddy

For Bambuddy maintainers: Translation files go in `frontend/src/locales/` and are loaded by react-i18next.

## License

MIT - Same as Bambuddy
