"use client";

import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";

export function CtaBanner() {
  return (
    <section className="relative rounded-3xl overflow-hidden bg-linear-to-br from-zinc-900 via-emerald-950 to-zinc-900 text-white p-16 md:p-12 border border-zinc-800 shadow-xl">
      <div className="max-w-xl space-y-6">
        <span className="text-xs font-bold mb-2 uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
          Hosting an Event?
        </span>
        <h2 className="text-2xl md:text-4xl font-black tracking-tight leading-tight">
          Create & Sell Tickets <br />Online in Minutes
        </h2>
        <p className="text-sm md:text-base text-zinc-400 leading-relaxed">
          Whether it’s a music festival, tech workshop, or sports gala, TicketGo gives you the intuitive tools to manage check-ins, view live analytics, and payouts.
        </p>
        <div className="pt-2">
          <Button 
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold gap-2 shadow-lg shadow-emerald-900/20 px-6 h-11"
          >
            Become an Organizer <ArrowUpRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Decorative Background Glows */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
    </section>
  );
}