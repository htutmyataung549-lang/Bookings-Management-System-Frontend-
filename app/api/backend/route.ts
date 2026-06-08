import { NextResponse } from "next/server";

// Environment Variable သုံးထားခြင်းက အလွန်ကောင်းမွန်ပါသည်။ Fallback အတွက် Render URL ထည့်ထားပေးသည်။
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://bookings-management-system.onrender.com/api';


function buildBackendUrl(requestUrl: string): { url: string; error?: string } {
  const { searchParams } = new URL(requestUrl);
  const endpoint = searchParams.get("endpoint");

  if (!endpoint) {
    return { url: "", error: "Endpoint query parameter is required" };
  }

  // endpoint ကို ဖယ်ထုတ်ပြီး ကျန်သော query params များကို dynamic parameter အဖြစ် ယူခြင်း
  const backendParams = new URLSearchParams(searchParams.toString());
  backendParams.delete("endpoint");

  const queryString = backendParams.toString();
  const finalUrl = queryString ? `${BACKEND_URL}/${endpoint}?${queryString}` : `${BACKEND_URL}/${endpoint}`;
  
  return { url: finalUrl };
}

// ==========================================
// GET METHOD PROXY
// ==========================================
export async function GET(request: Request) {
  const { url, error } = buildBackendUrl(request.url);

  if (error) {
    return NextResponse.json({ error }, { status: 400 });
  }

  try {
    const response = await fetch(url, { cache: "no-store" });
    
    // Response Error Handling
    if (!response.ok) {
      return NextResponse.json(
        { error: `Backend responded with status: ${response.status}` }, 
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("Error fetching data from backend:", msg);
    return NextResponse.json({ error: "Error fetching data from backend" }, { status: 500 });
  }
}

// ==========================================
//  POST METHOD PROXY
// ==========================================
export async function POST(request: Request) {
  const { url, error } = buildBackendUrl(request.url);

  if (error) {
    return NextResponse.json({ error }, { status: 400 });
  }

  try {
    const body = await request.json();

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body),
      cache: "no-store"
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Backend POST failed with status: ${response.status}` }, 
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("Data successfully posted to backend:", data);
    return NextResponse.json(data);
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("Error posting data to backend:", msg);
    return NextResponse.json({ error: "Error posting data to backend" }, { status: 500 });
  }
}