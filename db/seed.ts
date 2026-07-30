import "dotenv/config";
import { db } from "@/db/index"; 
import {
  user,
  categoriesTable,
  budgetsTable,
  goalsTable,
  transactionsTable,
} from "./schema"; 
import { faker } from "@faker-js/faker";
import { sql, desc } from "drizzle-orm";

async function seed() {
  console.log("🌱 Starting seed process...");

  // 1. Find your existing Google User
  // Gets the most recently created user in your database
  const existingUsers = await db.select().from(user).orderBy(desc(user.createdAt)).limit(1);
  
  if (existingUsers.length === 0) {
    console.error("❌ No users found in the database!");
    console.error("👉 ACTION REQUIRED: Start your app, click 'Google Login', and log in first.");
    console.error("Once your user is created, run this seed script again.");
    process.exit(1);
  }

  const myUser = existingUsers[0];
  const myUserId = myUser.id;
  
  console.log(`✅ Found User: ${myUser.name} (${myUser.email})`);
  console.log(`🔗 Attaching all seed data to ID: ${myUserId}`);

  // 2. Clean Existing Financial Data ONLY 
  // Notice we are NOT truncating user, account, or session tables!
  console.log("🧹 Cleaning old categories, budgets, goals, and transactions...");
  await db.execute(
    sql`TRUNCATE TABLE "categories", "budgets", "goals", "transactions" CASCADE;`
  );

  // ---------------------------------------------------------------------------
  // 3. Categories (20 categories)
  // ---------------------------------------------------------------------------
  const categoryTemplates = [
    { name: "Groceries", icon: "shopping-cart", color: "#22c55e" },
    { name: "Rent & Mortgage", icon: "home", color: "#ef4444" },
    { name: "Utilities", icon: "zap", color: "#eab308" },
    { name: "Dining Out", icon: "utensils", color: "#f97316" },
    { name: "Entertainment", icon: "film", color: "#a855f7" },
    { name: "Salary", icon: "briefcase", color: "#3b82f6" },
    { name: "Freelance", icon: "laptop", color: "#06b6d4" },
    { name: "Investments", icon: "trending-up", color: "#10b981" },
    { name: "Healthcare", icon: "activity", color: "#ec4899" },
    { name: "Transportation", icon: "car", color: "#64748b" },
    { name: "Subscriptions", icon: "repeat", color: "#8b5cf6" },
    { name: "Shopping", icon: "shopping-bag", color: "#f43f5e" },
    { name: "Travel", icon: "plane", color: "#0284c7" },
    { name: "Education", icon: "book-open", color: "#d97706" },
    { name: "Fitness", icon: "dumbbell", color: "#14b8a6" },
    { name: "Gifts & Donations", icon: "gift", color: "#f472b6" },
    { name: "Pets", icon: "dog", color: "#84cc16" },
    { name: "Insurance", icon: "shield-check", color: "#475569" },
    { name: "Personal Care", icon: "smile", color: "#fb7185" },
    { name: "Side Hustle", icon: "dollar-sign", color: "#22c55e" },
  ];

  const categoriesData = categoryTemplates.map((cat) => ({
    userId: myUserId,
    name: cat.name,
    icon: cat.icon,
    color: cat.color,
    createdAt: faker.date.past({ years: 1 }),
    updatedAt: new Date(),
  }));

  const insertedCategories = await db
    .insert(categoriesTable)
    .values(categoriesData)
    .returning({ id: categoriesTable.id });

  console.log("✅ Inserted 20 categories");

  // ---------------------------------------------------------------------------
  // 4. Budgets (20 budgets)
  // ---------------------------------------------------------------------------
  const budgetPeriods = ["Monthly", "Weekly", "Yearly", "Custom"] as const;

  const budgetsData = Array.from({ length: 20 }, (_, index) => {
    const startDate = faker.date.past({ years: 0.5 });
    return {
      userId: myUserId,
      categoryId: insertedCategories[index].id,
      name: `${categoryTemplates[index].name} Budget`,
      amount: faker.finance.amount({ min: 100, max: 5000, dec: 2 }),
      currency: "USD",
      period: faker.helpers.arrayElement(budgetPeriods),
      startDate,
      endDate: faker.date.future({ years: 1, refDate: startDate }),
      createdAt: faker.date.past({ years: 1 }),
      updatedAt: new Date(),
    };
  });

  const insertedBudgets = await db
    .insert(budgetsTable)
    .values(budgetsData)
    .returning({ id: budgetsTable.id });

  console.log("✅ Inserted 20 budgets");

  // ---------------------------------------------------------------------------
  // 5. Goals (20 goals)
  // ---------------------------------------------------------------------------
  const goalNames = [
    "Emergency Fund", "Vacation to Japan", "New Car Downpayment", "Buy MacBook Pro",
    "House Downpayment", "Wedding Fund", "Crypto Investments", "Pay Off Student Loan",
    "Home Renovation", "New Bike", "Retirement Nest Egg", "Start Business",
    "Concert Tickets", "Annual Insurance", "Holiday Shopping", "SaaS Tech Stack",
    "Course Subscriptions", "Emergency Vet Fund", "Furniture Upgrade", "Gym Membership"
  ];

  const goalStatuses = ["active", "achieved", "paused"] as const;

  const goalsData = goalNames.map((name) => {
    const targetAmount = faker.number.int({ min: 500, max: 20000 });
    const currentAmount = faker.number.int({ min: 50, max: targetAmount });

    return {
      userId: myUserId,
      name,
      targetAmount: targetAmount.toFixed(2),
      currentAmount: currentAmount.toFixed(2),
      currency: "USD",
      status: faker.helpers.arrayElement(goalStatuses),
      targetDate: faker.date.future({ years: 2 }),
      createdAt: faker.date.past({ years: 1 }),
      updatedAt: new Date(),
    };
  });

  const insertedGoals = await db
    .insert(goalsTable)
    .values(goalsData)
    .returning({ id: goalsTable.id });

  console.log("✅ Inserted 20 goals");

  // ---------------------------------------------------------------------------
  // 6. Transactions (20 transactions)
  // ---------------------------------------------------------------------------
  const transactionTypes = ["Income", "Expense"] as const;

  const transactionsData = Array.from({ length: 20 }, (_, index) => {
    const type = faker.helpers.arrayElement(transactionTypes);

    return {
      userId: myUserId,
      date: faker.date.recent({ days: 90 }),
      description: faker.finance.transactionDescription(),
      amount: faker.finance.amount({
        min: type === "Income" ? 500 : 10,
        max: type === "Income" ? 5000 : 500,
        dec: 2,
      }),
      currency: "USD",
      type,
      categoryId: insertedCategories[index].id,
      budgetId: insertedBudgets[index].id,
      goalId: insertedGoals[index].id,
      createdAt: faker.date.recent({ days: 90 }),
      updatedAt: new Date(),
    };
  });

  await db.insert(transactionsTable).values(transactionsData);
  console.log("✅ Inserted 20 transactions");

  console.log("\n🎉 Seeding completed successfully!");
  console.log("-----------------------------------------");
  console.log(`All data was assigned to Google User: ${myUser.email}`);
  console.log("-----------------------------------------");
}

seed().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});