// Switches the workspace to another Angular major version, to check that the library and the
// package built with the lowest supported version work there.
//
// It rewrites package.json and reinstalls node_modules from scratch (layering versions on top of
// an existing install leaves a broken dependency tree), so only run it in CI or a throwaway copy.
//
// Usage: node scripts/use-angular-version.mjs <major> [--yes]
import { execSync } from 'node:child_process';
import { readFileSync, rmSync, writeFileSync } from 'node:fs';

const TYPESCRIPT = { 19: '~5.7.3', 20: '~5.8.0', 21: '~5.9.0', 22: '~6.0.0' };

const [major, flag] = process.argv.slice(2);
if (!TYPESCRIPT[major]) {
  console.error(`Usage: node scripts/use-angular-version.mjs <${Object.keys(TYPESCRIPT).join('|')}> [--yes]`);
  process.exit(1);
}
if (process.env.CI !== 'true' && flag !== '--yes') {
  console.error('This rewrites package.json and node_modules. Run it in CI, or pass --yes in a throwaway copy.');
  process.exit(1);
}

const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
for (const deps of [pkg.dependencies, pkg.devDependencies]) {
  for (const name of Object.keys(deps)) {
    if (name.startsWith('@angular/') || name === '@angular-devkit/build-angular' || name === 'ng-packagr') {
      deps[name] = `^${major}.0.0`;
    }
  }
}
pkg.devDependencies.typescript = TYPESCRIPT[major];
// Angular 21+ needs karma 6.4; Angular 22 accepts zone.js 0.16.
pkg.devDependencies.karma = '~6.4.0';
pkg.dependencies['zone.js'] = '~0.15.0 || ~0.16.0';
writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');

rmSync('node_modules', { recursive: true, force: true });
rmSync('package-lock.json', { force: true });
// angular-eslint stays on its Angular 19 release (lint only runs on Angular 19), hence legacy peer deps.
execSync('npm install --legacy-peer-deps --no-audit --no-fund', { stdio: 'inherit' });
