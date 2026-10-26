const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const root = path.join(__dirname, '..'), dir = path.join(root, 'artifacts');
fs.mkdirSync(dir, { recursive: true });
const baseline = process.argv.includes('--baseline');
const files = fs.readdirSync(path.join(root, 'test')).filter(x => x.endsWith('.test.cjs')).sort().map(x => 'test/' + x);
const thresholds = baseline ? [] : ['--check-coverage', '--lines=60', '--functions=60', '--branches=60', '--statements=60'];
const args = [require.resolve('c8/bin/c8.js'), '--all', '--src=src', '--src=frontend', '--include=src/**', '--include=frontend/**', '--exclude=src/start.cjs', '--exclude=frontend/main.mjs', '--reporter=json-summary', '--reporter=lcov', '--reporter=text', '--reports-dir=artifacts/coverage', ...thresholds,
  process.execPath, '--test', '--test-concurrency=1', '--test-reporter=spec', '--test-reporter-destination=' + path.join(dir, 'tests.txt'), '--test-reporter=junit', '--test-reporter-destination=' + path.join(dir, 'tests.xml'), ...files];
const result = spawnSync(process.execPath, args, { cwd: root, encoding: 'utf8' });
fs.writeFileSync(path.join(dir, 'coverage-output.txt'), result.stdout || '');
console.log(result.stdout, result.stderr);
const tests = fs.existsSync(path.join(dir, 'tests.txt')) ? fs.readFileSync(path.join(dir, 'tests.txt'), 'utf8') : '';
console.log(tests);
fs.writeFileSync(path.join(dir, 'execution.json'), JSON.stringify({ date: new Date().toISOString(), node: process.version, status: result.status, baseline, githubRun: process.env.GITHUB_RUN_ID || null }, null, 2));
if (result.status !== 0 || !fs.existsSync(path.join(dir, 'tests.xml')) || /<(skipped|failure|error)\b/.test(fs.readFileSync(path.join(dir, 'tests.xml'), 'utf8'))) process.exitCode = 1;
