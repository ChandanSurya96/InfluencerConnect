import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User roles
export enum UserRole {
  INFLUENCER = "influencer",
  BRAND = "brand",
  ADMIN = "admin"
}

// User table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  role: text("role").$type<UserRole>().notNull(),
  name: text("name").notNull(),
  bio: text("bio"),
  profileImage: text("profile_image"),
  coverImage: text("cover_image"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Influencer profiles
export const influencerProfiles = pgTable("influencer_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  category: text("category").notNull(),
  platforms: jsonb("platforms").notNull(), // Array of platforms
  followerCount: integer("follower_count"),
  engagementRate: text("engagement_rate"),
  contentSamples: jsonb("content_samples"), // Array of content URLs
  pricing: text("pricing"),
});

// Brand profiles
export const brandProfiles = pgTable("brand_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  companyType: text("company_type").notNull(),
  industry: text("industry").notNull(),
  marketingGoals: text("marketing_goals"),
  budget: text("budget"),
  pastCampaigns: jsonb("past_campaigns"), // Array of campaign descriptions
});

// Messages
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  senderId: integer("sender_id").notNull().references(() => users.id),
  receiverId: integer("receiver_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  read: boolean("read").default(false),
});

// Zod schemas for insert operations
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertInfluencerProfileSchema = createInsertSchema(influencerProfiles).omit({
  id: true,
});

export const insertBrandProfileSchema = createInsertSchema(brandProfiles).omit({
  id: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true,
});

// Types for insertion and selection
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertInfluencerProfile = z.infer<typeof insertInfluencerProfileSchema>;
export type InfluencerProfile = typeof influencerProfiles.$inferSelect;

export type InsertBrandProfile = z.infer<typeof insertBrandProfileSchema>;
export type BrandProfile = typeof brandProfiles.$inferSelect;

export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;

// Extended types for frontend use
export type InfluencerWithProfile = User & {
  profile: InfluencerProfile;
};

export type BrandWithProfile = User & {
  profile: BrandProfile;
};
