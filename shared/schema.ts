import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User table for both influencers and brands
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  role: text("role", { enum: ["influencer", "brand", "admin"] }).notNull(),
  name: text("name").notNull(),
  bio: text("bio"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Influencer profiles
export const influencerProfiles = pgTable("influencer_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  category: text("category").notNull(), // tech, fashion, fitness, etc.
  platforms: json("platforms").notNull(), // Array of platforms they use
  followerCount: integer("follower_count").notNull(),
  engagementRate: text("engagement_rate"),
  portfolio: json("portfolio"), // Array of portfolio items/links
  pricing: text("pricing"), // Pricing information
  location: text("location"),
  verified: boolean("verified").default(false),
});

// Brand profiles
export const brandProfiles = pgTable("brand_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  companyType: text("company_type").notNull(), // product-based or service-based
  industry: text("industry").notNull(), // tech, health, fashion, etc.
  marketingGoals: text("marketing_goals"),
  budget: text("budget"),
  pastCampaigns: json("past_campaigns"), // Array of past campaigns
  location: text("location"),
  verified: boolean("verified").default(false),
});

// Messages table for chat functionality
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  senderId: integer("sender_id").references(() => users.id).notNull(),
  recipientId: integer("recipient_id").references(() => users.id).notNull(),
  content: text("content").notNull(),
  read: boolean("read").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  role: true,
  name: true,
  bio: true,
});

export const insertInfluencerProfileSchema = createInsertSchema(influencerProfiles).pick({
  userId: true,
  category: true,
  platforms: true,
  followerCount: true,
  engagementRate: true,
  portfolio: true,
  pricing: true,
  location: true,
});

export const insertBrandProfileSchema = createInsertSchema(brandProfiles).pick({
  userId: true,
  companyType: true,
  industry: true,
  marketingGoals: true,
  budget: true,
  pastCampaigns: true,
  location: true,
});

export const insertMessageSchema = createInsertSchema(messages).pick({
  senderId: true,
  recipientId: true,
  content: true,
});

// Type exports
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertInfluencerProfile = z.infer<typeof insertInfluencerProfileSchema>;
export type InfluencerProfile = typeof influencerProfiles.$inferSelect;

export type InsertBrandProfile = z.infer<typeof insertBrandProfileSchema>;
export type BrandProfile = typeof brandProfiles.$inferSelect;

export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;

// Enums for select options
export enum UserRole {
  INFLUENCER = "influencer",
  BRAND = "brand",
  ADMIN = "admin",
}

export enum CompanyType {
  PRODUCT_BASED = "product-based",
  SERVICE_BASED = "service-based",
}

export enum PlatformType {
  YOUTUBE = "YouTube",
  INSTAGRAM = "Instagram",
  TIKTOK = "TikTok",
  TWITTER = "Twitter",
  TWITCH = "Twitch",
  FACEBOOK = "Facebook",
  LINKEDIN = "LinkedIn",
}

export enum CategoryType {
  TECH = "Technology",
  FASHION = "Fashion & Beauty",
  FITNESS = "Fitness & Health",
  FOOD = "Food & Cooking",
  TRAVEL = "Travel",
  GAMING = "Gaming",
  LIFESTYLE = "Lifestyle",
  EDUCATION = "Education",
  BUSINESS = "Business",
  ENTERTAINMENT = "Entertainment",
  OTHER = "Other",
}

export enum IndustryType {
  TECH = "Technology",
  FASHION = "Fashion & Beauty",
  FITNESS = "Fitness & Health",
  FOOD = "Food & Beverage",
  TRAVEL = "Travel",
  GAMING = "Gaming",
  ENTERTAINMENT = "Entertainment",
  EDUCATION = "Education",
  FINANCE = "Finance",
  HEALTH = "Health & Wellness",
  RETAIL = "Retail",
  OTHER = "Other",
}

export enum AudienceSize {
  MICRO = "Micro (1K-10K)",
  SMALL = "Small (10K-50K)",
  MEDIUM = "Medium (50K-100K)",
  LARGE = "Large (100K-1M)",
  XLARGE = "X-Large (1M+)",
}

export enum BudgetRange {
  LOW = "$0-$500",
  MEDIUM = "$500-$2,000",
  HIGH = "$2,000-$10,000",
  ENTERPRISE = "$10,000+",
}

// Extended types for frontend use
export type UserWithProfile = User & {
  influencerProfile?: InfluencerProfile;
  brandProfile?: BrandProfile;
};
