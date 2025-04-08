import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  CategoryType, 
  PlatformType, 
  AudienceSize, 
  BudgetRange, 
  IndustryType 
} from "@shared/schema";
import { Filter, Search } from "lucide-react";

export interface SearchFiltersProps {
  onFilterChange: (filters: SearchFilters) => void;
  initialFilters?: SearchFilters;
}

export interface SearchFilters {
  type: "influencers" | "brands";
  category?: string;
  platform?: string;
  audienceSize?: string;
  budget?: string;
  location?: string;
  industry?: string;
}

export default function SearchFilters({ onFilterChange, initialFilters }: SearchFiltersProps) {
  const defaultFilters: SearchFilters = {
    type: "influencers",
    category: "all_categories",
    platform: "all_platforms",
    audienceSize: "any_size",
    budget: "any_budget",
    location: "worldwide",
  };
  
  const [filters, setFilters] = useState<SearchFilters>(initialFilters || defaultFilters);
  
  // Update filters when initialFilters changes
  useEffect(() => {
    if (initialFilters) {
      setFilters(initialFilters);
    }
  }, [initialFilters]);

  const handleTypeChange = (type: "influencers" | "brands") => {
    let newFilters: SearchFilters;
    
    if (type === "influencers") {
      newFilters = {
        type,
        category: "all_categories",
        platform: "all_platforms",
        audienceSize: "any_size",
        budget: "any_budget",
        location: "worldwide",
        // Clear brand-specific fields
        industry: undefined
      };
    } else {
      newFilters = {
        type,
        industry: "all_industries",
        budget: "any_budget",
        location: "worldwide",
        // Clear influencer-specific fields
        category: undefined,
        platform: undefined,
        audienceSize: undefined
      };
    }
    
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleFilterChange = (key: keyof SearchFilters, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleResetFilters = () => {
    const defaultValues = {
      type: filters.type,
      category: filters.type === "influencers" ? "all_categories" : undefined,
      platform: filters.type === "influencers" ? "all_platforms" : undefined,
      audienceSize: filters.type === "influencers" ? "any_size" : undefined,
      industry: filters.type === "brands" ? "all_industries" : undefined,
      budget: "any_budget",
      location: "worldwide"
    };
    setFilters(defaultValues);
    onFilterChange(defaultValues);
  };

  const handleApplyFilters = () => {
    onFilterChange(filters);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
          <div className="flex rounded-md shadow-sm">
            <Button
              type="button"
              variant={filters.type === "influencers" ? "default" : "outline"}
              className={`flex-1 rounded-r-none ${filters.type === "influencers" ? "" : "border-r-0"}`}
              onClick={() => handleTypeChange("influencers")}
            >
              Influencers
            </Button>
            <Button
              type="button"
              variant={filters.type === "brands" ? "default" : "outline"}
              className="flex-1 rounded-l-none"
              onClick={() => handleTypeChange("brands")}
            >
              Brands
            </Button>
          </div>
        </div>

        {filters.type === "influencers" ? (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <Select 
                value={filters.category} 
                onValueChange={(value) => handleFilterChange("category", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all_categories">All Categories</SelectItem>
                  {Object.values(CategoryType).map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Platform</label>
              <Select 
                value={filters.platform} 
                onValueChange={(value) => handleFilterChange("platform", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Platforms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all_platforms">All Platforms</SelectItem>
                  {Object.values(PlatformType).map((platform) => (
                    <SelectItem key={platform} value={platform}>
                      {platform}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </>
        ) : (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
              <Select 
                value={filters.industry} 
                onValueChange={(value) => handleFilterChange("industry", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Industries" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all_industries">All Industries</SelectItem>
                  {Object.values(IndustryType).map((industry) => (
                    <SelectItem key={industry} value={industry}>
                      {industry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <Select 
                value={filters.location} 
                onValueChange={(value) => handleFilterChange("location", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Worldwide" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="worldwide">Worldwide</SelectItem>
                  <SelectItem value="us">United States</SelectItem>
                  <SelectItem value="europe">Europe</SelectItem>
                  <SelectItem value="asia">Asia</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )}
      </div>

      <div className={`mt-4 grid grid-cols-1 md:grid-cols-${filters.type === "influencers" ? "3" : "2"} gap-4`}>
        {filters.type === "influencers" && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Audience Size</label>
              <Select 
                value={filters.audienceSize} 
                onValueChange={(value) => handleFilterChange("audienceSize", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Any Size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any_size">Any Size</SelectItem>
                  {Object.values(AudienceSize).map((size) => (
                    <SelectItem key={size} value={size}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Budget Range</label>
          <Select 
            value={filters.budget} 
            onValueChange={(value) => handleFilterChange("budget", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Any Budget" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any_budget">Any Budget</SelectItem>
              {Object.values(BudgetRange).map((budget) => (
                <SelectItem key={budget} value={budget}>
                  {budget}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
          <Select 
            value={filters.location} 
            onValueChange={(value) => handleFilterChange("location", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Worldwide" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="worldwide">Worldwide</SelectItem>
              <SelectItem value="us">United States</SelectItem>
              <SelectItem value="europe">Europe</SelectItem>
              <SelectItem value="asia">Asia</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <Button 
          variant="outline" 
          onClick={handleResetFilters}
          className="mr-2"
        >
          <Filter className="mr-2 h-4 w-4" />
          Reset Filters
        </Button>
        <Button onClick={handleApplyFilters}>
          <Search className="mr-2 h-4 w-4" />
          Apply Filters
        </Button>
      </div>
    </div>
  );
}
