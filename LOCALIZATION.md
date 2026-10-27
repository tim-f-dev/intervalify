# Localization

English and German are bundled with the application, including offline builds. i18next/react-i18next render translations immediately; expo-localization supplies the initial device/browser locale. German locales use German, all other locales default to English. The Options submenu shows English/Deutsch buttons and the current selection.

`src/localization/core.ts` owns resources and the language controller. The manual preference uses AsyncStorage key `intervalify.language.v1`, independently of `intervalify.progress.v1`. Initialization waits for preference hydration; later changes do not remount screens, regenerate questions or restart playback. Storage errors offer a translated Retry action.

Translation namespaces:

- `en.json` / `de.json`: interface, accessibility, errors, chapters, interval names and plurals.
- `levels.en.json` / `levels.de.json`: titles and instructions for all 100 levels, keyed by numeric level ID.
- `instruments.en.json` / `instruments.de.json`: all 128 General MIDI program names, keyed by program ID.

Always translate interval labels with `localizedInterval(t, semitones)`. Keep semitones, MIDI values, asset paths and game IDs unchanged. Use i18next `count` with `_one` and `_other` translations for plurals, and named interpolation variables for messages. Original third-party legal notices remain verbatim; the surrounding explanation is translated.

## Updating content

After changing authored English level or instrument metadata, run `npm run i18n:sync-en`, then update the matching German entries. Run `npm run validate:i18n` and `npm run check`. Validation checks key parity, nonempty text, interpolation parity, all 100 levels, all 128 programs, literal translation references, plurals and hardcoded JSX/accessibility text. Dynamic keys must resolve through the centrally validated numeric catalogs.

## Adding a language

1. Copy each English namespace to a new language file and translate every value, preserving keys and interpolation variables.
2. Import and register the namespaces in `core.ts`; extend `supportedLngs`, `isLanguage` and locale detection. Keep English as fallback.
3. Add the language's autonym to the Options selector and update its typed options. Add the locale to the expo-localization plugin's `supportedLocales` in `app.json`.
4. Extend the validator and controller tests to include the new language and its plural forms. Add any extra CLDR plural categories needed for that language. For RTL languages, configure RTL support and audit layout separately.
5. Run all checks, export all platforms, and review every screen at narrow mobile widths, including longest level names, feedback, errors and accessibility labels. Test preference persistence and confirm gameplay/progress remain unchanged.

Native locale configuration takes effect in a new native build. The in-app selector works immediately on Android, iOS and web.
