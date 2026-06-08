"use client";

import { useState } from "react";
import { HelpCircle, ChevronDown } from "lucide-react";

export function FaqSection() {
  const faqs = [
    {
      q: "How do I receive my tickets after purchasing?",
      a: "Once your payment is verified, your digital e-tickets will be sent instantly to your registered email address. You can also view and download them anytime from the 'View My Bookings' tab on our dashboard.",
    },
    {
      q: "Can I get a refund if an event is canceled?",
      a: "Yes, absolutely! If an event organizer cancels or postpones the show, you will receive a 100% full refund automatically back to your original payment method within 3 to 5 business days.",
    },
    {
      q: "Do I need to print my e-ticket for the event entry?",
      a: "No printing required. You can simply show the QR code on your mobile phone screen at the venue gate, and the event team will scan it for your entry check-in.",
    },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 border-t pt-12 border-zinc-100 dark:border-zinc-800">
      <div className="space-y-2">
        <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
          <HelpCircle className="w-5 h-5" />
        </div>
        <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Frequently Asked Questions
        </h2>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Can&apos;t find the answer you&apos;re looking for? Reach out to our
          24/7 customer support team anytime.
        </p>
      </div>

      <div className="lg:col-span-2 space-y-3">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className="border border-zinc-100 dark:border-zinc-800/60 bg-zinc-50/20 dark:bg-zinc-900/5 rounded-xl overflow-hidden transition-all duration-200"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full p-4 text-left flex justify-between items-center gap-4 hover:bg-zinc-50 dark:hover:bg-zinc-900/40 transition-colors"
              >
                <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                  {faq.q}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-zinc-400 transition-transform duration-300 ${
                    isOpen ? "rotate-180 text-emerald-500" : ""
                  }`}
                />
              </button>

              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  isOpen
                    ? "max-h-40 border-t border-zinc-100 dark:border-zinc-800"
                    : "max-h-0"
                }`}
              >
                <p className="p-4 text-xs text-muted-foreground leading-relaxed bg-white dark:bg-black/20">
                  {faq.a}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
