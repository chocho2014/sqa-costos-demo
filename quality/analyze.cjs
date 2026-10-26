const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { ESLint } = require('eslint');
const root = path.join(__dirname, '..'), output = path.join(root, 'artifacts');
async function main() {
  fs.mkdirSync(output, { recursive: true });
  const ox = spawnSync(process.execPath, [path.join(root, 'node_modules/oxlint/bin/oxlint'), '--format=json', 'src', 'frontend'], { cwd: root, encoding: 'utf8' });
  fs.writeFileSync(path.join(output, 'oxlint.json'), ox.stdout || '{}');
  const eslint = new ESLint(), results = await eslint.lintFiles(['src/**/*.cjs', 'frontend/**/*.mjs']);
  fs.writeFileSync(path.join(output, 'eslint.json'), JSON.stringify(results, null, 2));
  const dup = spawnSync(process.execPath, [path.join(root, 'node_modules/jscpd/bin/jscpd'), '--config', '.jscpd.json', 'src', 'frontend', '--noTips'], { cwd: root, encoding: 'utf8' });
  fs.writeFileSync(path.join(output, 'duplication-output.txt'), (dup.stdout || '') + (dup.stderr || ''));
  const duplication = JSON.parse(fs.readFileSync(path.join(output, 'duplication/jscpd-report.json'), 'utf8'));
  const oxlint = JSON.parse(ox.stdout), summary = {
    errors: results.reduce((n, r) => n + r.errorCount, 0) + oxlint.diagnostics.filter(d => d.severity === 'error').length,
    codeSmells: results.reduce((n, r) => n + r.warningCount, 0) + oxlint.diagnostics.filter(d => d.severity === 'warning').length,
    duplicationPercent: Number(duplication.statistics.total.percentage),
    toolErrors: Boolean(ox.error || dup.error),
    definitions: 'Errors son hallazgos estáticos, no bugs confirmados. Code smells son advertencias de reglas de mantenibilidad configuradas. Duplicación usa jscpd con minLines 8 y minTokens 60.'
  };
  fs.writeFileSync(path.join(output, 'analysis.json'), JSON.stringify(summary, null, 2));
  console.log(summary);
  if (!process.argv.includes('--baseline') && (ox.status !== 0 || dup.status !== 0 || summary.toolErrors || summary.errors > 0 || summary.codeSmells > 0 || summary.duplicationPercent > 10)) process.exitCode = 1;
}
main().catch(e => { console.error(e); process.exitCode = 1; });
