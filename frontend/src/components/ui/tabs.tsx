import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "../../lib/utils"

interface TabItem {
  id: string
  label: string
  icon?: React.ReactNode
  badge?: string
}

interface TabsProps {
  tabs: TabItem[]
  activeTab: string
  onChange: (id: string) => void
  className?: string
}

export function MotionTabs({ tabs, activeTab, onChange, className }: TabsProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-xl border border-white/10 bg-zinc-950/80 p-1.5 backdrop-blur-md",
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              "relative flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors cursor-pointer select-none",
              isActive ? "text-white font-semibold" : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5"
            )}
          >
            {isActive && (
              <motion.div
                layoutId="active-tab-glow"
                className="absolute inset-0 rounded-lg bg-gradient-to-r from-red-600/30 via-red-500/20 to-red-600/30 border border-red-500/40 shadow-[0_0_20px_rgba(239,68,68,0.25)]"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              {tab.icon}
              {tab.label}
              {tab.badge && (
                <span className="rounded-full bg-red-500/20 px-2 py-0.5 text-[10px] font-mono text-red-400 border border-red-500/30">
                  {tab.badge}
                </span>
              )}
            </span>
          </button>
        )
      })}
    </div>
  )
}
