# Third-party licenses and notices

Original Intervalify material owned by Tim Fischer is governed by the root
`LICENSE`. That proprietary notice does not apply to third-party components
and does not replace or remove their licenses.

## Expo and template material

The original repository MIT notice, copyright (c) 2015-present 650 Industries,
Inc. (aka Expo), is preserved verbatim in `licenses/Expo.txt`. Expo and material
derived from its template remain subject to that MIT license. The proprietary
notice does not claim exclusive rights over those portions.

## Bundled instrument recordings: MS Basic

Preferred source investigated: https://github.com/Meowchestra/SoundFonts, revision `112717949aa21c2efffb77a65c5ba34c38b00338` (MS Basic 2.0.0 source, MIT). That repository has no downloadable compiled release. To avoid rebuilding its full source toolchain, this app renders the official MuseScore-distributed compiled MS Basic SF3 instead.

Actual source: https://github.com/musescore/MuseScore/blob/f019f4079d0ba74c481fa93396b3486a77f22635/share/sound/MS%20Basic.sf3

SHA-256: `5ea2375e8bd7d8e71def1036978c1621e85b66934169b6a2744b27b9b3c2d99c`.

The matching distribution's license identifies this older bank as MuseScore_General 0.2 (13 May 2020), renamed MS Basic. It must not be represented as the preferred repository's 2.0.0 build. Its matching notice is preserved verbatim in `licenses/MS-Basic.txt` and displayed in the application's Credits screen. It is MIT licensed and allows use, modification, distribution and sale, including commercial/ad-supported products, provided the copyright, permission and acknowledgement notices are retained. No source SoundFont is bundled in the app; generated AAC recordings are derivative assets distributed with those notices.

Credits include Frank Wen (FluidR3), Michael Cowgill (FluidR3Mono), S. Christian Collins (MuseScore adaptation), Ethan Winer (Temple Blocks), Michael Schorsch (Drumline Cymbals), and the original Fluid contributors listed in the preserved notice.

## Build-time tools

- FluidSynth 2.6.1: https://github.com/FluidSynth/fluidsynth/releases/tag/v2.6.1 — LGPL-2.1-or-later; used offline, not linked into or distributed with the application.
- FFmpeg supplied by imageio-ffmpeg 0.6.0: https://github.com/imageio/imageio-ffmpeg — build-time audio encoding/verification only. The downloaded binary's own license/build information applies; it is not included in application bundles.
- NumPy: BSD-3-Clause, build-time sample processing only.

Runtime dependencies retain their own licenses in npm packages. This notice covers the bundled instrument recordings, rather than replacing those package licenses.
