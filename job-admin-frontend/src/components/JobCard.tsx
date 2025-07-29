import React from "react";
import { Briefcase, MapPin, Layers, User2 } from "lucide-react";

interface JobCardProps {
  job: any |{
    id: string | number;
    title: string;
    companyLogo?: string;
    company: string;
    domain?: string;
    experience: string;
    type: string;
    location: string;
    salaryRange: string;
    description: string;
    requirements?: string;
    responsibilities?: string;
    createdAt: string;
    applicationDeadline: string;
    salaryMin: number;
    salaryMax: number;
    logo?: string;
    jobType?: string;
  };
}

// Time Ago helper
const timeAgo = (createdAt: string) => {
  const created = new Date(createdAt);
  const now = new Date();
  const diffMs = now.getTime() - created.getTime();
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffHours / 24);
  return diffDays >= 1 ? `${diffDays} day${diffDays > 1 ? "s" : ""} Ago` : `${diffHours}h Ago`;
};

// LPA Extractor
const extractMaxLPA = (range: string): string => {
  const match = range?.match(/₹?(\d{5,7})/g);
  if (match && match.length > 1) {
    const max = parseInt(match[1].replace(/[₹,]/g, ""));
    return `${Math.round(max / 100000)}LPA`; // <-- No decimal
  }
  return "";
};



// Logo Resolver
const getCompanyLogo = (job: JobCardProps["job"]) => {
  if (typeof job.company === "string" && job.company.trim() !== "") {
    const sanitized = job.company
      .toLowerCase()
      .replace(/\s+/g, "")       // remove spaces
      .replace(/[^a-z]/g, "");   // remove special characters
    return `https://logo.clearbit.com/${sanitized}.com`;
  }

  return null;
};

const JobCard: React.FC<JobCardProps> = ({ job }) => {

return (     
<div className="w-[316px] h-[360px] rounded-[12px] bg-white shadow-[0px_0px_20px_0px_#7F7F7F26] p-5 flex flex-col justify-between ">      
   {/* Top Row */}       
   <div className="flex justify-between items-start">   
    <div className="w-12 h-12 rounded-[8px] bg-gray-100 flex items-center justify-center overflow-hidden">     
      {getCompanyLogo(job) ? (       
        <img  
            src={getCompanyLogo(job)!}  
            alt="Company Logo" className="object-contain w-full h-full"  
            onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}       
            />     
              ) : (       
                  <Briefcase className="text-gray-400 w-6 h-6" />     
                  )}   
      </div>    
      {job.createdAt && (     
        <span className="text-xs font-medium bg-[#B0D9FF] text-black px-3 py-1 rounded-full">       
        {timeAgo(job.createdAt)}     
        </span>   )} </div>      

        {/* Job Title */}     
         <h3 className="text-[20px] font-semibold text-black mt-3">{job.title}</h3>  
         <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2 text-sm text-[#5A5A5A]">   
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
          
          
          {job.jobType && (     
            <div className="flex items-center gap-1">       
              <Briefcase className="w-4 h-4" />       
                {job.jobType}     
            </div>  
          )}   
          
          {job.salaryRange && (     
            <div className="flex items-center gap-1">       
              <Layers className="w-4 h-4" />      
                 {extractMaxLPA(job.salaryRange)}    
             </div> 
           )} 
      </div>         
      
      
      {/* Sections */}       
      
      {job.description && (         
        <div>           
          {/* <h4 className="font-medium text-sm mt-1">Description</h4> */}          
           <ul className="text-sm text-[#555555] space-y-1 max-w-[280px]">
  {job.description.split("\n").map((line: string, i: number) => (
    <li key={i} className=" list-none relative before:content-['•'] before:absolute before:left-0 before:text-[#555555] before:mr-2 before:translate-y-[1px] pl-3">
      {line}
    </li>
  ))}
</ul>
      
         </div>       
        )}       
        
        
         {job.requirements && (         
          <div>           
            <h4 className="font-medium text-sm mt-1">Requirements</h4>          
               <ul className="list-disc list-inside text-sm text-gray-600 mt-3 space-y-1">  
                 {job.requirements?.split("\n").slice(0, 2).map((line: string, i: number) => (     
                  <li key={i}>{line}</li>   ))} </ul>         
             </div>       
          )}        
          
          {job.responsibilities && (         
            <div>           
              <h4 className="font-medium text-sm mt-1">Responsibilities</h4>           
              <ul className="list-disc list-inside text-sm text-gray-700">             
                {job.responsibilities?.split("\n").map((line: string, i: number) => (               
                  <li key={i}>{line}</li>             
                ))}          
              </ul>         
            </div>      
           )}       
           
           {/* CTA */}       
           
           <button   onClick={() => alert(`Apply for ${job.title}`)}   
              className="w-full mt-4 text-sm font-semibold bg-[#00AAFF]  text-white rounded-[8px] py-2 transition" >   
              Apply Now </button>      
            </div>   
  );
};

export default JobCard;
