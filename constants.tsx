
import { Doctor, Medicine, Sale, Pharmacist } from './types';

export const MOCK_DOCTORS: Doctor[] = [
  { id: 'd1', name: 'Dr. Aarav Sharma', specialization: 'Cardiology', availability: 'Mon-Fri', opdHours: '09:00 AM - 01:00 PM' },
  { id: 'd2', name: 'Dr. Priya Patel', specialization: 'Dermatology', availability: 'Tue-Sat', opdHours: '10:00 AM - 02:00 PM' },
  { id: 'd3', name: 'Dr. Vihaan Gupta', specialization: 'Pediatrics', availability: 'Mon-Sat', opdHours: '04:00 PM - 08:00 PM' },
  { id: 'd4', name: 'Dr. Ananya Reddy', specialization: 'Gynecology', availability: 'Mon-Fri', opdHours: '11:00 AM - 03:00 PM' },
  { id: 'd5', name: 'Dr. Ishaan Kumar', specialization: 'General Physician', availability: 'Daily', opdHours: '08:00 AM - 09:00 PM' },
  { id: 'd6', name: 'Dr. Aditi Verma', specialization: 'Dentist', availability: 'Mon-Sat', opdHours: '02:00 PM - 07:00 PM' },
  { id: 'd7', name: 'Dr. Arjun Singh', specialization: 'Orthopedics', availability: 'Tue-Sun', opdHours: '05:00 PM - 09:00 PM' },
  { id: 'd8', name: 'Dr. Kavita Nair', specialization: 'ENT Specialist', availability: 'Mon-Fri', opdHours: '10:30 AM - 02:30 PM' },
  { id: 'd9', name: 'Dr. Rohan Mehta', specialization: 'Neurology', availability: 'Wed-Sat', opdHours: '11:00 AM - 04:00 PM' },
  { id: 'd10', name: 'Dr. Meera Joshi', specialization: 'Endocrinology', availability: 'Mon-Thu', opdHours: '09:00 AM - 12:00 PM' },
  { id: 'd11', name: 'Dr. Suresh Patil', specialization: 'Psychiatry', availability: 'Fri-Sun', opdHours: '10:00 AM - 02:00 PM' },
  { id: 'd12', name: 'Dr. Neha Kapoor', specialization: 'Ophthalmology', availability: 'Mon-Sat', opdHours: '03:00 PM - 07:00 PM' }
];

export const MOCK_PHARMACISTS: Pharmacist[] = [
  { id: 'ph1', name: 'Ramesh Gupta', contact: '9876543210', shift: 'Morning (8AM - 4PM)', licenseNumber: 'DL-PH-1001' },
  { id: 'ph2', name: 'Sita Verma', contact: '8765432109', shift: 'Evening (2PM - 10PM)', licenseNumber: 'DL-PH-1045' },
  { id: 'ph3', name: 'Vikram Singh', contact: '7654321098', shift: 'Night (10PM - 8AM)', licenseNumber: 'DL-PH-2022' },
];

export const MOCK_MEDICINES: Medicine[] = [
  { id: 'm1', name: 'Dolo 650mg', category: 'Analgesic', manufacturer: 'Micro Labs', batchNumber: 'DL-2024-X1', expiryDate: '2025-12-31', purchasePrice: 18, mrp: 32, stock: 850, threshold: 100 },
  { id: 'm2', name: 'Pan 40', category: 'Antacid', manufacturer: 'Alkem', batchNumber: 'PN-4022', expiryDate: '2024-10-15', purchasePrice: 85, mrp: 155, stock: 320, threshold: 50 },
  { id: 'm3', name: 'Azithral 500', category: 'Antibiotic', manufacturer: 'Alembic', batchNumber: 'AZ-5001', expiryDate: '2025-05-20', purchasePrice: 65, mrp: 119, stock: 150, threshold: 30 },
  { id: 'm4', name: 'Telma 40', category: 'Cardiac', manufacturer: 'Glenmark', batchNumber: 'TL-9901', expiryDate: '2025-06-20', purchasePrice: 180, mrp: 245, stock: 90, threshold: 20 },
  { id: 'm5', name: 'Augmentin 625 Duo', category: 'Antibiotic', manufacturer: 'GSK', batchNumber: 'AG-8821', expiryDate: '2024-08-10', purchasePrice: 160, mrp: 224, stock: 110, threshold: 25 },
  { id: 'm6', name: 'Shelcal 500', category: 'Supplements', manufacturer: 'Torrent', batchNumber: 'SH-1122', expiryDate: '2026-01-05', purchasePrice: 95, mrp: 135, stock: 400, threshold: 60 },
  { id: 'm7', name: 'Montair LC', category: 'Antihistamine', manufacturer: 'Cipla', batchNumber: 'MN-7721', expiryDate: '2025-03-12', purchasePrice: 120, mrp: 210, stock: 45, threshold: 20 },
  { id: 'm8', name: 'Glycomet GP 1', category: 'Antidiabetic', manufacturer: 'USV', batchNumber: 'GL-2201', expiryDate: '2024-11-30', purchasePrice: 50, mrp: 102, stock: 500, threshold: 80 },
  { id: 'm9', name: 'Ascoril LS Syrup', category: 'Cough Syrup', manufacturer: 'Glenmark', batchNumber: 'AS-9988', expiryDate: '2025-02-28', purchasePrice: 90, mrp: 135, stock: 75, threshold: 15 },
  { id: 'm10', name: 'Becosules Capsules', category: 'Supplements', manufacturer: 'Pfizer', batchNumber: 'BC-1102', expiryDate: '2025-09-15', purchasePrice: 35, mrp: 55, stock: 600, threshold: 100 },
  { id: 'm11', name: 'Thyronorm 50mcg', category: 'Thyroid', manufacturer: 'Abbott', batchNumber: 'TH-5022', expiryDate: '2025-07-20', purchasePrice: 110, mrp: 168, stock: 200, threshold: 40 },
  { id: 'm12', name: 'Combiflam', category: 'Analgesic', manufacturer: 'Sanofi', batchNumber: 'CF-2023', expiryDate: '2024-12-10', purchasePrice: 25, mrp: 48, stock: 350, threshold: 50 },
  { id: 'm13', name: 'Allegra 120mg', category: 'Antihistamine', manufacturer: 'Sanofi', batchNumber: 'AL-1201', expiryDate: '2026-03-01', purchasePrice: 140, mrp: 215, stock: 80, threshold: 20 },
  { id: 'm14', name: 'Omez 20mg', category: 'Antacid', manufacturer: 'Dr. Reddy\'s', batchNumber: 'OM-2021', expiryDate: '2025-04-15', purchasePrice: 40, mrp: 72, stock: 450, threshold: 60 },
  { id: 'm15', name: 'Sinarest', category: 'Cold & Flu', manufacturer: 'Centaur', batchNumber: 'SN-9090', expiryDate: '2025-01-30', purchasePrice: 45, mrp: 85, stock: 250, threshold: 50 },
  { id: 'm16', name: 'Volini Gel', category: 'Pain Relief', manufacturer: 'Sun Pharma', batchNumber: 'VL-50GM', expiryDate: '2026-06-30', purchasePrice: 95, mrp: 145, stock: 120, threshold: 25 },
  { id: 'm17', name: 'Neurobion Forte', category: 'Supplements', manufacturer: 'P&G Health', batchNumber: 'NB-2233', expiryDate: '2025-11-20', purchasePrice: 28, mrp: 45, stock: 400, threshold: 80 },
  { id: 'm18', name: 'Betadine Ointment', category: 'Antiseptic', manufacturer: 'Win-Medicare', batchNumber: 'BT-20GM', expiryDate: '2025-08-05', purchasePrice: 70, mrp: 110, stock: 90, threshold: 20 },
  { id: 'm19', name: 'Cetzine 10mg', category: 'Antihistamine', manufacturer: 'GSK', batchNumber: 'CT-1022', expiryDate: '2024-09-25', purchasePrice: 12, mrp: 22, stock: 600, threshold: 100 },
  { id: 'm20', name: 'Ecosprin 75', category: 'Cardiac', manufacturer: 'USV', batchNumber: 'EC-7521', expiryDate: '2025-10-10', purchasePrice: 3, mrp: 6, stock: 1000, threshold: 150 }
];

export const APP_THEME = {
  primary: '#0ea5e9',
  secondary: '#64748b',
  success: '#22c55e',
  danger: '#ef4444',
  warning: '#f59e0b',
};

// --- Helper to Generate Fake History for Demo ---
export const GENERATE_MOCK_SALES = (): Sale[] => {
  const sales: Sale[] = [];
  const now = new Date();
  
  // Generate sales for the last 7 days to populate charts
  for (let i = 0; i < 7; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Random number of sales per day (5 to 12)
    const dailySalesCount = Math.floor(Math.random() * 8) + 5; 
    
    for (let j = 0; j < dailySalesCount; j++) {
      const randomMed = MOCK_MEDICINES[Math.floor(Math.random() * MOCK_MEDICINES.length)];
      const qty = Math.floor(Math.random() * 3) + 1; // 1 to 3 items
      
      sales.push({
        id: `sale-${date.getTime()}-${j}`,
        medicineId: randomMed.id,
        quantity: qty,
        unitPrice: randomMed.mrp,
        totalAmount: randomMed.mrp * qty,
        timestamp: date.toISOString()
      });
    }
  }
  return sales;
};
