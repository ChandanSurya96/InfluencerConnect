import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { UserRole, insertInfluencerProfileSchema, insertBrandProfileSchema, insertMessageSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // sets up /api/register, /api/login, /api/logout, /api/user
  setupAuth(app);

  // Helper middleware to ensure user is authenticated
  const ensureAuthenticated = (req: Request, res: Response, next: Function) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ message: "Unauthorized" });
  };

  // Helper middleware to ensure user is admin
  const ensureAdmin = (req: Request, res: Response, next: Function) => {
    if (req.isAuthenticated() && req.user.role === UserRole.ADMIN) {
      return next();
    }
    res.status(403).json({ message: "Forbidden" });
  };

  // Profile Routes
  
  // Create/update influencer profile
  app.post("/api/influencer-profile", ensureAuthenticated, async (req, res) => {
    try {
      // Validate request body
      const validatedData = insertInfluencerProfileSchema.parse({
        ...req.body,
        userId: req.user!.id
      });
      
      // Check if profile already exists
      const existingProfile = await storage.getInfluencerProfile(req.user!.id);
      
      let profile;
      if (existingProfile) {
        profile = await storage.updateInfluencerProfile(req.user!.id, validatedData);
      } else {
        profile = await storage.createInfluencerProfile(validatedData);
      }
      
      res.status(200).json(profile);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid profile data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create profile" });
      }
    }
  });

  // Create/update brand profile
  app.post("/api/brand-profile", ensureAuthenticated, async (req, res) => {
    try {
      // Validate request body
      const validatedData = insertBrandProfileSchema.parse({
        ...req.body,
        userId: req.user!.id
      });
      
      // Check if profile already exists
      const existingProfile = await storage.getBrandProfile(req.user!.id);
      
      let profile;
      if (existingProfile) {
        profile = await storage.updateBrandProfile(req.user!.id, validatedData);
      } else {
        profile = await storage.createBrandProfile(validatedData);
      }
      
      res.status(200).json(profile);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid profile data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create profile" });
      }
    }
  });

  // Get current user's profile
  app.get("/api/profile", ensureAuthenticated, async (req, res) => {
    try {
      const userId = req.user!.id;
      let profile;
      
      if (req.user!.role === UserRole.INFLUENCER) {
        profile = await storage.getInfluencerProfile(userId);
      } else if (req.user!.role === UserRole.BRAND) {
        profile = await storage.getBrandProfile(userId);
      }
      
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }
      
      res.status(200).json(profile);
    } catch (error) {
      res.status(500).json({ message: "Failed to get profile" });
    }
  });

  // Get a user's profile by ID
  app.get("/api/profile/:userId", ensureAuthenticated, async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      let profile;
      if (user.role === UserRole.INFLUENCER) {
        profile = await storage.getInfluencerProfile(userId);
      } else if (user.role === UserRole.BRAND) {
        profile = await storage.getBrandProfile(userId);
      }
      
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }
      
      res.status(200).json({
        user: {
          id: user.id,
          username: user.username,
          name: user.name,
          email: user.email,
          bio: user.bio,
          profileImage: user.profileImage,
          coverImage: user.coverImage,
          role: user.role,
        },
        profile
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to get profile" });
    }
  });

  // Update user details
  app.patch("/api/user", ensureAuthenticated, async (req, res) => {
    try {
      const allowedFields = ["name", "bio", "profileImage", "coverImage"];
      const updates: any = {};
      
      for (const field of allowedFields) {
        if (req.body[field] !== undefined) {
          updates[field] = req.body[field];
        }
      }
      
      const updatedUser = await storage.updateUser(req.user!.id, updates);
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Don't return password
      delete updatedUser.password;
      
      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: "Failed to update user" });
    }
  });

  // Discovery Routes
  
  // Get all influencers
  app.get("/api/influencers", ensureAuthenticated, async (req, res) => {
    try {
      const query = req.query.q as string | undefined;
      
      let influencers;
      if (query) {
        influencers = await storage.searchInfluencers(query);
      } else if (Object.keys(req.query).length > 1) {
        // Filter by parameters other than 'q'
        const filters = { ...req.query };
        delete filters.q;
        influencers = await storage.filterInfluencers(filters);
      } else {
        influencers = await storage.getAllInfluencerProfiles();
      }
      
      // Remove sensitive information
      const sanitizedInfluencers = influencers.map(influencer => ({
        id: influencer.id,
        name: influencer.name,
        bio: influencer.bio,
        profileImage: influencer.profileImage,
        coverImage: influencer.coverImage,
        profile: influencer.profile
      }));
      
      res.status(200).json(sanitizedInfluencers);
    } catch (error) {
      res.status(500).json({ message: "Failed to get influencers" });
    }
  });

  // Get all brands
  app.get("/api/brands", ensureAuthenticated, async (req, res) => {
    try {
      const query = req.query.q as string | undefined;
      
      let brands;
      if (query) {
        brands = await storage.searchBrands(query);
      } else if (Object.keys(req.query).length > 1) {
        // Filter by parameters other than 'q'
        const filters = { ...req.query };
        delete filters.q;
        brands = await storage.filterBrands(filters);
      } else {
        brands = await storage.getAllBrandProfiles();
      }
      
      // Remove sensitive information
      const sanitizedBrands = brands.map(brand => ({
        id: brand.id,
        name: brand.name,
        bio: brand.bio,
        profileImage: brand.profileImage,
        coverImage: brand.coverImage,
        profile: brand.profile
      }));
      
      res.status(200).json(sanitizedBrands);
    } catch (error) {
      res.status(500).json({ message: "Failed to get brands" });
    }
  });

  // Messaging Routes
  
  // Send a message
  app.post("/api/messages", ensureAuthenticated, async (req, res) => {
    try {
      const validatedData = insertMessageSchema.parse({
        ...req.body,
        senderId: req.user!.id
      });
      
      // Check if receiver exists
      const receiver = await storage.getUser(validatedData.receiverId);
      if (!receiver) {
        return res.status(404).json({ message: "Recipient not found" });
      }
      
      const message = await storage.createMessage(validatedData);
      res.status(201).json(message);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid message data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create message" });
      }
    }
  });

  // Get conversation with a user
  app.get("/api/messages/:userId", ensureAuthenticated, async (req, res) => {
    try {
      const partnerId = parseInt(req.params.userId);
      if (isNaN(partnerId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      // Make sure the other user exists
      const partner = await storage.getUser(partnerId);
      if (!partner) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const conversation = await storage.getConversation(req.user!.id, partnerId);
      
      // Mark messages from partner as read
      await storage.markMessagesAsRead(partnerId, req.user!.id);
      
      res.status(200).json(conversation);
    } catch (error) {
      res.status(500).json({ message: "Failed to get conversation" });
    }
  });

  // Get all user conversations
  app.get("/api/conversations", ensureAuthenticated, async (req, res) => {
    try {
      const conversations = await storage.getUserConversations(req.user!.id);
      
      // Fetch the actual user objects for each conversation partner
      const conversationsWithUsers = await Promise.all(
        conversations.map(async (convo) => {
          const user = await storage.getUser(convo.userId);
          if (!user) return null;
          
          return {
            user: {
              id: user.id,
              name: user.name,
              username: user.username,
              profileImage: user.profileImage,
              role: user.role
            },
            lastMessage: convo.lastMessage,
            unreadCount: convo.unreadCount
          };
        })
      );
      
      // Filter out any null values (from users that no longer exist)
      const validConversations = conversationsWithUsers.filter(c => c !== null);
      
      res.status(200).json(validConversations);
    } catch (error) {
      res.status(500).json({ message: "Failed to get conversations" });
    }
  });

  // Admin Routes
  
  // Get all users (admin only)
  app.get("/api/admin/users", ensureAdmin, async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      
      // Remove passwords before sending
      const safeUsers = users.map(user => {
        const { password, ...safeUser } = user;
        return safeUser;
      });
      
      res.status(200).json(safeUsers);
    } catch (error) {
      res.status(500).json({ message: "Failed to get users" });
    }
  });

  // Get all messages (admin only)
  app.get("/api/admin/messages", ensureAdmin, async (req, res) => {
    try {
      // Get all users to build a user map for look-up
      const users = await storage.getAllUsers();
      const userMap = new Map(users.map(user => [user.id, { id: user.id, name: user.name, username: user.username }]));
      
      // Get all conversations between all users
      const allMessages = [];
      for (let i = 0; i < users.length; i++) {
        for (let j = i + 1; j < users.length; j++) {
          const conversation = await storage.getConversation(users[i].id, users[j].id);
          if (conversation.length > 0) {
            // Add user info to messages
            const messagesWithUserInfo = conversation.map(msg => ({
              ...msg,
              sender: userMap.get(msg.senderId),
              receiver: userMap.get(msg.receiverId)
            }));
            allMessages.push(...messagesWithUserInfo);
          }
        }
      }
      
      // Sort by creation date (newest first)
      allMessages.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      
      res.status(200).json(allMessages);
    } catch (error) {
      res.status(500).json({ message: "Failed to get messages" });
    }
  });

  // Get stats for admin dashboard
  app.get("/api/admin/stats", ensureAdmin, async (req, res) => {
    try {
      const [allUsers, influencers, brands] = await Promise.all([
        storage.getAllUsers(),
        storage.getAllUsersByRole(UserRole.INFLUENCER),
        storage.getAllUsersByRole(UserRole.BRAND)
      ]);
      
      // Count active conversations (at least one message in last 7 days)
      let activeConversations = 0;
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      // This is inefficient but works for an in-memory store
      // In a real database, you'd use a query with a date filter
      for (let i = 0; i < allUsers.length; i++) {
        for (let j = i + 1; j < allUsers.length; j++) {
          const conversation = await storage.getConversation(allUsers[i].id, allUsers[j].id);
          if (conversation.some(msg => msg.createdAt > sevenDaysAgo)) {
            activeConversations++;
          }
        }
      }
      
      // Get category distribution for influencers
      const influencerProfiles = await Promise.all(
        influencers.map(inf => storage.getInfluencerProfile(inf.id))
      );
      
      const categoryCount = influencerProfiles
        .filter(Boolean) // Remove null/undefined profiles
        .reduce((acc: Record<string, number>, profile) => {
          const category = profile!.category;
          acc[category] = (acc[category] || 0) + 1;
          return acc;
        }, {});
      
      // Get company type distribution for brands
      const brandProfiles = await Promise.all(
        brands.map(brand => storage.getBrandProfile(brand.id))
      );
      
      const companyTypeCount = brandProfiles
        .filter(Boolean) // Remove null/undefined profiles
        .reduce((acc: Record<string, number>, profile) => {
          const type = profile!.companyType;
          acc[type] = (acc[type] || 0) + 1;
          return acc;
        }, {});
      
      res.status(200).json({
        totalUsers: allUsers.length,
        influencerCount: influencers.length,
        brandCount: brands.length,
        activeConversations,
        categoryDistribution: categoryCount,
        companyTypeDistribution: companyTypeCount
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to get admin stats" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
