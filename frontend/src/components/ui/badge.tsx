import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/utils"

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-mono font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.15)]",
        secondary:
          "border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10",
        destructive:
          "border-red-600/50 bg-red-600/20 text-red-200",
        outline:
          "border-red-500/40 text-red-400 bg-transparent",
        glow:
          "border-red-500/40 bg-gradient-to-r from-red-950/40 via-red-900/20 to-red-950/40 text-red-300 shadow-[0_0_20px_rgba(239,68,68,0.25)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  pulse?: boolean
}

function Badge({ className, variant, pulse = false, children, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props}>
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
        </span>
      )}
      {children}
    </div>
  )
}

export { Badge, badgeVariants }
