import { jsPDF } from "jspdf";
import autoTable, { UserOptions } from "jspdf-autotable";
import QRCode from "qrcode"; 
interface TicketData {
  bookingId: string;
  eventTitle: string;
  customerName: string;
  quantity: number;
  totalAmount: number;
  bookingDate: string;
}

interface ExtendedTableProperties {
  finalY: number;
}

interface SafeJsPDF extends jsPDF {
  setLineDash: (segments: number[], offset: number) => jsPDF;
  autoTable: (options: UserOptions) => void;
  lastAutoTable?: ExtendedTableProperties;
}

// 💡 ၂။ QRCode ထုတ်လုပ်ခြင်းက Async ဖြစ်လို့ Function ကို async ပြောင်းပေးရပါမယ်
export const generateTicketPDF = async (data: TicketData): Promise<void> => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a6",
  }) as SafeJsPDF;

  // Turbopack / Next.js Runtime အမှားအတွက် Plugin ကို တွဲပေးခြင်း
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

  // Dashed Line ဆွဲခြင်း
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

  const finalY = doc.lastAutoTable?.finalY ?? 70;
  const contentY = finalY + 4;
  
  // Total Amount Due Section
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

  // ==========================================
  // 💡 ၃။ QR CODE GENERATION & INTEGRATION
  // ==========================================
  try {
    // ဝင်ပေါက်က ကောင်တာမှာ Scan ဖတ်ရင် သိစေချင်တဲ့ အချက်အလက် (ဥပမာ- Booking ID စစ်စစ်) ကို ထည့်ပါမယ်
    const qrValue = `TICKETGO-VALIDATION:${data.bookingId}`;
    
    // QR Code ကို Base64 Image URL အဖြစ် ပြောင်းလဲခြင်း
    const qrDataUrl = await QRCode.toDataURL(qrValue, {
      margin: 1,
      width: 120,
      color: {
        dark: "#18181b",  // Zinc 900
        light: "#ffffff", // Background အဖြူ
      },
    });

    // PDF စာမျက်နှာအလယ်မှာ 28mm x 28mm အရွယ်အစားနဲ့ QR Code ပုံ ထည့်ခြင်း
    const qrSize = 28;
    const qrX = (105 - qrSize) / 2; // A6 width (105mm) ရဲ့ အလယ်တည့်တည့် တွက်ချက်ခြင်း
    const qrY = contentY + 16;      // စုစုပေါင်း ကျသင့်ငွေ ဘားရဲ့ အောက်နားမှာ ကပ်ရက်နေရာချခြင်း

    doc.addImage(qrDataUrl, "PNG", qrX, qrY, qrSize, qrSize);

    // Footer / Note တွေကို QR Code ရဲ့ အောက်ဘက်သို့ ရွှေ့ပေးလိုက်ပါတယ်
    const footerY = qrY + qrSize + 6;
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(lightTextColor);
    doc.text("Thank you for your purchase!", 52.5, footerY, { align: "center" });
    doc.text("Please show this QR Code at the entrance gate.", 52.5, footerY + 4, { align: "center" });

  } catch (qrError) {
    console.error("Failed to generate QR code for PDF:", qrError);
    // တကယ်လို့ QR code ထုတ်တာ တစ်ခုခုမှားခဲ့ရင် အရင်အတိုင်း စာသားပဲ ဖော်ပြပေးဖို့ Fallback ရေးထားပါတယ်
    const footerY = contentY + 22;
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(lightTextColor);
    doc.text("Thank you for your purchase!", 52.5, footerY, { align: "center" });
    doc.text("Please show this PDF at the entrance gate.", 52.5, footerY + 4, { align: "center" });
  }

  // Save the PDF
  doc.save(`TicketGo-${data.bookingId.slice(-6).toUpperCase()}.pdf`);
};