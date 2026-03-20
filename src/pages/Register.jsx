import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/auth";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm]       = useState({ name:"", email:"", password:"", role:"patient" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) { setMessage({ type:"error", text:"Sab fields bharo." }); return; }
    setLoading(true); setMessage(null);
    try {
      await registerUser(form);
      setMessage({ type:"success", text:"Registration ho gayi! Ab login karo." });
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      setMessage({ type:"error", text: err.response?.data?.message || "Registration fail ho gayi." });
    } finally {
      setLoading(false);
    }
  };

  const inp = { width:"100%", padding:"12px 16px", borderRadius:"10px", border:"1.5px solid #e2e8f0", fontSize:"15px", marginBottom:"16px", outline:"none", boxSizing:"border-box", background:"#f8fafc" };
  const lbl = { display:"block", fontSize:"13px", fontWeight:"600", color:"#4a5568", marginBottom:"6px" };

  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(135deg,#667eea,#764ba2)", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Segoe UI',sans-serif", padding:"24px" }}>
      <div style={{ background:"#fff", borderRadius:"20px", padding:"44px 40px", width:"100%", maxWidth:"420px", boxShadow:"0 20px 60px rgba(0,0,0,0.2)" }}>
        <div style={{ textAlign:"center", marginBottom:"28px" }}>
          <div style={{ fontSize:"36px" }}>🏥</div>
          <h2 style={{ fontSize:"24px", fontWeight:"700", color:"#1a202c", margin:"8px 0 4px" }}>Account Banao</h2>
          <p style={{ color:"#718096", fontSize:"14px", margin:0 }}>MediBook pe register karo</p>
        </div>
        <form onSubmit={handleRegister}>
          <label style={lbl}>Poora Naam</label>
          <input type="text" name="name" placeholder="Apna naam" value={form.name} onChange={handleChange} style={inp} />

          <label style={lbl}>Email</label>
          <input type="email" name="email" placeholder="aapka@email.com" value={form.email} onChange={handleChange} style={inp} />

          <label style={lbl}>Password</label>
          <input type="password" name="password" placeholder="••••••••" value={form.password} onChange={handleChange} style={inp} />

          <label style={lbl}>Aap kya hain?</label>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px", marginBottom:"20px" }}>
            {[["patient","🤒","Patient"],["doctor","👨‍⚕️","Doctor"]].map(([val, icon, label]) => (
              <div key={val}
                onClick={() => setForm({ ...form, role: val })}
                style={{ padding:"14px", borderRadius:"12px", border:`2px solid ${form.role===val?"#667eea":"#e2e8f0"}`, background: form.role===val?"#f0f0ff":"#f8fafc", cursor:"pointer", textAlign:"center" }}>
                <div style={{ fontSize:"24px", marginBottom:"4px" }}>{icon}</div>
                <div style={{ fontSize:"14px", fontWeight:"600", color: form.role===val?"#667eea":"#4a5568" }}>{label}</div>
              </div>
            ))}
          </div>

          <button type="submit" disabled={loading}
            style={{ width:"100%", padding:"14px", borderRadius:"12px", border:"none", background:"linear-gradient(135deg,#667eea,#764ba2)", color:"#fff", fontSize:"16px", fontWeight:"700", cursor: loading?"not-allowed":"pointer", opacity: loading?0.7:1 }}>
            {loading ? "Register ho raha hai..." : "Register Karo"}
          </button>

          {message && (
            <div style={{ background: message.type==="success"?"#f0fff4":"#fff5f5", border:`1.5px solid ${message.type==="success"?"#68d391":"#fc8181"}`, borderRadius:"10px", padding:"12px", color: message.type==="success"?"#276749":"#c53030", fontSize:"14px", marginTop:"12px", textAlign:"center" }}>
              {message.text}
            </div>
          )}
        </form>
        <div style={{ textAlign:"center", marginTop:"20px", fontSize:"14px", color:"#718096" }}>
          Pehle se account hai?{" "}
          <span style={{ color:"#667eea", fontWeight:"700", cursor:"pointer" }} onClick={() => navigate("/")}>Login karo</span>
        </div>
      </div>
    </div>
  );
};

export default Register;