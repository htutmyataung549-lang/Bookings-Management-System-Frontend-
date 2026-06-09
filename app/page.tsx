"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge"; // 💡 Count Badge အတွက် ထည့်သွင်းခြင်း
import Link from "next/link";
import { useEffect, useState } from "react";
import { Search, ChevronDown, CalendarX, LayoutGrid, List } from "lucide-react"; // 💡 Empty State အတွက် Icon အသစ်
import SkeletonCard from "./components/skeleton";
import { EventCard } from "./components/EventCard";
import { FooterSection } from "./components/footer-section";
import { CtaBanner } from "./components/cta-banner";
import { FeaturesSection } from "./components/features-section";
import { VenuesSection } from "./components/venues-section";
import { FaqSection } from "./components/faq-question";
import { EventCarousel } from "./components/EventCarousel";
import { BackToTop } from "./components/BackToTop";

interface Event {
  id: string;
  title: string;
  eventDate: string;
  totalTickets: number;
  availableTickets: number;
  ticketPrice: number;
}

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [visibleCount, setVisibleCount] = useState(6);
  const [wakingUpMessage, setWakingUpMessage] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    return () => {
      clearTimeout(handler);
    };
  }, [query]);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setWakingUpMessage(""); // Reset message on new fetch

      // 💡 ၅ စက္ကန့်အတွင်း API က data မကျလာရင် Server အိပ်ပျော်နေတယ်လို့ ယူဆပြီး message ကို ကြိုပြထားမယ်
      const wakingTimeout = setTimeout(() => {
        setWakingUpMessage(
          "Our free server takes about 30-50 seconds to spin up if it has been inactive. Thank you for your patience!"
        );
      }, 5000);
      try {
        const res = await fetch("/api/backend?endpoint=events");
        const resData = await res.json();
        console.log(resData);

        clearTimeout(wakingTimeout);
        setWakingUpMessage("");

        if (res.status === 200) {
          if (resData && Array.isArray(resData.data)) {
            // console.log("Valid format with data key:", resData.data);

            // 💡 ၁။ ရက်စွဲအနီးဆုံးပွဲများကို အပေါ်ဆုံးသို့ ရောက်အောင် Sort စီပေးခြင်း
            const sortedData = resData.data.sort(
              (a: Event, b: Event) =>
                new Date(a.eventDate).getTime() -
                new Date(b.eventDate).getTime()
            );
            setEvents(sortedData);
          } else if (Array.isArray(resData)) {
            console.log("Valid format as direct array:", resData);

            const sortedData = resData.sort(
              (a: Event, b: Event) =>
                new Date(a.eventDate).getTime() -
                new Date(b.eventDate).getTime()
            );
            setEvents(sortedData);
          } else {
            if (resData.message) {
              setWakingUpMessage(resData.message);
            }
            setEvents([]);
          }
        } else {
          console.error(
            "Backend responded with error status:",
            res.status,
            resData
          );
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // 💡 ၂။ Search Query ရော ယနေ့ရက်စွဲပါ ကိုက်ညီမှ (Upcoming Events သာ) စစ်ထုတ်ပြသခြင်း
  const filteredEvents = events.filter((event: Event) => {
    const matchesQuery = event.title
      .toLowerCase()
      .includes(debouncedQuery.toLowerCase());

    const eventDate = new Date(event.eventDate);
    const now = new Date();
    eventDate.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);

    const isUpcoming = eventDate >= now;

    return matchesQuery && isUpcoming;
  });

  const slicedEvents = filteredEvents.slice(0, visibleCount);

  const handleLoadMore = () => {
    setVisibleCount((prevCount) => prevCount + 6);
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="p-6 md:p-12 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-300">
        {/* Top Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6 border-zinc-100 dark:border-zinc-800">
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-extrabold text-emerald-600 tracking-tight flex items-center gap-2">
              🎟️ TicketGo
            </h1>
            <p className="text-sm text-muted-foreground">
              Discover and book the best events around you.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:max-w-xl">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search events by title..."
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setVisibleCount(6);
                }}
                className="pl-9 h-10 focus-visible:ring-emerald-500 bg-background"
              />
            </div>
            <Link href="/my-bookings" className="w-full sm:w-auto">
              <Button
                variant="outline"
                className="w-full border-zinc-200 shadow-2xs dark:border-zinc-800"
              >
                View My Bookings
              </Button>
            </Link>
          </div>
        </div>

        {/* Banner Carousel */}
        <EventCarousel />

        {/* Events Grid */}
        <div className="space-y-6">
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              Upcoming Live Shows
            </h2>
            {/* 💡 Live Booking Indicator with Animated Ping Effect */}
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                Live Booking
              </span>
            </div>

            {/* 💡 View Toggle Buttons */}
            <div className="flex items-center border border-zinc-200 dark:border-zinc-800 rounded-xl p-0.5 bg-zinc-50 dark:bg-zinc-900">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === "grid"
                    ? "bg-white dark:bg-zinc-800 shadow-2xs text-emerald-600"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === "list"
                    ? "bg-white dark:bg-zinc-800 shadow-2xs text-emerald-600"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {!loading && filteredEvents.length > 0 && (
              <Badge
                variant="secondary"
                className="rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 font-medium"
              >
                {filteredEvents.length}{" "}
                {filteredEvents.length === 1 ? "Show" : "Shows"}
              </Badge>
            )}
          </div>

          {/* Server Waking Up Alert box */}
          {wakingUpMessage && (
            <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-xl text-amber-800 dark:text-amber-300 text-sm flex items-center gap-3 animate-pulse">
              <span className="text-base">⏳</span>
              <div>
                <span className="font-semibold">Note:</span> {wakingUpMessage}
              </div>
            </div>
          )}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <SkeletonCard key={index} />
              ))}
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-20 border border-dashed rounded-2xl bg-zinc-50/50 dark:bg-zinc-900/10 animate-in fade-in duration-200">
              <div className="p-3.5 bg-zinc-100 dark:bg-zinc-800 rounded-full text-zinc-400 mb-4">
                <CalendarX className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                No events found
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Try adjusting your search or filters.
              </p>
              <p className="text-sm text-muted-foreground max-w-xs mt-1">
                {query ? (
                  <span>
                    We couldn&apos;t find any live shows matching &ldquo;
                    <span className="font-medium text-zinc-800 dark:text-zinc-200">
                      {query}
                    </span>
                    &rdquo;.
                  </span>
                ) : (
                  "There are currently no upcoming shows scheduled. Please check back later!"
                )}
              </p>
            </div>
          ) : (
            <div className="space-y-10">
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    : "flex flex-col gap-4 max-w-3xl mx-auto"
                }
              >
                {slicedEvents.map((event: Event) => (
                  <EventCard event={event} key={event.id} />
                ))}
              </div>

              {filteredEvents.length > visibleCount && (
                <div className="flex justify-center pt-2">
                  <Button
                    variant="outline"
                    onClick={handleLoadMore}
                    className="gap-2 px-6 h-10 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 hover:text-emerald-600"
                  >
                    Load More Events{" "}
                    <ChevronDown className="w-4 h-4 animate-bounce duration-1000" />
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Features, Venues, CTA, FAQ Sections */}
        <FeaturesSection />
        <VenuesSection />
        <CtaBanner />
        <FaqSection />
        <BackToTop />
      </main>
      <FooterSection />
    </div>
  );
}
