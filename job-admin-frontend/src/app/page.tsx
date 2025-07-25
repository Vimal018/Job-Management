"use client";

import { useEffect, useState } from "react";
import JobCard from "@/components/JobCard";
import JobForm from "@/components/JobForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import type { z } from "zod";
import { jobFormSchema } from "@/lib/validators/job";
import SearchFilters  from "@/components/SearchFilters";

type JobFormData = z.infer<typeof jobFormSchema> & {
  salaryRange?: string; // Add this to handle the actual API response
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default function LandingPage() {
  const [showForm, setShowForm] = useState(false);
  const [jobs, setJobs] = useState<JobFormData[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<JobFormData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/jobs`)
      .then((res) => res.json())
      .then((data) => {
        setJobs(data);
        setFilteredJobs(data);
        toast.success("Jobs loaded successfully");
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching jobs:", err);
        toast.error("Failed to load jobs");
        setLoading(false);
      });
  }, []);

  const handleJobSubmit = async (data: JobFormData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/jobs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, isPublished: true }),
      });

      if (!response.ok) throw new Error("Failed to post job");

      const newJob = await response.json();
      setJobs((prev) => [...prev, newJob]);
      setFilteredJobs((prev) => [...prev, newJob]);
      setShowForm(false);
      toast.success("Job successfully posted!");
    } catch (err) {
      toast.error("Error posting job");
      console.error(err);
    }
  };

  const handleSearch = (filters: {
    title: string;
    location: string;
    jobType: string;
    salaryRange: number[];
    applySalaryFilter: boolean;
  }) => {
    console.log("=== FILTER DEBUG START ===");
    console.log("All filters received:", filters);
    console.log("Total jobs before filtering:", jobs.length);
    
    let filtered = jobs;

    // Filter by title/company (case-insensitive) - only if there's a search term
    if (filters.title && filters.title.trim()) {
      const searchTerm = filters.title.toLowerCase().trim();
      console.log("Applying title filter:", searchTerm);
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(searchTerm) ||
          job.company.toLowerCase().includes(searchTerm)
      );
      console.log("After title filter:", filtered.length);
    }

    // Filter by location (case-insensitive) - only if location is specified
    if (filters.location && filters.location.trim()) {
      const locationTerm = filters.location.toLowerCase().trim();
      console.log("Applying location filter:", locationTerm);
      filtered = filtered.filter((job) =>
        job.location.toLowerCase().includes(locationTerm)
      );
      console.log("After location filter:", filtered.length);
    }

    // Filter by job type - only if job type is selected
    if (filters.jobType && filters.jobType.trim()) {
      console.log("Applying job type filter:", filters.jobType);
      filtered = filtered.filter((job) => {
        const jobTypeNormalized = job.jobType?.toLowerCase().replace(/[-_\s]/g, '-');
        const filterTypeNormalized = filters.jobType.toLowerCase();
        
        const matches = jobTypeNormalized === filterTypeNormalized || 
               job.jobType === filters.jobType ||
               job.jobType?.toLowerCase() === filters.jobType.toLowerCase();
        
        console.log(`Job: ${job.title}, JobType: "${job.jobType}", Filter: "${filters.jobType}", Match: ${matches}`);
        return matches;
      });
      console.log("After job type filter:", filtered.length);
    }

    // Filter by salary range - Only apply if user has actually used the salary filter
    if (filters.applySalaryFilter && filters.salaryRange && filters.salaryRange.length === 2) {
      const [minFilterMonthly, maxFilterMonthly] = filters.salaryRange; // These are in thousands per month
      console.log("=== SALARY FILTER DEBUG ===");
      console.log("Filter range (monthly thousands):", minFilterMonthly, "-", maxFilterMonthly);
      console.log("Apply salary filter:", filters.applySalaryFilter);
      
      filtered = filtered.filter((job) => {
        console.log(`\nJob: "${job.title}"`);
        
        // Handle the salaryRange format from backend: "₹50000 - ₹80000"
        let jobMaxSalaryAnnual = 0;
        
        if (job.salaryRange) {
          console.log(`  Raw salaryRange: "${job.salaryRange}"`);
          
          // Remove currency symbol (₹) and clean the string
          const cleanSalary = job.salaryRange.replace(/₹|,|\s/g, '');
          console.log(`  Cleaned: "${cleanSalary}"`);
          
          // Split by dash and convert to numbers
          const salaryParts = cleanSalary.split('-').map(s => parseInt(s.trim()));
          console.log(`  Parsed parts:`, salaryParts);
          
          if (salaryParts.length === 2 && !isNaN(salaryParts[1])) {
            // Take the maximum value from range
            jobMaxSalaryAnnual = Math.max(salaryParts[0], salaryParts[1]);
          } else if (salaryParts.length === 1 && !isNaN(salaryParts[0])) {
            // Single value
            jobMaxSalaryAnnual = salaryParts[0];
          }
          
          console.log(`  Max annual salary: ₹${jobMaxSalaryAnnual}`);
        } else {
          console.log(`  No salaryRange found for job: ${job.title}`);
          return false; // Skip jobs without salary info
        }
        
        // Convert annual salary to monthly salary in thousands
        // Annual salary / 12 months / 1000 = monthly in thousands
        const jobMaxSalaryMonthly = jobMaxSalaryAnnual / 12 / 1000;
        
        console.log(`  Monthly salary: ${jobMaxSalaryMonthly.toFixed(1)}k`);
        
        // Check if job's maximum monthly salary falls within the filter range
        const isWithinRange = jobMaxSalaryMonthly >= minFilterMonthly && jobMaxSalaryMonthly <= maxFilterMonthly;
        
        console.log(`  Comparison: ${jobMaxSalaryMonthly.toFixed(1)}k >= ${minFilterMonthly}k AND <= ${maxFilterMonthly}k = ${isWithinRange}`);
        
        return isWithinRange;
      });
      console.log("After salary filter:", filtered.length);
    }

    console.log("Final filtered jobs:", filtered.length);
    console.log("=== FILTER DEBUG END ===");
    
    setFilteredJobs(filtered);
  };

  return (
    <div className="bg-white min-h-screen">
    <div className="flex justify-center items-center py-6">
  <header className="bg-white-50 shadow-md rounded-full w-full max-w-4xl flex items-center px-6 py-3">
    
    {/* Logo */}
    <div className="w-1/6 flex justify-start items-center">
      <img src="/image.png" alt="Logo" className="h-10 w-auto" />
    </div>

    {/* Navigation */}
<nav className="w-1/2 flex justify-center items-center space-x-2">
  {["Home", "Find Jobs", "Find Talents", "About us", "Testimonials"].map((item) => (
    <button
      key={item}
      className="group relative px-5 py-2 font-medium text-gray-800 whitespace-nowrap transition-all duration-300"
    >
      {/* Hover background drop-down */}
      <span className="absolute inset-0 z-0 translate-y-[-6px] scale-95 opacity-0 rounded-xl bg-white shadow-lg transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100"></span>

      {/* Text follows hover drop */}
      <span className="relative z-10 transition-all duration-300 ease-out group-hover:translate-y-1 group-hover:text-black">
        {item}
      </span>
    </button>
  ))}
</nav>



    {/* Create Job Button */}
    <div className="w-1/3 flex justify-end">
      <button
        onClick={() => setShowForm(true)}
        className="bg-purple-700 hover:bg-purple-700 text-white font-medium px-6 py-2 rounded-full shadow whitespace-nowrap"
      >
        Create Jobs
      </button>
    </div>
  </header>
</div>


     {/* Search Filters */}
      <SearchFilters onSearch={handleSearch} />

      {/* Job Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
  <DialogContent className="!w-full !max-w-3xl sm:p-6 p-4">
    <DialogTitle className="text-center text-xl font-semibold">Create Job Opening</DialogTitle>

    {/* Scrollable container */}
    <div className="max-h-[80vh] overflow-y-auto mt-4 pr-2">
      <JobForm onSubmit={handleJobSubmit} />
    </div>
  </DialogContent>
</Dialog>


      {/* Jobs Grid */}
      <section className="max-w-7xl mx-auto px-6 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No jobs found matching your criteria</p>
            <Button
              onClick={() => setFilteredJobs(jobs)}
              className="mt-4 bg-purple-600 hover:bg-purple-700"
            >
              Back to Home
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredJobs.map((job, index) => (
              <JobCard key={`${job.company}-${job.title}-${index}`} job={job} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}