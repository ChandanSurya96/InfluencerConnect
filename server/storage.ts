import { users, influencerProfiles, brandProfiles, messages } from "@shared/schema";
import type {
  User,
  InsertUser,
  InfluencerProfile,
  InsertInfluencerProfile,
  BrandProfile,
  InsertBrandProfile,
  Message,
  InsertMessage,
  UserWithProfile
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

// Storage interface
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, data: Partial<User>): Promise<User | undefined>;
  listUsers(): Promise<User[]>;
  
  // Influencer profile methods
  getInfluencerProfile(userId: number): Promise<InfluencerProfile | undefined>;
  createInfluencerProfile(profile: InsertInfluencerProfile): Promise<InfluencerProfile>;
  updateInfluencerProfile(userId: number, data: Partial<InfluencerProfile>): Promise<InfluencerProfile | undefined>;
  listInfluencerProfiles(filters?: Partial<InfluencerProfile>): Promise<InfluencerProfile[]>;
  
  // Brand profile methods
  getBrandProfile(userId: number): Promise<BrandProfile | undefined>;
  createBrandProfile(profile: InsertBrandProfile): Promise<BrandProfile>;
  updateBrandProfile(userId: number, data: Partial<BrandProfile>): Promise<BrandProfile | undefined>;
  listBrandProfiles(filters?: Partial<BrandProfile>): Promise<BrandProfile[]>;
  
  // Message methods
  createMessage(message: InsertMessage): Promise<Message>;
  getMessagesBetweenUsers(user1Id: number, user2Id: number): Promise<Message[]>;
  getUserConversations(userId: number): Promise<{userId: number, lastMessage: Message}[]>;
  markMessagesAsRead(senderId: number, recipientId: number): Promise<void>;
  
  // Advanced methods
  getUserWithProfile(userId: number): Promise<UserWithProfile | undefined>;
  
  // Session store
  sessionStore: session.SessionStore;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private usersData: Map<number, User>;
  private influencerProfilesData: Map<number, InfluencerProfile>;
  private brandProfilesData: Map<number, BrandProfile>;
  private messagesData: Map<number, Message>;
  sessionStore: session.SessionStore;
  private userId: number;
  private influencerProfileId: number;
  private brandProfileId: number;
  private messageId: number;

  constructor() {
    this.usersData = new Map();
    this.influencerProfilesData = new Map();
    this.brandProfilesData = new Map();
    this.messagesData = new Map();
    this.userId = 1;
    this.influencerProfileId = 1;
    this.brandProfileId = 1;
    this.messageId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.usersData.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.usersData.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase(),
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.usersData.values()).find(
      (user) => user.email.toLowerCase() === email.toLowerCase(),
    );
  }

  async createUser(userData: InsertUser): Promise<User> {
    const id = this.userId++;
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

  async listUsers(): Promise<User[]> {
    return Array.from(this.usersData.values());
  }

  // Influencer profile methods
  async getInfluencerProfile(userId: number): Promise<InfluencerProfile | undefined> {
    return Array.from(this.influencerProfilesData.values()).find(
      (profile) => profile.userId === userId,
    );
  }

  async createInfluencerProfile(profile: InsertInfluencerProfile): Promise<InfluencerProfile> {
    const id = this.influencerProfileId++;
    const newProfile: InfluencerProfile = { ...profile, id, verified: false };
    this.influencerProfilesData.set(id, newProfile);
    return newProfile;
  }

  async updateInfluencerProfile(userId: number, data: Partial<InfluencerProfile>): Promise<InfluencerProfile | undefined> {
    const profile = await this.getInfluencerProfile(userId);
    if (!profile) return undefined;
    
    const updatedProfile = { ...profile, ...data };
    this.influencerProfilesData.set(profile.id, updatedProfile);
    return updatedProfile;
  }

  async listInfluencerProfiles(filters?: Partial<InfluencerProfile>): Promise<InfluencerProfile[]> {
    let profiles = Array.from(this.influencerProfilesData.values());
    
    if (filters) {
      profiles = profiles.filter(profile => {
        return Object.entries(filters).every(([key, value]) => {
          if (key === 'category' && value) {
            return profile.category === value;
          }
          if (key === 'location' && value) {
            return profile.location === value;
          }
          return true;
        });
      });
    }
    
    return profiles;
  }

  // Brand profile methods
  async getBrandProfile(userId: number): Promise<BrandProfile | undefined> {
    return Array.from(this.brandProfilesData.values()).find(
      (profile) => profile.userId === userId,
    );
  }

  async createBrandProfile(profile: InsertBrandProfile): Promise<BrandProfile> {
    const id = this.brandProfileId++;
    const newProfile: BrandProfile = { ...profile, id, verified: false };
    this.brandProfilesData.set(id, newProfile);
    return newProfile;
  }

  async updateBrandProfile(userId: number, data: Partial<BrandProfile>): Promise<BrandProfile | undefined> {
    const profile = await this.getBrandProfile(userId);
    if (!profile) return undefined;
    
    const updatedProfile = { ...profile, ...data };
    this.brandProfilesData.set(profile.id, updatedProfile);
    return updatedProfile;
  }

  async listBrandProfiles(filters?: Partial<BrandProfile>): Promise<BrandProfile[]> {
    let profiles = Array.from(this.brandProfilesData.values());
    
    if (filters) {
      profiles = profiles.filter(profile => {
        return Object.entries(filters).every(([key, value]) => {
          if (key === 'industry' && value) {
            return profile.industry === value;
          }
          if (key === 'location' && value) {
            return profile.location === value;
          }
          return true;
        });
      });
    }
    
    return profiles;
  }

  // Message methods
  async createMessage(message: InsertMessage): Promise<Message> {
    const id = this.messageId++;
    const newMessage: Message = { ...message, id, read: false, createdAt: new Date() };
    this.messagesData.set(id, newMessage);
    return newMessage;
  }

  async getMessagesBetweenUsers(user1Id: number, user2Id: number): Promise<Message[]> {
    return Array.from(this.messagesData.values())
      .filter(
        (message) =>
          (message.senderId === user1Id && message.recipientId === user2Id) ||
          (message.senderId === user2Id && message.recipientId === user1Id),
      )
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  async getUserConversations(userId: number): Promise<{userId: number, lastMessage: Message}[]> {
    const allMessages = Array.from(this.messagesData.values())
      .filter(message => message.senderId === userId || message.recipientId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    const conversations = new Map<number, Message>();
    
    for (const message of allMessages) {
      const otherUserId = message.senderId === userId ? message.recipientId : message.senderId;
      
      if (!conversations.has(otherUserId)) {
        conversations.set(otherUserId, message);
      }
    }
    
    return Array.from(conversations.entries()).map(([userId, lastMessage]) => ({
      userId,
      lastMessage
    }));
  }

  async markMessagesAsRead(senderId: number, recipientId: number): Promise<void> {
    const messages = Array.from(this.messagesData.values())
      .filter(message => message.senderId === senderId && message.recipientId === recipientId && !message.read);
    
    for (const message of messages) {
      const updatedMessage = { ...message, read: true };
      this.messagesData.set(message.id, updatedMessage);
    }
  }

  // Advanced methods
  async getUserWithProfile(userId: number): Promise<UserWithProfile | undefined> {
    const user = await this.getUser(userId);
    if (!user) return undefined;

    const influencerProfile = await this.getInfluencerProfile(userId);
    const brandProfile = await this.getBrandProfile(userId);

    return {
      ...user,
      influencerProfile,
      brandProfile
    };
  }
}

export const storage = new MemStorage();
