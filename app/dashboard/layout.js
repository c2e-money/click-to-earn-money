export default function DashboardLayout({ children }) {
  return <>{children}</>;
}
// Dashboard.js mein useEffect ke andar:
if (doc.exists() && doc.data().isBanned) {
    alert("Your account is banned!");
    signOut(auth);
}
