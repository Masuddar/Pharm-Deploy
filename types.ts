
export enum UserRole {
  ADMIN = 'ADMIN',
  DOCTOR = 'DOCTOR',
  PHARMACIST = 'PHARMACIST',
  RECEPTIONIST = 'RECEPTIONIST'
}

export enum AppointmentStatus {
  BOOKED = 'BOOKED',
  CHECKED_IN = 'CHECKED_IN',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  availability: string;
  opdHours: string;
}

export interface Pharmacist {
  id: string;
  name: string;
  contact: string;
  shift: string;
  licenseNumber: string;
  username?: string;
  password?: string;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  visitHistory: string[];
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  time: string;
  status: AppointmentStatus;
}

export interface Medicine {
  id: string;
  name: string;
  category: string;
  manufacturer: string;
  batchNumber: string;
  expiryDate: string;
  purchasePrice: number;
  mrp: number;
  stock: number;
  threshold: number;
}

export interface Sale {
  id: string;
  medicineId: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  timestamp: string;
  prescriptionId?: string;
}

export interface PurchaseOrder {
  id: string;
  medicineName: string;
  quantity: number;
  supplier: string;
  status: 'PENDING' | 'ORDERED' | 'RECEIVED';
  orderDate: string;
}

export interface AnalyticsInsight {
  title: string;
  description: string;
  type: 'TREND' | 'ALERT' | 'OPPORTUNITY';
  confidence: number;
}
