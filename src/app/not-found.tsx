"use client";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0a] text-white px-6">
      <div className="text-center max-w-md">
        <div className="text-[120px] font-bold leading-none text-[#39FF14] mb-4">
          404
        </div>
        <h1 className="text-3xl font-bold mb-3">Project Paused</h1>
        <p className="text-[#B0B0B0] text-lg">
          This project is currently under maintenance. Check back soon.
        </p>
        <div className="mt-8 w-16 h-1 bg-[#39FF14] mx-auto rounded-full" />
      </div>
    </div>
  );
}
