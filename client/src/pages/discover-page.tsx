import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import SearchFilters, { SearchFilters as SearchFiltersType } from "@/components/search/search-filters";
import InfluencerCard from "@/components/search/influencer-card";
import BrandCard from "@/components/search/brand-card";
import { Button } from "@/components/ui/button";
import { Filter, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { UserRole } from "@shared/schema";

export default function DiscoverPage() {
  const { user } = useAuth();
  const defaultType = user?.role === UserRole.INFLUENCER ? "brands" : "influencers";
  const [searchFilters, setSearchFilters] = useState<SearchFiltersType>({
    type: defaultType,
    category: defaultType === "influencers" ? "all_categories" : undefined,
    platform: defaultType === "influencers" ? "all_platforms" : undefined,
    audienceSize: defaultType === "influencers" ? "any_size" : undefined,
    industry: defaultType === "brands" ? "all_industries" : undefined,
    budget: "any_budget",
    location: "worldwide"
  });
  
  // Get the appropriate endpoint based on filters
  const endpoint = searchFilters.type === "influencers" 
    ? "/api/discover/influencers" 
    : "/api/discover/brands";
  
  // Build query params based on filters
  const getQueryParams = () => {
    const params = new URLSearchParams();
    
    if (searchFilters.type === "influencers") {
      // Only add category parameter if it's not the "all" value
      if (searchFilters.category && searchFilters.category !== "all_categories") {
        params.append("category", searchFilters.category);
      }
      
      // Only add platform parameter if it's not the "all" value
      if (searchFilters.platform && searchFilters.platform !== "all_platforms") {
        params.append("platform", searchFilters.platform);
      }
      
      // Only add audience size parameter if it's not the "any" value
      if (searchFilters.audienceSize && searchFilters.audienceSize !== "any_size") {
        params.append("audienceSize", searchFilters.audienceSize);
      }
    } else {
      // Only add industry parameter if it's not the "all" value
      if (searchFilters.industry && searchFilters.industry !== "all_industries") {
        params.append("industry", searchFilters.industry);
      }
    }
    
    // Only add budget parameter if it's not the "any" value
    if (searchFilters.budget && searchFilters.budget !== "any_budget") {
      params.append("budget", searchFilters.budget);
    }
    
    // Only add location parameter if it's not the "worldwide" value
    if (searchFilters.location && searchFilters.location !== "worldwide") {
      params.append("location", searchFilters.location);
    }
    
    return params.toString();
  };
  
  // Fetch data
  const { data, isLoading, error } = useQuery({
    queryKey: [endpoint, getQueryParams()],
    queryFn: async ({ queryKey }) => {
      const url = `${queryKey[0]}${queryKey[1] ? `?${queryKey[1]}` : ''}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch data");
      return res.json();
    },
  });
  
  // Handle filter changes
  const handleFilterChange = (filters: SearchFiltersType) => {
    setSearchFilters(filters);
  };
  
  return (
    <div className="container mx-auto px-4 py-6 space-y-6 max-w-6xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Discover</h1>
          <p className="text-gray-500">
            Find {searchFilters.type === "influencers" ? "influencers" : "brands"} that match your needs
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />Filters
          </Button>
          <Button>
            <Search className="mr-2 h-4 w-4" />Search
          </Button>
        </div>
      </div>

      <SearchFilters 
        onFilterChange={handleFilterChange}
        initialFilters={searchFilters}
      />

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium">
            {isLoading 
              ? "Loading results..." 
              : error 
                ? "Error loading results" 
                : `${data?.length || 0} results found`}
          </h2>
          <div className="flex items-center">
            <span className="text-sm text-gray-500 mr-2">Sort by:</span>
            <select className="text-sm border-gray-300 rounded-md shadow-sm focus:border-primary-500 focus:ring-primary-500">
              <option>Relevance</option>
              <option>Followers: High to Low</option>
              <option>Price: Low to High</option>
              <option>Recently Active</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 p-4 rounded-md">
            <h3 className="text-lg font-semibold text-red-800">Error</h3>
            <p className="text-red-700 mt-2">
              There was an error loading the results. Please try again later.
            </p>
          </div>
        ) : data?.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 p-8 rounded-md text-center">
            <h3 className="text-lg font-semibold text-gray-800">No results found</h3>
            <p className="text-gray-700 mt-2">
              Try adjusting your filters to find more matches.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.map((item: any, index: number) => (
              searchFilters.type === "influencers" ? (
                <InfluencerCard key={index} influencer={item} />
              ) : (
                <BrandCard key={index} brand={item} />
              )
            ))}
          </div>
        )}

        {data && data.length > 0 && (
          <div className="flex justify-center mt-6">
            <nav className="relative z-0 inline-flex shadow-sm">
              <Button variant="outline" size="icon" className="rounded-l-md">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" className="rounded-none border-l-0">
                1
              </Button>
              <Button variant="outline" className="rounded-none border-l-0 bg-primary-50 text-primary-600">
                2
              </Button>
              <Button variant="outline" className="rounded-none border-l-0">
                3
              </Button>
              <Button disabled variant="outline" className="rounded-none border-l-0">
                ...
              </Button>
              <Button variant="outline" className="rounded-none border-l-0">
                8
              </Button>
              <Button variant="outline" size="icon" className="rounded-r-md border-l-0">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}
