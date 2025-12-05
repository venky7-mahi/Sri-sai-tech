export enum ProductType {
  LAPTOP = 'Laptop',
  PRINTER = 'Printer',
  CPU = 'CPU/Desktop',
  REFILLS = 'Toner/Cartridge Refill',
  OTHER = 'Other'
}

export interface JobCard {
  id: string;
  createdAt: string; // ISO string
  customerName: string;
  phoneNumber: string;
  address: string;
  productType: ProductType;
  model: string;
  serialNumber?: string;
  problemDescription: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'DELIVERED';
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}