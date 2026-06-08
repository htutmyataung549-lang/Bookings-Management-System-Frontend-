"use client";
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Search,
  ChevronDown,
} from "lucide-react"; 
import SkeletonCard from "./components/skeleton";
import { EventCard } from "./components/EventCard";
// import { FooterSection } from "./components/footer-section";

interface Event {
  id: string;
  title: string;
  eventDate: string;
  totalTickets: number;
  availableTickets: number;
  ticketPrice: number;
}

export default function Home() {
  const [events, setEvents] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [visibleCount, setVisibleCount] = useState(6);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/backend?endpoint=events");
        const resData = await res.json();
        if (resData && res.status === 200 && Array.isArray(resData.data)) {
          console.log("Valid events data:", resData);
          setEvents(resData.data);
        } else {
          console.error("Invalid events data:", resData);
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
    event.title.toLowerCase().includes(query.toLowerCase())
  );

  const slicedEvents = filteredEvents.slice(0, visibleCount);

  const handleLoadMore = () => {
    setVisibleCount((prevCount) => prevCount + 6);
  };

  return (
    <div className="p-6 md:p-12 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-300">
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
              // <Card
              //   key={event.id}
              //   className="flex flex-col justify-between overflow-hidden border-zinc-200/80 dark:border-zinc-800 shadow-2xs hover:shadow-md transition-all duration-200 bg-card text-card-foreground group"
              // >
              //   <CardHeader className="pb-3">
              //     <div className="flex justify-between items-start gap-2 mb-2">
              //       <CardTitle className="text-lg font-bold tracking-tight text-foreground line-clamp-2 leading-snug group-hover:text-emerald-600 transition-colors">
              //         {event.title}
              //       </CardTitle>
              //       <Badge
              //         variant={
              //           event.availableTickets > 0 ? "secondary" : "destructive"
              //         }
              //         className={`text-xs font-semibold shrink-0 ${
              //           event.availableTickets > 0
              //             ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900"
              //             : ""
              //         }`}
              //       >
              //         {event.availableTickets > 0
              //           ? `Available: ${event.availableTickets}`
              //           : "Sold Out"}
              //       </Badge>
              //     </div>
              //     <CardDescription className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              //       <CalendarDays className="w-3.5 h-3.5 text-zinc-400" />
              //       {new Date(event.eventDate).toLocaleDateString("en-US", {
              //         weekday: "short",
              //         year: "numeric",
              //         month: "short",
              //         day: "numeric",
              //       })}
              //     </CardDescription>
              //   </CardHeader>

              //   <CardContent className="pb-4">
              //     <div className="space-y-2 text-sm border-t border-dashed border-zinc-100 dark:border-zinc-800 pt-3">
              //       <div className="flex justify-between items-center">
              //         <span className="text-muted-foreground flex items-center gap-1.5">
              //           <Coins className="w-3.5 h-3.5 text-zinc-400" /> Price
              //         </span>
              //         <span className="font-bold text-emerald-600 dark:text-emerald-400 text-base">
              //           {event.ticketPrice.toLocaleString()} MMK
              //         </span>
              //       </div>
              //       <div className="flex justify-between items-center">
              //         <span className="text-muted-foreground flex items-center gap-1.5">
              //           <Ticket className="w-3.5 h-3.5 text-zinc-400" />{" "}
              //           Capacity
              //         </span>
              //         <span className="font-semibold text-zinc-700 dark:text-zinc-300">
              //           {event.totalTickets} Tickets
              //         </span>
              //       </div>
              //     </div>
              //   </CardContent>

              //   <CardFooter className="pt-0">
              //     <Link
              //       href={`/booking/${event.id}?name=${encodeURIComponent(
              //         event.title
              //       )}&price=${event.ticketPrice}`}
              //       className="w-full"
              //     >
              //       <Button
              //         className={`w-full font-medium shadow-2xs ${
              //           event.availableTickets > 0
              //             ? "bg-emerald-600 hover:bg-emerald-700 text-white"
              //             : ""
              //         }`}
              //         disabled={event.availableTickets <= 0}
              //       >
              //         {event.availableTickets > 0 ? (
              //           <span className="flex items-center gap-1">
              //             Buy Tickets <ArrowRight className="w-3.5 h-3.5" />
              //           </span>
              //         ) : (
              //           "Sold Out"
              //         )}
              //       </Button>
              //     </Link>
              //   </CardFooter>
              // </Card>
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

      {/* <FooterSection/> */}
    </div>
  );
}
