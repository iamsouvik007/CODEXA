import { useMemo } from 'react';
import { motion } from 'framer-motion';

export default function ContributionCalendar({ dailyActivity = {} }) {
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
      
      const activity = dailyActivity[dateStr] || { activities: 0, xp: 0, studyTime: 0 };
      const level = activity.activities === 0 ? 0 : activity.activities === 1 ? 1 : 2;

      days.push({ 
        date: dateStr, 
        level,
        activities: activity.activities,
        xp: activity.xp,
        studyTime: activity.studyTime
      });
    }
    
    // Group into weeks (columns)
    for (let i = 0; i < 24; i++) {
      result.push(days.slice(i * 7, (i + 1) * 7));
    }
    return result;
  }, [dailyActivity]);

  const levelColors = {
    0: 'bg-[#141416] hover:bg-zinc-800 border-zinc-900/50',
    1: 'bg-accent/25 hover:bg-accent/40 border-accent/10 shadow-[0_0_4px_rgba(249,115,22,0.05)]',
    2: 'bg-accent hover:bg-accent-soft border-accent/20 shadow-[0_0_8px_rgba(249,115,22,0.2)]'
  };

  const formatDate = (dateStr) => {
    try {
      const options = { month: 'short', day: 'numeric', year: 'numeric' };
      return new Date(dateStr).toLocaleDateString('en-US', options);
    } catch {
      return dateStr;
    }
  };

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
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:flex flex-col items-center z-20 pointer-events-none">
                      <div className="rounded-xl bg-bg border border-border p-3 text-[10px] font-sans font-semibold text-text shadow-modal whitespace-nowrap space-y-1 bg-neutral-950/95 backdrop-blur-md">
                        <div className="text-[9px] text-text-muted border-b border-border/40 pb-1 mb-1 font-mono">{formatDate(day.date)}</div>
                        <div className="flex justify-between gap-4">
                          <span className="text-text-secondary">Activities:</span>
                          <span className="text-accent font-bold font-mono">{day.activities}</span>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span className="text-text-secondary">XP Earned:</span>
                          <span className="text-yellow-500 font-bold font-mono">+{day.xp} XP</span>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span className="text-text-secondary">Study Time:</span>
                          <span className="text-cyan-400 font-bold font-mono">{Math.round(day.studyTime / 60)} min</span>
                        </div>
                      </div>
                      <div className="w-1.5 h-1.5 bg-neutral-950 border-r border-b border-border rotate-45 -mt-1" />
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
