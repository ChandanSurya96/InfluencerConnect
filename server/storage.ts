import { users, influencerProfiles, brandProfiles, messages } from "@shared/schema";
import type { User, InsertUser, InfluencerProfile, InsertInfluencerProfile, BrandProfile, InsertBrandProfile, Message, InsertMessage, InfluencerWithProfile, BrandWithProfile, UserRole } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";
import { v4 as uuidv4 } from "uuid";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, data: Partial<User>): Promise<User | undefined>;
  deleteUser(id: number): Promise<boolean>;
  getAllUsers(): Promise<User[]>;
  getAllUsersByRole(role: UserRole): Promise<User[]>;
  
  // Influencer profile operations
  getInfluencerProfile(userId: number): Promise<InfluencerProfile | undefined>;
  createInfluencerProfile(profile: InsertInfluencerProfile): Promise<InfluencerProfile>;
  updateInfluencerProfile(userId: number, data: Partial<InsertInfluencerProfile>): Promise<InfluencerProfile | undefined>;
  getAllInfluencerProfiles(): Promise<InfluencerWithProfile[]>;
  
  // Brand profile operations
  getBrandProfile(userId: number): Promise<BrandProfile | undefined>;
  createBrandProfile(profile: InsertBrandProfile): Promise<BrandProfile>;
  updateBrandProfile(userId: number, data: Partial<InsertBrandProfile>): Promise<BrandProfile | undefined>;
  getAllBrandProfiles(): Promise<BrandWithProfile[]>;
  
  // Message operations
  getMessage(id: number): Promise<Message | undefined>;
  createMessage(message: InsertMessage): Promise<Message>;
  getConversation(user1Id: number, user2Id: number): Promise<Message[]>;
  getUserConversations(userId: number): Promise<{userId: number, lastMessage: Message, unreadCount: number}[]>;
  markMessagesAsRead(senderId: number, receiverId: number): Promise<boolean>;
  
  // Search and filter operations
  searchInfluencers(query: string): Promise<InfluencerWithProfile[]>;
  filterInfluencers(filters: any): Promise<InfluencerWithProfile[]>;
  searchBrands(query: string): Promise<BrandWithProfile[]>;
  filterBrands(filters: any): Promise<BrandWithProfile[]>;
  
  // Session store for authentication
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private usersData: Map<number, User>;
  private influencerProfilesData: Map<number, InfluencerProfile>;
  private brandProfilesData: Map<number, BrandProfile>;
  private messagesData: Map<number, Message>;
  sessionStore: session.SessionStore;
  
  private currentUserId: number;
  private currentProfileId: number;
  private currentMessageId: number;

  constructor() {
    this.usersData = new Map();
    this.influencerProfilesData = new Map();
    this.brandProfilesData = new Map();
    this.messagesData = new Map();
    
    this.currentUserId = 1;
    this.currentProfileId = 1;
    this.currentMessageId = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
    
    // Create admin user
    this.createUser({
      username: "admin",
      password: "$2b$10$dXiuz6c7LCaHzM9e9T57dO0KJAJLmvzKLnKcAhkynZD9Q1ICasgx.", // "adminpassword"
      email: "admin@collabconnect.com",
      role: UserRole.ADMIN,
      name: "System Admin",
      bio: "Platform administrator",
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.usersData.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.usersData.values()).find(user => 
      user.username.toLowerCase() === username.toLowerCase()
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.usersData.values()).find(user => 
      user.email.toLowerCase() === email.toLowerCase()
    );
  }

  async createUser(userData: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...userData, id, createdAt: new Date() };
    this.usersData.set(id, user);
    return user;
  }

  async updateUser(id: number, data: Partial<User>): Promise<User | undefined> {
    const user = await this.getUser(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...data };
    this.usersData.set(id, updatedUser);
    return updatedUser;
  }

  async deleteUser(id: number): Promise<boolean> {
    return this.usersData.delete(id);
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.usersData.values());
  }

  async getAllUsersByRole(role: UserRole): Promise<User[]> {
    return Array.from(this.usersData.values()).filter(user => user.role === role);
  }

  // Influencer profile operations
  async getInfluencerProfile(userId: number): Promise<InfluencerProfile | undefined> {
    return Array.from(this.influencerProfilesData.values()).find(
      profile => profile.userId === userId
    );
  }

  async createInfluencerProfile(profileData: InsertInfluencerProfile): Promise<InfluencerProfile> {
    const id = this.currentProfileId++;
    const profile: InfluencerProfile = { ...profileData, id };
    this.influencerProfilesData.set(id, profile);
    return profile;
  }

  async updateInfluencerProfile(userId: number, data: Partial<InsertInfluencerProfile>): Promise<InfluencerProfile | undefined> {
    const profile = await this.getInfluencerProfile(userId);
    if (!profile) return undefined;
    
    const updatedProfile = { ...profile, ...data };
    this.influencerProfilesData.set(profile.id, updatedProfile);
    return updatedProfile;
  }

  async getAllInfluencerProfiles(): Promise<InfluencerWithProfile[]> {
    const results: InfluencerWithProfile[] = [];
    
    for (const profile of this.influencerProfilesData.values()) {
      const user = await this.getUser(profile.userId);
      if (user) {
        results.push({ ...user, profile });
      }
    }
    
    return results;
  }

  // Brand profile operations
  async getBrandProfile(userId: number): Promise<BrandProfile | undefined> {
    return Array.from(this.brandProfilesData.values()).find(
      profile => profile.userId === userId
    );
  }

  async createBrandProfile(profileData: InsertBrandProfile): Promise<BrandProfile> {
    const id = this.currentProfileId++;
    const profile: BrandProfile = { ...profileData, id };
    this.brandProfilesData.set(id, profile);
    return profile;
  }

  async updateBrandProfile(userId: number, data: Partial<InsertBrandProfile>): Promise<BrandProfile | undefined> {
    const profile = await this.getBrandProfile(userId);
    if (!profile) return undefined;
    
    const updatedProfile = { ...profile, ...data };
    this.brandProfilesData.set(profile.id, updatedProfile);
    return updatedProfile;
  }

  async getAllBrandProfiles(): Promise<BrandWithProfile[]> {
    const results: BrandWithProfile[] = [];
    
    for (const profile of this.brandProfilesData.values()) {
      const user = await this.getUser(profile.userId);
      if (user) {
        results.push({ ...user, profile });
      }
    }
    
    return results;
  }

  // Message operations
  async getMessage(id: number): Promise<Message | undefined> {
    return this.messagesData.get(id);
  }

  async createMessage(messageData: InsertMessage): Promise<Message> {
    const id = this.currentMessageId++;
    const message: Message = { ...messageData, id, createdAt: new Date() };
    this.messagesData.set(id, message);
    return message;
  }

  async getConversation(user1Id: number, user2Id: number): Promise<Message[]> {
    return Array.from(this.messagesData.values())
      .filter(message => 
        (message.senderId === user1Id && message.receiverId === user2Id) ||
        (message.senderId === user2Id && message.receiverId === user1Id)
      )
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  async getUserConversations(userId: number): Promise<{userId: number, lastMessage: Message, unreadCount: number}[]> {
    // Get all messages where the user is either sender or receiver
    const userMessages = Array.from(this.messagesData.values())
      .filter(message => 
        message.senderId === userId || message.receiverId === userId
      );
    
    // Get unique conversation partners
    const partnerIds = new Set<number>();
    userMessages.forEach(message => {
      if (message.senderId === userId) {
        partnerIds.add(message.receiverId);
      } else {
        partnerIds.add(message.senderId);
      }
    });
    
    // Build conversation summaries
    const conversations = [];
    
    for (const partnerId of partnerIds) {
      // Get all messages between the user and this partner
      const conversationMessages = userMessages.filter(message => 
        (message.senderId === userId && message.receiverId === partnerId) ||
        (message.senderId === partnerId && message.receiverId === userId)
      );
      
      // Sort by creation time (descending) to get the latest message first
      conversationMessages.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      
      // Count unread messages sent to the user
      const unreadCount = conversationMessages.filter(message => 
        message.senderId === partnerId && message.receiverId === userId && !message.read
      ).length;
      
      if (conversationMessages.length > 0) {
        conversations.push({
          userId: partnerId,
          lastMessage: conversationMessages[0],
          unreadCount
        });
      }
    }
    
    // Sort conversations by the timestamp of the last message (most recent first)
    return conversations.sort((a, b) => 
      b.lastMessage.createdAt.getTime() - a.lastMessage.createdAt.getTime()
    );
  }

  async markMessagesAsRead(senderId: number, receiverId: number): Promise<boolean> {
    let updated = false;
    
    for (const [id, message] of this.messagesData.entries()) {
      if (message.senderId === senderId && message.receiverId === receiverId && !message.read) {
        message.read = true;
        this.messagesData.set(id, message);
        updated = true;
      }
    }
    
    return updated;
  }

  // Search and filter operations
  async searchInfluencers(query: string): Promise<InfluencerWithProfile[]> {
    const allProfiles = await this.getAllInfluencerProfiles();
    
    if (!query) return allProfiles;
    
    const searchTerm = query.toLowerCase();
    return allProfiles.filter(influencer => 
      influencer.name.toLowerCase().includes(searchTerm) ||
      influencer.profile.category.toLowerCase().includes(searchTerm) ||
      (influencer.bio && influencer.bio.toLowerCase().includes(searchTerm))
    );
  }

  async filterInfluencers(filters: any): Promise<InfluencerWithProfile[]> {
    let results = await this.getAllInfluencerProfiles();
    
    if (filters.category) {
      results = results.filter(influencer => 
        influencer.profile.category.toLowerCase() === filters.category.toLowerCase()
      );
    }
    
    if (filters.platforms && filters.platforms.length > 0) {
      results = results.filter(influencer => {
        const influencerPlatforms = influencer.profile.platforms as string[];
        return filters.platforms.some((p: string) => 
          influencerPlatforms.includes(p)
        );
      });
    }
    
    if (filters.minFollowers) {
      results = results.filter(influencer => 
        (influencer.profile.followerCount || 0) >= filters.minFollowers
      );
    }
    
    if (filters.maxFollowers) {
      results = results.filter(influencer => 
        (influencer.profile.followerCount || 0) <= filters.maxFollowers
      );
    }
    
    return results;
  }

  async searchBrands(query: string): Promise<BrandWithProfile[]> {
    const allProfiles = await this.getAllBrandProfiles();
    
    if (!query) return allProfiles;
    
    const searchTerm = query.toLowerCase();
    return allProfiles.filter(brand => 
      brand.name.toLowerCase().includes(searchTerm) ||
      brand.profile.industry.toLowerCase().includes(searchTerm) ||
      (brand.bio && brand.bio.toLowerCase().includes(searchTerm))
    );
  }

  async filterBrands(filters: any): Promise<BrandWithProfile[]> {
    let results = await this.getAllBrandProfiles();
    
    if (filters.industry) {
      results = results.filter(brand => 
        brand.profile.industry.toLowerCase() === filters.industry.toLowerCase()
      );
    }
    
    if (filters.companyType) {
      results = results.filter(brand => 
        brand.profile.companyType.toLowerCase() === filters.companyType.toLowerCase()
      );
    }
    
    if (filters.budget) {
      results = results.filter(brand => 
        brand.profile.budget && brand.profile.budget.toLowerCase().includes(filters.budget.toLowerCase())
      );
    }
    
    return results;
  }
}

export const storage = new MemStorage();
