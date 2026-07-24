"use client"

import Sidenav from '@/components/app/home/sidenav';
import React, { useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation';

interface HomeProps{
  session:string,
  version:string,
  dashboardTab: React.ReactNode;
  transactionsTab: React.ReactNode;
  budgetsTab: React.ReactNode;
  categoriesTab: React.ReactNode; // Correctly mapped
  reportTab: React.ReactNode;
  goalsTab: React.ReactNode;
  settingsTab: React.ReactNode;
}
export default function HomeClient({
  session,
  version,
  dashboardTab,
  transactionsTab,
  budgetsTab,
  categoriesTab,
  reportTab,
  goalsTab,
  settingsTab
} : HomeProps) {
  const router = useRouter();
  const searchParams = useSearchParams(); // Requires <Suspense> above it
  const [, startTransition] = useTransition();

  // Read the tab from the URL search params (?tab=...)
  const activeTab = searchParams.get("tab") || "dashboard";

  // Custom state setter that updates the URL query string
  const setActiveTab = (newTab: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", newTab);
    
    startTransition(() => {
      router.push(`?${params.toString()}`, { scroll: false });
    });
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard": return dashboardTab;
      case "transactions" : return transactionsTab;
      case "budgets": return budgetsTab;
      case "categories": return categoriesTab;
      case "report": return reportTab;
      case "goals": return goalsTab;
      case "settings": return settingsTab;
      default:return dashboardTab;
    }
  }
  return (
    <>
      <div className="h-dvh flex flex-col md:flex-row">
        {/* Side Navigation */}
        <div className="w-full md:w-auto shrink-0">
          <Sidenav
            session={session}
            version={version}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </div>

        {/* Content */}
        <div className="w-full h-full overflow-hidden no-scrollbar flex flex-col transition-all duration-300 ease-in-out">
          <div className=""></div>
          <main className="">
            {renderContent()}
          </main>
        </div>
      </div>
    </>
  )
}
