import TopNav from "@/components/app/hero/topnav";

export default function Hero() {
  return (
    <div className="h-dvh overflow-y-auto no-scrollbar flex flex-col">
      <div className="h-15 w-full fixed border-b border-border">
        <TopNav/>
      </div>
    </div>
  );
}
