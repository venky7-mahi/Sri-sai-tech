import React, { useState } from 'react';
import { ProductType, JobCard } from '../types';
import { createJob, getWhatsAppLink } from '../services/jobService';
import { CheckCircle, AlertCircle, Loader2, Send, ExternalLink } from 'lucide-react';

const RegistrationPage: React.FC = () => {
  const [formData, setFormData] = useState({
    customerName: '',
    phoneNumber: '',
    address: '',
    productType: ProductType.LAPTOP,
    model: '',
    serialNumber: '',
    problemDescription: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [successJob, setSuccessJob] = useState<JobCard | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // Basic Validation
    if (!formData.customerName || !formData.phoneNumber || !formData.address || !formData.model || !formData.problemDescription) {
      setError("Please fill in all required fields.");
      setIsLoading(false);
      return;
    }

    // Phone validation (simple check)
    if (formData.phoneNumber.length < 10) {
      setError("Please enter a valid phone number.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await createJob(formData);
      
      if (response.success && response.data) {
        setSuccessJob(response.data);
      } else {
        setError(response.error || "Something went wrong.");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSuccessJob(null);
    setFormData({
      customerName: '',
      phoneNumber: '',
      address: '',
      productType: ProductType.LAPTOP,
      model: '',
      serialNumber: '',
      problemDescription: ''
    });
    setError(null);
  };

  if (successJob) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="bg-green-600 px-6 py-8 text-center">
             <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                <CheckCircle className="h-10 w-10 text-green-600" />
             </div>
             <h2 className="text-3xl font-bold text-white">Job Created Successfully!</h2>
             <p className="text-green-100 mt-2">Job card #{successJob.id} has been saved.</p>
          </div>
          
          <div className="px-6 py-8">
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 mb-6">
              <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-4">
                <span className="text-sm text-gray-500">Job ID</span>
                <span className="text-2xl font-bold text-gray-900">{successJob.id}</span>
              </div>
              
              <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Customer</dt>
                  <dd className="mt-1 text-sm font-semibold text-gray-900">{successJob.customerName}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Phone</dt>
                  <dd className="mt-1 text-sm font-semibold text-gray-900">{successJob.phoneNumber}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Product</dt>
                  <dd className="mt-1 text-sm font-semibold text-gray-900">{successJob.productType}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Model</dt>
                  <dd className="mt-1 text-sm font-semibold text-gray-900">{successJob.model}</dd>
                </div>
                 <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">Problem</dt>
                  <dd className="mt-1 text-sm text-gray-900">{successJob.problemDescription}</dd>
                </div>
              </dl>
            </div>

            <div className="space-y-4">
              <a
                href={getWhatsAppLink(successJob)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center px-4 py-4 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-[#25D366] hover:bg-[#128C7E] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#25D366] transition-colors"
              >
                <ExternalLink className="-ml-1 mr-2 h-5 w-5" />
                Open WhatsApp to Send Receipt
              </a>
              
              <button
                onClick={handleReset}
                className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Register Another Customer
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-extrabold text-gray-900">Register Customer</h1>
        <p className="mt-2 text-gray-500">Create a new job card for service or sales.</p>
      </div>

      <div className="bg-white shadow rounded-xl overflow-hidden border border-gray-100">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {error && (
            <div className="rounded-md bg-red-50 p-4 flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Customer Details */}
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900 border-b pb-2 mb-4">Customer Details</h3>
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label htmlFor="customerName" className="block text-sm font-medium text-gray-700">Full Name *</label>
                <input
                  type="text"
                  name="customerName"
                  id="customerName"
                  required
                  value={formData.customerName}
                  onChange={handleInputChange}
                  className="mt-1 bg-white text-gray-900 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md border p-2.5"
                />
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Phone Number (WhatsApp) *</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 flex items-center">
                    <label htmlFor="country" className="sr-only">Country</label>
                  </div>
                  <input
                    type="tel"
                    name="phoneNumber"
                    id="phoneNumber"
                    required
                    placeholder="919999999999"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="bg-white text-gray-900 focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md border p-2.5"
                  />
                  <p className="mt-1 text-xs text-gray-500">Include country code (e.g., 91)</p>
                </div>
              </div>

              <div className="sm:col-span-6">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address *</label>
                <div className="mt-1">
                  <textarea
                    id="address"
                    name="address"
                    rows={3}
                    required
                    value={formData.address}
                    onChange={handleInputChange}
                    className="bg-white text-gray-900 shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md p-2.5"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900 border-b pb-2 mb-4">Product & Service Details</h3>
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label htmlFor="productType" className="block text-sm font-medium text-gray-700">Product Type *</label>
                <select
                  id="productType"
                  name="productType"
                  value={formData.productType}
                  onChange={handleInputChange}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white text-gray-900 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  {Object.values(ProductType).map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="model" className="block text-sm font-medium text-gray-700">Model Name/Number *</label>
                <input
                  type="text"
                  name="model"
                  id="model"
                  required
                  value={formData.model}
                  onChange={handleInputChange}
                  className="mt-1 bg-white text-gray-900 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md border p-2.5"
                />
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="serialNumber" className="block text-sm font-medium text-gray-700">Serial Number (Optional)</label>
                <input
                  type="text"
                  name="serialNumber"
                  id="serialNumber"
                  value={formData.serialNumber}
                  onChange={handleInputChange}
                  className="mt-1 bg-white text-gray-900 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md border p-2.5"
                />
              </div>

              <div className="sm:col-span-6">
                <label htmlFor="problemDescription" className="block text-sm font-medium text-gray-700">Problem Description / Service Required *</label>
                <div className="mt-1">
                  <textarea
                    id="problemDescription"
                    name="problemDescription"
                    rows={4}
                    required
                    value={formData.problemDescription}
                    onChange={handleInputChange}
                    className="bg-white text-gray-900 shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md p-2.5"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-5 border-t border-gray-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Clear Form
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                  Saving...
                </>
              ) : (
                <>
                  <Send className="-ml-1 mr-2 h-4 w-4" />
                  Create Job Card
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrationPage;