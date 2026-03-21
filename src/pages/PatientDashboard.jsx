import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

function PatientDashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [myAppts, setMyAppts] = useState([]);
  const [assigned, setAssigned] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingId, setBookingId] = useState(null);
  const [message, setMessage] = useState(null);
  const [modal, setModal] = useState({ open: false, doctor: null });
  const [bookDate, setBookDate] = useState("");
  const [bookTime, setBookTime] = useState("");
  const [modalErr, setModalErr] = useState("");
  const [activePage, setActivePage] = useState("home");
  const [darkMode, setDarkMode] = useState(true);
  const [language, setLanguage] = useState("hindi");
  const [editingProfile, setEditingProfile] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const t = {
    hindi: {
      dashboard: "Patient Dashboard", mereAppt: "Mere Appointments",
      availDoctors: "Available Doctors", assignedDoc: "Assigned Doctor",
      assignedTitle: "Tumhara Assigned Doctor", allDoctors: "Saare Doctors",
      bookKaro: "Book Karo", unavailable: "Unavailable",
      myApptTitle: "Mere Appointments", noAppt: "Abhi koi appointment nahi hai.",
      loading: "Load ho raha hai...", noDoctor: "Koi doctor nahi mila.",
      bookAppt: "📅 Appointment Book Karo", dateLabel: "Date", timeLabel: "Time",
      confirm: "Confirm ✓", cancel: "Cancel", booking: "Booking...",
      logout: "Logout", settings: "Settings", profileMenu: "Profile", home: "Home",
      darkMode: "Dark Mode", language: "Language",
      profileTitle: "Meri Profile", name: "Naam", email: "Email",
      role: "Patient", doctor: "Doctor", status: "Status",
      editProfile: "Profile Edit Karo", saveProfile: "Save Karo",
      cancelEdit: "Cancel", saving: "⏳ Saving...",
    },
    english: {
      dashboard: "Patient Dashboard", mereAppt: "My Appointments",
      availDoctors: "Available Doctors", assignedDoc: "Assigned Doctor",
      assignedTitle: "Your Assigned Doctor", allDoctors: "All Doctors",
      bookKaro: "Book Now", unavailable: "Unavailable",
      myApptTitle: "My Appointments", noAppt: "No appointments yet.",
      loading: "Loading...", noDoctor: "No doctors found.",
      bookAppt: "📅 Book Appointment", dateLabel: "Date", timeLabel: "Time",
      confirm: "Confirm ✓", cancel: "Cancel", booking: "Booking...",
      logout: "Logout", settings: "Settings", profileMenu: "Profile", home: "Home",
      darkMode: "Dark Mode", language: "Language",
      profileTitle: "My Profile", name: "Name", email: "Email",
      role: "Patient", doctor: "Doctor", status: "Status",
      editProfile: "Edit Profile", saveProfile: "Save",
      cancelEdit: "Cancel", saving: "⏳ Saving...",
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

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [d, a, p] = await Promise.all([
        API.get("/doctors"),
        API.get("/patient/appointments"),
        API.get("/patient/profile"),
      ]);
      setDoctors(d.data); setMyAppts(a.data);
      setProfile(p.data); setAssigned(p.data?.assignedDoctor || null);
    } catch { setMessage({ type: "error", text: "Data load nahi hua." }); }
    finally { setLoading(false); }
  };

  const openModal = (doc) => { setModal({ open: true, doctor: doc }); setBookDate(""); setBookTime(""); setModalErr(""); };

  const handleBook = async () => {
    if (!bookDate || !bookTime) { setModalErr("Date aur time dono bharo."); return; }
    const doc = modal.doctor;
    setBookingId(doc._id);
    try {
      await API.post("/appointments", { doctorId: doc._id, date: bookDate, time: bookTime });
      setModal({ open: false, doctor: null });
      setMessage({ type: "success", text: `✅ Dr. ${doc.name} ke saath appointment book ho gayi!` });
      fetchAll();
    } catch (err) { setModalErr(err.response?.data?.message || "Booking fail ho gayi."); }
    finally { setBookingId(null); }
  };

  const handleLogout = () => { localStorage.removeItem("token"); navigate("/"); };
  const today = new Date().toISOString().split("T")[0];

  const inp = {
    width: "100%", padding: "11px 14px", borderRadius: "10px",
    border: inputBorder, fontSize: "15px", marginBottom: "16px",
    outline: "none", boxSizing: "border-box", background: inputBg, color: inputColor
  };

  const navItems = [
    { id: "home", icon: "🏠", label: tx.home },
    { id: "profile", icon: "👤", label: tx.profileMenu },
    { id: "settings", icon: "⚙️", label: tx.settings },
  ];

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
          <div style={{ fontSize: "13px", fontWeight: "700", color: textPrimary }}>🤒 {profile?.name || "Patient"}</div>
          <div style={{ fontSize: "12px", color: textSecondary, marginTop: "2px" }}>{profile?.email}</div>
        </div>
        <button onClick={handleLogout}
          style={{ width: "100%", padding: "11px", borderRadius: "10px", border: "none", background: "rgba(229,62,62,0.1)", color: "#fc8181", fontWeight: "600", fontSize: "14px", cursor: "pointer" }}>
          🚪 {tx.logout}
        </button>
      </div>
    </div>
  );

  const BottomNav = () => (
    <>
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: "56px", background: navBg, borderBottom: border, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px", zIndex: 100 }}>
        <div style={{ fontSize: "16px", fontWeight: "800", color: "#00a8ff" }}>🌸 MUSKAN</div>
        <div style={{ fontSize: "13px", fontWeight: "600", color: textSecondary }}>🤒 {profile?.name || "Patient"}</div>
      </div>
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
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(130px,1fr))", gap: "12px", marginBottom: "20px" }}>
              {[
                [tx.mereAppt, myAppts.length, "#00a8ff"],
                [tx.availDoctors, doctors.filter(d => d.available).length, "#48bb78"],
                [tx.assignedDoc, assigned ? `Dr. ${assigned.name}` : "—", "#9f7aea"],
              ].map(([label, val, color]) => (
                <div key={label} style={{ background: cardBg, borderRadius: "12px", padding: "16px", border, borderTop: `3px solid ${color}` }}>
                  <div style={{ fontSize: "12px", color: textSecondary, fontWeight: "600", marginBottom: "4px" }}>{label}</div>
                  <div style={{ fontSize: typeof val === "string" && val.length > 6 ? "13px" : "22px", fontWeight: "800", color: textPrimary }}>{val}</div>
                </div>
              ))}
            </div>

            {/* Assigned Doctor */}
            {assigned && (
              <div style={{ background: cardBg, borderRadius: "14px", padding: "20px", border, marginBottom: "16px" }}>
                <div style={{ fontSize: "16px", fontWeight: "700", color: textPrimary, marginBottom: "14px", paddingBottom: "12px", borderBottom: border }}>⭐ {tx.assignedTitle}</div>
                <div style={{ background: "rgba(0,168,255,0.08)", border: "1.5px solid rgba(0,168,255,0.3)", borderRadius: "12px", padding: "16px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
                  <div>
                    <div style={{ fontWeight: "700", fontSize: "16px", color: textPrimary }}>Dr. {assigned.name}</div>
                    <div style={{ fontSize: "13px", color: textSecondary, marginTop: "4px" }}>
                      Fees: ₹{assigned.fees ?? "N/A"} • {assigned.timing ?? "N/A"}
                    </div>
                  </div>
                  <button onClick={() => openModal(assigned)}
                    style={{ padding: "10px 20px", borderRadius: "9px", border: "none", background: "linear-gradient(135deg,#00a8ff,#0057ff)", color: "#fff", fontWeight: "600", fontSize: "14px", cursor: "pointer" }}>
                    📅 {tx.bookKaro}
                  </button>
                </div>
              </div>
            )}

            {/* All Doctors */}
            <div style={{ background: cardBg, borderRadius: "14px", padding: "20px", border, marginBottom: "16px" }}>
              <div style={{ fontSize: "16px", fontWeight: "700", color: textPrimary, marginBottom: "16px", paddingBottom: "12px", borderBottom: border }}>{tx.allDoctors}</div>
              {loading ? <div style={{ textAlign: "center", color: textSecondary, padding: "24px 0" }}>{tx.loading}</div>
                : doctors.length === 0 ? <div style={{ textAlign: "center", color: textSecondary, padding: "24px 0" }}>{tx.noDoctor}</div>
                  : doctors.map(doc => (
                    <div key={doc._id} style={{ border, borderRadius: "12px", padding: "14px 16px", marginBottom: "10px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px", background: darkMode ? "rgba(255,255,255,0.03)" : "#f8fafc" }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: "700", fontSize: "14px", color: textPrimary }}>
                          <span style={{ display: "inline-block", width: "8px", height: "8px", borderRadius: "50%", background: doc.available ? "#48bb78" : "#fc8181", marginRight: "8px" }} />
                          Dr. {doc.name}
                        </div>
                        <div style={{ fontSize: "12px", color: textSecondary, marginTop: "4px" }}>
                          {doc.specialization && `${doc.specialization} • `}
                          {doc.qualification && `${doc.qualification} • `}
                          Fees: ₹{doc.fees ?? "N/A"}
                        </div>
                        {doc.address && <div style={{ fontSize: "11px", color: textSecondary, marginTop: "2px" }}>📍 {doc.address}</div>}
                      </div>
                      <button disabled={!doc.available} onClick={() => doc.available && openModal(doc)}
                        style={{ padding: "8px 18px", borderRadius: "9px", border: "none", background: doc.available ? "linear-gradient(135deg,#00a8ff,#0057ff)" : "rgba(255,255,255,0.08)", color: doc.available ? "#fff" : textSecondary, fontWeight: "600", fontSize: "13px", cursor: doc.available ? "pointer" : "not-allowed", flexShrink: 0 }}>
                        {doc.available ? tx.bookKaro : tx.unavailable}
                      </button>
                    </div>
                  ))}
            </div>

            {/* My Appointments */}
            <div style={{ background: cardBg, borderRadius: "14px", padding: "20px", border, overflowX: "auto" }}>
              <div style={{ fontSize: "16px", fontWeight: "700", color: textPrimary, marginBottom: "16px", paddingBottom: "12px", borderBottom: border }}>{tx.myApptTitle}</div>
              {myAppts.length === 0 ? <div style={{ textAlign: "center", color: textSecondary, padding: "24px 0" }}>{tx.noAppt}</div>
                : (
                  <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "400px" }}>
                    <thead>
                      <tr>{[tx.doctor, tx.dateLabel, tx.timeLabel, tx.status].map(h => (
                        <th key={h} style={{ textAlign: "left", padding: "10px 12px", fontSize: "11px", fontWeight: "700", color: textSecondary, textTransform: "uppercase", borderBottom: border }}>{h}</th>
                      ))}</tr>
                    </thead>
                    <tbody>
                      {myAppts.map(a => (
                        <tr key={a._id}>
                          <td style={{ padding: "12px", fontSize: "13px", color: textPrimary, borderBottom: tableBorder }}>Dr. {a.doctorName || "—"}</td>
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
          <div style={{ maxWidth: "500px", margin: "0 auto" }}>
            <div style={{ fontSize: "20px", fontWeight: "700", color: textPrimary, marginBottom: "20px" }}>{tx.profileTitle}</div>
            <div style={{ background: cardBg, borderRadius: "20px", padding: "24px", border }}>
              <div style={{ textAlign: "center", marginBottom: "20px" }}>
                <div style={{ width: "72px", height: "72px", borderRadius: "50%", background: "linear-gradient(135deg,#48bb78,#276749)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px", margin: "0 auto 10px" }}>🤒</div>
                <div style={{ fontSize: "18px", fontWeight: "700", color: textPrimary }}>{profile?.name}</div>
                <div style={{ fontSize: "13px", color: "#48bb78", marginTop: "4px" }}>{tx.role}</div>
              </div>

              {[
                [tx.name, profile?.name],
                [tx.email, profile?.email],
                [tx.role, tx.role],
                [tx.mereAppt, myAppts.length],
              ].map(([label, val]) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: border }}>
                  <span style={{ fontSize: "13px", color: textSecondary, fontWeight: "600" }}>{label}</span>
                  <span style={{ fontSize: "13px", color: textPrimary, fontWeight: "600" }}>{val}</span>
                </div>
              ))}
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
                <div style={{ fontSize: "15px", fontWeight: "600", color: textPrimary }}>🌐 {tx.language}</div>
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

      {/* Booking Modal */}
      {modal.open && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999, padding: "16px" }}>
          <div style={{ background: darkMode ? "#162033" : "#ffffff", borderRadius: "20px", padding: "28px", width: "100%", maxWidth: "400px", boxShadow: "0 20px 60px rgba(0,0,0,0.5)", border }}>
            <div style={{ fontSize: "17px", fontWeight: "700", color: textPrimary, marginBottom: "4px" }}>{tx.bookAppt}</div>
            <div style={{ fontSize: "13px", color: textSecondary, marginBottom: "20px" }}>Dr. {modal.doctor?.name} • ₹{modal.doctor?.fees}</div>

            <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: textSecondary, marginBottom: "6px" }}>{tx.dateLabel}</label>
            <input type="date" min={today} value={bookDate} onChange={e => setBookDate(e.target.value)} style={inp} />

            <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: textSecondary, marginBottom: "6px" }}>{tx.timeLabel}</label>
            <input type="time" value={bookTime} onChange={e => setBookTime(e.target.value)} style={inp} />

            {modalErr && <div style={{ color: "#fc8181", fontSize: "13px", marginBottom: "10px" }}>⚠️ {modalErr}</div>}

            <div style={{ display: "flex", gap: "12px" }}>
              <button onClick={() => setModal({ open: false, doctor: null })}
                style={{ flex: 1, padding: "12px", borderRadius: "10px", border: inputBorder, background: "transparent", color: textSecondary, fontWeight: "600", cursor: "pointer", fontSize: "14px" }}>
                {tx.cancel}
              </button>
              <button onClick={handleBook} disabled={!!bookingId}
                style={{ flex: 1, padding: "12px", borderRadius: "10px", border: "none", background: bookingId ? "#2d4a7a" : "linear-gradient(135deg,#00a8ff,#0057ff)", color: "#fff", fontWeight: "700", cursor: bookingId ? "not-allowed" : "pointer", fontSize: "14px" }}>
                {bookingId ? tx.booking : tx.confirm}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PatientDashboard;