"use server";

import { db } from "@/db";
import { goalsTable, insertGoal } from "@/db/schema";
import { getAuthenticatedUser } from "./getAuthenticatedUser";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

//Defining status import
export type GoalStatus = "active" | "achieved" | "paused"

export async function createGoal(data: insertGoal) {
  try {
    // 1. Get the authenticated user ID on the server
    const userId = await getAuthenticatedUser();

    // 2. Insert into database using an explicit object
    await db.insert(goalsTable).values({
      name: data.name,
      targetAmount: data.targetAmount,
      currentAmount: data.currentAmount,
      currency: data.currency,
      status: data.status,
      targetDate: data.targetDate,
      userId: userId, // Uses the real server-authenticated user ID
    });

    revalidatePath("/goals");

    return { success: true };
  } catch (error) {
    console.error("Failed to create goal:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to save goal.");
  }
}

export async function updateGoal(formData: FormData) {}

export async function updateGoalStatus(goalId: number, status: GoalStatus){
  try{
    const userId = await getAuthenticatedUser();

    await db
      .update(goalsTable)
      .set({ status })
      .where(
        and(
          eq(goalsTable.id, goalId),
          eq(goalsTable.userId,userId)
        )
      );

      revalidatePath("/goals")
      return { success: true };
  }catch(error){
    throw new Error(error instanceof Error ? error.message : "Failed to update status.")
  }
}

export async function getGoals() {
  try {
    const userId = await getAuthenticatedUser();
    return await db
      .select()
      .from(goalsTable)
      .where(eq(goalsTable.userId, userId));
  } catch (error) {
    console.error("Failed to fetch goals:", error);
    return [];
  }
}