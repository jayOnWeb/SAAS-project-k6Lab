import React, { useState } from "react"
import { motion } from "framer-motion"
import { Check, Zap, Shield, Sparkles, ArrowRight } from "lucide-react"
import { Badge } from "./ui/badge"
import { BorderBeam } from "./ui/border-beam"

export function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(true)

  const plans = [
    {
      name: "Developer",
      badge: "Free Tier",
      price: "$0",
      period: "forever",
      description: "Ideal for individual developers writing & debugging k6 performance scripts.",
      features: [
        "Up to 500 Virtual Users (VUs)",
        "10 test runs per month",
        "Community Discord Support",
        "CLI & Local VS Code integration",
        "Basic P95 / P99 latency charts",
      ],
      cta: "Get Started Free",
      popular: false,
      buttonStyle: "btn-ghost",
    },
    {
      name: "Pro Team",
      badge: "Most Popular",
      price: isAnnual ? "$49" : "$59",
      period: "per month",
      description: "Built for engineering teams scaling microservices & CI/CD test automation.",
      features: [
        "Up to 25,000 Virtual Users (VUs)",
        "Unlimited automated test runs",
        "GitHub Actions & GitLab CI Pipeline integration",
        "AI Root-Cause Latency Diagnosis",
        "Distributed Multi-Region Load Generation",
        "Slack & PagerDuty Instant Alerts",
        "30-day telemetry metrics retention",
      ],
      cta: "Start 14-Day Free Trial",
      popular: true,
      buttonStyle: "btn-red",
    },
    {
      name: "Enterprise",
      badge: "Custom Scale",
      price: "Custom",
      period: "billed annually",
      description: "For high-scale organizations needing dedicated infrastructure & SLA.",
      features: [
        "100,000+ Distributed VUs",
        "Dedicated VPC Load Generators",
        "Custom SSO (SAML / Okta / Azure AD)",
        "SOC2 Type II & HIPAA Compliance",
        "24/7 Dedicated Solutions Engineer",
        "Custom AI model fine-tuning for your stack",
      ],
      cta: "Contact Enterprise Team",
      popular: false,
      buttonStyle: "btn-ghost",
    },
  ]

  return (
    <section id="pricing" className="relative py-24 px-4 overflow-hidden bg-black/60">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-red-600/10 blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex justify-center mb-4"
          >
            <Badge variant="glow" pulse>
              <Sparkles className="w-3.5 h-3.5 mr-1" /> Transparent Enterprise Pricing
            </Badge>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4"
          >
            Simple plans for <span className="text-gradient-red">high-scale load testing</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-zinc-400 text-lg"
          >
            Predictable pricing with zero hidden fees. Scale from single API endpoints to millions of concurrent virtual users.
          </motion.p>

          {/* Toggle Switch */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <span className={`text-sm font-medium ${!isAnnual ? "text-white" : "text-zinc-400"}`}>
              Monthly Billing
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="relative w-14 h-8 rounded-full bg-zinc-900 border border-white/10 p-1 cursor-pointer transition-colors hover:border-red-500/40"
            >
              <motion.div
                className="w-6 h-6 rounded-full bg-gradient-to-r from-red-500 to-red-600 shadow-md"
                animate={{ x: isAnnual ? 24 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </button>
            <span className={`text-sm font-medium flex items-center gap-1.5 ${isAnnual ? "text-white" : "text-zinc-400"}`}>
              Annual Billing
              <span className="bg-red-500/20 text-red-400 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border border-red-500/30">
                SAVE 20%
              </span>
            </span>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className={`relative flex flex-col rounded-2xl p-8 transition-all duration-300 ${
                plan.popular
                  ? "bg-zinc-950/90 border-2 border-red-500/50 shadow-[0_0_50px_rgba(239,68,68,0.2)]"
                  : "bg-zinc-950/50 border border-white/10 hover:border-white/20"
              }`}
            >
              {plan.popular && (
                <>
                  <BorderBeam size={300} duration={10} colorFrom="#ef4444" colorTo="#dc2626" />
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-red-600 to-red-500 text-white font-mono text-xs font-bold tracking-wider px-3.5 py-1 rounded-full uppercase shadow-[0_0_15px_rgba(239,68,68,0.5)] border border-white/20 flex items-center gap-1">
                      <Zap className="w-3 h-3 fill-white" /> {plan.badge}
                    </span>
                  </div>
                </>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
                  {plan.name}
                  {!plan.popular && (
                    <span className="text-xs font-mono text-zinc-400 font-normal px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10">
                      {plan.badge}
                    </span>
                  )}
                </h3>
                <p className="text-zinc-400 text-sm">{plan.description}</p>
              </div>

              <div className="mb-6 pb-6 border-b border-white/10">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">{plan.price}</span>
                  <span className="text-zinc-400 text-sm font-medium">/{plan.period}</span>
                </div>
              </div>

              <div className="flex-1 space-y-3.5 mb-8">
                <p className="text-xs font-mono text-zinc-400 uppercase tracking-wider font-semibold">Included Capabilities:</p>
                {plan.features.map((feat, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="mt-0.5 p-0.5 rounded-full bg-red-500/20 text-red-400 shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-sm text-zinc-300">{feat}</span>
                  </div>
                ))}
              </div>

              <button className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                plan.popular
                  ? "btn-red"
                  : "bg-white/5 hover:bg-white/10 border border-white/15 text-white"
              }`}>
                {plan.cta}
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
