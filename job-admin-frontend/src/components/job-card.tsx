// src/components/job-card.tsx

import Image from "next/image";

interface JobCardProps {
  title: string;
  companyLogo: string;
  experience: string;
  type: string;
  salary: string;
  description: string;
  postedAgo: string;
}

export function JobCard({
  title,
  companyLogo,
  experience,
  type,
  salary,
  description,
  postedAgo,
}: JobCardProps) {
  return (
    <div className="bg-white shadow-md rounded-xl p-5 flex flex-col gap-3 relative">
      <span className="absolute top-3 right-3 bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full font-medium">
        {postedAgo}
      </span>
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 relative rounded-full overflow-hidden border">
          <Image src={companyLogo} alt={title} layout="fill" objectFit="contain" />
        </div>
        <div className="font-semibold text-lg">{title}</div>
      </div>
      <div className="text-sm text-gray-600 flex gap-3 flex-wrap">
        <span>👤 {experience}</span>
        <span>🏢 {type}</span>
        <span>💰 {salary}</span>
      </div>
      <ul className="text-gray-500 text-sm list-disc pl-5">
        {description.split(". ").map((line, i) => (
          <li key={i}>{line.trim()}</li>
        ))}
      </ul>
      <button className="mt-auto w-full py-2 bg-blue-500 text-white rounded-md text-sm font-medium hover:bg-blue-600 transition">
        Apply Now
      </button>
    </div>
  );
}
