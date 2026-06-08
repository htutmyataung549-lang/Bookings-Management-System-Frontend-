"use client";

import { MapPin, ArrowRight } from "lucide-react";
import Image from "next/image";

export function VenuesSection() {
  const venues = [
    {
      name: "Thuwunna Stadium",
      city: "Yangon",
      image:
        "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80",
      count: "12 Upcoming Events",
    },
    {
      name: "Myanmar Convention Center (MCC)",
      city: "Yangon",
      image:
        "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=500&q=80",
      count: "8 Upcoming Events",
    },
    {
      name: "Mandalay Convention Centre",
      city: "Mandalay",
      image:
        "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=500&q=80",
      count: "5 Upcoming Events",
    },
  ];

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Popular Venues
          </h2>
          <p className="text-xs text-muted-foreground">
            Find and explore events at your favorite locations.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {venues.map((venue, index) => (
          <div
            key={index}
            className="group relative h-48 rounded-2xl overflow-hidden cursor-pointer border border-zinc-100 dark:border-zinc-800 shadow-2xs"
          >
            {/* Background Image */}
            <Image
              src={venue.image}
              alt={venue.name}
              fill
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-zinc-950 via-zinc-950/40 to-transparent" />

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-5 text-white flex justify-between items-end">
              <div className="space-y-1 max-w-[80%]">
                <span className="flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold text-emerald-400">
                  <MapPin className="w-3 h-3" /> {venue.city}
                </span>
                <h3 className="font-bold text-sm tracking-tight truncate">
                  {venue.name}
                </h3>
                <p className="text-[11px] text-zinc-300">{venue.count}</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-white/10 group-hover:bg-emerald-600 flex items-center justify-center text-white backdrop-blur-xs transition-colors duration-300">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
