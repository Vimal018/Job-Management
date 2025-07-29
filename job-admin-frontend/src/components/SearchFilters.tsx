"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/Slider";
import { SearchIcon, MapPinIcon, UsersIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SearchFiltersProps {
  onSearch?: (filters: {
    title: string;
    location: string;
    jobType: string;
    salaryRange: number[];
    applySalaryFilter: boolean; // New flag to indicate if salary filter should be applied
  }) => void;
}

// Set to full range to show all jobs by default
const DEFAULT_SALARY_RANGE = [50, 80];

export default function SearchFilters({ onSearch }: SearchFiltersProps) {
  const [searchTitle, setSearchTitle] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");
  const [salaryRange, setSalaryRange] = useState(DEFAULT_SALARY_RANGE);
  const [salaryTouched, setSalaryTouched] = useState(false); // Track if user has interacted with salary

  const isFiltered =
    searchTitle !== "" ||
    location !== "" ||
    jobType !== "" ||
    salaryTouched; // Only consider filtered if user has actually moved the slider

  const handleFiltersChange = () => {
    onSearch?.({
      title: searchTitle,
      location,
      jobType,
      salaryRange,
      applySalaryFilter: salaryTouched, // Only apply salary filter if user has touched it
    });
  };

  const handleSalaryChange = (value: number[]) => {
    setSalaryRange(value);
    setSalaryTouched(true); // Mark as touched when user moves slider
  };

  const handleClearFilters = () => {
    setSearchTitle("");
    setLocation("");
    setJobType("");
    setSalaryRange(DEFAULT_SALARY_RANGE);
    setSalaryTouched(false); // Reset touched state

    // Call onSearch with cleared values
    onSearch?.({
      title: "",
      location: "",
      jobType: "",
      salaryRange: DEFAULT_SALARY_RANGE,
      applySalaryFilter: false, // Don't apply salary filter when cleared
    });
  };

  // Call onSearch whenever filters change
  useEffect(() => {
    handleFiltersChange();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTitle, location, jobType, salaryRange, salaryTouched]);
  
return (
  <div className="px-2 py-4">
    <div className="max-w-8xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-2">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          {/* Search Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              type="text"
              placeholder="Search By Job Title, Role"
              value={searchTitle}
              onChange={(e) => setSearchTitle(e.target.value)}
              className="pl-12 h-14 border-0 bg-transparent text-gray-900 placeholder:text-[#686868] focus:ring-0 focus:border-0 rounded-xl"
            />
          </div>

          {/* Location Input */}
          <div className="relative border-l border-gray-200">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
              <MapPinIcon className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              type="text"
              placeholder="Preferred Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="pl-12 h-14 border-0 bg-transparent text-gray-900 placeholder:text-[#686868] focus:ring-0 focus:border-0 rounded-xl"
            />
          </div>

          {/* Job Type Select */}
          <div className="relative border-l border-gray-200 px-4 py-4">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
              <UsersIcon className="h-5 w-5 text-gray-400" />
            </div>
            <Select
              value={jobType}
              onValueChange={(value) => setJobType(value)}
            >
              <SelectTrigger className="pl-12 h-6 border-0 bg-transparent text-gray-900 focus:ring-0 focus:border-0 rounded-xl">
                <SelectValue placeholder="Job type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full-time">Full Time</SelectItem>
                <SelectItem value="part-time">Part Time</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
                <SelectItem value="internship">Internship</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Salary Range */}
          <div className="relative border-l border-gray-200 px-4 py-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[#222222] text-sm font-medium">
                Salary Per Month
              </span>
              <span className="text-gray-900 font-semibold text-sm">
                ₹{salaryRange[0]}k - ₹{salaryRange[1]}k
              </span>
            </div>
            <Slider
              value={salaryRange}
              onValueChange={handleSalaryChange} // Use the new handler
              max={150}
              min={10}
              step={5}
              className="w-full"
            />
          </div>
        </div>

        {/* Clear Filter outside the grid */}
        {isFiltered && (
          <div className="flex justify-end mt-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
              className="text-gray-500 hover:text-red-600 px-2"
            >
              <XIcon className="w-4 h-4 mr-1" />
              <span>Clear Filters</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  </div>
);

}