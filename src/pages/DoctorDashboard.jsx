import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

function DoctorDashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [fees, setFees] = useState("");
  const [timing, setTiming] = useState("");
  const [available, setAvailable] = useState(true);
  const [specialization, setSpec] = useState("");
  const [qualification, setQual] = useState("");
  const [experience, setExp] = useState("");
  const [address, setAddress] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [activePage, setActivePage] = useState("home");
  const [darkMode, setDarkMode] = useState(true);
  const [language, setLanguage] = useState("hindi");
  const [editingProfile, setEditingProfile] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const t = {
    hindi: {
      dashboard: "Doctor Dashboard", totalAppt: "Total Appointments",
      confirmed: "Confirmed", pending: "Pending", fees: "Fees",
      updateProfile: "Profile Update Karo", feesLabel: "Fees (₹)",
      timingLabel: "Timing", availability: "Availability",
      availableOn: "✅ Patients book kar sakte hain",
      availableOff: "❌ Abhi available nahi",
      save: "💾 Save Karo", saving: "⏳ Saving...",
      appointments: "Mere Appointments", patient: "Patient",
      date: "Date", time: "Time", status: "Status", action: "Action",
      noAppt: "Abhi koi appointment nahi hai.",
      confirm: "✓ Confirm", cancel: "✕ Cancel",
      logout: "Logout", settings: "Settings",
      profileMenu: "Profile", home: "Home",
      darkMode: "Dark Mode", language: "Language",
      profileTitle: "Meri Profile", name: "Naam", email: "Email",
      role: "Doctor", editProfile: "Profile Edit Karo",
      saveProfile: "Profile Save Karo", cancelEdit: "Cancel",
      spec: "Specialization", qual: "Qualification",
      exp: "Experience", addr: "Address",
    },
    english: {
      dashboard: "Doctor Dashboard", totalAppt: "Total Appointments",
      confirmed: "Confirmed", pending: "Pending", fees: "Fees",
      updateProfile: "Update Profile", feesLabel: "Fees (₹)",
      timingLabel: "Timing", availability: "Availability",
      availableOn: "✅ Patients can book",
      availableOff: "❌ Not available",
      save: "💾 Save", saving: "⏳ Saving...",
      appointments: "My Appointments", patient: "Patient",
      date: "Date", time: "Time", status: "Status", action: "Action",
      noAppt: "No appointments yet.",
      confirm: "✓ Confirm", cancel: "✕ Cancel",
      logout: "Logout", settings: "Settings",
      profileMenu: "Profile", home: "Home",
      darkMode: "Dark Mode", language: "Language",
      profileTitle: "My Profile", name: "Name", email: "Email",
      role: "Doctor", editProfile: "Edit Profile",
      saveProfile: "Save Profile", cancelEdit: "Cancel",
      spec: "Specialization", qual: "Qualification",
      exp: "Experience", addr: "Address",
    }
  };
  const tx = t[language];

  const bg = darkMode ? "#0f1f3d" : "#f0f4f8";
  const cardBg = darkMode ? "rgba(255,255,255,0.05)" : "#ffffff";
  const border = darkMode ? "1px solid rgba(255,255,255,0.08)" : "1px solid #e2e8f0";
  const textPrimary = darkMode ? "#ffffff" : "#1a202c";
  const textSecondary = darkMode ? "#a0aec0" : "#718096";
  const navBg = darkMode ? "rgba(15,31,61,0.98)" : "#ffffff";
  const inputBg = darkMode ? "rgba(255,255,255,0.06)" : "#f8fafc";
  const inputBorder = darkMode ? "1.5px solid rgba(255,255,255,0.1)" : "1.5px solid #e2e8f0";
  const inputColor = darkMode ? "#ffffff" : "#1a202c";
  const tableBorder = darkMode ? "1px solid rgba(255,255,255,0.05)" : "1px solid #f0f4f8";

  useEffect(() => {
    API.get("/doctor/profile").then(r => {
      setProfile(r.data);
      setFees(r.data.fees ?? "");
      setTiming(r.data.timing ?? "");
      setAvailable(r.data.available ?? true);
      setSpec(r.data.specialization ?? "");
      setQual(r.data.qualification ?? "");
      setExp(r.data.experience ?? "");
      setAddress(r.data.address ?? "");
    }).catch(() => { });
    API.get("/doctor/appointments").then(r => setAppointments(r.data)).catch(() => { });
  }, []);

  const handleUpdate = async () => {
    if (!fees || !timing) { setMessage({ type: "error", text: "Fees aur timing bharo." }); return; }
    setLoading(true); setMessage(null);
    try {
      await API.put("/doctor/profile", { fees: Number(fees), timing, available, specialization, qualification, experience, address });
      setMessage({ type: "success", text: "Profile update ho gayi!" });
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Update fail." });
    } finally { setLoading(false); }
  };

  const handleProfileEdit = async () => {
    setEditLoading(true);
    try {
      await API.put("/doctor/profile", { fees: Number(fees), timing, available, specialization, qualification, experience, address });
      setProfile(prev => ({ ...prev, specialization, qualification, experience, address }));
      setEditingProfile(false);
      setMessage({ type: "success", text: "Profile update ho gayi!" });
    } catch {
      setMessage({ type: "error", text: "Update fail." });
    } finally { setEditLoading(false); }
  };

  const handleStatus = async (id, status) => {
    try {
      await API.put(`/appointments/${id}/status`, { status });
      setAppointments(appointments.map(a => a._id === id ? { ...a, status } : a));
      setMessage({ type: "success", text: `Appointment ${status}!` });
    } catch { setMessage({ type: "error", text: "Status update fail." }); }
  };

  const handleLogout = () => { localStorage.removeItem("token"); navigate("/"); };

  const inp = {
    width: "100%", padding: "11px 14px", borderRadius: "10px",
    border: inputBorder, fontSize: "15px", outline: "none",
    boxSizing: "border-box", background: inputBg, color: inputColor, marginBottom: "14px",
  };

  const navItems = [
    { id: "home", icon: "🏠", label: tx.home },
    { id: "profile", icon: "👤", label: tx.profileMenu },
    { id: "settings", icon: "⚙️", label: tx.settings },
  ];

  // =====================
  // SIDEBAR (Desktop)
  // =====================
  const Sidebar = () => (
    <div style={{ width: "220px", minHeight: "100vh", background: navBg, borderRight: border, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "24px 16px", position: "fixed", left: 0, top: 0, bottom: 0, zIndex: 100 }}>
      <div>
        <div style={{ fontSize: "18px", fontWeight: "800", color: "#00a8ff", marginBottom: "32px", textAlign: "center" }}>🌸 MUSKAN</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {navItems.map(item => (
            <button key={item.id} onClick={() => setActivePage(item.id)}
              style={{ padding: "12px 16px", borderRadius: "12px", border: "none", background: activePage === item.id ? "rgba(0,168,255,0.15)" : "transparent", color: activePage === item.id ? "#00a8ff" : textSecondary, fontWeight: "600", fontSize: "15px", cursor: "pointer", display: "flex", alignItems: "center", gap: "12px", textAlign: "left" }}>
              <span style={{ fontSize: "20px" }}>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>
      <div>
        <div style={{ padding: "14px", borderRadius: "12px", background: darkMode ? "rgba(255,255,255,0.05)" : "#f0f4f8", marginBottom: "12px" }}>
          <div style={{ fontSize: "13px", fontWeight: "700", color: textPrimary }}>👨‍⚕️ Dr. {profile?.name || "..."}</div>
          <div style={{ fontSize: "12px", color: textSecondary, marginTop: "2px" }}>{profile?.email}</div>
        </div>
        <button onClick={handleLogout}
          style={{ width: "100%", padding: "11px", borderRadius: "10px", border: "none", background: "rgba(229,62,62,0.1)", color: "#fc8181", fontWeight: "600", fontSize: "14px", cursor: "pointer" }}>
          🚪 {tx.logout}
        </button>
      </div>
    </div>
  );

  // =====================
  // BOTTOM NAV (Mobile)
  // =====================
  const BottomNav = () => (
    <>
      {/* Top bar mobile */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: "56px", background: navBg, borderBottom: border, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px", zIndex: 100 }}>
        <div style={{ fontSize: "16px", fontWeight: "800", color: "#00a8ff" }}>🌸 MUSKAN</div>
        <div style={{ fontSize: "13px", fontWeight: "600", color: textSecondary }}>👨‍⚕️ Dr. {profile?.name || "..."}</div>
      </div>
      {/* Bottom nav */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, height: "64px", background: navBg, borderTop: border, display: "flex", alignItems: "center", justifyContent: "space-around", zIndex: 100 }}>
        {navItems.map(item => (
          <button key={item.id} onClick={() => setActivePage(item.id)}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", padding: "8px 16px", border: "none", background: "transparent", color: activePage === item.id ? "#00a8ff" : textSecondary, cursor: "pointer" }}>
            <span style={{ fontSize: "22px" }}>{item.icon}</span>
            <span style={{ fontSize: "11px", fontWeight: "600" }}>{item.label}</span>
          </button>
        ))}
        <button onClick={handleLogout}
          style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", padding: "8px 16px", border: "none", background: "transparent", color: "#fc8181", cursor: "pointer" }}>
          <span style={{ fontSize: "22px" }}>🚪</span>
          <span style={{ fontSize: "11px", fontWeight: "600" }}>{tx.logout}</span>
        </button>
      </div>
    </>
  );

  const mainStyle = {
    marginLeft: isMobile ? "0" : "220px",
    padding: isMobile ? "72px 16px 80px" : "28px 32px",
    position: "relative", zIndex: 1,
  };

  return (
    <div style={{ minHeight: "100vh", background: bg, fontFamily: "'Segoe UI', sans-serif", transition: "background 0.3s", display: "flex" }}>

      {darkMode && <>
        <div style={{ position: "fixed", top: "-80px", left: "-80px", width: "300px", height: "300px", borderRadius: "50%", background: "rgba(0,168,255,0.07)", pointerEvents: "none", zIndex: 0 }} />
        <div style={{ position: "fixed", bottom: "-100px", right: "-60px", width: "350px", height: "350px", borderRadius: "50%", background: "rgba(0,168,255,0.05)", pointerEvents: "none", zIndex: 0 }} />
      </>}

      {isMobile ? <BottomNav /> : <Sidebar />}

      {/* MAIN CONTENT */}
      <div style={mainStyle}>

        {/* HOME */}
        {activePage === "home" && (
          <>
            <div style={{ fontSize: "20px", fontWeight: "700", color: textPrimary, marginBottom: "20px" }}>{tx.dashboard}</div>

            {message && (
              <div style={{ background: message.type === "success" ? "rgba(72,187,120,0.15)" : "rgba(197,48,48,0.15)", border: `1px solid ${message.type === "success" ? "rgba(104,211,145,0.4)" : "rgba(252,129,129,0.3)"}`, borderRadius: "10px", padding: "12px 16px", color: message.type === "success" ? "#68d391" : "#fc8181", fontSize: "14px", marginBottom: "16px" }}>
                {message.text}
              </div>
            )}

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: "12px", marginBottom: "20px" }}>
              {[
                [tx.totalAppt, appointments.length, "#00a8ff"],
                [tx.confirmed, appointments.filter(a => a.status === "confirmed").length, "#48bb78"],
                [tx.pending, appointments.filter(a => a.status === "pending" || a.status === "Booked").length, "#ed8936"],
                [tx.fees, `₹${fees || "—"}`, "#9f7aea"],
              ].map(([label, val, color]) => (
                <div key={label} style={{ background: cardBg, borderRadius: "12px", padding: "16px", border, borderTop: `3px solid ${color}` }}>
                  <div style={{ fontSize: "12px", color: textSecondary, fontWeight: "600", marginBottom: "4px" }}>{label}</div>
                  <div style={{ fontSize: "22px", fontWeight: "800", color: textPrimary }}>{val}</div>
                </div>
              ))}
            </div>

            {/* Profile Update */}
            <div style={{ background: cardBg, borderRadius: "14px", padding: "20px", border, marginBottom: "16px" }}>
              <div style={{ fontSize: "16px", fontWeight: "700", color: textPrimary, marginBottom: "16px", paddingBottom: "12px", borderBottom: border }}>{tx.updateProfile}</div>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "12px" }}>
                {[
                  [tx.feesLabel, fees, setFees, "number", "e.g. 500"],
                  [tx.timingLabel, timing, setTiming, "text", "e.g. 10AM-2PM"],
                  [tx.spec, specialization, setSpec, "text", "e.g. Cardiologist"],
                  [tx.qual, qualification, setQual, "text", "e.g. MBBS, MD"],
                  [tx.exp, experience, setExp, "text", "e.g. 5 years"],
                  [tx.addr, address, setAddress, "text", "e.g. Delhi"],
                ].map(([label, val, setter, type, ph]) => (
                  <div key={label}>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: textSecondary, marginBottom: "6px" }}>{label}</label>
                    <input type={type} placeholder={ph} value={val} onChange={e => setter(e.target.value)} style={inp} />
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0", borderTop: border, marginTop: "4px" }}>
                <div>
                  <div style={{ fontSize: "14px", fontWeight: "600", color: textPrimary }}>{tx.availability}</div>
                  <div style={{ fontSize: "12px", color: textSecondary, marginTop: "2px" }}>{available ? tx.availableOn : tx.availableOff}</div>
                </div>
                <div onClick={() => setAvailable(!available)}
                  style={{ width: "48px", height: "26px", borderRadius: "13px", background: available ? "#00a8ff" : "rgba(255,255,255,0.15)", position: "relative", cursor: "pointer", transition: "background 0.2s", flexShrink: 0 }}>
                  <div style={{ position: "absolute", top: "3px", left: available ? "24px" : "3px", width: "20px", height: "20px", borderRadius: "50%", background: "#fff", transition: "left 0.2s" }} />
                </div>
              </div>

              <button onClick={handleUpdate} disabled={loading}
                style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "none", background: loading ? "#2d4a7a" : "linear-gradient(135deg,#00a8ff,#0057ff)", color: "#fff", fontSize: "15px", fontWeight: "700", cursor: loading ? "not-allowed" : "pointer", marginTop: "8px" }}>
                {loading ? tx.saving : tx.save}
              </button>
            </div>

            {/* Appointments */}
            <div style={{ background: cardBg, borderRadius: "14px", padding: "20px", border, overflowX: "auto" }}>
              <div style={{ fontSize: "16px", fontWeight: "700", color: textPrimary, marginBottom: "16px", paddingBottom: "12px", borderBottom: border }}>{tx.appointments}</div>
              {appointments.length === 0 ? (
                <div style={{ textAlign: "center", color: textSecondary, padding: "24px 0" }}>{tx.noAppt}</div>
              ) : (
                <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "500px" }}>
                  <thead>
                    <tr>{[tx.patient, tx.date, tx.time, tx.status, tx.action].map(h => (
                      <th key={h} style={{ textAlign: "left", padding: "10px 12px", fontSize: "11px", fontWeight: "700", color: textSecondary, textTransform: "uppercase", letterSpacing: "0.5px", borderBottom: border }}>{h}</th>
                    ))}</tr>
                  </thead>
                  <tbody>
                    {appointments.map(a => (
                      <tr key={a._id}>
                        <td style={{ padding: "12px", fontSize: "13px", color: textPrimary, borderBottom: tableBorder }}>{a.patientName || "Patient"}</td>
                        <td style={{ padding: "12px", fontSize: "13px", color: textPrimary, borderBottom: tableBorder }}>{a.date}</td>
                        <td style={{ padding: "12px", fontSize: "13px", color: textPrimary, borderBottom: tableBorder }}>{a.time}</td>
                        <td style={{ padding: "12px", borderBottom: tableBorder }}>
                          <span style={{
                            padding: "3px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: "600",
                            background: a.status === "confirmed" ? "rgba(72,187,120,0.15)" : a.status === "cancelled" ? "rgba(252,129,129,0.15)" : "rgba(237,137,54,0.15)",
                            color: a.status === "confirmed" ? "#68d391" : a.status === "cancelled" ? "#fc8181" : "#f6ad55"
                          }}>
                            {a.status || "pending"}
                          </span>
                        </td>
                        <td style={{ padding: "12px", borderBottom: tableBorder }}>
                          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                            {a.status !== "confirmed" && (
                              <button onClick={() => handleStatus(a._id, "confirmed")}
                                style={{ padding: "5px 10px", borderRadius: "6px", border: "none", background: "rgba(72,187,120,0.2)", color: "#68d391", fontWeight: "600", fontSize: "11px", cursor: "pointer" }}>
                                {tx.confirm}
                              </button>
                            )}
                            {a.status !== "cancelled" && (
                              <button onClick={() => handleStatus(a._id, "cancelled")}
                                style={{ padding: "5px 10px", borderRadius: "6px", border: "none", background: "rgba(252,129,129,0.2)", color: "#fc8181", fontWeight: "600", fontSize: "11px", cursor: "pointer" }}>
                                {tx.cancel}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}

        {/* PROFILE */}
        {activePage === "profile" && (
          <div style={{ maxWidth: "600px", margin: "0 auto" }}>
            <div style={{ fontSize: "20px", fontWeight: "700", color: textPrimary, marginBottom: "20px" }}>{tx.profileTitle}</div>
            <div style={{ background: cardBg, borderRadius: "20px", padding: "28px", border }}>
              <div style={{ textAlign: "center", marginBottom: "24px" }}>
                <div style={{ width: "72px", height: "72px", borderRadius: "50%", background: "linear-gradient(135deg,#00a8ff,#0057ff)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px", margin: "0 auto 10px" }}>👨‍⚕️</div>
                <div style={{ fontSize: "18px", fontWeight: "700", color: textPrimary }}>Dr. {profile?.name}</div>
                <div style={{ fontSize: "13px", color: "#00a8ff", marginTop: "4px" }}>{specialization || tx.role}</div>
              </div>

              {!editingProfile ? (
                <>
                  {[
                    [tx.name, profile?.name],
                    [tx.email, profile?.email],
                    [tx.spec, specialization || "—"],
                    [tx.qual, qualification || "—"],
                    [tx.exp, experience || "—"],
                    [tx.addr, address || "—"],
                    [tx.feesLabel, `₹${fees || "N/A"}`],
                    [tx.timingLabel, timing || "N/A"],
                  ].map(([label, val]) => (
                    <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: border }}>
                      <span style={{ fontSize: "13px", color: textSecondary, fontWeight: "600" }}>{label}</span>
                      <span style={{ fontSize: "13px", color: textPrimary, fontWeight: "600", maxWidth: "60%", textAlign: "right" }}>{val}</span>
                    </div>
                  ))}
                  <button onClick={() => setEditingProfile(true)}
                    style={{ width: "100%", padding: "13px", borderRadius: "12px", border: "none", background: "linear-gradient(135deg,#00a8ff,#0057ff)", color: "#fff", fontWeight: "700", fontSize: "15px", cursor: "pointer", marginTop: "20px" }}>
                    ✏️ {tx.editProfile}
                  </button>
                </>
              ) : (
                <>
                  <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "12px" }}>
                    {[
                      [tx.spec, specialization, setSpec, "e.g. Cardiologist"],
                      [tx.qual, qualification, setQual, "e.g. MBBS, MD"],
                      [tx.exp, experience, setExp, "e.g. 5 years"],
                      [tx.addr, address, setAddress, "e.g. Delhi"],
                      [tx.feesLabel, fees, setFees, "e.g. 500"],
                      [tx.timingLabel, timing, setTiming, "e.g. 10AM-2PM"],
                    ].map(([label, val, setter, ph]) => (
                      <div key={label}>
                        <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: textSecondary, marginBottom: "6px" }}>{label}</label>
                        <input type="text" placeholder={ph} value={val} onChange={e => setter(e.target.value)}
                          style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: inputBorder, fontSize: "14px", outline: "none", boxSizing: "border-box", background: inputBg, color: inputColor }} />
                      </div>
                    ))}
                  </div>
                  <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
                    <button onClick={() => setEditingProfile(false)}
                      style={{ flex: 1, padding: "12px", borderRadius: "10px", border: inputBorder, background: "transparent", color: textSecondary, fontWeight: "600", cursor: "pointer", fontSize: "14px" }}>
                      {tx.cancelEdit}
                    </button>
                    <button onClick={handleProfileEdit} disabled={editLoading}
                      style={{ flex: 2, padding: "12px", borderRadius: "10px", border: "none", background: "linear-gradient(135deg,#00a8ff,#0057ff)", color: "#fff", fontWeight: "700", cursor: editLoading ? "not-allowed" : "pointer", fontSize: "14px" }}>
                      {editLoading ? tx.saving : `💾 ${tx.saveProfile}`}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* SETTINGS */}
        {activePage === "settings" && (
          <div style={{ maxWidth: "500px", margin: "0 auto" }}>
            <div style={{ fontSize: "20px", fontWeight: "700", color: textPrimary, marginBottom: "20px" }}>{tx.settings}</div>
            <div style={{ background: cardBg, borderRadius: "20px", padding: "24px", border }}>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 0", borderBottom: border }}>
                <div>
                  <div style={{ fontSize: "15px", fontWeight: "600", color: textPrimary }}>🌙 {tx.darkMode}</div>
                  <div style={{ fontSize: "13px", color: textSecondary, marginTop: "2px" }}>{darkMode ? "Dark on" : "Light on"}</div>
                </div>
                <div onClick={() => setDarkMode(!darkMode)}
                  style={{ width: "48px", height: "26px", borderRadius: "13px", background: darkMode ? "#00a8ff" : "#cbd5e0", position: "relative", cursor: "pointer", transition: "background 0.2s" }}>
                  <div style={{ position: "absolute", top: "3px", left: darkMode ? "24px" : "3px", width: "20px", height: "20px", borderRadius: "50%", background: "#fff", transition: "left 0.2s" }} />
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 0", borderBottom: border }}>
                <div>
                  <div style={{ fontSize: "15px", fontWeight: "600", color: textPrimary }}>🌐 {tx.language}</div>
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button onClick={() => setLanguage("hindi")}
                    style={{ padding: "8px 14px", borderRadius: "8px", border: "none", background: language === "hindi" ? "#00a8ff" : "rgba(255,255,255,0.1)", color: language === "hindi" ? "#fff" : textSecondary, fontWeight: "600", fontSize: "13px", cursor: "pointer" }}>
                    हिंदी
                  </button>
                  <button onClick={() => setLanguage("english")}
                    style={{ padding: "8px 14px", borderRadius: "8px", border: "none", background: language === "english" ? "#00a8ff" : "rgba(255,255,255,0.1)", color: language === "english" ? "#fff" : textSecondary, fontWeight: "600", fontSize: "13px", cursor: "pointer" }}>
                    English
                  </button>
                </div>
              </div>

              <div style={{ paddingTop: "20px" }}>
                <button onClick={handleLogout}
                  style={{ width: "100%", padding: "14px", borderRadius: "12px", border: "none", background: "rgba(229,62,62,0.15)", color: "#fc8181", fontWeight: "700", fontSize: "16px", cursor: "pointer" }}>
                  🚪 {tx.logout}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DoctorDashboard;