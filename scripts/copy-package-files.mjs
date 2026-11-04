// Copies the repository README, LICENSE and CHANGELOG into the built package, so npm and
// GitHub show the same docs. ng-packagr can't copy assets from outside the library folder.
import { copyFileSync, existsSync } from 'node:fs';

const dest = 'dist/mat-tree-select-input';
if (!existsSync(`${dest}/package.json`)) {
  console.error(`${dest} not found. Build the library first.`);
  process.exit(1);
}
for (const file of ['README.md', 'LICENSE', 'CHANGELOG.md']) {
  copyFileSync(file, `${dest}/${file}`);
}
console.log(`Copied README.md, LICENSE and CHANGELOG.md into ${dest}`);
