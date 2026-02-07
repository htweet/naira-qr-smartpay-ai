import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MerchantStatsProps {
  title: string;
  value: string | number;
  change?: number;
  icon: LucideIcon;
  variant?: "blue" | "green" | "purple" | "orange";
}

const variantStyles = {
  blue: {
    bg: "bg-blue-50 border-blue-200",
    iconBg: "bg-blue-500",
    titleColor: "text-blue-600",
    valueColor: "text-blue-900",
  },
  green: {
    bg: "bg-emerald-50 border-emerald-200",
    iconBg: "bg-emerald-500",
    titleColor: "text-emerald-600",
    valueColor: "text-emerald-900",
  },
  purple: {
    bg: "bg-purple-50 border-purple-200",
    iconBg: "bg-purple-500",
    titleColor: "text-purple-600",
    valueColor: "text-purple-900",
  },
  orange: {
    bg: "bg-orange-50 border-orange-200",
    iconBg: "bg-orange-500",
    titleColor: "text-orange-600",
    valueColor: "text-orange-900",
  },
};

const MerchantStats = ({
  title,
  value,
  change,
  icon: Icon,
  variant = "blue",
}: MerchantStatsProps) => {
  const styles = variantStyles[variant];
  const isPositive = change !== undefined && change >= 0;

  return (
    <Card className={cn("transition-all hover:shadow-md", styles.bg)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className={cn("text-sm font-medium", styles.titleColor)}>
              {title}
            </p>
            <p className={cn("text-2xl font-bold", styles.valueColor)}>
              {value}
            </p>
            {change !== undefined && (
              <div className="flex items-center gap-1">
                {isPositive ? (
                  <TrendingUp className="h-4 w-4 text-emerald-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                )}
                <span
                  className={cn(
                    "text-sm",
                    isPositive ? "text-emerald-600" : "text-red-500"
                  )}
                >
                  {isPositive ? "+" : ""}
                  {change.toFixed(1)}%
                </span>
              </div>
            )}
          </div>
          <div className={cn("p-3 rounded-lg", styles.iconBg)}>
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MerchantStats;
