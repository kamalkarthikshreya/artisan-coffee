import type { Metadata } from 'next';
import { CartProvider } from '@/lib/CartContext';
import Header from '@/components/Header';
import './globals.css';

export const metadata: Metadata = {
  title: 'Artisan Coffee',
  description: 'Premium coffee for coffee lovers',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#1A0F0A] text-[#F5E6D3]">
        <CartProvider>
          <Header />
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
