#!/usr/bin/env tsx

import * as esbuild from 'esbuild';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import * as path from 'path';

/**
 * Lazy-loaded services that will be built separately
 * Services that can be loaded on-demand to reduce initial bundle size
 */
const lazyServices: string[] = [
  // Add services that should be lazy-loaded here
  // Example: 'src/services/HeftyService.ts',
];

const createConfig = (isProduction = false): esbuild.BuildOptions => ({
  entryPoints: ['./src/extension.ts'],
  bundle: true,
  outfile: './dist/extension.js',
  external: ['vscode'],
  format: 'cjs',
  platform: 'node',
  target: 'node20',
  sourcemap: isProduction ? false : 'inline',
  // Production minification options
  minifyWhitespace: isProduction,
  minifyIdentifiers: isProduction,
  minifySyntax: isProduction,
  treeShaking: true,
  mainFields: ['module', 'main'],
  conditions: ['node'],
  define: {
    'process.env.NODE_ENV': JSON.stringify(isProduction ? 'production' : 'development'),
  },
  // VS Code extension optimizations
  keepNames: false,
  legalComments: 'none',
  drop: isProduction ? ['console', 'debugger'] : [],
  metafile: true,
  plugins: [],
});

/**
 * Build lazy-loaded services separately
 *
 * @description
 * Builds each lazy service as a separate bundle in dist/lazy/.
 * This allows services to be loaded on-demand, reducing initial bundle size.
 *
 * @param isProduction - Whether to build in production mode
 *
 * @category Build Operations
 */
async function buildLazyServices(isProduction: boolean): Promise<void> {
  if (lazyServices.length === 0) {
    console.log('ℹ️  No lazy services configured');
    return;
  }

  console.log(`📦 Building ${lazyServices.length} lazy service(s)...`);

  // Ensure lazy directory exists
  const lazyDir = './dist/lazy';
  if (!existsSync(lazyDir)) {
    mkdirSync(lazyDir, { recursive: true });
  }

  const lazyResults: Array<{ name: string; sizeKB: string }> = [];

  for (const servicePath of lazyServices) {
    const serviceName = path.basename(servicePath, '.ts');
    const outfile = path.join(lazyDir, `${serviceName}.js`);

    try {
      const result = await esbuild.build({
        entryPoints: [servicePath],
        bundle: true,
        outfile,
        external: ['vscode'],
        format: 'cjs',
        platform: 'node',
        target: 'node20',
        sourcemap: isProduction ? false : 'inline',
        minifyWhitespace: isProduction,
        minifyIdentifiers: isProduction,
        minifySyntax: isProduction,
        treeShaking: true,
        metafile: true,
      });

      if (result.metafile) {
        const stats = readFileSync(outfile);
        const sizeKB = (stats.length / 1024).toFixed(2);
        lazyResults.push({ name: serviceName, sizeKB });
      }
    } catch (error) {
      console.error(`❌ Failed to build lazy service ${serviceName}:`, error);
    }
  }

  // Report lazy service sizes
  if (lazyResults.length > 0) {
    console.log('✅ Lazy services built:');
    for (const { name, sizeKB } of lazyResults) {
      console.log(`   - ${name}: ${sizeKB} KB`);
    }
    const totalKB = lazyResults
      .map((r) => parseFloat(r.sizeKB))
      .reduce((a, b) => a + b, 0)
      .toFixed(2);
    console.log(`   Total: ${totalKB} KB`);
  }
}

// Build function with comprehensive reporting
async function build(production = false): Promise<void> {
  try {
    console.log(`🚀 Building in ${production ? 'production' : 'development'} mode...`);

    // Build main bundle
    const config = createConfig(production);
    const result = await esbuild.build(config);

    if (result.metafile) {
      // Write metafile for analysis
      writeFileSync('./dist/meta.json', JSON.stringify(result.metafile, null, 2));

      // Calculate bundle metrics
      const stats = readFileSync('./dist/extension.js');
      const sizeKB = (stats.length / 1024).toFixed(2);
      const targetKB = 50;

      console.log('✅ Build completed successfully!');
      console.log(`📦 Bundle size: ${sizeKB} KB`);

      // Target verification
      if (parseFloat(sizeKB) > targetKB) {
        console.log(
          `⚠️  Bundle exceeds ${targetKB}KB target by ${(parseFloat(sizeKB) - targetKB).toFixed(2)}KB`,
        );
      } else {
        console.log(
          `✨ Bundle is ${(targetKB - parseFloat(sizeKB)).toFixed(2)}KB under ${targetKB}KB target!`,
        );
      }

      // Bundle analysis summary
      const inputs = Object.keys(result.metafile.inputs).length;
      const outputs = Object.keys(result.metafile.outputs).length;
      console.log(`📋 Bundle analysis: ${inputs} input files, ${outputs} output files`);
    }

    // Build lazy services if configured
    await buildLazyServices(production);
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

// Watch function for development
async function watch(): Promise<void> {
  console.log('👀 Starting watch mode...');

  const config = createConfig(false);
  const context = await esbuild.context({
    ...config,
    plugins: [
      ...(config.plugins ?? []),
      {
        name: 'watch-plugin',
        setup(build) {
          build.onEnd((result) => {
            if (result.errors.length === 0) {
              console.log('🔄 Rebuild completed at', new Date().toLocaleTimeString());
            }
          });
        },
      },
    ],
  });

  await context.watch();
}

// Export for external use
export { build, createConfig, watch };

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);
  const isProduction = args.includes('--production') || process.env['NODE_ENV'] === 'production';
  const isWatch = args.includes('--watch');

  if (isWatch) {
    watch().catch(console.error);
  } else {
    build(isProduction).catch(console.error);
  }
}
