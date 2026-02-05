import { clsx } from "clsx";

interface StatCardProps {
  label: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon?: React.ReactNode;
  loading?: boolean;
}

export function StatCard({
  label,
  value,
  change,
  changeType = "neutral",
  icon,
  loading = false,
}: StatCardProps) {
  return (
    <div className="card">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-400 mb-1">{label}</p>
          {loading ? (
            <div className="h-8 w-24 bg-gray-700 animate-pulse rounded" />
          ) : (
            <p className="text-2xl font-bold text-white">{value}</p>
          )}
          {change && (
            <p
              className={clsx(
                "text-sm mt-1",
                changeType === "positive" && "text-green-400",
                changeType === "negative" && "text-red-400",
                changeType === "neutral" && "text-gray-400"
              )}
            >
              {change}
            </p>
          )}
        </div>
        {icon && (
          <div className="p-3 bg-primary-500/10 rounded-lg text-primary-400">{icon}</div>
        )}
      </div>
    </div>
  );
}
