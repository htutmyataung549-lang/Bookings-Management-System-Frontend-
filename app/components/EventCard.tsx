import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, Coins, Ticket, ArrowRight, Ban } from "lucide-react";
import Link from "next/link";

interface Event {
  id: string;
  title: string;
  eventDate: string;
  totalTickets: number;
  availableTickets: number;
  ticketPrice: number;
}

interface EventCardProps {
  event: Event;
}

export const EventCard = ({ event }: EventCardProps) => {
  const isAvailable = event.availableTickets > 0;

  return (
    <Card className="flex flex-col justify-between overflow-hidden border-zinc-200/80 dark:border-zinc-800 shadow-2xs hover:shadow-md transition-all duration-200 bg-card text-card-foreground group">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-2 mb-2">
          <CardTitle className="text-lg font-bold tracking-tight text-foreground line-clamp-2 leading-snug group-hover:text-emerald-600 transition-colors">
            {event.title}
          </CardTitle>

          {/* ✅ Sold Out Badge */}
          <Badge
            variant={isAvailable ? "secondary" : "destructive"}
            className={`text-xs font-semibold shrink-0 rounded-full h-6 px-2.5 uppercase tracking-wide gap-1 shadow-2xs ${
              isAvailable
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900"
                : "bg-red-50 text-red-600 border border-red-200/60 hover:bg-red-50 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900/50"
            }`}
          >
            {isAvailable ? (
              `Available: ${event.availableTickets}`
            ) : (
              <>
                <Ban className="w-3 h-3" /> Sold Out
              </>
            )}
          </Badge>
        </div>
        <CardDescription className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <CalendarDays className="w-3.5 h-3.5 text-zinc-400" />
          {new Date(event.eventDate).toLocaleDateString("en-US", {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </CardDescription>
      </CardHeader>

      <CardContent className="pb-4">
        <div className="space-y-2 text-sm border-t border-dashed border-zinc-100 dark:border-zinc-800 pt-3">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground flex items-center gap-1.5">
              <Coins className="w-3.5 h-3.5 text-zinc-400" /> Price
            </span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400 text-base">
              {event.ticketPrice.toLocaleString()} MMK
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground flex items-center gap-1.5">
              <Ticket className="w-3.5 h-3.5 text-zinc-400" /> Capacity
            </span>
            <span className="font-semibold text-zinc-700 dark:text-zinc-300">
              {event.totalTickets} Tickets
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <Link
          href={`/booking/${event.id}?name=${encodeURIComponent(
            event.title
          )}&price=${event.ticketPrice}&available=${event.availableTickets}`}
          className={`w-full ${!isAvailable ? "pointer-events-none" : ""}`}
        >
          <Button
            className={`w-full font-semibold shadow-2xs h-10 transition-all active:scale-[0.99] ${
              isAvailable
                ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                : "bg-zinc-100 text-zinc-400 dark:bg-zinc-900 dark:text-zinc-600 border border-zinc-200/40 dark:border-zinc-800 cursor-not-allowed"
            }`}
            disabled={!isAvailable}
          >
            {isAvailable ? (
              <span className="flex items-center gap-1">
                Buy Tickets{" "}
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            ) : (
              "Sold Out"
            )}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};
