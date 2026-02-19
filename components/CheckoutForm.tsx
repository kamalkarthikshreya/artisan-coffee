'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { OrderFormSchema, type OrderFormData } from '@/lib/validation';
import { CoffeeProduct } from '@/data/products';

interface CheckoutFormProps {
  product: CoffeeProduct;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function CheckoutForm({
  product,
  isOpen,
  onClose,
  onSuccess,
}: CheckoutFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<OrderFormData>({
    defaultValues: {
      quantity: 1,
      coffeeType: product.id,
    },
  });

  const quantity = watch('quantity') || 1;
  const priceNum = parseFloat(product.price.replace('$', ''));
  const totalPrice = priceNum * quantity;

  const onSubmit = async (data: OrderFormData) => {
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          coffeeType: product.name,
          totalPrice,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to place order');
      }

      const result = await response.json();
      setSuccessMessage(
        `Order placed successfully! Order ID: ${result.order.id}`
      );
      reset();

      // Close form after 2 seconds
      setTimeout(() => {
        onClose();
        setSuccessMessage('');
        onSuccess?.();
      }, 2000);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to place order';
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative z-10 w-full max-w-2xl bg-[#3D2820] border border-[#5A4034] 
rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-[#C9B8A0] hover:text-[#F5E6D3] 
transition-colors z-20"
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div className="p-8">
              {/* Success Message */}
              {successMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-green-900/30 border border-green-600 rounded-lg 
text-green-200"
                >
                  ✓ {successMessage}
                </motion.div>
              )}

              {/* Error Message */}
              {errorMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-red-900/30 border border-red-600 rounded-lg text-red-200"
                >
                  ✗ {errorMessage}
                </motion.div>
              )}

              <h2 className="text-3xl font-['Playfair_Display'] font-bold text-[#F5E6D3] 
mb-2">
                Purchase {product.name}
              </h2>
              <p className="text-[#C9B8A0] mb-6">
                Secure checkout - Please fill in your details
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Product Info */}
                <div className="bg-[#2D1810] p-4 rounded-lg border border-[#5A4034] mb-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-[#F5E6D3] font-semibold">{product.name}</p>
                      <p className="text-[#C9B8A0] text-sm">{product.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[#FFD700] text-2xl font-bold">{product.price}</p>
                    </div>
                  </div>
                </div>

                {/* Quantity and Total */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#F5E6D3] font-semibold mb-2">
                      Quantity
                    </label>
                    <input
                      type="number"
                      {...register('quantity', { valueAsNumber: true })}
                      className="w-full bg-[#2D1810] border border-[#5A4034] rounded-lg 
px-4 py-2 text-[#F5E6D3] placeholder-[#C9B8A0] focus:outline-none 
focus:border-[#4F9C8F] transition-colors"
                      min="1"
                      max="100"
                    />
                    {errors.quantity && (
                      <p className="text-red-400 text-xs mt-1">
                        {errors.quantity.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-[#F5E6D3] font-semibold mb-2">
                      Total Price
                    </label>
                    <div className="flex items-center justify-center h-10 bg-[#2D1810] 
border border-[#4F9C8F] rounded-lg">
                      <span className="text-[#FFD700] text-lg font-bold">
                        ${totalPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Customer Name */}
                <div>
                  <label className="block text-[#F5E6D3] font-semibold mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    {...register('customerName')}
                    placeholder="John Doe"
                    className="w-full bg-[#2D1810] border border-[#5A4034] rounded-lg 
px-4 py-2 text-[#F5E6D3] placeholder-[#C9B8A0]/50 focus:outline-none 
focus:border-[#4F9C8F] transition-colors"
                  />
                  {errors.customerName && (
                    <p className="text-red-400 text-xs mt-1">
                      {errors.customerName.message}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-[#F5E6D3] font-semibold mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    {...register('email')}
                    placeholder="john@example.com"
                    className="w-full bg-[#2D1810] border border-[#5A4034] rounded-lg 
px-4 py-2 text-[#F5E6D3] placeholder-[#C9B8A0]/50 focus:outline-none 
focus:border-[#4F9C8F] transition-colors"
                  />
                  {errors.email && (
                    <p className="text-red-400 text-xs mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-[#F5E6D3] font-semibold mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    {...register('phone')}
                    placeholder="+1 (555) 123-4567"
                    className="w-full bg-[#2D1810] border border-[#5A4034] rounded-lg 
px-4 py-2 text-[#F5E6D3] placeholder-[#C9B8A0]/50 focus:outline-none 
focus:border-[#4F9C8F] transition-colors"
                  />
                  {errors.phone && (
                    <p className="text-red-400 text-xs mt-1">
                      {errors.phone.message}
                    </p>
                  )}
                </div>

                {/* Delivery Address */}
                <div>
                  <label className="block text-[#F5E6D3] font-semibold mb-2">
                    Delivery Address
                  </label>
                  <input
                    type="text"
                    {...register('deliveryAddress')}
                    placeholder="123 Main Street"
                    className="w-full bg-[#2D1810] border border-[#5A4034] rounded-lg 
px-4 py-2 text-[#F5E6D3] placeholder-[#C9B8A0]/50 focus:outline-none 
focus:border-[#4F9C8F] transition-colors"
                  />
                  {errors.deliveryAddress && (
                    <p className="text-red-400 text-xs mt-1">
                      {errors.deliveryAddress.message}
                    </p>
                  )}
                </div>

                {/* City & Postal Code */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#F5E6D3] font-semibold mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      {...register('city')}
                      placeholder="New York"
                      className="w-full bg-[#2D1810] border border-[#5A4034] rounded-lg 
px-4 py-2 text-[#F5E6D3] placeholder-[#C9B8A0]/50 focus:outline-none 
focus:border-[#4F9C8F] transition-colors"
                    />
                    {errors.city && (
                      <p className="text-red-400 text-xs mt-1">
                        {errors.city.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-[#F5E6D3] font-semibold mb-2">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      {...register('postalCode')}
                      placeholder="10001"
                      className="w-full bg-[#2D1810] border border-[#5A4034] rounded-lg 
px-4 py-2 text-[#F5E6D3] placeholder-[#C9B8A0]/50 focus:outline-none 
focus:border-[#4F9C8F] transition-colors"
                    />
                    {errors.postalCode && (
                      <p className="text-red-400 text-xs mt-1">
                        {errors.postalCode.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-[#F5E6D3] font-semibold mb-2">
                    Special Requests (Optional)
                  </label>
                  <textarea
                    {...register('notes')}
                    placeholder="Any special instructions or preferences..."
                    className="w-full bg-[#2D1810] border border-[#5A4034] rounded-lg 
px-4 py-2 text-[#F5E6D3] placeholder-[#C9B8A0]/50 focus:outline-none 
focus:border-[#4F9C8F] transition-colors resize-none h-24"
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
                  {isLoading ? 'Processing...' : `Place Order - $${totalPrice.toFixed(2)}`}
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

  const onSubmit = async (data: OrderFormData) => {
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          coffeeType: product.name,
          totalPrice,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to place order');
      }

      const result = await response.json();
      setSuccessMessage(
        `Order placed successfully! Order ID: ${result.order.id}`
      );
      reset();

      // Close form after 2 seconds
      setTimeout(() => {
        onClose();
        setSuccessMessage('');
        onSuccess?.();
      }, 2000);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to place order';
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative z-10 w-full max-w-2xl bg-[#3D2820] border border-[#5A4034] 
rounded-2xl shadow-2xl"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-[#C9B8A0] hover:text-[#F5E6D3] 
transition-colors z-20"
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div className="p-8">
              {/* Success Message */}
              {successMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-green-900/30 border border-green-600 rounded-lg 
text-green-200"
                >
                  ✓ {successMessage}
                </motion.div>
              )}

              {/* Error Message */}
              {errorMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-red-900/30 border border-red-600 rounded-lg text-red-200"
                >
                  ✗ {errorMessage}
                </motion.div>
              )}

              <h2 className="text-3xl font-['Playfair_Display'] font-bold text-[#F5E6D3] 
mb-2">
                Purchase {product.name}
              </h2>
              <p className="text-[#C9B8A0] mb-6">
                Secure checkout - Please fill in your details
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Product Info */}
                <div className="bg-[#2D1810] p-4 rounded-lg border border-[#5A4034] mb-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-[#F5E6D3] font-semibold">{product.name}</p>
                      <p className="text-[#C9B8A0] text-sm">{product.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[#FFD700] text-2xl font-bold">{product.price}</p>
                    </div>
                  </div>
                </div>

                {/* Quantity and Total */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#F5E6D3] font-semibold mb-2">
                      Quantity
                    </label>
                    <input
                      type="number"
                      {...register('quantity', { valueAsNumber: true })}
                      className="w-full bg-[#2D1810] border border-[#5A4034] rounded-lg 
px-4 py-2 text-[#F5E6D3] placeholder-[#C9B8A0] focus:outline-none 
focus:border-[#4F9C8F] transition-colors"
                      min="1"
                      max="100"
                    />
                    {errors.quantity && (
                      <p className="text-red-400 text-xs mt-1">
                        {errors.quantity.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-[#F5E6D3] font-semibold mb-2">
                      Total Price
                    </label>
                    <div className="flex items-center justify-center h-10 bg-[#2D1810] 
border border-[#4F9C8F] rounded-lg">
                      <span className="text-[#FFD700] text-lg font-bold">
                        ${totalPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Customer Name */}
                <div>
                  <label className="block text-[#F5E6D3] font-semibold mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    {...register('customerName')}
                    placeholder="John Doe"
                    className="w-full bg-[#2D1810] border border-[#5A4034] rounded-lg 
px-4 py-2 text-[#F5E6D3] placeholder-[#C9B8A0]/50 focus:outline-none 
focus:border-[#4F9C8F] transition-colors"
                  />
                  {errors.customerName && (
                    <p className="text-red-400 text-xs mt-1">
                      {errors.customerName.message}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-[#F5E6D3] font-semibold mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    {...register('email')}
                    placeholder="john@example.com"
                    className="w-full bg-[#2D1810] border border-[#5A4034] rounded-lg 
px-4 py-2 text-[#F5E6D3] placeholder-[#C9B8A0]/50 focus:outline-none 
focus:border-[#4F9C8F] transition-colors"
                  />
                  {errors.email && (
                    <p className="text-red-400 text-xs mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-[#F5E6D3] font-semibold mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    {...register('phone')}
                    placeholder="+1 (555) 123-4567"
                    className="w-full bg-[#2D1810] border border-[#5A4034] rounded-lg 
px-4 py-2 text-[#F5E6D3] placeholder-[#C9B8A0]/50 focus:outline-none 
focus:border-[#4F9C8F] transition-colors"
                  />
                  {errors.phone && (
                    <p className="text-red-400 text-xs mt-1">
                      {errors.phone.message}
                    </p>
                  )}
                </div>

                {/* Delivery Address */}
                <div>
                  <label className="block text-[#F5E6D3] font-semibold mb-2">
                    Delivery Address
                  </label>
                  <input
                    type="text"
                    {...register('deliveryAddress')}
                    placeholder="123 Main Street"
                    className="w-full bg-[#2D1810] border border-[#5A4034] rounded-lg 
px-4 py-2 text-[#F5E6D3] placeholder-[#C9B8A0]/50 focus:outline-none 
focus:border-[#4F9C8F] transition-colors"
                  />
                  {errors.deliveryAddress && (
                    <p className="text-red-400 text-xs mt-1">
                      {errors.deliveryAddress.message}
                    </p>
                  )}
                </div>

                {/* City & Postal Code */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#F5E6D3] font-semibold mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      {...register('city')}
                      placeholder="New York"
                      className="w-full bg-[#2D1810] border border-[#5A4034] rounded-lg 
px-4 py-2 text-[#F5E6D3] placeholder-[#C9B8A0]/50 focus:outline-none 
focus:border-[#4F9C8F] transition-colors"
                    />
                    {errors.city && (
                      <p className="text-red-400 text-xs mt-1">
                        {errors.city.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-[#F5E6D3] font-semibold mb-2">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      {...register('postalCode')}
                      placeholder="10001"
                      className="w-full bg-[#2D1810] border border-[#5A4034] rounded-lg 
px-4 py-2 text-[#F5E6D3] placeholder-[#C9B8A0]/50 focus:outline-none 
focus:border-[#4F9C8F] transition-colors"
                    />
                    {errors.postalCode && (
                      <p className="text-red-400 text-xs mt-1">
                        {errors.postalCode.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-[#F5E6D3] font-semibold mb-2">
                    Special Requests (Optional)
                  </label>
                  <textarea
                    {...register('notes')}
                    placeholder="Any special instructions or preferences..."
                    className="w-full bg-[#2D1810] border border-[#5A4034] rounded-lg 
px-4 py-2 text-[#F5E6D3] placeholder-[#C9B8A0]/50 focus:outline-none 
focus:border-[#4F9C8F] transition-colors resize-none h-24"
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
                  {isLoading ? 'Processing...' : `Place Order - $${totalPrice.toFixed(2)}`}
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
