const currency = 'USD';

export function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(isoDate) {
  const d = new Date(`${isoDate}T00:00:00`);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' });
}

function monthKey(isoDate) {
  // isoDate expected as YYYY-MM-DD
  return isoDate.slice(0, 7); // YYYY-MM
}

function monthLabel(yyyyMm) {
  const [y, m] = yyyyMm.split('-').map((v) => Number(v));
  const d = new Date(y, m - 1, 1);
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

export function getTotals(transactions) {
  let income = 0;
  let expense = 0;
  for (const tx of transactions) {
    if (tx.type === 'income') income += tx.amount;
    if (tx.type === 'expense') expense += tx.amount;
  }
  return { income, expense, balance: income - expense };
}

export function getBalanceTrendByMonth(transactions) {
  const sorted = [...transactions].sort((a, b) => new Date(`${a.date}T00:00:00`) - new Date(`${b.date}T00:00:00`));

  const netByMonth = new Map(); // key => net (income - expense)
  for (const tx of sorted) {
    const key = monthKey(tx.date);
    const net = tx.type === 'income' ? tx.amount : -tx.amount;
    netByMonth.set(key, (netByMonth.get(key) ?? 0) + net);
  }

  const months = [...netByMonth.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  const series = [];

  let running = 0;
  for (const [yyyyMm, net] of months) {
    running += net;
    series.push({ label: monthLabel(yyyyMm), value: running });
  }

  return series;
}

export function getSpendingByCategory(transactions) {
  const byCat = new Map();
  for (const tx of transactions) {
    if (tx.type !== 'expense') continue;
    byCat.set(tx.category, (byCat.get(tx.category) ?? 0) + tx.amount);
  }
  return [...byCat.entries()]
    .map(([category, value]) => ({ name: category, value }))
    .sort((a, b) => b.value - a.value);
}

export function getHighestSpendingCategory(transactions) {
  const spending = getSpendingByCategory(transactions);
  if (spending.length === 0) return null;
  return spending[0]; // { name, value }
}

export function getMonthlyComparison(transactions) {
  // Compare most recent month with the previous month (based on transactions).
  const dates = transactions.map((t) => t.date);
  if (dates.length === 0) return null;

  const monthKeys = [...new Set(dates.map(monthKey))].sort((a, b) => a.localeCompare(b));
  const currentKey = monthKeys[monthKeys.length - 1];
  const prevKey = monthKeys[monthKeys.length - 2] ?? null;

  const expenseFor = (key) =>
    transactions
      .filter((t) => t.type === 'expense' && monthKey(t.date) === key)
      .reduce((sum, t) => sum + t.amount, 0);

  const current = expenseFor(currentKey);
  const previous = prevKey ? expenseFor(prevKey) : 0;

  const delta = current - previous;
  const pct = previous === 0 ? null : (delta / previous) * 100;

  const currentLabel = monthLabel(currentKey);
  const prevLabel = prevKey ? monthLabel(prevKey) : 'Previous month';

  const formattedPct = pct === null ? 'N/A' : `${pct >= 0 ? '+' : ''}${pct.toFixed(1)}%`;
  const formattedDelta = formatCurrency(delta);

  return {
    currentLabel,
    prevLabel,
    current,
    previous,
    delta,
    formattedDelta,
    formattedPct,
  };
}

export function getAdditionalInsight(transactions) {
  // Insight: savings rate for the latest month (income - expense) / income.
  const dates = transactions.map((t) => t.date);
  if (dates.length === 0) return null;

  const monthKeys = [...new Set(dates.map(monthKey))].sort((a, b) => a.localeCompare(b));
  const latestKey = monthKeys[monthKeys.length - 1];

  let income = 0;
  let expense = 0;
  for (const t of transactions) {
    if (monthKey(t.date) !== latestKey) continue;
    if (t.type === 'income') income += t.amount;
    if (t.type === 'expense') expense += t.amount;
  }

  const net = income - expense;
  const rate = income === 0 ? null : (net / income) * 100;

  return {
    monthLabel: monthLabel(latestKey),
    net,
    savingsRatePct: rate,
  };
}

