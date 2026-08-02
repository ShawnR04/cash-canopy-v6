import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  numeric,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

// ============================================================================
// Auth & Identity Tables (Better-Auth / NextAuth standard layout)
// ============================================================================

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  username: text("username").unique(),
  displayUsername: text("display_username"),
});

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_userId_idx").on(table.userId)],
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("account_userId_idx").on(table.userId)],
);

export const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
);

// ============================================================================
// Application Core Tables
// ============================================================================

// Categories Table
export const categoriesTable = pgTable(
  "categories",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id")
      .references(() => user.id, { onDelete: "cascade" })
      .notNull(),
    name: text("name").notNull(),
    icon: text("icon").notNull(),
    color: text("color").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("categories_user_id_idx").on(table.userId)],
);

// Budgets Table
export const budgetsTable = pgTable(
  "budgets",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id")
      .references(() => user.id, { onDelete: "cascade" })
      .notNull(),
    name: text("name").notNull(),
    amount: numeric("amount", { precision: 12, scale: 2 }).default("0.00").notNull(),
    currency: varchar("currency", { length: 3 }).default("USD").notNull(),
    period: text("period", { enum: ["Monthly", "Weekly", "Yearly", "Custom"] })
      .default("Monthly")
      .notNull(),
    startDate: timestamp("start_date").notNull(),
    endDate: timestamp("end_date"),
    categoryId: integer("category_id").references(() => categoriesTable.id, {
      onDelete: "cascade",
    }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("budgets_user_id_idx").on(table.userId)],
);

// Goals Table
export const goalsTable = pgTable(
  "goals",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id")
      .references(() => user.id, { onDelete: "cascade" })
      .notNull(),
    name: text("name").notNull(),
    targetAmount: numeric("target_amount", { precision: 12, scale: 2 }).notNull(),
    currentAmount: numeric("current_amount", { precision: 12, scale: 2 })
      .default("0.00")
      .notNull(),
    currency: varchar("currency", { length: 3 }).default("USD").notNull(),
    status: text("status", { enum: ["active", "achieved", "paused"] })
      .default("active")
      .notNull(),
    targetDate: timestamp("target_date").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("goals_user_id_idx").on(table.userId),
    index("goals_user_id_target_date_idx").on(table.userId, table.targetDate),
  ],
);

// Transactions Table (UPDATED: onDelete: "cascade" for Category, Budget, and Goal)
export const transactionsTable = pgTable(
  "transactions",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id")
      .references(() => user.id, { onDelete: "cascade" })
      .notNull(),
    date: timestamp("date").notNull(),
    description: text("description").notNull(),
    amount: numeric("amount", { precision: 12, scale: 2 }).default("0.00").notNull(),
    currency: varchar("currency", { length: 3 }).default("USD").notNull(),
    type: text("type", { enum: ["Income", "Expense"] }).notNull(),

    categoryId: integer("category_id").references(() => categoriesTable.id, {
      onDelete: "cascade",
    }),
    budgetId: integer("budget_id").references(() => budgetsTable.id, {
      onDelete: "cascade",
    }),
    goalId: integer("goal_id").references(() => goalsTable.id, {
      onDelete: "cascade",
    }),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("transactions_user_id_idx").on(table.userId),
    index("transactions_user_id_date_idx").on(table.userId, table.date),
    index("transactions_category_id_idx").on(table.categoryId),
  ],
);

// User Settings Table
export const userSettingsTable = pgTable("user_settings", {
  userId: text("user_id")
    .primaryKey()
    .references(() => user.id, { onDelete: "cascade" }),
  monthlyIncome: numeric("monthly_income", { precision: 12, scale: 2 })
    .default("0.00")
    .notNull(),
  netBalance: numeric("net_balance", { precision: 12, scale: 2 })
    .default("0.00")
    .notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

// ============================================================================
// Drizzle Relations Definitions
// ============================================================================

export const userRelations = relations(user, ({ one, many }) => ({
  sessions: many(session),
  accounts: many(account),
  settings: one(userSettingsTable),
  transactions: many(transactionsTable),
  budgets: many(budgetsTable),
  categories: many(categoriesTable),
  goals: many(goalsTable),
}));

export const userSettingsRelations = relations(userSettingsTable, ({ one }) => ({
  user: one(user, {
    fields: [userSettingsTable.userId],
    references: [user.id],
  }),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

export const transactionsRelations = relations(transactionsTable, ({ one }) => ({
  user: one(user, {
    fields: [transactionsTable.userId],
    references: [user.id],
  }),
  category: one(categoriesTable, {
    fields: [transactionsTable.categoryId],
    references: [categoriesTable.id],
  }),
  budget: one(budgetsTable, {
    fields: [transactionsTable.budgetId],
    references: [budgetsTable.id],
  }),
  goal: one(goalsTable, {
    fields: [transactionsTable.goalId],
    references: [goalsTable.id],
  }),
}));

export const budgetsRelations = relations(budgetsTable, ({ one, many }) => ({
  user: one(user, {
    fields: [budgetsTable.userId],
    references: [user.id],
  }),
  category: one(categoriesTable, {
    fields: [budgetsTable.categoryId],
    references: [categoriesTable.id],
  }),
  transactions: many(transactionsTable),
}));

export const categoriesRelations = relations(categoriesTable, ({ one, many }) => ({
  user: one(user, {
    fields: [categoriesTable.userId],
    references: [user.id],
  }),
  transactions: many(transactionsTable),
  budgets: many(budgetsTable),
}));

export const goalsRelations = relations(goalsTable, ({ one, many }) => ({
  user: one(user, {
    fields: [goalsTable.userId],
    references: [user.id],
  }),
  transactions: many(transactionsTable),
}));

// ============================================================================
// Type Exports
// ============================================================================

export type SelectUser = typeof user.$inferSelect;
export type InsertUser = typeof user.$inferInsert;

export type SelectTransaction = typeof transactionsTable.$inferSelect;
export type InsertTransaction = typeof transactionsTable.$inferInsert;

export type SelectBudget = typeof budgetsTable.$inferSelect;
export type InsertBudget = typeof budgetsTable.$inferInsert;

export type SelectCategory = typeof categoriesTable.$inferSelect;
export type InsertCategory = typeof categoriesTable.$inferInsert;

export type SelectGoal = typeof goalsTable.$inferSelect;
export type InsertGoal = typeof goalsTable.$inferInsert;

export type SelectUserSettings = typeof userSettingsTable.$inferSelect;
export type InsertUserSettings = typeof userSettingsTable.$inferInsert;