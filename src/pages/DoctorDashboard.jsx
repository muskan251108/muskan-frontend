import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

function DoctorDashboard() {
  const navigate = useNavigate();
  const [profile, setProfile]             = useState(null);
  const [fees, setFees]                   = useState("");
  const [timing, setTiming]               = useState("");
  const [available, setAvailable]         = useState(true);
  const [specialization, setSpec]         = useState("");
  const [qualification, setQual]          = useState("");
  const [experience, setExp]              = useState("");
  const [address, setAddress]             = useState("");
  const [appointments, setAppointments]   = useState([]);
  const [loading, setLoading]             = useState(false);
  const [message, setMessage]             = useState(null);
  const [activePage, setActivePage]       = useState("home");
  const [darkMode, setDarkMode]           = useState(true);
  const [language, setLanguage]           = useState("hindi");
  const [editingProfile, setEditingProfile] = useState(false);
  const [editName, setEditName]           = useState("");
  const [editLoading, setEditLoading]     = useState(false);

  const t = {
    hindi: {
      dashboard: "Doctor Dashboard", totalAppt: "Total Appointments",
      confirmed: "Confirmed", pending: "Pending", fees: "Fees",
      updateProfile: "Profile Update Karo", feesLabel: "Fees (₹)",
      timingLabel: "Timing", availability: "Availability",
      availableOn: "✅ Patients book kar sakte hain",
      availableOff: "❌ Abhi available nahi",
      save: "💾 Save Karo", saving: "⏳ Save ho raha hai...",
      appointments: "Mere Appointments", patient: "Patient",
      date: "Date", time: "Time", status: "Status", action: "Action",
      noAppt: "Abhi koi appointment nahi hai.",
      confirm: "✓ Confirm", cancel: "✕ Cancel",
      logout: "Logout", settings: "Settings",
      profileMenu: "Profile", home: "Home",
      darkMode: "Dark Mode", language: "Language",
      profileTitle: "Meri Profile", name: "Naam", email: "Email",
      role: "Role", doctor: "Doctor", editProfile: "Profile Edit Karo",
      saveProfile: "Profile Save Karo", cancelEdit: "Cancel",
      spec: "Specialization", qual: "Qualification",
      exp: "Experience", addr: "Address",
    },
    english: {
      dashboard: "Doctor Dashboard", totalAppt: "Total Appointments",
      confirmed: "Confirmed", pending: "Pending", fees: "Fees",
      updateProfile: "Update Profile", feesLabel: "Fees (₹)",
      timingLabel: "Timing", availability: "Availability",
      availableOn: "✅ Patients can book appointments",
      availableOff: "❌ Not available right now",
      save: "💾 Save Profile", saving: "⏳ Saving...",
      appointments: "My Appointments", patient: "Patient",
      date: "Date", time: "Time", status: "Status", action: "Action",
      noAppt: "No appointments yet.",
      confirm: "✓ Confirm", cancel: "✕ Cancel",
      logout: "Logout", settings: "Settings",
      profileMenu: "Profile", home: "Home",
      darkMode: "Dark Mode", language: "Language",
      profileTitle: "My Profile", name: "Name", email: "Email",
      role: "Role", doctor: "Doctor", editProfile: "Edit Profile",
      saveProfile: "Save Profile", cancelEdit: "Cancel",
      spec: "Specialization", qual: "Qualification",
      exp: "Experience", addr: "Address",
    }
  };
  const tx = t[language];

  const bg            = darkMode ? "#0f1f3d" : "#f0f4f8";
  const cardBg        = darkMode ? "rgba(255,255,255,0.05)" : "#ffffff";
  const border        = darkMode ? "1px solid rgba(255,255,255,0.08)" : "1px solid #e2e8f0";
  const textPrimary   = darkMode ? "#ffffff" : "#1a202c";
  const textSecondary = darkMode ? "#a0aec0" : "#718096";
  const navBg         = darkMode ? "rgba(15,31,61,0.98)" : "#ffffff";
  const inputBg       = darkMode ? "rgba(255,255,255,0.06)" : "#f8fafc";
  const inputBorder   = darkMode ? "1.5px solid rgba(255,255,255,0.1)" : "1.5px solid #e2e8f0";
  const inputColor    = darkMode ? "#ffffff" : "#1a202c";
  const tableBorder   = darkMode ? "1px solid rgba(255,255,255,0.05)" : "1px solid #f0f4f8";

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
      setEditName(r.data.name ?? "");
    }).catch(() => {});
    API.get("/doctor/appointments").then(r => setAppointments(r.data)).catch(() => {});
  }, []);

  const handleUpdate = async () => {
    if (!fees || !timing) { setMessage({ type:"error", text:"Fees aur timing bharo." }); return; }
    setLoading(true); setMessage(null);
    try {
      await API.put("/doctor/profile", { fees: Number(fees), timing, available, specialization, qualification, experience, address });
      setMessage({ type:"success", text:"Profile update ho gayi!" });
    } catch (err) {
      setMessage({ type:"error", text: err.response?.data?.message || "Update fail ho gayi." });
    } finally { setLoading(false); }
  };

  const handleProfileEdit = async () => {
    setEditLoading(true);
    try {
      await API.put("/doctor/profile", {
        fees: Number(fees), timing, available,
        specialization, qualification, experience, address
      });
      setProfile(prev => ({ ...prev, specialization, qualification, experience, address }));
      setEditingProfile(false);
      setMessage({ type:"success", text:"Profile update ho gayi!" });
    } catch {
      setMessage({ type:"error", text:"Profile update fail ho gayi." });
    } finally { setEditLoading(false); }
  };

  const handleStatus = async (id, status) => {
    try {
      await API.put(`/appointments/${id}/status`, { status });
      setAppointments(appointments.map(a => a._id === id ? { ...a, status } : a));
      setMessage({ type:"success", text:`Appointment ${status}!` });
    } catch {
      setMessage({ type:"error", text:"Status update fail." });
    }
  };

  const handleLogout = () => { localStorage.removeItem("token"); navigate("/"); };

  const inp = {
    width:"100%", padding:"11px 14px", borderRadius:"10px",
    border: inputBorder, fontSize:"15px", outline:"none",
    boxSizing:"border-box", background: inputBg, color: inputColor,
    marginBottom:"14px",
  };

  const navItems = [
    { id:"home", icon:"🏠", label: tx.home },
    { id:"profile", icon:"👤", label: tx.profileMenu },
    { id:"settings", icon:"⚙️", label: tx.settings },
  ];

  return (
    <div style={{ minHeight:"100vh", background: bg, fontFamily:"'Segoe UI', sans-serif", transition:"background 0.3s", display:"flex" }}>

      {darkMode && <>
        <div style={{ position:"fixed", top:"-80px", left:"-80px", width:"300px", height:"300px", borderRadius:"50%", background:"rgba(0,168,255,0.07)", pointerEvents:"none", zIndex:0 }} />
        <div style={{ position:"fixed", bottom:"-100px", right:"-60px", width:"350px", height:"350px", borderRadius:"50%", background:"rgba(0,168,255,0.05)", pointerEvents:"none", zIndex:0 }} />
      </>}

      {/* LEFT SIDEBAR */}
      <div style={{ width:"220px", minHeight:"100vh", background: navBg, borderRight: border, display:"flex", flexDirection:"column", justifyContent:"space-between", padding:"24px 16px", position:"fixed", left:0, top:0, bottom:0, zIndex:100 }}>
        {/* Logo */}
        <div>
          <div style={{ fontSize:"18px", fontWeight:"800", color:"#00a8ff", letterSpacing:"1px", marginBottom:"32px", textAlign:"center" }}>🌸 MUSKAN</div>

          {/* Nav Items */}
          <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
            {navItems.map(item => (
              <button key={item.id} onClick={() => setActivePage(item.id)}
                style={{ padding:"12px 16px", borderRadius:"12px", border:"none", background: activePage===item.id ? "rgba(0,168,255,0.15)" : "transparent", color: activePage===item.id ? "#00a8ff" : textSecondary, fontWeight:"600", fontSize:"15px", cursor:"pointer", display:"flex", alignItems:"center", gap:"12px", transition:"all 0.2s", textAlign:"left" }}>
                <span style={{ fontSize:"20px" }}>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Bottom — User info + Logout */}
        <div>
          <div style={{ padding:"14px", borderRadius:"12px", background: darkMode?"rgba(255,255,255,0.05)":"#f0f4f8", marginBottom:"12px" }}>
            <div style={{ fontSize:"13px", fontWeight:"700", color: textPrimary }}>👨‍⚕️ Dr. {profile?.name || "..."}</div>
            <div style={{ fontSize:"12px", color: textSecondary, marginTop:"2px" }}>{profile?.email}</div>
          </div>
          <button onClick={handleLogout}
            style={{ width:"100%", padding:"11px", borderRadius:"10px", border:"none", background:"rgba(229,62,62,0.1)", color:"#fc8181", fontWeight:"600", fontSize:"14px", cursor:"pointer" }}>
            🚪 {tx.logout}
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ marginLeft:"220px", flex:1, padding:"28px 32px", position:"relative", zIndex:1, maxWidth:"calc(100% - 220px)" }}>

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
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))", gap:"16px", marginBottom:"24px" }}>
              {[
                [tx.totalAppt, appointments.length, "#00a8ff"],
                [tx.confirmed, appointments.filter(a=>a.status==="confirmed").length, "#48bb78"],
                [tx.pending, appointments.filter(a=>a.status==="pending"||a.status==="Booked").length, "#ed8936"],
                [tx.fees, `₹${fees||"—"}`, "#9f7aea"],
              ].map(([label, val, color]) => (
                <div key={label} style={{ background: cardBg, borderRadius:"14px", padding:"20px 24px", border, borderTop:`3px solid ${color}` }}>
                  <div style={{ fontSize:"13px", color: textSecondary, fontWeight:"600", marginBottom:"6px" }}>{label}</div>
                  <div style={{ fontSize:"24px", fontWeight:"800", color: textPrimary }}>{val}</div>
                </div>
              ))}
            </div>

            {/* Profile Update */}
            <div style={{ background: cardBg, borderRadius:"14px", padding:"28px", border, marginBottom:"20px" }}>
              <div style={{ fontSize:"17px", fontWeight:"700", color: textPrimary, marginBottom:"20px", paddingBottom:"14px", borderBottom: border }}>{tx.updateProfile}</div>

              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"16px" }}>
                <div>
                  <label style={{ display:"block", fontSize:"12px", fontWeight:"600", color: textSecondary, marginBottom:"6px" }}>{tx.feesLabel}</label>
                  <input type="number" placeholder="e.g. 500" value={fees} onChange={e=>setFees(e.target.value)} style={inp} />
                </div>
                <div>
                  <label style={{ display:"block", fontSize:"12px", fontWeight:"600", color: textSecondary, marginBottom:"6px" }}>{tx.timingLabel}</label>
                  <input type="text" placeholder="e.g. 10AM - 2PM" value={timing} onChange={e=>setTiming(e.target.value)} style={inp} />
                </div>
                <div>
                  <label style={{ display:"block", fontSize:"12px", fontWeight:"600", color: textSecondary, marginBottom:"6px" }}>{tx.spec}</label>
                  <input type="text" placeholder="e.g. Cardiologist" value={specialization} onChange={e=>setSpec(e.target.value)} style={inp} />
                </div>
                <div>
                  <label style={{ display:"block", fontSize:"12px", fontWeight:"600", color: textSecondary, marginBottom:"6px" }}>{tx.qual}</label>
                  <input type="text" placeholder="e.g. MBBS, MD" value={qualification} onChange={e=>setQual(e.target.value)} style={inp} />
                </div>
                <div>
                  <label style={{ display:"block", fontSize:"12px", fontWeight:"600", color: textSecondary, marginBottom:"6px" }}>{tx.exp}</label>
                  <input type="text" placeholder="e.g. 5 years" value={experience} onChange={e=>setExp(e.target.value)} style={inp} />
                </div>
                <div>
                  <label style={{ display:"block", fontSize:"12px", fontWeight:"600", color: textSecondary, marginBottom:"6px" }}>{tx.addr}</label>
                  <input type="text" placeholder="e.g. Delhi, India" value={address} onChange={e=>setAddress(e.target.value)} style={inp} />
                </div>
              </div>

              {/* Availability Toggle */}
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px 0", borderTop: border, marginTop:"4px" }}>
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
                style={{ padding:"12px 32px", borderRadius:"10px", border:"none", background: loading?"#2d4a7a":"linear-gradient(135deg,#00a8ff,#0057ff)", color:"#fff", fontSize:"15px", fontWeight:"700", cursor: loading?"not-allowed":"pointer", marginTop:"8px" }}>
                {loading ? tx.saving : tx.save}
              </button>

              {message && (
                <div style={{ background: message.type==="success"?"rgba(72,187,120,0.15)":"rgba(197,48,48,0.15)", border:`1px solid ${message.type==="success"?"rgba(104,211,145,0.4)":"rgba(252,129,129,0.3)"}`, borderRadius:"10px", padding:"12px 16px", color: message.type==="success"?"#68d391":"#fc8181", fontSize:"14px", marginTop:"14px" }}>
                  {message.text}
                </div>
              )}
            </div>

            {/* Appointments Table */}
            <div style={{ background: cardBg, borderRadius:"14px", padding:"28px", border, overflowX:"auto" }}>
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
          <div style={{ maxWidth:"600px", margin:"0 auto" }}>
            <div style={{ fontSize:"22px", fontWeight:"700", color: textPrimary, marginBottom:"24px" }}>{tx.profileTitle}</div>

            <div style={{ background: cardBg, borderRadius:"20px", padding:"36px", border }}>
              {/* Avatar */}
              <div style={{ textAlign:"center", marginBottom:"28px" }}>
                <div style={{ width:"80px", height:"80px", borderRadius:"50%", background:"linear-gradient(135deg,#00a8ff,#0057ff)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"32px", margin:"0 auto 12px" }}>
                  👨‍⚕️
                </div>
                <div style={{ fontSize:"20px", fontWeight:"700", color: textPrimary }}>Dr. {profile?.name}</div>
                <div style={{ fontSize:"13px", color:"#00a8ff", marginTop:"4px" }}>{specialization || tx.doctor}</div>
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
                    <div key={label} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"13px 0", borderBottom: border }}>
                      <span style={{ fontSize:"14px", color: textSecondary, fontWeight:"600" }}>{label}</span>
                      <span style={{ fontSize:"14px", color: textPrimary, fontWeight:"600", maxWidth:"60%", textAlign:"right" }}>{val}</span>
                    </div>
                  ))}

                  <button onClick={() => setEditingProfile(true)}
                    style={{ width:"100%", padding:"13px", borderRadius:"12px", border:"none", background:"linear-gradient(135deg,#00a8ff,#0057ff)", color:"#fff", fontWeight:"700", fontSize:"15px", cursor:"pointer", marginTop:"20px" }}>
                    ✏️ {tx.editProfile}
                  </button>
                </>
              ) : (
                <>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"14px" }}>
                    {[
                      [tx.spec, specialization, setSpec, "e.g. Cardiologist"],
                      [tx.qual, qualification, setQual, "e.g. MBBS, MD"],
                      [tx.exp, experience, setExp, "e.g. 5 years"],
                      [tx.addr, address, setAddress, "e.g. Delhi, India"],
                      [tx.feesLabel, fees, setFees, "e.g. 500"],
                      [tx.timingLabel, timing, setTiming, "e.g. 10AM - 2PM"],
                    ].map(([label, val, setter, ph]) => (
                      <div key={label}>
                        <label style={{ display:"block", fontSize:"12px", fontWeight:"600", color: textSecondary, marginBottom:"6px" }}>{label}</label>
                        <input type="text" placeholder={ph} value={val} onChange={e=>setter(e.target.value)}
                          style={{ width:"100%", padding:"10px 14px", borderRadius:"10px", border: inputBorder, fontSize:"14px", outline:"none", boxSizing:"border-box", background: inputBg, color: inputColor }} />
                      </div>
                    ))}
                  </div>

                  <div style={{ display:"flex", gap:"12px", marginTop:"20px" }}>
                    <button onClick={() => setEditingProfile(false)}
                      style={{ flex:1, padding:"12px", borderRadius:"10px", border: inputBorder, background:"transparent", color: textSecondary, fontWeight:"600", cursor:"pointer", fontSize:"14px" }}>
                      {tx.cancelEdit}
                    </button>
                    <button onClick={handleProfileEdit} disabled={editLoading}
                      style={{ flex:2, padding:"12px", borderRadius:"10px", border:"none", background:"linear-gradient(135deg,#00a8ff,#0057ff)", color:"#fff", fontWeight:"700", cursor: editLoading?"not-allowed":"pointer", fontSize:"14px" }}>
                      {editLoading ? tx.saving : `💾 ${tx.saveProfile}`}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* SETTINGS PAGE */}
        {activePage === "settings" && (
          <div style={{ maxWidth:"500px", margin:"0 auto" }}>
            <div style={{ fontSize:"22px", fontWeight:"700", color: textPrimary, marginBottom:"24px" }}>{tx.settings}</div>
            <div style={{ background: cardBg, borderRadius:"20px", padding:"28px", border }}>

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