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
import { toast } from "sonner";

type JobFormData = z.infer<typeof jobFormSchema>;

export default function CreateJobPage() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<JobFormData>({
    resolver: zodResolver(jobFormSchema),
  });

  const onSubmit = async (data: JobFormData, isPublished: boolean) => {
    try {
      const response = await fetch("http://localhost:3001/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, isPublished }),
      });

      if (!response.ok) throw new Error("Failed to create job");
      toast.success(isPublished ? "Job published!" : "Draft saved!");
    } catch {
      toast.error("Something went wrong.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-3xl p-8 bg-white rounded-2xl shadow-lg border border-gray-200">
        <h1 className="text-2xl font-semibold mb-6 text-center">Create Job Opening</h1>

        <form
          onSubmit={handleSubmit((data) => onSubmit(data, true))}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Job Title */}
            <div>
              <label className="block text-sm font-medium mb-1">Job Title</label>
              <Input
                {...register("title")}
                placeholder="Full Stack Developer"
                className="focus-visible:outline-black"
              />
            </div>

            {/* Company */}
            <div>
              <label className="block text-sm font-medium mb-1">Company Name</label>
              <Input
                {...register("company")}
                placeholder="Amazon, Microsoft, Swiggy"
                className="focus-visible:outline-black"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium mb-1">Location</label>
              <Select onValueChange={(val) => setValue("location", val)}>
                <SelectTrigger className="focus-visible:outline-black">
                  <SelectValue placeholder="Choose Preferred Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Chennai">Chennai</SelectItem>
                  <SelectItem value="Madurai">Madurai</SelectItem>
                  <SelectItem value="Remote">Remote</SelectItem>
                </SelectContent>
              </Select>
              {errors.location && (
                <p className="text-sm text-red-500">{errors.location.message}</p>
              )}
            </div>

            {/* Job Type */}
            <div>
              <label className="block text-sm font-medium mb-1">Job Type</label>
              <Select onValueChange={(val) => setValue("jobType", val as any, { shouldValidate: true })}>
                <SelectTrigger className="focus-visible:outline-black">
                  <SelectValue placeholder="FullTime" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Full-Time">Full-Time</SelectItem>
                  <SelectItem value="Part-Time">Part-Time</SelectItem>
                  <SelectItem value="Contract">Contract</SelectItem>
                  <SelectItem value="Internship">Internship</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Salary Range */}
            <div className="col-span-full md:col-span-2">
              <label className="block text-sm font-medium mb-1">Salary Range</label>
              <div className="flex gap-4">
                <div className="relative w-full">
                  <span className="absolute left-3 top-2.5 text-gray-500">₹</span>
                  <Input
                    className="pl-7 focus-visible:outline-black"
                    type="number"
                    {...register("salaryMin", { valueAsNumber: true })}
                    placeholder="0"
                  />
                </div>
                <div className="relative w-full">
                  <span className="absolute left-3 top-2.5 text-gray-500">₹</span>
                  <Input
                    className="pl-7 focus-visible:outline-black"
                    type="number"
                    {...register("salaryMax", { valueAsNumber: true })}
                    placeholder="12,00,000"
                  />
                </div>
              </div>
            </div>

            {/* Deadline */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Application Deadline</label>
              <Input
                type="date"
                {...register("applicationDeadline")}
                className="focus-visible:outline-black"
              />
            </div>
          </div>

          {/* Job Description */}
          <div>
            <label className="block text-sm font-medium mb-1">Job Description</label>
            <Textarea
              {...register("description")}
              placeholder="Please share a description to let the candidate know more about the job role"
              rows={5}
              className="focus-visible:outline-black"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-between pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleSubmit((data) => onSubmit(data, false))}
              className="border border-black text-black px-6"
            >
              Save Draft ↓
            </Button>
            <Button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-6">
              Publish →
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
