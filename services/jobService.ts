import { JobCard, ProductType, ApiResponse } from '../types';
import { META_API_TOKEN, META_PHONE_ID } from '../constants';

const STORAGE_KEY = 'sri_sai_jobs';
const ID_COUNTER_KEY = 'sri_sai_id_counter';

// Helper to simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getAllJobs = async (): Promise<JobCard[]> => {
  await delay(500); // Simulate API latency
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const createJob = async (
  data: Omit<JobCard, 'id' | 'createdAt' | 'status'>
): Promise<ApiResponse<JobCard>> => {
  try {
    // Generate ID
    let counter = parseInt(localStorage.getItem(ID_COUNTER_KEY) || '0', 10);
    counter += 1;
    localStorage.setItem(ID_COUNTER_KEY, counter.toString());
    
    // Format: SST-0001
    const id = `SST-${counter.toString().padStart(4, '0')}`;
    
    const newJob: JobCard = {
      ...data,
      id,
      createdAt: new Date().toISOString(),
      status: 'PENDING'
    };

    // Save to "DB"
    const currentJobs = await getAllJobs();
    const updatedJobs = [newJob, ...currentJobs];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedJobs));

    // Attempt automatic send (logging only/backend simulation)
    // We don't block UI on this since we switched back to manual send
    sendWhatsAppReceipt(newJob).catch(err => console.error("Auto-send log failed", err));

    return { success: true, data: newJob };
  } catch (error) {
    console.error("Failed to create job", error);
    return { success: false, error: "Failed to create job card." };
  }
};

// WhatsApp Integration (Backend Simulation / Optional Auto-send)
const sendWhatsAppReceipt = async (job: JobCard): Promise<void> => {
  const messageBody = `
🧾 *Your receipt from Sri Sai Technologies*

✨ Thank you for choosing us! We truly appreciate your trust.

*Job Details*
--------------------------------
🆔 *Job ID:* ${job.id}
📅 *Date:* ${new Date(job.createdAt).toLocaleString()}

👤 *Customer Details:*
Name: ${job.customerName}
Phone: ${job.phoneNumber}
Address: ${job.address}

🖥️ *Product Details:*
Product: ${job.productType}
Model: ${job.model}
Serial No: ${job.serialNumber || 'N/A'}

🛠️ *Issue Reported:*
${job.problemDescription}
--------------------------------

👷 Our expert technicians will take the utmost care of your device. We will update you as soon as the service is completed.

📞 For any queries, feel free to contact us.

Have a wonderful day! 🌟
*SRI SAI TECHNOLOGIES*
  `.trim();

  // 1. If API Keys are provided, send via Meta Graph API
  if (META_API_TOKEN && META_PHONE_ID) {
    try {
      console.log(`[WhatsApp API] Sending automatic message to ${job.phoneNumber}...`);
      
      // Sanitize phone number (remove +, spaces, etc)
      const sanitizedNumber = job.phoneNumber.replace(/[^0-9]/g, '');
      
      const response = await fetch(`https://graph.facebook.com/v17.0/${META_PHONE_ID}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${META_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: sanitizedNumber,
          type: 'text',
          text: { body: messageBody },
        }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        console.error('[WhatsApp API Error]', result);
      } else {
        console.log('[WhatsApp API Success]', result);
      }
    } catch (error) {
      console.error('[WhatsApp API Network Error]', error);
    }
  } 
  // 2. Fallback / Demo Mode (No keys provided)
  else {
    // Just log to console to show what would happen on a real backend
    console.log("------------------------------------------------");
    console.log("⚠️ WHATSAPP API KEYS MISSING IN constants.ts");
    console.log("Simulating automatic send to:", job.phoneNumber);
    console.log("MESSAGE CONTENT:");
    console.log(messageBody);
    console.log("------------------------------------------------");
  }
};

// Client-side helper to open WhatsApp with pre-filled message (Manual Send)
export const getWhatsAppLink = (job: JobCard): string => {
   const message = `
🧾 *Your receipt from Sri Sai Technologies*

Thank you for visiting us! Here is your service receipt:

🆔 *Job ID:* ${job.id}
📅 *Date:* ${new Date(job.createdAt).toLocaleDateString()}

👤 *Name:* ${job.customerName}
🖥️ *Device:* ${job.productType} - ${job.model}
🛠️ *Issue:* ${job.problemDescription}

We will notify you once the repair is done. Thank you for your patience! ✨

*SRI SAI TECHNOLOGIES*
  `.trim();
  
  // Encode for URL
  return `https://wa.me/${job.phoneNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
};