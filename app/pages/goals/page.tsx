import GoalsCard from "@/components/app/goals/goalsCard";
import GoalsClient from "./goalsClient";

export default function Goals() {
  return (
    <>
        <GoalsClient>
          <GoalsCard/>
        </GoalsClient>
    </>
  );
}