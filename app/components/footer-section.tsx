"use client";

import React, { useState } from "react";
import Link from "next/link";
// ✅ စာလုံးပေါင်း အမှန်များဖြင့် Import လုပ်ခြင်း (LinkedIn မဟုတ်ဘဲ Linkedin ဖြစ်ရပါမည်)
import { 

  Mail, 
  Phone, 
  MapPin, 
  ArrowRight,
  Globe,
  Send
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function FooterSection() {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription logic here
    console.log("Subscribed:", email);
    setEmail("");
  };

  return (
    <footer className="w-full bg-zinc-900 text-zinc-300 dark:bg-black dark:text-zinc-400 border-t border-zinc-800 transition-colors duration-300 mt-20">
      
      {/* 1. Main Footer Grid Content */}
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          
          {/* Column 1: Brand Pitch & Socials */}
          <div className="lg:col-span-2 space-y-5">
            <Link href="/" className="inline-block">
              <span className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
                <span className="text-emerald-500">🎟️</span> TicketGo
              </span>
            </Link>
            <p className="text-sm text-zinc-400 leading-relaxed max-w-sm">
              Discover, experience, and secure entry to the finest live events, global music concerts, trending festivals, and premier tech conferences across the continent.
            </p>
            {/* Social Media Links */}
            {/* <div className="flex items-center gap-4 pt-2">
              <a href="#" className="p-2 rounded-full bg-zinc-800 hover:bg-emerald-600 text-zinc-400 hover:text-white transition-all duration-300" aria-label="Facebook">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-full bg-zinc-800 hover:bg-emerald-600 text-zinc-400 hover:text-white transition-all duration-300" aria-label="Twitter">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-full bg-zinc-800 hover:bg-emerald-600 text-zinc-400 hover:text-white transition-all duration-300" aria-label="Instagram">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-full bg-zinc-800 hover:bg-emerald-600 text-zinc-400 hover:text-white transition-all duration-300" aria-label="LinkedIn">
                <Linkedin className="w-4 h-4" /> 
              </a>
            </div> */}
          </div>

          {/* Column 2: Core Platform Navigation */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-zinc-100 uppercase tracking-widest">
              Explore Events
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="#" className="hover:text-emerald-400 flex items-center gap-1 group transition-colors duration-200">
                  <ArrowRight className="w-3 h-3 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200 text-emerald-500" />
                  Music & Concerts
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-emerald-400 flex items-center gap-1 group transition-colors duration-200">
                  <ArrowRight className="w-3 h-3 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200 text-emerald-500" />
                  Tech & Business Panels
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-emerald-400 flex items-center gap-1 group transition-colors duration-200">
                  <ArrowRight className="w-3 h-3 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200 text-emerald-500" />
                  Theater & Arts
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-emerald-400 flex items-center gap-1 group transition-colors duration-200">
                  <ArrowRight className="w-3 h-3 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200 text-emerald-500" />
                  Sports Tournaments
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Corporate Links */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-zinc-100 uppercase tracking-widest">
              Resources
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-emerald-400 transition-colors">Home Dashboard</Link>
              </li>
              <li>
                <Link href="/my-bookings" className="hover:text-emerald-400 transition-colors">My Bookings</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-emerald-400 transition-colors">Host an Event</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-emerald-400 transition-colors">Help Center & FAQs</Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter Subscription Block */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-zinc-100 uppercase tracking-widest">
              Stay Updated
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Subscribe to unlock early-bird discounts and weekly updates on hot events.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative flex items-center">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full h-10 bg-zinc-800 dark:bg-zinc-900 border-zinc-700 text-zinc-200 text-sm rounded-lg focus-visible:ring-emerald-500 focus-visible:ring-1 focus-visible:border-emerald-500 placeholder-zinc-500"
                />
                <Button 
                  type="submit" 
                  size="icon"
                  className="absolute right-1 top-1 h-8 w-8 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md transition-all duration-200"
                >
                  <Send className="w-3.5 h-3.5" />
                </Button>
              </div>
            </form>
          </div>

        </div>
      </div>

      {/* 2. Secondary Informational Support Ribbon */}
      <div className="border-t border-zinc-800 bg-zinc-950/40">
        <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-zinc-400 items-center text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <MapPin className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>No. 123, Pyay Road, Yangon, Myanmar</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
            <a href="tel:+95912345678" className="hover:text-white transition-colors">+95 9 123 456 78</a>
          </div>
          <div className="flex items-center justify-center md:justify-end gap-2">
            <Mail className="w-4 h-4 text-emerald-500 shrink-0" />
            <a href="mailto:support@ticketgo.com" className="hover:text-white transition-colors">support@ticketgo.com</a>
          </div>
        </div>
      </div>

      {/* 3. Global Legal Bottom Ribbon */}
      <div className="border-t border-zinc-800 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
            <span>© {currentYear} TicketGo Co., Ltd. All rights reserved.</span>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <Link href="#" className="hover:text-zinc-300 transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-zinc-300 transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-zinc-300 transition-colors">Cookie Settings</Link>
            <div className="flex items-center gap-1.5 pl-2 border-l border-zinc-800 text-zinc-400 cursor-pointer hover:text-emerald-400 transition-colors">
              <Globe className="w-3.5 h-3.5" />
              <span>English (US)</span>
            </div>
          </div>
        </div>
      </div>
      
    </footer>
  );
}