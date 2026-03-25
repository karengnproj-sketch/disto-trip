"use client";

import { motion } from "framer-motion";
import { CreditCard, Lock, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function PaymentPage() {
  const [cardNumber, setCardNumber] = useState("");
  const [holderName, setHolderName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(" ") : v;
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/[^0-9]/g, "");
    if (v.length >= 2) return v.substring(0, 2) + "/" + v.substring(2, 4);
    return v;
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        <Link href="/" className="inline-flex items-center gap-2 text-[#B0B0B0] hover:text-white text-sm mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>

        <h1 className="text-3xl font-display font-bold mb-8">
          <span className="text-[#39FF14]">Payment</span> Method
        </h1>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Form */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-4 h-4 rounded-full bg-[#FFB300]" />
              <span className="text-white font-medium">Credit Card</span>
            </div>

            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div>
                <input
                  type="text"
                  placeholder="Card number"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                  maxLength={19}
                  className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#333] rounded-xl text-white placeholder-[#666] focus:outline-none focus:border-[#39FF14] transition-colors"
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Card Holder Name"
                  value={holderName}
                  onChange={(e) => setHolderName(e.target.value)}
                  className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#333] rounded-xl text-white placeholder-[#666] focus:outline-none focus:border-[#39FF14] transition-colors"
                />
              </div>
              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder="Expire Date"
                  value={expiry}
                  onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                  maxLength={5}
                  className="flex-1 px-4 py-3 bg-[#1a1a1a] border border-[#333] rounded-xl text-white placeholder-[#666] focus:outline-none focus:border-[#39FF14] transition-colors"
                />
                <input
                  type="text"
                  placeholder="CVV"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/[^0-9]/g, "").slice(0, 4))}
                  maxLength={4}
                  className="flex-1 px-4 py-3 bg-[#1a1a1a] border border-[#333] rounded-xl text-white placeholder-[#666] focus:outline-none focus:border-[#39FF14] transition-colors"
                />
              </div>

              <div className="pt-4 space-y-3">
                <button
                  type="button"
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-purple-400 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-purple-500/25 hover:scale-[1.02] transition-all"
                >
                  Proceed Payment
                </button>
                <button
                  type="button"
                  className="w-full py-3 border border-[#333] text-[#B0B0B0] font-semibold rounded-full hover:border-white hover:text-white transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>

          {/* Card Visual */}
          <div className="flex-shrink-0 flex items-center justify-center">
            <div className="relative">
              {/* Back card */}
              <div className="w-56 h-36 bg-gradient-to-br from-purple-700 to-purple-500 rounded-2xl transform rotate-6 opacity-60" />
              {/* Front card */}
              <div className="w-56 h-36 bg-gradient-to-br from-purple-600 to-purple-400 rounded-2xl absolute top-0 left-0 -rotate-3 shadow-2xl p-4 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-8 bg-yellow-400 rounded-md" />
                  <CreditCard className="w-6 h-6 text-white/50" />
                </div>
                <div>
                  <p className="text-white/70 text-xs font-mono">
                    {cardNumber || "•••• •••• •••• ••••"}
                  </p>
                  <p className="text-white/50 text-[10px] mt-1">
                    {holderName || "CARD HOLDER"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Security Note */}
        <div className="flex items-center gap-2 mt-8 text-[#666] text-xs">
          <Lock className="w-3.5 h-3.5" />
          <span>Your payment information is encrypted and secure</span>
        </div>
      </motion.div>
    </div>
  );
}
