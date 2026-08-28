import { useState, useEffect } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday } from "date-fns";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import api from "@/lib/api";
import { SkeletonCard } from "@/components/shared/SkeletonLoader";

export default function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCalendar = async () => {
      try {
        const res = await api.get("/calendar");
        setEvents(res.data.events);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCalendar();
  }, []);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  if (loading) return <SkeletonCard className="h-96" />;

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-[color:var(--text-primary)]" style={{ textShadow: "0 1px 1px rgba(255,255,255,0.8)" }}>
            Academic Calendar
          </h1>
          <p className="text-sm font-medium text-[color:var(--text-secondary)]">Track deadlines and coursework.</p>
        </div>
      </div>

      <div className="skeuo-panel overflow-hidden">
        {/* Calendar Header */}
        <div className="bg-[color:var(--color-primary-600)] p-4 flex items-center justify-between text-white border-b border-[color:var(--border-shadow)] shadow-inner">
          <button onClick={prevMonth} className="p-2 hover:bg-white/10 rounded transition-colors"><ChevronLeft /></button>
          <div className="text-xl font-bold flex items-center gap-2">
            <CalendarIcon className="w-5 h-5" />
            {format(currentDate, "MMMM yyyy")}
          </div>
          <button onClick={nextMonth} className="p-2 hover:bg-white/10 rounded transition-colors"><ChevronRight /></button>
        </div>

        {/* Calendar Body */}
        <div className="p-6 bg-[color:var(--bg-page)]">
          <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold uppercase tracking-wider text-[color:var(--text-secondary)] mb-4">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
              <div key={day}>{day}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-3">
            {/* Pad leading days */}
            {Array.from({ length: monthStart.getDay() }).map((_, i) => (
              <div key={`empty-${i}`} className="h-24 rounded-lg skeuo-input opacity-50"></div>
            ))}
            
            {/* Actual days */}
            {days.map((day) => {
              const dayEvents = events.filter(e => isSameDay(new Date(e.dueDate), day));
              
              return (
                <div 
                  key={day.toString()} 
                  className={`h-24 rounded-lg skeuo-input p-2 flex flex-col relative ${isToday(day) ? 'ring-2 ring-[color:var(--color-primary-500)]' : ''}`}
                >
                  <span className={`text-sm font-bold ${isToday(day) ? 'text-[color:var(--color-primary-600)]' : 'text-[color:var(--text-primary)]'}`}>
                    {format(day, "d")}
                  </span>
                  
                  <div className="mt-1 space-y-1 flex-1 overflow-y-auto overflow-x-hidden">
                    {dayEvents.map(event => {
                      let bgClass = "bg-[color:var(--color-surface-200)]";
                      let indicator = "skeuo-indicator-yellow";
                      if (event.status === "submitted") {
                        bgClass = "bg-green-100 dark:bg-green-900";
                        indicator = "skeuo-indicator-green";
                      } else if (event.status === "overdue") {
                        bgClass = "bg-red-100 dark:bg-red-900";
                        indicator = "skeuo-indicator-red";
                      }

                      return (
                        <div key={event.id} className={`text-[10px] p-1 rounded font-medium flex items-center gap-1.5 truncate shadow-sm border border-[color:var(--border-shadow)] ${bgClass}`}>
                          <div className={`w-2 h-2 rounded-full shrink-0 ${indicator}`}></div>
                          <span className="truncate">{event.title}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
