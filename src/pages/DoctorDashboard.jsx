import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

function DoctorDashboard() {
  const navigate = useNavigate();
  const [profile, setProfile]           = useState(null);
  const [fees, setFees]                 = useState("");
  const [timing, setTiming]             = useState("");
  const [available, setAvailable]       = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading]           = useState(false);
  const [message, setMessage]           = useState(null);
  const [activePage, setActivePage]     = useState("home");
  const [darkMode, setDarkMode]         = useState(true);
  const [language, setLanguage]         = useState("hindi");
  const [settingsOpen, setSettingsOpen] = useState(false);

  const t = {
    hindi: {
      dashboard: "Doctor Dashboard", totalAppt: "Total Appointments",
      confirmed: "Confirmed", pending: "Pending", fees: "Fees",
      updateProfile: "Profile Update Karo", feesLabel: "Fees (₹)",
      timing: "Timing", availability: "Availability",
      availableOn: "✅ Patients book kar sakte hain",
      availableOff: "❌ Abhi available nahi",
      save: "💾 Profile Save Karo", saving: "⏳ Save ho raha hai...",
      appointments: "Mere Appointments", patient: "Patient",
      date: "Date", time: "Time", status: "Status", action: "Action",
      noAppt: "Abhi koi appointment nahi hai.",
      confirm: "✓ Confirm", cancel: "✕ Cancel",
      logout: "Logout", settings: "Settings", profile: "Profile",
      home: "Home", darkMode: "Dark Mode", language: "Language",
      profileTitle: "Meri Profile", name: "Naam", email: "Email",
      role: "Role", doctor: "Doctor",
    },
    english: {
      dashboard: "Doctor Dashboard", totalAppt: "Total Appointments",
      confirmed: "Confirmed", pending: "Pending", fees: "Fees",
      updateProfile: "Update Profile", feesLabel: "Fees (₹)",
      timing: "Timing", availability: "Availability",
      availableOn: "✅ Patients can book appointments",
      availableOff: "❌ Not available right now",
      save: "💾 Save Profile", saving: "⏳ Saving...",
      appointments: "My Appointments", patient: "Patient",
      date: "Date", time: "Time", status: "Status", action: "Action",
      noAppt: "No appointments yet.",
      confirm: "✓ Confirm", cancel: "✕ Cancel",
      logout: "Logout", settings: "Settings", profile: "Profile",
      home: "Home", darkMode: "Dark Mode", language: "Language",
      profileTitle: "My Profile", name: "Name", email: "Email",
      role: "Role", doctor: "Doctor",
    }
  };
  const tx = t[language];

  const bg      = darkMode ? "#0f1f3d" : "#f0f4f8";
  const cardBg  = darkMode ? "rgba(255,255,255,0.05)" : "#ffffff";
  const border  = darkMode ? "1px solid rgba(255,255,255,0.08)" : "1px solid #e2e8f0";
  const textPrimary   = darkMode ? "#ffffff" : "#1a202c";
  const textSecondary = darkMode ? "#a0aec0" : "#718096";
  const navBg   = darkMode ? "rgba(255,255,255,0.04)" : "#ffffff";
  const inputBg = darkMode ? "rgba(255,255,255,0.06)" : "#f8fafc";
  const inputBorder = darkMode ? "1.5px solid rgba(255,255,255,0.1)" : "1.5px solid #e2e8f0";
  const inputColor  = darkMode ? "#ffffff" : "#1a202c";
  const tableBorder = darkMode ? "1px solid rgba(255,255,255,0.05)" : "1px solid #f0f4f8";

  useEffect(() => {
    API.get("/doctor/profile").then(r => {
      setProfile(r.data); setFees(r.data.fees ?? "");
      setTiming(r.data.timing ?? ""); setAvailable(r.data.available ?? true);
    }).catch(() => {});
    API.get("/doctor/appointments").then(r => setAppointments(r.data)).catch(() => {});
  }, []);

  const handleUpdate = async () => {
    if (!fees || !timing) { setMessage({ type:"error", text:"Fees aur timing bharo." }); return; }
    setLoading(true); setMessage(null);
    try {
      await API.put("/doctor/profile", { fees: Number(fees), timing, available });
      setMessage({ type:"success", text:"Profile update ho gayi!" });
    } catch (err) {
      setMessage({ type:"error", text: err.response?.data?.message || "Update fail ho gayi." });
    } finally { setLoading(false); }
  };

  const handleStatus = async (id, status) => {
    try {
      await API.put(`/appointments/${id}/status`, { status });
      setAppointments(appointments.map(a => a._id === id ? { ...a, status } : a));
      setMessage({ type:"success", text:`Appointment ${status}!` });
    } catch {
      setMessage({ type:"error", text:"Status update fail ho gaya." });
    }
  };

  const handleLogout = () => { localStorage.removeItem("token"); navigate("/"); };

  const inp = { width:"100%", padding:"11px 14px", borderRadius:"10px", border: inputBorder, fontSize:"15px", outline:"none", boxSizing:"border-box", background: inputBg, color: inputColor };

  const navItems = [
    { id:"home", icon:"🏠", label: tx.home },
    { id:"profile", icon:"👤", label: tx.profile },
    { id:"settings", icon:"⚙️", label: tx.settings },
  ];

  return (
    <div style={{ minHeight:"100vh", background: bg, fontFamily:"'Segoe UI', sans-serif", transition:"background 0.3s" }}>

      {darkMode && <>
        <div style={{ position:"fixed", top:"-80px", left:"-80px", width:"300px", height:"300px", borderRadius:"50%", background:"rgba(0,168,255,0.07)", pointerEvents:"none", zIndex:0 }} />
        <div style={{ position:"fixed", bottom:"-100px", right:"-60px", width:"350px", height:"350px", borderRadius:"50%", background:"rgba(0,168,255,0.05)", pointerEvents:"none", zIndex:0 }} />
      </>}

      {/* Navbar */}
      <nav style={{ background: navBg, borderBottom: border, padding:"0 32px", height:"64px", display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:100, backdropFilter:"blur(10px)" }}>
        <div style={{ fontSize:"20px", fontWeight:"800", color:"#00a8ff", letterSpacing:"1px" }}>🌸 MUSKAN</div>

        {/* Nav Links */}
        <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
          {navItems.map(item => (
            <button key={item.id}
              onClick={() => setActivePage(item.id)}
              style={{ padding:"8px 16px", borderRadius:"10px", border:"none", background: activePage===item.id ? "rgba(0,168,255,0.15)" : "transparent", color: activePage===item.id ? "#00a8ff" : textSecondary, fontWeight:"600", fontSize:"14px", cursor:"pointer", display:"flex", alignItems:"center", gap:"6px", transition:"all 0.2s" }}>
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
          <span style={{ fontSize:"14px", fontWeight:"600", color: textSecondary }}>👨‍⚕️ Dr. {profile?.name || "..."}</span>
          <button onClick={handleLogout}
            style={{ padding:"8px 18px", borderRadius:"8px", border:"1px solid rgba(229,62,62,0.4)", background:"rgba(229,62,62,0.1)", color:"#fc8181", fontWeight:"600", fontSize:"14px", cursor:"pointer" }}>
            {tx.logout}
          </button>
        </div>
      </nav>

      <div style={{ padding:"28px 32px", maxWidth:"1100px", margin:"0 auto", position:"relative", zIndex:1 }}>

        {/* HOME PAGE */}
        {activePage === "home" && (
          <>
            <div style={{ fontSize:"22px", fontWeight:"700", color: textPrimary, marginBottom:"24px" }}>{tx.dashboard}</div>

            {message && (
              <div style={{ background: message.type==="success"?"rgba(72,187,120,0.15)":"rgba(197,48,48,0.15)", border:`1px solid ${message.type==="success"?"rgba(104,211,145,0.4)":"rgba(252,129,129,0.3)"}`, borderRadius:"10px", padding:"12px 16px", color: message.type==="success"?"#68d391":"#fc8181", fontSize:"14px", marginBottom:"16px" }}>
                {message.text}
              </div>
            )}

            {/* Stat Cards */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:"16px", marginBottom:"24px" }}>
              {[
                [tx.totalAppt, appointments.length, "#00a8ff"],
                [tx.confirmed, appointments.filter(a=>a.status==="confirmed").length, "#48bb78"],
                [tx.pending, appointments.filter(a=>a.status==="pending"||a.status==="Booked").length, "#ed8936"],
                [tx.fees, `₹${fees||"—"}`, "#9f7aea"],
              ].map(([label, val, color]) => (
                <div key={label} style={{ background: cardBg, borderRadius:"14px", padding:"20px 24px", border, borderTop:`3px solid ${color}`, transition:"background 0.3s" }}>
                  <div style={{ fontSize:"13px", color: textSecondary, fontWeight:"600", marginBottom:"6px" }}>{label}</div>
                  <div style={{ fontSize:"24px", fontWeight:"800", color: textPrimary }}>{val}</div>
                </div>
              ))}
            </div>

            {/* Profile Update */}
            <div style={{ background: cardBg, borderRadius:"14px", padding:"28px", border, marginBottom:"20px", transition:"background 0.3s" }}>
              <div style={{ fontSize:"17px", fontWeight:"700", color: textPrimary, marginBottom:"20px", paddingBottom:"14px", borderBottom: border }}>{tx.updateProfile}</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"16px", marginBottom:"8px" }}>
                <div>
                  <label style={{ display:"block", fontSize:"12px", fontWeight:"600", color: textSecondary, marginBottom:"6px" }}>{tx.feesLabel}</label>
                  <input type="number" placeholder="e.g. 500" value={fees} onChange={e=>setFees(e.target.value)} style={inp} />
                </div>
                <div>
                  <label style={{ display:"block", fontSize:"12px", fontWeight:"600", color: textSecondary, marginBottom:"6px" }}>{tx.timing}</label>
                  <input type="text" placeholder="e.g. 10AM - 2PM" value={timing} onChange={e=>setTiming(e.target.value)} style={inp} />
                </div>
              </div>

              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px 0", borderTop: border, marginTop:"12px" }}>
                <div>
                  <div style={{ fontSize:"15px", fontWeight:"600", color: textPrimary }}>{tx.availability}</div>
                  <div style={{ fontSize:"13px", color: textSecondary, marginTop:"2px" }}>{available ? tx.availableOn : tx.availableOff}</div>
                </div>
                <div onClick={() => setAvailable(!available)}
                  style={{ width:"48px", height:"26px", borderRadius:"13px", background: available?"#00a8ff":"rgba(255,255,255,0.15)", position:"relative", cursor:"pointer", transition:"background 0.2s" }}>
                  <div style={{ position:"absolute", top:"3px", left: available?"24px":"3px", width:"20px", height:"20px", borderRadius:"50%", background:"#fff", transition:"left 0.2s" }} />
                </div>
              </div>

              <button onClick={handleUpdate} disabled={loading}
                style={{ padding:"12px 32px", borderRadius:"10px", border:"none", background: loading?"#2d4a7a":"linear-gradient(135deg,#00a8ff,#0057ff)", color:"#fff", fontSize:"15px", fontWeight:"700", cursor: loading?"not-allowed":"pointer", marginTop:"16px" }}>
                {loading ? tx.saving : tx.save}
              </button>

              {message && (
                <div style={{ background: message.type==="success"?"rgba(72,187,120,0.15)":"rgba(197,48,48,0.15)", border:`1px solid ${message.type==="success"?"rgba(104,211,145,0.4)":"rgba(252,129,129,0.3)"}`, borderRadius:"10px", padding:"12px 16px", color: message.type==="success"?"#68d391":"#fc8181", fontSize:"14px", marginTop:"14px" }}>
                  {message.text}
                </div>
              )}
            </div>

            {/* Appointments Table */}
            <div style={{ background: cardBg, borderRadius:"14px", padding:"28px", border, overflowX:"auto", transition:"background 0.3s" }}>
              <div style={{ fontSize:"17px", fontWeight:"700", color: textPrimary, marginBottom:"20px", paddingBottom:"14px", borderBottom: border }}>{tx.appointments}</div>
              {appointments.length === 0 ? (
                <div style={{ textAlign:"center", color: textSecondary, padding:"32px 0" }}>{tx.noAppt}</div>
              ) : (
                <table style={{ width:"100%", borderCollapse:"collapse", minWidth:"600px" }}>
                  <thead>
                    <tr>{[tx.patient, tx.date, tx.time, tx.status, tx.action].map(h=>(
                      <th key={h} style={{ textAlign:"left", padding:"10px 14px", fontSize:"11px", fontWeight:"700", color: textSecondary, textTransform:"uppercase", letterSpacing:"0.8px", borderBottom: border }}>{h}</th>
                    ))}</tr>
                  </thead>
                  <tbody>
                    {appointments.map(a => (
                      <tr key={a._id}>
                        <td style={{ padding:"14px", fontSize:"14px", color: textPrimary, borderBottom: tableBorder }}>{a.patientName || "Patient"}</td>
                        <td style={{ padding:"14px", fontSize:"14px", color: textPrimary, borderBottom: tableBorder }}>{a.date}</td>
                        <td style={{ padding:"14px", fontSize:"14px", color: textPrimary, borderBottom: tableBorder }}>{a.time}</td>
                        <td style={{ padding:"14px", borderBottom: tableBorder }}>
                          <span style={{ padding:"4px 12px", borderRadius:"20px", fontSize:"12px", fontWeight:"600",
                            background: a.status==="confirmed"?"rgba(72,187,120,0.15)":a.status==="cancelled"?"rgba(252,129,129,0.15)":"rgba(237,137,54,0.15)",
                            color: a.status==="confirmed"?"#68d391":a.status==="cancelled"?"#fc8181":"#f6ad55" }}>
                            {a.status || "pending"}
                          </span>
                        </td>
                        <td style={{ padding:"14px", borderBottom: tableBorder }}>
                          <div style={{ display:"flex", gap:"8px" }}>
                            {a.status !== "confirmed" && (
                              <button onClick={() => handleStatus(a._id, "confirmed")}
                                style={{ padding:"6px 14px", borderRadius:"8px", border:"none", background:"rgba(72,187,120,0.2)", color:"#68d391", fontWeight:"600", fontSize:"12px", cursor:"pointer" }}>
                                {tx.confirm}
                              </button>
                            )}
                            {a.status !== "cancelled" && (
                              <button onClick={() => handleStatus(a._id, "cancelled")}
                                style={{ padding:"6px 14px", borderRadius:"8px", border:"none", background:"rgba(252,129,129,0.2)", color:"#fc8181", fontWeight:"600", fontSize:"12px", cursor:"pointer" }}>
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

        {/* PROFILE PAGE */}
        {activePage === "profile" && (
          <div style={{ maxWidth:"500px", margin:"0 auto" }}>
            <div style={{ fontSize:"22px", fontWeight:"700", color: textPrimary, marginBottom:"24px" }}>{tx.profileTitle}</div>
            <div style={{ background: cardBg, borderRadius:"20px", padding:"36px", border, textAlign:"center", transition:"background 0.3s" }}>
              <div style={{ width:"80px", height:"80px", borderRadius:"50%", background:"linear-gradient(135deg,#00a8ff,#0057ff)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"32px", margin:"0 auto 20px" }}>
                👨‍⚕️
              </div>
              <div style={{ fontSize:"22px", fontWeight:"700", color: textPrimary, marginBottom:"6px" }}>Dr. {profile?.name}</div>
              <div style={{ fontSize:"14px", color:"#00a8ff", marginBottom:"24px" }}>{tx.doctor}</div>

              {[
                [tx.name, profile?.name],
                [tx.email, profile?.email],
                [tx.role, tx.doctor],
                [tx.feesLabel, `₹${fees || "N/A"}`],
                [tx.timing, timing || "N/A"],
              ].map(([label, val]) => (
                <div key={label} style={{ display:"flex", justifyContent:"space-between", padding:"14px 0", borderBottom: border }}>
                  <span style={{ fontSize:"14px", color: textSecondary, fontWeight:"600" }}>{label}</span>
                  <span style={{ fontSize:"14px", color: textPrimary, fontWeight:"600" }}>{val}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SETTINGS PAGE */}
        {activePage === "settings" && (
          <div style={{ maxWidth:"500px", margin:"0 auto" }}>
            <div style={{ fontSize:"22px", fontWeight:"700", color: textPrimary, marginBottom:"24px" }}>{tx.settings}</div>

            <div style={{ background: cardBg, borderRadius:"20px", padding:"28px", border, transition:"background 0.3s" }}>

              {/* Dark Mode */}
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px 0", borderBottom: border }}>
                <div>
                  <div style={{ fontSize:"15px", fontWeight:"600", color: textPrimary }}>🌙 {tx.darkMode}</div>
                  <div style={{ fontSize:"13px", color: textSecondary, marginTop:"2px" }}>{darkMode ? "Dark theme on" : "Light theme on"}</div>
                </div>
                <div onClick={() => setDarkMode(!darkMode)}
                  style={{ width:"48px", height:"26px", borderRadius:"13px", background: darkMode?"#00a8ff":"#cbd5e0", position:"relative", cursor:"pointer", transition:"background 0.2s" }}>
                  <div style={{ position:"absolute", top:"3px", left: darkMode?"24px":"3px", width:"20px", height:"20px", borderRadius:"50%", background:"#fff", transition:"left 0.2s" }} />
                </div>
              </div>

              {/* Language */}
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px 0", borderBottom: border }}>
                <div>
                  <div style={{ fontSize:"15px", fontWeight:"600", color: textPrimary }}>🌐 {tx.language}</div>
                  <div style={{ fontSize:"13px", color: textSecondary, marginTop:"2px" }}>{language === "hindi" ? "Hindi" : "English"}</div>
                </div>
                <div style={{ display:"flex", gap:"8px" }}>
                  <button onClick={() => setLanguage("hindi")}
                    style={{ padding:"8px 16px", borderRadius:"8px", border:"none", background: language==="hindi"?"#00a8ff":"rgba(255,255,255,0.1)", color: language==="hindi"?"#fff": textSecondary, fontWeight:"600", fontSize:"13px", cursor:"pointer" }}>
                    हिंदी
                  </button>
                  <button onClick={() => setLanguage("english")}
                    style={{ padding:"8px 16px", borderRadius:"8px", border:"none", background: language==="english"?"#00a8ff":"rgba(255,255,255,0.1)", color: language==="english"?"#fff": textSecondary, fontWeight:"600", fontSize:"13px", cursor:"pointer" }}>
                    English
                  </button>
                </div>
              </div>

              {/* Logout */}
              <div style={{ paddingTop:"20px" }}>
                <button onClick={handleLogout}
                  style={{ width:"100%", padding:"14px", borderRadius:"12px", border:"none", background:"rgba(229,62,62,0.15)", color:"#fc8181", fontWeight:"700", fontSize:"16px", cursor:"pointer" }}>
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