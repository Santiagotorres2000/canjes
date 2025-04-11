
import { cn } from "@/lib/utils";

interface CardStatProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export function CardStat({
  title,
  value,
  description,
  icon,
  trend,
  className,
}: CardStatProps) {
  return (
    <div className={cn("rounded-lg border bg-card p-5", className)}>
      <div className="flex justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h2 className="text-3xl font-bold mt-1">{value}</h2>
        </div>
        {icon && (
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            {icon}
          </div>
        )}
      </div>
      {(description || trend) && (
        <div className="mt-4 flex items-center text-sm">
          {trend && (
            <span
              className={cn(
                "mr-2 rounded-full px-1.5 py-0.5 text-xs font-medium",
                trend.isPositive
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              )}
            >
              {trend.isPositive ? "+" : "-"}
              {Math.abs(trend.value)}%
            </span>
          )}
          {description && (
            <span className="text-muted-foreground">{description}</span>
          )}
        </div>
      )}
    </div>
  );
}
