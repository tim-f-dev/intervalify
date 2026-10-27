import { spawnSync } from 'node:child_process';

// A per-command flag: ordinary exports and Cloudflare builds remain unchanged.
const result = spawnSync(process.execPath, ['node_modules/expo/bin/cli', 'export', '--platform', 'web', '--max-workers', '2', '--output-dir', 'dist'], {
  stdio: 'inherit', env: { ...process.env, EXPO_PUBLIC_UNLOCK_ALL_LEVELS: 'true' },
});
if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status ?? 1);
const offline = spawnSync(process.execPath, ['scripts/build-offline.mjs', 'dist'], { stdio: 'inherit' });
if (offline.error) throw offline.error;
process.exit(offline.status ?? 1);
