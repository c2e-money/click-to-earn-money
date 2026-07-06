export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
  isAdmin?: boolean;
  password?: string;
  cpm: number; // e.g. 5.00
  balance: number;
  totalClicks: number;
  createdAt: string;
  status?: 'Active' | 'Banned';
  isBanned?: boolean;
}

export interface ShortLink {
  id: string;
  shortCode: string;
  originalUrl: string;
  userId: string;
  username: string;
  clicksCount: number;
  createdAt: string;
}

export interface Withdrawal {
  id: string;
  userId: string;
  username: string;
  amount: number;
  payoutMethod: 'UPI' | 'PayPal' | 'Payeer' | 'USDT';
  payoutDetails: string;
  status: 'Pending' | 'Approved' | 'Paid';
  transaction_id: string; // unique reference code e.g. #CTE-XXXXX
  createdAt: string;
}

export interface DashboardStats {
  totalClicks: number;
  totalEarnings: number;
  averageCpm: number;
  linksCount: number;
}
