import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { 
  CategoryType, 
  PlatformType,
  insertInfluencerProfileSchema,
  InfluencerProfile
} from "@shared/schema";

// Extend the schema with client-side validation
const formSchema = z.object({
  category: z.string().min(1, "Category is required"),
  platforms: z.array(z.string()).min(1, "At least one platform is required"),
  followerCount: z.string().min(1, "Follower count is required").transform(Number),
  engagementRate: z.string().optional(),
  pricing: z.string().optional(),
  location: z.string().optional(),
  // Portfolio would typically be handled with file uploads or URLs
});

export default function InfluencerProfileForm({ existingProfile }: { existingProfile?: InfluencerProfile }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(
    existingProfile?.platforms as string[] || []
  );
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: existingProfile?.category || "",
      platforms: existingProfile?.platforms as string[] || [],
      followerCount: existingProfile?.followerCount?.toString() || "",
      engagementRate: existingProfile?.engagementRate || "",
      pricing: existingProfile?.pricing || "",
      location: existingProfile?.location || "",
    },
  });
  
  const createProfileMutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      const endpoint = existingProfile ? "/api/profile/influencer" : "/api/profile/influencer";
      const method = existingProfile ? "PUT" : "POST";
      const res = await apiRequest(method, endpoint, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user/profile"] });
      toast({
        title: existingProfile ? "Profile updated" : "Profile created",
        description: existingProfile
          ? "Your influencer profile has been updated successfully."
          : "Your influencer profile has been created successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const onSubmit = (data: z.infer<typeof formSchema>) => {
    createProfileMutation.mutate(data);
  };
  
  const handlePlatformToggle = (platform: string) => {
    setSelectedPlatforms(prev => {
      const newPlatforms = prev.includes(platform)
        ? prev.filter(p => p !== platform)
        : [...prev, platform];
      
      form.setValue("platforms", newPlatforms);
      return newPlatforms;
    });
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Influencer Profile</CardTitle>
        <CardDescription>
          Create or update your influencer profile to help brands find and connect with you.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your content category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(CategoryType).map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="platforms"
              render={() => (
                <FormItem>
                  <FormLabel>Platforms</FormLabel>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {Object.values(PlatformType).map((platform) => (
                      <div key={platform} className="flex items-center space-x-2">
                        <Checkbox
                          id={platform}
                          checked={selectedPlatforms.includes(platform)}
                          onCheckedChange={() => handlePlatformToggle(platform)}
                        />
                        <label
                          htmlFor={platform}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {platform}
                        </label>
                      </div>
                    ))}
                  </div>
                  {form.formState.errors.platforms && (
                    <p className="text-sm font-medium text-destructive mt-2">
                      {form.formState.errors.platforms.message}
                    </p>
                  )}
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="followerCount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Follower Count</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="e.g. 10000"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="engagementRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Engagement Rate</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. 3.5%"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="pricing"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pricing Range</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. $500-$2,000"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. New York, USA"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <CardFooter className="px-0 pb-0">
              <Button 
                type="submit" 
                className="w-full"
                disabled={createProfileMutation.isPending}
              >
                {createProfileMutation.isPending ? "Saving..." : (existingProfile ? "Update Profile" : "Create Profile")}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
