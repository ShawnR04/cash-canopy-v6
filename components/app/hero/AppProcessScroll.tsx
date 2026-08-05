"use client";

import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const processes = [
  {
    id: 1,
    title: "1. Monitor Your Dashboard",
    description:
      "Get an instant overview of balances, income, expenses, savings rate, and spending activity.",
    desktopImage: "/expense-tracker/dashboard.png",
    mobileImage: "/expense-tracker/mobile/dashboard.png",
  },
  {
    id: 2,
    title: "2. Review Transaction History",
    description:
      "Access a complete history of your financial activity and quickly edit or remove transactions.",
    desktopImage: "/expense-tracker/transactions-page.png",
    mobileImage: "/expense-tracker/mobile/transactions-page.png",
  },
  {
    id: 3,
    title: "3. Track Transactions",
    description:
      "Record income and expenses with detailed categories, descriptions, and dates to keep every transaction organized.",
    desktopImage: "/expense-tracker/add-transaction.png",
    mobileImage: "/expense-tracker/mobile/add-transaction.png",
  },
  {
    id: 4,
    title: "4. Manage Budget Categories",
    description:
      "View category spending, track remaining funds, and stay within your monthly budget allocations.",
    desktopImage: "/expense-tracker/budgets-page.png",
    mobileImage: "/expense-tracker/mobile/budgets-page.png",
  },
  {
    id: 5,
    title: "5. Create Budgets",
    description:
      "Set spending limits for different categories and monitor your remaining budget in real time.",
    desktopImage: "/expense-tracker/add-budget.png",
    mobileImage: "/expense-tracker/mobile/add-budget.png",
  },
  {
    id: 6,
    title: "6. Track Savings Progress",
    description:
      "Monitor goal deadlines, saved amounts, and completion percentages to stay motivated.",
    desktopImage: "/expense-tracker/goals-page.png",
    mobileImage: "/expense-tracker/mobile/goals-page.png",
  },
  {
    id: 7,
    title: "7. Set Savings Goals",
    description:
      "Create financial goals, define target amounts, and track your progress toward important purchases.",
    desktopImage: "/expense-tracker/add-goals.png",
    mobileImage: "/expense-tracker/mobile/add-goals.png",
  },
  {
    id: 8,
    title: "8. Analyze Financial Reports",
    description:
      "Visualize monthly income and expenses with charts and category breakdowns for better financial insights.",
    desktopImage: "/expense-tracker/report-page.png",
    mobileImage: "/expense-tracker/mobile/report-page.png",
  },
  {
    id: 9,
    title: "9. Export Financial Reports",
    description:
      "Generate professional PDF statements containing transactions, balances, and savings goals.",
    desktopImage: "/expense-tracker/data-pdf.png",
    mobileImage: "/expense-tracker/mobile/data-pdf.png",
  },
];

export default function AppProcessScroll(){
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = useCallback(() => {
      setCurrentIndex((prevIndex) => (prevIndex === processes.length - 1 ? 0 : prevIndex + 1));
    }, []);

    const prevSlide = useCallback(() => {
      setCurrentIndex((prevIndex) => (prevIndex === 0 ? processes.length - 1 : prevIndex - 1));
    }, []);

    // Auto-scroll effect
    useEffect(() => {
      const timer = setInterval(() => {
        nextSlide();
      }, 8000); // Changes slides every 5 seconds

      return () => clearInterval(timer);
    }, [nextSlide]);

    return(
        <>
            <div className="h-full w-full max-w-4xl mx-auto px-4 py-8">
                <div className="relative w-full h-full aspect-3/4 md:aspect-video">
                    <div className="w-full h-full relative rounded-md overflow-hidden bg-card rounded-md">
                        {processes.map((process, index) => (
                            <div key={process.id}
                                className={`absolute inset-0 transition-opacity duration-700 ease-in-out p-5 ${
                                  index === currentIndex
                                    ? "opacity-100 z-10 pointer-events-auto"
                                    : "opacity-0 z-0 pointer-events-none"
                                }`}
                            >
                                {/* Mobile Image */}
                                <div className="block md:hidden w-full h-full relative justify-center items-center">
                                    <Image
                                      src={process.mobileImage}
                                      alt={process.title}
                                      fill
                                      sizes="(max-width: 768px) 100vw"
                                      className="object-contain"
                                      priority={index === 0}
                                    />
                                </div>
                                {/* Desktop Image */}
                                <div className="hidden md:block w-full h-[75%] relative p-4">
                                  <Image
                                    src={process.desktopImage}
                                    alt={process.title}
                                    fill
                                    sizes="(min-width: 768px) 100vw"
                                    className="object-contain"
                                    priority={index === 0}
                                  />
                                </div>

                                {/* Text Overlay */}
                                <div className="absolute inset-0 bg-linear-to-t from-black/50 via-black/40 to-transparent flex flex-col justify-end p-6 md:p-10">
                                  <h2 className="text-xl md:text-3xl font-bold mb-2">
                                    {process.title}
                                  </h2>
                                  <p className="text-xs md:text-base max-w-2xl">
                                    {process.description}
                                  </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Navigation Controls */}
                    <button
                      onClick={prevSlide}
                      className="z-20 h-9 w-9 md:h-10 md:w-10 absolute top-1/2 -translate-y-1/2 flex items-center justify-center rounded-full bg-primary/80 hover:bg-secondary left-4 md:left-8 text-white transition-colors"
                      title="Previous Slide"
                    >
                      <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
                    </button>
                    <button
                      onClick={nextSlide}
                      className="z-20 h-9 w-9 md:h-10 md:w-10 absolute top-1/2 -translate-y-1/2 flex items-center justify-center rounded-full bg-primary/80 hover:bg-secondary right-4 md:right-8 text-white transition-colors"
                      title="Next Slide"
                    >
                      <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
                    </button>
                </div>
            </div>
        </>
    );
}