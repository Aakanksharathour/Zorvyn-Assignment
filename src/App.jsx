import { useEffect, useMemo, useState } from 'react';
import Navbar from './components/Navbar.jsx';
import SummaryCards from './components/SummaryCards.jsx';
import Charts from './components/Charts.jsx';
import Transactions from './components/Transactions.jsx';
import Insights from './components/Insights.jsx';
import { mockTransactions } from './data/mockTransactions.js';
import { getTotals } from './utils/finance.js';
import { loadRole, loadTheme, loadTransactions, saveRole, saveTheme, saveTransactions } from './utils/storage.js';

export default function App() {
  const [transactions, setTransactions] = useState(() => loadTransactions(mockTransactions));
  const [role, setRole] = useState(() => loadRole('viewer'));
  const [theme, setTheme] = useState(() => loadTheme());

  // Apply dark mode class to the document root.
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
    saveTheme(theme);
  }, [theme]);

  useEffect(() => {
    saveRole(role);
  }, [role]);

  useEffect(() => {
    saveTransactions(transactions);
  }, [transactions]);

  const totals = useMemo(() => getTotals(transactions), [transactions]);

  function handleAddTransaction(newTx) {
    // Enforce role-based access in state management too.
    if (role !== 'admin') return;
    setTransactions((prev) => [...prev, newTx]);
  }

  return (
    <div className="min-h-screen">
      <Navbar
        role={role}
        onRoleChange={(nextRole) => setRole(nextRole)}
        theme={theme}
        onThemeToggle={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
      />

      <main className="mx-auto w-full max-w-6xl space-y-6 px-4 py-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Welcome back</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Track income, expenses, and trends using mock finance data. Your changes persist in local storage.
          </p>
        </div>

        <SummaryCards totals={totals} />

        <Charts transactions={transactions} theme={theme} />

        <Insights transactions={transactions} />

        <Transactions transactions={transactions} role={role} onAddTransaction={handleAddTransaction} />

        <footer className="pb-6 pt-2 text-xs text-slate-500 dark:text-slate-400">
          Tip: Switch roles in the navbar to see Admin (can add) vs Viewer (read-only).
        </footer>
      </main>
    </div>
  );
}

