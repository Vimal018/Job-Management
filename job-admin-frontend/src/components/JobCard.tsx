import React from "react";
import {
  Briefcase,
  MapPin,
  Layers,
  User2,
} from "lucide-react";



interface JobCardProps {
  job: any | {
    id: string  | number
    title: string
    companyLogo: string
    company: string
    experience: string
    type: string
    location: string
    salaryRange: string
    description: string
    requirements: string
    responsibilities: string
    createdAt: string
    logo?: string
    applicationDeadline: string
    salaryMin: number
    salaryMax: number};
}

const timeAgo = (createdAt: string) => {
  const created = new Date(createdAt);
  const now = new Date();
  const diffHours = Math.floor((now.getTime() - created.getTime()) / 3600000);
  return `${diffHours}h ago`;
};

const extractMaxLPA = (range: string): string => {
  const match = range?.match(/₹?(\d{5,7})/g);
  if (match && match.length > 1) {
    const max = parseInt(match[1].replace(/[₹,]/g, ""));
    return `${(max / 100000).toFixed(1)} LPA`;
  }
  return "";
};

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  return (
    <div className="w-full max-w-[320px] bg-white rounded-xl border shadow-sm p-4 space-y-3 hover:shadow-md transition">
      {/* Top Row */}
      <div className="flex justify-between items-start">
        {/* Logo */}
        <div className="w-10 h-10 rounded-md bg-gray-100 flex items-center justify-center overflow-hidden">
          {job.logo ? (
            <img src={job.logo} alt="Logo" className="object-contain w-full h-full" />
          ) : (
            <Briefcase className="text-gray-400" />
          )}
        </div>
        {/* Time */}
        {job.createdAt && (
          <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
            {timeAgo(job.createdAt)}
          </span>
        )}
      </div>

      {/* Job Title & Company */}
      <div>
        <h3 className="text-base font-semibold text-gray-900">{job.title}</h3>
        <p className="text-sm text-gray-500">{job.company}</p>
      </div>

      {/* Info Badges */}
      <div className="flex flex-wrap gap-3 text-sm text-gray-600">
        {job.experience && (
          <div className="flex items-center gap-1">
            <User2 className="w-4 h-4" />
            {job.experience}
          </div>
        )}
        {job.location && (
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            {job.location}
          </div>
        )}
        <div className="flex items-center gap-4 text-sm text-gray-800">
        {job.jobType && (
          <div className="flex items-center gap-1">
            <Briefcase className="w-4 h-4" />
            {job.jobType}
          </div>
        )}
        {job.salaryRange && (
          <div className="flex items-center gap-1">
            <Layers className="w-4 h-4" />
            ₹{extractMaxLPA(job.salaryRange)}
          </div>
        )}
      </div>
      </div>

      {/* Sections */}
      {job.description && (
        <div>
          <h4 className="font-medium text-sm mt-1">Description</h4>
          <ul className="list-disc list-inside text-sm text-gray-700">
            {job.description.split("\n").map((line: string, i: number) => (
              <li key={i}>{line}</li>
            ))}
          </ul>
        </div>
      )}

      {job.requirements && (
        <div>
          <h4 className="font-medium text-sm mt-1">Requirements</h4>
          <ul className="list-disc list-inside text-sm text-gray-700">
            {job.requirements.split("\n").map((line: string, i: number) => (
              <li key={i}>{line}</li>
            ))}
          </ul>
        </div>
      )}

      {job.responsibilities && (
        <div>
          <h4 className="font-medium text-sm mt-1">Responsibilities</h4>
          <ul className="list-disc list-inside text-sm text-gray-700">
            {job.responsibilities.split("\n").map((line: string, i: number) => (
              <li key={i}>{line}</li>
            ))}
          </ul>
        </div>
      )}

      {/* CTA */}
      <button
        onClick={() => alert(`Apply for ${job.title}`)}
        className="w-full mt-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-md py-2 transition"
      >
        Apply Now
      </button>
    </div>
  );
};

export default JobCard;
