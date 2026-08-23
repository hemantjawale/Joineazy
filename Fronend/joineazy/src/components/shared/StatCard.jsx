import { cn } from "@/lib/utils";

export default function StatCard({ title, value, icon: Icon, trend, className }) {
  return (
    <div className={cn("bg-white rounded-xl border border-surface-200 p-5 shadow-sm hover:shadow-md transition-all duration-200", className)}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-surface-500">{title}</p>
          <p className="text-2xl font-bold text-surface-900 mt-1">{value}</p>
          {trend && (
            <p className={cn("text-xs mt-1 font-medium", trend > 0 ? "text-success" : "text-danger")}>
              {trend > 0 ? "↑" : "↓"} {Math.abs(trend)}%
            </p>
          )}
        </div>
        {Icon && (
          <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center shrink-0">
            <Icon className="w-5 h-5 text-primary-600" />
          </div>
        )}
      </div>
    </div>
  );
}
