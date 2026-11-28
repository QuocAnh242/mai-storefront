import React from 'react';
import { TopBar, Header, NavigationBar } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { FloatingActionDock } from '@/components/FloatingActionDock';
import { AnalyticsTracker } from '@/components/AnalyticsTracker';
import { getCategories } from '@/lib/queries';

export default async function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const categories = await getCategories();

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-800">
      <AnalyticsTracker />
      <TopBar />
      <div className="sticky top-0 z-40 shadow-xs">
        <Header categories={categories} />
        <NavigationBar categories={categories} />
      </div>
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 pt-2 pb-6">
        {children}
      </main>
      <Footer />
      <FloatingActionDock />
    </div>
  );
}
