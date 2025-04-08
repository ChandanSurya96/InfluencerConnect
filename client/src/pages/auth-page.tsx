import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { UserRole } from "@shared/schema";
import { motion } from "framer-motion";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Loader2, 
  UserCheck, 
  MailCheck, 
  TrendingUp, 
  DollarSign, 
  Users,
  Instagram,
  Youtube,
  Twitter,
  Facebook
} from "lucide-react";

// Login form schema
const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Registration form schema
const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  email: z.string().email("Please enter a valid email"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  role: z.enum([UserRole.INFLUENCER, UserRole.BRAND]),
  bio: z.string().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

// Animation variants
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({ 
    opacity: 1, 
    y: 0, 
    transition: { delay: i * 0.1, duration: 0.5 } 
  })
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } }
};

const socialsVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: (i: number) => ({ 
    scale: 1, 
    opacity: 1, 
    transition: { 
      delay: i * 0.15 + 0.5, 
      type: "spring", 
      stiffness: 200 
    } 
  })
};

export default function AuthPage() {
  const { user, loginMutation, registerMutation } = useAuth();
  const [, navigate] = useLocation();
  const [authTab, setAuthTab] = useState<string>("login");
  const [passwordVisible, setPasswordVisible] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  // Login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Register form
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      email: "",
      name: "",
      role: UserRole.INFLUENCER,
      bio: "",
    },
  });

  // Handle login form submission
  const onLoginSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(data);
  };

  // Handle register form submission
  const onRegisterSubmit = (data: RegisterFormValues) => {
    registerMutation.mutate(data);
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  // Features section items
  const features = [
    {
      icon: <UserCheck className="h-6 w-6" />,
      title: "Verified Profiles",
      description: "All profiles are reviewed and verified for authenticity"
    },
    {
      icon: <MailCheck className="h-6 w-6" />,
      title: "Direct Communication",
      description: "Message and negotiate with potential partners directly"
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Growth Analytics",
      description: "Track campaign performance and audience growth"
    },
    {
      icon: <DollarSign className="h-6 w-6" />,
      title: "Secure Payments",
      description: "Safe transactions between influencers and brands"
    }
  ];

  // Social platform icons
  const socialPlatforms = [
    { icon: <Instagram className="h-full w-full" />, color: "bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500" },
    { icon: <Youtube className="h-full w-full" />, color: "bg-red-600" },
    { icon: <Twitter className="h-full w-full" />, color: "bg-blue-400" },
    { icon: <Facebook className="h-full w-full" />, color: "bg-blue-600" }
  ];

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Animated background with gradient pattern */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50"></div>
        <div className="absolute top-0 left-0 w-full h-full opacity-30">
          <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
            <defs>
              <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(79, 70, 229, 0.1)" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        {/* Animated gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-gradient-to-br from-primary-300/20 to-purple-300/20 blur-3xl animate-blob"></div>
        <div className="absolute bottom-1/4 right-1/3 w-80 h-80 rounded-full bg-gradient-to-br from-primary-400/20 to-indigo-300/20 blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 right-1/4 w-72 h-72 rounded-full bg-gradient-to-br from-purple-400/20 to-primary-300/20 blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Left column - Forms */}
      <div className="flex-1 flex items-center justify-center p-4 lg:p-8 z-10">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={cardVariants}
        >
          <Card className="w-full max-w-md shadow-xl border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-center text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-indigo-600">
                CollabMatch
              </CardTitle>
              <CardDescription className="text-center text-gray-600">
                Connect influencers and brands for successful collaborations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs 
                value={authTab} 
                onValueChange={setAuthTab} 
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="login" className="text-sm md:text-base">Login</TabsTrigger>
                  <TabsTrigger value="register" className="text-sm md:text-base">Register</TabsTrigger>
                </TabsList>

                {/* Login Form */}
                <TabsContent value="login">
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeIn}
                  >
                    <Form {...loginForm}>
                      <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4 mt-4">
                        <FormField
                          control={loginForm.control}
                          name="username"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-700">Username</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Input 
                                    placeholder="Enter your username" 
                                    className="pl-10 bg-white/50 border-gray-300 focus:border-primary-500" 
                                    {...field} 
                                  />
                                  <Users className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={loginForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-700">Password</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Input 
                                    type={passwordVisible ? "text" : "password"} 
                                    placeholder="Enter your password" 
                                    className="pl-10 bg-white/50 border-gray-300 focus:border-primary-500" 
                                    {...field} 
                                  />
                                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                  </div>
                                  <button 
                                    type="button" 
                                    onClick={togglePasswordVisibility}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                  >
                                    {passwordVisible ? (
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7A9.97 9.97 0 014.02 8.971m5.858.908a3 3 0 114.243 4.243M9.878 9.88l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                      </svg>
                                    ) : (
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                      </svg>
                                    )}
                                  </button>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="flex justify-end">
                          <Button variant="link" className="p-0 h-auto text-sm text-gray-600 hover:text-primary-500">
                            Forgot password?
                          </Button>
                        </div>

                        <Button 
                          type="submit" 
                          className="w-full mt-6 bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
                          disabled={loginMutation.isPending}
                        >
                          {loginMutation.isPending ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Logging in...
                            </>
                          ) : "Login"}
                        </Button>
                      </form>
                    </Form>
                  </motion.div>
                </TabsContent>

                {/* Register Form */}
                <TabsContent value="register">
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeIn}
                  >
                    <Form {...registerForm}>
                      <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4 mt-4">
                        <FormField
                          control={registerForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-700">Full Name</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Enter your full name" 
                                  className="bg-white/50 border-gray-300 focus:border-primary-500" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={registerForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-700">Email</FormLabel>
                              <FormControl>
                                <Input 
                                  type="email" 
                                  placeholder="Enter your email" 
                                  className="bg-white/50 border-gray-300 focus:border-primary-500" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={registerForm.control}
                          name="username"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-700">Username</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Choose a username" 
                                  className="bg-white/50 border-gray-300 focus:border-primary-500" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={registerForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-700">Password</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Input 
                                    type={passwordVisible ? "text" : "password"} 
                                    placeholder="Choose a password" 
                                    className="bg-white/50 border-gray-300 focus:border-primary-500" 
                                    {...field} 
                                  />
                                  <button 
                                    type="button" 
                                    onClick={togglePasswordVisibility}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                  >
                                    {passwordVisible ? (
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7A9.97 9.97 0 014.02 8.971m5.858.908a3 3 0 114.243 4.243M9.878 9.88l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                      </svg>
                                    ) : (
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                      </svg>
                                    )}
                                  </button>
                                </div>
                              </FormControl>
                              <FormMessage />
                              <div className="text-xs text-gray-500 mt-1">
                                Password must be at least 6 characters long
                              </div>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={registerForm.control}
                          name="role"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-700">I am a</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="bg-white/50 border-gray-300 focus:border-primary-500">
                                    <SelectValue placeholder="Select your role" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value={UserRole.INFLUENCER}>
                                    <div className="flex items-center">
                                      <Instagram className="h-4 w-4 mr-2" />
                                      <span>Influencer</span>
                                    </div>
                                  </SelectItem>
                                  <SelectItem value={UserRole.BRAND}>
                                    <div className="flex items-center">
                                      <DollarSign className="h-4 w-4 mr-2" />
                                      <span>Brand</span>
                                    </div>
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={registerForm.control}
                          name="bio"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-700">Bio (Optional)</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="A brief description about yourself or your brand" 
                                  className="bg-white/50 border-gray-300 focus:border-primary-500" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button 
                          type="submit" 
                          className="w-full mt-6 bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
                          disabled={registerMutation.isPending}
                        >
                          {registerMutation.isPending ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Registering...
                            </>
                          ) : "Register"}
                        </Button>
                      </form>
                    </Form>
                  </motion.div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2 items-center justify-center text-sm text-gray-500">
              <div>
                {authTab === "login" ? (
                  <span>Don't have an account? <Button variant="link" className="p-0 h-auto font-semibold text-primary-600 hover:text-primary-700" onClick={() => setAuthTab("register")}>Register</Button></span>
                ) : (
                  <span>Already have an account? <Button variant="link" className="p-0 h-auto font-semibold text-primary-600 hover:text-primary-700" onClick={() => setAuthTab("login")}>Login</Button></span>
                )}
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      </div>

      {/* Right column - Hero section */}
      <div className="flex-1 bg-gradient-to-br from-primary-600 via-primary-700 to-indigo-700 p-8 hidden lg:flex flex-col justify-center text-white z-10 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <div className="absolute -right-40 -top-40 w-96 h-96 rounded-full border-8 border-white/10"></div>
          <div className="absolute -left-20 bottom-20 w-64 h-64 rounded-full border-8 border-white/10"></div>
          <div className="absolute right-20 bottom-10 w-40 h-40 rounded-full border-8 border-white/10"></div>
        </div>

        <motion.div 
          initial="hidden"
          animate="visible"
          className="max-w-lg mx-auto relative z-10"
        >
          <motion.h1 
            className="text-5xl font-bold mb-4 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100"
            variants={itemVariants}
            custom={0}
          >
            Connect, Collaborate, Create
          </motion.h1>
          <motion.p 
            className="text-xl mb-8 text-blue-100"
            variants={itemVariants}
            custom={1}
          >
            The premier platform for influencers and brands to find their perfect match and create incredible content together.
          </motion.p>
          
          <motion.div className="space-y-6 mt-12">
            {features.map((feature, index) => (
              <motion.div 
                key={index} 
                className="flex items-start space-x-4"
                variants={itemVariants}
                custom={index + 2}
              >
                <div className="bg-white/10 p-3 rounded-full">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p className="text-blue-100">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Social platforms */}
          <motion.div 
            className="flex space-x-4 mt-12"
            variants={fadeIn}
          >
            {socialPlatforms.map((platform, index) => (
              <motion.div 
                key={index} 
                className={`w-12 h-12 rounded-full ${platform.color} flex items-center justify-center text-white shadow-lg cursor-pointer hover:scale-110 transition-transform`}
                variants={socialsVariants}
                custom={index}
              >
                {platform.icon}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
