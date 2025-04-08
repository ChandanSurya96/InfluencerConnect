import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { 
  insertInfluencerProfileSchema, 
  insertBrandProfileSchema, 
  insertMessageSchema,
  UserRole
} from "@shared/schema";
import { z } from "zod";

// Middleware to check if user is authenticated
const isAuthenticated = (req: any, res: any, next: any) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
};

// Middleware to check if user is an admin
const isAdmin = (req: any, res: any, next: any) => {
  if (req.isAuthenticated() && req.user.role === UserRole.ADMIN) {
    return next();
  }
  res.status(403).json({ message: "Forbidden" });
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes
  setupAuth(app);
  
  // Create HTTP server
  const httpServer = createServer(app);

  // Profile routes
  app.post("/api/profile/influencer", isAuthenticated, async (req, res) => {
    try {
      // Validate the request body
      const profileData = insertInfluencerProfileSchema.parse({
        ...req.body,
        userId: req.user.id
      });
      
      // Check if user is an influencer
      if (req.user.role !== UserRole.INFLUENCER) {
        return res.status(403).json({ message: "Only influencers can create influencer profiles" });
      }
      
      // Check if profile already exists
      const existingProfile = await storage.getInfluencerProfile(req.user.id);
      if (existingProfile) {
        return res.status(400).json({ message: "Profile already exists" });
      }
      
      // Create the profile
      const profile = await storage.createInfluencerProfile(profileData);
      res.status(201).json(profile);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid profile data", errors: error.errors });
      } else {
        console.error("Error creating influencer profile:", error);
        res.status(500).json({ message: "Failed to create profile" });
      }
    }
  });
  
  app.put("/api/profile/influencer", isAuthenticated, async (req, res) => {
    try {
      // Check if user is an influencer
      if (req.user.role !== UserRole.INFLUENCER) {
        return res.status(403).json({ message: "Only influencers can update influencer profiles" });
      }
      
      // Update the profile
      const updatedProfile = await storage.updateInfluencerProfile(req.user.id, req.body);
      if (!updatedProfile) {
        return res.status(404).json({ message: "Profile not found" });
      }
      
      res.status(200).json(updatedProfile);
    } catch (error) {
      console.error("Error updating influencer profile:", error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  });
  
  app.post("/api/profile/brand", isAuthenticated, async (req, res) => {
    try {
      // Validate the request body
      const profileData = insertBrandProfileSchema.parse({
        ...req.body,
        userId: req.user.id
      });
      
      // Check if user is a brand
      if (req.user.role !== UserRole.BRAND) {
        return res.status(403).json({ message: "Only brands can create brand profiles" });
      }
      
      // Check if profile already exists
      const existingProfile = await storage.getBrandProfile(req.user.id);
      if (existingProfile) {
        return res.status(400).json({ message: "Profile already exists" });
      }
      
      // Create the profile
      const profile = await storage.createBrandProfile(profileData);
      res.status(201).json(profile);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid profile data", errors: error.errors });
      } else {
        console.error("Error creating brand profile:", error);
        res.status(500).json({ message: "Failed to create profile" });
      }
    }
  });
  
  app.put("/api/profile/brand", isAuthenticated, async (req, res) => {
    try {
      // Check if user is a brand
      if (req.user.role !== UserRole.BRAND) {
        return res.status(403).json({ message: "Only brands can update brand profiles" });
      }
      
      // Update the profile
      const updatedProfile = await storage.updateBrandProfile(req.user.id, req.body);
      if (!updatedProfile) {
        return res.status(404).json({ message: "Profile not found" });
      }
      
      res.status(200).json(updatedProfile);
    } catch (error) {
      console.error("Error updating brand profile:", error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  // Discovery routes
  app.get("/api/discover/influencers", async (req, res) => {
    try {
      // Parse query parameters
      const { category, location } = req.query;
      
      // Apply filters
      const filters: Record<string, any> = {};
      if (category) filters.category = category as string;
      if (location) filters.location = location as string;
      
      // Get influencer profiles
      const profiles = await storage.listInfluencerProfiles(filters);
      
      // Fetch user data for each profile
      const profilesWithUserData = await Promise.all(
        profiles.map(async (profile) => {
          const user = await storage.getUser(profile.userId);
          return { profile, user };
        })
      );
      
      res.status(200).json(profilesWithUserData);
    } catch (error) {
      console.error("Error fetching influencer profiles:", error);
      res.status(500).json({ message: "Failed to fetch profiles" });
    }
  });
  
  app.get("/api/discover/brands", async (req, res) => {
    try {
      // Parse query parameters
      const { industry, location } = req.query;
      
      // Apply filters
      const filters: Record<string, any> = {};
      if (industry) filters.industry = industry as string;
      if (location) filters.location = location as string;
      
      // Get brand profiles
      const profiles = await storage.listBrandProfiles(filters);
      
      // Fetch user data for each profile
      const profilesWithUserData = await Promise.all(
        profiles.map(async (profile) => {
          const user = await storage.getUser(profile.userId);
          return { profile, user };
        })
      );
      
      res.status(200).json(profilesWithUserData);
    } catch (error) {
      console.error("Error fetching brand profiles:", error);
      res.status(500).json({ message: "Failed to fetch profiles" });
    }
  });
  
  app.get("/api/profile/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const userWithProfile = await storage.getUserWithProfile(userId);
      if (!userWithProfile) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.status(200).json(userWithProfile);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      res.status(500).json({ message: "Failed to fetch profile" });
    }
  });

  // Messaging routes
  app.post("/api/messages", isAuthenticated, async (req, res) => {
    try {
      // Validate the request body
      const messageData = insertMessageSchema.parse({
        ...req.body,
        senderId: req.user.id
      });
      
      // Create the message
      const message = await storage.createMessage(messageData);
      res.status(201).json(message);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid message data", errors: error.errors });
      } else {
        console.error("Error creating message:", error);
        res.status(500).json({ message: "Failed to send message" });
      }
    }
  });
  
  app.get("/api/messages/:userId", isAuthenticated, async (req, res) => {
    try {
      const otherUserId = parseInt(req.params.userId);
      if (isNaN(otherUserId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      // Get messages between users
      const messages = await storage.getMessagesBetweenUsers(req.user.id, otherUserId);
      
      // Mark received messages as read
      await storage.markMessagesAsRead(otherUserId, req.user.id);
      
      res.status(200).json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });
  
  app.get("/api/conversations", isAuthenticated, async (req, res) => {
    try {
      // Get user conversations
      const conversations = await storage.getUserConversations(req.user.id);
      
      // Fetch user data for each conversation
      const conversationsWithUserData = await Promise.all(
        conversations.map(async (conversation) => {
          const user = await storage.getUser(conversation.userId);
          return { ...conversation, user };
        })
      );
      
      res.status(200).json(conversationsWithUserData);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      res.status(500).json({ message: "Failed to fetch conversations" });
    }
  });

  // Admin routes
  app.get("/api/admin/users", isAdmin, async (req, res) => {
    try {
      const users = await storage.listUsers();
      res.status(200).json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });
  
  app.put("/api/admin/users/:userId", isAdmin, async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const { verified, ...userData } = req.body;
      
      // Update user data
      const updatedUser = await storage.updateUser(userId, userData);
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Update profile verification if provided
      if (typeof verified === 'boolean') {
        const user = await storage.getUser(userId);
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
        
        if (user.role === UserRole.INFLUENCER) {
          await storage.updateInfluencerProfile(userId, { verified });
        } else if (user.role === UserRole.BRAND) {
          await storage.updateBrandProfile(userId, { verified });
        }
      }
      
      res.status(200).json({ message: "User updated successfully" });
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ message: "Failed to update user" });
    }
  });

  return httpServer;
}
