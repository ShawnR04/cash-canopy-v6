"use client"

import { cn } from "@/lib/utils";
import { ArrowLeftRight, Boxes, LayoutDashboard, Menu, Target, TrendingUp, Wallet, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import AccountSwitcher from "./accountSwitcher";
import LogoutButton from "./logoutBtn";

interface SidenavProps{
    username:string;
    version:string
    activeTab:string;
    setActiveTab: (id: string) => void
}
export default function SideNav({
    username,
    version,
    activeTab,
    setActiveTab
} : SidenavProps){
    const [isOpen, setIsOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(true);

    const NAV_LINKS = [
        { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
        { id: "transactions", label: "Transactions", icon: ArrowLeftRight },
        { id: "budgets", label: "Budgets", icon: Wallet },
        { id: "categories", label: "Categories", icon: Boxes },
        { id: "report", label: "Report", icon: TrendingUp },
        { id: "goals", label: "Savings Goals", icon: Target }
    ]

    const handleNavClick = (linkId: string) => {
        setActiveTab(linkId);
        setIsOpen(false);
    }
    return(
       <>
       {/* Topnav */}
        <div className={`
          bg-card h-15 w-full px-3 md:px-5 flex items-center fixed top-0 left-0 ease-in-out transition-transform duration-300${
            isVisible ? "translate-y-0" : "-translate-y-full"
          } border-b md:border-0
        `}>
            {/* Mobile */}
            <div className="md:hidden w-full flex items-center justify-between">
                <div className="flex gap-3">
                  <button
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Open Menu"
                    className="bg-secondary rounded-md p-1"
                  >
                    <Menu className="w-7 h-7"/>
                  </button>
                  <div className="flex items-center gap-2">
                    <Image
                      src="/favicon.ico"
                      alt="Logo"
                      width={30}
                      height={30}
                    />
                    <span className="font-bold text-xl text-primary capitalize">
                      {username}
                    </span>
                  </div>
                </div>

                <div className="">
                  <AccountSwitcher/>
                </div>
            </div>

            {/* Desktop */}
            <div className="hidden w-full md:flex md:items-center md:justify-end pl-55">
              <AccountSwitcher/>
            </div>
        </div>

        {/* Overlay */}
        {isOpen && (
          <div 
            onClick={() => setIsOpen(false)}
            className="fixed bg-card/50 inset-0 backdrop-blur-[2px] md:hidden transition-opacity z-9"></div>
        )}
        
        {/* SideNav */}
        <aside className={`
          z-10 bg-card w-55 h-full p-5 fixed top-0 left-0 transform transition-all duration-400 ease-in-out md:translate-x-0 md:block   ${
          isOpen ? "translate-x-0" : "-translate-x-full"
          }
        `}>
          <div className="w-full py-5 flex flex-col items-center relative">
            {/* Close Menu Button */}
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close Menu"
              className="absolute md:hidden text-muted-foreground top-3 right-1 p-1.2 rounded-md hover:text-foreground hover:bg-primary/80"
            >
              <X className="w-7 h-7"/>
            </button>

            {/* Profile Avatar & Welcome */}
            <div className="flex flex-col items-center">
              <div>
                <Image
                src="/favicon.ico"
                alt="Logo"
                width={65}
                height={65}
              />
              </div>
              <h1 className="text-sm font-bold flex flex-col items-center">
                Welcome
                <span className="text-xl text-primary capitalize">
                  {username}
                </span>
              </h1>
            </div>

            {/* Main Navigation Links */}
            <nav className="w-full py-5 space-y-2">
              {NAV_LINKS.map((link) => (
                <div key={link.id} className={cn("hover:bg-primary hover:text-foreground text-muted-foreground group rounded-md transition-all ease-in-out duration-300",
                    activeTab === link.id ? "bg-primary text-foreground" : ""
                )}>
                  <button 
                      onClick={() => handleNavClick(link.id)}
                      type="button"
                      aria-label="nav-link"
                      className="px-5 py-3 gap-2 w-full flex items-center transition-all cursor-pointer"
                  >
                      <span>
                          <link.icon className={cn("group-hover:text-foreground transition-all ease-in-out duration-300",
                              activeTab === link.id ? "text-foreground" : ""
                          )}/>
                      </span>
                      {link.label}
                  </button>
                </div>
              ))}

              {/* Export Data */}
              {/* TODO: Make export data button */}
              <div className=""></div>

              {/* CTA Buttons */}
              {/* TODO: Make settings and logout button */}
              <div className="h-10 flex items-center justify-around">
                <LogoutButton/>
              </div>

              {/* Version */}
              <div className="h-5 flex items-center justify-center">
                <h1 className="text-xs text-muted-foreground">
                  Version {version}
                </h1>
              </div>
            </nav>
          </div>
        </aside>
       </> 
    );
}