"use server";

import { db } from "@/db";
import { user } from "@/db/schema";
import { getAuthenticatedUser } from "./getAuthenticatedUser";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export interface UserAccountOption {
  id: string;
  name: string;
  email: string;
  username: string | null;
  image: string | null;
}

export async function getUserAccounts(): Promise<UserAccountOption[]> {
  try {
    const currentUserId = await getAuthenticatedUser();
    if (!currentUserId) return [];

    // Fetch account user details
    const users = await db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username,
        image: user.image,
      })
      .from(user);

    return users;
  } catch (error) {
    console.error("Failed to fetch user accounts:", error);
    return [];
  }
}

export async function switchAccount(targetUserId: string) {
  // Clear or re-authenticate session to target account ID
  // e.g. using better-auth / next-auth session update
  redirect(`/auth/login?account=${targetUserId}`);
}