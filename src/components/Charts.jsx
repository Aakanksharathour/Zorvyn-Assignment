import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from 'recharts';
import { getBalanceTrendByMonth, getSpendingByCategory } from '../utils/finance.js';

const COLORS = ['#6366F1', '#22C55E', '#F43F5E', '#F59E0B', '#38BDF8', '#A78BFA', '#14B8A6', '#FB7185'];

function ChartCard({ title, children }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-2 flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">{title}</h2>
      </div>
      {children}
    </div>
  );
}

export default function Charts({ transactions, theme }) {
  const isDark = theme === 'dark';
  const axisColor = isDark ? '#94a3b8' : '#475569';
  const gridColor = isDark ? 'rgba(148,163,184,0.25)' : 'rgba(71,85,105,0.15)';

  const balanceSeries = getBalanceTrendByMonth(transactions);

  const spending = getSpendingByCategory(transactions);
  const topN = 6;
  const top = spending.slice(0, topN);
  const rest = spending.slice(topN);
  const otherValue = rest.reduce((sum, c) => sum + c.value, 0);
  const pieData = otherValue > 0 ? [...top, { name: 'Other', value: otherValue }] : top;

  const tooltipStyle = {
    background: isDark ? 'rgba(15,23,42,0.95)' : 'rgba(255,255,255,0.96)',
    border: `1px solid ${isDark ? 'rgba(51,65,85,0.9)' : 'rgba(226,232,240,1)'}`,
    color: isDark ? '#e2e8f0' : '#0f172a',
    borderRadius: '12px',
    boxShadow: isDark ? '0 10px 30px rgba(0,0,0,0.35)' : '0 10px 30px rgba(15,23,42,0.12)',
  };

  return (
    <section className="grid grid-cols-1 gap-4 lg:grid-cols-2" aria-label="Charts">
      <ChartCard title="Balance Trend">
        {balanceSeries.length === 0 ? (
          <div className="flex h-[260px] items-center justify-center text-sm text-slate-600 dark:text-slate-300">
            No balance data yet.
          </div>
        ) : (
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={balanceSeries} margin={{ left: 10, right: 10, top: 10, bottom: 0 }}>
                <CartesianGrid stroke={gridColor} strokeDasharray="3 3" />
                <XAxis dataKey="label" tick={{ fill: axisColor, fontSize: 12 }} />
                <YAxis tick={{ fill: axisColor, fontSize: 12 }} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v}`, 'Balance']} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="value"
                  name="Balance"
                  stroke="#6366F1"
                  strokeWidth={3}
                  dot={{ r: 3, strokeWidth: 0 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </ChartCard>

      <ChartCard title="Spending by Category">
        {pieData.length === 0 ? (
          <div className="flex h-[260px] items-center justify-center text-sm text-slate-600 dark:text-slate-300">
            No expenses data yet.
          </div>
        ) : (
          <div className="flex h-[260px] flex-col items-center justify-center gap-3 sm:flex-row sm:justify-between">
            <div className="h-[220px] w-full sm:h-[240px] sm:w-1/2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip contentStyle={tooltipStyle} />
                  <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90}>
                    {pieData.map((entry, idx) => (
                      <Cell key={`cell-${entry.name}`} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full px-1 sm:w-1/2">
              <ul className="space-y-2">
                {pieData.map((c, idx) => {
                  const total = pieData.reduce((sum, x) => sum + x.value, 0);
                  const pct = total === 0 ? 0 : (c.value / total) * 100;
                  return (
                    <li key={c.name} className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span
                          className="inline-block h-2.5 w-2.5 rounded-full"
                          style={{ background: COLORS[idx % COLORS.length] }}
                        />
                        <span className="truncate text-sm text-slate-700 dark:text-slate-200">{c.name}</span>
                      </div>
                      <span className="text-sm font-medium text-slate-900 dark:text-slate-100">{Math.round(pct)}%</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        )}
      </ChartCard>
    </section>
  );
}

