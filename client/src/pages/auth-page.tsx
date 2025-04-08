import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { UserRole } from "@shared/schema";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2, Users, Building, Video } from "lucide-react";

// Login form schema
const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Registration form schema
const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Please enter a valid email address"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Please confirm your password"),
  role: z.enum([UserRole.INFLUENCER, UserRole.BRAND], {
    required_error: "Please select a role",
  }),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const { user, loginMutation, registerMutation, isLoading } = useAuth();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("login");

  useEffect(() => {
    // Redirect to home if already logged in
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
      email: "",
      name: "",
      password: "",
      confirmPassword: "",
      role: undefined,
    },
  });

  // Handle login form submission
  function onLoginSubmit(data: LoginFormValues) {
    loginMutation.mutate(data);
  }

  // Handle registration form submission
  function onRegisterSubmit(data: RegisterFormValues) {
    registerMutation.mutate(data);
  }

  // If already logged in or loading auth data, don't render the form yet
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="container flex flex-col lg:flex-row mx-auto max-w-6xl">
        {/* Hero Content Section */}
        <div className="lg:w-1/2 px-6 lg:px-12 py-12 flex items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              <span className="text-primary-600">Collab</span>
              <span className="text-secondary-500">Connect</span>
            </h1>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Bridge the gap between creators and brands</h2>
            <p className="text-gray-600 mb-6">
              Our platform connects influencers with companies to create powerful marketing collaborations. 
              Build your profile, discover perfect matches, and communicate efficiently all in one place.
            </p>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="rounded-full bg-primary-100 p-2 mr-3">
                  <Users className="h-5 w-5 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Find the perfect match</h3>
                  <p className="text-sm text-gray-500">Discover partners that align with your brand values and audience</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="rounded-full bg-secondary-100 p-2 mr-3">
                  <Building className="h-5 w-5 text-secondary-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Streamlined communication</h3>
                  <p className="text-sm text-gray-500">Negotiate terms and manage campaigns through our secure messaging system</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="rounded-full bg-primary-100 p-2 mr-3">
                  <Video className="h-5 w-5 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Showcase your work</h3>
                  <p className="text-sm text-gray-500">Create a compelling profile to highlight your strengths and achievements</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Auth Forms Section */}
        <div className="lg:w-1/2 p-6 lg:p-12">
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-2xl text-center">
                Welcome to CollabConnect
              </CardTitle>
              <CardDescription className="text-center">
                {activeTab === "login" 
                  ? "Sign in to your account to continue" 
                  : "Create an account to get started"
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs 
                defaultValue="login" 
                value={activeTab} 
                onValueChange={setActiveTab} 
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="register">Register</TabsTrigger>
                </TabsList>
                
                {/* Login Form */}
                <TabsContent value="login">
                  <Form {...loginForm}>
                    <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                      <FormField
                        control={loginForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your username" {...field} />
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
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="Enter your password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button 
                        type="submit" 
                        className="w-full" 
                        disabled={loginMutation.isPending}
                      >
                        {loginMutation.isPending && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Sign In
                      </Button>
                    </form>
                  </Form>
                  <div className="mt-4 text-center text-sm">
                    <span className="text-gray-500">Don't have an account?</span>{" "}
                    <button 
                      onClick={() => setActiveTab("register")} 
                      className="text-primary-600 hover:underline"
                    >
                      Register
                    </button>
                  </div>
                </TabsContent>
                
                {/* Registration Form */}
                <TabsContent value="register">
                  <Form {...registerForm}>
                    <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                      <FormField
                        control={registerForm.control}
                        name="role"
                        render={({ field }) => (
                          <FormItem className="mb-6">
                            <FormLabel>I am a...</FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="grid grid-cols-2 gap-4"
                              >
                                <div className={`border rounded-lg p-4 cursor-pointer hover:shadow transition-shadow ${field.value === UserRole.INFLUENCER ? 'bg-primary-50 border-primary-200' : ''}`}>
                                  <RadioGroupItem
                                    value={UserRole.INFLUENCER}
                                    id="influencer"
                                    className="sr-only"
                                  />
                                  <div className="text-center mb-2">
                                    <div className="inline-flex items-center justify-center bg-primary-100 rounded-full p-2 mb-2">
                                      <Video className="h-5 w-5 text-primary-600" />
                                    </div>
                                  </div>
                                  <label
                                    htmlFor="influencer"
                                    className="block text-center cursor-pointer"
                                  >
                                    <div className="font-medium mb-1">Influencer</div>
                                    <div className="text-xs text-gray-500">Content creators and social media personalities</div>
                                  </label>
                                </div>
                                <div className={`border rounded-lg p-4 cursor-pointer hover:shadow transition-shadow ${field.value === UserRole.BRAND ? 'bg-secondary-50 border-secondary-200' : ''}`}>
                                  <RadioGroupItem
                                    value={UserRole.BRAND}
                                    id="brand"
                                    className="sr-only"
                                  />
                                  <div className="text-center mb-2">
                                    <div className="inline-flex items-center justify-center bg-secondary-100 rounded-full p-2 mb-2">
                                      <Building className="h-5 w-5 text-secondary-600" />
                                    </div>
                                  </div>
                                  <label
                                    htmlFor="brand"
                                    className="block text-center cursor-pointer"
                                  >
                                    <div className="font-medium mb-1">Brand</div>
                                    <div className="text-xs text-gray-500">Companies looking for promotion opportunities</div>
                                  </label>
                                </div>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={registerForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter your full name" {...field} />
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
                              <FormLabel>Username</FormLabel>
                              <FormControl>
                                <Input placeholder="Choose a username" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={registerForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="Enter your email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={registerForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Password</FormLabel>
                              <FormControl>
                                <Input 
                                  type="password" 
                                  placeholder="Create a password" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={registerForm.control}
                          name="confirmPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Confirm Password</FormLabel>
                              <FormControl>
                                <Input 
                                  type="password" 
                                  placeholder="Confirm your password" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full" 
                        disabled={registerMutation.isPending}
                      >
                        {registerMutation.isPending && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Create Account
                      </Button>
                    </form>
                  </Form>
                  <div className="mt-4 text-center text-sm">
                    <span className="text-gray-500">Already have an account?</span>{" "}
                    <button 
                      onClick={() => setActiveTab("login")} 
                      className="text-primary-600 hover:underline"
                    >
                      Sign In
                    </button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
