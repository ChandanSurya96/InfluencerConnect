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
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { 
  IndustryType,
  CompanyType,
  BudgetRange,
  BrandProfile
} from "@shared/schema";

// Extend the schema with client-side validation
const formSchema = z.object({
  companyType: z.string().min(1, "Company type is required"),
  industry: z.string().min(1, "Industry is required"),
  marketingGoals: z.string().optional(),
  budget: z.string().optional(),
  location: z.string().optional(),
  // Past campaigns would typically be handled with file uploads or URLs
});

export default function BrandProfileForm({ existingProfile }: { existingProfile?: BrandProfile }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyType: existingProfile?.companyType || "",
      industry: existingProfile?.industry || "",
      marketingGoals: existingProfile?.marketingGoals || "",
      budget: existingProfile?.budget || "",
      location: existingProfile?.location || "",
    },
  });
  
  const createProfileMutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      const endpoint = existingProfile ? "/api/profile/brand" : "/api/profile/brand";
      const method = existingProfile ? "PUT" : "POST";
      const res = await apiRequest(method, endpoint, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user/profile"] });
      toast({
        title: existingProfile ? "Profile updated" : "Profile created",
        description: existingProfile
          ? "Your brand profile has been updated successfully."
          : "Your brand profile has been created successfully.",
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
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Brand Profile</CardTitle>
        <CardDescription>
          Create or update your brand profile to help influencers find and connect with you.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="companyType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Type</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your company type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(CompanyType).map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
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
              name="industry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Industry</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your industry" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(IndustryType).map((industry) => (
                        <SelectItem key={industry} value={industry}>
                          {industry}
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
              name="marketingGoals"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Marketing Goals</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your marketing goals and what you're looking for in influencer partnerships"
                      className="resize-none"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="budget"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Budget Range</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your budget range" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(BudgetRange).map((budget) => (
                        <SelectItem key={budget} value={budget}>
                          {budget}
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
