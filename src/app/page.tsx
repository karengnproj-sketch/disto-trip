"use client";

export default function ErrorPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0a] text-white px-6">
      <div className="text-center max-w-lg">
        <div className="text-[110px] font-bold leading-none text-[#39FF14] mb-2 font-mono tracking-tight">404</div>
        <h1 className="text-2xl font-semibold mb-2 text-white">This page is not working</h1>
        <p className="text-[#888] text-base mb-6">
          The server encountered an unexpected error and could not complete your request.
        </p>
        <div className="bg-[#111] border border-[#2a2a2a] rounded-xl px-6 py-4 text-left mb-6">
          <p className="text-[#555] text-xs font-mono">HTTP ERROR 404</p>
          <p className="text-[#444] text-xs font-mono mt-1">Request failed — disto-trip.vercel.app</p>
        </div>
        <p className="text-[#555] text-sm">
          If you are the owner of this site, contact{" "}
          <span className="text-[#39FF14]">Vercel Support</span> for assistance.
        </p>
        <div className="mt-10 w-12 h-0.5 bg-[#222] mx-auto" />
      </div>
    </div>
  );
}
