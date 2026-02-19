'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/lib/CartContext';
import Link from 'next/link';
import Image from 'next/image';

interface CartPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartPanel({ isOpen, onClose }: CartPanelProps) {
  const { items, removeItem, updateQuantity, total, clearCart } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-40">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Slide-in Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="absolute right-0 top-0 h-full w-full max-w-md bg-[#2D1810] 
border-l border-[#5A4034] shadow-2xl overflow-y-auto z-50"
          >
            {/* Header */}
            <div className="sticky top-0 bg-[#2D1810] border-b border-[#5A4034] p-6 flex 
justify-between items-center">
              <h2 className="text-2xl font-['Playfair_Display'] font-bold text-[#F5E6D3]">
                Cart
              </h2>
              <button
                onClick={onClose}
                className="text-[#C9B8A0] hover:text-[#F5E6D3] transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Cart Items */}
            <div className="p-6 space-y-4">
              {items.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-[#C9B8A0] mb-4">Your cart is empty</p>
                  <button
                    onClick={onClose}
                    className="px-6 py-2 bg-[#4F9C8F] text-white rounded-lg hover:bg-[#3D8B7F] transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <>
                  {items.map((item) => (
                    <motion.div
                      key={item.product.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="bg-[#3D2820] rounded-lg p-4 border border-[#5A4034]"
                    >
                      <div className="flex gap-4 mb-3">
                        <div className="relative w-16 h-16 flex-shrink-0 bg-[#2D1810] rounded overflow-hidden">
                          <Image
                            src={item.product.image}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-[#F5E6D3] font-semibold">{item.product.name}</h3>
                          <p className="text-[#FFD700] font-bold">{item.product.price}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 bg-[#2D1810] rounded py-1 px-2">
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity - 1)
                            }
                            className="text-[#C9B8A0] hover:text-[#F5E6D3] px-1"
                          >
                            −
                          </button>
                          <span className="text-[#F5E6D3] px-2 min-w-6 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity + 1)
                            }
                            className="text-[#C9B8A0] hover:text-[#F5E6D3] px-1"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="text-red-400 hover:text-red-300 text-sm font-semibold"
                        >
                          Remove
                        </button>
                      </div>

                      <div className="mt-3 pt-3 border-t border-[#5A4034] flex justify-between">
                        <span className="text-[#C9B8A0]">Subtotal:</span>
                        <span className="text-[#FFD700] font-bold">
                          ${(
                            parseFloat(item.product.price.replace('$', '')) *
                            item.quantity
                          ).toFixed(2)}
                        </span>
                      </div>
                    </motion.div>
                  ))}

                  {/* Total */}
                  <div className="border-t border-[#5A4034] pt-6 mt-6">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-lg font-['Playfair_Display'] text-[#F5E6D3]">
                        Total:
                      </span>
                      <span className="text-2xl font-bold text-[#FFD700]">
                        ${total.toFixed(2)}
                      </span>
                    </div>

                    <Link href="/checkout">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={onClose}
                        className="w-full py-3 bg-gradient-to-r from-[#4F9C8F] to-[#3D8B7F] 
text-white font-bold rounded-lg hover:shadow-lg hover:shadow-[#4F9C8F]/40 
transition-all"
                      >
                        Proceed to Checkout
                      </motion.button>
                    </Link>

                    <button
                      onClick={clearCart}
                      className="w-full mt-2 py-2 text-[#C9B8A0] hover:text-red-400 
transition-colors text-sm font-semibold"
                    >
                      Clear Cart
                    </button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
