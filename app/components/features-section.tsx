"use client";

import { ShieldCheck, Zap, HeartHandshake } from "lucide-react";

export function FeaturesSection() {
  const features = [
    {
      icon: <Zap className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />,
      title: "Instant E-Tickets",
      description: "Receive your verified tickets instantly via email or download them directly to your device right after checkout.",
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />,
      title: "100% Secure Payments",
      description: "Your transactions are encrypted and secured. We support all major local mobile wallets and credit banking options safely.",
    },
    {
      icon: <HeartHandshake className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />,
      title: "Reliable Support",
      description: "Have questions about an upcoming concert or event change? Our friendly support team is here to assist you 24/7.",
    },
  ];

  return (
    <section className="py-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((item, index) => (
          <div 
            key={index} 
            className="p-6 rounded-2xl border border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/40 dark:bg-zinc-900/10 space-y-3 hover:border-emerald-500/30 transition-all duration-300"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center shrink-0">
              {item.icon}
            </div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              {item.title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}