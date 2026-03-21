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

  useEffect(() => {
    API.get("/doctor/profile").then(r => {
      setProfile(r.data); setFees(r.data.fees ?? "");
      setTiming(r.data.timing ?? ""); setAvailable(r.data.available ?? true);
    }).catch(() => setMessage({ type:"error", text:"Profile load nahi hui." }));
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
      setAppointments(appointments.map(a =>
        a._id === id ? { ...a, status } : a
      ));
      setMessage({ type:"success", text:`Appointment ${status} ho gayi!` });
    } catch {
      setMessage({ type:"error", text:"Status update fail ho gaya." });
    }
  };

  const inp = { width:"100%", padding:"11px 14px", borderRadius:"10px", border:"1.5px solid rgba(255,255,255,0.1)", fontSize:"15px", outline:"none", boxSizing:"border-box", background:"rgba(255,255,255,0.06)", color:"#ffffff" };
  const lbl = { display:"block", fontSize:"12px", fontWeight:"600", color:"#a0aec0", marginBottom:"6px", letterSpacing:"0.5px" };

  return (
    <div style={{ minHeight:"100vh", background:"#0f1f3d", fontFamily:"'Segoe UI', sans-serif", position:"relative", overflow:"hidden" }}>

      <div style={{ position:"fixed", top:"-80px", left:"-80px", width:"300px", height:"300px", borderRadius:"50%", background:"rgba(0,168,255,0.07)", pointerEvents:"none" }} />
      <div style={{ position:"fixed", bottom:"-100px", right:"-60px", width:"350px", height:"350px", borderRadius:"50%", background:"rgba(0,168,255,0.05)", pointerEvents:"none" }} />

      {/* Navbar */}
      <nav style={{ background:"rgba(255,255,255,0.04)", borderBottom:"1px solid rgba(255,255,255,0.08)", padding:"0 32px", height:"64px", display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:100 }}>
        <div style={{ fontSize:"20px", fontWeight:"800", color:"#00a8ff", letterSpacing:"1px" }}>🌸 MUSKAN</div>
        <div style={{ display:"flex", alignItems:"center", gap:"16px" }}>
          <span style={{ fontSize:"14px", fontWeight:"600", color:"#a0aec0" }}>👨‍⚕️ Dr. {profile?.name || "..."}</span>
          <button onClick={() => { localStorage.removeItem("token"); navigate("/"); }}
            style={{ padding:"8px 18px", borderRadius:"8px", border:"1px solid rgba(229,62,62,0.4)", background:"rgba(229,62,62,0.1)", color:"#fc8181", fontWeight:"600", fontSize:"14px", cursor:"pointer" }}>
            Logout
          </button>
        </div>
      </nav>

      <div style={{ padding:"28px 32px", maxWidth:"1100px", margin:"0 auto", position:"relative", zIndex:1 }}>
        <div style={{ fontSize:"22px", fontWeight:"700", color:"#ffffff", marginBottom:"24px" }}>Doctor Dashboard</div>

        {/* Stat Cards */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:"16px", marginBottom:"24px" }}>
          {[
            ["Total Appointments", appointments.length, "#00a8ff"],
            ["Confirmed", appointments.filter(a=>a.status==="confirmed").length, "#48bb78"],
            ["Pending", appointments.filter(a=>a.status==="pending"||a.status==="Booked").length, "#ed8936"],
            ["Fees", `₹${fees||"—"}`, "#9f7aea"],
          ].map(([label, val, color]) => (
            <div key={label} style={{ background:"rgba(255,255,255,0.05)", borderRadius:"14px", padding:"20px 24px", border:"1px solid rgba(255,255,255,0.08)", borderTop:`3px solid ${color}` }}>
              <div style={{ fontSize:"13px", color:"#718096", fontWeight:"600", marginBottom:"6px" }}>{label}</div>
              <div style={{ fontSize:"24px", fontWeight:"800", color:"#ffffff" }}>{val}</div>
            </div>
          ))}
        </div>

        {/* Profile Update */}
        <div style={{ background:"rgba(255,255,255,0.05)", borderRadius:"14px", padding:"28px", border:"1px solid rgba(255,255,255,0.08)", marginBottom:"20px" }}>
          <div style={{ fontSize:"17px", fontWeight:"700", color:"#ffffff", marginBottom:"20px", paddingBottom:"14px", borderBottom:"1px solid rgba(255,255,255,0.08)" }}>
            Profile Update Karo
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"16px", marginBottom:"8px" }}>
            <div>
              <label style={lbl}>FEES (₹)</label>
              <input type="number" placeholder="e.g. 500" value={fees} onChange={e=>setFees(e.target.value)} style={inp}
                onFocus={e=>e.target.style.border="1.5px solid #00a8ff"}
                onBlur={e=>e.target.style.border="1.5px solid rgba(255,255,255,0.1)"} />
            </div>
            <div>
              <label style={lbl}>TIMING</label>
              <input type="text" placeholder="e.g. 10AM - 2PM" value={timing} onChange={e=>setTiming(e.target.value)} style={inp}
                onFocus={e=>e.target.style.border="1.5px solid #00a8ff"}
                onBlur={e=>e.target.style.border="1.5px solid rgba(255,255,255,0.1)"} />
            </div>
          </div>

          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px 0", borderTop:"1px solid rgba(255,255,255,0.06)", marginTop:"12px" }}>
            <div>
              <div style={{ fontSize:"15px", fontWeight:"600", color:"#ffffff" }}>Availability</div>
              <div style={{ fontSize:"13px", color:"#718096", marginTop:"2px" }}>
                {available ? "✅ Patients book kar sakte hain" : "❌ Abhi available nahi"}
              </div>
            </div>
            <div onClick={() => setAvailable(!available)}
              style={{ width:"48px", height:"26px", borderRadius:"13px", background: available?"#00a8ff":"rgba(255,255,255,0.15)", position:"relative", cursor:"pointer", transition:"background 0.2s" }}>
              <div style={{ position:"absolute", top:"3px", left: available?"24px":"3px", width:"20px", height:"20px", borderRadius:"50%", background:"#fff", boxShadow:"0 1px 4px rgba(0,0,0,0.3)", transition:"left 0.2s" }} />
            </div>
          </div>

          <button onClick={handleUpdate} disabled={loading}
            style={{ padding:"12px 32px", borderRadius:"10px", border:"none", background: loading?"#2d4a7a":"linear-gradient(135deg,#00a8ff,#0057ff)", color:"#fff", fontSize:"15px", fontWeight:"700", cursor: loading?"not-allowed":"pointer", marginTop:"16px", boxShadow: loading?"none":"0 4px 20px rgba(0,168,255,0.3)" }}>
            {loading ? "⏳ Save ho raha hai..." : "💾 Profile Save Karo"}
          </button>

          {message && (
            <div style={{ background: message.type==="success"?"rgba(72,187,120,0.15)":"rgba(197,48,48,0.15)", border:`1px solid ${message.type==="success"?"rgba(104,211,145,0.4)":"rgba(252,129,129,0.3)"}`, borderRadius:"10px", padding:"12px 16px", color: message.type==="success"?"#68d391":"#fc8181", fontSize:"14px", marginTop:"14px" }}>
              {message.type==="success" ? "✅" : "⚠️"} {message.text}
            </div>
          )}
        </div>

        {/* Appointments Table */}
        <div style={{ background:"rgba(255,255,255,0.05)", borderRadius:"14px", padding:"28px", border:"1px solid rgba(255,255,255,0.08)", overflowX:"auto" }}>
          <div style={{ fontSize:"17px", fontWeight:"700", color:"#ffffff", marginBottom:"20px", paddingBottom:"14px", borderBottom:"1px solid rgba(255,255,255,0.08)" }}>
            Mere Appointments
          </div>
          {appointments.length === 0 ? (
            <div style={{ textAlign:"center", color:"#4a5568", padding:"32px 0" }}>Abhi koi appointment nahi hai.</div>
          ) : (
            <table style={{ width:"100%", borderCollapse:"collapse", minWidth:"600px" }}>
              <thead>
                <tr>
                  {["Patient","Date","Time","Status","Action"].map(h=>(
                    <th key={h} style={{ textAlign:"left", padding:"10px 14px", fontSize:"11px", fontWeight:"700", color:"#718096", textTransform:"uppercase", letterSpacing:"0.8px", borderBottom:"1px solid rgba(255,255,255,0.08)", background:"rgba(255,255,255,0.03)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {appointments.map(a => (
                  <tr key={a._id}>
                    <td style={{ padding:"14px", fontSize:"14px", color:"#e2e8f0", borderBottom:"1px solid rgba(255,255,255,0.05)" }}>{a.patientName || "Patient"}</td>
                    <td style={{ padding:"14px", fontSize:"14px", color:"#e2e8f0", borderBottom:"1px solid rgba(255,255,255,0.05)" }}>{a.date}</td>
                    <td style={{ padding:"14px", fontSize:"14px", color:"#e2e8f0", borderBottom:"1px solid rgba(255,255,255,0.05)" }}>{a.time}</td>
                    <td style={{ padding:"14px", borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
                      <span style={{ padding:"4px 12px", borderRadius:"20px", fontSize:"12px", fontWeight:"600",
                        background: a.status==="confirmed"?"rgba(72,187,120,0.15)":a.status==="cancelled"?"rgba(252,129,129,0.15)":"rgba(237,137,54,0.15)",
                        color: a.status==="confirmed"?"#68d391":a.status==="cancelled"?"#fc8181":"#f6ad55" }}>
                        {a.status || "pending"}
                      </span>
                    </td>
                    <td style={{ padding:"14px", borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
                      <div style={{ display:"flex", gap:"8px" }}>
                        {a.status !== "confirmed" && (
                          <button onClick={() => handleStatus(a._id, "confirmed")}
                            style={{ padding:"6px 14px", borderRadius:"8px", border:"none", background:"rgba(72,187,120,0.2)", color:"#68d391", fontWeight:"600", fontSize:"12px", cursor:"pointer" }}>
                            ✓ Confirm
                          </button>
                        )}
                        {a.status !== "cancelled" && (
                          <button onClick={() => handleStatus(a._id, "cancelled")}
                            style={{ padding:"6px 14px", borderRadius:"8px", border:"none", background:"rgba(252,129,129,0.2)", color:"#fc8181", fontWeight:"600", fontSize:"12px", cursor:"pointer" }}>
                            ✕ Cancel
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
      </div>
    </div>
  );
}

export default DoctorDashboard;