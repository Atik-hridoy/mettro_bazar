import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AppLayout } from '@/components/layout/AppLayout';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'METRO BAZAR - Online Grocery Shopping and Delivery in Bangladesh',
  description:
    'METRO BAZAR is an online grocery shop in Dhaka, Bangladesh. Buy fresh vegetables, fruits, dairy, meat, fish, cooking essentials, and household products with 1-hour delivery.',
  icons: {
    icon: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased font-sans bg-white text-zinc-900 selection:bg-zinc-100 selection:text-[#6A1B9A]">
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}
