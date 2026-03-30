"use client";

import Link from "next/link";
import { MapPin, Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-full bg-[#39FF14]/10 flex items-center justify-center mx-auto mb-6">
          <MapPin className="w-10 h-10 text-[#39FF14]" />
        </div>
        <h1 className="text-6xl font-display font-bold text-white mb-2">404</h1>
        <h2 className="text-xl font-semibold text-[#B0B0B0] mb-4">Page Not Found</h2>
        <p className="text-[#666] mb-8">
          Looks like you took a wrong turn. This page doesn&apos;t exist in our travel guide.
        </p>
        <div className="flex gap-3 justify-center">
          <Link href="/"
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#39FF14] to-[#00E676] text-black font-semibold rounded-xl hover:shadow-lg transition-all">
            <Home className="w-4 h-4" /> Go Home
          </Link>
          <Link href="/discover"
            className="flex items-center gap-2 px-6 py-3 border border-[#333] text-[#B0B0B0] rounded-xl hover:text-white transition-all">
            <Search className="w-4 h-4" /> Explore Map
          </Link>
        </div>
      </div>
    </div>
  );
}
