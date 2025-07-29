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
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Controller } from "react-hook-form";

type JobFormData = z.infer<typeof jobFormSchema>;

interface JobFormProps {
  onSubmit: (data: JobFormData) => void;
}

export default function JobForm({ onSubmit }: JobFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    control
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
       className="space-y-4"
    >
        {/* space-y-6 w-full max-w-4xl mx-auto p-6 */}

<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  {/* Job Title */}
  <div>
    <label
      className={`block text-sm font-medium mb-1 transition-colors ${
        watch("title")?.trim() ? "text-[#222222]" : "text-[#636363]"
      }`}
    >
      Job Title
    </label>
    <Input
      {...register("title")}
      placeholder="Full Stack Developer"
      className={`text-gray-900 placeholder:text-[#BCBCBC] transition-colors ${
        watch("title")?.trim() ? "border-[#222222]" : "border-[#BCBCBC]"
      }`}
    />
  </div>

  {/* Company Name */}
  <div>
    <label
      className={`block text-sm font-medium mb-1 transition-colors ${
        watch("company")?.trim() ? "text-[#222222]" : "text-[#636363]"
      }`}
    >
      Company Name
    </label>
    <Input
      {...register("company")}
      placeholder="Amazon, Microsoft, Swiggy"
      className={`text-black placeholder:text-[#BCBCBC] transition-colors ${
        watch("company")?.trim() ? "border-[#222222]" : "border-[#BCBCBC]"
      }`}
    />
  </div>

  {/* Location */}
  <div>
    <label
      className={`block text-sm font-medium mb-1 transition-colors ${
        watch("location")?.trim() ? "text-[#222222]" : "text-[#636363]"
      }`}
    >
      Location
    </label>
    <Input
      {...register("location")}
      placeholder="E.g. Chennai, Bangalore"
      className={`text-black placeholder:text-[#BCBCBC] transition-colors ${
        watch("location")?.trim() ? "border-[#222222]" : "border-[#BCBCBC]"
      }`}
    />
  </div>

 {/* Job Type */}
<div className="w-full">
  <label
    className={`block text-sm font-medium mb-1 transition-colors ${
      watch("jobType") ? "text-[#222222]" : "text-[#636363]"
    }`}
  >
    Job Type
  </label>
  <Select
    value={watch("jobType")}
    onValueChange={(val) =>
      setValue("jobType", val as any, { shouldValidate: true })
    }
  >
    <SelectTrigger
      className={`w-full transition-colors placeholder:text-[#BCBCBC] ${
        watch("jobType") ? "border-[#222222]" : "border-[#BCBCBC]"
      } border text-black`}
    >
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
            <label
            className={`block text-sm font-medium mb-2 transition-colors ${
              watch("salaryMin") || watch("salaryMax")
                ? "text-[#222222]"
                : "text-[#636363]"
            }`}
          >
            Salary Range
          </label>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#BCBCBC] text-sm">
                  ↑↓ ₹&nbsp;
                </span>
                <Input
                className={`pl-12 pr-4 py-3 rounded-lg text-gray-900 placeholder:text-[#BCBCBC] transition-colors autofill:bg-white ${
                  watch("salaryMin") ? "border-[#222222]" : "border-[#BCBCBC]"
                }`}
                type="number"
                {...register("salaryMin", { valueAsNumber: true })}
                placeholder="0"
              />
              </div>
              <div className="relative flex-1">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#BCBCBC] text-sm">
                  ↑↓ ₹&nbsp;
                </span>
                 <Input
                className={`pl-12 pr-4 py-3 rounded-lg text-gray-900 placeholder:text-[#BCBCBC] transition-colors autofill:bg-white ${
                  watch("salaryMax") ? "border-[#222222]" : "border-[#BCBCBC]"
                }`}
                type="number"
                {...register("salaryMax", { valueAsNumber: true })}
                placeholder="12,00,000"
              />
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end">
  <label
    className={`block text-sm font-medium mb-1 self-start transition-colors ${
      watch("applicationDeadline") ? "text-[#222222]" : "text-[#636363]"
    }`}
  >
    Application Deadline
  </label>
  <Controller
    name="applicationDeadline"
    control={control}
    render={({ field }) => (
      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={`w-full h-10 px-3 py-2 rounded-md text-left text-gray-900 relative bg-white hover:bg-gray-50 transition-colors pr-10
              ${watch("applicationDeadline") ? "border-[#222222]" : "border-[#BCBCBC]"} border`}
          >
            {field.value ? format(new Date(field.value), "dd MMM yyyy") : ""}
            <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
          </button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0 bg-white shadow-lg border border-gray-200 rounded-lg z-50"
          align="end"
        >
          <Calendar
            mode="single"
            selected={field.value ? new Date(field.value) : undefined}
            onSelect={(date) => field.onChange(date?.toISOString())}
            initialFocus
            disabled={(date) => date < new Date()}
            className="rounded-lg"
          />
        </PopoverContent>
      </Popover>
    )}
  />
</div>

        </div>
     {/* Job Description */}
      <div>
        <label
          className={`block text-sm font-medium mb-1 transition-colors ${
            watch("description")?.trim() ? "text-[#222222]" : "text-[#636363]"
          }`}
        >
          Job Description
        </label>
        <Textarea
          {...register("description")}
          placeholder="Please share a description to let the candidate know more about the job role"
          rows={5}
          className={`text-black placeholder:text-[#BCBCBC] transition-colors autofill:bg-white ${
            watch("description")?.trim() ? "border-[#222222]" : "border-[#BCBCBC]"
          }`}
        />
      </div>

      {/* Buttons */}
      <div className="pt-4 flex justify-between items-center">
        <Button
          variant="outline"
          className="border border-black px-4 py-2 flex items-center gap-2"
          type="button"
        >
          Save Draft 
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6,9 12,15 18,9"></polyline>
            <polyline points="6,15 12,21 18,15"></polyline>
          </svg>
        </Button>

        <Button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded-md">
          Publish <span className="ml-1">»</span>
        </Button>
      </div>
    </form>
  );
}
