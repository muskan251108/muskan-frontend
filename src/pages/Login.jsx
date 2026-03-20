import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/auth";

const Login = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null); // null = role choose screen
  const [form, setForm]       = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { setError("Email aur password dono bharo."); return; }
    setLoading(true); setError("");
    try {
      const res = await loginUser(form);
      localStorage.setItem("token", res.data.token);
      const payload = JSON.parse(atob(res.data.token.split(".")[1]));
      navigate(payload.role === "doctor" ? "/doctor" : "/patient");
    } catch (err) {
      setError(err.response?.data?.message || "Login fail ho gaya.");
    } finally {
      setLoading(false);
    }
  };

  // =====================
  // SCREEN 1 — Role Choose
  // =====================
  if (!selectedRole) {
    return (
      <div style={{
        minHeight: "100vh", background: "#0f1f3d",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        fontFamily: "'Segoe UI', sans-serif", padding: "24px",
        position: "relative", overflow: "hidden",
      }}>
        {/* BG circles */}
        <div style={{ position:"absolute", top:"-80px", left:"-80px", width:"300px", height:"300px", borderRadius:"50%", background:"rgba(0,168,255,0.07)", pointerEvents:"none" }} />
        <div style={{ position:"absolute", bottom:"-100px", right:"-60px", width:"350px", height:"350px", borderRadius:"50%", background:"rgba(0,168,255,0.05)", pointerEvents:"none" }} />

        {/* Logo */}
        <div style={{ textAlign:"center", marginBottom:"52px" }}>
          <div style={{ fontSize:"56px", marginBottom:"12px" }}>🏥</div>
          <div style={{ fontSize:"32px", fontWeight:"800", color:"#ffffff", letterSpacing:"2px" }}>MUSKAN</div>
          <div style={{ fontSize:"13px", color:"#00a8ff", letterSpacing:"3px", marginTop:"6px", textTransform:"uppercase" }}>The Way to Happiness</div>
        </div>

        <p style={{ color:"#a0aec0", fontSize:"16px", marginBottom:"36px", textAlign:"center" }}>
          Aap kaun hain? Please select karo 👇
        </p>

        {/* Role Cards */}
        <div style={{ display:"flex", gap:"24px", flexWrap:"wrap", justifyContent:"center" }}>
          
          {/* Doctor Card */}
          <div
            onClick={() => setSelectedRole("doctor")}
            style={{
              background:"rgba(255,255,255,0.05)", border:"1.5px solid rgba(0,168,255,0.3)",
              borderRadius:"20px", padding:"40px 36px", textAlign:"center",
              cursor:"pointer", width:"200px", transition:"all 0.2s",
              boxShadow:"0 4px 24px rgba(0,168,255,0.1)",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "rgba(0,168,255,0.12)";
              e.currentTarget.style.border = "1.5px solid #00a8ff";
              e.currentTarget.style.transform = "translateY(-4px)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "rgba(255,255,255,0.05)";
              e.currentTarget.style.border = "1.5px solid rgba(0,168,255,0.3)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <div style={{ fontSize:"56px", marginBottom:"16px" }}>👨‍⚕️</div>
            <div style={{ fontSize:"20px", fontWeight:"700", color:"#ffffff", marginBottom:"8px" }}>Doctor</div>
            <div style={{ fontSize:"13px", color:"#718096", lineHeight:"1.6" }}>Appointments manage karo, profile update karo</div>
            <div style={{ marginTop:"20px", padding:"10px 20px", borderRadius:"10px", background:"linear-gradient(135deg,#00a8ff,#0057ff)", color:"#fff", fontSize:"14px", fontWeight:"600" }}>
              Doctor Login →
            </div>
          </div>

          {/* Patient Card */}
          <div
            onClick={() => setSelectedRole("patient")}
            style={{
              background:"rgba(255,255,255,0.05)", border:"1.5px solid rgba(72,187,120,0.3)",
              borderRadius:"20px", padding:"40px 36px", textAlign:"center",
              cursor:"pointer", width:"200px", transition:"all 0.2s",
              boxShadow:"0 4px 24px rgba(72,187,120,0.1)",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "rgba(72,187,120,0.12)";
              e.currentTarget.style.border = "1.5px solid #48bb78";
              e.currentTarget.style.transform = "translateY(-4px)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "rgba(255,255,255,0.05)";
              e.currentTarget.style.border = "1.5px solid rgba(72,187,120,0.3)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <div style={{ fontSize:"56px", marginBottom:"16px" }}>🤒</div>
            <div style={{ fontSize:"20px", fontWeight:"700", color:"#ffffff", marginBottom:"8px" }}>Patient</div>
            <div style={{ fontSize:"13px", color:"#718096", lineHeight:"1.6" }}>Doctor dhundo aur appointment book karo</div>
            <div style={{ marginTop:"20px", padding:"10px 20px", borderRadius:"10px", background:"linear-gradient(135deg,#48bb78,#276749)", color:"#fff", fontSize:"14px", fontWeight:"600" }}>
              Patient Login →
            </div>
          </div>
        </div>

        {/* Register link */}
        <div style={{ marginTop:"44px", textAlign:"center" }}>
          <span style={{ color:"#718096", fontSize:"14px" }}>Naya account? </span>
          <span style={{ color:"#00a8ff", fontWeight:"700", cursor:"pointer", fontSize:"14px" }} onClick={() => navigate("/register")}>
            Register karo →
          </span>
        </div>

        <div style={{ marginTop:"32px", color:"rgba(255,255,255,0.15)", fontSize:"11px" }}>
          © 2024 MUSKAN Healthcare • All rights reserved
        </div>
      </div>
    );
  }

  // =====================
  // SCREEN 2 — Login Form
  // =====================
  const isDoctor = selectedRole === "doctor";
  const accent   = isDoctor ? "#00a8ff" : "#48bb78";
  const btnBg    = isDoctor
    ? "linear-gradient(135deg,#00a8ff,#0057ff)"
    : "linear-gradient(135deg,#48bb78,#276749)";

  return (
    <div style={{
      minHeight:"100vh", background:"#0f1f3d",
      display:"flex", flexDirection:"column",
      alignItems:"center", justifyContent:"center",
      fontFamily:"'Segoe UI',sans-serif", padding:"24px",
      position:"relative", overflow:"hidden",
    }}>
      <div style={{ position:"absolute", top:"-80px", left:"-80px", width:"300px", height:"300px", borderRadius:"50%", background:"rgba(0,168,255,0.07)", pointerEvents:"none" }} />
      <div style={{ position:"absolute", bottom:"-100px", right:"-60px", width:"350px", height:"350px", borderRadius:"50%", background:"rgba(0,168,255,0.05)", pointerEvents:"none" }} />

      <div style={{ width:"100%", maxWidth:"420px" }}>

        {/* Back button */}
        <button
          onClick={() => { setSelectedRole(null); setError(""); setForm({ email:"", password:"" }); }}
          style={{ background:"transparent", border:"none", color:"#718096", fontSize:"14px", cursor:"pointer", marginBottom:"24px", padding:0, display:"flex", alignItems:"center", gap:"6px" }}
        >
          ← Wapas jao
        </button>

        {/* Header */}
        <div style={{ textAlign:"center", marginBottom:"36px" }}>
          <div style={{ fontSize:"48px", marginBottom:"10px" }}>{isDoctor ? "👨‍⚕️" : "🤒"}</div>
          <div style={{ fontSize:"13px", color: accent, letterSpacing:"3px", textTransform:"uppercase", marginBottom:"6px" }}>
            {isDoctor ? "Doctor Login" : "Patient Login"}
          </div>
          <h2 style={{ fontSize:"26px", fontWeight:"700", color:"#ffffff", margin:"0 0 4px" }}>MUSKAN</h2>
          <p style={{ color:"#718096", fontSize:"13px", margin:0 }}>The Way to Happiness</p>
        </div>

        <form onSubmit={handleLogin}>
          {/* Email */}
          <label style={{ display:"block", fontSize:"12px", fontWeight:"600", color:"#a0aec0", marginBottom:"8px", letterSpacing:"0.5px" }}>EMAIL ADDRESS</label>
          <div style={{ position:"relative", marginBottom:"20px" }}>
            <span style={{ position:"absolute", left:"14px", top:"50%", transform:"translateY(-50%)", fontSize:"15px" }}>✉️</span>
            <input
              type="email" name="email" placeholder="aapka@email.com"
              value={form.email} onChange={handleChange}
              style={{ width:"100%", padding:"13px 16px 13px 42px", borderRadius:"12px", border:`1.5px solid rgba(255,255,255,0.1)`, fontSize:"15px", outline:"none", boxSizing:"border-box", background:"rgba(255,255,255,0.06)", color:"#ffffff" }}
              onFocus={e => e.target.style.border=`1.5px solid ${accent}`}
              onBlur={e => e.target.style.border="1.5px solid rgba(255,255,255,0.1)"}
            />
          </div>

          {/* Password */}
          <label style={{ display:"block", fontSize:"12px", fontWeight:"600", color:"#a0aec0", marginBottom:"8px", letterSpacing:"0.5px" }}>PASSWORD</label>
          <div style={{ position:"relative", marginBottom:"28px" }}>
            <span style={{ position:"absolute", left:"14px", top:"50%", transform:"translateY(-50%)", fontSize:"15px" }}>🔒</span>
            <input
              type="password" name="password" placeholder="••••••••"
              value={form.password} onChange={handleChange}
              style={{ width:"100%", padding:"13px 16px 13px 42px", borderRadius:"12px", border:"1.5px solid rgba(255,255,255,0.1)", fontSize:"15px", outline:"none", boxSizing:"border-box", background:"rgba(255,255,255,0.06)", color:"#ffffff" }}
              onFocus={e => e.target.style.border=`1.5px solid ${accent}`}
              onBlur={e => e.target.style.border="1.5px solid rgba(255,255,255,0.1)"}
            />
          </div>

          {/* Button */}
          <button
            type="submit" disabled={loading}
            style={{ width:"100%", padding:"15px", borderRadius:"12px", border:"none", background: loading ? "#2d4a7a" : btnBg, color:"#fff", fontSize:"16px", fontWeight:"700", cursor: loading?"not-allowed":"pointer", boxShadow: loading?"none":`0 4px 20px rgba(0,168,255,0.3)`, letterSpacing:"0.5px" }}
          >
            {loading ? "⏳ Login ho raha hai..." : `🚀 ${isDoctor ? "Doctor" : "Patient"} Login Karo`}
          </button>

          {error && (
            <div style={{ background:"rgba(197,48,48,0.15)", border:"1px solid rgba(252,129,129,0.3)", borderRadius:"10px", padding:"12px 16px", color:"#fc8181", fontSize:"14px", marginTop:"16px", textAlign:"center" }}>
              ⚠️ {error}
            </div>
          )}
        </form>

        <div style={{ display:"flex", alignItems:"center", gap:"12px", margin:"24px 0" }}>
          <div style={{ flex:1, height:"1px", background:"rgba(255,255,255,0.08)" }} />
          <span style={{ color:"#4a5568", fontSize:"13px" }}>ya</span>
          <div style={{ flex:1, height:"1px", background:"rgba(255,255,255,0.08)" }} />
        </div>

        <div style={{ textAlign:"center", padding:"16px", borderRadius:"12px", border:"1px solid rgba(255,255,255,0.08)", background:"rgba(255,255,255,0.03)" }}>
          <span style={{ color:"#718096", fontSize:"14px" }}>Naya account? </span>
          <span style={{ color: accent, fontWeight:"700", cursor:"pointer", fontSize:"14px" }} onClick={() => navigate("/register")}>
            Register karo →
          </span>
        </div>

        <div style={{ textAlign:"center", marginTop:"28px", color:"rgba(255,255,255,0.15)", fontSize:"11px" }}>
          © 2024 MUSKAN Healthcare • All rights reserved
        </div>
      </div>
    </div>
  );
};

export default Login;