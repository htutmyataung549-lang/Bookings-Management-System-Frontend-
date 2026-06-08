"use client";
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Search, ChevronDown } from "lucide-react";
import SkeletonCard from "./components/skeleton";
import { EventCard } from "./components/EventCard";
import { FooterSection } from "./components/footer-section";
import { CtaBanner } from "./components/cta-banner";
import { FeaturesSection } from "./components/features-section";
import { VenuesSection } from "./components/venues-section";
import { FaqSection } from "./components/faq-question";

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

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    },300);
    return () => {
      clearTimeout(handler);
    }
  },[query]);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      // setWakingUpMessage("Server is waking up from its nap...");
      try {
        const res = await fetch("/api/backend?endpoint=events");
        const resData = await res.json();
        console.log(resData);

        if (res.status === 200) {
          //  Backend data is  { data: [...] }
          if (resData && Array.isArray(resData.data)) {
            console.log("Valid format with data key:", resData.data);
            setEvents(resData.data);
          } else if (Array.isArray(resData)) {
            console.log("Valid format as direct array:", resData);
            setEvents(resData);
          } else {
            // console.warn(
            //   "Received empty or mismatch object ({}), falling back safely to empty array."
            // );
            if (resData.message) {
              setWakingUpMessage(resData.message); // "Server is waking up..."
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

  // Filter events based on search query
  const filteredEvents = events.filter((event: Event) =>
    event.title.toLowerCase().includes(debouncedQuery.toLowerCase())
  );

  const slicedEvents = filteredEvents.slice(0, visibleCount);

  const handleLoadMore = () => {
    setVisibleCount((prevCount) => prevCount + 6);
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="p-6 md:p-12 max-w-6xl mx-auto space-y-12 animate-in fade-in duration-300">
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

        {/* Events Grid */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Upcoming Live Shows
          </h2>

          {/*Server Waking Up Alert box */}
          {wakingUpMessage && !loading && (
            <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-xl text-amber-800 dark:text-amber-300 text-sm flex items-center gap-3 animate-pulse">
              <span className="text-base">⏳</span>
              <div>
                <span className="font-semibold">Note:</span> {wakingUpMessage}{" "}
                Our free server takes about 30-50 seconds to spin up if it has
                been inactive. Thank you for your patience!
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
            <div className="text-center py-16 text-muted-foreground">
              No events match your search.
            </div>
          ) : (
            <div className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        {/* 💡 SECTION NEW  Brand Trust Value Propositions */}
        <FeaturesSection />
        {/* 💡 SECTION NEW: Popular Venues Section */}
        <VenuesSection />
        {/* 💡 SECTION NEW Conversion Driven Organizer CTA */}
        <CtaBanner />
        {/* 💡 SECTION NEW: Frequently Asked Questions */}
        <FaqSection />
      </main>
      <FooterSection />
    </div>
  );
}
