"use server";

import { db } from "@/db";
import { categoriesTable, InsertCategory } from "@/db/schema";
import { getAuthenticatedUser } from "./getAuthenticatedUser";

export async function createCategory(data: InsertCategory) {
  try {
    const userId = await getAuthenticatedUser();

    await db.insert(categoriesTable).values({
      name: data.name,
      icon: data.icon,
      color: data.color,
      userId: userId,
    });

    return { success: true, error: null };
  } catch (error) {
    console.error("Failed to create category:", error);
    
    // Return a structured object instead of throwing so the client gets the exact message
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to save category." 
    };
  }
}