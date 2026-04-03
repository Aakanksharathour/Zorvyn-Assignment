import { useEffect, useMemo, useState } from 'react';
import { Plus, Download, Search, ArrowUpDown, X } from 'lucide-react';
import { exportTransactionsCsv } from '../utils/csv.js';
import { formatCurrency, formatDate } from '../utils/finance.js';

function Modal({ open, title, children, onClose }) {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-4 shadow-xl dark:border-slate-800 dark:bg-slate-950">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Admins can add new transactions.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
            aria-label="Close modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Badge({ children, tone }) {
  const cls =
    tone === 'income'
      ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20'
      : 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20';

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${cls}`}>
      {children}
    </span>
  );
}

export default function Transactions({ transactions, role, onAddTransaction }) {
  const isAdmin = role === 'admin';

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all'); // all | income | expense
  const [sortKey, setSortKey] = useState('date'); // date | amount
  const [sortDir, setSortDir] = useState('desc'); // asc | desc

  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState({
    date: '',
    type: 'expense',
    amount: '',
    category: '',
  });
  const [formError, setFormError] = useState('');

  const displayed = useMemo(() => {
    const q = search.trim().toLowerCase();

    const filtered = transactions.filter((tx) => {
      if (typeFilter !== 'all' && tx.type !== typeFilter) return false;
      if (!q) return true;
      const haystack = `${tx.date} ${tx.category} ${tx.type}`.toLowerCase();
      return haystack.includes(q);
    });

    filtered.sort((a, b) => {
      const dir = sortDir === 'asc' ? 1 : -1;
      if (sortKey === 'date') {
        const da = new Date(`${a.date}T00:00:00`).getTime();
        const db = new Date(`${b.date}T00:00:00`).getTime();
        return dir * (da - db);
      }
      // Sort by absolute amount (income/expense are distinguished by `type` column).
      return dir * (a.amount - b.amount);
    });

    return filtered;
  }, [transactions, search, typeFilter, sortKey, sortDir]);

  function resetForm() {
    setForm({ date: '', type: 'expense', amount: '', category: '' });
    setFormError('');
  }

  function openAdd() {
    resetForm();
    // default date to today
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    setForm((f) => ({ ...f, date: `${yyyy}-${mm}-${dd}` }));
    setAddOpen(true);
  }

  function submitAdd() {
    setFormError('');

    if (!form.date) return setFormError('Please select a date.');
    const amountNum = Number(form.amount);
    if (!Number.isFinite(amountNum) || amountNum <= 0) return setFormError('Amount must be a positive number.');
    const category = form.category.trim();
    if (!category) return setFormError('Category is required.');

    const newTx = {
      id: `tx-${Date.now()}`,
      date: form.date,
      type: form.type,
      amount: Math.round(amountNum),
      category,
    };
    onAddTransaction(newTx);
    setAddOpen(false);
    resetForm();
  }

  function typeLabel(type) {
    return type === 'income' ? 'Income' : 'Expense';
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">Transactions</h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Search, filter, and sort your activity.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => exportTransactionsCsv(displayed, 'transactions.csv')}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-800 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-900"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>

          {isAdmin ? (
            <button
              type="button"
              onClick={openAdd}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-3 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-500"
            >
              <Plus className="h-4 w-4" />
              Add Transaction
            </button>
          ) : (
            <span className="inline-flex items-center rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
              Viewer mode: read-only
            </span>
          )}
        </div>
      </div>

      <div className="mb-4 grid grid-cols-1 gap-3 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 dark:text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by date or category..."
              className="w-full rounded-xl border border-slate-200 bg-white px-10 py-2.5 text-sm text-slate-900 outline-none transition focus:ring-2 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
              aria-label="Search transactions"
            />
            {search.trim() ? (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-xs text-slate-500 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900"
              >
                Clear
              </button>
            ) : null}
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">Type</label>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
            aria-label="Filter by type"
          >
            <option value="all">All</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">Sort</label>
          <div className="flex gap-2">
            <select
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value)}
              className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
              aria-label="Sort key"
            >
              <option value="date">Date</option>
              <option value="amount">Amount</option>
            </select>
            <button
              type="button"
              onClick={() => setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))}
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-3 text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-900"
              aria-label="Toggle sort direction"
              title="Toggle sort direction"
            >
              <ArrowUpDown className="h-4 w-4" />
              <span className="ml-1 text-xs font-medium">{sortDir === 'asc' ? 'Asc' : 'Desc'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200/70 dark:border-slate-800">
        <div className="max-h-[420px] overflow-auto">
          <table className="min-w-full border-collapse">
            <thead className="sticky top-0 bg-slate-50 text-left text-xs uppercase text-slate-600 dark:bg-slate-950 dark:text-slate-300">
              <tr>
                <th className="px-4 py-3 font-semibold">Date</th>
                <th className="px-4 py-3 font-semibold">Amount</th>
                <th className="px-4 py-3 font-semibold">Category</th>
                <th className="px-4 py-3 font-semibold">Type</th>
              </tr>
            </thead>
            <tbody>
              {displayed.length === 0 ? (
                <tr>
                  <td colSpan={4}>
                    <div className="flex flex-col items-start gap-2 p-6">
                      <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">No transactions found</div>
                      <div className="text-sm text-slate-600 dark:text-slate-300">
                        Try adjusting your search/filter, or add a new transaction if you're an admin.
                      </div>
                      {isAdmin ? (
                        <button
                          type="button"
                          onClick={openAdd}
                          className="mt-1 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-3 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-500"
                        >
                          <Plus className="h-4 w-4" />
                          Add Transaction
                        </button>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ) : (
                displayed.map((tx) => {
                  const signed = tx.type === 'income' ? tx.amount : -tx.amount;
                  return (
                    <tr key={tx.id} className="border-t border-slate-200/60 dark:border-slate-800">
                      <td className="px-4 py-3 text-sm text-slate-900 dark:text-slate-100">{formatDate(tx.date)}</td>
                      <td
                        className={`px-4 py-3 text-sm font-semibold ${
                          tx.type === 'income' ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-700 dark:text-rose-300'
                        }`}
                      >
                        {formatCurrency(signed)}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-200">{tx.category}</td>
                      <td className="px-4 py-3">
                        <Badge tone={tx.type}>{typeLabel(tx.type)}</Badge>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    <Modal open={addOpen} title="Add Transaction" onClose={() => setAddOpen(false)}>
        <div className="space-y-3">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">Date</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">Amount</label>
              <input
                type="number"
                value={form.amount}
                onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
                placeholder="e.g. 120"
                min={1}
                step={1}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">Category</label>
              <input
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                placeholder="e.g. Groceries"
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
              />
            </div>
          </div>

          {formError ? <div className="rounded-xl border border-rose-300 bg-rose-50 p-3 text-sm text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-300">{formError}</div> : null}

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setAddOpen(false)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={submitAdd}
              className="rounded-xl bg-indigo-600 px-3 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-500"
            >
              Save
            </button>
          </div>
        </div>
      </Modal>
    </section>
  );
}

