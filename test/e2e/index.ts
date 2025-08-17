import { glob } from 'fast-glob';
import Mocha from 'mocha';
import * as path from 'path';

export function run(): Promise<void> {
  // Create the mocha test
  const mocha = new Mocha({
    ui: 'tdd',
    color: true,
    timeout: 30000, // 30 seconds timeout for E2E tests
  });

  const testsRoot = path.resolve(__dirname, '.');

  return new Promise((c, e) => {
    glob('**/**.test.js', { cwd: testsRoot })
      .then((files) => {
        console.log(`📋 Found ${files.length} E2E test file(s):`);

        // Add files to the test suite
        files.forEach((f) => {
          console.log(`  - ${f}`);
          mocha.addFile(path.resolve(testsRoot, f));
        });

        try {
          console.log('\n🏃 Running E2E tests...\n');

          // Run the mocha test
          mocha.run((failures: number) => {
            if (failures > 0) {
              e(new Error(`${failures} test(s) failed.`));
            } else {
              c();
            }
          });
        } catch (err) {
          console.error('Error running E2E tests:', err);
          e(err);
        }
      })
      .catch((err) => {
        console.error('Error finding E2E test files:', err);
        e(err);
      });
  });
}