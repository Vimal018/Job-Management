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
    <div className="flex items-center justify-center py-4">
  <header className="w-[890px] h-[80px] bg-white border rounded-full shadow-[0_0_32px_0_#7F7F7F26] flex items-center justify-between px-8 max-w-[95%]">
    
    {/* Logo */}
    <div className="flex items-center">
      <img src="/image.png" alt="Logo" className="h-10 w-auto" />
    </div>

    {/* Navigation */}
<nav className="flex items-center gap-8 text-[#303030] font-semibold">
  {["Home", "Find Jobs", "Find Talents", "About us", "Testimonials"].map((item) => (
    <button
      key={item}
      className="relative px-2 py-2 font-medium text-[#303030] transition-all duration-300 rounded-md hover:bg-white hover:shadow-md active:scale-95 transform hover:translate-x-1 hover:translate-y-1"
    >
      {item}
    </button>
  ))}
</nav>




    {/* Create Job Button */}
    <div className="flex items-center">
     <button
          onClick={() => setShowForm(true)}
          className="text-white font-medium px-6 py-2 rounded-full transition-colors duration-300"
          style={{
            background: "linear-gradient(180deg, #A128FF 0%, #6100AD 113.79%)"
          }}
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
  <DialogContent className="!w-full !h-[549px] !max-w-3xl sm:p-6 p-4">
    <DialogTitle className="text-center text-xl font-semibold">Create Job Opening</DialogTitle>
    
      <JobForm onSubmit={handleJobSubmit} />

  </DialogContent>
</Dialog>


      {/* Jobs Grid */}
<section className="max-w-7xl mx-auto px-4 py-8 bg-gray-50 min-h-screen">
  {loading ? (
    <div className="flex items-center justify-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
  ) : filteredJobs.length === 0 ? (
    <div className="text-center py-20">
      <p className="text-gray-500 text-lg">No jobs found matching your criteria</p>
      <Button
        onClick={() => setFilteredJobs(jobs)}
        className="mt-4 bg-blue-500 hover:bg-blue-600"
      >
        Back to Home
      </Button>
    </div>
  ) : (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-max">
      {filteredJobs.map((job, index) => (
        <div key={`${job.company}-${job.title}-${index}`} className="flex justify-center">
          <JobCard job={job} />
        </div>
      ))}
    </div>
  )}
</section>
    </div>
  );
}