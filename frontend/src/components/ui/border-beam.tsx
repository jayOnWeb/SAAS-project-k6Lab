import React from "react"
import { cn } from "../../lib/utils"

interface BorderBeamProps {
  className?: string
  size?: number
  duration?: number
  delay?: number
  borderWidth?: number
  colorFrom?: string
  colorTo?: string
}

export const BorderBeam = ({
  className,
  size = 250,
  duration = 12,
  delay = 0,
  borderWidth = 1.5,
  colorFrom = "#ef4444",
  colorTo = "#dc2626",
}: BorderBeamProps) => {
  return (
    <div
      aria-hidden="true"
      style={
        {
          "--size": size,
          "--duration": duration,
          "--delay": delay,
          "--border-width": borderWidth,
          "--color-from": colorFrom,
          "--color-to": colorTo,
        } as React.CSSProperties
      }
      className={cn(
        "pointer-events-none absolute inset-0 rounded-[inherit] [border:calc(var(--border-width)*1px)_solid_transparent]",
        "![mask-clip:padding-box,border-box] ![mask-composite:intersect] [mask-image:linear-gradient(transparent,transparent),linear-gradient(#000,#000)]",
        "after:absolute after:aspect-square after:w-[calc(var(--size)*1px)] after:animate-border-beam after:[background:linear-gradient(to_left,var(--color-from),var(--color-to),transparent)] after:[offset-anchor:100%_50%] after:[offset-path:rect(0_auto_auto_0_round_calc(var(--size)*1px))]",
        className
      )}
    />
  )
}
