import { NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://bookings-management-system.onrender.com/api' || 'http://localhost:8080/api';


function buildBackendUrl(requestUrl: string): { url: string; error?: string } {
  const { searchParams } = new URL(requestUrl);
  const endpoint = searchParams.get("endpoint");

  if (!endpoint) {
    return { url: "", error: "Endpoint query parameter is required" };
  }

  const backendParams = new URLSearchParams(searchParams.toString());
  backendParams.delete("endpoint");

  const queryString = backendParams.toString();
  const finalUrl = queryString ? `${BACKEND_URL}/${endpoint}?${queryString}` : `${BACKEND_URL}/${endpoint}`;
  
  return { url: finalUrl };
}

// ==========================================
// GET METHOD PROXY (Render Free Tier)
// ==========================================
export async function GET(request: Request) {
  const { url, error } = buildBackendUrl(request.url);

  if (error) {
    return NextResponse.json({ error }, { status: 400 });
  }

  console.log("🚀 Requesting to Render Backend URL:", url);

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 90000); // 90 Seconds Timeout

    const response = await fetch(url, { 
      cache: "no-store",
      signal: controller.signal 
    });
    
    clearTimeout(timeoutId);

    // Response Error Handling
    if (!response.ok) {
      console.error(`❌ Backend error status: ${response.status}`);
      return NextResponse.json({ data: [] }, { status: 200 }); // UI မပျက်အောင် ကာကွယ်ခြင်း
    }

    const data = await response.json();
    // console.log("🎯 Backend Data Recieved: ", data);

    if (Array.isArray(data)) {
      return NextResponse.json({ data: data });
    }

    if (data && Array.isArray(data.data)) {
      return NextResponse.json(data);
    }

    return NextResponse.json({ data: [] });

  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("🚨 Render Server is waking up...", msg);
    
    return NextResponse.json({ data: [], message: "Server is waking up, please refresh after a few seconds." }, { status: 200 });
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


// import { NextResponse } from "next/server";

// const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://bookings-management-system.onrender.com/api';


// function buildBackendUrl(requestUrl: string): { url: string; error?: string } {
//   const { searchParams } = new URL(requestUrl);
//   const endpoint = searchParams.get("endpoint");

//   if (!endpoint) {
//     return { url: "", error: "Endpoint query parameter is required" };
//   }

//   // endpoint ကို ဖယ်ထုတ်ပြီး ကျန်သော query params များကို dynamic parameter အဖြစ် ယူခြင်း
//   const backendParams = new URLSearchParams(searchParams.toString());
//   backendParams.delete("endpoint");

//   const queryString = backendParams.toString();
//   const finalUrl = queryString ? `${BACKEND_URL}/${endpoint}?${queryString}` : `${BACKEND_URL}/${endpoint}`;
  
//   return { url: finalUrl };
// }

// // ==========================================
// // GET METHOD PROXY
// // ==========================================
// export async function GET(request: Request) {
//   const { url, error } = buildBackendUrl(request.url);

//   if (error) {
//     return NextResponse.json({ error }, { status: 400 });
//   }

//   try {
//     const response = await fetch(url, { cache: "no-store" });
    
//     // Response Error Handling
//     if (!response.ok) {
//       return NextResponse.json(
//         { error: `Backend responded with status: ${response.status}` }, 
//         { status: response.status }
//       );
//     }

//     const data = await response.json();
//     return NextResponse.json(data);
//   } catch (error) {
//     const msg = error instanceof Error ? error.message : "Unknown error";
//     console.error("Error fetching data from backend:", msg);
//     return NextResponse.json({ error: "Error fetching data from backend" }, { status: 500 });
//   }
// }

// // ==========================================
// //  POST METHOD PROXY
// // ==========================================
// export async function POST(request: Request) {
//   const { url, error } = buildBackendUrl(request.url);

//   if (error) {
//     return NextResponse.json({ error }, { status: 400 });
//   }

//   try {
//     const body = await request.json();

//     const response = await fetch(url, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json"
//       },
//       body: JSON.stringify(body),
//       cache: "no-store"
//     });

//     if (!response.ok) {
//       return NextResponse.json(
//         { error: `Backend POST failed with status: ${response.status}` }, 
//         { status: response.status }
//       );
//     }

//     const data = await response.json();
//     console.log("Data successfully posted to backend:", data);
//     return NextResponse.json(data);
//   } catch (error) {
//     const msg = error instanceof Error ? error.message : "Unknown error";
//     console.error("Error posting data to backend:", msg);
//     return NextResponse.json({ error: "Error posting data to backend" }, { status: 500 });
//   }
// }