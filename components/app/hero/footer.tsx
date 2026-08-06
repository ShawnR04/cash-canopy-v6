"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ShieldCheck, 
  Zap, 
  Heart,
  ArrowUpRight,
  ArrowUp,
  Mail,
  Send
} from 'lucide-react';
import { BsGithub, BsLinkedin, BsTwitterX } from 'react-icons/bs';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      const scrollableContainer = document.querySelector('.overflow-y-auto') || window;
      scrollableContainer.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="w-full bg-background/95 backdrop-blur-sm border-t border-border text-muted-foreground text-sm mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-10">
          
          {/* Brand Column */}
          <div className="space-y-4 text-center md:text-left sm:col-span-2 md:col-span-1">
            <div className="flex items-center justify-center md:justify-start space-x-2.5">
              <div className="relative h-8 w-8 rounded-lg overflow-hidden flex items-center justify-center bg-primary/10 border border-primary/20 shrink-0">
                <Image
                  src="/favicon.ico"
                  alt="Cash Canopy Logo"
                  width={32}
                  height={32}
                  className="object-contain p-0.5"
                />
              </div>
              <span className="text-xl font-bold text-foreground tracking-tight">
                Cash Canopy
              </span>
            </div>
            <p className="text-xs sm:text-sm leading-relaxed max-w-sm mx-auto md:mx-0">
              Take full control of your finances. Monitor spending, build smart budgets, track savings targets, and generate detailed PDF reports.
            </p>
            
            {/* Social & Contact Icon Bar */}
            <div className="flex justify-center md:justify-start space-x-2.5 pt-1">
              <a
                href="https://github.com/ShawnR04"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-lg bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground transition-all duration-200 hover:scale-105"
                aria-label="GitHub"
              >
                <BsGithub size={18} />
              </a>
              <a
                href="https://www.linkedin.com/in/shawn-rimai-81007735b?utm_source=share_via&utm_content=profile&utm_medium=member_android"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-lg bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground transition-all duration-200 hover:scale-105"
                aria-label="LinkedIn"
              >
                <BsLinkedin size={18} />
              </a>
              <a
                href="mailto:shawnrimai004@gmail.com?subject=Cash%20Canopy%20Inquiry"
                className="p-2.5 rounded-lg bg-muted/60 hover:bg-primary/20 text-muted-foreground hover:text-primary transition-all duration-200 hover:scale-105"
                aria-label="Direct Email"
                title="Send an Email"
              >
                <Mail size={18} />
              </a>
            </div>
          </div>

          {/* Get Started */}
          <div className="text-center md:text-left">
            <h3 className="text-foreground font-semibold mb-4 text-xs tracking-wider uppercase">
              Get Started
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link 
                  href="/auth/signup" 
                  className="hover:text-primary transition-colors inline-flex items-center gap-1 group font-medium"
                >
                  Create Free Account
                  <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>
              </li>
              <li>
                <Link href="/auth/login" className="hover:text-primary transition-colors">
                  Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* Key Features */}
          <div className="text-center md:text-left">
            <h3 className="text-foreground font-semibold mb-4 text-xs tracking-wider uppercase">
              Key Features
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li className="flex items-center justify-center md:justify-start space-x-2">
                <Zap size={14} className="text-primary shrink-0" />
                <span>Real-time Analytics</span>
              </li>
              <li className="flex items-center justify-center md:justify-start space-x-2">
                <ShieldCheck size={14} className="text-emerald-500 shrink-0" />
                <span>Secure Google OAuth</span>
              </li>
              <li className="flex items-center justify-center md:justify-start space-x-2">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0"></span>
                <span>PDF Statement Exports</span>
              </li>
              <li className="flex items-center justify-center md:justify-start space-x-2">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0"></span>
                <span>Custom Category Rules</span>
              </li>
            </ul>
          </div>

          {/* Application Info & Contact Button */}
          <div className="text-center md:text-left space-y-3">
            <h3 className="text-foreground font-semibold mb-4 text-xs tracking-wider uppercase">
              Application & Contact
            </h3>
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Systems Operational</span>
            </div>
            <div>
              <a 
                href="mailto:shawnrimai004@gmail.com?subject=Cash%20Canopy%20Support"
                className="inline-flex items-center justify-center md:justify-start gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary font-medium transition-colors border border-primary/20 mt-1"
              >
                <Send size={12} />
                <span>Reach Out to Support</span>
              </a>
            </div>
          </div>

        </div>

        {/* Divider & Bottom Row */}
        <div className="border-t border-border/80 pt-6">
          <div className="flex flex-col sm:flex-row items-center justify-between text-xs space-y-4 sm:space-y-0 text-center sm:text-left">
            <p className="text-muted-foreground">
              &copy; {currentYear} Cash Canopy. All rights reserved.
            </p>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1 text-foreground/80">
                <span>Made with</span>
                <Heart size={12} className="text-red-500 fill-red-500 inline mx-0.5" />
                <span>by <strong className="font-semibold text-foreground">Shawn Rimai</strong></span>
              </div>
              
              <button 
                onClick={scrollToTop}
                className="hover:text-primary transition-colors inline-flex items-center gap-1 cursor-pointer font-medium"
              >
                Back to top
                <ArrowUp size={13} />
              </button>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}