"use client";

import Sidenav from "@/components/app/home/sidenav";
import React, { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Send, X } from "lucide-react";

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

  // Feedback modal state
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;

    setIsSubmitting(true);

    try {
      // TODO: Replace this with your API route call (e.g. await fetch('/api/feedback', ...))
      console.log("Feedback submitted:", feedbackText);
      
      setFeedbackText("");
      setIsFeedbackOpen(false);
    } catch (error) {
      console.error("Failed to send feedback:", error);
    } finally {
      setIsSubmitting(false);
    }
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
            onSendFeedback={() => setIsFeedbackOpen(true)}
          />
        </div>

        {/* Content */}
        <div className="w-full h-full flex flex-col pt-15 md:pl-55 transition-all duration-300 ease-in-out">
          <main className="w-full flex-1 overflow-y-auto no-scrollbar p-2 md:px-3">
            {renderContent()}
          </main>
        </div>
      </div>

      {/* Feedback Modal Overlay */}
      {isFeedbackOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card border rounded-lg shadow-lg w-full max-w-md p-6 relative">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b">
              <h3 className="text-lg font-semibold text-foreground">
                Send Feedback
              </h3>
              <button
                onClick={() => setIsFeedbackOpen(false)}
                className="text-muted-foreground hover:text-foreground p-1 rounded-md transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleFeedbackSubmit} className="mt-4 space-y-4">
              <p className="text-sm text-muted-foreground">
                We&apos;d love to hear your thoughts, feature requests, or bug reports!
              </p>

              <textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Type your feedback here..."
                required
                rows={4}
                className="w-full p-3 text-sm bg-background border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-foreground resize-none"
              />

              {/* Modal Actions */}
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsFeedbackOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !feedbackText.trim()}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 transition-colors"
                >
                  {isSubmitting ? "Sending..." : "Send"}
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}