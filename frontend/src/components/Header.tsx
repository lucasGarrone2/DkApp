'use client';

import ThemeToggle from '@/components/ThemeToggle';

interface HeaderProps {
  peopleCount: number;
  onPeopleCountChange: (count: number) => void;
  count: number;
}

export default function Header({
  peopleCount,
  onPeopleCountChange,
  count,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-white/85 dark:bg-[#0b1120]/90 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80 shadow-sm transition-colors">
      <div className="container mx-auto px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-4">
        
        {/* Brand & Subtitle */}
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-blue-500/20 border border-blue-400/20">
            🇩🇰
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                DK Rentals
              </h1>
              <span className="text-[11px] px-2.5 py-0.5 bg-blue-500/10 text-blue-700 dark:text-blue-300 font-bold rounded-full border border-blue-500/20">
                Working Holiday
              </span>
            </div>
            <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              Copenhague · Búsqueda grupal y registro CPR
            </p>
          </div>
        </div>

        {/* Action Pills: Live Count, Group Selector, Exchange & Theme */}
        <div className="flex flex-wrap items-center gap-2.5">
          
          {/* Active count badge */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-100/90 dark:bg-slate-800/70 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-xl border border-slate-200/80 dark:border-slate-700/60 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50 animate-pulse"></span>
            <span><strong className="text-slate-900 dark:text-white">{count}</strong> alquileres activos</span>
          </div>

          {/* Group People Count Selector */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100/90 dark:bg-slate-800/70 rounded-xl border border-slate-200/80 dark:border-slate-700/60 shadow-sm text-xs font-semibold text-slate-700 dark:text-slate-300">
            <span className="text-slate-500 dark:text-slate-400">👥 Grupo:</span>
            <select
              value={peopleCount}
              onChange={(e) => onPeopleCountChange(Number(e.target.value))}
              className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold rounded-lg px-2 py-0.5 outline-none cursor-pointer border border-slate-200 dark:border-slate-700 text-xs hover:border-blue-500 transition-colors"
            >
              <option value={1}>1 persona</option>
              <option value={2}>2 personas</option>
              <option value={3}>3 personas (Grupo)</option>
              <option value={4}>4 personas</option>
            </select>
          </div>

          {/* Theme Toggle */}
          <ThemeToggle />
        </div>

      </div>
    </header>
  );
}
