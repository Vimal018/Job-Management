"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { jobFormSchema } from "@/lib/validators/job";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { ChevronDown } from "lucide-react";

type JobFormData = z.infer<typeof jobFormSchema>;

interface JobFormProps {
  onSubmit: (data: JobFormData) => void;
}

export default function JobForm({ onSubmit }: JobFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<JobFormData>({
    resolver: zodResolver(jobFormSchema),
  });

  const handleFormSubmit = (data: JobFormData) => {
    onSubmit(data);
    reset();
  };

  return (
    
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="space-y-6"
    >
        {/* space-y-6 w-full max-w-4xl mx-auto p-6 */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Job Title</label>
         <Input
  {...register("title")}
  placeholder="Full Stack Developer"
  className="border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-300"
/>

        </div>

        {/* Company */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Company Name</label>
          <Input
            {...register("company")}
            placeholder="Amazon, Microsoft, Swiggy"
            className="border border-gray-300 text-black placeholder:text-gray-400"
          />
        </div>

      
 {/* Location - Now as a text input */}
<div>
  <label className="block text-sm font-medium text-gray-600 mb-1">Location</label>
  <Input
    {...register("location")}
    placeholder="E.g. Chennai, Bangalore"
    className="border border-gray-300 text-black placeholder:text-gray-400"
  />
</div>


  {/* Job Type */}
  <div className="w-full">
    <label className="block text-sm font-medium text-gray-600 mb-1">Job Type</label>
    <Select onValueChange={(val) => setValue("jobType", val as any)}>
      <SelectTrigger className="w-full border border-gray-300 text-black placeholder:text-gray-400">
        <SelectValue placeholder="Select Job Type" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="Full-Time">Full-Time</SelectItem>
        <SelectItem value="Part-Time">Part-Time</SelectItem>
        <SelectItem value="Contract">Contract</SelectItem>
        <SelectItem value="Internship">Internship</SelectItem>
      </SelectContent>
    </Select>
  </div>
</div>


     {/* Salary Range and Application Deadline */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Salary Range
            </label>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                  ↑↓ ₹
                </span>
                <Input
                  className="pl-12 pr-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  type="number"
                  {...register("salaryMin", { valueAsNumber: true })}
                  placeholder=" 0"
                />
              </div>
              <div className="relative flex-1">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                  ↑↓ ₹
                </span>
                <Input
                  className="pl-12 pr-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  type="number"
                  {...register("salaryMax", { valueAsNumber: true })}
                  placeholder=" 12,00,000"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Application Deadline
            </label>
            <div className="relative">
              <Input
                type="date"
                {...register("applicationDeadline")}
                className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              
            </div>
          </div>
        </div>
      {/* Job Description */}
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">Job Description</label>
        <Textarea
          {...register("description")}
          placeholder="Please share a description to let the candidate know more about the job role"
          rows={5}
          className="border border-gray-300 text-black placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-300"
        />
      </div>
      {/* Job Requirements (Optional) */}
<div>
  <label className="block text-sm font-medium text-gray-600 mb-1">Job Requirements</label>
  <Textarea
    {...register("requirements")}
    placeholder="List the required qualifications, experience, or skills..."
    rows={4}
    className="border border-gray-300 text-black placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-300"
  />
</div>

{/* Job Responsibilities (Optional) */}
<div>
  <label className="block text-sm font-medium text-gray-600 mb-1">Job Responsibilities</label>
  <Textarea
    {...register("responsibilities")}
    placeholder="Outline the day-to-day responsibilities or expectations..."
    rows={4}
    className="border border-gray-300 text-black placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-300"
  />
</div>

      {/* Buttons */}
      <div className="pt-4 flex justify-between items-center">
        <Button
          variant="outline"
          className="border border-black px-4 py-2 flex items-center gap-2"
          type="button"
        >
          Save Draft <ChevronDown size={16} />
          
        </Button>

        <Button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded-md">
          Publish <span className="ml-1">»</span>
        </Button>
      </div>
    </form>
  );
}
