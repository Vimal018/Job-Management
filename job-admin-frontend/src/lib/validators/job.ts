// lib/validators/job.ts
import { z } from "zod";

export const jobFormSchema = z.object({
  title: z.string().min(1, "Job title is required"),
  company: z.string().min(1, "Company is required"),
  location: z.string().min(1, "Location is required"),
  jobType: z.enum(["Full-Time", "Part-Time", "Contract", "Internship"], ),
  salaryMin: z.number().min(0),
  salaryMax: z.number().min(0),
  applicationDeadline: z.string(), // ISO date string
  description: z.string().min(10, "Description too short"),
  requirements: z.string().min(10, "Requirements too short"),
  responsibilities: z.string().min(10, "Responsibilities too short"),
});
