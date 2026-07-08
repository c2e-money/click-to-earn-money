export interface User {
  uid: string;
  email: string;
  role: 'user' | 'admin';
  totalEarnings: number;
  totalClicks: number;
  balance: number;
  availableBalance: number;
  totalWithdrawn: number;
  createdAt: string;
  isBanned?: boolean;
  paymentMethod?: 'gpay' | 'phonepe';
  paymentMobileNumber?: string;
}

export interface ShortLink {
  id: string;
  shortCode: string;
  originalUrl: string;
  userId: string;
  totalClicks: number;
  createdAt: string;
  cpm: number; // CPM for this link or calculated
}

export interface ClickAnalytic {
  id: string;
  linkId: string;
  shortCode: string;
  timestamp: string;
  ipCountry: string;
  userAgent: string;
  earnings: number;
  referrer: string;
  ipAddress?: string;
  userId?: string;
}

export interface PlatformStats {
  totalClicks: number;
  totalEarnings: number;
  totalLinks: number;
  avgCpm: number;
  clicksOverTime: { date: string; clicks: number; earnings: number }[];
  countryStats: { name: string; value: number }[];
  referrerStats: { name: string; value: number }[];
}

export interface Withdrawal {
  id: string;
  userId: string;
  userEmail: string;
  amount: number;
  paymentMethod: 'gpay' | 'phonepe';
  paymentDetails: {
    mobileNumber?: string;
  };
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  referenceId?: string;
  createdAt: string;
  updatedAt?: string;
}

