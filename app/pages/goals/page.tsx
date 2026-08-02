export const dynamic = "force-dynamic";
export const revalidate = 0;

import { getGoals } from "@/app/actions/goals";
import GoalsClient from "./goalsClient";
import GoalsCard from "@/components/app/goals/goalsCard";

export default async function GoalsPage() {
  const goals = await getGoals();

  return (
    <GoalsClient>
      <GoalsCard goals={goals || []} />
    </GoalsClient>
  );
}