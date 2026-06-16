const startTime = Date.now();

export function logProgress(current: number, total: number, label: string) {
  const pct = ((current / total) * 100).toFixed(1);
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(0);
  process.stdout.write(`\r[${label}] ${current}/${total} (${pct}%) — ${elapsed}s elapsed`);
}

export function logDone(total: number, label: string) {
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(0);
  console.log(`\n[${label}] Done — ${total} records in ${elapsed}s`);
}

export function logStep(message: string) {
  console.log(`\n📋 ${message}`);
}

export function logInfo(message: string) {
  console.log(`  ${message}`);
}
