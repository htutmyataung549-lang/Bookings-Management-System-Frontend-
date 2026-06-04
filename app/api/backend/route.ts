import { NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://bookings-management-system.onrender.com/api';
// export async function GET(request: Request) {
//     const {searchParams} = new URL(request.url);
//     const endpoint = searchParams.get("endpoint");
//     const customerName = searchParams.get("customerName");

//     if (!endpoint) {
//         return NextResponse.json({error: "Endpoint query parameter is required"}, {status: 400});
//     }

//     let url = `${BACKEND_URL}/${endpoint}`;
//     if (customerName) {
//         url += `?customerName=${encodeURIComponent(customerName)}`;
//     }

//     try {
//         const response = await fetch(url , {cache: "no-cache"});
//         const data = await response.json();
//         // console.log("Data fetched from backend:", data);
//         // return new Response(JSON.stringify(data), {status: 200});
//         return NextResponse.json(data);
//     } catch (error) {
//         console.error("Error fetching data from backend:", error);
//         return NextResponse.json({error: "Error fetching data from backend"}, {status: 500});
//     }
// }

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const endpoint = searchParams.get("endpoint");

    if (!endpoint) {
        return NextResponse.json({ error: "Endpoint query parameter is required" }, { status: 400 });
    }

    const backendParams = new URLSearchParams(searchParams.toString());
    backendParams.delete("endpoint");

    const queryString = backendParams.toString();
    const url = queryString ? `${BACKEND_URL}/${endpoint}?${queryString}` : `${BACKEND_URL}/${endpoint}`;

    try {
        const response = await fetch(url, { cache: "no-cache" });
        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Error fetching data from backend:", error);
        return NextResponse.json({ error: "Error fetching data from backend" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const {searchParams} = new URL(request.url);
    const endpoint = searchParams.get("endpoint");
    const customerName = searchParams.get("customerName");
    const body = await request.json();

    if (!endpoint) {
        return NextResponse.json({error: "Endpoint query parameter is required"}, {status: 400});
    }

    let url = `${BACKEND_URL}/${endpoint}`;
    if (customerName) {
        url += `?customerName=${encodeURIComponent(customerName)}`;
    }

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });
        const data = await response.json();
        console.log("Data posted to backend:", data);
        return NextResponse.json(data);
    } catch (error) {
        console.error("Error posting data to backend:", error);
        return NextResponse.json({error: "Error posting data to backend"}, {status: 500});
    }
}