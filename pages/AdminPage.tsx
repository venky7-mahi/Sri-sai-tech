import React, { useState, useEffect } from 'react';
import { getAllJobs } from '../services/jobService';
import { JobCard } from '../types';
import { Search, FileText, Smartphone, Calendar } from 'lucide-react';

const AdminPage: React.FC = () => {
  const [jobs, setJobs] = useState<JobCard[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<JobCard[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Load data immediately as route is now protected
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await getAllJobs();
      setJobs(data);
      setFilteredJobs(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  // Handle Search
  useEffect(() => {
    const lower = searchTerm.toLowerCase();
    const filtered = jobs.filter(job => 
      job.id.toLowerCase().includes(lower) ||
      job.customerName.toLowerCase().includes(lower) ||
      job.phoneNumber.includes(lower)
    );
    setFilteredJobs(filtered);
  }, [searchTerm, jobs]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
           <h1 className="text-2xl font-bold text-gray-900">Job Cards Dashboard</h1>
           <p className="text-gray-500 text-sm mt-1">Manage all service requests.</p>
        </div>
        
        <div className="relative w-full md:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 border"
            placeholder="Search by ID, Name or Phone"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden rounded-lg border border-gray-200">
        {loading ? (
          <div className="p-12 text-center text-gray-500">Loading...</div>
        ) : filteredJobs.length === 0 ? (
          <div className="p-12 text-center text-gray-500">No job cards found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Job ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product / Model
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Problem
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredJobs.map((job) => (
                  <tr key={job.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 text-blue-500 mr-2" />
                        <span className="text-sm font-medium text-blue-600">{job.id}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{job.customerName}</div>
                      <div className="text-sm text-gray-500 flex items-center gap-1">
                        <Smartphone className="h-3 w-3" /> {job.phoneNumber}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{job.productType}</div>
                      <div className="text-sm text-gray-500">{job.model}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 truncate max-w-xs" title={job.problemDescription}>
                        {job.problemDescription}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 flex items-center gap-1">
                         <Calendar className="h-3 w-3" />
                         {new Date(job.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        {job.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;