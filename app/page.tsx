import AppProcessScroll from "@/components/app/hero/AppProcessScroll";
import Footer from "@/components/app/hero/footer";
import TopNav from "@/components/app/hero/topnav";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Hero() {
  return (
    <div className="h-dvh overflow-y-auto no-scrollbar flex flex-col">
      <div className="h-15 w-full fixed top-0 left-0 z-50 border-b border-border bg-background">
        <TopNav/>
      </div>
      <div className="h-full px-1 pt-15 overflow-y-auto no-scrollbar">
        <div className="h-full flex flex-col items-center justify-center gap-2">
          <h1 className="md:w-2/3 lg:w-2/3 font-bold text-3xl md:text-4xl lg:text-5xl text-center">
            Everything you need to manage your personal expenses
          </h1>
          <p className="text-lg text-muted-foreground">
            Built for smarter tracking
          </p>
          <Button
            className="h-12 lg:h-14 w-35 font-bold text-xl hover:bg-primary/90 transition-all duration-300"
          >
            <Link href="/auth/signup"
              className="h-full w-full flex items-center justify-center  transition-all duration-300"
            >
              Get Started
            </Link>
          </Button>
        </div>

        <div className="h-full">
          <AppProcessScroll/>
        </div>

        <div>
          <Footer/>
        </div>
      </div>
    </div>
  );
}
