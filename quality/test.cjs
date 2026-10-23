const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const dir = path.join(__dirname, '../artifacts');
fs.mkdirSync(dir, { recursive: true });
const baseline = process.argv.includes('--baseline');
const args = ['--test', '--experimental-test-coverage', '--test-coverage-include=src/calculator.cjs', '--test-coverage-include=src/server.cjs',
  ...(!baseline ? ['--test-coverage-lines=85', '--test-coverage-branches=75', '--test-coverage-functions=90'] : []),
  '--test-reporter=spec', '--test-reporter-destination=' + path.join(dir, 'tests.txt'),
  '--test-reporter=junit', '--test-reporter-destination=' + path.join(dir, 'tests.xml'),
  '--test-reporter=lcov', '--test-reporter-destination=' + path.join(dir, 'lcov.info'), ...fs.readdirSync(path.join(__dirname, '../test')).filter(x => x.endsWith('.test.cjs')).sort().map(x => 'test/' + x)];
const result = spawnSync(process.execPath, args, { cwd: path.join(__dirname, '..'), stdio: 'inherit' });
const report = fs.existsSync(path.join(dir, 'tests.txt')) ? fs.readFileSync(path.join(dir, 'tests.txt'), 'utf8') : '';
console.log(report);
fs.writeFileSync(path.join(dir, 'execution.json'), JSON.stringify({ date: new Date().toISOString(), node: process.version, status: result.status, baseline, githubRun: process.env.GITHUB_RUN_ID || null }, null, 2));
if (result.status !== 0 || !fs.existsSync(path.join(dir, 'tests.xml')) || /<(skipped|failure|error)\b/.test(fs.readFileSync(path.join(dir, 'tests.xml'), 'utf8'))) process.exitCode = 1;

