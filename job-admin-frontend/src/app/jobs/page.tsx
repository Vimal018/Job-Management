'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

interface Job {
  id: string;
  title: string;
  companyName: string;
  location: string;
  jobType: string;
  salary: string;
  applicationDeadline: string;
}

export default function JobListPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:3001/jobs')
      .then((res) => {
        setJobs(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching jobs:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="p-4">Loading jobs...</p>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Job Listings</h1>
      <div className="space-y-4">
        {jobs.map((job) => (
          <div key={job.id} className="border rounded-lg p-4 shadow-sm hover:shadow-md transition">
            <h2 className="text-xl font-semibold">{job.title}</h2>
            <p className="text-gray-700">{job.companyName} • {job.location}</p>
            <p className="text-sm">{job.jobType} • {job.salary}</p>
            <p className="text-sm text-gray-500">Apply by {new Date(job.applicationDeadline).toDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
