import { z } from 'zod';

export const OrderFormSchema = z.object({
  customerName: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must be less than 50 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^[\d\s\-\+\(\)]{10,}$/, 'Invalid phone number'),
  coffeeType: z.string().min(1, 'Please select a coffee type'),
  quantity: z.number().min(1, 'Quantity must be at least 1').max(100, 'Quantity cannot exceed 100'),
  deliveryAddress: z.string().min(5, 'Address must be at least 5 characters'),
  postalCode: z.string().regex(/^[0-9]{5,6}$/, 'Invalid postal code'),
  city: z.string().min(2, 'City name is required'),
  notes: z.string().optional(),
});

export type OrderFormData = z.infer<typeof OrderFormSchema>;

export const OrderSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  items: z.array(
    z.object({
      productId: z.string(),
      productName: z.string(),
      quantity: z.number(),
      price: z.string(),
    })
  ),
  totalPrice: z.number(),
  status: z.enum(['pending', 'confirmed', 'processing', 'delivered', 'cancelled']),
  createdAt: z.string(),
  deliveryAddress: z.string(),
  notes: z.string().optional(),
});

export type Order = z.infer<typeof OrderSchema>;
