export const dynamic = "force-dynamic";
export const revalidate = 0;

import { getGoals } from "@/app/actions/goals";
import GoalsCardItem from "./goalsCardItem";

export default async function GoalsCard() {
  const goals = await getGoals();

  // Sort goals from most recent (highest ID / newest) to least recent
  const sortedGoals =
    goals && goals.length > 0
      ? [...goals].sort((a, b) => Number(b.id) - Number(a.id))
      : [];

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-5 flex-1 overflow-y-auto no-scrollbar content-start">
        {sortedGoals.length > 0 ? (
          sortedGoals.map((goal) => (
            <GoalsCardItem key={goal.id} goal={goal} />
          ))
        ) : (
          <div className=""></div>
        )}
      </div>
    </>
  );
}