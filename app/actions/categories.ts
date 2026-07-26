"use server";

import { db } from "@/db";
import { categoriesTable, InsertCategory } from "@/db/schema";
import { getAuthenticatedUser } from "./getAuthenticatedUser";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createCategory(data: InsertCategory) {
  try {
    const userId = await getAuthenticatedUser();

    await db.insert(categoriesTable).values({
      name: data.name,
      icon: data.icon,
      color: data.color,
      userId: userId,
    });

    revalidatePath("/categories");
    
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

export async function getCategories() {
  try {
    const userId = await getAuthenticatedUser();

    // Fetch categories belonging to the authenticated user
    const categories = await db
      .select({
        id: categoriesTable.id,
        name: categoriesTable.name,
        icon: categoriesTable.icon,
        color: categoriesTable.color,
      })
      .from(categoriesTable)
      .where(eq(categoriesTable.userId, userId));

    return categories;
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return [];
  }
}