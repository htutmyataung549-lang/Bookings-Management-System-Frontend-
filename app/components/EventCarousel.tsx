"use client";

import * as React from "react";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, MapPin } from "lucide-react";

const FEATURED_EVENTS = [
  {
    id: "featured-1",
    title: "Rock Music Concert 2026 in Singapore",
    description:
      "Experience the ultimate rock music festival live with world-renowned international artists and mind-blowing stage effects.",
    date: "Dec 12, 2026",
    location: "National Stadium, Singapore",
    // 🎸 Big stadium rock concert image
    image:
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&auto=format&fit=crop&q=80",
    tag: "Trending",
  },
  {
    id: "featured-2",
    title: "Yangon Heritage Food Festival",
    description:
      "Indulge in a culinary journey featuring Myanmar's authentic traditional dishes, modern street foods, and live local music.",
    date: "July 23, 2026",
    location: "People's Park, Yangon",
    // 🍲 Traditional food / Fine dining aesthetic image
    image:
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1200&auto=format&fit=crop&q=80",
    tag: "Popular",
  },
  {
    id: "featured-3",
    title: "International EDM Beats Night",
    description:
      "Get ready to dance the night away with world-class DJs, electric laser light shows, and an unforgettable high-energy atmosphere.",
    date: "Oct 05, 2026",
    location: "Thuwunnabhumi Event Park, Yangon",
    // ⚡ EDM concert with festival lights image
    image:
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200&auto=format&fit=crop&q=80",
    tag: "Selling Fast",
  },
  {
    id: "featured-4",
    title: "Myanmar Books Show",
    description:
      "Explore thousands of books, meet your favorite local authors, and enjoy literary talk shows in Yangon.",
    date: "Nov 1, 2026",
    location: "People's Park, Yangon",
    // 📚 High-quality Book Fair / Library event image
    image:
      "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=1200&auto=format&fit=crop&q=80",
    tag: "Popular",
  },
];

export function EventCarousel() {
  const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: false })
  );

  return (
    <div className="w-full px-1">
      <Carousel
        // eslint-disable-next-line react-hooks/refs
        plugins={[plugin.current]}
        className="w-full overflow-hidden rounded-2xl border border-zinc-200/50 dark:border-zinc-800/80 shadow-xs"
        // eslint-disable-next-line react-hooks/refs
        onMouseEnter={plugin.current.stop}
        // eslint-disable-next-line react-hooks/refs
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent>
          {FEATURED_EVENTS.map((event) => (
            <CarouselItem key={event.id}>
              <div className="relative h-70 md:h-95 w-full">
                {/* Background Image */}
                <Image
                  src={event.image}
                  alt={event.title}
                  fill
                  priority
                  className="object-cover object-center brightness-[0.45] dark:brightness-[0.35]"
                />

                {/* Content Overlay */}
                <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10 space-y-3 bg-linear-to-t from-black/80 via-black/20 to-transparent">
                  <div className="space-y-2 max-w-2xl">
                    <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold uppercase tracking-wider text-[10px] rounded-full px-2.5 py-0.5">
                      {event.tag}
                    </Badge>
                    <h2 className="text-xl md:text-3xl font-extrabold text-white tracking-tight line-clamp-2">
                      {event.title}
                    </h2>
                    <p className="text-zinc-200 text-xs md:text-sm font-medium line-clamp-2 hidden sm:block">
                      {event.description}
                    </p>
                  </div>

                  {/* Info Tags & Button */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-zinc-300 text-xs font-medium">
                      <span className="flex items-center gap-1.5">
                        <CalendarDays className="w-3.5 h-3.5 text-emerald-400" />
                        {event.date}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                        {event.location}
                      </span>
                    </div>

                    <Button className="bg-emerald-600 hover:bg-emerald-700 text-white self-start sm:self-auto h-9 text-xs font-semibold px-4 rounded-xl shadow-xs">
                      Book Now
                    </Button>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex left-4 bg-white/10 hover:bg-white/20 text-white border-none" />
        <CarouselNext className="hidden md:flex right-4 bg-white/10 hover:bg-white/20 text-white border-none" />
      </Carousel>
    </div>
  );
}
