import { 
  collection, doc, setDoc, getDoc, addDoc, updateDoc, deleteDoc, 
  query, where, onSnapshot, getDocs, limit, orderBy
} from "firebase/firestore";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
  verifyBeforeUpdateEmail
} from "firebase/auth";
import { db, auth, isFirebaseConfigured } from "../firebase";
import { User, ShortLink, ClickAnalytic, PlatformStats, Withdrawal } from "../types";

// =========================================================
// UNIFIED AUTHENTICATION SERVICES
// =========================================================

export async function signUpUser(email: string, password: string): Promise<User> {
  if (isFirebaseConfigured && auth && db) {
    // 1. Create User in Firebase Authentication
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = credential.user;

    // 2. Automatically create matching user document in 'users' collection
    const newUserDoc: User = {
      uid: firebaseUser.uid,
      email: firebaseUser.email || email,
      role: "user", // Default role 'user'
      totalClicks: 0,
      totalEarnings: 0,
      availableBalance: 0,
      totalWithdrawn: 0,
      balance: 0,
      createdAt: new Date().toISOString()
    };

    // 3. Save to Firestore
    await setDoc(doc(db, "users", firebaseUser.uid), newUserDoc);
    return newUserDoc;
  } else {
    // Fallback: Sandbox Express server DB
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Sandbox registration failed.");
    return data.user;
  }
}

export async function logInUser(email: string, password: string): Promise<User> {
  if (isFirebaseConfigured && auth && db) {
    // 1. Authenticate with Firebase Auth
    const credential = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = credential.user;

    // 2. Fetch Firestore User Document to read their role and profile balance
    const userDocRef = doc(db, "users", firebaseUser.uid);
    const userSnapshot = await getDoc(userDocRef);
    
    if (!userSnapshot.exists()) {
      // Auto-provision if Auth exists but doc was missed
      const newUserDoc: User = {
        uid: firebaseUser.uid,
        email: firebaseUser.email || email,
        role: "user",
        totalClicks: 0,
        totalEarnings: 0,
        availableBalance: 0,
        totalWithdrawn: 0,
        balance: 0,
        createdAt: new Date().toISOString()
      };
      await setDoc(userDocRef, newUserDoc);
      return newUserDoc;
    }

    const userData = userSnapshot.data() as User;
    if (userData.isBanned) {
      await signOut(auth);
      throw new Error("This account is suspended. Contact admin@clicktoearn.com.");
    }

    return userData;
  } else {
    // Fallback: Sandbox Express server DB
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Sandbox login failed.");
    return data.user;
  }
}

export async function logOutSession(): Promise<void> {
  if (isFirebaseConfigured && auth) {
    await signOut(auth);
  }
  localStorage.removeItem("click_user");
}

// =========================================================
// REAL-TIME FIRESTORE DATA SUBSCRIBERS (onSnapshot)
// =========================================================

/**
 * Listens to active user profile documents in real-time
 */
export function listenToUserProfile(uid: string, onUpdate: (user: User | null) => void) {
  if (isFirebaseConfigured && db) {
    const docRef = doc(db, "users", uid);
    return onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        onUpdate(snapshot.data() as User);
      } else {
        onUpdate(null);
      }
    }, (error) => {
      console.error("Firestore onSnapshot userProfile error:", error);
    });
  } else {
    // Fallback polling for sandbox mock real-time behavior
    const interval = setInterval(async () => {
      try {
        const res = await fetch("/api/auth/me", { headers: { "X-User-Uid": uid } });
        if (res.ok) {
          const data = await res.json();
          onUpdate(data.user);
        }
      } catch (err) {
        console.error("Sandbox profile sync error", err);
      }
    }, 3000);

    // Return unsubscriber function
    return () => clearInterval(interval);
  }
}

/**
 * Listens to user dashboard stats in real-time
 */
export function listenToUserStats(uid: string, onUpdate: (stats: any) => void) {
  if (isFirebaseConfigured && db) {
    // Under real Firebase, stats are calculated in real-time by listening to
    // users, links, and analytics collections, as well as the global_config settings.
    const userDocRef = doc(db, "users", uid);
    const linksQuery = query(collection(db, "links"), where("userId", "==", uid));
    const configDocRef = doc(db, "settings", "global_config");

    let currentUserDoc: any = null;
    let currentLinks: any[] = [];
    let globalCpm = 5.00;

    const recalculateAndTrigger = () => {
      if (!currentUserDoc) return;
      
      const activeLinksCount = currentLinks.length;
      const totalClicks = currentUserDoc.totalClicks || 0;
      const totalWithdrawn = currentUserDoc.totalWithdrawn || 0;
      
      // Dynamically calculate total earnings and balance in real-time based on the global CPM
      const totalEarnings = parseFloat(((totalClicks / 1000) * globalCpm).toFixed(4));
      const balance = parseFloat((totalEarnings - totalWithdrawn).toFixed(4));
      const avgCpm = globalCpm;

      onUpdate({
        totalClicks,
        totalEarnings,
        balance: Math.max(0, balance),
        activeLinksCount,
        avgCpm,
        // Fallback placeholder charts data or populated dynamically
        clicksOverTime: currentUserDoc.clicksOverTime || [
          { date: "Day 1", clicks: 0, earnings: 0 },
          { date: "Day 2", clicks: 0, earnings: 0 },
          { date: "Day 3", clicks: 0, earnings: 0 },
          { date: "Day 4", clicks: 0, earnings: 0 },
          { date: "Day 5", clicks: 0, earnings: 0 },
          { date: "Day 6", clicks: 0, earnings: 0 },
          { date: "Day 7", clicks: totalClicks, earnings: totalEarnings }
        ],
        countryStats: currentUserDoc.countryStats || [],
        referrerStats: currentUserDoc.referrerStats || []
      });
    };

    const unsubUser = onSnapshot(userDocRef, (snap) => {
      if (snap.exists()) {
        currentUserDoc = snap.data();
        recalculateAndTrigger();
      }
    });

    const unsubLinks = onSnapshot(linksQuery, (snap) => {
      currentLinks = snap.docs.map(d => d.data());
      recalculateAndTrigger();
    });

    const unsubConfig = onSnapshot(configDocRef, (snap) => {
      if (snap.exists()) {
        globalCpm = snap.data().globalCpm || 5.00;
      } else {
        globalCpm = 5.00;
      }
      recalculateAndTrigger();
    });

    return () => {
      unsubUser();
      unsubLinks();
      unsubConfig();
    };
  } else {
    // Fallback sandbox real-time polling
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/user/stats", { headers: { "X-User-Uid": uid } });
        if (res.ok) {
          const stats = await res.json();
          onUpdate(stats);
        }
      } catch (err) {
        console.error("Sandbox stats query error:", err);
      }
    };
    fetchStats();
    const interval = setInterval(fetchStats, 3000);
    return () => clearInterval(interval);
  }
}

/**
 * Listens to active user's shortened links list in real-time
 */
export function listenToUserLinks(uid: string, role: string, onUpdate: (links: ShortLink[]) => void) {
  if (isFirebaseConfigured && db) {
    // Real-time links listener matching USER ISOLATION rules:
    // Regular users can only see their own. Admins can see all documents.
    const linksCollection = collection(db, "links");
    const linksQuery = role === "admin"
      ? query(linksCollection, orderBy("createdAt", "desc"))
      : query(linksCollection, where("userId", "==", uid));

    return onSnapshot(linksQuery, (snapshot) => {
      const links = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ShortLink[];
      onUpdate(links);
    }, (error) => {
      console.error("Firestore links load error:", error);
    });
  } else {
    // Fallback sandbox REST endpoint
    const fetchLinks = async () => {
      try {
        const endpoint = role === "admin" ? "/api/admin/links" : "/api/links";
        const res = await fetch(endpoint, { headers: { "X-User-Uid": uid } });
        if (res.ok) {
          const data = await res.json();
          onUpdate(data);
        }
      } catch (err) {
        console.error("Sandbox link sync error:", err);
      }
    };
    fetchLinks();
    const interval = setInterval(fetchLinks, 3000);
    return () => clearInterval(interval);
  }
}

// =========================================================
// WRITING & MUTATING DATA (Firestore vs Fallback)
// =========================================================

export async function createShortenedLink(
  originalUrl: string, 
  customCode: string | null, 
  uid: string
): Promise<ShortLink> {
  // Format standard URLs
  let formattedUrl = originalUrl.trim();
  if (!/^https?:\/\//i.test(formattedUrl)) {
    formattedUrl = `https://${formattedUrl}`;
  }

  if (isFirebaseConfigured && db) {
    const code = customCode ? customCode.trim().toLowerCase() : Math.random().toString(36).substring(2, 7);
    
    // Check code uniqueness in links collection
    const checkDocRef = doc(db, "links", code);
    const checkSnap = await getDoc(checkDocRef);
    if (checkSnap.exists()) {
      throw new Error(`Custom code '/r/${code}' is already active.`);
    }

    // Fetch active global config CPM to initialize new link CPM
    const configSnap = await getDoc(doc(db, "settings", "global_config"));
    const activeCpm = configSnap.exists() ? (configSnap.data().globalCpm || 5.00) : 5.00;

    const newLink: ShortLink = {
      id: code, // Set code as Doc ID
      shortCode: code,
      originalUrl: formattedUrl,
      userId: uid,
      totalClicks: 0,
      createdAt: new Date().toISOString(),
      cpm: activeCpm
    };

    await setDoc(doc(db, "links", code), newLink);
    return newLink;
  } else {
    // Sandbox Express server
    const res = await fetch("/api/links", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-User-Uid": uid
      },
      body: JSON.stringify({ originalUrl: formattedUrl, customCode })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Sandbox link generation failed.");
    return data;
  }
}

export async function deleteShortenedLink(id: string, uid: string, role: string): Promise<boolean> {
  if (isFirebaseConfigured && db) {
    const linkDocRef = doc(db, "links", id);
    const linkSnap = await getDoc(linkDocRef);
    
    if (!linkSnap.exists()) {
      throw new Error("Shortened link does not exist.");
    }

    const linkData = linkSnap.data() as ShortLink;
    // Security check: must be owner or admin
    if (role !== "admin" && linkData.userId !== uid) {
      throw new Error("Access denied. You are not authorized to delete this path.");
    }

    await deleteDoc(linkDocRef);
    return true;
  } else {
    // Sandbox Express API
    const res = await fetch(`/api/links/${id}`, {
      method: "DELETE",
      headers: { "X-User-Uid": uid }
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Delete call failed.");
    }
    return true;
  }
}

// =========================================================
// SECURE SYSTEM ADMIN CONSOLE SUBSCRIBERS
// =========================================================

export function listenToAdminStats(uid: string, onUpdate: (stats: PlatformStats) => void) {
  if (isFirebaseConfigured && db) {
    // Admin reads all active links, users, and analytics
    const usersCollection = collection(db, "users");
    const linksCollection = collection(db, "links");

    let allUsers: any[] = [];
    let allLinks: any[] = [];

    const recalculateAdminStats = () => {
      const totalLinks = allLinks.length;
      const totalClicks = allUsers.reduce((acc, curr) => acc + (curr.totalClicks || 0), 0);
      const totalEarnings = allUsers.reduce((acc, curr) => acc + (curr.totalEarnings || 0), 0);
      const cpmSum = allLinks.reduce((acc, curr) => acc + (curr.cpm || 0), 0);
      const avgCpm = totalLinks > 0 ? parseFloat((cpmSum / totalLinks).toFixed(2)) : 5.00;

      onUpdate({
        totalClicks,
        totalEarnings: parseFloat(totalEarnings.toFixed(2)),
        totalLinks,
        avgCpm,
        // Default historical charts template for admin dashboard visual
        clicksOverTime: [
          { date: "Day 1", clicks: totalClicks / 7, earnings: totalEarnings / 7 },
          { date: "Day 2", clicks: totalClicks / 6, earnings: totalEarnings / 6 },
          { date: "Day 3", clicks: totalClicks / 5, earnings: totalEarnings / 5 },
          { date: "Day 4", clicks: totalClicks / 4, earnings: totalEarnings / 4 },
          { date: "Day 5", clicks: totalClicks / 3, earnings: totalEarnings / 3 },
          { date: "Day 6", clicks: totalClicks / 2, earnings: totalEarnings / 2 },
          { date: "Day 7", clicks: totalClicks, earnings: totalEarnings }
        ],
        countryStats: [],
        referrerStats: []
      });
    };

    const unsubUsers = onSnapshot(usersCollection, (snap) => {
      allUsers = snap.docs.map(d => d.data());
      recalculateAdminStats();
    });

    const unsubLinks = onSnapshot(linksCollection, (snap) => {
      allLinks = snap.docs.map(d => d.data());
      recalculateAdminStats();
    });

    return () => {
      unsubUsers();
      unsubLinks();
    };
  } else {
    // Polling Sandbox fallback
    const fetchAdmin = async () => {
      try {
        const res = await fetch("/api/admin/stats", { headers: { "X-User-Uid": uid } });
        if (res.ok) {
          const data = await res.json();
          onUpdate(data);
        }
      } catch (err) {
        console.error("Sandbox admin stats polling error:", err);
      }
    };
    fetchAdmin();
    const interval = setInterval(fetchAdmin, 3000);
    return () => clearInterval(interval);
  }
}

export function listenToAllUsers(uid: string, onUpdate: (users: User[]) => void) {
  if (isFirebaseConfigured && db) {
    const usersCollection = collection(db, "users");
    return onSnapshot(usersCollection, (snapshot) => {
      const usersList = snapshot.docs.map(doc => doc.data() as User);
      onUpdate(usersList);
    }, (error) => {
      console.error("Firestore users listen error:", error);
    });
  } else {
    // Polling fallback
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/admin/users", { headers: { "X-User-Uid": uid } });
        if (res.ok) {
          const data = await res.json();
          onUpdate(data);
        }
      } catch (err) {
        console.error("Sandbox fetchUsers error:", err);
      }
    };
    fetchUsers();
    const interval = setInterval(fetchUsers, 3000);
    return () => clearInterval(interval);
  }
}

export async function modifyUserDocAdmin(
  adminUid: string, 
  targetUid: string, 
  updates: Partial<User>
): Promise<boolean> {
  if (isFirebaseConfigured && db) {
    // Write directly using admin security bypass
    const userDocRef = doc(db, "users", targetUid);
    await updateDoc(userDocRef, updates);
    return true;
  } else {
    // Sandbox Express route
    const res = await fetch(`/api/admin/users/${targetUid}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "X-User-Uid": adminUid
      },
      body: JSON.stringify(updates)
    });
    return res.ok;
  }
}

export async function rerouteShortLinkAdmin(
  adminUid: string, 
  linkId: string, 
  newOriginalUrl: string
): Promise<boolean> {
  if (isFirebaseConfigured && db) {
    const docRef = doc(db, "links", linkId);
    await updateDoc(docRef, { originalUrl: newOriginalUrl });
    return true;
  } else {
    const res = await fetch(`/api/admin/links/${linkId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "X-User-Uid": adminUid
      },
      body: JSON.stringify({ originalUrl: newOriginalUrl })
    });
    return res.ok;
  }
}

// Global CPM & Ad Configuration Controllers
export async function getSystemConfigDoc(): Promise<any> {
  if (isFirebaseConfigured && db) {
    const docRef = doc(db, "settings", "global_config");
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data();
    }
    return { globalCpm: 5.00, type: "global_config" };
  } else {
    const res = await fetch("/api/admin/config", {
      headers: { "X-User-Uid": "admin-uid-123" }
    });
    if (res.ok) {
      return await res.json();
    }
    return { globalCpm: 5.00, type: "global_config" };
  }
}

export async function getGlobalCpm(): Promise<number> {
  const config = await getSystemConfigDoc();
  return config.globalCpm || 5.00;
}

export async function updateSystemConfigDoc(adminUid: string, updates: any): Promise<void> {
  if (isFirebaseConfigured && db) {
    const docRef = doc(db, "settings", "global_config");
    await setDoc(docRef, { ...updates, type: "global_config" }, { merge: true });
  } else {
    await fetch("/api/admin/config", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "X-User-Uid": adminUid
      },
      body: JSON.stringify(updates)
    });
  }
}

export async function updateGlobalCpm(adminUid: string, cpm: number): Promise<void> {
  await updateSystemConfigDoc(adminUid, { globalCpm: cpm });
}

export function listenToSystemConfig(adminUid: string, onUpdate: (config: any) => void) {
  if (isFirebaseConfigured && db) {
    const docRef = doc(db, "settings", "global_config");
    return onSnapshot(docRef, (snap) => {
      if (snap.exists()) {
        onUpdate(snap.data());
      } else {
        onUpdate({ globalCpm: 5.00, type: "global_config" });
      }
    });
  } else {
    const fetchConfig = async () => {
      try {
        const res = await fetch("/api/admin/config", {
          headers: { "X-User-Uid": adminUid }
        });
        if (res.ok) {
          const data = await res.json();
          onUpdate(data);
        }
      } catch (err) {
        console.error("Sandbox config sync error:", err);
      }
    };
    fetchConfig();
    const interval = setInterval(fetchConfig, 3000);
    return () => clearInterval(interval);
  }
}

export function listenToGlobalCpm(adminUid: string, onUpdate: (cpm: number) => void) {
  return listenToSystemConfig(adminUid, (config) => {
    onUpdate(config.globalCpm || 5.00);
  });
}

// =========================================================
// SECURITY & WITHDRAWAL INTEGRATION METHODS
// =========================================================

export async function reauthenticateUser(password: string): Promise<boolean> {
  if (isFirebaseConfigured && auth && auth.currentUser) {
    const user = auth.currentUser;
    if (!user.email) throw new Error("No authenticated user email found.");
    const credential = EmailAuthProvider.credential(user.email, password);
    await reauthenticateWithCredential(user, credential);
    return true;
  } else {
    const activeUser = JSON.parse(localStorage.getItem("click_user") || "{}");
    const res = await fetch("/api
