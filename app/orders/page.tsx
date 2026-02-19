'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useCart } from '@/lib/CartContext';
import Link from 'next/link';
import Image from 'next/image';

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    phone: '',
    deliveryAddress: '',
    city: '',
    postalCode: '',
    notes: '',
  });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-[#1A0F0A] py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-5xl font-['Playfair_Display'] font-bold text-[#F5E6D3] mb-4">
            Your Cart is Empty
          </h1>
          <p className="text-[#C9B8A0] mb-8">Add some premium coffee to get started</p>
          <Link
            href="/"
            className="inline-block px-8 py-3 bg-gradient-to-r from-[#4F9C8F] to-[#3D8B7F] 
text-white font-bold rounded-lg hover:shadow-lg hover:shadow-[#4F9C8F]/40"
          >
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      // Create order with all items
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          items: items.map(item => ({
            productId: item.product.id,
            productName: item.product.name,
            quantity: item.quantity,
            price: item.product.price,
          })),
          totalPrice: total,
          coffeeType: items.map(i => i.product.name).join(', '),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to place order');
      }

      const result = await response.json();
      setMessageType('success');
      setMessage(`Order placed! ID: ${result.order.id}`);
      clearCart();
      setFormData({
        customerName: '',
        email: '',
        phone: '',
        deliveryAddress: '',
        city: '',
        postalCode: '',
        notes: '',
      });

      setTimeout(() => {
        window.location.href = '/orders';
      }, 2000);
    } catch (error) {
      setMessageType('error');
      setMessage(error instanceof Error ? error.message : 'Failed to place order');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#1A0F0A] py-20 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <Link href="/" className="text-[#4F9C8F] hover:text-[#F5E6D3] mb-6 inline-block">
          ← Back to Home
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1 bg-[#3D2820] border border-[#5A4034] rounded-xl p-6 h-fit"
          >
            <h2 className="text-2xl font-['Playfair_Display'] font-bold text-[#F5E6D3] mb-4">
              Order Summary
            </h2>

            <div className="space-y-4 mb-6 pb-6 border-b border-[#5A4034]">
              {items.map(item => (
                <div key={item.product.id} className="flex justify-between">
                  <div>
                    <p className="text-[#F5E6D3] font-semibold">{item.product.name}</p>
                    <p className="text-[#C9B8A0] text-sm">x {item.quantity}</p>
                  </div>
                  <p className="text-[#FFD700] font-bold">
                    ${(parseFloat(item.product.price.replace('$', '')) * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-[#C9B8A0]">
                <span>Subtotal:</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[#C9B8A0]">
                <span>Shipping:</span>
                <span>Free</span>
              </div>
              <div className="border-t border-[#5A4034] pt-2 mt-4 flex justify-between">
                <span className="text-[#F5E6D3] font-bold">Total:</span>
                <span className="text-[#FFD700] text-xl font-bold">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Checkout Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <h1 className="text-4xl font-['Playfair_Display'] font-bold text-[#F5E6D3] mb-8">
              Checkout
            </h1>

            {message && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mb-6 p-4 rounded-lg border ${
                  messageType === 'success'
                    ? 'bg-green-900/30 border-green-600 text-green-200'
                    : 'bg-red-900/30 border-red-600 text-red-200'
                }`}
              >
                {messageType === 'success' ? '✓' : '✗'} {message}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6 bg-[#3D2820] border border-[#5A4034] 
rounded-xl p-8">
              {/* Customer Info */}
              <div>
                <h3 className="text-xl font-bold text-[#F5E6D3] mb-4">Personal Information</h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    name="customerName"
                    placeholder="Full Name"
                    value={formData.customerName}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-[#2D1810] border border-[#5A4034] rounded-lg px-4 py-2 
text-[#F5E6D3] placeholder-[#C9B8A0]/50 focus:outline-none focus:border-[#4F9C8F]"
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-[#2D1810] border border-[#5A4034] rounded-lg px-4 py-2 
text-[#F5E6D3] placeholder-[#C9B8A0]/50 focus:outline-none focus:border-[#4F9C8F]"
                  />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-[#2D1810] border border-[#5A4034] rounded-lg px-4 py-2 
text-[#F5E6D3] placeholder-[#C9B8A0]/50 focus:outline-none focus:border-[#4F9C8F]"
                  />
                </div>
              </div>

              {/* Delivery Info */}
              <div>
                <h3 className="text-xl font-bold text-[#F5E6D3] mb-4">Delivery Address</h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    name="deliveryAddress"
                    placeholder="Street Address"
                    value={formData.deliveryAddress}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-[#2D1810] border border-[#5A4034] rounded-lg px-4 py-2 
text-[#F5E6D3] placeholder-[#C9B8A0]/50 focus:outline-none focus:border-[#4F9C8F]"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="city"
                      placeholder="City"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      className="bg-[#2D1810] border border-[#5A4034] rounded-lg px-4 py-2 
text-[#F5E6D3] placeholder-[#C9B8A0]/50 focus:outline-none focus:border-[#4F9C8F]"
                    />
                    <input
                      type="text"
                      name="postalCode"
                      placeholder="Postal Code"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      required
                      className="bg-[#2D1810] border border-[#5A4034] rounded-lg px-4 py-2 
text-[#F5E6D3] placeholder-[#C9B8A0]/50 focus:outline-none focus:border-[#4F9C8F]"
                    />
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <h3 className="text-xl font-bold text-[#F5E6D3] mb-4">Special Requests</h3>
                <textarea
                  name="notes"
                  placeholder="Any special instructions..."
                  value={formData.notes}
                  onChange={handleInputChange}
                  className="w-full bg-[#2D1810] border border-[#5A4034] rounded-lg px-4 py-2 
text-[#F5E6D3] placeholder-[#C9B8A0]/50 focus:outline-none focus:border-[#4F9C8F] resize-none h-24"
                />
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
                className="w-full py-3 bg-gradient-to-r from-[#4F9C8F] to-[#3D8B7F] 
text-white font-bold rounded-lg hover:shadow-lg hover:shadow-[#4F9C8F]/40 
transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Processing...' : `Place Order - $${total.toFixed(2)}`}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
