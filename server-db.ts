import fs from "fs";
import path from "path";
import { User, ShortLink, ClickAnalytic, PlatformStats, Withdrawal } from "./src/types";

const DB_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DB_DIR, "clicktoearn.json");

interface DbSchema {
  users: (User & { passwordHash: string })[];
  links: ShortLink[];
  analytics: ClickAnalytic[];
  config?: { globalCpm: number };
  withdrawals?: Withdrawal[];
}

function ensureDb() {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    const initialData = generateSeedData();
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), "utf8");
  }
}

function generateSeedData(): DbSchema {
  const now = new Date();
  
  const daysAgo = (num: number) => {
    const d = new Date();
    d.setDate(now.getDate() - num);
    return d.toISOString();
  };

  // Pre-seed 2 accounts:
  // Admin: dipen8717@gmail.com / Dipen&Biswas 9101
  // User: user@clicktoearn.com / userpassword
  const seedUsers: (User & { passwordHash: string })[] = [
    {
      uid: "admin-uid-123",
      email: "dipen8717@gmail.com",
      role: "admin",
      totalEarnings: 342.50,
      totalClicks: 68500,
      balance: 125.40,
      availableBalance: 125.40,
      totalWithdrawn: 217.10,
      createdAt: daysAgo(30),
      isBanned: false,
      passwordHash: "Dipen&Biswas 9101" // Plaintext for our mock DB lookup
    },
    {
      uid: "user-uid-456",
      email: "user@clicktoearn.com",
      role: "user",
      totalEarnings: 0,
      totalClicks: 0,
      balance: 0,
      availableBalance: 0,
      totalWithdrawn: 0,
      createdAt: daysAgo(15),
      isBanned: false,
      passwordHash: "userpassword"
    }
  ];

  const seedLinks: ShortLink[] = [
    {
      id: "link-1",
      shortCode: "mega-files",
      originalUrl: "https://mega.nz/file/example123456",
      userId: "user-uid-456",
      totalClicks: 1240,
      createdAt: daysAgo(10),
      cpm: 4.50
    },
    {
      id: "link-2",
      shortCode: "premium-bypass",
      originalUrl: "https://github.com/bypass-premium-extension",
      userId: "user-uid-456",
      totalClicks: 850,
      createdAt: daysAgo(7),
      cpm: 5.00
    },
    {
      id: "link-3",
      shortCode: "adsterra-smart",
      originalUrl: "https://adsterra.com",
      userId: "admin-uid-123",
      totalClicks: 5200,
      createdAt: daysAgo(12),
      cpm: 6.00
    },
    {
      id: "link-4",
      shortCode: "gpt5-leak",
      originalUrl: "https://openai.com/blog/gpt-5-announcement-leak",
      userId: "user-uid-456",
      totalClicks: 15,
      createdAt: daysAgo(1),
      cpm: 5.50
    }
  ];

  // Let's generate seed click analytics
  const countries = ["United States", "India", "Germany", "United Kingdom", "Japan", "Brazil", "South Africa", "Canada"];
  const browsers = ["Chrome Mobile", "Safari Mobile", "Firefox Mobile", "Edge Mobile"];
  const devices = ["Mobile", "Tablet"];
  const referrers = ["Twitter / X", "YouTube Mobile", "Telegram App", "Facebook Group", "WhatsApp Link", "Direct"];

  const seedAnalytics: ClickAnalytic[] = [];
  
  // Fill in some historical analytics for the past 7 days to populate charts beautifully
  const totalSeeds = 150;
  for (let i = 0; i < totalSeeds; i++) {
    const daysOffset = Math.floor(Math.random() * 7);
    const date = daysAgo(daysOffset);
    const link = seedLinks[Math.floor(Math.random() * seedLinks.length)];
    const country = countries[Math.floor(Math.random() * countries.length)];
    const device = devices[Math.floor(Math.random() * devices.length)];
    const browser = browsers[Math.floor(Math.random() * browsers.length)];
    const referrer = referrers[Math.floor(Math.random() * referrers.length)];

    const userAgent = `Mozilla/5.0 (${device === "Mobile" ? "iPhone; CPU iPhone OS 16_5 like Mac OS X" : "iPad; CPU OS 16_5 like Mac OS X"}) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 ${browser}`;
    
    // CPM / 1000 = per-click earning
    const earnings = parseFloat((link.cpm / 1000).toFixed(4));

    seedAnalytics.push({
      id: `analytic-${i}`,
      linkId: link.id,
      shortCode: link.shortCode,
      timestamp: date,
      ipCountry: country,
      userAgent: userAgent,
      earnings: earnings,
      referrer: referrer
    });
  }

  const seedWithdrawals: Withdrawal[] = [
    {
      id: "with-1",
      userId: "user-uid-456",
      userEmail: "user@clicktoearn.com",
      amount: 20.00,
      paymentMethod: "gpay",
      paymentDetails: { mobileNumber: "9876543210" },
      status: "approved",
      referenceId: "UTR827492847",
      createdAt: daysAgo(5),
      updatedAt: daysAgo(4)
    },
    {
      id: "with-2",
      userId: "user-uid-456",
      userEmail: "user@clicktoearn.com",
      amount: 5.00,
      paymentMethod: "phonepe",
      paymentDetails: { mobileNumber: "9123456789" },
      status: "rejected",
      rejectionReason: "Invalid Traffic detected",
      createdAt: daysAgo(3),
      updatedAt: daysAgo(2)
    },
    {
      id: "with-3",
      userId: "user-uid-456",
      userEmail: "user@clicktoearn.com",
      amount: 10.00,
      paymentMethod: "gpay",
      paymentDetails: { mobileNumber: "9988776655" },
      status: "pending",
      createdAt: daysAgo(1)
    }
  ];

  return {
    users: seedUsers,
    links: seedLinks,
    analytics: seedAnalytics,
    withdrawals: seedWithdrawals
  };
}

export function readDb(): DbSchema {
  ensureDb();
  try {
    const data = fs.readFileSync(DB_FILE, "utf8");
    const parsed = JSON.parse(data) as DbSchema;
    if (!parsed.withdrawals) {
      parsed.withdrawals = [];
    }
    return parsed;
  } catch (err) {
    console.error("Error reading db:", err);
    return { users: [], links: [], analytics: [], withdrawals: [] };
  }
}

export function writeDb(db: DbSchema) {
  ensureDb();
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), "utf8");
  } catch (err) {
    console.error("Error writing db:", err);
  }
}

// User functions
export function getUser(uid: string): User | undefined {
  const db = readDb();
  const u = db.users.find(user => user.uid === uid);
  if (!u) return undefined;
  const { passwordHash, ...safeUser } = u;
  return safeUser;
}

export function getUserByEmail(email: string) {
  const db = readDb();
  return db.users.find(user => user.email.toLowerCase() === email.toLowerCase());
}

export function registerUser(email: string, passwordHash: string): User {
  const db = readDb();
  const newUser: User & { passwordHash: string } = {
    uid: "user-" + Math.random().toString(36).substr(2, 9),
    email: email.trim().toLowerCase(),
    role: "user",
    totalClicks: 0,
    totalEarnings: 0,
    availableBalance: 0,
    totalWithdrawn: 0,
    balance: 0,
    createdAt: new Date().toISOString(),
    isBanned: false,
    passwordHash: passwordHash
  };

  db.users.push(newUser);
  writeDb(db);

  const { passwordHash: _, ...safeUser } = newUser;
  return safeUser;
}

export function updateUser(uid: string, updates: Partial<User>) {
  const db = readDb();
  const idx = db.users.findIndex(u => u.uid === uid);
  if (idx === -1) return false;

  db.users[idx] = { ...db.users[idx], ...updates };
  writeDb(db);
  return true;
}

export function getAllUsersAdmin(): User[] {
  const db = readDb();
  return db.users.map(({ passwordHash, ...safeUser }) => safeUser);
}

// Links functions
export function getLinkByCode(shortCode: string): ShortLink | undefined {
  const db = readDb();
  return db.links.find(l => l.shortCode.toLowerCase() === shortCode.toLowerCase());
}

export function getLinksByUser(userId: string): ShortLink[] {
  const db = readDb();
  return db.links.filter(l => l.userId === userId);
}

export function getAllLinksAdmin(): ShortLink[] {
  const db = readDb();
  return db.links;
}

export function createLink(originalUrl: string, customCode: string | null, userId: string): ShortLink | null {
  const db = readDb();
  
  // Clean alias code or generate random code
  let shortCode = customCode ? customCode.trim().toLowerCase() : "";
  if (!shortCode) {
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 5; i++) {
      shortCode += chars.charAt(Math.floor(Math.random() * chars.length));
    }
  }

  // Double check uniqueness
  if (db.links.some(l => l.shortCode === shortCode)) {
    return null; // Code already taken
  }

  const newLink: ShortLink = {
    id: "link-" + Math.random().toString(36).substr(2, 9),
    shortCode,
    originalUrl,
    userId,
    totalClicks: 0,
    createdAt: new Date().toISOString(),
    cpm: parseFloat((4.00 + Math.random() * 2.0).toFixed(2)) // Standard $4.00 to $6.00 CPM
  };

  db.links.push(newLink);
  writeDb(db);
  return newLink;
}

export function updateLinkAdmin(id: string, originalUrl: string): boolean {
  const db = readDb();
  const link = db.links.find(l => l.id === id);
  if (!link) return false;
  link.originalUrl = originalUrl;
  writeDb(db);
  return true;
}

export function deleteLink(id: string, userId: string, isAdmin: boolean = false): boolean {
  const db = readDb();
  const linkIdx = db.links.findIndex(l => l.id === id);
  if (linkIdx === -1) return false;

  const link = db.links[linkIdx];
  if (!isAdmin && link.userId !== userId) {
    return false; // Not allowed
  }

  // Remove the link
  db.links.splice(linkIdx, 1);
  // Also clean up analytics
  db.analytics = db.analytics.filter(a => a.linkId !== id);
  
  writeDb(db);
  return true;
}

// System config helpers
export function getSystemConfig(): { globalCpm: number } {
  const db = readDb();
  if (!db.config) {
    db.config = { globalCpm: 5.00 };
    writeDb(db);
  }
  return db.config;
}

export function updateSystemConfig(globalCpm: number): { globalCpm: number } {
  const db = readDb();
  db.config = { globalCpm };
  writeDb(db);
  return db.config;
}

// Record Click analytic
export function recordClickAnalytic(
  shortCode: string, 
  ipCountry: string, 
  userAgent: string, 
  referrer: string,
  ipAddress: string = "127.0.0.1"
): { success: boolean; unpaid: boolean; reason?: string } {
  const db = readDb();
  const link = db.links.find(l => l.shortCode.toLowerCase() === shortCode.toLowerCase());
  if (!link) return { success: false, unpaid: true, reason: "Link not found" };

  // Verify if link owner is not banned
  const owner = db.users.find(u => u.uid === link.userId);
  if (owner && owner.isBanned) {
    return { success: false, unpaid: true, reason: "Account suspended" };
  }

  // Strict anti-fraud IP check: check rolling 24h count for this IP across all links of this owner
  const rollingLimitTime = new Date();
  rollingLimitTime.setHours(rollingLimitTime.getHours() - 24);
  const rollingLimitIso = rollingLimitTime.toISOString();

  const matchingViews = db.analytics.filter(a => 
    a.ipAddress === ipAddress && 
    a.userId === link.userId && 
    a.timestamp >= rollingLimitIso
  );

  if (matchingViews.length >= 2) {
    // Exceeded 2 views per owner from this IP in last 24h -> free/unpaid redirect
    return { success: true, unpaid: true };
  }

  // Get current global CPM rate from config
  const config = getSystemConfig();
  const globalCpm = config.globalCpm;
  const earnings = parseFloat((globalCpm / 1000).toFixed(4));

  // Add click record
  const clickId = "click-" + Math.random().toString(36).substr(2, 9);
  const click: ClickEvent = {
    timestamp: new Date().toISOString(),
    ipCountry: ipCountry || "Unknown",
    userAgent: userAgent || "Unknown",
    earnings: earnings,
    referrer: referrer || "Direct"
  };

  const newAnalytic: ClickAnalytic = {
    id: clickId,
    linkId: link.id,
    shortCode: link.shortCode,
    timestamp: click.timestamp,
    ipCountry: click.ipCountry,
    userAgent: click.userAgent,
    earnings: click.earnings,
    referrer: click.referrer,
    ipAddress: ipAddress,
    userId: link.userId
  };

  db.analytics.push(newAnalytic);

  // Increment link click count
  link.totalClicks += 1;

  // Increment user click, balance and total earnings
  if (owner) {
    owner.totalClicks += 1;
    owner.totalEarnings = parseFloat((owner.totalEarnings + earnings).toFixed(4));
    owner.balance = parseFloat((owner.balance + earnings).toFixed(4));
  }

  writeDb(db);
  return { success: true, unpaid: false };
}

interface ClickEvent {
  timestamp: string;
  ipCountry: string;
  userAgent: string;
  earnings: number;
  referrer: string;
}

// Aggregated metrics for individual dashboard (user stats)
export function getUserStats(userId: string): {
  totalClicks: number;
  totalEarnings: number;
  balance: number;
  activeLinksCount: number;
  avgCpm: number;
  clicksOverTime: { date: string; clicks: number; earnings: number }[];
  countryStats: { name: string; value: number }[];
  referrerStats: { name: string; value: number }[];
} {
  const db = readDb();
  const user = db.users.find(u => u.uid === userId);
  const userLinks = db.links.filter(l => l.userId === userId);
  const linkIds = new Set(userLinks.map(l => l.id));
  const userAnalytics = db.analytics.filter(a => linkIds.has(a.linkId));

  const totalClicks = user?.totalClicks || 0;
  const totalEarnings = user?.totalEarnings || 0;
  const balance = user?.balance || 0;
  const activeLinksCount = userLinks.length;

  const totalCpmSum = userLinks.reduce((acc, curr) => acc + curr.cpm, 0);
  const avgCpm = activeLinksCount > 0 ? parseFloat((totalCpmSum / activeLinksCount).toFixed(2)) : 5.00;

  // Setup rolling last 7 days metrics
  const now = new Date();
  const clicksOverTimeMap: Record<string, { clicks: number; earnings: number }> = {};
  
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(now.getDate() - i);
    const label = d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
    clicksOverTimeMap[label] = { clicks: 0, earnings: 0 };
  }

  const countriesMap: Record<string, number> = {};
  const referrersMap: Record<string, number> = {};

  userAnalytics.forEach((click) => {
    const clickDate = new Date(click.timestamp);
    const label = clickDate.toLocaleDateString(undefined, { month: "short", day: "numeric" });
    if (clicksOverTimeMap[label] !== undefined) {
      clicksOverTimeMap[label].clicks++;
      clicksOverTimeMap[label].earnings = parseFloat((clicksOverTimeMap[label].earnings + click.earnings).toFixed(4));
    }

    countriesMap[click.ipCountry] = (countriesMap[click.ipCountry] || 0) + 1;
    referrersMap[click.referrer] = (referrersMap[click.referrer] || 0) + 1;
  });

  const clicksOverTime = Object.keys(clicksOverTimeMap).map(date => ({
    date,
    clicks: clicksOverTimeMap[date].clicks,
    earnings: parseFloat(clicksOverTimeMap[date].earnings.toFixed(4))
  }));

  const mapToStatsArray = (map: Record<string, number>) => 
    Object.keys(map).map(name => ({ name, value: map[name] })).sort((a, b) => b.value - a.value);

  return {
    totalClicks,
    totalEarnings,
    balance,
    activeLinksCount,
    avgCpm,
    clicksOverTime,
    countryStats: mapToStatsArray(countriesMap),
    referrerStats: mapToStatsArray(referrersMap)
  };
}

// Global Aggregated metrics for Admin panel
export function getAdminStats(): PlatformStats {
  const db = readDb();
  
  const totalClicks = db.analytics.length;
  const totalEarnings = db.analytics.reduce((acc, curr) => acc + curr.earnings, 0);
  const totalLinks = db.links.length;
  const cpmSum = db.links.reduce((acc, curr) => acc + curr.cpm, 0);
  const avgCpm = totalLinks > 0 ? parseFloat((cpmSum / totalLinks).toFixed(2)) : 5.00;

  // Setup rolling last 7 days metrics
  const now = new Date();
  const clicksOverTimeMap: Record<string, { clicks: number; earnings: number }> = {};
  
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(now.getDate() - i);
    const label = d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
    clicksOverTimeMap[label] = { clicks: 0, earnings: 0 };
  }

  const countriesMap: Record<string, number> = {};
  const referrersMap: Record<string, number> = {};

  db.analytics.forEach((click) => {
    const clickDate = new Date(click.timestamp);
    const label = clickDate.toLocaleDateString(undefined, { month: "short", day: "numeric" });
    if (clicksOverTimeMap[label] !== undefined) {
      clicksOverTimeMap[label].clicks++;
      clicksOverTimeMap[label].earnings = parseFloat((clicksOverTimeMap[label].earnings + click.earnings).toFixed(4));
    }

    countriesMap[click.ipCountry] = (countriesMap[click.ipCountry] || 0) + 1;
    referrersMap[click.referrer] = (referrersMap[click.referrer] || 0) + 1;
  });

  const clicksOverTime = Object.keys(clicksOverTimeMap).map(date => ({
    date,
    clicks: clicksOverTimeMap[date].clicks,
    earnings: parseFloat(clicksOverTimeMap[date].earnings.toFixed(4))
  }));

  const mapToStatsArray = (map: Record<string, number>) => 
    Object.keys(map).map(name => ({ name, value: map[name] })).sort((a, b) => b.value - a.value);

  return {
    totalClicks,
    totalEarnings: parseFloat(totalEarnings.toFixed(2)),
    totalLinks,
    avgCpm,
    clicksOverTime,
    countryStats: mapToStatsArray(countriesMap),
    referrerStats: mapToStatsArray(referrersMap)
  };
}

// Withdrawal functions
export function getUserWithdrawals(userId: string): Withdrawal[] {
  const db = readDb();
  return (db.withdrawals || []).filter(w => w.userId === userId);
}

export function getAllWithdrawalsAdmin(): Withdrawal[] {
  const db = readDb();
  return db.withdrawals || [];
}

export function createWithdrawal(
  userId: string, 
  amount: number, 
  paymentMethod: 'gpay' | 'phonepe', 
  paymentDetails: any
): Withdrawal | null {
  const db = readDb();
  const user = db.users.find(u => u.uid === userId);
  if (!user) return null;

  if (user.balance < amount) {
    return null; // Insufficient balance
  }

  // Deduct from balance and save payment details
  user.balance = parseFloat((user.balance - amount).toFixed(4));
  user.paymentMethod = paymentMethod;
  user.paymentMobileNumber = paymentDetails.mobileNumber;

  const newWithdrawal: Withdrawal = {
    id: "with-" + Math.random().toString(36).substr(2, 9),
    userId,
    userEmail: user.email,
    amount,
    paymentMethod,
    paymentDetails,
    status: "pending",
    createdAt: new Date().toISOString()
  };

  if (!db.withdrawals) {
    db.withdrawals = [];
  }
  db.withdrawals.push(newWithdrawal);
  writeDb(db);
  return newWithdrawal;
}

export function updateWithdrawalStatus(
  id: string, 
  status: 'approved' | 'rejected', 
  reasonOrProof?: string
): boolean {
  const db = readDb();
  if (!db.withdrawals) return false;

  const withdrawal = db.withdrawals.find(w => w.id === id);
  if (!withdrawal) return false;
  if (withdrawal.status !== "pending") return false; // Already processed

  withdrawal.status = status;
  withdrawal.updatedAt = new Date().toISOString();

  if (status === "approved") {
    withdrawal.referenceId = reasonOrProof || "TXN" + Math.floor(Math.random() * 10000000);
  } else if (status === "rejected") {
    withdrawal.rejectionReason = reasonOrProof || "Invalid details";
    // Refund user
    const user = db.users.find(u => u.uid === withdrawal.userId);
    if (user) {
      user.balance = parseFloat((user.balance + withdrawal.amount).toFixed(4));
    }
  }

  writeDb(db);
  return true;
}

