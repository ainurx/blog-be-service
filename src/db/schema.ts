import { integer, pgTable, varchar, pgEnum, timestamp, text, boolean } from "drizzle-orm/pg-core";

import { EGender } from "../ts/User";

export const genderEnum = pgEnum('gender', [EGender.Male, EGender.Female])

const timestamps = {
  updated_at: timestamp().defaultNow().notNull(),
  created_at: timestamp().defaultNow().notNull(),
}

// user/session/account/verification are owned by better-auth (src/utils/auth.ts).
// Field names here follow better-auth's own defaults (see @better-auth/core's
// getAuthTables) so its drizzle adapter can resolve them without extra `fields`
// mapping: camelCase property keys with an explicit snake_case column name,
// matching how `blog.userId` below already names its `user_id` column.
export const user = pgTable("users", {
  id: text().primaryKey(),
  email: varchar({ length: 100 }).notNull().unique(),
  name: varchar({ length: 150 }).notNull(),
  gender: genderEnum().notNull(),
  emailVerified: boolean('email_verified').default(false).notNull(),
  image: text(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const session = pgTable("sessions", {
  id: text().primaryKey(),
  expiresAt: timestamp('expires_at').notNull(),
  token: text().notNull().unique(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Credentials (hashed password) live here, not on `user` — better-auth
// creates one row per sign-in provider (providerId: 'credential' for
// email/password), keyed by (issuer, accountId).
export const account = pgTable("accounts", {
  id: text().primaryKey(),
  issuer: text().notNull(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  password: text(),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const verification = pgTable("verifications", {
  id: text().primaryKey(),
  identifier: text().notNull(),
  value: text().notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const blog = pgTable("blogs", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: text('user_id').references(() => user.id),
  title: varchar({ length: 100 }).notNull(),
  content: text().notNull(),
  ...timestamps
});

