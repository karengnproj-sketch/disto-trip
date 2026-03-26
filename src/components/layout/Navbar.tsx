"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, MapPin, Shield, Wallet } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/discover", label: "Discover" },
  { href: "/hotels", label: "Hotels" },
  { href: "/attractions", label: "Attractions" },
  { href: "/budget", label: "Budget", icon: Wallet },
  { href: "/emergency", label: "Emergency", icon: Shield },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-bg-primary/80 backdrop-blur-xl border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-accent-primary to-accent-secondary flex items-center justify-center">
              <MapPin className="w-4 h-4 text-black" />
            </div>
            <span className="text-xl font-display font-bold">
              <span className="text-accent-primary">Disto</span>
              <span className="text-white">-Trip</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-accent-primary/10 text-accent-primary"
                      : "text-text-secondary hover:text-white hover:bg-bg-tertiary"
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    {link.icon && <link.icon className="w-3.5 h-3.5" />}
                    {link.label}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/auth/login"
              className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-white transition-colors"
            >
              Log In
            </Link>
            <Link
              href="/auth/signup"
              className="px-5 py-2 text-sm font-semibold bg-gradient-to-r from-accent-primary to-accent-secondary text-black rounded-full hover:shadow-lg hover:shadow-accent-primary/25 transition-all duration-300 hover:scale-105"
            >
              Sign Up
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg text-text-secondary hover:text-white hover:bg-bg-tertiary transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-bg-secondary/95 backdrop-blur-xl border-t border-border/50">
          <div className="px-4 py-4 space-y-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? "bg-accent-primary/10 text-accent-primary"
                      : "text-text-secondary hover:text-white hover:bg-bg-tertiary"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {link.icon && <link.icon className="w-4 h-4" />}
                    {link.label}
                  </span>
                </Link>
              );
            })}
            <div className="pt-4 border-t border-border/50 flex gap-3">
              <Link
                href="/auth/login"
                onClick={() => setIsOpen(false)}
                className="flex-1 py-3 text-center text-sm font-medium border border-border rounded-xl text-text-secondary hover:text-white transition-colors"
              >
                Log In
              </Link>
              <Link
                href="/auth/signup"
                onClick={() => setIsOpen(false)}
                className="flex-1 py-3 text-center text-sm font-semibold bg-gradient-to-r from-accent-primary to-accent-secondary text-black rounded-xl"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
