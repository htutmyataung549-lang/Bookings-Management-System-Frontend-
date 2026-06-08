"use client";

import { useState, useEffect, Suspense } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  ArrowLeft,
  Ticket,
  User,
  ShoppingCart,
  Loader2,
  CheckCircle2,
  Download,
  RefreshCw,
} from "lucide-react";
import { generateTicketPDF } from "@/lib/generate-ticket-pdf";
import BookingTimer from "@/app/components/booking-timer";

interface BookingResult {
  bookingId: string;
  eventTitle: string;
  customerName: string;
  quantity: number;
  totalAmount: number;
  bookingDate: string;
}

interface Event {
  id: string;
  title: string;
  eventDate: string;
  totalTickets: number;
  availableTickets: number;
  ticketPrice: number;
}

function generateFallbackTicketId(): string {
  return `TK-${Math.floor(100000 + Math.random() * 900000)}`;
}

function BookingFormContent() {
  const { id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const urlEventName = searchParams.get("name") || "";
  const urlTicketPrice = searchParams.get("price")
    ? Number(searchParams.get("price"))
    : null;

  const [event, setEvent] = useState<Event | null>(null);
  const [customerName, setCustomerName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  // Success State & Data သိမ်းရန် ကောင်တာများ
  const [isSuccess, setIsSuccess] = useState(false);
  const [successData, setSuccessData] = useState<BookingResult | null>(null);

  // ✅ ၂။ အချိန် ၁၀ မိနစ်ပြည့်သွားခြင်း ရှိ/မရှိ စစ်ဆေးမည့် State
  const [isTimeOut, setIsTimeOut] = useState(false);

  useEffect(() => {
    if (!id) return;
    const eventId = Array.isArray(id) ? id[0] : id;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPageLoading(true);
    fetch(`/api/backend?endpoint=events/${eventId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((res) => {
        const actualData = res.data !== undefined ? res.data : res;
        setEvent(actualData);
      })
      .catch((err) => {
        console.error("Error fetching event:", err);
        toast.error("Failed to load event details.");
      })
      .finally(() => setPageLoading(false));
  }, [id]);

  // ✅ ၃။ အချိန်ပြည့်သွားပါက လုပ်ဆောင်မည့် Function
  const handleTimeout = () => {
    setIsTimeOut(true);
    toast.error("Your ticket hold session has expired! Please try again.", {
      duration: 5000,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 💡 အချိန်ကုန်သွားရင် Form Submit လုပ်ခွင့်မပြုပါ
    if (isTimeOut) return;

    const currentEventId = Array.isArray(id) ? id[0] : id;
    if (!customerName.trim() || !currentEventId) return;

    setLoading(true);
    const toastId = toast.loading("Booking Submission...");

    try {
      const res = await fetch("/api/backend?endpoint=bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: currentEventId,
          customerName: customerName.trim(),
          quantity,
        }),
      });

      const result = await res.json();

      if (result.status === "Success" || res.status === 200) {
        toast.success("Booking submitted successfully!", { id: toastId });

        // Math.random() ကို Event Handler ထဲတွင် သီးသန့် ကွဲထွက်အောင် Variable အရင်ဆောက်ခြင်း
        const fallbackId = generateFallbackTicketId();
        const calculatedAmount = currentPrice * quantity;

        const finalBookingData = {
          bookingId: result.data?.id || fallbackId,
          eventTitle: displayEventTitle,
          customerName: customerName.trim(),
          quantity: quantity,
          totalAmount: result.data?.totalAmount || calculatedAmount,
          bookingDate: result.data?.bookingDate || new Date().toISOString(),
        };

        setSuccessData(finalBookingData);
        setIsSuccess(true);
      } else {
        toast.error(result.message || "Failed to submit booking.", {
          id: toastId,
        });
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      toast.error("Error connecting to the server.", { id: toastId });
      setLoading(false);
    }
  };

  const currentPrice = event?.ticketPrice ?? urlTicketPrice ?? 0;
  const displayEventTitle = event ? event.title : urlEventName;
  const availableTickets = event ? event.availableTickets : 0;
  const isSoldOut = event !== null && availableTickets <= 0;

  // ==========================================
  // ဝယ်ယူမှု အောင်မြင်သွားချိန်တွင် ပေါ်လာမည့် UI
  // ==========================================
  if (isSuccess && successData) {
    return (
      <Card className="border-emerald-500/20 shadow-2xl bg-linear-to-b from-emerald-50/10 to-transparent dark:from-emerald-950/10 animate-in zoom-in-95 duration-300">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto p-3 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-full w-fit mb-3 animate-bounce">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <CardTitle className="text-2xl font-black text-zinc-900 dark:text-zinc-50">
            Booking Confirmed!
          </CardTitle>
          <CardDescription className="text-sm">
            Your registration is complete. Your ticket is ready for download.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 text-sm px-6">
          <div className="border rounded-xl p-4 bg-background space-y-3 shadow-2xs">
            <div className="flex justify-between border-b pb-2 border-dashed">
              <span className="text-muted-foreground">Ticket ID</span>
              <span className="font-mono font-bold text-zinc-800 dark:text-zinc-200">
                #{successData.bookingId.slice(-8).toUpperCase()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Event</span>
              <span className="font-semibold text-right max-w-45 line-clamp-1">
                {successData.eventTitle}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Passenger Name</span>
              <span className="font-medium">{successData.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Quantity</span>
              <span className="font-semibold">
                {successData.quantity} Tickets
              </span>
            </div>
            <div className="flex justify-between border-t pt-2 border-zinc-100 dark:border-zinc-800">
              <span className="font-bold text-zinc-700 dark:text-zinc-300">
                Amount Paid
              </span>
              <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-base">
                {successData.totalAmount.toLocaleString()} MMK
              </span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row gap-2 pb-6 px-6">
          <Button
            onClick={async () => {
              const toastId = toast.loading("Generating PDF Ticket...");
              try {
                await generateTicketPDF(successData);
                toast.success("Ticket downloaded successfully!", {
                  id: toastId,
                });
              } catch (err) {
                console.error(err);
                toast.error("Failed to generate PDF.", { id: toastId });
              }
            }}
            className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold gap-2 shadow-sm"
          >
            <Download className="w-4 h-4" /> Download Ticket (PDF)
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push("/")}
            className="w-full h-11 border-zinc-200 text-zinc-700 dark:border-zinc-800 dark:text-zinc-300"
          >
            Back to Home
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {!pageLoading && !isSoldOut && !isTimeOut && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-300">
          <BookingTimer initialSeconds={10 * 60} onTimeOut={handleTimeout} />
        </div>
      )}

      <Card
        className={`relative overflow-hidden border-zinc-200/80 shadow-lg dark:border-zinc-800 transition-all duration-300 ${
          isTimeOut ? "opacity-60 pointer-events-none select-none" : ""
        }`}
      >
        {pageLoading && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-emerald-400 via-teal-500 to-emerald-600 animate-pulse" />
        )}

        <CardHeader className="space-y-2 bg-zinc-50/50 pb-6 border-b dark:bg-zinc-900/50">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-full w-fit">
            <Ticket className="w-3.5 h-3.5" /> Ticket Reservation
          </div>
          <CardTitle className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Ticket Booking Form
          </CardTitle>
          <CardDescription className="text-sm text-zinc-500 dark:text-zinc-400">
            Event Name:{" "}
            <span className="font-semibold text-zinc-800 dark:text-zinc-200">
              {displayEventTitle || "Loading..."}
            </span>
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6 space-y-5">
          {isTimeOut ? (
            <div className="text-center py-6 px-4 text-destructive font-semibold bg-destructive/10 border border-destructive/20 rounded-xl space-y-1 animate-in fade-in zoom-in-95">
              <div>⚠️ Hold Session Expired</div>
              <p className="text-xs font-normal text-muted-foreground">
                The tickets held for you have been released back to stock.
              </p>
            </div>
          ) : (
            <form
              id="booking-form"
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 inline-flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-zinc-400" /> Name
                </label>
                <Input
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Enter your name (e.g., John Doe)"
                  className="focus-visible:ring-emerald-500 h-10"
                  required
                  disabled={loading || pageLoading}
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 inline-flex items-center gap-1.5">
                    <ShoppingCart className="w-3.5 h-3.5 text-zinc-400" />{" "}
                    Quantity
                  </label>
                  {(event || urlEventName) && (
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-md ${
                        isSoldOut
                          ? "bg-red-50 text-red-600"
                          : "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400"
                      }`}
                    >
                      {event
                        ? isSoldOut
                          ? "Sold Out"
                          : `Available: ${availableTickets} tickets`
                        : "Loading Stock..."}
                    </span>
                  )}
                </div>
                <Input
                  type="number"
                  min={1}
                  max={event ? availableTickets : 100}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="focus-visible:ring-emerald-500 h-10"
                  required
                  disabled={loading || pageLoading || isSoldOut}
                />
              </div>

              <div className="p-4 bg-zinc-50 rounded-xl space-y-2.5 text-sm border border-zinc-100 dark:bg-zinc-900 dark:border-zinc-800/60">
                <div className="flex justify-between items-center text-zinc-500 dark:text-zinc-400">
                  <span>Original Price</span>
                  <span className="font-medium text-zinc-700 dark:text-zinc-300">
                    <span className="font-medium text-zinc-700 dark:text-zinc-300">
                      {currentPrice > 0
                        ? `${currentPrice.toLocaleString()} MMK`
                        : "--- MMK"}
                    </span>
                  </span>
                </div>
                <div className="flex justify-between items-center font-semibold text-zinc-900 border-t border-zinc-200/60 pt-2.5 mt-1 dark:text-zinc-100 dark:border-zinc-800">
                  <span className="text-zinc-600 dark:text-zinc-400">
                    Total Amount Due
                  </span>
                  <span className="text-base font-bold text-emerald-600 dark:text-emerald-400">
                    {currentPrice > 0
                      ? `${(currentPrice * quantity).toLocaleString()} MMK`
                      : "--- MMK"}
                  </span>
                </div>
              </div>
            </form>
          )}
        </CardContent>

        <CardFooter className="pb-6 pt-2">
          {isTimeOut ? (
            <Button
              type="button"
              onClick={() => window.location.reload()}
              className="w-full h-11 bg-zinc-900 hover:bg-zinc-800 text-white font-medium shadow-sm gap-2 active:scale-[0.98] transition-all pointer-events-auto"
            >
              <RefreshCw className="w-4 h-4" /> Restart Booking Process
            </Button>
          ) : (
            <Button
              type="submit"
              form="booking-form"
              className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-sm transition-all focus-visible:ring-emerald-500 active:scale-[0.98]"
              disabled={loading || pageLoading || isSoldOut}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : isSoldOut ? (
                "Tickets sold out"
              ) : (
                "Submit Booking"
              )}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}

export default function BookTicketPage() {
  return (
    <div className="p-6 md:p-12 max-w-md mx-auto space-y-4">
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500 hover:text-emerald-600 transition-colors group mb-2"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          Back to Home
        </Link>
      </div>

      <Suspense
        fallback={
          <Card className="border border-dashed p-12 text-center flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-6 h-6 text-emerald-500 animate-spin" />
            <div className="text-sm font-medium text-zinc-500">
              Loading booking form...
            </div>
          </Card>
        }
      >
        <BookingFormContent />
      </Suspense>
    </div>
  );
}
