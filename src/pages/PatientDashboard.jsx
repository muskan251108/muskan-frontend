import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

function PatientDashboard() {
  const navigate = useNavigate();
  const [profile, setProfile]       = useState(null);
  const [doctors, setDoctors]       = useState([]);
  const [myAppts, setMyAppts]       = useState([]);
  const [assigned, setAssigned]     = useState(null);
  const [loading, setLoading]       = useState(true);
  const [bookingId, setBookingId]   = useState(null);
  const [message, setMessage]       = useState(null);
  const [modal, setModal]           = useState({ open:false, doctor:null });
  const [bookDate, setBookDate]     = useState("");
  const [bookTime, setBookTime]     = useState("");
  const [modalErr, setModalErr]     = useState("");

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
    } catch { setMessage({ type:"error", text:"Data load nahi hua." }); }
    finally { setLoading(false); }
  };

  const openModal = (doc) => { setModal({ open:true, doctor:doc }); setBookDate(""); setBookTime(""); setModalErr(""); };

  const handleBook = async () => {
    if (!bookDate || !bookTime) { setModalErr("Date aur time dono bharo."); return; }
    const doc = modal.doctor;
    setBookingId(doc._id);
    try {
      await API.post("/appointments", { doctorId:doc._id, date:bookDate, time:bookTime });
      setModal({ open:false, doctor:null });
      setMessage({ type:"success", text:`✅ Dr. ${doc.name} ke saath appointment book ho gayi!` });
      fetchAll();
    } catch (err) { setModalErr(err.response?.data?.message || "Booking fail ho gayi."); }
    finally { setBookingId(null); }
  };

  const today = new Date().toISOString().split("T")[0];
  const inp = { width:"100%", padding:"11px 14px", borderRadius:"10px", border:"1.5px solid rgba(255,255,255,0.1)", fontSize:"15px", marginBottom:"16px", outline:"none", boxSizing:"border-box", background:"rgba(255,255,255,0.06)", color:"#ffffff" };

  return (
    <div style={{ minHeight:"100vh", background:"#0f1f3d", fontFamily:"'Segoe UI', sans-serif", position:"relative", overflow:"hidden" }}>

      {/* BG circles */}
      <div style={{ position:"fixed", top:"-80px", left:"-80px", width:"300px", height:"300px", borderRadius:"50%", background:"rgba(0,168,255,0.07)", pointerEvents:"none" }} />
      <div style={{ position:"fixed", bottom:"-100px", right:"-60px", width:"350px", height:"350px", borderRadius:"50%", background:"rgba(0,168,255,0.05)", pointerEvents:"none" }} />

      {/* Navbar */}
      <nav style={{ background:"rgba(255,255,255,0.04)", borderBottom:"1px solid rgba(255,255,255,0.08)", backdropFilter:"blur(10px)", padding:"0 32px", height:"64px", display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:100 }}>
        <div style={{ fontSize:"20px", fontWeight:"800", color:"#00a8ff", letterSpacing:"1px" }}>🌸 MUSKAN</div>
        <div style={{ display:"flex", alignItems:"center", gap:"16px" }}>
          <span style={{ fontSize:"14px", fontWeight:"600", color:"#a0aec0" }}>🤒 {profile?.name || "Patient"}</span>
          <button onClick={() => { localStorage.removeItem("token"); navigate("/"); }}
            style={{ padding:"8px 18px", borderRadius:"8px", border:"1px solid rgba(229,62,62,0.4)", background:"rgba(229,62,62,0.1)", color:"#fc8181", fontWeight:"600", fontSize:"14px", cursor:"pointer" }}>
            Logout
          </button>
        </div>
      </nav>

      <div style={{ padding:"28px 32px", maxWidth:"1000px", margin:"0 auto", position:"relative", zIndex:1 }}>
        <div style={{ fontSize:"22px", fontWeight:"700", color:"#ffffff", marginBottom:"24px" }}>Patient Dashboard</div>

        {message && (
          <div style={{ background: message.type==="success"?"rgba(72,187,120,0.15)":"rgba(197,48,48,0.15)", border:`1px solid ${message.type==="success"?"rgba(104,211,145,0.4)":"rgba(252,129,129,0.3)"}`, borderRadius:"10px", padding:"12px 16px", color: message.type==="success"?"#68d391":"#fc8181", fontSize:"14px", marginBottom:"16px" }}>
            {message.text}
          </div>
        )}

        {/* Stats */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:"16px", marginBottom:"24px" }}>
          {[
            ["Mere Appointments", myAppts.length, "#00a8ff"],
            ["Available Doctors", doctors.filter(d=>d.available).length, "#48bb78"],
            ["Assigned Doctor", assigned ? `Dr. ${assigned.name}` : "—", "#9f7aea"],
          ].map(([label, val, color]) => (
            <div key={label} style={{ background:"rgba(255,255,255,0.05)", borderRadius:"14px", padding:"20px 24px", border:"1px solid rgba(255,255,255,0.08)", borderTop:`3px solid ${color}` }}>
              <div style={{ fontSize:"13px", color:"#718096", fontWeight:"600", marginBottom:"6px" }}>{label}</div>
              <div style={{ fontSize: typeof val==="string"&&val.length>6?"15px":"24px", fontWeight:"800", color:"#ffffff" }}>{val}</div>
            </div>
          ))}
        </div>

        {/* Assigned Doctor */}
        {assigned && (
          <div style={{ background:"rgba(255,255,255,0.05)", borderRadius:"14px", padding:"28px", border:"1px solid rgba(255,255,255,0.08)", marginBottom:"20px" }}>
            <div style={{ fontSize:"17px", fontWeight:"700", color:"#ffffff", marginBottom:"16px", paddingBottom:"14px", borderBottom:"1px solid rgba(255,255,255,0.08)" }}>⭐ Tumhara Assigned Doctor</div>
            <div style={{ background:"rgba(0,168,255,0.08)", border:"1.5px solid rgba(0,168,255,0.3)", borderRadius:"12px", padding:"18px 22px", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:"12px" }}>
              <div>
                <div style={{ fontWeight:"700", fontSize:"17px", color:"#ffffff" }}>Dr. {assigned.name}</div>
                <div style={{ fontSize:"13px", color:"#718096", marginTop:"4px" }}>
                  {assigned.specialization && `${assigned.specialization} • `}Fees: ₹{assigned.fees ?? "N/A"} • Timing: {assigned.timing ?? "N/A"}
                </div>
              </div>
              <button onClick={() => openModal(assigned)}
                style={{ padding:"10px 22px", borderRadius:"9px", border:"none", background:"linear-gradient(135deg,#00a8ff,#0057ff)", color:"#fff", fontWeight:"600", fontSize:"14px", cursor:"pointer", boxShadow:"0 4px 15px rgba(0,168,255,0.3)" }}>
                📅 Book Karo
              </button>
            </div>
          </div>
        )}

        {/* All Doctors */}
        <div style={{ background:"rgba(255,255,255,0.05)", borderRadius:"14px", padding:"28px", border:"1px solid rgba(255,255,255,0.08)", marginBottom:"20px" }}>
          <div style={{ fontSize:"17px", fontWeight:"700", color:"#ffffff", marginBottom:"20px", paddingBottom:"14px", borderBottom:"1px solid rgba(255,255,255,0.08)" }}>Saare Doctors</div>
          {loading ? <div style={{ textAlign:"center", color:"#4a5568", padding:"32px 0" }}>Load ho raha hai...</div>
          : doctors.length === 0 ? <div style={{ textAlign:"center", color:"#4a5568", padding:"32px 0" }}>Koi doctor nahi mila.</div>
          : doctors.map(doc => (
            <div key={doc._id} style={{ border:"1px solid rgba(255,255,255,0.08)", borderRadius:"12px", padding:"16px 20px", marginBottom:"12px", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:"12px", background:"rgba(255,255,255,0.03)" }}>
              <div>
                <div style={{ fontWeight:"700", fontSize:"15px", color:"#e2e8f0" }}>
                  <span style={{ display:"inline-block", width:"8px", height:"8px", borderRadius:"50%", background: doc.available?"#48bb78":"#fc8181", marginRight:"8px" }} />
                  Dr. {doc.name}
                </div>
                <div style={{ fontSize:"13px", color:"#718096", marginTop:"4px" }}>
                  {doc.specialization && `${doc.specialization} • `}Fees: ₹{doc.fees ?? "N/A"} • Timing: {doc.timing ?? "N/A"}
                </div>
              </div>
              <button disabled={!doc.available} onClick={() => doc.available && openModal(doc)}
                style={{ padding:"9px 22px", borderRadius:"9px", border:"none", background: doc.available?"linear-gradient(135deg,#00a8ff,#0057ff)":"rgba(255,255,255,0.08)", color: doc.available?"#fff":"#4a5568", fontWeight:"600", fontSize:"14px", cursor: doc.available?"pointer":"not-allowed", boxShadow: doc.available?"0 4px 15px rgba(0,168,255,0.25)":"none" }}>
                {doc.available ? "Book Karo" : "Unavailable"}
              </button>
            </div>
          ))}
        </div>

        {/* My Appointments */}
        <div style={{ background:"rgba(255,255,255,0.05)", borderRadius:"14px", padding:"28px", border:"1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ fontSize:"17px", fontWeight:"700", color:"#ffffff", marginBottom:"20px", paddingBottom:"14px", borderBottom:"1px solid rgba(255,255,255,0.08)" }}>Mere Appointments</div>
          {myAppts.length === 0 ? <div style={{ textAlign:"center", color:"#4a5568", padding:"32px 0" }}>Abhi koi appointment nahi hai.</div>
          : (
            <table style={{ width:"100%", borderCollapse:"collapse" }}>
              <thead>
                <tr>{["Doctor","Date","Time","Status"].map(h=>(
                  <th key={h} style={{ textAlign:"left", padding:"10px 14px", fontSize:"11px", fontWeight:"700", color:"#718096", textTransform:"uppercase", letterSpacing:"0.8px", borderBottom:"1px solid rgba(255,255,255,0.08)", background:"rgba(255,255,255,0.03)" }}>{h}</th>
                ))}</tr>
              </thead>
              <tbody>
                {myAppts.map(a => (
                  <tr key={a._id}>
                    <td style={{ padding:"14px", fontSize:"14px", color:"#e2e8f0", borderBottom:"1px solid rgba(255,255,255,0.05)" }}>Dr. {a.doctorName || a.doctor?.name || "—"}</td>
                    <td style={{ padding:"14px", fontSize:"14px", color:"#e2e8f0", borderBottom:"1px solid rgba(255,255,255,0.05)" }}>{a.date}</td>
                    <td style={{ padding:"14px", fontSize:"14px", color:"#e2e8f0", borderBottom:"1px solid rgba(255,255,255,0.05)" }}>{a.time}</td>
                    <td style={{ padding:"14px", borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
                      <span style={{ padding:"4px 12px", borderRadius:"20px", fontSize:"12px", fontWeight:"600",
                        background: a.status==="confirmed"?"rgba(72,187,120,0.15)":a.status==="pending"?"rgba(237,137,54,0.15)":"rgba(252,129,129,0.15)",
                        color: a.status==="confirmed"?"#68d391":a.status==="pending"?"#f6ad55":"#fc8181" }}>
                        {a.status || "pending"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Booking Modal */}
      {modal.open && (
        <div style={{ position:"fixed", top:0, left:0, right:0, bottom:0, background:"rgba(0,0,0,0.7)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:999 }}>
          <div style={{ background:"#162033", borderRadius:"20px", padding:"36px", width:"100%", maxWidth:"400px", boxShadow:"0 20px 60px rgba(0,0,0,0.5)", margin:"16px", border:"1px solid rgba(255,255,255,0.1)" }}>
            <div style={{ fontSize:"18px", fontWeight:"700", color:"#ffffff", marginBottom:"4px" }}>📅 Appointment Book Karo</div>
            <div style={{ fontSize:"13px", color:"#718096", marginBottom:"24px" }}>Dr. {modal.doctor?.name} • ₹{modal.doctor?.fees} • {modal.doctor?.timing}</div>

            <label style={{ display:"block", fontSize:"12px", fontWeight:"600", color:"#a0aec0", marginBottom:"6px", letterSpacing:"0.5px" }}>DATE</label>
            <input type="date" min={today} value={bookDate} onChange={e=>setBookDate(e.target.value)} style={inp}
              onFocus={e=>e.target.style.border="1.5px solid #00a8ff"}
              onBlur={e=>e.target.style.border="1.5px solid rgba(255,255,255,0.1)"} />

            <label style={{ display:"block", fontSize:"12px", fontWeight:"600", color:"#a0aec0", marginBottom:"6px", letterSpacing:"0.5px" }}>TIME</label>
            <input type="time" value={bookTime} onChange={e=>setBookTime(e.target.value)} style={inp}
              onFocus={e=>e.target.style.border="1.5px solid #00a8ff"}
              onBlur={e=>e.target.style.border="1.5px solid rgba(255,255,255,0.1)"} />

            {modalErr && <div style={{ color:"#fc8181", fontSize:"13px", marginBottom:"10px" }}>⚠️ {modalErr}</div>}

            <div style={{ display:"flex", gap:"12px" }}>
              <button onClick={() => setModal({ open:false, doctor:null })}
                style={{ flex:1, padding:"12px", borderRadius:"10px", border:"1px solid rgba(255,255,255,0.1)", background:"rgba(255,255,255,0.05)", color:"#a0aec0", fontWeight:"600", cursor:"pointer", fontSize:"14px" }}>
                Cancel
              </button>
              <button onClick={handleBook} disabled={!!bookingId}
                style={{ flex:1, padding:"12px", borderRadius:"10px", border:"none", background: bookingId?"#2d4a7a":"linear-gradient(135deg,#00a8ff,#0057ff)", color:"#fff", fontWeight:"700", cursor: bookingId?"not-allowed":"pointer", fontSize:"14px", boxShadow: bookingId?"none":"0 4px 15px rgba(0,168,255,0.3)" }}>
                {bookingId ? "⏳ Booking..." : "Confirm ✓"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PatientDashboard;