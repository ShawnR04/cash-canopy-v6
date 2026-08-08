"use client";

import React, { useState, useEffect, useRef } from "react";
import { Users, Check, Plus, User, ChevronDown } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getDeviceAccounts, saveDeviceAccount, DeviceAccount } from "@/lib/deviceAccounts";

interface AccountSwitcherProps {
  currentUsername?: string;
  currentEmail?: string;
  userImage?: string | null;
  userId?: string; // Add current userId to save the active user state
}

export default function AccountSwitcher({
  currentUsername,
  currentEmail,
  userImage,
  userId,
}: AccountSwitcherProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [accounts, setAccounts] = useState<DeviceAccount[]>([]);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Sync current logged-in user into localStorage on component load
  useEffect(() => {
    if (currentEmail && userId) {
      saveDeviceAccount({
        id: userId,
        username: currentUsername,
        email: currentEmail,
        image: userImage,
      });
    }
  }, [userId, currentUsername, currentEmail, userImage]);

  // Close popover on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch device accounts from local browser storage on toggle
  const handleToggle = () => {
    const nextState = !isOpen;
    setIsOpen(nextState);

    if (nextState) {
      const localAccounts = getDeviceAccounts();
      setAccounts(localAccounts);
    }
  };

  const handleSwitch = (accId: string) => {
    setIsOpen(false);
    router.push(`/auth/login?switch=${accId}`);
  };

  const handleAddAccount = () => {
    setIsOpen(false);
    router.push("/auth/login?add=true");
  };

  return (
    <div className="relative w-full sm:w-auto" ref={popoverRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={handleToggle}
        className="flex w-full sm:w-auto items-center justify-between gap-2.5 rounded-xl border border-border bg-card/80 px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-accent/60 transition-all shadow-xs cursor-pointer"
      >
        <div className="flex items-center gap-2">
          {userImage ? (
            <Image
              src={userImage}
              alt="Avatar"
              width={20}
              height={20}
              unoptimized
              className="rounded-full object-cover shrink-0 w-5 h-5"
            />
          ) : (
            <div className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0">
              <Users className="w-3 h-3" />
            </div>
          )}
          <span className="capitalize truncate max-w-[120px]">
            {currentUsername || "Switch Account"}
          </span>
        </div>
        <ChevronDown
          className={`w-3.5 h-3.5 text-muted-foreground transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Popover Menu */}
      {isOpen && (
        <div className="absolute right-0 top-12 z-50 w-64 rounded-2xl border border-border bg-popover/95 backdrop-blur-md p-2 shadow-2xl animate-in fade-in-0 zoom-in-95 duration-150">
          <div className="px-3 py-2 border-b border-border/60">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Current Account
            </p>
            <p className="text-xs font-semibold text-foreground capitalize mt-0.5 truncate">
              {currentUsername || "User"}
            </p>
            {currentEmail && (
              <p className="text-[11px] text-muted-foreground truncate">{currentEmail}</p>
            )}
          </div>

          <div className="py-1 space-y-0.5 max-h-48 overflow-y-auto">
            <p className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Device Accounts
            </p>

            {accounts.length === 0 ? (
              <p className="px-3 py-2 text-xs text-muted-foreground">No other accounts saved on this device.</p>
            ) : (
              accounts.map((acc) => {
                const isActive = acc.username === currentUsername || acc.email === currentEmail;
                return (
                  <button
                    key={acc.id}
                    type="button"
                    onClick={() => handleSwitch(acc.id)}
                    className={`flex w-full items-center justify-between gap-2 px-3 py-2 text-xs rounded-xl transition-colors cursor-pointer ${
                      isActive
                        ? "bg-primary/10 text-primary font-semibold"
                        : "hover:bg-accent text-popover-foreground"
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {acc.image ? (
                        <Image
                          src={acc.image}
                          alt={acc.name || "User"}
                          width={24}
                          height={24}
                          unoptimized
                          className="w-6 h-6 rounded-full object-cover shrink-0"
                        />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center shrink-0">
                          <User className="w-3.5 h-3.5 text-muted-foreground" />
                        </div>
                      )}
                      <div className="text-left truncate">
                        <p className="font-medium capitalize truncate">{acc.name || acc.username}</p>
                        <p className="text-[10px] text-muted-foreground truncate">{acc.email}</p>
                      </div>
                    </div>
                    {isActive && <Check className="w-3.5 h-3.5 shrink-0 text-primary" />}
                  </button>
                );
              })
            )}
          </div>

          <div className="pt-1 mt-1 border-t border-border/60">
            <button
              type="button"
              onClick={handleAddAccount}
              className="flex w-full items-center gap-2 px-3 py-2 text-xs font-medium text-foreground hover:bg-accent rounded-xl transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4 text-muted-foreground" />
              Add another account
            </button>
          </div>
        </div>
      )}
    </div>
  );
}