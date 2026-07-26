"use client"

interface Goal {
    id: number;
    name: string;
    targetAmount: string;
    currentAmount: string;
    currency: string;
    status: string
    targetDate: Date;
}

export default function GoalsCardItem({ goal }: { goal: Goal }){

    //Progress Metrics
    const targetAmount = parseFloat(goal.targetAmount) || 0;
    const currentAmount = parseFloat(goal.currentAmount) || 0;
    const progress = Math.min((currentAmount / targetAmount) * 100, 100);

    let dateObject: Date | null = null;
    let daysLeftDisplay = "N/A";

    if (goal.targetDate) {
        const rawDate = new Date(goal.targetDate);
        if (!isNaN(rawDate.getTime())) {
            const targetYear = rawDate.getUTCFullYear();
            const targetMonth = rawDate.getUTCMonth();
            const targetDate = rawDate.getUTCDate();
            dateObject = new Date(targetYear, targetMonth, targetDate);

            const today = new Date();
            const current = new Date(today.getFullYear(), today.getMonth(), today.getDate());
            const diffInMs = dateObject.getTime() - current.getTime();
            const diffInDays = Math.round(diffInMs / (1000 * 60 * 60 * 24));

            if (diffInDays > 0) daysLeftDisplay = `${diffInDays} days left`;
            else if (diffInDays === 0) daysLeftDisplay = "Today";
            else daysLeftDisplay = "Overdue";
        }
    }

    const formattedDate = dateObject && !isNaN(dateObject.getTime())
        ? dateObject.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
        : "N/A";

    const currencySymbols: Record<string, string> = {
      USD: "$",
      EUR: "€",
      GBP: "£",
      CAD: "$",
      AUD: "$",
      "$": "$",
    };

    // Now TypeScript allows indexing with any string
    const sign = currencySymbols[goal.currency] || "$";
    return(
        <div className="card">
            <div className="flex gap-2">
                <div className="w-1/2">
                    <h1 className="text-lg font-semibold tracking-tight capitalize">
                        {goal.name}
                    </h1>
                    <p className="text-[12px] text-muted-foreground">
                        Target: {sign}{targetAmount.toFixed(2)}
                    </p>
                </div>
                <div className="w-1/2 flex flex-col items-end justify-center">
                    <h1 className={`text-sm font-medium ${
                        daysLeftDisplay === "Overdue" || daysLeftDisplay === "N/A" ? "text-destructive" : daysLeftDisplay === "Today" ? "text-emerald-500" : "text-primary"
                    }`}>
                        {daysLeftDisplay}
                    </h1>
                </div>
            </div>

            <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
                <div className="bg-primary h-full transition-all duration-300 ease-out rounded-full" style={{ width: `${progress}%` }} />
            </div>

            <div className="flex gap-2">
                <div className="w-1/2">
                    <h1 className="font-medium text-[14px]">
                        Saved: ${currentAmount.toFixed(2)}
                    </h1>
                    <p className="text-[14px] text-muted-foreground">
                        ({progress.toFixed(0)}%)
                    </p>
                </div>
                <p className="w-1/2 text-[14px] text-muted-foreground flex items-center justify-end">{formattedDate}</p>
            </div>
        </div>
    );
}