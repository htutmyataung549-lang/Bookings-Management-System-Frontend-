import { jsPDF } from "jspdf";
import autoTable, { UserOptions } from "jspdf-autotable";

interface TicketData {
  bookingId: string;
  eventTitle: string;
  customerName: string;
  quantity: number;
  totalAmount: number;
  bookingDate: string;
}

// 💡 any လုံးဝမပါဘဲ jspdf-autotable ရဲ့ အတွင်းပိုင်း properties များကို Type အသေအချာ သတ်မှတ်ခြင်း
interface ExtendedTableProperties {
  finalY: number;
}

interface SafeJsPDF extends jsPDF {
  setLineDash: (segments: number[], offset: number) => jsPDF;
  autoTable: (options: UserOptions) => void;
  lastAutoTable?: ExtendedTableProperties; // 👈 any မသုံးဘဲ Optional သတ်မှတ်ထားပါတယ်
}

export const generateTicketPDF = (data: TicketData): void => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a6",
  }) as SafeJsPDF;

  // Turbopack / Next.js Runtime အမှားအတွက် Plugin ကို Type-safe အတိုင်း တွဲပေးခြင်း
  if (typeof doc.autoTable !== "function") {
    doc.autoTable = function (options: UserOptions): void {
      autoTable(this, options);
    };
  }

  // --- Design Styling Configuration ---
  const brandColor = "#10b981"; // Emerald 600
  const darkTextColor = "#18181b"; // Zinc 900
  const lightTextColor = "#71717a"; // Zinc 500

  // Header background Accent Line
  doc.setFillColor(16, 185, 129);
  doc.rect(0, 0, 105, 4, "F");

  // Logo / Title
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(brandColor);
  doc.text("🎟️ TicketGo", 10, 15);

  // Receipt / Ticket Subtitle
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(lightTextColor);
  doc.text("Official Entry Ticket & Receipt", 10, 20);

  // Dashed Line ဆွဲခြင်း (Type-safe)
  doc.setDrawColor(228, 228, 231); 
  doc.setLineDash([2, 2], 0); 
  doc.line(10, 25, 95, 25);
  doc.setLineDash([], 0); 

  // Ticket Info Table Data
  const tableRows: string[][] = [
    ["Booking ID", `#${data.bookingId.slice(-8).toUpperCase()}`],
    ["Event Title", data.eventTitle],
    ["Customer Name", data.customerName],
    ["Quantity", `${data.quantity} Tickets`],
    ["Date & Time", new Date(data.bookingDate).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })],
  ];

  // Table ဆွဲခြင်း
  doc.autoTable({
    startY: 28,
    margin: { left: 10, right: 10 },
    theme: "plain",
    body: tableRows,
    styles: {
      fontSize: 9,
      cellPadding: 2.5,
      textColor: darkTextColor,
      font: "Helvetica"
    },
    columnStyles: {
      0: { fontStyle: "bold", textColor: lightTextColor, cellWidth: 30 },
      1: { fontStyle: "normal" }
    }
  });

  // Total Amount Due Section
  // 💡 Safe Optional Chaining သုံးထားလို့ any မလိုဘဲ အလုပ်လုပ်ပါတယ်၊ မရှိရင် 70mm ကို Fallback ယူပါတယ်
  const finalY = doc.lastAutoTable?.finalY ?? 70;
  const contentY = finalY + 4;
  
  doc.setFillColor(244, 244, 245); 
  doc.rect(10, contentY, 85, 12, "F");

  doc.setFont("Helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(darkTextColor);
  doc.text("Total Paid Amount:", 14, contentY + 7.5);

  const amountString = `${data.totalAmount.toLocaleString()} MMK`;
  doc.setFontSize(11);
  doc.setTextColor(brandColor);
  doc.text(amountString, 91, contentY + 7.5, { align: "right" });

  // Footer / Note
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(lightTextColor);
  doc.text("Thank you for your purchase!", 52.5, contentY + 22, { align: "center" });
  doc.text("Please show this PDF at the entrance gate.", 52.5, contentY + 26, { align: "center" });

  // Save the PDF
  doc.save(`TicketGo-${data.bookingId.slice(-6).toUpperCase()}.pdf`);
};