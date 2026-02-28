import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../lib/api";

export default function Auth() {
  const nav = useNavigate();
  const [mode, setMode] = useState("login");
  const [msg, setMsg] = useState("");

  const [form, setForm] = useState({
    role: "student",
    name: "",
    companyName: "",
    email: "",
    password: "",
  });

  async function submit() {
    try {
      setMsg("");
      const data =
        mode === "login"
          ? await api("/api/auth/login", {
              method: "POST",
              auth: false,
              body: { email: form.email, password: form.password },
            })
          : await api("/api/auth/register", {
              method: "POST",
              auth: false,
              body: form,
            });

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      nav("/feed");
    } catch (e) {
      setMsg(e.message);
    }
  }

  return (
    <div className="min-h-screen grid place-items-center bg-zinc-50 px-4">
      <div className="w-full max-w-sm">
        <div className="bg-white border rounded-2xl p-6 shadow-soft">
          <h1 className="text-3xl font-black text-center">JobNest</h1>
          <p className="text-center text-zinc-500 mt-1">Instagram-style job portal</p>

          <div className="mt-5 flex gap-2">
            <button
              className={`flex-1 py-2 rounded-xl font-semibold ${
                mode === "login" ? "bg-zinc-900 text-white" : "bg-zinc-100"
              }`}
              onClick={() => setMode("login")}
            >
              Login
            </button>
            <button
              className={`flex-1 py-2 rounded-xl font-semibold ${
                mode === "register" ? "bg-zinc-900 text-white" : "bg-zinc-100"
              }`}
              onClick={() => setMode("register")}
            >
              Register
            </button>
          </div>

          {mode === "register" && (
            <div className="mt-4 space-y-3">
              <select
                className="w-full border rounded-xl p-3"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              >
                <option value="student">Student</option>
                <option value="recruiter">Recruiter</option>
              </select>

              <input
                className="w-full border rounded-xl p-3"
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />

              {form.role === "recruiter" && (
                <input
                  className="w-full border rounded-xl p-3"
                  placeholder="Company Name"
                  value={form.companyName}
                  onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                />
              )}
            </div>
          )}

          <div className="mt-4 space-y-3">
            <input
              className="w-full border rounded-xl p-3"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <input
              className="w-full border rounded-xl p-3"
              placeholder="Password"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />

            <button onClick={submit} className="w-full py-3 rounded-xl bg-blue-600 text-white font-bold">
              {mode === "login" ? "Login" : "Create account"}
            </button>

            <div className="text-center">
              <Link className="text-sm text-blue-600 font-semibold" to="/forgot">
                Forgot password?
              </Link>
            </div>

            {msg && <p className="text-sm text-red-600 mt-2">{msg}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}