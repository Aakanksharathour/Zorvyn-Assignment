import { ArrowDownRight, ArrowUpRight, Wallet } from 'lucide-react';
import { formatCurrency } from '../utils/finance.js';

function StatCard({ title, value, sub, icon, tone }) {
  const toneClasses =
    tone === 'good'
      ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
      : tone === 'bad'
        ? 'bg-rose-500/10 text-rose-700 dark:text-rose-300'
        : 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300';

  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-medium text-slate-600 dark:text-slate-300">{title}</div>
          <div className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-100">{value}</div>
          {sub ? <div className="mt-1 text-xs text-slate-600 dark:text-slate-400">{sub}</div> : null}
        </div>
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${toneClasses}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

export default function SummaryCards({ totals }) {
  const { balance, income, expense } = totals;

  return (
    <section aria-label="Dashboard summary" className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <StatCard
        title="Total Balance"
        value={formatCurrency(balance)}
        sub="Income minus expenses"
        icon={<Wallet className="h-5 w-5" />}
        tone="neutral"
      />
      <StatCard
        title="Income"
        value={formatCurrency(income)}
        sub="Money received"
        icon={<ArrowUpRight className="h-5 w-5" />}
        tone="good"
      />
      <StatCard
        title="Expenses"
        value={formatCurrency(expense)}
        sub="Money spent"
        icon={<ArrowDownRight className="h-5 w-5" />}
        tone="bad"
      />
    </section>
  );
}

