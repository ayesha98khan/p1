import { Link, useNavigate } from "react-router-dom";
import { user } from "../lib/api";

export default function IGShell({ children }) {
  const nav = useNavigate();
  const me = user();

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/feed" className="text-xl font-black tracking-tight">
            JobNest
          </Link>

          <div className="flex items-center gap-3">
            <Link to="/feed" className="text-sm font-semibold">Feed</Link>
            <Link to="/profile" className="text-sm font-semibold">Profile</Link>
            {me?.role === "student" && (
              <Link to="/applications" className="text-sm font-semibold">Tracker</Link>
            )}
            {me?.role === "recruiter" && (
              <Link to="/recruiter" className="text-sm font-semibold">Recruiter</Link>
            )}

            <button
              className="text-sm font-bold px-4 py-2 rounded-full bg-zinc-900 text-white"
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                nav("/auth");
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">{children}</main>
    </div>
  );
}