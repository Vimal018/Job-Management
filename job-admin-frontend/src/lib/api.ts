import axios from "axios";
import { Job } from "@/types/job";

// Your backend API base URL
const API_BASE_URL = "http://localhost:3000"; // Update this if deployed

// Get all jobs
export const fetchJobs = async (): Promise<Job[]> => {
  const response = await axios.get(`${API_BASE_URL}/jobs`);
  return response.data;
};

// Get a single job by ID
export const fetchJobById = async (id: string): Promise<Job> => {
  const response = await axios.get(`${API_BASE_URL}/jobs/${id}`);
  return response.data;
};

// Create a new job
export const createJob = async (job: Omit<Job, "id" | "createdAt" | "updatedAt">) => {
  const response = await axios.post(`${API_BASE_URL}/jobs`, job);
  return response.data;
};

// Update a job
export const updateJob = async (id: string, job: Partial<Job>) => {
  const response = await axios.patch(`${API_BASE_URL}/jobs/${id}`, job);
  return response.data;
};

// Delete a job
export const deleteJob = async (id: string) => {
  const response = await axios.delete(`${API_BASE_URL}/jobs/${id}`);
  return response.data;
};
