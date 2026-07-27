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

export async function updateGoal(formData: FormData) {
  try {
    const userId = await getAuthenticatedUser();
    if (!userId) {
      return { success: false, error: "Unauthorized." };
    }

    const rawId = formData.get("id");
    if (!rawId) {
      return { success: false, error: "Goal ID is missing." };
    }

    const id = parseInt(rawId as string, 10);
    if (isNaN(id)) {
      return { success: false, error: "Invalid goal ID." };
    }

    // Extract form values with proper types
    const name = formData.get("name") as string;
    const targetAmount = formData.get("targetAmount") as string;
    const currentAmount = formData.get("currentAmount") as string;
    const currency = formData.get("currency") as string;
    const rawStatus = formData.get("status") as GoalStatus;
    const targetDate = formData.get("targetDate") as string;

    if (!name || !targetAmount || !currentAmount) {
      return { success: false, error: "Required fields are missing." };
    }

    // Validate/Fallback GoalStatus
    const validStatuses: GoalStatus[] = ["active", "achieved", "paused"];
    const status: GoalStatus = validStatuses.includes(rawStatus)
      ? rawStatus
      : "active";

    // Execute update in Drizzle
    await db
      .update(goalsTable)
      .set({
        name,
        targetAmount,
        currentAmount,
        currency,
        status,
        targetDate: targetDate ? new Date(targetDate) : undefined,
      })
      .where(and(eq(goalsTable.id, id), eq(goalsTable.userId, userId)));

    revalidatePath("/goals");
    
    return { success: true };
  } catch (error) {
    console.error("Error updating goal:", error);
    return { success: false, error: "Failed to update goal. Please try again." };
  }
}

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