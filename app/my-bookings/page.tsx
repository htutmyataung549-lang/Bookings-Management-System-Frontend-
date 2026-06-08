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
import { SearchX } from "lucide-react";

interface Booking {
  id: string;
  eventTitle?: string;
  customerName: string;
  quantity: number;
  totalAmount: number;
  bookingDate: string;
}

export default function MyBookingsPage() {
  const [searchName, setSearchName] = useState("");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!searchName.trim()) return;
    const res = await fetch(
      `/api/backend?endpoint=booking/user&customerName=${searchName}`
    );
    const result = await res.json();
    console.log("🔥 Frontend Recieved Result:", result);

    if (result.status === "Success") {
      setBookings(result.data);
    } else {
      setBookings([]);
    }
    setHasSearched(true);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      <Link href="/" className="text-sm text-emerald-600 hover:underline">
        ← Go Back Home{" "}
      </Link>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>📋 My Booking Details</CardTitle>
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
              className="text-base"
            />
            <Button
              onClick={handleSearch}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              Search
            </Button>
          </div>

          {/* Details  Table */}
          {hasSearched && bookings.length > 0 ? (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead>Event Title</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead className="text-center">Quantity</TableHead>
                    <TableHead className="text-right">Total Amount</TableHead>
                    <TableHead className="text-right">Booking Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((booking) => (
                    <TableRow key={booking.id} className="hover:bg-muted/30">
                      <TableCell className="font-semibold text-blue-600">
                        {booking.eventTitle || "Unknown Event"}
                      </TableCell>
                      <TableCell>{booking.customerName}</TableCell>
                      <TableCell className="text-center font-medium">
                        {booking.quantity} tickets
                      </TableCell>
                      <TableCell className="text-right font-bold text-emerald-600">
                        {booking.totalAmount
                          ? `${booking.totalAmount.toLocaleString()} MMK`
                          : "0 MMK"}
                      </TableCell>
                      <TableCell
                        className="text-right text-muted-foreground text-sm"
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
            hasSearched && (
              <div className="flex flex-col items-center justify-center text-center p-12 border border-dashed rounded-2xl bg-zinc-50/50 dark:bg-zinc-900/30">
                <div className="p-4 bg-zinc-100 rounded-full dark:bg-zinc-800 text-zinc-400 mb-4 animate-bounce duration-1000">
                  <SearchX className="w-8 h-8" />
                </div>

                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
                  No Bookings Found
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-sm">
                  No bookings found for &ldquo;
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    {searchName}
                  </span>
                  &rdquo;. Please try searching with a different name.
                </p>
              </div>
            )
          )}
        </CardContent>
      </Card>
    </div>
  );
}
