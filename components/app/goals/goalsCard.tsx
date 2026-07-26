import { getGoals } from "@/app/actions/goals";
import GoalsCardItem from "./goalsCardItem";

export default async function GoalsCard(){
    const goals = await getGoals();

    
    return(
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-5 flex-1 overflow-y-auto no-scrollbar content-start">
                {goals && goals.length > 0 ? (
                    goals.map((goal) => (
                        <GoalsCardItem
                            key={goal.id}
                            goal={goal}
                        />
                    ))
                ) : (
                    <div className=""></div>
                )}
            </div>
        </>
    );
}