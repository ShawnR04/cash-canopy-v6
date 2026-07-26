"use server";

import { db } from "@/db";
import { goalsTable, insertGoal } from "@/db/schema";
import { getAuthenticatedUser } from "./getAuthenticatedUser";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

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

export async function updateGoal(data: insertGoal) {
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

    return { success: true };
  } catch (error) {
    console.error("Failed to create goal:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to save goal.");
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