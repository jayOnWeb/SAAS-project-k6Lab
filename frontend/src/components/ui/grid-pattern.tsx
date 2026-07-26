import React from "react"
import { motion } from "framer-motion"
import { cn } from "../../lib/utils"

interface GridPatternProps {
  width?: number
  height?: number
  x?: number
  y?: number
  strokeDasharray?: string
  className?: string
  squares?: Array<[x: number, y: number]>
}

export function GridPattern({
  width = 40,
  height = 40,
  x = -1,
  y = -1,
  strokeDasharray = "0",
  className,
  squares,
  ...props
}: GridPatternProps & React.SVGProps<SVGSVGElement>) {
  const id = React.useId()

  return (
    <svg
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full fill-neutral-400/10 stroke-neutral-400/10 [mask-image:radial-gradient(600px_circle_at_center,white,transparent)]",
        className
      )}
      {...props}
    >
      <defs>
        <pattern
          id={id}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          x={x}
          y={y}
        >
          <path
            d={`M.5 ${height}V.5H${width}`}
            fill="none"
            strokeDasharray={strokeDasharray}
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" strokeWidth={0} fill={`url(#${id})`} />
      {squares && (
        <svg x={x} y={y} className="overflow-visible">
          {squares.map(([sqX, sqY], idx) => (
            <motion.rect
              initial={{ opacity: 0.2, scale: 0.8 }}
              animate={{ opacity: [0.2, 0.8, 0.2], scale: [0.8, 1, 0.8] }}
              transition={{
                duration: 3 + (idx % 3),
                repeat: Infinity,
                ease: "easeInOut",
                delay: idx * 0.4,
              }}
              strokeWidth="0"
              key={`${sqX}-${sqY}`}
              width={width - 1}
              height={height - 1}
              x={sqX * width + 1}
              y={sqY * height + 1}
              className="fill-red-500/20 stroke-red-500/30"
            />
          ))}
        </svg>
      )}
    </svg>
  )
}
