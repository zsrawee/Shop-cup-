'use client';

import Link from 'next/link';
import { useState } from 'react';


export default function NavBar() {
   
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-[#d4af37]/25">
      <div className="max-w-7xl mx-auto flex items-center justify-between py-2 px-4 md:px-8">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Link href="/" className="text-xl md:text-2xl font-extrabold text-[#d4af37]">ShopCup</Link>

          {/* Mobile inline search (visible on small screens) */}
          <form className="flex items-center gap-2 md:hidden w-full max-w-xs ml-3" role="search">
            <label htmlFor="mobile-inline-search" className="sr-only">Search products</label>
            <input id="mobile-inline-search" name="mobile-inline-search" type="search" placeholder="Search..." className="w-full px-2 py-1 rounded-md border border-[#d4af37]/30 focus:outline-none focus:ring-2 focus:ring-[#d4af37]/60 text-sm bg-black/5 text-white" />
          </form>

          {/* Desktop search */}
          <form className="hidden md:flex items-center gap-2 ml-4 w-full max-w-[18rem]" role="search">
            <label htmlFor="nav-search" className="sr-only">Search products</label>
            <input id="nav-search" name="nav-search" type="search" placeholder="Search products, categories, or brands..." className="w-full px-3 py-2 rounded-md border border-[#d4af37]/30 focus:outline-none focus:ring-2 focus:ring-[#d4af37]/60 bg-black/5 text-white" />
            <button type="submit" className="px-3 py-2 bg-[#d4af37] hover:bg-[#b58f2a] text-black font-semibold rounded-md transition-colors duration-200">Search</button>
          </form>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex gap-6">
            <Link href="/" className="text-lg font-medium text-white hover:text-[#d4af37] transition transform duration-150 hover:scale-105 hover:bg-[#d4af37]/8 px-2 rounded-md">Home</Link>
            <Link href="/products" className="text-lg font-medium text-white hover:text-[#d4af37] transition transform duration-150 hover:scale-105 hover:bg-[#d4af37]/8 px-2 rounded-md">Products</Link>
            <Link href="/deals" className="text-lg font-medium text-white hover:text-[#d4af37] transition transform duration-150 hover:scale-105 hover:bg-[#d4af37]/8 px-2 rounded-md">Deals</Link>
            <Link href="/about" className="text-lg font-medium text-white hover:text-[#d4af37] transition transform duration-150 hover:scale-105 hover:bg-[#d4af37]/8 px-2 rounded-md">About</Link>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link href="/cart" className="px-4 py-2 bg-transparent text-[#d4af37] border border-[#d4af37]/20 rounded-md transition transform duration-150 hover:scale-105 hover:bg-[#d4af37]/8">Cart</Link>
            <Link href="/signin" className="px-4 py-2 bg-[#d4af37] text-black rounded-md transition transform duration-150 hover:scale-105 hover:bg-[#b58f2a]">Sign in</Link>
          </div>

          {/* Mobile More button (toggles menu) */}
          <button onClick={() => setMobileOpen(!mobileOpen)} aria-expanded={mobileOpen} aria-label={mobileOpen ? 'إغلاق المزيد' : 'المزيد'} className="md:hidden ml-2 p-2 rounded-md border border-[#d4af37]/30 flex items-center gap-2 text-sm text-white transition-colors duration-200 hover:bg-[#d4af37]/8">
            <span className="text-lg">☰</span>
            <span className="ml-1">المزيد</span>
          </button>
        </div>
      </div>

      {/* Mobile menu contains remaining links & actions (visible on small screens when opened) */}
      <div className={`md:hidden border-t border-[#d4af37]/15 bg-black/95 overflow-hidden transition-all duration-300 ${mobileOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-4 py-4 space-y-3">
          <div className="flex flex-col gap-2">
            <Link href="/" className="py-2 px-3 rounded-md hover:bg-[#d4af37]/8 transition transform duration-150 hover:scale-105 text-white">Home</Link>
            <Link href="/products" className="py-2 px-3 rounded-md hover:bg-[#d4af37]/8 transition transform duration-150 hover:scale-105 text-white">Products</Link>
            <Link href="/deals" className="py-2 px-3 rounded-md hover:bg-[#d4af37]/8 transition transform duration-150 hover:scale-105 text-white">Deals</Link>
            <Link href="/about" className="py-2 px-3 rounded-md hover:bg-[#d4af37]/8 transition transform duration-150 hover:scale-105 text-white">About</Link>
          </div>

          <div className="flex gap-2 mt-2">
            <Link href="/cart" className="flex-1 px-3 py-2 bg-transparent text-[#d4af37] border border-[#d4af37]/20 rounded-md transition transform duration-150 hover:scale-105 hover:bg-[#d4af37]/8">Cart</Link>
            <Link href="/signin" className="flex-1 px-3 py-2 bg-[#d4af37] text-black rounded-md transition transform duration-150 hover:scale-105 hover:bg-[#b58f2a]">Sign in</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
  