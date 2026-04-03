import { Moon, Sun } from 'lucide-react';

export default function Navbar({ role, onRoleChange, theme, onThemeToggle }) {
  const isDark = theme === 'dark';

  return (
    <header className="sticky top-0 z-10 border-b border-slate-200/70 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/60">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm">
            $
          </div>
          <div className="leading-tight">
            <div className="text-sm font-medium text-slate-600 dark:text-slate-300">Finance</div>
            <div className="text-lg font-semibold text-slate-900 dark:text-slate-100">Dashboard</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex sm:items-center sm:gap-2">
            <span className="text-sm text-slate-600 dark:text-slate-300">Role</span>
            <select
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
              value={role}
              onChange={(e) => onRoleChange(e.target.value)}
              aria-label="Select role"
            >
              <option value="admin">Admin</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>

          <button
            type="button"
            onClick={onThemeToggle}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-900 shadow-sm transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-900"
            aria-label="Toggle dark mode"
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
        </div>
      </div>
    </header>
  );
}

