import { integer, pgTable, text, varchar } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  age: integer().notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  country: varchar({ length: 255 }),
});

export const watchlist = pgTable("watchlist", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  coinId: text("coin_id").notNull(),
});
