// Refresh English source content only; other languages must be authored and reviewed.
import { writeFileSync } from 'node:fs';
import { levels } from '../src/game/levels';
import catalog from '../src/audio/catalog.json';
writeFileSync('src/localization/levels.en.json', JSON.stringify(Object.fromEntries(levels.map((level) => [level.id, { title: level.title, description: level.challenge }])), null, 2) + '\n');
writeFileSync('src/localization/instruments.en.json', JSON.stringify(Object.fromEntries(Object.entries(catalog).map(([id, instrument]) => [id, instrument.name])), null, 2) + '\n');
console.log('Refreshed English names and descriptions from permanent level and GM metadata.');
