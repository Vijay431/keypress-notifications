import * as path from 'path';
import Mocha from 'mocha';
import { glob } from 'fast-glob';

export function run(): Promise<void> {
  // Create the mocha test
  const mocha = new Mocha({
    ui: 'bdd',
    color: true,
    timeout: 20000, // 20 seconds timeout for E2E tests
  });

  const testsRoot = path.resolve(__dirname, '..');

  return new Promise((resolve, reject) => {
    glob('**/**.test.js', { cwd: testsRoot })
      .then((files) => {
        console.log(`📋 Found ${files.length} E2E test file(s):`);

        // Add files to the test suite
        files.forEach((f) => {
          console.log(`  - ${f}`);
          mocha.addFile(path.resolve(testsRoot, f));
        });

        try {
          console.log('\n🏃 Running Keypress Notifications E2E tests...\n');

          // Run the mocha test
          mocha.run((failures) => {
            if (failures > 0) {
              reject(new Error(`${failures} tests failed.`));
            } else {
              console.log('\n✅ All E2E tests passed!\n');
              resolve();
            }
          });
        } catch (err) {
          console.error('Error running E2E tests:', err);
          reject(err);
        }
      })
      .catch((err) => {
        console.error('Error finding E2E test files:', err);
        reject(err);
      });
  });
}
