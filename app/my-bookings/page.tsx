"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SearchX, ArrowLeft } from "lucide-react";

interface Booking {
  id: string;
  eventTitle?: string;
  customerName: string;
  quantity: number;
  totalAmount: number;
  bookingDate: string;
  eventDate: string;
}

export default function MyBookingsPage() {
  const [searchName, setSearchName] = useState("");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchName.trim()) return;

    setSearchLoading(true);
    try {
      const res = await fetch(
        `/api/backend?endpoint=booking/user&customerName=${encodeURIComponent(
          searchName.trim()
        )}`
      );
      const result = await res.json();
      console.log("🔥 Frontend Recieved Result:", result);

      if (result.status === "Success" && Array.isArray(result.data)) {
        setBookings(result.data);
      } else {
        setBookings([]);
      }
    } catch (error) {
      console.error("Search Error:", error);
      setBookings([]);
    } finally {
      setSearchLoading(false);
      setHasSearched(true);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
      <Link
        href="/"
        className="text-sm text-emerald-600 hover:underline flex items-center gap-1.5 w-fit transition-all"
      >
        <ArrowLeft className="w-4 h-4" /> Go Back Home
      </Link>

      <Card className="mt-4 border-zinc-200 dark:border-zinc-800 shadow-xs">
        <CardHeader className="space-y-1.5">
          <CardTitle className="text-xl md:text-2xl flex items-center gap-2">
            📋 My Booking Details
          </CardTitle>
          <CardDescription>
            You can view the details of your booked tickets by searching with
            your name
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* ရှာဖွေရေး အကွက် */}
          <div className="flex gap-2 max-w-md">
            <Input
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              placeholder="Search by your name..."
              className="text-base focus-visible:ring-emerald-500 h-10 bg-background"
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              disabled={searchLoading}
            />
            <Button
              onClick={handleSearch}
              className="bg-emerald-600 hover:bg-emerald-700 text-white h-10 px-5 font-medium transition-colors"
              disabled={searchLoading}
            >
              {searchLoading ? "Searching..." : "Search"}
            </Button>
          </div>

          {/* Details Table & Empty States Container */}
          {hasSearched && (
            <>
              {bookings.length > 0 ? (
                <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden animate-in fade-in duration-200">
                  <Table>
                    <TableHeader className="bg-zinc-50 dark:bg-zinc-900/50">
                      <TableRow className="hover:bg-transparent border-zinc-200 dark:border-zinc-800">
                        <TableHead className="font-semibold text-zinc-700 dark:text-zinc-300">
                          Event Title
                        </TableHead>
                        <TableHead className="font-semibold text-zinc-700 dark:text-zinc-300">
                          Customer
                        </TableHead>
                        <TableHead className="text-center font-semibold text-zinc-700 dark:text-zinc-300">
                          Quantity
                        </TableHead>
                        <TableHead className="text-right font-semibold text-zinc-700 dark:text-zinc-300">
                          Event Date
                        </TableHead>
                        <TableHead className="text-right font-semibold text-zinc-700 dark:text-zinc-300">
                          Total Amount
                        </TableHead>
                        <TableHead className="text-right font-semibold text-zinc-700 dark:text-zinc-300">
                          Booking Date
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bookings.map((booking) => (
                        <TableRow
                          key={booking.id}
                          className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30 border-zinc-100 dark:border-zinc-800 transition-colors"
                        >
                          <TableCell className="font-semibold text-emerald-600 dark:text-emerald-400 max-w-45 truncate">
                            {booking.eventTitle || "Unknown Event"}
                          </TableCell>
                          <TableCell className="text-zinc-600 dark:text-zinc-400 font-medium">
                            {booking.customerName}
                          </TableCell>
                          <TableCell className="text-center font-medium text-zinc-800 dark:text-zinc-200">
                            {booking.quantity}{" "}
                            {booking.quantity === 1 ? "ticket" : "tickets"}
                          </TableCell>
                          
                          {/* 📅 Event Date Column (Formatted properly & Midnight-safe for Safari) */}
                          <TableCell 
                            className="text-right font-medium text-zinc-700 dark:text-zinc-300 text-xs"
                            suppressHydrationWarning
                          >
                            {booking.eventDate
                              ? new Date(booking.eventDate.replace(" ", "T")).toLocaleDateString(undefined, {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })
                              : "-"}
                          </TableCell>

                          <TableCell className="text-right font-bold text-zinc-900 dark:text-zinc-100">
                            {booking.totalAmount
                              ? `${booking.totalAmount.toLocaleString()} MMK`
                              : "0 MMK"}
                          </TableCell>
                          
                          <TableCell
                            className="text-right text-muted-foreground text-xs"
                            suppressHydrationWarning
                          >
                            {booking.bookingDate
                              ? new Date(
                                  booking.bookingDate.endsWith("Z")
                                    ? booking.bookingDate
                                    : booking.bookingDate + "Z"
                                ).toLocaleString()
                              : "-"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                /* Empty State */
                <div className="flex flex-col items-center justify-center text-center p-12 border border-dashed rounded-2xl border-zinc-200 dark:border-zinc-800 bg-zinc-50/30 dark:bg-zinc-900/10 animate-in fade-in duration-200">
                  <div className="p-3.5 bg-zinc-100 rounded-full dark:bg-zinc-800 text-zinc-400 mb-4 shadow-2xs">
                    <SearchX className="w-6 h-6" />
                  </div>

                  <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
                    No Bookings Found
                  </h3>
                  <p className="text-xs text-muted-foreground max-w-sm mt-0.5 leading-relaxed">
                    We couldn&apos;t find any ticket bookings under the name
                    &ldquo;
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      {searchName}
                    </span>
                    &rdquo;. Please verify your spelling and try again.
                  </p>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}