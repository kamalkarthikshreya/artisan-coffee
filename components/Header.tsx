'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useCart } from '@/lib/CartContext';
import CartPanel from './CartPanel';

export default function Header() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { items } = useCart();

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-30 bg-[#2D1810]/95 backdrop-blur-md border-b border-[#5A4034]"
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-[#4F9C8F] to-[#3D8B7F] rounded-full 
flex items-center justify-center group-hover:shadow-lg group-hover:shadow-[#4F9C8F]/40 
transition-all">
              <span className="text-white font-bold text-lg">☕</span>
            </div>
            <span className="text-[#F5E6D3] font-['Playfair_Display'] font-bold text-lg hidden 
sm:inline">
              Artisan Coffee
            </span>
          </Link>

          {/* Nav Links */}
          <nav className="flex items-center gap-4 md:gap-8">
            <Link
              href="/"
              className="text-[#C9B8A0] hover:text-[#F5E6D3] transition-colors text-sm font-semibold"
            >
              Shop
            </Link>
            <Link
              href="/orders"
              className="text-[#C9B8A0] hover:text-[#F5E6D3] transition-colors text-sm font-semibold"
            >
              Orders
            </Link>

            {/* Cart Button */}
            <motion.button
              onClick={() => setIsCartOpen(true)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="relative p-2 text-[#C9B8A0] hover:text-[#F5E6D3] transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m10 0a2 2 0 100 4 2 2 0 000-4m0 0a2 2 0 100 4 2 2 0 000-4"
                />
              </svg>

              {/* Cart Badge */}
              {cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 bg-[#4F9C8F] text-white text-xs font-bold 
w-5 h-5 rounded-full flex items-center justify-center"
                >
                  {cartCount}
                </motion.span>
              )}
            </motion.button>
          </nav>
        </div>
      </motion.header>

      {/* Cart Panel */}
      <CartPanel isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
