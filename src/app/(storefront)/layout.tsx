import React from 'react';
import { TopBar } from '@/components/TopBar';
import { Header } from '@/components/Header';
import { NavigationBar } from '@/components/NavigationBar';
import { Footer } from '@/components/Footer';
import { FloatingChatWidget } from '@/components/FloatingChatWidget';

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-800">
      <TopBar />
      <div className="sticky top-0 z-40 shadow-xs">
        <Header />
        <NavigationBar />
      </div>
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 pt-2 pb-6">
        {children}
      </main>
      <Footer />
      <FloatingChatWidget />
    </div>
  );
}
