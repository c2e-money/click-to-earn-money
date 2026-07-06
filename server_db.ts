import fs from 'fs';
import path from 'path';
import { User, ShortLink, Withdrawal } from './src/types';

interface DatabaseSchema {
  users: User[];
  links: ShortLink[];
  withdrawals: Withdrawal[];
  globalCpm: number;
}

const DB_FILE = path.join(process.cwd(), 'db.json');

// Helper to generate IDs
export function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

// Generate transaction ID: e.g. #CTE-XXXXX where X is uppercase alphanumeric
export function generateTransactionId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 5; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `#CTE-${result}`;
}

const defaultDb: DatabaseSchema = {
  users: [
    {
      id: 'admin-1',
      username: 'admin',
      email: 'dipenshorts@gmail.com',
      role: 'admin',
      isAdmin: true,
      password: 'Admin@123456',
      cpm: 5.00,
      balance: 152.50,
      totalClicks: 30500,
      createdAt: new Date().toISOString()
    },
    {
      id: 'admin-cte',
      username: 'cte_admin',
      email: 'admin@clicktoearn.com',
      role: 'admin',
      isAdmin: true,
      password: 'Admin@123456',
      cpm: 5.00,
      balance: 0.00,
      totalClicks: 0,
      createdAt: new Date().toISOString()
    },
    {
      id: 'user-1',
      username: 'john_doe',
      email: 'john@example.com',
      role: 'user',
      cpm: 5.00,
      balance: 12.40,
      totalClicks: 2480,
      createdAt: new Date().toISOString()
    }
  ],
  links: [
    {
      id: 'link-1',
      shortCode: 'best-crypto',
      originalUrl: 'https://bitcoin.org',
      userId: 'user-1',
      username: 'john_doe',
      clicksCount: 1420,
      createdAt: new Date().toISOString()
    },
    {
      id: 'link-2',
      shortCode: 'earn-passive',
      originalUrl: 'https://ethereum.org',
      userId: 'user-1',
      username: 'john_doe',
      clicksCount: 1060,
      createdAt: new Date().toISOString()
    }
  ],
  withdrawals: [
    {
      id: 'w-1',
      userId: 'user-1',
      username: 'john_doe',
      amount: 10.00,
      payoutMethod: 'PayPal',
      payoutDetails: 'john@example.com',
      status: 'Paid',
      transaction_id: '#CTE-TR8X1',
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
    },
    {
      id: 'w-2',
      userId: 'user-1',
      username: 'john_doe',
      amount: 5.00,
      payoutMethod: 'UPI',
      payoutDetails: 'john@upi',
      status: 'Approved',
      transaction_id: '#CTE-QP90A',
      createdAt: new Date(Date.now() - 86400000 * 1).toISOString()
    }
  ],
  globalCpm: 5.00
};

export function readDb(): DatabaseSchema {
  try {
    let db: DatabaseSchema;
    if (!fs.existsSync(DB_FILE)) {
      db = defaultDb;
      fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
    } else {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      db = JSON.parse(data);
    }

    // Auto-bootstrap default admin if it doesn't exist
    const adminEmail = 'admin@clicktoearn.com';
    const hasAdmin = db.users.some(u => u.email.toLowerCase() === adminEmail);
    if (!hasAdmin) {
      db.users.push({
        id: 'admin-cte',
        username: 'cte_admin',
        email: adminEmail,
        role: 'admin',
        isAdmin: true,
        password: 'Admin@123456',
        cpm: db.globalCpm || 5.00,
        balance: 0.00,
        totalClicks: 0,
        createdAt: new Date().toISOString()
      });
      fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
    } else {
      // Ensure existing admin has isAdmin: true and role: 'admin' and the correct password
      const adminUser = db.users.find(u => u.email.toLowerCase() === adminEmail);
      if (adminUser) {
        let changed = false;
        if (adminUser.role !== 'admin') {
          adminUser.role = 'admin';
          changed = true;
        }
        if (!adminUser.isAdmin) {
          adminUser.isAdmin = true;
          changed = true;
        }
        if (!adminUser.password || adminUser.password !== 'Admin@123456') {
          adminUser.password = 'Admin@123456';
          changed = true;
        }
        if (changed) {
          fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
        }
      }
    }

    // Also ensure dipenshorts@gmail.com has isAdmin and role: admin
    const dipenUser = db.users.find(u => u.email.toLowerCase() === 'dipenshorts@gmail.com');
    if (dipenUser) {
      let changed = false;
      if (dipenUser.role !== 'admin') {
        dipenUser.role = 'admin';
        changed = true;
      }
      if (!dipenUser.isAdmin) {
        dipenUser.isAdmin = true;
        changed = true;
      }
      if (changed) {
        fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
      }
    }

    return db;
  } catch (error) {
    console.error('Error reading database file, returning default schema:', error);
    return defaultDb;
  }
}

export function writeDb(db: DatabaseSchema): void {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing database file:', error);
  }
}
