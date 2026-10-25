import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import catalog from '../src/audio/catalog.json';

type Sample = { program: number; midi: number; file: string; peak: number; rms: number; offsetSeconds: number };
type Bank = { program: number; file: string; sha256: string };
const report = JSON.parse(readFileSync('assets/audio/render-report.json', 'utf8')) as { count: number; samples: Sample[]; banks: Bank[] };
assert.equal(Object.keys(catalog).length, 128);
assert.equal(report.samples.length, report.count);
const unique = new Set<string>();
let bytes = 0;
assert.equal(report.banks.length, 128);
for (const bank of report.banks) {
  const content = readFileSync(bank.file); bytes += content.length;
  for (const tag of ['ftyp', 'moov', 'mdat']) assert.ok(content.includes(Buffer.from(tag)), `Invalid container: ${bank.file}`);
  assert.equal(createHash('sha256').update(content).digest('hex'), bank.sha256, `Corrupt bank ${bank.file}`);
}
for (const sample of report.samples) {
  const key = `${sample.program}/${sample.midi}`;
  assert.ok(!unique.has(key)); unique.add(key);
  assert.ok(sample.peak <= 0.801 && sample.rms > 0.00001);
  const instrument = catalog[String(sample.program) as keyof typeof catalog];
  assert.ok(Math.abs(sample.offsetSeconds - (sample.midi - instrument.minMidi) * 1.6) < 0.001);
}
for (const [program, instrument] of Object.entries(catalog)) {
  for (let note = instrument.minMidi; note <= instrument.maxMidi; note++) {
    assert.ok(unique.has(`${program}/${note}`));
  }
}
console.log(`Verified ${report.count} note slots in 128 checksummed M4A banks: ${bytes} bytes (${(bytes / 1024 ** 2).toFixed(2)} MiB).`);
