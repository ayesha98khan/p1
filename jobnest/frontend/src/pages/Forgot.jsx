import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../lib/api";

export default function Forgot() {
  const nav = useNavigate();
  const [step, setStep] = useState(1);
  const [msg, setMsg] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  async function requestOtp() {
    try {
      setMsg("");
      await api("/api/auth/forgot/request-otp", { method: "POST", auth: false, body: { email } });
      setStep(2);
      setMsg("OTP sent. (If SMTP not set, check backend terminal.)");
    } catch (e) {
      setMsg(e.message);
    }
  }

  async function reset() {
    try {
      setMsg("");
      await api("/api/auth/forgot/reset", { method: "POST", auth: false, body: { email, otp, newPassword } });
      nav("/auth");
    } catch (e) {
      setMsg(e.message);
    }
  }

  return (
    <div className="min-h-screen grid place-items-center bg-zinc-50 px-4">
      <div className="w-full max-w-sm bg-white border rounded-2xl p-6 shadow-soft">
        <h2 className="text-2xl font-black text-center">Reset Password</h2>

        {step === 1 ? (
          <div className="mt-5 space-y-3">
            <input className="w-full border rounded-xl p-3" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
            <button className="w-full py-3 rounded-xl bg-zinc-900 text-white font-bold" onClick={requestOtp}>Send OTP</button>
          </div>
        ) : (
          <div className="mt-5 space-y-3">
            <input className="w-full border rounded-xl p-3" placeholder="OTP" value={otp} onChange={(e)=>setOtp(e.target.value)} />
            <input className="w-full border rounded-xl p-3" placeholder="New Password" type="password" value={newPassword} onChange={(e)=>setNewPassword(e.target.value)} />
            <button className="w-full py-3 rounded-xl bg-blue-600 text-white font-bold" onClick={reset}>Update password</button>
          </div>
        )}

        {msg && <p className="text-sm mt-3">{msg}</p>}

        <div className="text-center mt-4">
          <Link className="text-sm text-blue-600 font-semibold" to="/auth">Back to login</Link>
        </div>
      </div>
    </div>
  );
}