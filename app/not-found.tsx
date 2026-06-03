"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Home, FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-6 text-center text-slate-100">
      {/* 404 Visual Icon Box */}
      <div className="relative mb-6 flex h-24 w-24 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shadow-xl shadow-emerald-500/5 animate-pulse">
        <FileQuestion className="h-12 w-12" />
        <span className="absolute -right-2 -top-2 flex h-6 w-10 items-center justify-center rounded-full bg-red-500/10 border border-red-500/20 text-xs font-bold text-red-400">
          404
        </span>
      </div>

      {/* Main Text Message */}
      <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl text-white">
        Page Not Found
      </h1>

      <p className="mt-4 max-w-md text-base text-slate-400 leading-relaxed">
        Oops! The page you&apos;re looking for doesn&apos;t exist. It might have
        been moved or deleted entirely.
      </p>

      {/* Action Buttons */}
      <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 w-full max-w-xs sm:max-w-none justify-center">
        <Button
          onClick={() => router.push('/')}
          variant="outline"
          className="w-full sm:w-auto border-slate-800 bg-slate-900/50 text-slate-300 hover:bg-slate-850 hover:text-white flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" /> Go Back
        </Button>

        {/* <Button
          onClick={() => router.push("/dashboard")}
          className="w-full sm:w-auto bg-emerald-600 text-white font-semibold hover:bg-emerald-500 shadow-lg shadow-emerald-600/20 flex items-center gap-2"
        >
          <Home className="h-4 w-4" /> Back to Dashboard
        </Button> */}
      </div>

      {/* Decorative Background Glow */}
      <div className="absolute top-1/2 left-1/2 -z-10 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/5 blur-[120px]" />
    </div>
  );
}
