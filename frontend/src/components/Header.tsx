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
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="container mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-4">
        
        {/* Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 dark:bg-blue-500 text-white flex items-center justify-center font-bold text-xl shadow-md">
            🇩🇰
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                DK Rentals
              </h1>
              <span className="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-semibold rounded-full">
                Working Holiday
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Copenhague · Agregador y colaboración grupal
            </p>
          </div>
        </div>

        {/* Controls: Active count, People Count Selector, Theme Toggle */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Active count badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            {count} departamentos
          </div>

          {/* Group People Count Selector */}
          <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <span>👥 Grupo:</span>
            <select
              value={peopleCount}
              onChange={(e) => onPeopleCountChange(Number(e.target.value))}
              className="bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-bold rounded-lg px-2 py-0.5 outline-none cursor-pointer border border-slate-200 dark:border-slate-600"
            >
              <option value={1}>1 persona</option>
              <option value={2}>2 personas</option>
              <option value={3}>3 personas (Grupo)</option>
              <option value={4}>4 personas</option>
            </select>
          </div>

          <ThemeToggle />
        </div>

      </div>
    </header>
  );
}
