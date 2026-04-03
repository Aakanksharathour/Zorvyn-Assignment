function escapeCsvCell(value) {
  const s = String(value ?? '');
  // Quote if it contains special chars
  if (/[",\n\r]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export function transactionsToCsv(transactions) {
  const header = ['Date', 'Amount', 'Category', 'Type'];
  const rows = transactions.map((tx) => {
    const typeLabel = tx.type === 'income' ? 'Income' : 'Expense';
    return [tx.date, tx.amount, tx.category, typeLabel];
  });

  return [header, ...rows].map((r) => r.map(escapeCsvCell).join(',')).join('\n');
}

export function downloadText(filename, text) {
  const blob = new Blob([text], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.setAttribute('download', filename);
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function exportTransactionsCsv(transactions, filename = 'transactions.csv') {
  const csv = transactionsToCsv(transactions);
  downloadText(filename, csv);
}

