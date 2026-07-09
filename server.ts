import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { 
  readDb,
  writeDb,
  getUser,
  getUserByEmail,
  registerUser,
  updateUser,
  getAllUsersAdmin,
  getLinkByCode,
  getLinksByUser,
  getAllLinksAdmin,
  createLink,
  updateLinkAdmin,
  deleteLink,
  recordClickAnalytic,
  getUserStats,
  getAdminStats,
  getSystemConfig,
  updateSystemConfig,
  getUserWithdrawals,
  getAllWithdrawalsAdmin,
  createWithdrawal,
  updateWithdrawalStatus
} from "./server-db";

const app = express();
const PORT = 3000;

app.use(express.json());

// Auth Helper Middleware
function getAuthUser(req: express.Request) {
  const uid = req.headers["x-user-uid"] as string;
  if (!uid) return null;
  return getUser(uid);
}

function requireAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  const user = getAuthUser(req);
  if (!user || user.role !== "admin") {
    return res.status(403).json({ error: "Access denied. Administrative privilege required." });
  }
  next();
}

function requireAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
  const user = getAuthUser(req);
  if (!user) {
    return res.status(401).json({ error: "Access denied. Authentication required." });
  }
  if (user.isBanned) {
    return res.status(403).json({ error: "This account has been administratively suspended." });
  }
  next();
}

// ==========================================
// AUTHENTICATION ENDPOINTS
// ==========================================

app.post("/api/auth/register", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const existing = getUserByEmail(email);
  if (existing) {
    return res.status(400).json({ error: "An account with this email already exists" });
  }

  try {
    const user = registerUser(email, password);
    res.status(201).json({ user });
  } catch (err) {
    res.status(500).json({ error: "Registration failed" });
  }
});

app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const user = getUserByEmail(email);
  if (!user || user.passwordHash !== password) {
    return res.status(400).json({ error: "Invalid email or password" });
  }

  if (user.isBanned) {
    return res.status(403).json({ error: "Your account is banned. Contact admin@clicktoearn.com." });
  }

  const { passwordHash, ...safeUser } = user;
  res.json({ user: safeUser });
});

app.get("/api/auth/me", requireAuth, (req, res) => {
  const user = getAuthUser(req);
  res.json({ user });
});

// ==========================================
// USER SHORTENER & LINKS ENDPOINTS
// ==========================================

app.get("/api/user/stats", requireAuth, (req, res) => {
  const user = getAuthUser(req)!;
  const stats = getUserStats(user.uid);
  res.json(stats);
});

app.get("/api/links", requireAuth, (req, res) => {
  const user = getAuthUser(req)!;
  const links = getLinksByUser(user.uid);
  res.json(links);
});

app.post("/api/links", requireAuth, (req, res) => {
  const user = getAuthUser(req)!;
  const { originalUrl, customCode } = req.body;

  if (!originalUrl) {
    return res.status(400).json({ error: "Original target URL is required" });
  }

  // Basic URL regex test
  let formattedUrl = originalUrl.trim();
  if (!/^https?:\/\//i.test(formattedUrl)) {
    formattedUrl = `https://${formattedUrl}`;
  }

  try {
    new URL(formattedUrl);
  } catch (e) {
    return res.status(400).json({ error: "Invalid original target URL format" });
  }

  if (customCode) {
    const cleanCode = customCode.trim().toLowerCase();
    if (!/^[a-zA-Z0-9_\-]+$/.test(cleanCode)) {
      return res.status(400).json({ error: "Custom alias can only contain alphanumeric characters, hyphens, and underscores." });
    }
    const existing = getLinkByCode(cleanCode);
    if (existing) {
      return res.status(400).json({ error: `Custom code '/r/${cleanCode}' is already taken.` });
    }
  }

  const link = createLink(formattedUrl, customCode ? customCode.trim() : null, user.uid);
  if (!link) {
    return res.status(500).json({ error: "Failed to create short link. Custom alias might be taken." });
  }

  res.status(201).json(link);
});

app.delete("/api/links/:id", requireAuth, (req, res) => {
  const user = getAuthUser(req)!;
  const success = deleteLink(req.params.id, user.uid, user.role === "admin");
  if (!success) {
    return res.status(404).json({ error: "Link not found or not authorized to delete." });
  }
  res.json({ success: true, message: "Short link successfully deleted." });
});

// ==========================================
// REDIRECT CLAIM ENDPOINT
// ==========================================

// Get link details before entering redirect loop
app.get("/api/r/:code/details", (req, res) => {
  const link = getLinkByCode(req.params.code);
  if (!link) {
    return res.status(404).json({ error: "Link not found" });
  }
  const config = getSystemConfig();
  // Return meta info, omit original URL to prevent cheating/easy bypass!
  res.json({
    id: link.id,
    shortCode: link.shortCode,
    cpm: config.globalCpm,
    createdAt: link.createdAt
  });
});

// Confirm completed redirect loop and claim destination url
app.post("/api/r/:code/claim", (req, res) => {
  const link = getLinkByCode(req.params.code);
  if (!link) {
    return res.status(404).json({ error: "Link not found" });
  }

  const { country, browser, device, referrer } = req.body;

  // Track the visitor stats
  const ipCountry = country || "United States";
  const agentStr = browser && device ? `${device} / ${browser}` : (req.get("User-Agent") || "Unknown Visitor");
  const refStr = referrer || "Direct";

  // Capture the visitor's IP address
  const visitorIp = (req.headers["x-forwarded-for"] as string || req.ip || req.socket.remoteAddress || "127.0.0.1").split(",")[0].trim();

  // Increment earnings and stats
  const result = recordClickAnalytic(link.shortCode, ipCountry, agentStr, refStr, visitorIp);

  // Return the destination URL to let the client redirect
  res.json({ originalUrl: link.originalUrl, unpaid: result.unpaid });
});

// ==========================================
// ADMIN CONTROL ENDPOINTS
// ==========================================

app.get("/api/admin/config", requireAdmin, (req, res) => {
  const config = getSystemConfig();
  res.json(config);
});

app.post("/api/admin/config", requireAdmin, (req, res) => {
  const { globalCpm, popunderCode, bannerAdCode, nativeAdCode, socialBarCode } = req.body;
  
  const updates: any = {};
  if (globalCpm !== undefined) {
    const parsed = parseFloat(globalCpm);
    if (!isNaN(parsed)) {
      updates.globalCpm = parsed;
    }
  }
  if (popunderCode !== undefined) updates.popunderCode = popunderCode;
  if (bannerAdCode !== undefined) updates.bannerAdCode = bannerAdCode;
  if (nativeAdCode !== undefined) updates.nativeAdCode = nativeAdCode;
  if (socialBarCode !== undefined) updates.socialBarCode = socialBarCode;

  const config = updateSystemConfig(updates);
  res.json(config);
});

app.get("/api/admin/stats", requireAdmin, (req, res) => {
  const stats = getAdminStats();
  res.json(stats);
});

app.get("/api/admin/users", requireAdmin, (req, res) => {
  const users = getAllUsersAdmin();
  res.json(users);
});

app.patch("/api/admin/users/:uid", requireAdmin, (req, res) => {
  const { role, balance, isBanned } = req.body;
  const { uid } = req.params;

  const target = getUser(uid);
  if (!target) {
    return res.status(404).json({ error: "Target user not found" });
  }

  const updates: any = {};
  if (role !== undefined) updates.role = role;
  if (balance !== undefined) updates.balance = parseFloat(balance) || 0;
  if (isBanned !== undefined) updates.isBanned = isBanned;

  const success = updateUser(uid, updates);
  if (!success) {
    return res.status(500).json({ error: "Failed to update user profile" });
  }

  res.json({ success: true, user: getUser(uid) });
});

app.get("/api/admin/links", requireAdmin, (req, res) => {
  const links = getAllLinksAdmin();
  res.json(links);
});

app.patch("/api/admin/links/:id", requireAdmin, (req, res) => {
  const { originalUrl } = req.body;
  const { id } = req.params;

  if (!originalUrl) {
    return res.status(400).json({ error: "Target URL cannot be empty." });
  }

  const success = updateLinkAdmin(id, originalUrl);
  if (!success) {
    return res.status(404).json({ error: "Link not found." });
  }

  res.json({ success: true });
});

app.delete("/api/admin/links/:id", requireAdmin, (req, res) => {
  const success = deleteLink(req.params.id, "", true);
  if (!success) {
    return res.status(404).json({ error: "Link not found" });
  }
  res.json({ success: true, message: "Link deleted administratively." });
});

// ==========================================
// USER PROFILE & ACCOUNT SECURITY WORKFLOWS
// ==========================================

app.post("/api/auth/reauth", requireAuth, (req, res) => {
  const { password } = req.body;
  const user = getAuthUser(req)!;
  const db = readDb();
  const dbUser = db.users.find(u => u.uid === user.uid);
  if (!dbUser || dbUser.passwordHash !== password) {
    return res.status(400).json({ error: "Invalid current password" });
  }
  res.json({ success: true, message: "Re-authenticated successfully" });
});

app.post("/api/auth/update-profile", requireAuth, (req, res) => {
  const { email, password, reauthPassword } = req.body;
  const user = getAuthUser(req)!;

  const db = readDb();
  const dbUserIdx = db.users.findIndex(u => u.uid === user.uid);
  if (dbUserIdx === -1) {
    return res.status(404).json({ error: "User not found" });
  }
  const dbUser = db.users[dbUserIdx];

  if (dbUser.passwordHash !== reauthPassword) {
    return res.status(400).json({ error: "Re-authentication failed. Incorrect current password." });
  }

  if (password) {
    if (password.length < 6) {
      return res.status(400).json({ error: "New password must be at least 6 characters long." });
    }
    dbUser.passwordHash = password;
  }

  if (email && email.toLowerCase() !== dbUser.email.toLowerCase()) {
    const existing = db.users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
    if (existing) {
      return res.status(400).json({ error: "New email address is already in use by another account." });
    }
    dbUser.email = email.trim().toLowerCase();
  }

  writeDb(db);
  const { passwordHash, ...safeUser } = dbUser;
  res.json({ success: true, user: safeUser });
});

app.post("/api/auth/update-payment", requireAuth, (req, res) => {
  const { paymentMethod, paymentMobileNumber } = req.body;
  const user = getAuthUser(req)!;

  if (!paymentMethod || !paymentMobileNumber) {
    return res.status(400).json({ error: "Payment method and mobile number are required." });
  }

  const db = readDb();
  const dbUserIdx = db.users.findIndex(u => u.uid === user.uid);
  if (dbUserIdx === -1) {
    return res.status(404).json({ error: "User not found" });
  }
  const dbUser = db.users[dbUserIdx];
  dbUser.paymentMethod = paymentMethod;
  dbUser.paymentMobileNumber = paymentMobileNumber;

  writeDb(db);
  const { passwordHash, ...safeUser } = dbUser;
  res.json({ success: true, user: safeUser });
});

// ==========================================
// DYNAMIC ADVANCED WITHDRAWAL ENDPOINTS
// ==========================================

app.get("/api/withdrawals", requireAuth, (req, res) => {
  const user = getAuthUser(req)!;
  const list = getUserWithdrawals(user.uid);
  res.json(list);
});

app.post("/api/withdrawals", requireAuth, (req, res) => {
  const user = getAuthUser(req)!;
  const { amount, paymentMethod, paymentDetails } = req.body;

  const parsedAmount = parseFloat(amount);
  if (isNaN(parsedAmount) || parsedAmount <= 0) {
    return res.status(400).json({ error: "Invalid withdrawal amount" });
  }

  // Get freshest user details
  const freshestUser = getUser(user.uid);
  if (!freshestUser || freshestUser.balance < parsedAmount) {
    return res.status(400).json({ error: "Insufficient available balance" });
  }

  const result = createWithdrawal(user.uid, parsedAmount, paymentMethod, paymentDetails);
  if (!result) {
    return res.status(500).json({ error: "Failed to submit withdrawal request." });
  }

  res.status(201).json(result);
});

app.get("/api/admin/withdrawals", requireAdmin, (req, res) => {
  const list = getAllWithdrawalsAdmin();
  res.json(list);
});

app.post("/api/admin/withdrawals/:id/process", requireAdmin, (req, res) => {
  const { id } = req.params;
  const { status, reasonOrProof } = req.body;

  if (status !== "approved" && status !== "rejected") {
    return res.status(400).json({ error: "Invalid withdrawal status. Must be approved or rejected." });
  }

  const success = updateWithdrawalStatus(id, status, reasonOrProof);
  if (!success) {
    return res.status(400).json({ error: "Unable to process withdrawal. It may have already been processed or does not exist." });
  }

  res.json({ success: true });
});


// ==========================================
// DEV SERVER & STATIC MIDDLEWARES
// ==========================================

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
