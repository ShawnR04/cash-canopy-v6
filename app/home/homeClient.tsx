"use client";

import Sidenav from "@/components/app/home/sidenav";
import React, { useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface HomeProps {
  username: string;
  email?: string;
  userImage?: string | null;
  version: string;
  dashboardTab: React.ReactNode;
  transactionsTab: React.ReactNode;
  budgetsTab: React.ReactNode;
  categoriesTab: React.ReactNode;
  reportTab: React.ReactNode;
  goalsTab: React.ReactNode;
}

export default function HomeClient({
  username,
  email,
  userImage,
  version,
  dashboardTab,
  transactionsTab,
  budgetsTab,
  categoriesTab,
  reportTab,
  goalsTab,
}: HomeProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
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
      case "dashboard":
        return dashboardTab;
      case "transactions":
        return transactionsTab;
      case "budgets":
        return budgetsTab;
      case "categories":
        return categoriesTab;
      case "report":
        return reportTab;
      case "goals":
        return goalsTab;
      default:
        return dashboardTab;
    }
  };

  return (
    <>
      <div className="h-dvh flex flex-col md:flex-row">
        {/* Side Navigation */}
        <div className="w-full md:w-auto shrink-0">
          <Sidenav
            username={username}
            email={email}
            userImage={userImage}
            version={version}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </div>

        {/* Content */}
        <div className="w-full h-full flex flex-col pt-15 md:pl-55 transition-all duration-300 ease-in-out">
          <main className="w-full flex-1 overflow-y-auto no-scrollbar p-2 md:px-3">
            {renderContent()}
          </main>
        </div>
      </div>
    </>
  );
}