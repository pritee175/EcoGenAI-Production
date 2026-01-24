import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface KPICardProps {
  title: string
  value: string
  subtitle?: string
  change?: {
    value: string
    trend: "up" | "down" | "neutral"
  }
  icon: LucideIcon
  iconColor?: string
}

export function KPICard({ title, value, subtitle, change, icon: Icon, iconColor = "text-primary" }: KPICardProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/30">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="mt-2 text-3xl font-bold text-card-foreground">{value}</p>
          {subtitle && <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>}
          {change && (
            <div className="mt-2 flex items-center gap-1">
              <span
                className={cn(
                  "text-sm font-medium",
                  change.trend === "up" && "text-success",
                  change.trend === "down" && "text-destructive",
                  change.trend === "neutral" && "text-muted-foreground"
                )}
              >
                {change.trend === "up" && "↑"}
                {change.trend === "down" && "↓"}
                {change.value}
              </span>
              <span className="text-xs text-muted-foreground">vs last month</span>
            </div>
          )}
        </div>
        <div className={cn("flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10", iconColor.replace("text-", "bg-").replace("-foreground", "") + "/10")}>
          <Icon className={cn("h-6 w-6", iconColor)} />
        </div>
      </div>
    </div>
  )
}
