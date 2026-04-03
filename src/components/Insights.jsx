import { TrendingDown, TrendingUp } from 'lucide-react';
import { formatCurrency } from '../utils/finance.js';
import { getAdditionalInsight, getHighestSpendingCategory, getMonthlyComparison } from '../utils/finance.js';

function InsightCard({ title, children }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">{title}</h3>
      <div className="mt-2">{children}</div>
    </div>
  );
}

export default function Insights({ transactions }) {
  const highest = getHighestSpendingCategory(transactions);
  const monthly = getMonthlyComparison(transactions);
  const extra = getAdditionalInsight(transactions);

  const deltaIsUp = monthly ? monthly.delta > 0 : false;

  return (
    <section aria-label="Insights" className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <InsightCard title="Highest Spending Category">
        {highest ? (
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-2xl font-semibold text-slate-900 dark:text-slate-100">{highest.name}</div>
              <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">Total expenses</div>
            </div>
            <div className="rounded-2xl bg-rose-500/10 px-3 py-2 text-right">
              <div className="text-lg font-semibold text-rose-700 dark:text-rose-300">{formatCurrency(highest.value)}</div>
              <div className="text-xs text-slate-600 dark:text-slate-300">All time (mock)</div>
            </div>
          </div>
        ) : (
          <div className="text-sm text-slate-600 dark:text-slate-300">No expenses yet.</div>
        )}
      </InsightCard>

      <InsightCard title="Monthly Comparison (Expenses)">
        {monthly ? (
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm text-slate-600 dark:text-slate-300">Latest</div>
                <div className="text-lg font-semibold text-slate-900 dark:text-slate-100">{monthly.currentLabel}</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-semibold text-slate-900 dark:text-slate-100">{formatCurrency(monthly.current)}</div>
                <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">{monthly.prevLabel}</div>
              </div>
            </div>

            <div className={`flex items-center justify-between gap-3 rounded-2xl border p-3 ${
              deltaIsUp
                ? 'border-rose-200 bg-rose-50 dark:border-rose-900/60 dark:bg-rose-950/20'
                : 'border-emerald-200 bg-emerald-50 dark:border-emerald-900/60 dark:bg-emerald-950/20'
            }`}>
              <div className="flex items-center gap-2">
                {deltaIsUp ? <TrendingUp className="h-4 w-4 text-rose-700 dark:text-rose-300" /> : <TrendingDown className="h-4 w-4 text-emerald-700 dark:text-emerald-300" />}
                <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">Delta</div>
              </div>
              <div className={`text-sm font-semibold ${deltaIsUp ? 'text-rose-700 dark:text-rose-300' : 'text-emerald-700 dark:text-emerald-300'}`}>
                {monthly.formattedDelta}
                <span className="ml-2 text-xs font-medium text-slate-600 dark:text-slate-300">{monthly.formattedPct !== 'N/A' ? `(${monthly.formattedPct})` : ''}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-sm text-slate-600 dark:text-slate-300">Not enough data to compare.</div>
        )}
      </InsightCard>

      <InsightCard title="Additional Insight: Savings Rate">
        {extra ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-sm text-slate-600 dark:text-slate-300">Latest month</div>
                <div className="text-lg font-semibold text-slate-900 dark:text-slate-100">{extra.monthLabel}</div>
              </div>
              <div className="rounded-2xl bg-indigo-500/10 px-3 py-2 text-right">
                <div className="text-lg font-semibold text-indigo-700 dark:text-indigo-300">
                  {extra.savingsRatePct === null ? 'N/A' : `${extra.savingsRatePct.toFixed(1)}%`}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-300">Income - Expenses</div>
              </div>
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-300">
              Net cash flow: <span className="font-semibold text-slate-900 dark:text-slate-100">{formatCurrency(extra.net)}</span>
            </div>
          </div>
        ) : (
          <div className="text-sm text-slate-600 dark:text-slate-300">No data available.</div>
        )}
      </InsightCard>
    </section>
  );
}

