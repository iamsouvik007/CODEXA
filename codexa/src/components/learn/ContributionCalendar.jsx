import { useMemo } from 'react';
import { motion } from 'framer-motion';

export default function ContributionCalendar({ activityData = {} }) {
  // We will display a 24-week grid ending today (Sunday through Saturday rows)
  const gridData = useMemo(() => {
    const today = new Date();
    const result = [];
    
    // Walk backward 24 weeks * 7 days
    const totalDays = 24 * 7;
    const days = [];
    
    for (let i = totalDays - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const level = activityData[dateStr] || 0; // 0, 1, or 2
      days.push({ date: dateStr, level });
    }
    
    // Group into weeks (columns)
    for (let i = 0; i < 24; i++) {
      result.push(days.slice(i * 7, (i + 1) * 7));
    }
    return result;
  }, [activityData]);

  const levelColors = {
    0: 'bg-[#141416] hover:bg-zinc-800 border-zinc-900/50',
    1: 'bg-accent/25 hover:bg-accent/40 border-accent/10 shadow-[0_0_4px_rgba(249,115,22,0.05)]',
    2: 'bg-accent hover:bg-accent-soft border-accent/20 shadow-[0_0_8px_rgba(249,115,22,0.2)]'
  };

  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="rounded-xl border border-border bg-[#0b0b0d] p-5 shadow-card overflow-x-auto select-none">
      <div className="flex flex-col gap-2 min-w-[500px]">
        <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider text-text-muted mb-2">
          <span>Activity contributions</span>
        </div>

        <div className="flex gap-2">
          {/* Day markers (Sunday, Tuesday, Thursday, Saturday) */}
          <div className="flex flex-col justify-between text-[9px] text-text-muted/70 font-mono py-1 pr-1.5 h-[98px] select-none">
            <span>S</span>
            <span>M</span>
            <span>T</span>
            <span>W</span>
            <span>T</span>
            <span>F</span>
            <span>S</span>
          </div>

          {/* Grid columns */}
          <div className="flex-1 flex gap-[3.5px]">
            {gridData.map((week, colIdx) => (
              <div key={colIdx} className="flex flex-col gap-[3.5px]">
                {week.map((day, rowIdx) => (
                  <motion.div
                    key={day.date}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: (colIdx * 7 + rowIdx) * 0.002 }}
                    className={`h-3 w-3 rounded-[2px] border transition-all relative group cursor-pointer ${
                      levelColors[day.level]
                    }`}
                  >
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:flex flex-col items-center z-20 pointer-events-none">
                      <div className="rounded bg-bg px-2 py-1 text-[9px] font-mono font-semibold text-text shadow-modal border border-border whitespace-nowrap">
                        {day.level === 0 ? 'No activity' : day.level === 1 ? '1 contribution' : '2+ contributions'} on {day.date}
                      </div>
                      <div className="w-1.5 h-1.5 bg-bg border-r border-b border-border rotate-45 -mt-1" />
                    </div>
                  </motion.div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between text-[9px] text-text-muted/65 font-medium mt-3 border-t border-border/40 pt-2.5">
          <span>Less active</span>
          <div className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-[1px] bg-[#141416] border border-zinc-900" />
            <span className="h-2 w-2 rounded-[1px] bg-accent/25 border border-accent/15" />
            <span className="h-2 w-2 rounded-[1px] bg-accent border border-accent/25" />
          </div>
          <span>More active</span>
        </div>
      </div>
    </div>
  );
}
